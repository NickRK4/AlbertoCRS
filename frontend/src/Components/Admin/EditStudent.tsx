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
    flex: 1;
    display: block;
    margin-bottom: 6px;
    font-weight: 600;
    text-align: left;
`;

const StyledInput = styled.input`
    width: 100%;
    box-sizing: border-box;
    padding: 10px 15px;
    margin-bottom: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const InputGroup = styled.div`
    display: flex;
    align-items: center;
`;

const LeftInput = styled.div`
    padding-left: 10px;
    margin-top: 10px;
    flex: 1;
   
`;

const RightInput = styled.div`
    flex: 1.3;
    
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

export default function EditStudent({ isOpen, onClose, student, setMessage }: { isOpen: boolean, onClose: () => void, student: User, setMessage: () => void}) {
    const originalStudent = student;
    const [formData, setFormData] = useState({
        user_id: student.user_id,
        first_name: '',
        last_name: '',
        email: '',
        password: ''
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

  const editUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const { first_name, last_name, email, password, user_type } = formData;
    if (!(first_name || last_name || email || password || user_type)) {
      alert("Please fill in one field.");
      return;
    }

    // write the form data if any information is missing
    if (!first_name){
        formData.first_name = originalStudent.first_name;
    }

    if (!last_name){
        formData.last_name = originalStudent.last_name;
    }

    if (!email){
        formData.email = originalStudent.email;
    }
    
    try {
      const response = await fetch('http://localhost:8000/api/admin/updateStudent', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (response.status === 200) {
        onClose();
        window.location.reload();
        setMessage();
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (!isOpen) {  
        return null;
    }

  return (
    <>  
      <Overlay>
        <FormContainer>
          <Form
            ref={formRef}
            id="register-form"
            onSubmit={editUser}>
          <FormTitle>Edit User</FormTitle>
          <InputGroup> 
            <LeftInput>
                <Label>{student.first_name}</Label>
            </LeftInput>
            <RightInput>
            <Label>First Name</Label>
            <StyledInput
                type="text"
                name="first_name"
                placeholder="First Name"
                onChange={handleUser}
            />
            </RightInput>
          </InputGroup>
            <InputGroup> 
            <LeftInput>
                <Label>{student.last_name}</Label>
            </LeftInput>
            <RightInput>
            <Label>Last Name</Label>
            <StyledInput
                type="text"
                name="last_name"
                placeholder="Last Name"
                onChange={handleUser}
            />
            </RightInput>
          </InputGroup>
          <InputGroup> 
            <LeftInput>
                <Label>{student.email.split('@')[0]}</Label>
            </LeftInput>
            <RightInput>
            <Label>Email</Label>
            <StyledInput
                type="text"
                name="email"
                placeholder="e.g. ab123@nyu.edu"
                onChange={handleUser}
            />
            </RightInput>
          </InputGroup>
          <InputGroup> 
            <LeftInput>
                <Label>************</Label>
            </LeftInput>
            <RightInput>
            <Label>Password</Label>
            <StyledInput
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleUser}
            />
            </RightInput>
          </InputGroup>
          <Button type="submit" onSubmit={()=>editUser}>Confirm Edit</Button>
          </Form>
        </FormContainer>
      </Overlay>
    </>
  );
}
