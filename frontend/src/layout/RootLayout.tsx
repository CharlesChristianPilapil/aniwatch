import { Outlet, useLocation } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer";
import { useEffect } from "react";

const RootLayout = () => {

    const location = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [location.pathname]);

    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    );
};

export default RootLayout