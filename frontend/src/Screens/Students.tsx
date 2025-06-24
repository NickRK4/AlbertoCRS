import StudentsList from "../Components/Admin/StudentsList"
import { useAuth } from "../Context/useAuth";

export default function Students() {
    const { user } = useAuth();

    if (!(user?.user_type === "professor")) {
        return (<><h1>404 Not Found</h1></>);
    }

    return (
        <>
            <StudentsList/>
        </>
    )
}