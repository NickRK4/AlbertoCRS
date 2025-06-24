import { useAuth } from "../../Context/useAuth";
import { Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, tableCellClasses } from "@mui/material";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { styled as muiStyled } from '@mui/material/styles';
import { Course } from "../../Models/Course";
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import RegisterClass from "./RegisterClass";
import DropModal from "./DropModal";

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    height = calc(100vh - 60px);
`;

const LeftContainer = styled.div`
    display: flex;
    flex: 0.5;
    justify-content: center;
    margin-right: 5px;
    margin-left: 5px;
`;

const RightContainer = styled.div`
    display: flex;
    flex: 5;
    padding-right: 40px;
`;

const TableAndButton = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;



export default function StudentDashboard(){
    const { user, token } = useAuth();
    const [ classes, setClasses ] = useState<Course[]>([]);
    const [ showClasses, setShowClasses ] = useState(false);
    const [ showDrop, setShowDrop ] = useState(false);
    const [ message, setMessage ] = useState("");

    
    const fetchClasses = async () => {
        try {

            const res = await fetch(`http://localhost:8000/api/admin/classesByStudent/${user?.user_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.status !== 200) {
                throw new Error('Failed to fetch data');
            }
            const data = await res.json();
            if (data.message != "Success") {
                return;
            }

            setClasses(data.classes);
        } catch (error){
            console.log(error);
        }
    }

    useEffect(() => {
        fetchClasses();
    }, []);

    const StyledTableCell = muiStyled(TableCell)(({ theme }) => ({
        color: theme.palette.text.primary,
        maxWidth: '100px',
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: '#695ACD',
            fontWeight: 'bold',
            color: theme.palette.common.white,
            fontSize: 14
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
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

    return (
        <>
        <h1 style= {{color: "#2B2B2B"}}> Welcome back, {user?.first_name} </h1>
        {classes.length === 0 && <p style={{ margin: "0"}}> No classes found, start enrolling! </p>}
        <Container>
        <RegisterClass isOpen={showClasses} onClose={() => setShowClasses(false)} message={(msg: string) => {setMessage(msg); setTimeout(() => {setMessage("")}, 2000);}}/>
        <DropModal isOpen={showDrop} onClose={() => setShowDrop(false)} courses={classes} message={(msg: string) => {setMessage(msg); setTimeout(() => {setMessage("")}, 2000);}}/>
        <LeftContainer>
            <Box sx={{display: "flex", flexDirection: "column", gap: "10px"}}>
                <Button sx = {{backgroundColor: "#695ACD", borderRadius: "10px"}}>
                    <HomeIcon sx = {{color: "white"}}/>
                </Button>
                <Button sx = {{backgroundColor: "#695ACD", borderRadius: "10px"}}
                    onClick={() => setShowClasses(true)}>
                    <AddIcon sx = {{color: "white"}}/>
                </Button>
            </Box>
        </LeftContainer>
        <RightContainer>
            {classes.length > 0 && 
                <TableAndButton>
                <TableContainer sx={{ backgroundColor: "white", borderRadius: "8px", width: "100%" }}>
                    <Table stickyHeader>
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell align="left">Class Code</StyledTableCell>
                                <StyledTableCell align="left">Class Name</StyledTableCell>
                                <StyledTableCell align="left">Professor</StyledTableCell>
                                <StyledTableCell align="left">Size</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {classes.map((course) => (
                                <StyledTableRow key={course.class_id}>
                                    <StyledTableCell align="left">{course.class_code}</StyledTableCell>
                                    <StyledTableCell align="left">{course.class_name}</StyledTableCell>
                                    <StyledTableCell align="left">{course.professor}</StyledTableCell>
                                    <StyledTableCell align="left">{course.size}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "flex-end", width: "100%"}}>
                    <p style={{marginRight: "15px"}}>{message}</p>
                    <Button sx={{maxHeight: "40px", color: "white", marginRight: "15px", backgroundColor: "#695ACD"}}
                        onClick={() => setShowDrop(true)}>Drop</Button>
                </Box>
                </TableAndButton>
            }
        </RightContainer>
        </Container>
        </>
    );
}
