import React from 'react';

const Ingredients = ({ ingredient }) => {
    return (
            <li className='flex items-center space-x-2 justify-start'>
                <span className='w-2 h-2 bg-gray-900 rounded-full flex-shrink-0'></span>
                <span>{ingredient}</span>
            </li>
    );
};

export default Ingredients;