import { AutoModel, AutoProcessor, env, RawImage } from "@huggingface/transformers";
import { toast } from "sonner";
import { getGPUTier } from 'detect-gpu';

// 设置 Hugging Face 环境配置
env.allowLocalModels = false;
env.backends.onnx.wasm.proxy = true;

async function loadModelAndProcessor() {
    const gpuTier = await getGPUTier();
    const modelSettings: Parameters<typeof AutoModel.from_pretrained>[1] = {
        config: { model_type: "custom" },
    };

    // 判断是否使用 WebGPU 和 FP32 精度
    if (gpuTier?.fps && !gpuTier?.isMobile) {
        modelSettings.device = "webgpu";
        modelSettings.dtype = "fp32";
    }

    // 使用 Promise.all 并行加载模型和处理器
    const [model, processor] = await Promise.all([
        AutoModel.from_pretrained("briaai/RMBG-1.4", modelSettings),
        AutoProcessor.from_pretrained("briaai/RMBG-1.4", {
            config: {
                do_normalize: true,
                do_pad: false,
                do_rescale: true,
                do_resize: true,
                image_mean: [0.5, 0.5, 0.5],
                feature_extractor_type: "ImageFeatureExtractor",
                image_std: [1, 1, 1],
                resample: 2,
                rescale_factor: 0.00392156862745098, // 1/255
                size: { width: 1024, height: 1024 },
            },
        })
    ]);

    return { model, processor };
}

const { model: loadedModel, processor: loadedProcessor } = await loadModelAndProcessor();

export async function removeBg(url: string) {
    const image = await RawImage.fromURL(url);

    let loadTimeout: NodeJS.Timeout | undefined;
    if (!loadedModel || !loadedProcessor) {
        loadTimeout = setTimeout(() => {
            toast.info("正在加载模型，这可能需要一点时间...");
        }, 3000);
    }

    try {
        const processor = loadedProcessor;
        const model = loadedModel;

        // 处理图像
        const { pixel_values } = await processor(image);

        // 预测图像的透明度蒙版
        const { output } = await model({ input: pixel_values });

        // 清理定时器
        if (loadTimeout) clearTimeout(loadTimeout);

        // 将蒙版的大小调整回原始图像大小
        const mask = await RawImage.fromTensor(output[0].mul(255).to("uint8")).resize(
            image.width,
            image.height,
        );

        // 创建 Canvas 进行图像处理
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d")!;

        // 绘制原始图像到 Canvas
        ctx.drawImage(image.toCanvas(), 0, 0);

        // 获取图像数据并更新 Alpha 通道
        const pixelData = ctx.getImageData(0, 0, image.width, image.height);
        const maskData = mask.data;

        // 优化：减少不必要的多次属性访问，减少循环内部的计算
        const data = pixelData.data;
        for (let i = 0; i < maskData.length; ++i) {
            data[4 * i + 3] = maskData[i];  // 更新 Alpha 值
        }

        // 更新画布的图像数据
        ctx.putImageData(pixelData, 0, 0);

        // 返回 Base64 格式的图像数据
        return canvas.toDataURL();
    } catch (error) {
        if (loadTimeout) clearTimeout(loadTimeout);
        console.error("移除背景时出错:", error);
        toast.error("处理图像时出现问题");
        throw error;
    }
}

export type ServerFunctions = {
    removeBg: typeof removeBg;
};
