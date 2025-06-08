import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled as style } from "styled-components";
import { useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Drawer, Checkbox, Card, CardContent, Typography, Button, TableContainer } from '@mui/material';
import { Student } from "../../Models/User";
import { Course } from "../../Models/Course";
import { useAuth } from "../../Context/useAuth";
import RegisterClass from './RegisterClass';
import RegisterStudent from './RegisterStudent';
import { useNavigate } from 'react-router-dom';

const PageContainer = style.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 20px;
  background-color: #F7F7F7;
  overflow-x: hidden;
  overflow-y: hidden;
  height: 93.4vh;
`;

const DrawerContainer = style.div`
    display: flex;
    flex-direction: column;
    padding: 40px 20px;
`;

const ContentContainer = style.div`
    margin-top: 15px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 100px;
    width: 90%;
`;

const TableAndCardsContainer = style.div`
    display: flex;
    flex-direction: column;
    flex: 1;
`;

const SummaryCardsContainer = style.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 20px;
`;

const ActionMenuContainer = style.div`
    background-color: #FFFFFF;
    border-radius: 10px;
    padding: 16px;
    margin-right: 110px;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    width: 250px;
    margin-top: 20px;
`;

const ChartAndActionsContainer = style.div`
    display: flex;
    margin-top: -10px;
    flex-direction: column;
    align-items: center;
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
    text-align: center;
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

const SearchBar = style.input`
    align-self: flex-end;
    margin-top: 10px;
    margin-right: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
`;

const PieChartContainer = style.div`
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

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
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    '&:hover': {
        cursor: 'pointer',
        backgroundColor: theme.palette.action.hover,
    },
}));

