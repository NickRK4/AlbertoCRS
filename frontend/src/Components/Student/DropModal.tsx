import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";
import { Course } from "../../Models/Course";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from "@mui/material/IconButton";
import { useAuth } from "../../Context/useAuth";

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
    background-color: white;
    min-width: 450px;
    padding-left: 30px;
    padding-right: 30px;
    padding-top: 20px;
    padding-bottom: 20px;
    border-radius: 8px;
`;

const Row = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
`;


export default function DropModal({isOpen, onClose, courses, message} : {isOpen: boolean, onClose: () => void, courses: Course[], message: (msg: string) => void}) {
    const [ course, setCourse ] = useState("");
    const { user, token } = useAuth();
    const handleChange = (event: SelectChangeEvent) => {
        setCourse(event.target.value as string);
        console.log(event.target.value);
    };

    const handleDrop = async () => {
        try {
            const res = await fetch(`http://localhost:8000/api/admin/drop/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    student_id: user?.user_id,
                    class_id: course
                })
            });

            if (res.status === 200) {
                message("Successfully dropped");
                onClose();
            } else {
                message("Failed to drop");
                onClose();
            }

        } catch (err) {
            console.log(err);
        }
    }



    if (!isOpen) {
        return null;
    }

    return (
        <>
        <Overlay>
            <Container>
                <Row>
                <IconButton onClick={onClose} style={{margin: "0"}}><CloseIcon/></IconButton>
                <h3 style={{margin: "0"}}>Select Class to Drop</h3>
                <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Class</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={course}
                    label="Age"
                    onChange={handleChange}
                    >
                    {courses.map((course) => (
                        <MenuItem value={course.class_id}>{course.class_name}</MenuItem>
                    ))}
                    </Select>
                </FormControl>
                </Box>
                </Row>
                <Row>
                    <Box style={{display: "flex", justifyContent: "center", width: "100%", marginTop: "20px"}}>
                    <Button variant="contained" color="error"
                    onClick={handleDrop}>Drop</Button>
                    </Box>
                </Row>
            </Container>     
        </Overlay>
        </>
    );
}