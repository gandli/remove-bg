'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { ImgComparisonSlider } from '@img-comparison-slider/react'

export function ImageUploadComparison() {
    const [imageUrl, setImageUrl] = useState<string | null>(null)

    // Handle the drop event to capture the file and create a blob URL
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (!file) return

        const blobUrl = URL.createObjectURL(file) // Create blob URL for preview
        setImageUrl(blobUrl)
    }, [])

    // Cleanup the blob URL to avoid memory leaks
    useEffect(() => {
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl)
            }
        }
    }, [imageUrl])

    // Configure the dropzone
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] }
    })

    return (
        <div
            {...getRootProps()}
            className={cn(
                'w-[1280px] h-[550px] border-2 border-dashed flex justify-center items-center cursor-pointer transition-all duration-200',
                isDragActive ? 'bg-gray-200 border-gray-500' : 'bg-white border-gray-400'
            )}
        >
            <input {...getInputProps()} />
            {imageUrl ? (
                <ImgComparisonSlider hover={true} className="focus:outline-none">
                    <Image
                        slot="first"
                        src={imageUrl}
                        alt="原始图片"
                        className="max-w-[1280px] max-h-[550px] object-contain"
                        width={1280}
                        height={550}
                    />
                    <Image
                        slot="second"
                        src={imageUrl}
                        alt="比较图片"
                        className="max-w-[1280px] max-h-[550px] object-contain"
                        width={1280}
                        height={550}
                    />
                </ImgComparisonSlider>
            ) : (
                <p className="text-gray-600">在此处拖放图片或点击选择图片</p>
            )}
        </div>
    )
}
