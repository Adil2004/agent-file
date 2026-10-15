import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import api from "../api";
import "../styles/Dashboard.css"

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
                {username !== null ? (
                    <h3 className="welcome-message">Welcome, {username}!</h3>
                ) : (
                    <h3 className="welcome-message">Welcome!</h3>
                )}
                {files !== null  && (
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Topic</th>
                                <th className="dashboard-table-date">Upload date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {files.map((file) => (
                                <tr className="dashboard-row" key = {file.id} onClick = {() => detailFile(file.id)} >
                                    <td>{file.topic}</td>
                                    <td className="dashboard-row-date">{formatDateTime(file.created_at)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}

export default Dashboard;