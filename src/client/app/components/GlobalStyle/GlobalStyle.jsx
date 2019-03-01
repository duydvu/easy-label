import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
    }

    * {
        font-family: 'Roboto', sans-serif;
        font-weight: 400;
    }

    .bold {
        font-weight: 700;
    }
`;

export default GlobalStyle;
