import {useState, useEffect} from "react";

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

            <h1>This is home page.</h1>
        </div>
    )
}

export default Home;