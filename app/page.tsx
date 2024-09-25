"use client";

import { RemoveBackground } from '@/lib/removeBackground';
import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner'; // 导入 Toaster 和 toast
import { FileDropzone } from '@/components/FileDropzone'; // 导入 FileDropzone 组件

export default function Homepage() {
  const { isLoadingModel, error, processImage } = RemoveBackground();
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);

  // 处理图像上传后的处理逻辑
  const handleDropFile = async (fileBase64: string) => {
    const processed = await processImage(fileBase64); // 处理图像
    if (processed) {
      setProcessedImageUrl(processed); // 设置处理后的图像 URL
      toast.success('图像处理成功！'); // 成功消息
    } else {
      toast.error('图像处理失败！'); // 失败消息
    }
  };

  // 使用 useEffect 监听 isLoadingModel 和 error
  useEffect(() => {
    if (isLoadingModel) {
      toast('模型加载中...'); // 模型加载提示
    }

    if (error) {
      toast.error(`模型加载错误: ${error.message}`); // 错误消息提示
    }
  }, [isLoadingModel, error]); // 依赖于 isLoadingModel 和 error

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4 sm:px-6 overflow-hidden">
      <Toaster />
      <div className="w-full max-w-md text-center flex flex-col items-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 sm:mb-4">
          Image Processing
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-4 sm:mb-6">
          Upload an image to process it.
        </p>
        <FileDropzone
          onDropFile={handleDropFile}
          processedImageUrl={processedImageUrl || undefined}
        />
      </div>
    </div>

  );

}
