import React, { useContext, useEffect, useState } from 'react';
import Input from "../components/Input.jsx";
import arrow from "../assets/left-arrow.svg";
import { useLocation, useNavigate } from "react-router";
import { Context } from "../main.jsx";
import { CircleLoader } from "react-spinners";
import { useDocumentTitle } from "../hooks/documentTitleHook.jsx";
import SectionArray from "../components/SectionArray.jsx";

const CreateRecipeForm = () => {
    const { items, setItems, loadRecipes, user } = useContext(Context);
    const navigate = useNavigate();
    const location = useLocation();
    const isCreate = location.pathname === '/create';
    const { id } = location.state || {};
    const token = localStorage.getItem('token');

    // Универсальное состояние
    const [recipeData, setRecipeData] = useState({
        title: '',
        description: '',
        image: [''],
        prepTime: 0,
        cookTime: 0,
        servings: 0,
        ingredients: [''],
        instructions: ['']
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useDocumentTitle(isCreate ? 'Create | Recipe Hub' : 'Edit | Recipe Hub');

    // Универсальные функции для работы с данными
    const handleChangeField = (field, value) => {
        setRecipeData(prev => ({ ...prev, [field]: value }));
    };

    const handleArrayChange = (field, index, value) => {
        const newArr = [...recipeData[field]];
        newArr[index] = value;
        setRecipeData(prev => ({ ...prev, [field]: newArr }));
    };

    const handleArrayAdd = (field) => {
        setRecipeData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
    };

    const handleArrayDelete = (field, index) => {
        setRecipeData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    // Заполнение данными при редактировании
    useEffect(() => {
        if (!isCreate) {
            if (items.length === 0) {
                loadRecipes();
            }
            const recipe = items.find((item) => item.id === id);
            if (recipe) {
                setRecipeData({
                    title: recipe.title || '',
                    description: recipe.description || '',
                    image: recipe.image || [''],
                    prepTime: recipe.prepTime || 0,
                    cookTime: recipe.cookTime || 0,
                    servings: recipe.servings || 0,
                    ingredients: recipe.ingredients || [''],
                    instructions: recipe.instructions || ['']
                });
            }
        } else {
            setRecipeData({
                title: '',
                description: '',
                image: [''],
                prepTime: 0,
                cookTime: 0,
                servings: 0,
                ingredients: [''],
                instructions: ['']
            });
        }
    }, [isCreate, items, id]);

    // Сабмиты
    const submitForm = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch('https://recipehub.online/api/recipes', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...recipeData,
                    servings: Number(recipeData.servings),
                    prepTime: Number(recipeData.prepTime),
                    cookTime: Number(recipeData.cookTime),
                    totalTime: Number(recipeData.prepTime) + Number(recipeData.cookTime),
                    author: user.name
                })
            });

            if (res.ok) {
                const createdRecipe = await res.json();
                setItems(prev => [...prev, createdRecipe]);
                loadRecipes();
                navigate('/dashboard');
            } else {
                console.error('ERROR:', res.status, await res.text());
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const submitEditForm = async (id) => {
        setIsSubmitting(true);

        try {
            const res = await fetch(`https://recipehub.online/api/recipes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...recipeData,
                    servings: Number(recipeData.servings),
                    prepTime: Number(recipeData.prepTime),
                    cookTime: Number(recipeData.cookTime),
                    totalTime: Number(recipeData.prepTime) + Number(recipeData.cookTime)
                })
            });

            if (res.ok) {
                loadRecipes();
                navigate('/dashboard');
            } else {
                console.error('ERROR:', res.status, await res.text());
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='bg-gray-100 min-h-screen flex flex-col items-center justify-start p-3 sm:p-6 w-screen pt-22 sm:pt-22'>
            <div className='flex space-x-1 mb-6 self-start'>
                <button
                    className="flex justify-center gap-2 rounded-md text-sm font-medium border border-gray-300 bg-white h-9 px-4 py-2 hover:bg-gray-300 "
                    onClick={() => navigate('/dashboard')}
                >
                    <img src={arrow} alt="back"/>
                    <span>Back to Dashboard</span>
                </button>
            </div>

            <form
                className={`flex flex-col p-3 sm:p-6 gap-6 bg-white border border-gray-300 rounded-2xl w-full md:w-[720px] lg:w-[980px] ${isSubmitting && 'opacity-50'}`}
            >
                {/* Заголовок */}
                <div>
                    <h4 className='leading-none text-base font-medium'>
                        {isCreate ? 'Create New Recipe' : 'Edit Recipe'}
                    </h4>
                    <p className='text-gray-500 text-base pt-1'>
                        {isCreate ? 'Add a new recipe to share with others' : 'Update your recipe'}
                    </p>

                    <div className='h-16 mt-6'>
                        <Input
                            value={recipeData.title}
                            onChange={(e) => handleChangeField('title', e.target.value)}
                            placeholder='Enter recipe title'
                            label='Recipe Title *'
                        />
                    </div>

                    <div className='h-25 mt-3'>
                        <div className='flex flex-col h-full'>
                            <label className='text-base font-medium'>Description *</label>
                            <textarea
                                value={recipeData.description}
                                onChange={(e) => handleChangeField('description', e.target.value)}
                                required
                                placeholder='Describe your recipe'
                                className='pt-2 pl-3 bg-gray-100 rounded-md mt-1 h-full w-full outline-none focus-visible:ring-[3px] focus-visible:ring-gray-300'
                            />
                        </div>
                    </div>
                </div>

                {/* Картинки */}
                <SectionArray
                    label="Image URL *"
                    field="image"
                    values={recipeData.image}
                    onChange={handleArrayChange}
                    onAdd={handleArrayAdd}
                    onDelete={handleArrayDelete}
                    placeholder="https://example.com/image.jpg"
                    addLabel="Add Image"
                />

                {/* Время и порции */}
                <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                    <Input
                        value={recipeData.prepTime}
                        onChange={(e) => handleChangeField('prepTime', e.target.value)}
                        placeholder={0}
                        label='Prep Time (min)'
                        type='number'
                    />
                    <Input
                        value={recipeData.cookTime}
                        onChange={(e) => handleChangeField('cookTime', e.target.value)}
                        placeholder={0}
                        label='Cook Time (min)'
                        type='number'
                    />
                    <Input
                        value={recipeData.servings}
                        onChange={(e) => handleChangeField('servings', e.target.value)}
                        placeholder={0}
                        label='Servings'
                        type='number'
                    />
                </div>

                {/* Ингредиенты */}
                <SectionArray
                    label="Ingredients *"
                    field="ingredients"
                    values={recipeData.ingredients}
                    onChange={handleArrayChange}
                    onAdd={handleArrayAdd}
                    onDelete={handleArrayDelete}
                    placeholder="Ingredient"
                    addLabel="Add Ingredient"
                />

                {/* Инструкции */}
                <SectionArray
                    label="Instructions *"
                    field="instructions"
                    values={recipeData.instructions}
                    onChange={handleArrayChange}
                    onAdd={handleArrayAdd}
                    onDelete={handleArrayDelete}
                    placeholder="Step"
                    addLabel="Add Step"
                    isTextarea
                    withIndex
                />

                {/* Кнопки */}
                <div className='flex ms-auto gap-3'>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/dashboard');
                        }}
                        className="border border-gray-300 rounded-md text-sm font-medium bg-white h-9 px-4 py-2 hover:bg-gray-300 "
                    >
                        Cancel
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            isCreate ? submitForm(e) : submitEditForm(id);
                        }}
                        className="text-white rounded-md text-sm font-medium bg-gray-900 h-9 px-4 py-2 hover:bg-gray-700 flex items-center gap-2"
                    >
                        {isSubmitting
                            ? <CircleLoader color='white' loading={isSubmitting} size={25}/>
                            : <span>{isCreate ? 'Create Recipe' : 'Save Changes'}</span>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateRecipeForm;
