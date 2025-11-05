import React from 'react';

// Универсальная карточка для Ingredients / Instructions
const Card = ({ children }) => {
    return (
        <div className='flex flex-col rounded-xl border border-gray-300 w-full bg-white p-6 leading-none'>
            {children}
        </div>
    );
};

export default Card;