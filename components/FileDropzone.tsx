'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { ImageSlider } from './ImageSlider';
import { toast } from 'sonner';

type FileDropzoneProps = {
    onDropFile: (fileBase64: string) => void;  // Update to pass base64 image
    processedImageUrl?: string; // Parent provides processed image URL
}

export function FileDropzone({ onDropFile, processedImageUrl }: FileDropzoneProps) {
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null); // Store the original image

    // Handle file upload
    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = reader.result as string;
                setOriginalImageUrl(base64String); // Set the original image URL
                onDropFile(base64String);  // Send the base64 image to the parent component
            };
            reader.onerror = (error) => {
                toast.error(`Error converting file to base64: ${error}`);
            };
        });
    }, [onDropFile]);

    // Configure dropzone
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png'],
        },
    });

    return (
        <div
            {...getRootProps()}
            className={cn(
                'w-full h-auto border-2 border-dashed flex justify-center items-center cursor-pointer transition-all duration-200',
                isDragActive ? 'bg-gray-200 border-gray-500' : 'bg-white border-gray-400',
                'sm:w-[640px] sm:h-[275px]' // Restrict size
            )}
        >
            <input {...getInputProps()} />
            {originalImageUrl ? ( // Display the image if originalImageUrl is present
                <ImageSlider
                    originalImageUrl={originalImageUrl}  // Pass the original image to ImageSlider
                    processedImageUrl={processedImageUrl || originalImageUrl} // Pass the processed image or fallback to the original
                />
            ) : (
                <p className="text-gray-600">Drag and drop an image here or click to select a file</p>
            )}
        </div>
    );
}
