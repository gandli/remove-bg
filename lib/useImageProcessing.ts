"use client"

import { AutoModel, AutoProcessor, PreTrainedModel, Processor, RawImage, env } from '@huggingface/transformers';
import { useCallback, useEffect, useRef, useState } from 'react';

export function useImageProcessor() {
    const [isLoadingModel, setIsLoadingModel] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const modelRef = useRef<PreTrainedModel | null>(null);
    const processorRef = useRef<Processor | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const model_id = "briaai/RMBG-1.4";

                // 强制使用 WASM (WebAssembly) 作为设备
                env.backends.onnx.wasm.proxy = false;

                // 加载模型和处理器，指定为 "wasm" 设备
                modelRef.current = await AutoModel.from_pretrained(model_id, { device: "wasm" });
                processorRef.current = await AutoProcessor.from_pretrained(model_id);

                setIsLoadingModel(false);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err);
                }
                setIsLoadingModel(false);
            }
        })();
    }, []);

    const processImage = useCallback(async (imageUrl: string): Promise<string | null> => {
        try {
            const model = modelRef.current;
            const processor = processorRef.current;
            if (!model || !processor) {
                throw new Error("Model or processor not loaded");
            }

            // 读取图像
            const img = await RawImage.fromURL(imageUrl);

            // 处理图像配置
            const config = {
                do_normalize: true,
                do_pad: false,
                do_rescale: true,
                do_resize: true,
                image_mean: [0.5, 0.5, 0.5],
                image_std: [1, 1, 1],
                resample: 2,
                rescale_factor: 0.00392156862745098,
                size: { width: 1024, height: 1024 },
            };

            // 使用处理器处理图像
            const { pixel_values } = await processor(img, config);

            // 进行推理
            const { output } = await model({ input: pixel_values });

            // 处理输出图像
            const maskData = (await RawImage.fromTensor(output[0].mul(255).to("uint8")).resize(img.width, img.height)).data;

            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(img.toCanvas(), 0, 0);
                const pixelData = ctx.getImageData(0, 0, img.width, img.height);
                for (let i = 0; i < maskData.length; ++i) {
                    pixelData.data[4 * i + 3] = maskData[i]; // 更新 alpha 通道
                }
                ctx.putImageData(pixelData, 0, 0);
            }
            return canvas.toDataURL("image/png");
        } catch (error) {
            console.error("Error processing image:", error);
            return null;
        }
    }, []);

    return {
        isLoadingModel,
        error,
        processImage,
    };
}
