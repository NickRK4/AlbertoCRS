// src/GlobalStyle.tsx
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body, html {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    align-items: center;
  }

  h1, p {
    color: #2B2B2B
  }

  #root {
    height: 100vh;
    width: 100vw;
    margin: 0 0;
    padding: 0 0;
  }

  button {
    user-select: none;
    &:active {
      outline: none;
    }
    &:focus {
      outline: none;
    }
    &:hover {
      cursor: pointer;
    }
  }

  input {
    user-select: none;
    &:active {
      outline: none;
    }
    &:focus {
      outline: none;
    }
  }


`;

export default GlobalStyle;