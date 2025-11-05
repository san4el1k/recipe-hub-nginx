import React, {useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router";
import arrow from '../assets/left-arrow.svg';
import clockBig from '../assets/clockBig.svg';
import servingsBig from '../assets/servingsBig.svg';
import Ingredients from "../components/Ingredients.jsx";
import Instructions from "../components/Instructions.jsx";
import {useDocumentTitle} from "../hooks/documentTitleHook.jsx";
import CommentSection from "../components/commentSection/CommentSection.jsx";
import {HandHeart} from "lucide-react";
import {likeRecipe, unlikeRecipe} from "../utils/likesHelper.js";
import {Context} from "../main.jsx";
import RecipeStore from "../store/RecipeStore.js";
import {observer} from "mobx-react-lite";
import RecipeImage from "../components/RecipePage/RecipeImage.jsx";
import Lightbox from "../components/RecipePage/Lightbox.jsx";
import InfoCard from "../components/RecipePage/InfoCard.jsx";
import Card from "../components/RecipePage/Card.jsx";
import axios from "axios";

const Recipe = () => {
    const { loadRecipes } = useContext(Context);
    const navigate = useNavigate();
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lightbox, setLightbox] = useState(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                const response = await axios.get(`https://recipehub.online/api/recipes/${id}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                setRecipe(response.data);
                
                // Синхронизируем данные с RecipeStore
                if (response.data.liked) {
                    RecipeStore.addLike(response.data.id);
                }
            } catch (error) {
                console.error("Failed to fetch recipe:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]);

    useDocumentTitle(recipe ? `${recipe.title} | Recipe Hub` : "Recipe Hub");

    if (loading) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    if (!recipe) {
        return <p className="text-center mt-10">Recipe not found</p>;
    }

    const handleLike = async () => {
        const token = localStorage.getItem("token");
        try {
            if (RecipeStore.isLiked(recipe.id)) {
                await unlikeRecipe(recipe.id, token);
                RecipeStore.removeLike(recipe.id);
            } else {
                await likeRecipe(recipe.id, token);
                RecipeStore.addLike(recipe.id);
            }
            // Обновляем глобальный список рецептов
            await loadRecipes(token);
            
            // Обновляем текущий рецепт
            const response = await axios.get(`https://recipehub.online/api/recipes/${id}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            setRecipe(response.data);
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
                    <RecipeImage images={recipe.image} onClick={setLightbox} />
                    {lightbox && <Lightbox image={lightbox} onClose={() => setLightbox(null)} />}
                </div>

                <div className='flex flex-col items-start justify-start h-full'>
                    <h1 className='text-2xl font-medium'>{recipe.title}</h1>
                    <p className='mt-3 text-md text-gray-500 leading-none'>{recipe.description}</p>
                    <span className='mt-3 text-gray-500 text-sm'>by {recipe.author?.name || "Unknown"}</span>

                    <div className='grid grid-cols-3 mt-6 gap-6 w-full'>
                        <InfoCard icon={clockBig} value={recipe.totalTime} label="Total Time" />
                        <div className='flex flex-col items-center bg-white rounded-xl border border-gray-300 p-3'>
                            <HandHeart size={24} className='text-black'/>
                            <h4 className='font-medium mt-1'>likes</h4>
                            <span className='text-gray-500 text-sm'>
                                {recipe.likesCount}
                            </span>
                        </div>
                        <InfoCard icon={servingsBig} value={recipe.servings} label="Servings" />
                    </div>

                    <span className='mt-6 text-gray-500 text-sm'>Prep time: {recipe.prepTime} minutes</span>
                    <span className='text-gray-500 text-sm'>Cook time: {recipe.cookTime} minutes</span>
                </div>

                <hr className='text-gray-300 w-full md:block hidden' />
                <hr className='text-gray-300 w-full' />
            </div>

            {/* Ingredients & Instructions */}
            <div className='grid grid-cols-1 md:grid-cols-2 self-center gap-6 w-full md:max-w-[900px] lg:max-w-[1100px] p-3 sm:p-6 pt-0'>
                <Card>
                    <h3 className='mb-6 font-bold'>Ingredients</h3>
                    <ul className='space-y-2 flex flex-col'>
                        {recipe.ingredients.map((ingredient, index) => (
                            <Ingredients key={index} ingredient={ingredient} />
                        ))}
                    </ul>
                </Card>

                <Card>
                    <h3 className='mb-6 font-bold'>Instructions</h3>
                    <ol className='space-y-4'>
                        {recipe.instructions.map((instruction, index) => (
                            <Instructions key={index} instruction={instruction} index={index} />
                        ))}
                    </ol>
                </Card>
            </div>

            <CommentSection
                id={recipe.id}
                handleLike={handleLike}
                liked={recipe.liked}
            />
        </div>
    );
};

export default observer(Recipe);
