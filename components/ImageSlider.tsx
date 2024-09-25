// components/ImageSlider.tsx

'use client'

import Image from 'next/image'
import { ImgComparisonSlider } from '@img-comparison-slider/react'

interface ImageSliderProps {
    originalImageUrl: string;
    processedImageUrl: string;
}

export function ImageSlider({ originalImageUrl, processedImageUrl }: ImageSliderProps) {
    return (
        <ImgComparisonSlider hover={true} className="focus:outline-none w-full h-full">
            <Image
                slot="first"
                src={originalImageUrl}
                alt="Original Image"
                className="object-cover h-[275px]"
                width={1280}
                height={550}
            />
            <Image
                slot="second"
                src={processedImageUrl}
                alt="Processed Image"
                className="object-cover h-[275px]"
                width={1280}
                height={550}
            />
        </ImgComparisonSlider>
    )
}
