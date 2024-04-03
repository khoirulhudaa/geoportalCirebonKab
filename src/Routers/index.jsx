import { lazy } from "react";

const Homepage = lazy(() => import('../Pages/'))

const Routers = [
    {
        path: '/',
        component: Homepage,
        exact: true
    }
]

export default Routers