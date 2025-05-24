import styled from "styled-components";
import React, { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    display: inline;
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

const AlertContainer = styled.div`
    color: red;
`;


interface User {
    username: string;
    password: string;
    user_type: string;
};


const SignIn = ( {setShowNavBar} : {setShowNavBar: React.Dispatch<React.SetStateAction<boolean>>} ) => {
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ error, setError ] = useState("");
    const [ showError , setShowError ] = useState(false);
    const navigate = useNavigate();

    useLayoutEffect(() => {
        setShowNavBar(false);
    }, []);

    function UserNotFound() {
        if (!showError) {
          return null;
        }
        return (
            <p>{error}</p>
        );
      }

    const handleSubmit = async (e : React.FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            setError("Please fill in all fields.");
            setShowError(true);
            setTimeout(() => {
                setShowError(false);
            }, 3000);
            return;
        }

        try {
            const res = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, password})
            });
            if (res.status === 200) {
                const userJSON : User = await res.json();
                console.log(userJSON);
                if (userJSON.user_type === "student") {
                    navigate("/home");
                } else if (userJSON.user_type === "professor") {
                    navigate("/home");
                }

            } else{
                setError("Username or password is incorrect.");
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 3000);
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
                <AlertContainer>
                    <UserNotFound/>
                </AlertContainer>
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