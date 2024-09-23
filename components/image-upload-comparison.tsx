'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { ImgComparisonSlider } from '@img-comparison-slider/react'

export default function ImageUploadComparison() {
    const [imageUrl, setImageUrl] = useState<string | null>(null)

    // Handle the drop event to capture the file and create a blob URL
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0] // Only handle the first file for this example
        if (!file) return
        const blobUrl = URL.createObjectURL(file) // Create blob URL for preview
        setImageUrl(blobUrl)
    }, [])

    // Configure the dropzone
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] } })

    return (
        <div className="flex flex-col items-center p-6">
            <h1 className="text-2xl font-semibold mb-4">Select and Preview Image</h1>

            {/* Combined Dropzone and Image Preview Area */}
            <div
                {...getRootProps()}
                className={cn(
                    'w-[1280px] h-[550px] border-2 border-dashed border-gray-400 flex justify-center items-center cursor-pointer transition-all duration-200',
                    isDragActive ? 'bg-gray-200' : 'bg-white'
                )}
            >
                <input  {...getInputProps()} />
                {imageUrl ? (
                    <ImgComparisonSlider hover={true} className='focus:outline-none' >
                        <img slot="first" src="https://img-comparison-slider.sneas.io/demo/images/before.webp" />
                        <img slot="second" src="https://img-comparison-slider.sneas.io/demo/images/after.webp" />
                        {/* <Image src="https://img-comparison-slider.sneas.io/demo/images/before.webp" slot="before" alt="before" fill className="w-full h-full object-cover" />
                        <Image src="https://img-comparison-slider.sneas.io/demo/images/after.webp" slot="after" alt="after" fill className="w-full h-full object-cover" /> */}
                    </ImgComparisonSlider>
                ) : (
                    // If no image is selected, show the drag & drop text
                    <p className="text-gray-600">Drag & drop an image here, or click to select one</p>
                )}
            </div>
        </div>
    )
}
