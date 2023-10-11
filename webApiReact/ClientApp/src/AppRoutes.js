
import { Home } from "./components/Home";
import UserReports from "./components/UserReports"
import UserReportInfo from "./components/UserReportInfo"
import Registration from "./components/Registration";
import Login from "./components/Login";

const AppRoutes = [
    {
        index: true,
        element: <Home />
    },
    {
        path: 'api/UserReports',
        element: <UserReports />
    },
    {
        path: 'api/login',
        element: <Login />
    },
    {
        path: 'api/register',
        element: <Registration />
    },
    {
        path: '/UserReport/getInfo/:god/:kvaratl/:k_PRED',
        element: <UserReportInfo />
    }
    
    
];

export default AppRoutes;
