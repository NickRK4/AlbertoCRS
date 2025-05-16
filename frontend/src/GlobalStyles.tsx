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

  #root {
    height: 100vh;
    width: 100vw;
    margin: 0 0;
    padding: 0 0;
  }

  .button {
    user-select: none;
  }


`;

export default GlobalStyle;