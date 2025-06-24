import { useAuth } from "../Context/useAuth"
import AdminDashboard from "../Components/Admin/AdminDashboard";
import StudentDashboard from "../Components/Student/StudentDashboard";

export default function Home() {
    const { user } = useAuth();
    if (!user) {
        return (<><h1>404 Not Found</h1></>);
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