import React from 'react';

const Input = ( props ) => {
    return (
        <div className='flex flex-col h-full w-full'>
            <label className='text-base font-medium'>{props.label}</label>
            <input
                defaultValue={props.defaultValue}
                value={props.value}
                onChange={props.onChange}
                required={true}
                type={props.type}
                placeholder={props.placeholder}
                className='pl-3 bg-gray-100 rounded-md mt-1 min-h-9 h-full w-full transition-[color,box-shadow] outline-none md:text-sm focus-visible:ring-[3px] focus-visible:ring-gray-300'
            />
        </div>
    );
};

export default Input;