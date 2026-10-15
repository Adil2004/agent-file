import {useState, useEffect} from "react";
import "../styles/Home.css";

function Home() {
    const [username, setUsername] = useState<string | null>(null);
    useEffect(() => {
        setUsername(localStorage.getItem("username"));
    }, [])
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
            <div className="home-page-text">
                <h1>This is home page.</h1>
                <h2>This web application allows users to upload the PDF file.</h2>
                <h2>Ask questions related to it to integrated AI agent.</h2>
            </div>
        </div>
    )
}

export default Home;