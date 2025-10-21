import './App.css'
import AppRouter from "./components/AppRouter.jsx";
import NavBar from "./components/NavBar.jsx";
import {BrowserRouter} from "react-router";
import {Context} from "./main.jsx";
import {useEffect, useState} from "react";

function App() {
    const [isAuth, setIsAuth] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [items, setItems] = useState([])
    const [isAdmin, setIsAdmin] = useState(false)
    const [user, setUser] = useState(null)
    const [isFetching, setIsFetching] = useState(true)

    // функция для загрузки рецептов
    const loadRecipes = async (token) => {
        setIsFetching(true);
        try {
            const res = await fetch("https://recipehub.online/api/recipes", {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            const data = await res.json();
            setItems(data);
        } catch (err) {
            console.error("Ошибка загрузки рецептов:", err);
        } finally {
            setIsFetching(false);
        }
    };

    // основной эффект: срабатывает при монтировании и когда токен меняется
    useEffect(() => {
        const token = localStorage.getItem("token");
        const savedUser = JSON.parse(localStorage.getItem("user"));

        if (token && savedUser) {
            setIsAuth(true);
            setUser(savedUser);
            setIsAdmin(savedUser.role === "ADMIN");
        } else {
            setIsAuth(false);
            setUser(null);
            setIsAdmin(false);
        }

        setIsLoading(false);
        loadRecipes(token); // 👈 передаём токен в загрузчик
    }, []); // выполняется один раз при монтировании

    // если хочешь автообновление при логине/логауте:
    useEffect(() => {
        const onStorageChange = () => {
            const token = localStorage.getItem("token");
            const savedUser = JSON.parse(localStorage.getItem("user"));

            if (token && savedUser) {
                setIsAuth(true);
                setUser(savedUser);
                setIsAdmin(savedUser.role === "ADMIN");
            } else {
                setIsAuth(false);
                setUser(null);
                setIsAdmin(false);
            }

            loadRecipes(token); // 👈 перезапрашиваем рецепты при изменении токена
        };

        window.addEventListener("storage", onStorageChange);
        return () => window.removeEventListener("storage", onStorageChange);
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuth(false);
        setIsAdmin(false);
        setUser(null);
        loadRecipes(null); // 👈 перезапрашиваем рецепты без токена
    };

    return (
        <Context.Provider value={{
            isAuth,
            setIsAuth,
            logout,
            isLoading,
            setIsLoading,
            items,
            setItems,
            loadRecipes,
            user,
            setUser,
            isAdmin,
            setIsAdmin,
            isFetching,
        }}>
            <BrowserRouter basename={'/'}>
                {!isLoading && (
                    <>
                        <NavBar/>
                        <AppRouter/>
                    </>
                )}
            </BrowserRouter>
        </Context.Provider>
    )
}

export default App
