import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled as style } from "styled-components";
import { useState, useEffect, use } from 'react';
import { Box, Button, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import React from 'react';

const DrawerContainer = style.div`
    display: flex;
    align-items: center;
    padding: 20px;
    justify-content: center;
`;

const Title = style.p`
    font-size: 24px;
    font-weight: bold;
    color: #44296F;
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

export default function Dashboard() {
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]);
    const [state, setState] = useState({
        left: false
    })
    const [ selectedClass, setSelectedClass ] = useState({} as Course);

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
            <div>
                <h1>{selectedClass.class_name}</h1>
                <p>{selectedClass.class_id}</p>
                <p>{selectedClass.size}</p>
                <p>{selectedClass.capacity}</p>
                <p>{selectedClass.professor}</p>
            </div>
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