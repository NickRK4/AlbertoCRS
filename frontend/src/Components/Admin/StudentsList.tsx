import { useEffect, useState } from "react";
import { useAuth } from "../../Context/useAuth";


export default function StudentsList() {
    const { token } = useAuth();
    const [ students, setStudents ] = useState([]);
    
    const getAllStudents = async () => {
        const response = await fetch('http://localhost:8000/api/admin/students', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.status !== 200) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setStudents(data);
    }

    // load all the students
    useEffect(() => {
        getAllStudents();
    }, []);


    return (
        <>
            
        </>
    )
}