export default function Dashboard() {
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState<Course[]>([]);
    const [state, setState] = useState({ left: false });
    const [selectedClass, setSelectedClass] = useState<Course>({} as Course);
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedClasses, setSelectedClasses] = useState<number[]>([]);
    const [search, setSearch] = useState("");
    const { user, token } = useAuth();
    const [showRegisterStudent, setShowRegisterStudent] = useState(false);
    const [showRegisterClass, setShowRegisterClass] = useState(false);
    const navigate = useNavigate();

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
    };

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

    const filteredClasses = classes.filter((course) =>
        search === "" || course.class_name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    const handleDrawerClose = () => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        setState({ ...state, left: false });
    };

    useEffect(() => {
        getData();
    }, []);

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
        <Box sx={{ width: "40vw", minWidth: 500 }} role="presentation">
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
                            <TableContainer sx={{ borderRadius: "8px", maxHeight: "50vh", overflowY: "scroll" }}>
                                <Table>
                                    <TableHead>
                                        <StyledTableRow>
                                            <StyledTableCell align="left">First Name</StyledTableCell>
                                            <StyledTableCell align="left">Last Name</StyledTableCell>
                                            <StyledTableCell align="left">Email Address</StyledTableCell>
                                        </StyledTableRow>
                                    </TableHead>
                                    <TableBody>
                                        {students.map((student) => (
                                            <StyledTableRow key={student.email}>
                                                <StyledTableCell align="left">{student.first_name}</StyledTableCell>
                                                <StyledTableCell align="left">{student.last_name}</StyledTableCell>
                                                <StyledTableCell align="left">{student.email}</StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </>
                )}
            </DrawerContainer>
        </Box>
    );

    if (loading) {
        return <h1>Loading...</h1>;
    }

    return (
        <PageContainer>
            <Drawer anchor="left" open={state["left"]} onClose={handleDrawerClose}>
                {list()}
            </Drawer>

            <RegisterStudent isOpen={showRegisterStudent} onClose={() => setShowRegisterStudent(false)} />
            <RegisterClass isOpen={showRegisterClass} onClose={() => setShowRegisterClass(false)} />

            <Title style={{ fontSize: "42px", marginTop: "20px", marginBottom: "0" }}>Welcome back, {user?.first_name}</Title>

            <ContentContainer>
                <TableAndCardsContainer>
                    <SummaryCardsContainer>
                        <Card sx={{ minWidth: 150, display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <CardContent>
                                <Typography variant="h3" color="#43296E" fontSize="32px">0</Typography>
                                <Typography fontWeight="bold" color="#43296E" fontSize="16px">Classes</Typography>
                            </CardContent>
                        </Card>
                        <Card sx={{ minWidth: 150, display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <CardContent>
                                <Typography variant="h3" color="#43296E" fontSize="32px">0</Typography>
                                <Typography fontWeight="bold" color="#43296E" fontSize="16px">Students</Typography>
                            </CardContent>
                        </Card>
                        <Card sx={{ minWidth: 150, display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <CardContent>
                                <Typography variant="h3" color="#43296E" fontSize="32px">0</Typography>
                                <Typography fontWeight="bold" color="#43296E" fontSize="16px">Professors</Typography>
                            </CardContent>
                        </Card>
                        <Card sx={{ minWidth: 150, display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <CardContent>
                                <Typography variant="h3" color="#43296E" fontSize="32px">0</Typography>
                                <Typography fontWeight="bold" color="#43296E" fontSize="16px">Empty Classes</Typography>
                            </CardContent>
                        </Card>
                    </SummaryCardsContainer>

                    <TableContainer sx={{ borderRadius: "10px", boxShadow: 1, maxHeight: 660, maxWidth: 1200 }}>
                        <TableTitle style={{ marginBottom: "10px" }}>Course List</TableTitle>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, width: '100%' }}>
                            <SearchBar onChange={handleSearch} placeholder="Search..." />
                        </Box>
                        <Box sx = {{maxHeight: 450, overflowY: "scroll"}}> 
                        <Table stickyHeader>
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
                                {filteredClasses.map((course) => (
                                    <StyledTableRow sx={{ height: 70 }} onClick={() => handleRowClick(course)} key={course.class_id}>
                                        <StyledTableCell>
                                            <Checkbox
                                                style={{ color: '#43296E' }}
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
                        </Box>
                        {filteredClasses.length > 0 && (
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, width: '100%' }}>
                                {selectedClasses.length === 0 && <Button sx={{ marginRight: 1, marginTop: 1, backgroundColor: '#695ACD' }} variant="contained">View Full</Button>}
                                <Button sx={{ marginRight: 1, marginTop: 1, backgroundColor: '#695ACD' }} variant="contained">Generate Report ({selectedClasses.length})</Button>
                            </Box>
                        )}
                    </TableContainer>
                </TableAndCardsContainer>
                <ChartAndActionsContainer>
                    <Title style={{ marginRight: "110px", marginBottom: "0", marginTop: "0" }}>Actions</Title>
                    <ActionMenuContainer>
                        <Button style={{ backgroundColor: "#695ACD" }} variant="contained" onClick={() => setShowRegisterClass(true)}>Create Class</Button>
                        <Button style={{ backgroundColor: "#695ACD" }} variant="contained" onClick={() => setShowRegisterStudent(true)}>Register User</Button>
                        <Button style={{ backgroundColor: "#695ACD" }} variant="contained" onClick={() => navigate("/students")}>View Students</Button>
                        <Button style={{ backgroundColor: "#695ACD" }} variant="contained" onClick={() => navigate("/reports")}>View Reports</Button>
                    </ActionMenuContainer>
                    <PieChartContainer>
                        <Typography fontSize='32px' fontWeight='bold' color='#43296E' marginTop={3.8} marginRight={13} marginBottom={5} variant="h4">
                            Class Distribution
                        </Typography>
                        <PieChart
                            height={350}
                            width={350}
                            series={[
                                {
                                    data: [
                                        { id: 0, value: 25, label: 'STEM', color: '#43296E' },
                                        { id: 1, value: 10, label: 'Humanities', color: '#808080' },
                                        { id: 2, value: 15, label: 'Other', color: '#695ACD' },
                                    ],
                                    innerRadius: 80
                                },
                            ]}
                        />
                    </PieChartContainer>
                </ChartAndActionsContainer>
            </ContentContainer>
        </PageContainer>
    );
}
