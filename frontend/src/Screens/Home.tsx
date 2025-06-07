import { useAuth } from "../Context/useAuth"
import AdminDashboard from "../Components/AdminDashboard";
import { useLayoutEffect } from "react";

export default function Home({setShowNavBar} : {setShowNavBar: React.Dispatch<React.SetStateAction<boolean>>}) {
    const { user } = useAuth();
    useLayoutEffect(() => {
        setShowNavBar(true);
    }, []);


    return (
        <>
        {user?.user_type === "professor" && 
        <>
        <AdminDashboard />
        </>
        }

        {user?.user_type === "student" && 
        <>
        
        </>
        }
        </>
    )
}