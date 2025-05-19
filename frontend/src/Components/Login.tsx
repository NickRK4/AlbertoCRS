import styled from "styled-components";
import React, { useState } from "react";
import { useNavigate } from "react-router";

const Container = styled.div`
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    position: absolute;
    height: 100vh;
`;

const StyledButton = styled.button`
    background-color:#530686;
    font-weight: 300;
    color: white;
    text-align: center;
    font-size: 16px;
    margin: 4px 2px;
    margin-left: -10px;
    align-self: flex-start;
    border: none;    
    outline: 0;
`;

const LeftContainer = styled.div`
    flex: 1;
    padding: 20px;
    margin-right: 100px;
    text-align: left;
    max-width: 450px;
`;

const RightContainer = styled.div`
    flex: 1;
    max-width: 420px;
    padding: 20px;
`;

const FormContainer = styled.div`
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Label = styled.label`
    color: white;
    align-self: flex-start;
`;

// stop from highlighting whenever you click on the input field
const StyledInput = styled.input`
    width: 400px;
    padding: 12px 20px;
    margin: 8px 0;
    border-radius: 5px;
    border: none;
    box-sizing: border-box;
    outline: none;
`;

const BackgroundImage = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
    opacity: 0.3;
`;

const BG = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    z-index: -2;
    `

const SignIn = () => {
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e : React.FormEvent) => {
        e.preventDefault();
        try {
            const user : any = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, password})
            });
            const userJSON = await user.json();
            if (!userJSON){
                console.log(userJSON);
            } else {
                console.log("No user found");
            }

        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
        <Container>
            <LeftContainer>
                <h1>Welcome Back!</h1>
                <p>Sign in to your account to access 
                    course information. Docs for this project can be found
                    <a href="#"> here</a>.
                </p>
            </LeftContainer>
            <RightContainer>
            <FormContainer>
                <h1>Sign In</h1>
                <Label>Username</Label>
                <StyledInput onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username" />
                <Label>Password</Label>
                <StyledInput onChange = {(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
                <StyledButton onClick={handleSubmit}>Sign in now </StyledButton>
            </FormContainer>
            </RightContainer>
            <BackgroundImage src="/WallpaperNYU.jpg" alt="Image" />
            <BG/>
        </Container>

        </>
    )
}

export default SignIn;