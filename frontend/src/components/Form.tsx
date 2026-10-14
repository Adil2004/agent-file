import {useState} from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import {ACCESS_TOKEN, REFRESH_TOKEN} from "../constants";
import type { FormEvent } from "react";

type FormProps = {
    route: string;
    method: "login" | "register";
}

function Form({route, method}: FormProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        try {
            const res = await api.post(route, {username, password});

            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                localStorage.setItem("username", username);
                navigate("/");
            } else {
                navigate("/login");
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert("An unexpected error occurred.");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>{name}</h1>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <button type="submit">{name}</button>
        </form>
    );
}

export default Form