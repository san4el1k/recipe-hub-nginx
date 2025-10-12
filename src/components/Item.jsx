import React, {useState} from 'react';
import clock from '../assets/clock.svg'
import servings from '../assets/servings.svg'
import {Link} from "react-router";

const Item = ( props ) => {
    const [loaded, setLoaded] = useState(false)

    return (
        <Link
            state={{ props }}
            to={'/recipe/' + props.id}
            className='max-w-[700px] md:max-w-[460px] lg:max-w-[350px] border border-gray-300 rounded-2xl bg-white cursor-pointer transition-all hover:shadow-lg hover:scale-105'
        >
            <div className='relative flex max-h-[393px] lg:max-h-[200px] md:max-h-[256px]'>
                {!loaded && <div className="absolute inset-0 bg-gray-300 animate-pulse rounded-t-2xl"></div>}
                <img
                    src={props.image[0]}
                    alt={props.title}
                    onLoad={() => setLoaded(true)}
                    className={`rounded-t-2xl rounded-tr-2xl object-cover object-center transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                />
            </div>

            <div className='flex flex-col p-6 h-[192px] justify-between'>
                <div>
                    <h4 className='leading-none text-base mt-6'>{props.title}</h4>
                    <p className='mt-3 text-gray-400 line-clamp-2'>{props.description}</p>
                </div>

                <div>
                    <div className='flex items-center justify-between text-sm text-gray-400 mt-6'>
                        <div className='flex items-center space-x-4 '>
                            <div className='flex items-center space-x-1 '>
                                <img src={clock} alt="clock"/>
                                <p>{props.totalTime}</p>
                            </div>
                            <div className='flex items-center space-x-1'>
                                <img src={servings} alt="clock"/>
                                <p>{props.servings}</p>
                            </div>
                        </div>
                        <span>by {props.author.name || 'Unknown'}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default Item;