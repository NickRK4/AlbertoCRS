import  { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, tableCellClasses } from "@mui/material";
import { Course } from "../../Models/Course";
import { useAuth } from '../../Context/useAuth';
import { styled as muiStyled } from '@mui/material/styles';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    background-color: white;
    width: 800px;
    padding: 20px;
`;

const ConfirmModal = ({isOpen, onClose, onConfirm} : {isOpen: boolean, onClose: () => void, onConfirm: () => void}) => {
    if (!isOpen) {
        return null;
    }

    return (
        <>
        <Overlay>
        <Box style={{marginBottom: "100px"}}> 
        <h1 style={{display: "block", color: "white", marginBottom: "0px"}}>Confirm Enroll</h1>
        <Button
            onClick={onClose}
            variant="contained" 
            color="primary"
            style={{ width: '100px', marginTop: '20px', backgroundColor: '#695ACD' }}
        >
            Cancel
        </Button>
        <Button 
            onClick={onConfirm}
            variant="contained" 
            color="success"
            style={{ width: '100px',marginTop: '20px', marginLeft: '10px' }}
        >
            Confirm
        </Button>
        </Box>
        </Overlay>
        </>
    );
};


const StyledTableCell = muiStyled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: '#44296F',
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
        '&.selected': {
            backgroundColor: theme.palette.action.selected,
        },
    }));

export default function RegisterClass({ isOpen, onClose, message}: { isOpen: boolean, onClose: () => void, message: (msg: string) => void}) {
    const { user, token } = useAuth();
    const tableRef = useRef<HTMLDivElement>(null);
    const [classes, setClasses] = useState<Course[]>([]);
    const [selectedClass, setSelectedClass] = useState<Course | null>(null);
    const [showConfirm, setConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleEnroll = async () => {
        try {
            const res = await fetch(`http://localhost:8000/api/admin/enroll/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    student_id: user?.user_id,
                    class_id: selectedClass?.class_id
                })
            });
            if (res.status == 201) {
                message('Successfully enrolled');
                setConfirm(false);
                onClose();
            } else{
                message('Failed to enroll.');
                setConfirm(false);
                onClose();
            }
         
        } catch (err) {
            console.log(err);
        }
    }

    const getData = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:8000/api/admin/courses', {
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
            setClasses(data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
        if (tableRef.current && !tableRef.current.contains(event.target as Node)) {
            onClose();
        }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
        }
    }, []);

    if (!isOpen) {
        return null;
    }

    return (
        <>  
        <Overlay>
            <Container ref={tableRef}>
                <ConfirmModal isOpen={showConfirm} onClose={() => setConfirm(false)} onConfirm={() => handleEnroll()} />
                <TableContainer sx={{ borderRadius: "8px", backgroundColor: "white"}}>
                    <Box sx = {{ minHeight: "50vh", overflowY: "scroll" }}>
                    <Table stickyHeader>
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell align="left">Class Code</StyledTableCell>
                                <StyledTableCell align="left">Class Name</StyledTableCell>
                                <StyledTableCell align="left">Professor</StyledTableCell>
                                <StyledTableCell align="left">Class Size</StyledTableCell>
                                <StyledTableCell align="left">Capacity</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {classes.map((course) => (
                                <StyledTableRow
                                 className = {selectedClass?.class_code === course.class_code ? "selected" : ""}
                                 sx={{}} onClick={() => {
                                    if (selectedClass?.class_code === course.class_code) {
                                        setSelectedClass(null);
                                    } else {
                                    setSelectedClass(course);
                                    }}
                                }
                                 key={course.class_code}>
                                    <StyledTableCell align="left">{course.class_code}</StyledTableCell>
                                    <StyledTableCell align="left">{course.class_name}</StyledTableCell>
                                    <StyledTableCell align="left">{course.professor}</StyledTableCell>
                                    <StyledTableCell align="left">{course.size}</StyledTableCell>
                                    <StyledTableCell align="left">{course.capacity}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                    </Box>
                </TableContainer>
                <Box sx={{ width: "100%", justifyContent: "flex-end", display: "flex", marginTop: "20px" }}>
                    <Button sx={{ backgroundColor: "#695ACD" }} variant="contained"
                        onClick={() => {if (selectedClass) setConfirm(true)}}>Enroll</Button>
                </Box>
            </Container>
        </Overlay>
        </>
    )
}
