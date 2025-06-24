import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled as style } from "styled-components";
import { useState, useEffect, useMemo } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Drawer, Checkbox, Card, CardContent, Typography, Button, TableContainer, Divider } from '@mui/material';
import { Student } from "../../Models/User";
import { Course } from "../../Models/Course";
import { useAuth } from "../../Context/useAuth";
import RegisterClass from './RegisterClass';
import RegisterStudent from './RegisterStudent';
import { useNavigate } from 'react-router-dom';
import { Direction } from '@mui/x-charts';
import DeleteClass from './DeleteClass';

const PageContainer = style.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 20px;
  height: calc(100vh - 60px);
  overflow-y: auto;
  background-color: #F7F7F7;
`;

const DrawerContainer = style.div`
    display: flex;
    flex-direction: column;
    padding: 40px 20px;
`;

const Container = style.div`
    margin-top: 15px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 100px;
    width: 90%;
`;

const LeftContainer = style.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
`;

const RightContainer = style.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
`;

const SummaryCardsContainer = style.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    gap: 5px;
    margin-bottom: 10px;
`;

const ActionMenuContainer = style.div`
    background-color: #FFFFFF;
    border-radius: 10px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height: 150px;
    border: 1px solid #ccc;
`;

const Title = style.h2`
    font-size: 32px;
    font-weight: bold;
    color:rgb(45, 45, 45);
    margin-bottom: 20px;
    text-align: left;
    margin-top: 10px;
`;

const TableTitle = style.h1`
    font-size: 40px;
    font-weight: bold;
    color:color:rgb(45, 45, 45);
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
    margin-top: 10px;
    margin-right: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
`;

const PieChartContainer = style.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #FFFFFF;
    border-radius: 10px;
    padding: 16px;
    padding-top: 20px;
    padding-bottom: 70px;
    border: 1px solid #ccc;
    width: 100%;
