'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { ImgComparisonSlider } from '@img-comparison-slider/react'

export function ImageUploadComparison() {
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
        <div
            {...getRootProps()}
            className={cn(
                'w-[1280px] h-[550px] border-2 border-dashed border-gray-400 flex justify-center items-center cursor-pointer transition-all duration-200',
                isDragActive ? 'bg-gray-200' : 'bg-white'
            )}
        >
            <input  {...getInputProps()} />
            {imageUrl ? (
                <ImgComparisonSlider
                    hover={true}
                    className="focus:outline-none"
                >
                    <Image
                        slot="first"
                        src={imageUrl}
                        alt="原始图片"
                        className='max-w-[1280px] max-h-[550px] mx-auto object-contain'
                        width={1280}
                        height={550}
                    />
                    <Image
                        slot="second"
                        src={imageUrl}
                        alt="比较图片"
                        className='max-w-[1280px] max-h-[550px] mx-auto object-contain'
                        width={1280}
                        height={550}
                    />
                </ImgComparisonSlider>
            ) : (
                <p className="text-gray-600">Drag & drop an image here, or click to select one</p>
            )}
        </div>
    )
}
