import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import EuroRoundedIcon from "@mui/icons-material/EuroRounded";

import { dashboardData } from "../data/dashboardData";


export const dashboardStats = [
    {
        title: "Socios",
        value: dashboardData.socios,
        icon: <GroupsRoundedIcon color="primary"/>
    },

    {
        title: "Pagados",
        value: dashboardData.socios,
        icon: <PaidRoundedIcon color="success"/>
    },

    {
        title: "Pendientes",
        value: dashboardData.pendientes,
        icon: <WarningAmberRoundedIcon color="warning"/>
    },

    {
        title: "Recaudado",
        value: `${dashboardData.recaudado} €`,
        icon: <EuroRoundedIcon color="primary"/>
    },    

]