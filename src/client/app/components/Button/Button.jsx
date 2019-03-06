import React from 'react';
import styled from 'styled-components';

const ButtonElement = styled.button`
    background-color: ${props => (props.div ? 'transparent' : '#ffffff')};
    padding: 0;
    border: none;
    border-radius: ${props => (props.div ? '0' : '5px')};
    box-shadow: ${props => (props.div ? 'none'
        : '0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)')};
    cursor: pointer;
`;

export default function Button(props) {
    return (
        <ButtonElement
            type="button"
            ref={props.refObj}
            {...props}
        >
            {props.children}
        </ButtonElement>
    );
}
