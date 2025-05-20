import styled from "styled-components";

const LeftDiv = styled.div`
    flex: 1;
    `
const MiddleDiv = styled.div`
    flex: 1;
    font-size: 5px;
    color: black;
    min-width: 250px;
    `

const RightDiv = styled.div`
    flex: 1;
    display: flex;
    justify-content: flex-end;
    `


const StyledHeader = styled.div`
    display: flex;
    height: 55px;
    background-color:hsl(0, 0.00%, 94.10%);
    color: white;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    `

export default function Navbar() {
    return (
        <>
        <StyledHeader>
            <LeftDiv></LeftDiv>
            <MiddleDiv>
                <h1> Course Registration System </h1>
            </MiddleDiv>
            <RightDiv>
                <button>Log Out</button>
            </RightDiv>
            

        </StyledHeader>
        
        </>
    )
}