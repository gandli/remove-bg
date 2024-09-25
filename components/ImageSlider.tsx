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
        <ImgComparisonSlider hover={true} className="focus:outline-none">
            <Image
                slot="first"
                src={originalImageUrl}
                alt="Original Image"
                width={1280}
                height={550}
                className="object-contain max-h-[275px]"
            />
            <Image
                slot="second"
                src={processedImageUrl}
                alt="Processed Image"
                width={1280}
                height={550}
                className="object-contain max-h-[275px]"
            />
        </ImgComparisonSlider>
    )
}
