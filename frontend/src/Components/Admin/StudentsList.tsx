import { useEffect, useState } from "react";
import { useAuth } from "../../Context/useAuth";
import { Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, tableCellClasses, Button, Checkbox } from "@mui/material";
import { User } from "../../Models/User";
import { styled as muiStyled } from '@mui/material/styles';
import { styled } from "styled-components";
import RegisterStudent from "./RegisterStudent";

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px 20px;
    background-color: #F7F7F7;
    overflow-x: hidden;
    overflow-y: hidden;
    height: 93.4vh;`

const SearchBar = styled.input`
    margin-right: 10px;
    margin-top: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
`;

const Title = styled.h2`
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #44296F;
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
        backgroundColor: '#44296F',
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
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    '&:hover': {
        cursor: 'pointer',
        backgroundColor: theme.palette.action.hover,
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
    const { token } = useAuth();
    const [ students, setStudents ] = useState([]);
    const [ search, setSearch ] = useState("");
    const [ selectedStudents, setSelectedStudents ] = useState<number[]>([]);
    const [ deleteModal, setDeleteModal ] = useState(false);
    const [ registerModal, setRegisterModal ] = useState(false);
    const [ message, setMessage ] = useState("");

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

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    const filteredStudents = students.filter((student: User ) => 
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
            <RegisterStudent isOpen={registerModal} onClose={() => setRegisterModal(false)} />
            <DeleteModal isOpen={deleteModal} onClose={() => setDeleteModal(false)} onDelete={() => handleDelete()} />
            <Title>Registered Students</Title>
            <TableContainer sx={{ outline: "1px solid #ccc", boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)", borderRadius: "10px", maxWidth: "95%" }}>
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
                        <p style={{color: "green", margin: 0, marginRight: "10px", alignItems: "center"}}> {message} </p>
                    )}      
                    <Button style={{paddingInline: "20px", backgroundColor: "#695ACD", marginRight: "10px", color: "white", boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.3)"}}
                    onClick={() => setRegisterModal(true)}> Register </Button>
                    {selectedStudents.length <= 1 && (<Button style={{paddingInline: "20px", backgroundColor: "#695ACD", marginRight: "10px", color: "white", boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.3)"}}> Edit </Button>)}
                    <Button style={{paddingInline: "20px", backgroundColor: "#695ACD",marginRight: "20px", color: "white", boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.3)"}}
                    onClick={
                        () => {if (selectedStudents.length > 0) {setDeleteModal(true);}}}> Delete ({selectedStudents.length})</Button>
                </Box>
            </TableContainer>
            </>
            )}
        </PageContainer>
        </>
    )
}