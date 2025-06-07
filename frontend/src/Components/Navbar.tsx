import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/useAuth";

const StyledHeader = styled.div`
  display: flex;
  height: 60px;
  background-color: #f0f0f0;
  color: #44296F;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.14);
  position: relative;
`;

const LeftDiv = styled.div`
  flex: 2;
  display: flex;
  align-items: center;
  text-align: left;

  h1 {
    font-size: 22px;
    margin: 0;
    font-weight: bold;
    color: #44296F;
  }
`;


const RightDiv = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

const BurgerButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #44296F;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 60px;
  left: 20px;
  background-color: white;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 6px;
  overflow: hidden;
  z-index: 20;
`;

const MenuItem = styled.div`
  padding: 12px 20px;
  font-size: 14px;
  color: #44296F;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #EFE6FA;
  }
`;

const SignOutButton = styled.button`
  background-color: #44296F;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #351f52;
  }
`;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <>
      <StyledHeader>
        <LeftDiv>
          <BurgerButton onClick={() => setMenuOpen(!menuOpen)}>☰</BurgerButton>
          {menuOpen && (
            <DropdownMenu ref={menuRef}>
              <MenuItem
              onClick={() => {
                navigate("/home");
                setMenuOpen(false);
              }}
              >Classes</MenuItem>
              <MenuItem
              onClick={() =>{
                navigate("/register");
                setMenuOpen(false);
              }}>Students</MenuItem>
              <MenuItem>Reports</MenuItem>
            </DropdownMenu>
          )}
          <h1> Alberto </h1>
        </LeftDiv>
        <RightDiv>
          <SignOutButton
            onClick={logout}
          >Sign Out</SignOutButton>
        </RightDiv>
      </StyledHeader>
    </>
  );
}
