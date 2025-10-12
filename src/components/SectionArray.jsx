import React from "react";
import plus from '../assets/plus.svg'
import cross from '../assets/cross.svg'

// Универсальный блок для массивов (ингредиенты, картинки, инструкции)

const SectionArray = ({
                          label,
                          field,
                          values,
                          onChange,
                          onAdd,
                          onDelete,
                          placeholder,
                          addLabel,
                          isTextarea,
                          withIndex
                      }) => (
    <div className='flex flex-col'>
        <div className='flex justify-between items-center'>
            <label className='text-base font-medium'>{label}</label>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    onAdd(field);
                }}
                className="border border-gray-300 rounded-md text-sm font-medium bg-white h-9 px-4 py-2 hover:bg-gray-300 flex items-center gap-2"
            >
                <img src={plus} alt="plus"/>
                <span>{addLabel}</span>
            </button>
        </div>

        {values.map((val, index) => (
            <div className={`flex items-start gap-4 mt-3 ${withIndex ? 'w-full' : ''}`} key={index}>
                {withIndex && (
                    <span
                        className='flex-shrink-0 w-6 h-6 mt-2 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm'>
                        {index + 1}
                    </span>
                )}
                {isTextarea ? (
                    <textarea
                        value={val}
                        onChange={(e) => onChange(field, index, e.target.value)}
                        placeholder={`${placeholder} ${index + 1}`}
                        required
                        className='pt-2 pl-3 bg-gray-100 rounded-md w-full outline-none focus-visible:ring-[3px] focus-visible:ring-gray-300'
                    />
                ) : (
                    <input
                        value={val}
                        onChange={(e) => onChange(field, index, e.target.value)}
                        placeholder={`${placeholder} ${index + 1}`}
                        required
                        className='pl-3 bg-gray-100 rounded-md h-9 w-full outline-none focus-visible:ring-[3px] focus-visible:ring-gray-300'
                    />
                )}
                {values.length > 1 && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onDelete(field, index);
                        }}
                        className="border border-gray-300 rounded-md text-sm font-medium bg-white h-9 px-4 py-2 hover:bg-gray-300 flex items-center"
                    >
                        <img src={cross} alt="delete"/>
                    </button>
                )}
            </div>
        ))}
    </div>
);

export default SectionArray