import React from 'react';
import styled from 'styled-components';

export default function App(props) {
    const Button = styled.div`
        /* Adapt the colors based on primary prop */
        background: "palevioletred";
        color: "white";

        font-size: 1em;
        margin: 1em;
        padding: 0.25em 1em;
        border: 2px solid palevioletred;
        border-radius: 3px;
    `;

    return (
        <div>
            <Button>Normal</Button>
            <Button primary>Primary</Button>
        </div>
    );
}
