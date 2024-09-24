"use client";

import { useImageProcessor } from '@/lib/useImageProcessing';
import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner'; // 导入 Toaster 和 toast
import { FileDropzone } from '@/components/FileDropzone'; // 导入 FileDropzone 组件

export default function Homepage() {
  const { isLoadingModel, error, processImage } = useImageProcessor();
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);

  // 处理图像上传后的处理逻辑
  const handleDropFile = async (fileBase64: string) => {
    const processed = await processImage(fileBase64); // 处理图像
    if (processed) {
      setProcessedImageUrl(processed); // 设置处理后的图像 URL
      toast.success('Image processed successfully!'); // 成功消息
    } else {
      toast.error('Image processing failed!'); // 失败消息
    }
  };

  // 使用 useEffect 监听 isLoadingModel 和 error
  useEffect(() => {
    if (isLoadingModel) {
      toast('Loading model...'); // 模型加载提示
    }

    if (error) {
      toast.error(`Error loading model: ${error.message}`); // 错误消息提示
    }
  }, [isLoadingModel, error]); // 依赖于 isLoadingModel 和 error

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <Toaster /> {/* Toaster 组件 */}
      <h1 className='text-4xl font-bold'>Image Processing</h1>
      <p className='text-lg'>Upload an image to process it.</p>
      <FileDropzone onDropFile={handleDropFile} processedImageUrl={processedImageUrl} />
    </div>
  );
}
