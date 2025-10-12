import React, {useContext, useState} from 'react';
import Item from "../components/Item.jsx";
import lupa from '../assets/lupa.svg'
import {Context} from "../main.jsx";
import {CircleLoader} from "react-spinners";
import {useDocumentTitle} from "../hooks/documentTitleHook.jsx";

const Main = () => {
    const {items, isFetching} = useContext(Context)
    const [value, setValue] = useState('')

    useDocumentTitle('Discover | Recipe Hub')

    const filteredItems = items
        .filter(item =>
            item.title.toLowerCase().includes(value.toLowerCase()) ||
            item.description.toLowerCase().includes(value.toLowerCase())
        )
        .sort((a, b) => b.id - a.id);

    return (
        <div className='bg-gray-100 min-h-screen flex justify-center'>
            <div className='m-6'>
                <div className='flex flex-col items-center text-center'>
                    <h1 className='text-4xl '>Delicious Recipes</h1>
                    <h2 className='text-xl text-gray-400 mt-2'>Discover amazing recipes from our community</h2>
                </div>

                <div className='flex flex-col gap-6 mt-3 mb-6'>
                    <div className='flex-1 relative flex justify-start items-center '>
                        <img src={lupa} alt="search" className='absolute left-3 top-1/2 transform -translate-y-1/2'/>
                        <input
                            type='text'
                            placeholder='Search recipes, ingredients...'
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            className='pl-10 bg-gray-200 rounded-md mt-1 h-9 w-full transition-[color,box-shadow] outline-none md:text-sm focus-visible:ring-[3px] focus-visible:ring-gray-300'
                        />
                    </div>
                </div>

                <div>
                    {isFetching ? (
                        <div className='flex flex-col items-center text-center mt-6'>
                            <h1 className='text-4xl text-gray-500'>Loading recipes...</h1>
                            <div className="flex items-center justify-center gap-4">
                                <h2 className='text-xl text-gray-400 mt-2'>Chill out for a bit</h2>
                                <CircleLoader loading={true} size={30}/>
                            </div>
                        </div>
                    ) : (
                        <>
                            {filteredItems.length === 0 ? (
                                <div className='flex flex-col items-center text-center mt-6'>
                                    <h2 className='text-3xl text-gray-500'>No recipes found</h2>
                                    <p className='text-2xl text-gray-400'>Try adjusting your search</p>
                                </div>
                            ) : (
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full '>
                                    {filteredItems.map(recipe => (
                                        <Item
                                            id={recipe.id}
                                            key={recipe.id}
                                            image={recipe.image}
                                            title={recipe.title}
                                            description={recipe.description}
                                            totalTime={`${recipe.totalTime} m`}
                                            servings={recipe.servings}
                                            author={recipe.author}
                                            prepTime={recipe.prepTime}
                                            cookTime={recipe.cookTime}
                                            ingredients={recipe.ingredients}
                                            instructions={recipe.instructions}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    <h2 className='text-sm text-gray-400 mt-6 items-center justify-center flex'>
                        Showing {filteredItems.length} of {items.length} recipes
                    </h2>
                </div>
            </div>
        </div>
    );
};

export default Main;