`;

type Metrics = {
    classes: number;
    students: number;
    professors: number;
    topics: Record<string, number>;
}

const StyledCard = styled(Card)(() => ({
    boxShadow: 'none',
    border: '1px solid rgb(224, 224, 224)',
    borderRadius: '8px',
}))

const StyledTableCell = styled(TableCell)(({ theme }) => ({
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

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },

    borderRadius: '8px',

    '&:last-child td, &:last-child th': {
        border: 0,
    },
    '&:hover': {
        cursor: 'pointer',
        backgroundColor: "#EFE6FA",
    },
}));

const actionButtonStyle = {
  backgroundColor: "#695ACD",
  padding: '12px 20px',
  flex: 1
};

const cardStyles = { minWidth: 150, display: "flex", flexDirection: "column", alignItems: "center" }

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
    const [showDeleteClass, setShowDeleteClass] = useState(false);
    const [fullOnly, setFullOnly] = useState(false);
    const [metrics , setMetrics] = useState<Metrics>({
        classes: 0,
        students: 0,
        professors: 0,
        topics: {}
    });
    const navigate = useNavigate();


    const getMetrics = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:8000/api/admin/metrics', {
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
            setMetrics(data);
        } catch (err) {
            console.log(err);
        } finally{
            setLoading(false);
        }
    };

    const getClassData = async (id: number) => {
        try {
            setLoading(true);
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
        } finally {
            setLoading(false);
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

    const filteredClasses = useMemo(() => {
        let filtered = classes.filter(course => 
            course.class_name.toLowerCase().includes(search.toLowerCase()) ||
            course.class_id.toString().includes(search)
        );

        if (fullOnly){
            filtered = filtered.filter(course => course.size >= course.capacity);
        }

        return filtered;
    }, [classes, search, fullOnly]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    }

    const handleDrawerClose = () => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        setState({ ...state, left: false });
    };

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        getMetrics();
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

    const handleReport = async () => {
        try {
            if (selectedClasses.length === 0) {
                return;
            }

            const res = await fetch(`http://localhost:8000/api/admin/class/report/${selectedClasses[0]}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }, body: JSON.stringify(selectedClasses)
            })

            if (res.status === 200) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'report.txt';
                link.click();
                window.URL.revokeObjectURL(url);
            }
        } catch (err){
            console.log(err);
        }
    }

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
                            <TableContainer sx={{ height: "50vh", borderRadius: "8px", maxHeight: "50vh", overflowY: "scroll" }}>
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

            <RegisterStudent setMessage={() => {}} isOpen={showRegisterStudent} onClose={() => setShowRegisterStudent(false)} />
            <RegisterClass setMessage={() => {}} isOpen={showRegisterClass} onClose={() => setShowRegisterClass(false)} />
            <DeleteClass setMessage={() => {}} isOpen={showDeleteClass} onClose={() => setShowDeleteClass(false)} courses={classes} />

            <Title style={{ fontSize: "42px", marginTop: "20px", marginBottom: "0" }}>Welcome back, {user?.first_name}</Title>
            <Container>
                <LeftContainer>
                    <SummaryCardsContainer>
                        <StyledCard sx={cardStyles}>
                            <CardContent>
                                <Typography variant="h3" fontSize="32px">{metrics.classes}</Typography>
                                <Typography fontWeight="bold" fontSize="16px">Classes</Typography>
                            </CardContent>
                        </StyledCard>
                        <StyledCard sx={cardStyles}>
                            <CardContent>
                                <Typography variant="h3" fontSize="32px">{metrics.students}</Typography>
                                <Typography fontWeight="bold" fontSize="16px">Students</Typography>
                            </CardContent>
                        </StyledCard>
                        <StyledCard sx={cardStyles}>
                            <CardContent>
                                <Typography variant="h3" fontSize="32px">{metrics.professors}</Typography>
                                <Typography fontWeight="bold" fontSize="16px">Professors</Typography>
                            </CardContent>
                        </StyledCard>
                        <StyledCard sx={cardStyles}>
                            <CardContent>
                                {metrics && metrics.topics && <Typography variant="h3" fontSize="32px">{Object.keys(metrics.topics).length}</Typography>}
                                <Typography fontWeight="bold" fontSize="16px">Topics</Typography>
                            </CardContent>
                        </StyledCard>
                    </SummaryCardsContainer>
                    <TableContainer 
                    component = {Box}
                    sx={{ backgroundColor: "#FFFFFF", 
                        borderRadius: "10px", 
                        border: "1px solid #ccc", 
                        width: "100%", 
                        minHeight: 660 }}>
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
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, width: '100%' }}>
                            <Button sx={{ marginRight: 1, marginTop: 1, backgroundColor: '#695ACD' }} variant="contained"
                            onClick = {() => setFullOnly(!fullOnly)}>View Full</Button>
                            {selectedClasses.length <= 1 && <Button sx={{ marginRight: 1, marginTop: 1, backgroundColor: '#695ACD' }} variant="contained"onClick={() => handleReport()}>Generate Report (.txt)</Button>}
                        </Box>
                    </TableContainer>
                </LeftContainer>
                <RightContainer>
                    <ActionMenuContainer>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '8px' }}>
                            <Button style={actionButtonStyle} variant="contained" onClick={() => setShowRegisterClass(true)}>Create Class</Button>
                            <Button style={actionButtonStyle} variant="contained" onClick={() => setShowDeleteClass(true)}>Delete Class</Button>
                        </Box>
                        <Divider/>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '8px' }}>
                            <Button style={actionButtonStyle} variant="contained" onClick={() => setShowRegisterStudent(true)}>Register User</Button>
                            <Button style={actionButtonStyle} variant="contained" onClick={() => navigate("/students")}>View Students</Button>
                        </Box>
                    </ActionMenuContainer>
                    <PieChartContainer>
                        <Title> Class Distribution </Title>
                        <PieChart
                            height={350}
                            width={350}
                            colors={["#695ACD","#A9A9A9","#530686", "#3048AD"]}
                            series={[
                                {
                                    data: Object.keys(metrics.topics).map((key) => ({
                                    id: key,
                                    value: metrics.topics[key],
                                    label: key
                                    })),
                                    innerRadius: 80,
                                },
                            ]}
                            slotProps={{
                                legend: {
                                    direction: "row" as Direction,
                                    position: { vertical: 'top'}
                                }
                            }}
                        />
                    </PieChartContainer>
                </RightContainer>
            </Container>
        </PageContainer>
    );
}
