import axios from "axios";

const API_URL = "https://recipehub.online/api/recipes";

// Получить все рецепты (включая likesCount и liked)
export const getAllRecipes = async (token) => {
    const res = await axios.get(API_URL, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
};

// Поставить лайк
export const likeRecipe = async (recipeId, token) => {
    const res = await axios.post(`${API_URL}/${recipeId}/like`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data.likes;
};

// Убрать лайк
export const unlikeRecipe = async (recipeId, token) => {
    const res = await axios.delete(`${API_URL}/${recipeId}/like`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data.likes;
};
