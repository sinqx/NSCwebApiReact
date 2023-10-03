import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import UserReports from "./components/UserReports"
import UserReportInfo from "./components/UserReportInfo"

const AppRoutes = [
    {
        index: true,
        element: <Home />
    },
    {
        path: '/counter',
        element: <Counter />
    },
    {
        path: '/fetch-data',
        element: <FetchData />
    },
    {
        path: '/UserReports',
        element: <UserReports />
    },
    {
        path: '/UserReports/getInfo/:god/:k_PRED/:kvartal',
        element: <UserReportInfo />
    }
    

];

export default AppRoutes;
