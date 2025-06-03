import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled as style } from "styled-components";
import { useState, useEffect, useLayoutEffect } from 'react';
import { Box, Drawer, Checkbox } from '@mui/material';
import { Student } from "../Models/User";
import { Course } from "../Models/Course";
import { useAuth } from "../Context/useAuth";

const PageContainer = style.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 20px;
`;

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

const TableTitle = style.h1`
    font-size: 40px;
    font-weight: bold;
    color: #44296F;
    margin-bottom: 20px;
    text-align: left;
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
    width: 90%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const SearchBar = style.input`
    align-self: flex-end;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;`


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    maxWidth: '100px',
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


export default function Dashboard( {setShowNavBar} : {setShowNavBar: React.Dispatch<React.SetStateAction<boolean>>}) {
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]);
    const [state, setState] = useState({
        left: false
    })
    const [ selectedClass, setSelectedClass ] = useState({} as Course);
    const [ students, setStudents ] = useState([] as Student[]);
    const [ selectedClasses, setSelectedClasses ] = useState([] as number[]);
    const [ search, setSearch ] = useState("");
    const { user, token } = useAuth();

    useLayoutEffect(() => {
        setShowNavBar(true);
    }, []);

    const getClassData = async (id: number) => {
        try {
            const res = await fetch(`http://localhost:8000/api/admin/class/${id}`, {
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
            setStudents(data);
        } catch (err) {
            console.log(err);
        }
    }

    const getData = async () => {
        //setLoading(true);
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
            setLoading(false);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredClasses = classes.filter((course: Course) => {
        if (search === "") {
            return true;
        } else {
            return course.class_name.toLowerCase().includes(search.toLowerCase());
        }
    });

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    const handleDrawerClose = () => {
        // blurs everything in the side bar
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        setState({ ...state, left: false });
    }


    useEffect(() => {
        // loads all the classes
        getData();
    }, []);


    // whenever a user clicks on the class
    const handleRowClick = (selected: Course) => {
        setSelectedClass(selected);
        getClassData(selected.class_id);
        if (selectedClasses.length === 0) {
            setTimeout(() => {
            setState({ ...state, left: true });
            }, 40);
        }
    };

    const list = () => (
        <Box
        sx={{ width: "40vw", minWidth: 500 }}
        role="presentation"
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
                {students.length === 0 && <p>No students found for this class</p>}
                {students.length > 0 && (
                <Table sx={{ flexDirection: "column" }} /*aria-label="customized table"*/>
                <TableHead>
                    <StyledTableRow>
                        <StyledTableCell align="left">First Name</StyledTableCell>
                        <StyledTableCell align="left">Last Name</StyledTableCell>
                        <StyledTableCell align="left">Email Address</StyledTableCell>
                    </StyledTableRow>
                </TableHead>
                <TableBody>
                    {students.map((student: Student) => (
                        <StyledTableRow key={student.email}>
                            <StyledTableCell align="left">{student.first_name}</StyledTableCell>
                            <StyledTableCell align="left">{student.last_name}</StyledTableCell>
                            <StyledTableCell align="left">{student.email}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
                </Table>
                )}
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
            <>
                {user?.user_type === "professor" && (
                    <>
                    <PageContainer>
                    <Drawer
                        anchor={"left"}
                        open={state["left"]}
                        onClose={handleDrawerClose}
                    >
                        {list()}
                    </Drawer>
                    <TableContainer>
                        <TableTitle> Course List </TableTitle>
                        <SearchBar
                        onChange={handleSearch}
                        placeholder="Search..." />
                        <Table /*aria-label="customized table"*/>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell></StyledTableCell>
                                <StyledTableCell>Course Code</StyledTableCell>
                                <StyledTableCell align="left">Course Name</StyledTableCell>
                                <StyledTableCell align="left">Class Size</StyledTableCell>
                                <StyledTableCell align="left">Capacity</StyledTableCell>
                                <StyledTableCell align="left">Professor</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredClasses.map((course: Course) => (
                                <StyledTableRow sx={{height: 70}} onClick={() => handleRowClick(course)} key={course.class_id}>
                                    <StyledTableCell> 
                                        <Checkbox
                                        checked={selectedClasses.includes(course.class_id)}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={() => {
                                            if (selectedClasses.includes(course.class_id)) {
                                                setSelectedClasses(selectedClasses.filter((id) => id !== course.class_id));
                                            } else {
                                                setSelectedClasses([...selectedClasses, course.class_id]);
                                            }
                                        }} 
                                    
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell align="left">{course.class_code}</StyledTableCell>
                                    <StyledTableCell align="left">{course.class_name}</StyledTableCell>
                                    <StyledTableCell align="left">{course.size}</StyledTableCell>
                                    <StyledTableCell align="left">{course.capacity}</StyledTableCell>
                                    <StyledTableCell align="left">{course.professor}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </TableContainer>
                    </PageContainer>
                    </>
                    )
                }

                {user?.user_type === "student" && (
                    <>
                    

                    </>
                )}
            </>
        )
    };
