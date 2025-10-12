import {createContext, StrictMode, useState} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from "./App.jsx";
import {DevSupport} from "@react-buddy/ide-toolbox";
import {ComponentPreviews, useInitial} from "./dev/index.js";

const root = createRoot(document.getElementById('root'));

export const Context = createContext(null)

root.render(
    <StrictMode>
        <DevSupport ComponentPreviews={ComponentPreviews}
                    useInitialHook={useInitial}
        >
            <App/>
        </DevSupport>
    </StrictMode>
)