import { useAuth } from "../../../Context/useAuth"
import AdminDashboard from "../../../Components/Admin/AdminDashboard";
import { useLayoutEffect } from "react";
import StudentDashboard from "../../../Components/Student/StudentDashboard";

export default function Home({setShowNavBar} : {setShowNavBar: React.Dispatch<React.SetStateAction<boolean>>}) {
    const { user } = useAuth();
    useLayoutEffect(() => {
        setShowNavBar(true);
    }, []);

    if (!user) {
        return (<><h1>404 Page Not Found</h1></>);
    }


    return (
        <>
        {user?.user_type === "professor" && 
        <>
            <AdminDashboard />
        </>
        }

        {user?.user_type === "student" && 
        <>
            <StudentDashboard />
        </>
        }
        </>
    )
}