import React from 'react';
import Carousel from "../Carousel.jsx";

// Компонент для отображения изображения рецепта или карусели
const RecipeImage = ({ images, onClick }) => {
    if (!images || images.length === 0) return null;

    if (images.length > 1) return <Carousel images={images} />;

    return (
        <div className='flex justify-center'>
            <img
                src={images[0]}
                alt="recipe"
                className='rounded-3xl md:rounded-xl cursor-pointer transition-all hover:scale-105'
                onClick={() => onClick(images[0])}
            />
        </div>
    );
};

export default RecipeImage;