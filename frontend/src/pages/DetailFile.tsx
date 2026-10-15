import {useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/DetailFile.css";

type FileData = {
    id: number,
    topic: string;
    created_at: Date;
}

export function formatDateTime(dateTime: Date): string {
    return new Date(dateTime).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

function DetailFile() {
    const {fileId} = useParams();
    const navigate = useNavigate();
    const [username, setUsername] = useState<string | null>(null);
    const [file, setFile] = useState<FileData | null>(null);

    useEffect(() => {
        setUsername(localStorage.getItem("username"));
        api.get(`/api/files/${fileId}/`)
            .then((res) => {
                setFile(res.data);
            })
            .catch((err) => console.log(err));
    }, [fileId])

    const handleClick = (fileId: number): void => {
        navigate(`/files/${fileId}/chat`);
    };

    return (
        <>
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
            <div className="file-detail-container">
                <h1>This is the details of the file.</h1>
                <div className="file-detail">
                    {file !== null && (
                        <div className="file-detail-content">
                            <h3>Topic: {file.topic}</h3>
                            <h3>Upload date: {formatDateTime(file.created_at)}</h3>
                            <button key = {file.id} onClick={() => handleClick(file.id)}>Chat</button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default DetailFile;