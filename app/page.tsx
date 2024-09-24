"use client";

import { useState } from "react";
import { removeBg } from "@/lib/ai"; // 导入 removeBg 函数
import ImageUploadComparison from "@/components/ImageUploadComparison";

export default function Home() {
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    const imageUrl = URL.createObjectURL(file);

    // 调用 removeBg 函数处理图片
    try {
      const result = await removeBg(imageUrl);
      setProcessedImage(result); // 保存处理后的图片
    } catch (error) {
      console.error("Failed to process image:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-semibold mb-4">
        背景移除工具
      </h1>
      <p className="text-gray-600 mb-8">
        上传图片，移除背景并进行对比
      </p>
      <ImageUploadComparison
        onImageUpload={handleImageUpload}
        processedImageUrl={processedImage}
      />
    </div>
  );
}
