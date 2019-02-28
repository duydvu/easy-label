import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const LabelHeader = styled.div`
    background-color: darkgray;
    line-height: 40px;
    color: white;
    text-indent: 10px;
    &::first-letter {
        text-transform: capitalize;
    }
`;

const LabelButton = styled.button`
    width: 110px;
    cursor: pointer;
    background-color: white;
    color: black;
    border: none;
    margin: 20px 20px 0 20px;
    height: 40px;
    border-radius: 5px;
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.3);
    transition: 0.2s ease-in-out;
    &:hover {
        background-color: #eeeeee;
        box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.4);
    }
    &:active {
        background-color: #dddddd;
    }
    &.active {
        background-color: #FF0266;
        color: white;
    }
`;

export default function LabelsCollection(props) {
    let values;
    switch (props.type) {
        case 'boolean':
            values = [true, false];
            break;
        default:
            alert('Unknown label type');
    }

    return (
        <div>
            <LabelHeader className="bold">{props.name}</LabelHeader>
            <div>
                {
                    values.map(e => (
                        <LabelButton
                            key={e}
                            onClick={() => props.onClick(e)}
                            className={props.value === e && 'active'}
                        >
                            {JSON.stringify(e)}
                        </LabelButton>
                    ))
                }
            </div>
        </div>
    );
}

LabelsCollection.propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};
