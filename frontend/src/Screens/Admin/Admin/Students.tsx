import { useLayoutEffect } from "react";
import StudentsList from "../../../Components/Admin/StudentsList"

export default function Students({setShowNavBar} : {setShowNavBar: React.Dispatch<React.SetStateAction<boolean>>}) {
    useLayoutEffect(() => {
            setShowNavBar(true);
        }, []);
    return (
        <>
            <StudentsList />
        </>
    )
}