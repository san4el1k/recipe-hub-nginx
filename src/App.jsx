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

    const loadRecipes = async () => {
        try {
            const res = await fetch("https://recipehubserver-pi.vercel.app/api/recipes");
            const data = await res.json();
            setItems(data);
        } catch (err) {
            console.error("Ошибка загрузки рецептов:", err);
        } finally {
            setIsFetching(false)
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        const savedUser = JSON.parse(localStorage.getItem("user"));

        if (token && savedUser) {
            setIsAuth(true);
            setUser(savedUser);
            setIsAdmin(savedUser.role === "ADMIN");
        }

        setIsLoading(false)
        loadRecipes(); // загружаем один раз при монтировании
    }, []);

    const logout = () => {
        localStorage.removeItem("isAuth");
        localStorage.removeItem('token')
        setIsAuth(false)
        setIsAdmin(false)
        setUser(null)
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
