import React, {useContext, useState} from 'react';
import {useLocation, useNavigate} from "react-router";
import arrow from '../assets/left-arrow.svg';
import clockBig from '../assets/clockBig.svg';
import servingsBig from '../assets/servingsBig.svg';
import Ingredients from "../components/Ingredients.jsx";
import Instructions from "../components/Instructions.jsx";
import Carousel from "../components/Carousel.jsx";
import {useDocumentTitle} from "../hooks/documentTitleHook.jsx";
import CommentSection from "../components/commentSection/CommentSection.jsx";
import {HandHeart} from "lucide-react";
import {likeRecipe, unlikeRecipe} from "../utils/likesHelper.js";
import {Context} from "../main.jsx";
import RecipeStore from "../store/RecipeStore.js";
import {observer} from "mobx-react-lite";

// Компонент для отображения информации (время, порции и т.д.)
const InfoCard = ({ icon, value, label }) => (
    <div className='flex flex-col text-center items-center bg-white rounded-xl border border-gray-300 p-3 pl-6 pr-6'>
        <img src={icon} alt={label} />
        <h4 className='font-medium mt-1'>{value}</h4>
        <span className='text-gray-500 text-sm'>{label}</span>
    </div>
);

// Lightbox для увеличения изображения
const Lightbox = ({ image, onClose }) => (
    <div
        className="fixed inset-0 bg-gray-400/70 flex items-center justify-center z-50 p-4"
        onClick={onClose}
    >
        <img
            src={image}
            alt="full"
            className="max-w-full max-h-full rounded-3xl cursor-pointer transition-all top-16"
        />
    </div>
);

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

// Универсальная карточка для Ingredients / Instructions
const Card = ({ children }) => (
    <div className='flex flex-col rounded-xl border border-gray-300 w-full bg-white p-6 leading-none'>
        {children}
    </div>
);

const Recipe = () => {
    const { loadRecipes } = useContext(Context);
    const navigate = useNavigate();
    const location = useLocation();
    const { props } = location.state || {};
    const [lightbox, setLightbox] = useState(null);

    if (!props) {
        return <p className="text-center mt-10">Recipe not found</p>;
    }

    useDocumentTitle(`${props.title} | Recipe Hub`);

    // 👇 Убираем локальное состояние, теперь всё берём из store
    const handleLike = async () => {
        const token = localStorage.getItem("token");
        try {
            if (RecipeStore.isLiked(props.id)) {
                await unlikeRecipe(props.id, token);
                RecipeStore.removeLike(props.id);
            } else {
                await likeRecipe(props.id, token);
                RecipeStore.addLike(props.id);
            }
            // Обновляем глобальный список рецептов
            await loadRecipes(token);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className='bg-gray-100 min-h-screen flex flex-col pt-16'>
            {/* Back Button */}
            <div className='flex space-x-1 pt-6 pl-3 sm:p-6 mb-6'>
                <button
                    className="flex justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all border border-gray-300 bg-white h-9 px-4 py-2 items-center space-x-2 hover:bg-gray-300"
                    onClick={() => navigate('/')}
                >
                    <img src={arrow} alt="back" />
                    <span>Back to Recipes</span>
                </button>
            </div>

            {/* Main Info Section */}
            <div className='grid grid-cols-1 md:grid-cols-2 self-center gap-6 w-full md:max-w-[900px] lg:max-w-[1100px] p-3 sm:p-6 pt-0'>
                <div className="flex flex-row-reverse max-h-[671px] max-w-full md:max-h-[450px] lg:max-h-[436px] overflow-visible">
                    <RecipeImage images={props.image} onClick={setLightbox} />
                    {lightbox && <Lightbox image={lightbox} onClose={() => setLightbox(null)} />}
                </div>

                <div className='flex flex-col items-start justify-start h-full'>
                    <h1 className='text-2xl font-medium'>{props.title}</h1>
                    <p className='mt-3 text-md text-gray-500 leading-none'>{props.description}</p>
                    <span className='mt-3 text-gray-500 text-sm'>by {props.author?.name || "Unknown"}</span>

                    <div className='grid grid-cols-3 mt-6 gap-6 w-full'>
                        <InfoCard icon={clockBig} value={props.totalTime} label="Total Time" />
                        <div className='flex flex-col items-center bg-white rounded-xl border border-gray-300 p-3'>
                            <HandHeart size={24} className='text-black'/>
                            <h4 className='font-medium mt-1'>likes</h4>
                            {/* 👇 Теперь берём из store */}
                            <span className='text-gray-500 text-sm'>
                                {RecipeStore.getLikesCount(props.id)}
                            </span>
                        </div>
                        <InfoCard icon={servingsBig} value={props.servings} label="Servings" />
                    </div>

                    <span className='mt-6 text-gray-500 text-sm'>Prep time: {props.prepTime} minutes</span>
                    <span className='text-gray-500 text-sm'>Cook time: {props.cookTime} minutes</span>
                </div>

                <hr className='text-gray-300 w-full md:block hidden' />
                <hr className='text-gray-300 w-full' />
            </div>

            {/* Ingredients & Instructions */}
            <div className='grid grid-cols-1 md:grid-cols-2 self-center gap-6 w-full md:max-w-[900px] lg:max-w-[1100px] p-3 sm:p-6 pt-0'>
                <Card>
                    <h3 className='mb-6 font-bold'>Ingredients</h3>
                    <ul className='space-y-2 flex flex-col'>
                        {props.ingredients.map((ingredient, index) => (
                            <Ingredients key={index} ingredient={ingredient} />
                        ))}
                    </ul>
                </Card>

                <Card>
                    <h3 className='mb-6 font-bold'>Instructions</h3>
                    <ol className='space-y-4'>
                        {props.instructions.map((instruction, index) => (
                            <Instructions key={index} instruction={instruction} index={index} />
                        ))}
                    </ol>
                </Card>
            </div>

            <CommentSection
                id={props.id}
                handleLike={handleLike}
                liked={RecipeStore.isLiked(props.id)}
            />
        </div>
    );
};

export default observer(Recipe);
