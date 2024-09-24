import { AutoModel, AutoProcessor, env, RawImage } from "@xenova/transformers";
import { toast } from "sonner"

// 仅在浏览器环境中执行
if (typeof window !== 'undefined') {
    // 确保禁用本地模型
    env.allowLocalModels = false;

    // 启用 WASM 后端防止 UI 冻结
    if (env.backends?.onnx?.wasm) {
        env.backends.onnx.wasm.proxy = true;
    } else {
        console.warn("WASM 后端不可用");
    }
}

class PipelineSingleton {
    static model = 'briaai/RMBG-1.4'; // 模型名称
    static modelInstance: any = null;
    static processorInstance: any = null;

    // 获取模型实例
    static async getModelInstance(progress_callback: Function | undefined = undefined) {
        if (!this.modelInstance) {
            toast.info("正在加载模型...");
            // 将 progress_callback 传递为 undefined 代替 null
            this.modelInstance = await AutoModel.from_pretrained(this.model, { progress_callback });
            toast.success("模型加载完成");
        }
        return this.modelInstance;
    }

    // 获取处理器实例
    static async getProcessorInstance() {
        if (!this.processorInstance) {
            this.processorInstance = await AutoProcessor.from_pretrained(this.model);
        }
        return this.processorInstance;
    }
}


// removeBg 函数，用于图片背景移除
export async function removeBg(imageUrl: string) {
    try {
        // 仅在浏览器环境中执行
        if (typeof window === 'undefined') {
            throw new Error("仅能在客户端中调用此函数");
        }

        // 加载远程图片
        const image = await RawImage.fromURL(imageUrl);

        // 获取模型与处理器实例
        const model = await PipelineSingleton.getModelInstance();
        const processor = await PipelineSingleton.getProcessorInstance();

        // 处理图片
        const { pixel_values } = await processor(image);

        // 进行推理
        const { output } = await model({ input: pixel_values });

        // 返回处理后的结果
        const mask = await RawImage.fromTensor(output[0].mul(255).to("uint8")).resize(
            image.width,
            image.height
        );

        // 在 Canvas 上绘制原图并更新 alpha 通道
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(image.toCanvas(), 0, 0);

        // 获取像素数据并更新 alpha 通道
        const pixelData = ctx.getImageData(0, 0, image.width, image.height);
        for (let i = 0; i < mask.data.length; ++i) {
            pixelData.data[4 * i + 3] = mask.data[i];
        }
        ctx.putImageData(pixelData, 0, 0);

        return canvas.toDataURL(); // 返回处理后的图片数据
    } catch (error) {
        console.error("Error during background removal:", error);
        throw error;
    }
}
