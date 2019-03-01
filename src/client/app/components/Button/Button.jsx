import styled from 'styled-components';

const Button = styled.button`
    background-color: ${props => (props.secondary ? '#FF0266' : '#6200EE')};
    border: none;
    border-radius: 5px;
    box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
    color: #FFFFFF;
    cursor: pointer;
    outline-color: ${props => (props.secondary ? '#6200EE' : '#FF0266')};
`;

export default Button;
