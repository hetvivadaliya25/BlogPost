import Lottie from "react-lottie-player"; 
import animationData from "../assets/Error.json"; 
import Navbar from "./Navbar";

export default function NotFound() {
    return (
        <>
            <Navbar />

            {/* Animation in normal flow below Navbar */}
            <div
                style={{
                    textAlign: "center",
                    marginTop: "40px",
                }}
            >
                <Lottie
                    loop
                    play
                    animationData={animationData}
                    style={{ width: "100%", height: "60vh", margin: "0 auto" }}
                />
            </div>

            <div style={{ textAlign: "center", padding: "20px" }}>
                <h1>404 - Page Not Found</h1>
                <p>The page you are looking for does not exist.</p>
            </div>
        </>
    );
}
