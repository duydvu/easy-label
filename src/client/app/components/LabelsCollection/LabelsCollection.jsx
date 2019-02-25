import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const LabelHeader = styled.div`
    background-color: lime;
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
    &:hover {
        background-color: #eeeeee;
    }
    &:active {
        background-color: #dddddd;
    }
    &.active {
        background-color: crimson;
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
