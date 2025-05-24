import React, { useLayoutEffect, useState } from 'react';
import styled from 'styled-components';


const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100px;
`;

const FormContainer = styled.form`
    font-size: 18px;
    background: white;
    padding: 50px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
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
    width: 100%;
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

export default function CreateUser({setShowNavBar}: {setShowNavBar: React.Dispatch<React.SetStateAction<boolean>>}) { 
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    user_type: '',
  });

  useLayoutEffect(() => {
    setShowNavBar(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // extracts the name and value of the input
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <PageContainer>
      <FormContainer onSubmit={handleSubmit}>
        <FormTitle>Register User</FormTitle>
        <label htmlFor="user_type">User Type:</label>
        <RadioGroup>
        <RadioLabel>
            <input
              type="radio"
              name="user_type"
              value="student"
              checked={formData.user_type === 'student'}
              onChange={handleChange}
            />
            Student
          </RadioLabel>
          <RadioLabel>
            <input
              type="radio"
              name="user_type"
              value="professor"
              checked={formData.user_type === 'professor'}
              onChange={handleChange}
            />
            Professor
          </RadioLabel>
        </RadioGroup>

        <Label>First Name</Label>
        <StyledInput
          type="text"
          name="first_name"
          placeholder="First Name"
          onChange={handleChange}
        />

        <Label>Last Name</Label>
        <StyledInput
          type="text"
          name="last_name"
          placeholder="Last Name"
          onChange={handleChange}
        />

        <Label>Email</Label>
        <StyledInput
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <Label>Password</Label>
        <StyledInput
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <Button type="submit">Create User</Button>
      </FormContainer>
    </PageContainer>
  );
}
