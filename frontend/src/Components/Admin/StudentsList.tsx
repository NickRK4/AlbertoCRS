import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../Context/useAuth";
import { Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, tableCellClasses, Button, Checkbox } from "@mui/material";
import { User } from "../../Models/User";
import { styled as muiStyled } from '@mui/material/styles';
import { styled } from "styled-components";
import RegisterStudent from "./RegisterStudent";
import EditStudent from "./EditStudent";
import { Course } from "../../Models/Course";

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px 20px;
    background-color: #F7F7F7;
    overflow-y: hidden;
    height: calc(100vh - 60px);
    overflow-y: auto;
`


const InfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 350px;
    padding: 30px;
    border-radius: 10px;
    background-color:rgb(255, 255, 255);
`;
    
const SearchBar = styled.input`
    margin-right: 10px;
    margin-top: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
`;

const Title = styled.h2`
    font-size: 42px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #2D2D2D;
`;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
`;

const StyledTableCell = muiStyled(TableCell)(({ theme }) => ({
    maxWidth: '100px',
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#6758C8',
        fontWeight: 'bold',
        color: theme.palette.common.white,
        fontSize: 17
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 17,
    },
}));

const StyledTableRow = muiStyled(TableRow)(({ theme }) => ({
    borderRadius: '8px',

    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },

    '&:last-child td, &:last-child th': {
        border: 0,
    },
    '&:hover': {
        cursor: 'pointer',
        backgroundColor: '#EFE6FA',
    },
}));

const StudentModal = ({isOpen, onClose, student, courses} : {isOpen: boolean, onClose: () => void, student: User, courses: Course[]}) => {    
    if (!isOpen) {
        return null;
    }
    const selected = courses.map((course) => <p key={course.class_id}>{course.class_code + ": " + course.class_name}</p>)
        

    return (
        <>
        <Overlay>
            <InfoContainer>
                <Title style={{marginTop: "0px"}}> {student.first_name} {student.last_name}</Title>
                <h3 style={{marginBottom: "0px"}}> Student email: </h3>
                <p> Email: {student.email}</p>
                <h3 style={{marginBottom: "0px"}}> Enrolled in: </h3>
                <div>{selected.length == 0 ? <p>Student hasn't enrolled in any classes</p> : selected}</div>
                <Button onClick={onClose} variant="contained" color="primary" style={{ width: '100px', marginTop: '20px', backgroundColor: '#695ACD' }}>Close</Button>
            </InfoContainer>
        </Overlay>
        </>
    );
}


const DeleteModal = ({isOpen, onClose, success, students} : {isOpen: boolean, onClose: () => void, success: () => void, students: number[]}) => {
    const { token } = useAuth();

    if (!isOpen) {
        return null;
    }

    const handleDelete = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/admin/deleteUser', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    user_ids: students
                })
            });

            if (response.status !== 204) {
                return;
            }

            success();
            onClose();
        } catch (err) {
            console.log(err);
        }
    }


    return (
        <>
        <Overlay>
            <InfoContainer style={{background: "none"}}>
            <Title style={{display: "block", color: "white", marginBottom: "0px"}}> Are you sure you want to delete?</Title>
            <Box style={{marginBottom: "100px"}}> 
            <Button
                onClick={onClose}
                variant="contained" 
                color="primary"
                style={{ width: '100px', marginTop: '20px', backgroundColor: '#695ACD' }}
            >
                Cancel
            </Button>
            <Button 
                onClick={() => {
                    handleDelete();
                    onClose();
                }}
                variant="contained" 
                color="error"
                style={{ width: '100px',marginTop: '20px', marginLeft: '10px' }}
            >
                Delete
            </Button>
            </Box>
            </InfoContainer>
        </Overlay>
        </>
    );
};


export default function StudentsList() {
    const { token } = useAuth();
    const [ students, setStudents ] = useState([]);
    const [ search, setSearch ] = useState("");
    const [ selectedStudents, setSelectedStudents ] = useState<number[]>([]);
    const [ deleteModal, setDeleteModal ] = useState(false);
    const [ infoModal, setInfoModal ] = useState(false);
    const [ editModal, setEditModal ] = useState(false);
    const [ registerModal, setRegisterModal ] = useState(false);
    const [ message, setMessage ] = useState("");
    const [ loading, setLoading ] = useState(false);
    const [ selectedStudent, setSelectedStudent ] = useState<User>({} as User);
    const [studentData, setStudentData] = useState<{courses: Course[], loading: boolean}>({
        courses: [],
        loading: true
    });

    const filteredStudents = useMemo(() => {
        return students.filter((student: User ) => 
            student.first_name.toLowerCase().includes(search.toLowerCase())
            || student.last_name.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, students]);

    students.filter((student: User ) => 
        student.first_name.toLowerCase().includes(search.toLowerCase())
        || student.last_name.toLowerCase().includes(search.toLowerCase())
    );

    const getAllStudents = async () => {
        try {
            setLoading(true);
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
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const fetchStudentData = async (student: User) => {
        setStudentData({ courses: [], loading: true });
        try {
            const res = await fetch(`http://localhost:8000/api/admin/classesByStudent/${student.user_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            setStudentData({ courses: data.classes, loading: false });
            setInfoModal(true);
        } catch (err) {
            console.log(err);
            setStudentData({ courses: [], loading: false });
        }
    };

    // load all the students
    useEffect(() => {
        getAllStudents();
    }, []);

    const handleView = (ID: number) => {
        const selectedStudent = students.find((student: User) => student.user_id === ID);
        if (!selectedStudent) {
            return;
        }

        setSelectedStudent(selectedStudent);
        fetchStudentData(selectedStudent);
    };
    

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }


    if (loading) {
        return (
            <PageContainer>
                <Title>Loading...</Title>
            </PageContainer>
        )
    }

    if (students.length <= 0){
        return (
            <PageContainer>
                <Title>No Registered Students</Title>
                <p>Please register students to begin.</p>
            </PageContainer>
        )
    }

    return (
        <PageContainer>
            <StudentModal isOpen={infoModal} onClose={() => setInfoModal(false)} student={selectedStudent} courses={studentData.courses || students[0]}/>
            <RegisterStudent isOpen={registerModal} onClose={() => setRegisterModal(false)} setMessage={() => {setMessage("Student registered"); setTimeout(() => {setMessage("")}, 3000);} }/>
            <DeleteModal isOpen={deleteModal} onClose={() => setDeleteModal(false)} success={()=>{setMessage("Student deleted"); setTimeout(() => {setMessage("")}, 3000);}} students={selectedStudents}/>
            <EditStudent isOpen={editModal} onClose={() => setEditModal(false)} setMessage={() => {setMessage("Student updated"); setTimeout(() => {setMessage("")}, 3000);} } student={students.find((student: User) => student.user_id === selectedStudents[0]) || students[0]}/>
            <Title> Students </Title>
            <TableContainer sx={{ outline: "1px solid #ccc", borderRadius: "10px", maxWidth: "95%", backgroundColor: "#FFFFFF" }}>
                <Box sx = {{ marginBottom: "10px", display: "flex", justifyContent: "flex-end", width: "100%" }}>
                    <SearchBar onChange={handleChange}type="text" placeholder="Search User"></SearchBar>
                </Box>
                <Box sx = {{maxHeight: "50vh", overflowY: "scroll"}}>
                <Table>
                    <TableHead>
                        <StyledTableRow sx = {{ backgroundColor: "#44296F", color: "white" }  }>
                            <StyledTableCell align="left"></StyledTableCell>
                            <StyledTableCell align="left">First Name</StyledTableCell>
                            <StyledTableCell align="left">Last Name</StyledTableCell>
                            <StyledTableCell align="left">Email Address</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {filteredStudents.map((student : User) => (
                            <StyledTableRow key={student.user_id} 
                            onClick={
                                () => {
                                    if (selectedStudents.includes(student.user_id)) {
                                        setSelectedStudents(selectedStudents.filter((id) => id !== student.user_id));
                                    } else {
                                        setSelectedStudents([...selectedStudents, student.user_id]);
                                    }
                                }
                                }>
                                <StyledTableCell align="left">
                                    <Checkbox 
                                    style={{ color: "#43296E" }}
                                    checked={selectedStudents.includes(student.user_id)}/>
                                </StyledTableCell>
                                <StyledTableCell align="left">{student.first_name}</StyledTableCell>
                                <StyledTableCell align="left">{student.last_name}</StyledTableCell>
                                <StyledTableCell align="left">{student.email}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
                </Box>
                <Box sx = {{ marginTop: "10px", marginBottom: "10px", display: "flex", justifyContent: "flex-end", width: "100%", alignItems: "center" }}>
                    {message && (
                        <p style={{color: "red", margin: 0, marginRight: "10px", alignItems: "center"}}> {message} </p>
                    )}
                    {selectedStudents.length < 1 && <Button style={{ paddingInline: "20px", backgroundColor: "#695ACD", marginRight: "10px", color: "white", boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.3)"}}
                    onClick={() => setRegisterModal(true)}
                    > Register </Button>}

                    <Button style={{paddingInline: "20px", backgroundColor: "#695ACD",marginRight: "10px", color: "white", boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.3)"}}
                    onClick={
                        () => {if (selectedStudents.length === 1) {handleView(selectedStudents[0])}else{setMessage('Must select one student'); setTimeout(() =>{setMessage('');}, 3000);}}}
                        > View</Button>

                    {selectedStudents.length <= 1 && (<Button style={{paddingInline: "20px", backgroundColor: "#695ACD", marginRight: "10px", color: "white", boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.3)"}}
                    onClick={ () => {
                        if (selectedStudents.length === 0) {
                            setMessage('Please select a student to edit'); setTimeout(() =>{setMessage('');}, 3000);} else{setEditModal(true);}}
                        }> Edit </Button>)}
                    <Button style={{paddingInline: "20px", backgroundColor: "#695ACD",marginRight: "20px", color: "white", boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.3)"}}
                    onClick={
                        () => {if (selectedStudents.length > 0) {setDeleteModal(true);}else{setMessage('Please select a user to delete'); setTimeout(() =>{setMessage('');}, 3000);}}}> Delete ({selectedStudents.length})</Button>
                </Box>
            </TableContainer>
        </PageContainer>
    )
}