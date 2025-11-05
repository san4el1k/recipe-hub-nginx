import React from 'react';

// Lightbox для увеличения изображения
const Lightbox = ({ image, onClose }) => (
    <div
        className="fixed inset-0 bg-gray-400/70 flex items-center justify-center z-50 p-4"
        onClick={onClose}
    >
        <img
            src={image}
            alt="full"
            className="max-w-full max-h-full rounded-3xl cursor-pointer transition-all top-16"
        />
    </div>
);

export default Lightbox;