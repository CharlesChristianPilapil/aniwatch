import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "../slices/authSlice";

const AuthTest = () => {
    const dispatch = useDispatch();

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");

    const handleLogin = async () => {
        console.log("test");
        // try {
        //     const res = await fetch("http://localhost:8000/auth/login", {
        //         method: "POST",
        //         credentials: "include", // ensures cookies (like accessToken) are included
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify({
        //             identifier,
        //             password,
        //         }),
        //     });
        //     const data = await res.json();
        // } catch (err) {
        //     console.error("Login failed", err);
        // }
    };

    const handleOtp = async () => {
        try {
            const res = await fetch("http://localhost:8000/auth/verify", {
                method: "POST",
                credentials: "include", // This allows cookies to be sent
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code, user_id: 21 }),
            });

            const response = await res.json();

            if (!res.ok) {
                console.error(
                    "Verification failed:",
                    response.message || response.message
                );
                return;
            }

            dispatch(setCredentials(response.data));
        } catch (err) {
            console.error("Error verifying OTP:", err);
        }
    };

    return (
        <div className="min-h-screen space-y-10 container flex items-center flex-col justify-center">
            <div className="">
                email or username
                <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                />
                email or username
                <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={() => handleLogin()}> Login </button>
            </div>
            <div>
                code
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                <button onClick={() => handleOtp()}> Verify </button>
            </div>
        </div>
    );
};

export default AuthTest;
