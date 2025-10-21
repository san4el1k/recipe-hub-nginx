import { makeAutoObservable } from "mobx";

class RecipeStore {
    likedRecipes = new Set();
    likesCount = new Map(); // 👈 Добавляем хранение счётчиков лайков
    initialized = false;

    constructor() {
        makeAutoObservable(this);
        // Загружаем из localStorage при инициализации
        const saved = localStorage.getItem('likedRecipes');
        const savedCounts = localStorage.getItem('likesCount');
        
        if (saved) {
            try {
                this.likedRecipes = new Set(JSON.parse(saved));
            } catch (e) {
                console.error('Ошибка загрузки лайков из localStorage:', e);
                this.likedRecipes = new Set();
            }
        }
        
        if (savedCounts) {
            try {
                this.likesCount = new Map(JSON.parse(savedCounts));
            } catch (e) {
                console.error('Ошибка загрузки счётчиков из localStorage:', e);
                this.likesCount = new Map();
            }
        }
    }

    // Инициализация лайков из данных сервера
    initializeLikes(recipes) {
        if (!this.initialized) {
            // Очищаем текущие данные
            this.likedRecipes.clear();
            this.likesCount.clear();
            
            // Добавляем данные из сервера
            recipes.forEach(recipe => {
                if (recipe.liked) {
                    this.likedRecipes.add(recipe.id);
                }
                this.likesCount.set(recipe.id, recipe.likesCount || 0);
            });
            
            this.saveToLocalStorage();
            this.initialized = true;
        }
    }

    addLike(recipeId) {
        this.likedRecipes.add(recipeId);
        // Увеличиваем счётчик
        const currentCount = this.likesCount.get(recipeId) || 0;
        this.likesCount.set(recipeId, currentCount + 1);
        this.saveToLocalStorage();
    }

    removeLike(recipeId) {
        this.likedRecipes.delete(recipeId);
        // Уменьшаем счётчик
        const currentCount = this.likesCount.get(recipeId) || 0;
        this.likesCount.set(recipeId, Math.max(0, currentCount - 1));
        this.saveToLocalStorage();
    }

    isLiked(recipeId) {
        return this.likedRecipes.has(recipeId);
    }

    getLikesCount(recipeId) {
        return this.likesCount.get(recipeId) || 0;
    }

    saveToLocalStorage() {
        localStorage.setItem('likedRecipes', JSON.stringify([...this.likedRecipes]));
        localStorage.setItem('likesCount', JSON.stringify([...this.likesCount]));
    }

    // Очистить при выходе пользователя
    clear() {
        this.likedRecipes.clear();
        this.likesCount.clear();
        this.initialized = false;
        localStorage.removeItem('likedRecipes');
        localStorage.removeItem('likesCount');
    }
}

export default new RecipeStore();