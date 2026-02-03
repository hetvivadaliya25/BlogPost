import { Outlet } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";

export default function RootLayout(){
    return(
        <>
        {/* navbar for all pages */}
        <Navbar/>
        {/* define nested routes */}
        <Outlet/>
        {/* footer for all pages */}
        <Footer/>
        </>
    );
};