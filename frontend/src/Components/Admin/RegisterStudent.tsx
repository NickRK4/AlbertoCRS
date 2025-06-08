import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { User } from '../../Models/User';
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
    margin-bottom: 20px;s
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



export default function RegisterStudent({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) {  
    return null;
  }

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    user_type: ''
  } as User);
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
  }, []);


  const handleUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    // extracts the name and value of the input
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const { first_name, last_name, email, password, user_type } = formData;
    if (!first_name || !last_name || !email || !password || !user_type) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/admin/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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

  return (
    <>  
      <Overlay>
        <FormContainer>
          <Form
            ref={formRef}
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
      </Overlay>
    </>
  );
}
