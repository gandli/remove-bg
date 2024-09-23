"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { ImgComparisonSlider } from "@img-comparison-slider/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadComparisonProps {
    originalImage: string;
    width?: string;  // 可选的宽度，Tailwind class 类
    height?: string; // 可选的高度，Tailwind class 类
}

export function ImageUploadComparison({
    originalImage,
    width = "w-full",  // 默认宽度为 100%
    height = "h-96",  // 默认高度为 h-96（等于 24rem）
}: ImageUploadComparisonProps) {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { "image/*": [] },
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                setUploadedImage(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        },
    });

    const resetUpload = () => setUploadedImage(null);

    if (uploadedImage) {
        return (
            <div className="space-y-4">
                <div className={cn("relative mx-auto", width, height)}>
                    <ImgComparisonSlider className="w-full h-full focus:outline-none" hover={true}>
                        <Image
                            slot="first"
                            alt="原始图片"
                            fill
                            src={originalImage}
                            className="w-full h-full object-cover"
                        />
                        <Image
                            slot="second"
                            alt="上传的图片"
                            fill
                            src={uploadedImage}
                            className="w-full h-full object-cover"
                        />
                    </ImgComparisonSlider>
                </div>
                <Button onClick={resetUpload}>重新上传</Button>
            </div>
        );
    }

    return (
        <div
            {...getRootProps()}
            className={cn(
                "relative mx-auto border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer transition-colors hover:border-gray-400 flex justify-center items-center",
                width,
                height
            )}
        >
            <input {...getInputProps()} />
            {isDragActive ? (
                <p className="text-lg text-gray-600">拖放图片到这里 ...</p>
            ) : (
                <p className="text-lg text-gray-600">拖放图片到这里，或点击选择图片</p>
            )}
        </div>
    );
}
