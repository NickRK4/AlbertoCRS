import styled from "styled-components";

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    position: absolute;
    height: 100vh;
`;

const StyledButton = styled.button`
    background-color: #550688;
    border: none;    
    color: white;
    padding: 13px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    width: 100%; // Make button full width
    max-width: 300px;
`;

const FormContainer = styled.div`
    width: 100%;
    max-width: 300px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const StyledInput = styled.input`
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    box-sizing: border-box;
`;

const SignIn = () => {
    const handleButton = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
    }
    return (
        <>
        <Container>
            <FormContainer>
                <h1>Sign In</h1>
                <StyledInput type="text" placeholder="Username" />
                <StyledInput type="password" placeholder="Password" />
                <Button onClick={handleButton} />
            </FormContainer>
        </Container>
        </>
    )
}

function Button({onClick}: any) {
    return (
        <StyledButton 
        onClick={onClick}
        >Click me
        </StyledButton>
    )
}


export default SignIn;