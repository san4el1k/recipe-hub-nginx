import {useContext} from 'react';
import {useRoutes} from "react-router";
import {Context} from "../main.jsx";
import {authRoutes, routes} from "../utils/routes.jsx";
import {observer} from "mobx-react-lite";

const AppRouter = observer(() => {
    const {isAuth} = useContext(Context)

    const routing = useRoutes(isAuth ? authRoutes : routes);

    return routing;
})

export default AppRouter;