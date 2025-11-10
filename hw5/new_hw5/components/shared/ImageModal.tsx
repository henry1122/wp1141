"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  alt?: string;
  imageUrls?: string[]; // 支持多張圖片切換
  currentIndex?: number; // 當前圖片索引
}

export default function ImageModal({ 
  open, 
  onOpenChange, 
  imageUrl, 
  alt, 
  imageUrls,
  currentIndex = 0 
}: ImageModalProps) {
  const [currentIdx, setCurrentIdx] = useState(currentIndex);
  const images = imageUrls && imageUrls.length > 0 ? imageUrls : [imageUrl];
  const hasMultiple = images.length > 1;

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-transparent border-0 shadow-none">
        <div className="relative w-full h-[95vh] flex items-center justify-center">
          {/* 關閉按鈕 */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          {/* 左箭頭 */}
          {hasMultiple && (
            <button
              onClick={handlePrevious}
              className="absolute left-4 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}

          {/* 圖片 */}
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={images[currentIdx]}
              alt={alt || `Image ${currentIdx + 1}`}
              fill
              className="object-contain"
              unoptimized
              priority
            />
          </div>

          {/* 右箭頭 */}
          {hasMultiple && (
            <button
              onClick={handleNext}
              className="absolute right-4 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          )}

          {/* 圖片計數器 */}
          {hasMultiple && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {currentIdx + 1} / {images.length}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

