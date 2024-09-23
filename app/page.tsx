import { ImageUploadComparison } from "@/components/image-upload-comparison";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-semibold mb-4">Select and Preview Image</h1>
      <p className="text-gray-600 mb-8">Upload an image to see the comparison with the original</p>
      <ImageUploadComparison />
    </div>
  )
}
