"use client";

import { useState } from "react";
import { removeBg } from "@/lib/ai"; // 导入 removeBg 函数
import { ImageUploadComparison } from "@/components/ImageUploadComparison";
import { toast, Toaster } from "sonner"; // 导入 toast 和 Toaster

export default function Home() {
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    const imageUrl = URL.createObjectURL(file);

    // 调用 removeBg 函数处理图片，并使用 toast 提示
    toast("正在处理图片，请稍候...", {
      duration: 3000, // 设置提示框的显示时长
    });

    try {
      const result = await removeBg(imageUrl);
      setProcessedImage(result); // 保存处理后的图片
      toast.success("图片处理成功！"); // 图片处理成功提示
    } catch (error) {
      console.error("Failed to process image:", error);
      toast.error("图片处理失败，请稍后再试！"); // 错误提示
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <Toaster position="top-center" className="fixed" />
      <h1 className="text-2xl font-semibold mb-4">背景移除工具</h1>
      <p className="text-gray-600 mb-8">上传图片，移除背景并进行对比</p>
      <ImageUploadComparison
        onImageUpload={handleImageUpload}
        processedImageUrl={processedImage}
      />
    </div>
  );
}
