import React, { useLayoutEffect, useState } from 'react';
import styled from 'styled-components';
import { User } from '../Models/User';

const PageContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: stretch;
    gap: 100px;
  `

const FormContainer = styled.div`
    margin: 40px 20px;
    flex: 1;
    max-width: 400px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
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

const RadioGroup = styled.div`
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 16px;
`;

const RadioLabel = styled.label`
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;
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

type Course = {
    class_id: number,
    class_code: string,
    class_name: string,
    size: number,
    capacity: number,
    professor: string
}

export default function Register({setShowNavBar}: {setShowNavBar: React.Dispatch<React.SetStateAction<boolean>>}) { 
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    user_type: ''
  } as User);

  const [ newClass , setNewClass ] = useState({
        class_code : '',
        class_name : '',
        size : 0,
        capacity : 0,
        professor : ''
    } as Course);

  useLayoutEffect(() => {
    setShowNavBar(true);
  }, []);

  const handleUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    // extracts the name and value of the input
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClass = (e: React.ChangeEvent<HTMLInputElement>) => {
    // extracts the name and value of the input
    const { name, value } = e.target;
    setNewClass(prev => ({ ...prev, [name]: value }));
  }

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const { first_name, last_name, email, password, user_type } = formData;
    if (!first_name || !last_name || !email || !password || !user_type) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.status === 201) {
        alert("User created successfully!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const createClass = async (event: React.FormEvent) => {
        try {
            event.preventDefault();
            const res = await fetch('http://localhost:8000/api/class', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newClass)
            });

            if (res.status !== 201) {
                throw new Error('Failed to create class');
            }
            alert("Class created successfully!");
        } catch (err) {
            console.log(err);
        }
    };



  return (
    <>
      <PageContainer>
      <FormContainer>
        <Form
          id="register-form"
          onSubmit={createUser}>
        <FormTitle>Register User</FormTitle>
        <label htmlFor="user_type">User Type:</label>
        <RadioGroup>
        <RadioLabel>
            <input
              type="radio"
              name="user_type"
              value="student"
              checked={formData.user_type === 'student'}
              onChange={handleUser}
            />
            Student
          </RadioLabel>
          <RadioLabel>
            <input
              type="radio"
              name="user_type"
              value="professor"
              checked={formData.user_type === 'professor'}
              onChange={handleUser}
            />
            Professor
          </RadioLabel>
        </RadioGroup>

        <Label>First Name</Label>
        <StyledInput
          type="text"
          name="first_name"
          placeholder="First Name"
          onChange={handleUser}
        />

        <Label>Last Name</Label>
        <StyledInput
          type="text"
          name="last_name"
          placeholder="Last Name"
          onChange={handleUser}
        />

        <Label>Email</Label>
        <StyledInput
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleUser}
        />

        <Label>Password</Label>
        <StyledInput
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleUser}
        />
        <Button type="submit">Create User</Button>
        </Form>
      </FormContainer>
      <FormContainer>
      <Form
            onSubmit={createClass}>
            <FormTitle>Class</FormTitle>
            <p> Register a new class </p>
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
        </PageContainer>
    </>
  );
}
