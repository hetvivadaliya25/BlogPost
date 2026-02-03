import { Navigate } from "react-router-dom";
import RootLayout from "../pages/RootLayout";

export default function AuthGuard() {
    const loginData = JSON.parse(localStorage.getItem("loginData"));

    if(!loginData)
    {
        //using replace not add a new entry, overwrite the current one
        return <Navigate to="/login" replace />
    }
    return <RootLayout/>
}