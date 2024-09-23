import { ImageUploadComparison } from "@/components/image-upload-comparison";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8">
      <main className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          抠图工具
        </h1>

        <ImageUploadComparison originalImage="/images/after.webp" />

        <p className="mt-4 text-sm text-gray-600 text-center">
          上传图片后，左右滑动以比较原始图片和上传的图片
        </p>
      </main>
    </div>
  );
}
