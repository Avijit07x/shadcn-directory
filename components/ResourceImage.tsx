"use client";

interface ResourceImageProps {
  src: string;
  alt: string;
}

export function ResourceImage({ src, alt }: ResourceImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className="object-cover w-full h-full"
      onError={(e) => {
        (e.target as HTMLImageElement).src = 'https://placehold.co/1200x630/000000/ffffff?text=NO+IMAGE&font=mono';
      }}
    />
  );
}
