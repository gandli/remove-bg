import { AutoModel, AutoProcessor, RawImage, env } from '@xenova/transformers';
import { getGPUTier } from 'detect-gpu';
import { toast } from "sonner";

// 设置环境参数，避免本地模型检查并启用WASM后端代理
env.allowLocalModels = false;
if (env.backends.onnx) {
    env.backends.onnx.wasm = env.backends.onnx.wasm || {}; // 确保 wasm 属性已定义
    env.backends.onnx.wasm.proxy = true;
}

const gpuTier = await getGPUTier();

const modelSettings: Parameters<typeof AutoModel.from_pretrained>[1] = {
    config: { model_type: "custom" },
};

if (gpuTier?.fps && !gpuTier?.isMobile) {
    env.backends.onnx.device = 'webgpu'; // 设置设备为 WebGPU
    env.backends.onnx.dtype = 'fp32';    // 设置精度为 fp32
}

const modelPromise = AutoModel.from_pretrained("briaai/RMBG-1.4", modelSettings);
const processorPromise = AutoProcessor.from_pretrained("briaai/RMBG-1.4", {
    config: {
        do_normalize: true,
        do_pad: false,
        do_rescale: true,
        do_resize: true,
        image_mean: [0.5, 0.5, 0.5],
        feature_extractor_type: "ImageFeatureExtractor",
        image_std: [1, 1, 1],
        resample: 2,
        rescale_factor: 0.00392156862745098,
        size: { width: 1024, height: 1024 },
    },
});

let modelLoaded = false;
let processorLoaded = false;

modelPromise.then(() => {
    modelLoaded = true;
    console.log("模型已加载");
});

processorPromise.then(() => {
    processorLoaded = true;
    console.log("处理器已加载");
});

// 传入 imageUrl 并处理图片
export async function removeBg(url: string) {
    if (!processorLoaded) {
        throw new Error("处理器未加载，请稍后再试。");
    }
    const image = await RawImage.fromURL(url);
    const loadTimeout = setTimeout(() => {
        if (!modelLoaded) {
            toast.info("首次加载模型，可能需要一些时间...");
        }
    }, 3000);

    try {
        const processor = await processorPromise;
        const { pixel_values } = await processor(image);

        const model = await modelPromise;
        const { output } = await model({ input: pixel_values });
        clearTimeout(loadTimeout);

        const mask = await RawImage.fromTensor(output[0].mul(255).to("uint8")).resize(
            image.width,
            image.height,
        );

        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d")!;

        ctx.drawImage(image.toCanvas(), 0, 0);

        const pixelData = ctx.getImageData(0, 0, image.width, image.height);
        for (let i = 0; i < mask.data.length; ++i) {
            pixelData.data[4 * i + 3] = mask.data[i];
        }
        ctx.putImageData(pixelData, 0, 0);

        return canvas.toDataURL();
    } catch (e) {
        console.log("错误:", e);
        toast.error("处理图片时出错，请重试。");
        throw e;
    } finally {
        clearTimeout(loadTimeout);
    }
}

export type ServerFunctions = {
    removeBg: typeof removeBg;
};