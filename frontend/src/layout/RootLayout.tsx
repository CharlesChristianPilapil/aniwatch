import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect } from "react";
import Snackbar from "../components/Snackbar";

const RootLayout = () => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [location.pathname]);

    return (
        <>
            <Snackbar toastOptions={{ removeDelay: 2000 }} />
            <Navbar />
            <Outlet />
            <Footer />
        </>
    );
};

export default RootLayout;
