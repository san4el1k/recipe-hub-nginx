import {Navigate} from "react-router";
import Recipe from "../pages/Recipe.jsx";
import Main from "../pages/Main.jsx";
import Auth from "../pages/Auth.jsx";
import CreateRecipeForm from "../pages/CreateRecipeForm.jsx";
import Dashboard from "../pages/Dashboard.jsx";

export const authRoutes = [
    {
        path: '/',
        element: <Main />,
    },
    {
        path: '/recipe/:id',
        element: <Recipe />,
    },
    {
        path: '/create',
        element: <CreateRecipeForm />,
    },
    {
        path: '/edit/:id',
        element: <CreateRecipeForm />,
    },
    {
        path: '/dashboard',
        element: <Dashboard />,
    },
    {
        path: '/*',
        element: <Navigate to={ '/' } replace={true} />,
    },
]

export const routes = [
    {
        path: '/',
        element: <Main />,
    },
    {
        path: '/recipe/:id',
        element: <Recipe />,
    },
    {
        path: '/login',
        element: <Auth />,
    },
    {
        path: '/registration',
        element: <Auth />,
    },
    {
        path: '/*',
        element: <Navigate to={'/'} replace={true}/>,
    },
]