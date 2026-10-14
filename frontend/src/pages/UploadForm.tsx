import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import type { ChangeEvent, FormEvent } from "react";

function UploadForm() {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string | null>(null);
    const [topic, setTopic] = useState("");
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        setUsername(localStorage.getItem("username"));
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (!topic.trim() || !file) {
            return;
        }

        const formData = new FormData();
        formData.append("topic", topic);
        formData.append("file", file);

        try {
            await api.post("/api/upload-file/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            navigate("/dashboard");
        } catch (err) {
            console.error("Upload failed", err);
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const selectedFile = e.target.files?.[0] ?? null;
        setFile(selectedFile);
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
            <h1>This is the upload form page.</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Topic"
                    required
                />
                <input type="file" accept="application/pdf" onChange={handleFileChange} required />
                <button type="submit">Upload</button>
            </form>
        </div>
    );
}

export default UploadForm;