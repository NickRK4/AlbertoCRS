import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../../Context/useAuth";
import { Course } from "../../Models/Course";
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

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

const FormContainer = styled.div`
    margin: 40px 20px;
    flex: 1;
    max-width: 400px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    background-color: white;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    padding: 0px 20px;
    margin-bottom: 20px;
`;

const FormTitle = styled.h2`
    margin-bottom: 20px;
    text-align: center;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 6px;
    font-weight: 600;
    text-align: left;
`;

const StyledInput = styled.input`
    box-sizing: border-box;
    padding: 10px 15px;
    margin-bottom: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const Button = styled.button`
    width: 100%;
    background-color: #550688;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
`;

export default function RegisterClass({isOpen, onClose, setMessage, courses}: {isOpen: boolean, onClose: () => void, setMessage: () => void, courses: Course[]}) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');
    const [confirm, setConfirm] = useState(false);
    const { token } = useAuth();
    const [course, setCourse] = useState('');
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (open){
                return;
            }

            if (formRef.current && !formRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        }
    });

    const handleChange = (event: SelectChangeEvent) => {
        setCourse(event.target.value as string);
    };
    
    const handleSelectOpen = () => {
        setOpen(true);
    };

    const handleSelectClose = () => {
        setOpen(false);
    };

  const deleteClass = async (event: React.FormEvent) => {
        try {
            event.preventDefault();

            if (course === '') {
                setError('Please select a class');
                setTimeout(() => {
                    setError('');
                }, 2000);
                return;
            }

            if (!confirm){
                setError('Please confirm');
                setTimeout(() => {
                    setError('');
                }, 2000);
                return;
            }

            const res = await fetch(`http://localhost:8000/api/admin/deleteClass/${course}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({})
            });

            if (res.status !== 201) {
                setError('Something went wrong');
            }
            
            onClose();
            setMessage();
        } catch (err) {
            console.log(err);
        }
    };

     if (!isOpen) {
        return null;
    }

    return (
        <>
        <Overlay>
            <FormContainer>
                <Form
                    ref={formRef}
                    onSubmit={deleteClass}>
                    <FormTitle>Class</FormTitle>
                    <p> Delete a class </p>
                    <p style={{color: 'red'}}> {error} </p>
                    <Label> Class Code: </Label>
                    <Box ref = {formRef} sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Class</InputLabel>
                            <Select
                            sx={{ maxHeight: '40px' }}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={course}
                            label="Age"
                            onClose={handleSelectClose}
                            onOpen={handleSelectOpen}
                            onChange={handleChange}
                            >
                            {courses.map((course) => (
                                <MenuItem key={course.class_id} value={course.class_id}>{course.class_name} ({course.class_code})</MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Label> Confirm: </Label>
                    <StyledInput
                        placeholder="Type 'Confirm' to confirm deletion"
                        type="text"
                        name="confirmText"
                        onChange={(e) => setConfirm(e.target.value.toLowerCase() === 'confirm')}
                    />
                    <Button style={{backgroundColor: 'red' }}type="submit">Delete</Button>
                </Form>
            </FormContainer>
        </Overlay>
    </>
    );
    }
 
