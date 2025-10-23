import React, {useContext} from 'react';
import clock from '../assets/clock.svg';
import servings from '../assets/servings.svg';
import edit from "../assets/edit.svg";
import deletee from "../assets/delete.svg";
import {Context} from "../main.jsx";
import {Link} from "react-router";
import {CircleLoader} from "react-spinners";
import {motion} from "framer-motion";
import {HandHeart} from "lucide-react";

const DashboardItem = (props) => {
    const { items } = useContext(Context);
    const recipe = items.find(item => item.id === props.id);

    if (!recipe) return null; // безопасно на случай, если рецепт уже удалён

    return (
        <motion.div
            layout
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: props.loading ? 0.5 : 1, height: "auto", marginBottom: 12 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex p-3 justify-between items-start w-full border border-gray-300 rounded-xl bg-white shadow-sm overflow-hidden`}
        >
            <div className='flex-1'>

                {/*кнопки для телефона */}
                <div className='flex items-center justify-between w-full mb-3'>
                    <Link to={`/edit/${props.id}`} state={{ id: props.id, index: props.index }}>
                        <button
                            className="sm:hidden justify-center border border-gray-300 gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-white h-9 px-4 py-2 flex items-center space-x-2 hover:bg-gray-300"
                        >
                            <img src={edit} alt="edit"/>
                            <span>Edit</span>
                        </button>
                    </Link>

                    <button
                        disabled={props.loading}
                        onClick={() => {
                            if (confirm('Are you sure you want to delete this recipe?')) {
                                props.deleteRecipe(props.id)
                            }
                        }}
                        className="sm:hidden justify-center border border-gray-300 gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-white h-9 px-4 py-2 flex items-center space-x-2 hover:bg-gray-300"
                    >
                        <img src={deletee} alt="delete"/>
                        {props.loading ? (
                            <CircleLoader size={25} loading={true} color={'red'}/>
                        ) : (
                            <span className='text-red-500'>Delete</span>
                        )}
                    </button>
                </div>

                <h4 className='leading-none text-base font-medium'>{recipe.title}</h4>
                <p className='text-gray-500 text-base font-normal mt-2'>{recipe.description}</p>
                <div className='flex gap-4 text-gray-500 mt-3'>
                    <div className='flex space-x-1'>
                        <img src={clock} alt="clock"/>
                        <span>{recipe.totalTime} m</span>
                    </div>
                    <div className='flex space-x-1'>
                        <img src={servings} alt="servings"/>
                        <span>{recipe.servings}</span>
                    </div>
                    <div className='flex space-x-1 items-center'>
                        <HandHeart  size={16} className='text-gray-500'/>
                        <span>{recipe.likesCount}</span>
                    </div>
                </div>
                <div className='flex text-gray-500 mt-3'>
                    <span>by {props.author.name || 'Unknown'}</span>
                </div>
            </div>

            <div className='grid grid-cols-1 md:flex md:flex-row gap-3 '>
                <Link to={`/edit/${props.id}`} state={{ id: props.id, index: props.index }}>
                    <button
                        className="sm:flex justify-center border w-full border-gray-300 gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-white h-9 px-4 py-2 hidden items-center space-x-2 hover:bg-gray-300"
                    >
                        <img src={edit} alt="edit"/>
                        <span>Edit</span>
                    </button>
                </Link>

                <button
                    disabled={props.loading}
                    onClick={() => {
                        if (confirm('Are you sure you want to delete this recipe?')) {
                            props.deleteRecipe(props.id)
                        }
                    }}
                    className="sm:flex justify-center border border-gray-300 gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-white h-9 px-4 py-2 hidden items-center space-x-2 hover:bg-gray-300"
                >
                    <img src={deletee} alt="delete"/>
                    {props.loading ? (
                        <CircleLoader size={25} loading={true} color={'red'}/>
                    ) : (
                        <span className='text-red-500'>Delete</span>
                    )}
                </button>
            </div>
        </motion.div>
    );
};

export default DashboardItem;
