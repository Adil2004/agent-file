import {Navigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import api from "../api";
import {REFRESH_TOKEN, ACCESS_TOKEN} from "../constants";
import {useState, useEffect} from "react";
import type { ReactNode } from "react";

type ProtectedRouteProps = {
    children: ReactNode;
}

type TokenPayLoad = {
    exp: number;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const [isAuthorised, setIsAuthorised] = useState<boolean | null>(null);

    useEffect(() => {
        auth().catch(() => setIsAuthorised(false))
    }, [])

    const refreshToken = async () : Promise<void> => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);

        if (!refreshToken) {
            setIsAuthorised(false);
            return;
        }

        try {
            const res = await api.post("/api/token/refresh", {
                refresh: refreshToken,
            });
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthorised(true);
            } else {
                setIsAuthorised(false);
            }
        } catch {
            setIsAuthorised(false);
        }
    }

    const auth = async () : Promise<void> => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorised(false);
            return;
        }
        try {
            const decoded = jwtDecode<TokenPayLoad>(token);
            const tokenExpiration = decoded.exp;
            const now = Date.now() / 1000;

            if (tokenExpiration < now) {
                await refreshToken();
            } else {
                setIsAuthorised(true);
            }
        } catch {
            setIsAuthorised(false);
        }
    };

    if (isAuthorised === null) {
        return <div>Loading...</div>
    }

    return isAuthorised ? children: <Navigate to ="/" />;
}

export default ProtectedRoute;