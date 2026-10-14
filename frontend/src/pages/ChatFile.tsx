import {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import type { ChangeEvent, FormEvent } from "react";
import api from "../api";


type ChatResponse = {
    answer: string;
}

function ChatFile() {
    const [username, setUsername] = useState<string | null>(null);
    const [message, setMessage] = useState<string>("");
    const {fileId} = useParams();
    const [response, setResponse] = useState<string>("");

    useEffect(() => {
        setUsername(localStorage.getItem("username"));
    }, [])

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (!message.trim()) {
            return;
        }

        const formData = new FormData();
        formData.append("message", message);

        try {
            const res = await api.post<ChatResponse>(
                `/api/files/${fileId}/chat`,
                { message }
            );

            setResponse(res.data.answer);
        } catch (err) {
            console.error("AI Agent Chat failed", err);
        }
    };
    
    return (
        <div>
            <ul className="navbar">
                <div className="navbar-left">
                    <li><a href="/">Home</a></li>
                </div>
                <div className="navbar-center">
                    <li><a href="/dashboard/">Dashboard</a></li>
                    {username !== null && (
                        <li><a href="/upload-file/">Upload file</a></li>
                    )}
                </div>
                <div className="navbar-right">
                    {username !== null ? (
                        <li><a href="/logout">Logout</a></li>
                    ): (
                        <>
                            <li><a href="register">Register</a></li>
                            <li><a href="login">Login</a></li>
                        </>
                    )}
                </div>
            </ul>
            <h1>This is chatfile page.</h1>
            <a href="/dashboard">Dashboard</a>
            <form onSubmit = {handleSubmit}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="message"
                    required
                />
                <button type="submit">Ask AI Agent</button>
            </form>

            {response !== "" && (
                <>
                    <h2>Ai Answer</h2>
                    <p>{response}</p>
                </>
            )}
        </div>
    )
}

export default ChatFile;