import React from 'react';

// Компонент для отображения информации (время, порции и т.д.)
const InfoCard = ({ icon, value, label }) => (
    <div className='flex flex-col text-center items-center bg-white rounded-xl border border-gray-300 p-3 pl-6 pr-6'>
        <img src={icon} alt={label} />
        <h4 className='font-medium mt-1'>{value}</h4>
        <span className='text-gray-500 text-sm'>{label}</span>
    </div>
);

export default InfoCard;