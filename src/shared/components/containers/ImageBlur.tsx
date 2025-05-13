import { useState, useMemo } from "react";

interface BlurImageProps {
  src: string;
  blurSrc?: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: "eager" | "lazy";
  decoding?: "async" | "auto" | "sync";
  priority?: boolean;
  isIcon?: boolean;
}

const defaultBlurSrc =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4IDgiPjxwYXRoIGZpbGw9IiNjY2MiIGQ9Ik0wIDBoOHY0aC00eiIvPjxwYXRoIGZpbGw9IiNlZWUiIGQ9Ik04IDhoLTR2LTRoNHoiLz48L3N2Zz4=";

const BlurImage = ({
  src,
  blurSrc = defaultBlurSrc,
  alt,
  className = "",
  width,
  height,
  loading = "lazy",
  decoding = "async",
  priority = false,
  isIcon = false,
}: BlurImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Generate srcSet automatically if width is provided
  const srcSet = useMemo(() => {
    if (!width) return undefined;
    return `${src}?w=${width}&q=75 1x, ${src}?w=${width * 2}&q=50 2x`;
  }, [src, width]);

  if (isIcon) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
      />
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Blurred placeholder - using inline SVG or tiny image */}
      <img
        src={blurSrc}
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
        style={{
          filter: "blur(20px)",
          transform: "scale(1.1)",
        }}
      />

      {/* Actual image */}
      <img
        src={error ? blurSrc : src}
        srcSet={srcSet}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : loading}
        decoding={decoding}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          contentVisibility: "auto",
        }}
      />
    </div>
  );
};

export default BlurImage;
