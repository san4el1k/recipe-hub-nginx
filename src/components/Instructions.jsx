import React from 'react';

const Instructions = ({ instruction, index }) => {

    return (
        <li className='flex space-x-3 items-center'>
            <span className='flex-shrink-0 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm'>
                {index + 1}
            </span>
            <span>{instruction}</span>
        </li>
    );
};

export default Instructions;