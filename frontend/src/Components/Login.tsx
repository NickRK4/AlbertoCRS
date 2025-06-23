import styled from "styled-components";
import React, { useLayoutEffect, useState } from "react";
import { useAuth } from "../Context/useAuth";
import { loginAPI } from "../Services/AuthServices";

const Cont = styled.div`
    display: flex;
    height: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`


const Container = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

`

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



const SignIn = ( {setShowNavBar} : {setShowNavBar: React.Dispatch<React.SetStateAction<boolean>>} ) => {
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ error, setError ] = useState("");
    const [ showError , setShowError ] = useState(false);
    const { loginUser } = useAuth();

    useLayoutEffect(() => {
        setShowNavBar(false);
    }, []);

    function UserNotFound() {
        if (!showError) {
          return null;
        }
        return (
            <p style={{color: "red"}}>{error}</p>
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
            const response = await loginAPI(username, password);
            
            if (!response?.data.success) {
                setError(response?.data.message);
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 2000);
                return;
            }

            loginUser(username, password);
        } catch (err) {
            console.log(err);
            setError("Something went wrong");
            setShowError(true);
            setTimeout(() => {
                setShowError(false);
            }, 2000);
        }
    }
    return (
        <>
        <Cont>
        <Container>
            <LeftContainer>
                <h1 style={{color: "white"}}>Welcome Back!</h1>
                <p style={{color: "white"}}>Sign in to your account to access 
                    course information. Docs for this project can be found
                    <a href="#"> here</a>.
                </p>
            </LeftContainer>
            <RightContainer>
            <FormContainer>
                <h1 style={{color: "white"}}>Sign In</h1>
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
        </Cont>
        </>
    )
}

export default SignIn;