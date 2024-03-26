import { lazy } from "react";

const Homepage = lazy(() => import('../Pages'))

interface routerProps {
    path: string,
    component: React.FC<{}>,
    exact: boolean
}

const Routers: routerProps[] = [
    {
        path: '/',
        component: Homepage,
        exact: true
    }
]

export default Routers