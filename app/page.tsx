'use client'

import { ImageUploadComparison } from '@/components/ImageUploadComparison'

export default function HomePage() {

  return (
    <div className="relative flex flex-col items-center p-6">
      <h1 className="text-2xl font-semibold mb-4">选择并预览图片</h1>
      <ImageUploadComparison />
    </div >
  );
}