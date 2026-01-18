const ImagePlaceholder = ({ className = "" }) => (
    <div className={`bg-gray-200 dark:bg-gray-600 flex items-center justify-center ${className}`}>
        <svg className="w-1/2 h-1/2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
    </div>
);

export default ImagePlaceholder;