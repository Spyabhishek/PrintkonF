import { useState } from "react";

const Image = ({
    src,
    alt,
    fallbackSrc = '/images/placeholder-product.jpg',
    className = '',
    ...props
}) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleError = () => {
        if (!imageError) {
            setImageError(true);
        }
    };

    const handleLoad = () => {
        setImageLoaded(true);
    };

    const imageSource = imageError ? fallbackSrc : (src || fallbackSrc);

    return (
        <img
            src={imageSource}
            alt={alt}
            className={`${className} ${!imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
            onError={handleError}
            onLoad={handleLoad}
            loading="lazy"
            {...props}
        />
    );
};

export default Image;