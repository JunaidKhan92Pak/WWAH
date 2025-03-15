"use client";
import React, { useState } from "react";
import Image from "next/image";

type ImageWithLoaderProps = {
    src: string;
    alt: string;
    sizes: string;
    className?: string;
};

const Spinner: React.FC = () => (
    <svg className="w-8 h-8 text-gray-500 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        ></path>
    </svg>
);

const ImageWithLoader: React.FC<ImageWithLoaderProps> = ({ src, alt, sizes, className }) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <div >
            <Image
                src={src}
                alt={alt}
                fill
                sizes={sizes}
                className={`${className} transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
                onLoadingComplete={() => setLoaded(true)}
            />
            {!loaded && (
                <div className="absolute inset-0 flex justify-center items-center bg-gray-100">
                    <Spinner />
                </div>
            )}
        </div>
    );
};

export default ImageWithLoader;
