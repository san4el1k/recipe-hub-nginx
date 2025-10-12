import React, {useContext, useEffect, useMemo, useState} from 'react';
import DashboardItem from "../components/DashboardItem.jsx";
import plusW from "../assets/plusW.svg";
import {useNavigate} from "react-router";
import {Context} from "../main.jsx";
import {CircleLoader} from "react-spinners";
import {useDocumentTitle} from "../hooks/documentTitleHook.jsx";
import {AnimatePresence} from "framer-motion";

const Dashboard = () => {
    const navigate = useNavigate();
    const {items, setItems, loadRecipes, isAdmin, user, isFetching} = useContext(Context);
    const [isSubmittingId, setIsSubmittingId] = useState(null);

    useDocumentTitle('Dashboard | Recipe Hub');

    const deleteRecipe = async (id) => {
        setIsSubmittingId(id);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`https://recipehubserver-pi.vercel.app/api/recipes/${id}`, {
                method: 'DELETE',
                headers: {'Authorization': `Bearer ${token}`}
            });

            if (res.ok) {
                // можно оставить только это — и не перегружать loadRecipes
                setItems(prev => prev.filter(item => item.id !== id));
            } else {
                const errText = await res.text();
                console.error('ERROR:', res.status, errText);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmittingId(null);
        }
    };

    useEffect(() => {
        loadRecipes();
    }, []);

    // подготовка списка для отображения
    const visibleRecipes = useMemo(() => {
        const list = isAdmin
            ? items
            : items.filter(item => item.authorId === user.id);
        return [...list].sort((a, b) => b.id - a.id);
    }, [items, isAdmin, user.id]);

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-start p-6 w-screen">
            <div className="flex flex-col gap-6 w-full max-w-[1100px]">
                <div className="flex justify-between">
                    <div>
                        <h1 className="text-3xl font-medium">Admin Dashboard</h1>
                        <span className="mt-3 text-md text-gray-500">Manage your recipes</span>
                    </div>

                    <button
                        onClick={() => navigate('/create')}
                        className="justify-center text-white gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-gray-900 h-9 px-4 py-2 has-[>svg]:px-3 flex items-center space-x-2 hover:bg-gray-700"
                    >
                        <img src={plusW} alt="plus"/>
                        <span>Create Recipe</span>
                    </button>
                </div>

                <div className="bg-white border border-gray-300 rounded-2xl p-6">
                    <div>
                        <h4 className="leading-none text-base font-medium">Your Recipes</h4>
                        <p className="text-gray-500 text-base font-normal pt-1">
                            {visibleRecipes.length} recipes created
                        </p>
                    </div>

                    {isFetching ? (
                        <div className="flex flex-col items-center text-center">
                            <h1 className="text-4xl text-gray-500">Loading recipes...</h1>
                            <div className="flex items-center justify-center gap-4">
                                <h2 className="text-xl text-gray-400 mt-2">Chill out for a bit</h2>
                                <CircleLoader loading size={30}/>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col mt-6 gap-3">
                            <AnimatePresence>
                                {visibleRecipes.map((recipe, index) => (
                                    <DashboardItem
                                        key={recipe.id}
                                        loading={isSubmittingId === recipe.id}
                                        deleteRecipe={deleteRecipe}
                                        index={index}
                                        id={recipe.id}
                                        author={recipe.author}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
