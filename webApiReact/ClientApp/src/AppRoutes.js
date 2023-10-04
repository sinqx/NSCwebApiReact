
import { Home } from "./components/Home";
import UserReports from "./components/UserReports"
import UserReportInfo from "./components/UserReportInfo"

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
        path: '/UserReport/getInfo/:god/:kvartal/:k_PRED',
        element: <UserReportInfo />
    }
    
    
];

export default AppRoutes;
