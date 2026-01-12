import { useEffect } from "react";
import { useLocation } from "react-router-dom";


const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // 1. Reset global window scroll
        window.scrollTo(0, 0);

        // 2. Reset dashboard main container scroll
        // The DashboardLayout uses a scrollable <main> element with id="dashboard-main"
        const dashboardMain = document.getElementById("dashboard-main");
        if (dashboardMain) {
            dashboardMain.scrollTo(0, 0);
        }
    }, [pathname]);

    return null;
};

export default ScrollToTop;
