import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled as style } from "styled-components";
import { useState, useEffect, useLayoutEffect } from 'react';
import { Box, Drawer } from '@mui/material';

const DrawerContainer = style.div`
    display: flex;
    flex-direction: column;
    padding: 40px 20px;
`;

const Title = style.h2`
    font-size: 32px;
    font-weight: bold;
    color: #44296F;
    margin-bottom: 20px;
    text-align: left;
    margin-top: 10px;
`;

const TagList = style.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 30px;
`;

const TagItem = style.div`
    display: flex;
    align-items: center;
    background-color: #EFE6FA;
    border-left: 10px solid #44296F;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 14px;
    font-weight: 500;
    color: #333;
`;

const TableContainer = style.div`
    margin-top: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#44296F',
        fontWeight: 'bold',
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    borderRadius: '8px',
    '&:nth-of-type(odd)': {
        // backgroundColor: theme.palette.action.hover,
    },

    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,

    },
    '&:hover': {
        cursor: 'pointer',
        backgroundColor: theme.palette.action.hover,
    },
}));

type Course = {
    class_id: number;
    class_code: number;
    class_name: string;
    size: number;
    capacity: number;
    professor: string;
}

type Anchor = 'top' | 'left' | 'bottom' | 'right';

export default function Dashboard( {setShowNavBar} : {setShowNavBar: React.Dispatch<React.SetStateAction<boolean>>}) {
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]);
    const [state, setState] = useState({
        left: false
    })
    const [ selectedClass, setSelectedClass ] = useState({} as Course);
    const [ students, setStudents ] = useState([]);

    useLayoutEffect(() => {
        setShowNavBar(true);
    }, []);

    const getClassData = async (id: number) => {
        try {
            const res = await fetch(`http://localhost:8000/api/class/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (res.status !== 200) {
                throw new Error('Failed to fetch data');
            }
            const data = await res.json();
            setStudents(data);
            console.log(data);
        } catch (err) {
            console.log(err);
        }
    }


    const getData = async () => {
        //setLoading(true);
        try {
            setLoading(true);
            const res = await fetch('http://localhost:8000/api/courses', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (res.status !== 200) {
                throw new Error('Failed to fetch data');
            }
            const data = await res.json();
            setClasses(data);
            setLoading(false);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    const toggleDrawer =
    (anchor: Anchor, open: boolean, selected : Course) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setState({ ...state, [anchor]: open });
      setSelectedClass(selected);
      getClassData(selected.class_id);
    };

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: "40vw", minWidth: 500 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false, selectedClass)}
      onKeyDown={toggleDrawer(anchor, false, selectedClass)}
    >
        <DrawerContainer>
        {selectedClass && (
            <>
            <Title>{selectedClass.class_name}</Title>
            <TagList>
                <TagItem>Class Code: {selectedClass.class_code}</TagItem>
                <TagItem>Professor: {selectedClass.professor}</TagItem>
                <TagItem>Class Size: {selectedClass.size}</TagItem>
                <TagItem>Capacity: {selectedClass.capacity}</TagItem>
            </TagList>
            <Title>Student List</Title>
            <Table sx={{ }} aria-label="customized table">
            <TableHead>
                <StyledTableRow>
                    <StyledTableCell align="left">First Name</StyledTableCell>
                    <StyledTableCell align="left">Last Name</StyledTableCell>
                    <StyledTableCell align="left">Last Name</StyledTableCell>
                </StyledTableRow>
            </TableHead>
            <TableBody>
                {students.map((student: any) => (
                    <StyledTableRow key={student.email}>
                        <StyledTableCell align="left">{student.first_name}</StyledTableCell>
                        <StyledTableCell align="left">{student.last_name}</StyledTableCell>
                        <StyledTableCell align="left">{student.email}</StyledTableCell>
                    </StyledTableRow>
                ))}
            </TableBody>
            </Table>
            
            </>
        )}
        </DrawerContainer>
    </Box>
  );
    

    // renders the page
    if (loading) {
        return (
            <h1>Loading...</h1>
        )
    }

    return (
        <div>
        <Drawer
            anchor={"left"}
            open={state["left"]}
            onClose={toggleDrawer("left", false, selectedClass)}
        >
            {list("left")}
        </Drawer>
        <TableContainer>
            <Table sx={{ minWidth: 700, maxWidth: 1900, width: '80%' }} aria-label="customized table">
            <TableHead>
                <TableRow>
                    <StyledTableCell>Course ID</StyledTableCell>
                    <StyledTableCell align="left">Course Name</StyledTableCell>
                    <StyledTableCell align="left">Class Size</StyledTableCell>
                    <StyledTableCell align="left">Capacity</StyledTableCell>
                    <StyledTableCell align="left">Professor</StyledTableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {classes.map((course: Course) => (
                    <StyledTableRow onClick={toggleDrawer('left', true, course)} key={course.class_id}>
                        <StyledTableCell align="left">{course.class_id}</StyledTableCell>
                        <StyledTableCell align="left">{course.class_name}</StyledTableCell>
                        <StyledTableCell align="left">{course.size}</StyledTableCell>
                        <StyledTableCell align="left">{course.capacity}</StyledTableCell>
                        <StyledTableCell align="left">{course.professor}</StyledTableCell>
                    </StyledTableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>
        </div>
        );
    };