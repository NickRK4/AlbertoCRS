import { createContext, useEffect, useState } from "react";
import { User } from "../Models/User";
import { useNavigate } from "react-router-dom";
import { loginAPI } from "../Services/AuthServices";
import React from "react";

type UserContextType = {
    user: User | null;
    token: string | null;
    loginUser: (username: string, password: string) => void;
    logout: () => void;
    isLoggedIn: () => boolean;
};

type Props = { children: React.ReactNode };
const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (user && token) {
            setUser(JSON.parse(user));
            setToken(token);
        }
        setIsReady(true);
    }, []);

    const loginUser = async ( 
        email: string,
        password: string 
    ) => {
        try{
            const response = await loginAPI(email, password);
            if (response?.data?.token) {
                // save the token from the response
                const token = response.data.token;
                localStorage.setItem("token", token);
                setToken(token);
                
                // take the payload and parse it
                const base64Payload = token.split('.')[1];
                const payload = JSON.parse(atob(base64Payload));
                                
                const userData = {
                    first_name: payload.firstName,
                    last_name: payload.lastName,
                    email: payload.email,
                    user_type: payload.user_type
                };
                localStorage.setItem("user", JSON.stringify(userData));
                setUser(userData);
                navigate("/home");
            }
        } catch (err){
            console.log(err);
        }
    }

    const isLoggedIn = () => {
        return !!token;
    };
    
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        navigate("/");
    };

    return (
        <UserContext.Provider value={{ user, token, loginUser, logout, isLoggedIn }}>
            {isReady ? children : null}
        </UserContext.Provider>
    );
};

export const useAuth = () => React.useContext(UserContext);