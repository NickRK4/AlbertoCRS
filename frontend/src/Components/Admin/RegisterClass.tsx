import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Course } from '../../Models/Course';
import { useAuth } from '../../Context/useAuth';

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

const RadioGroup = styled.div`
    margin-top: 10px;
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 16px;
`;

const RadioLabel = styled.label`
    display: flex;
    align-items: center;
    font-weight: 500;
`;

const FormTitle = styled.h2`
    margin-bottom: 10px;
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

export default function RegisterClass({isOpen, onClose, setMessage}: {isOpen: boolean, onClose: () => void, setMessage: () => void}) {
  const [ newClass , setNewClass ] = useState({
        class_code : '',
        class_name : '',
        size : 0,
        capacity : 0,
        professor : '',
        section : 0,
        category : ''
    } as Course);
    const { token } = useAuth();
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (formRef.current && !formRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        }
    })

    
  const handleClass = (e: React.ChangeEvent<HTMLInputElement>) => {
    // extracts the name and value of the input
    const { name, value } = e.target;
    setNewClass(prev => ({ ...prev, [name]: value }));
  }

  const createClass = async (event: React.FormEvent) => {
        try {
            event.preventDefault();
            const res = await fetch('http://localhost:8000/api/admin/class', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newClass)
            });

            if (res.status !== 201) {
                throw new Error('Failed to create class');
            }
            onClose();
            window.location.reload();
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
                    onSubmit={createClass}>
                    <FormTitle>Class</FormTitle>
                    <p style={{margin: "0"}}> Register a new class </p>
                    <RadioGroup>
                        <Label> Category: </Label>
                        <RadioLabel>
                            <input
                                type="radio"
                                name="category"
                                value="STEM"
                                checked={newClass.category === 'STEM'}
                                onChange={handleClass}
                            />
                            Humanities
                        </RadioLabel>
                        <RadioLabel>
                            <input
                                type="radio"
                                name="category"
                                value="Humanities"
                                checked={newClass.category === 'Humanities'}
                                onChange={handleClass}
                            />
                            STEM
                        </RadioLabel>
                        <RadioLabel>
                            <input
                                type="radio"
                                name="category"
                                value="Other"
                                checked={newClass.category === 'Other'}
                                onChange={handleClass}
                            />
                            Other
                        </RadioLabel>
                    </RadioGroup>
                    <Label> Class Code: </Label>
                    <StyledInput
                        placeholder="e.g. CS-UA 101"
                        type="text"
                        name="class_code"
                        onChange={handleClass}
                    />
                    <Label> Class Name: </Label>
                    <StyledInput
                        placeholder="Class Name"
                        type="text"
                        name="class_name"
                        onChange={handleClass}
                    />
                    <Label> Section: </Label>
                    <StyledInput
                        placeholder="Professor Name"
                        type="text"
                        name="professor"
                        onChange={handleClass}
                    />
                    <Label> Professor: </Label>
                    <StyledInput
                        placeholder="Professor Name"
                        type="text"
                        name="professor"
                        onChange={handleClass}
                    />
                    <Label> Capacity: </Label>
                    <StyledInput
                        placeholder="Capacity"
                        type="number"
                        name="capacity"
                        onChange={handleClass}
                    />
                    <Button type="submit">Create Class</Button>
                </Form>
            </FormContainer>
        </Overlay>
    </>
    );
    }
 
