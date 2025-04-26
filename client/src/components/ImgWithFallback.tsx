import { useState, useEffect, memo } from 'react';

type ImgWithFallbackProps = {
  src: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
};

function ImgWithFallback({
  src,
  fallbackSrc,
  alt,
  className = '',
  width,
  height,
  ...props
}: ImgWithFallbackProps & Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'width' | 'height'>) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Atualizar src se prop mudar
  useEffect(() => {
    setImgSrc(src);
  }, [src]);
  
  // Handlers otimizados
  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
    setIsLoading(false);
  };
  
  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={`relative ${className}`} style={{ aspectRatio: width && height ? `${width} / ${height}` : 'auto' }}>
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D0D14] to-[#1E1E2A] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-t-transparent border-[#00A3FF] rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={imgSrc || src}
        onError={handleError}
        onLoad={handleLoad}
        alt={alt}
        className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        loading="lazy"
        width={width}
        height={height}
        {...props}
      />
    </div>
  );
}

// Memoizar para evitar re-renders desnecessários
export default memo(ImgWithFallback);