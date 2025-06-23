import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../Context/useAuth";
import { Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, tableCellClasses, Button, Checkbox } from "@mui/material";
import { User } from "../../Models/User";
import { styled as muiStyled } from '@mui/material/styles';
import { styled } from "styled-components";
import RegisterStudent from "./RegisterStudent";
import EditStudent from "./EditStudent";

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px 20px;
    background-color: #F7F7F7;
    overflow-y: hidden;
    height: calc(100vh - 60px);
    overflow-y: auto;`

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
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
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


const DeleteModal = ({isOpen, onClose, onDelete} : {isOpen: boolean, onClose: () => void, onDelete: () => void}) => {
    if (!isOpen) {
        return null;
    }

    return (
        <>
        <Overlay>
            <Title style={{display: "block", color: "white", marginBottom: "0px"}}>Are you sure you want to delete?</Title>
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
                    onDelete();
                    onClose();
                }}
                variant="contained" 
                color="error"
                style={{ width: '100px',marginTop: '20px', marginLeft: '10px' }}
            >
                Delete
            </Button>
            </Box>
        </Overlay>
        </>
    );
};



export default function StudentsList() {
    const { user, token } = useAuth();
    const [ students, setStudents ] = useState([]);
    const [ search, setSearch ] = useState("");
    const [ selectedStudents, setSelectedStudents ] = useState<number[]>([]);
    const [ deleteModal, setDeleteModal ] = useState(false);
    const [ editModal, setEditModal ] = useState(false);
    const [ registerModal, setRegisterModal ] = useState(false);
    const [ message, setMessage ] = useState("");
    const [ loading, setLoading ] = useState(false);

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

    // load all the students
    useEffect(() => {
        getAllStudents();
    }, []);

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

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

    const handleDelete = async () => {
        const response = await fetch('http://localhost:8000/api/admin/deleteUser', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                user_ids: selectedStudents
            })
        });

        if (response.status === 200) {
            getAllStudents();
            setSelectedStudents([]);
            setMessage('Users deleted');
            setTimeout(() =>{
                setMessage('');
            }, 3000);
        }
    }

     if (user?.user_type !== "professor") {
        return (
            <>
            <Title>404 Not Found</Title>
            </>
        )
    }

    if (loading) {
        return (
            <PageContainer>
                <Title>Loading...</Title>
            </PageContainer>
        )
    }

    if (students.length === 0){
        return (
            <PageContainer>
                <Title>No Registered Students</Title>
                <p>Please register students to begin.</p>
            </PageContainer>
        )
    }

    return (
        <>
        <PageContainer>
        {students.length > 0 && (
            <>
            <RegisterStudent isOpen={registerModal} onClose={() => setRegisterModal(false)} setMessage={() => {setMessage("Student registered"); setTimeout(() => {setMessage("")}, 3000);} }/>
            <DeleteModal isOpen={deleteModal} onClose={() => setDeleteModal(false)} onDelete={() => handleDelete()}/>
            <EditStudent isOpen={editModal} onClose={() => setEditModal(false)} setMessage={() => {setMessage("Student updated"); setTimeout(() => {setMessage("")}, 3000);} } student={students.find((student: User) => student.user_id === selectedStudents[0]) || students[0]}/>
            <Title> Students ({filteredStudents.length}) </Title>
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
                    onClick={() => setRegisterModal(true)}> Register </Button>}
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
            </>
            )}
        </PageContainer>
        </>
    )
}