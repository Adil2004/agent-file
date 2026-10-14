import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import api from "../api";
import "../styles/Dashboard.css"

type FileData = {
    id: number,
    topic: string;
    created_at: Date;
}

function Dashboard() {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string | null>(null);
    const [files, setFiles] = useState<FileData[] | null>(null);

    useEffect(() => {
        setUsername(localStorage.getItem("username"));
        api.get('/api/dashboard/')
            .then((res) => {
                setFiles(res.data);
            })
            .catch((err) => console.log(err));
    }, [])

    const detailFile = (fileId: number): void => {
        navigate(`/files/${fileId}`);
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

            <div className="dashboard-container">
                {username !== null && (
                    <p>Welcome, {username}</p>
                )}
                <h3>This is the dashboard</h3>
                {files !== null  && (
                    <>
                        {files.map((file) => (
                            <div key = {file.id} onClick = {() => detailFile(file.id)} >
                                <h1>{file.topic} {file.created_at.toLocaleString()}</h1>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </>
    );
}

export default Dashboard;