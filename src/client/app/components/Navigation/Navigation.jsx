import React from 'react';
import styled from 'styled-components';
import Button from '../Button';

const NavigationContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    z-index: 100;
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,.5);
    box-sizing: border-box;
`;

const NavigateButton = styled(Button)`
    margin: 10px;
    min-width: 100px;
    height: 40px;
    font-weight: 700;
`;

const Input = styled.input`
    width: 50px;
    font-size: 16px;
    text-align: right;
    margin-right: 5px;
`;

const DownloadButton = styled(Button)`
    position: absolute;
    top: 10px;
    right: 10px;
    line-height: 40px;
    width: 100px;
    font-weight: 700;
    text-decoration: none;
`;

export default function Navigation(props) {
    const {
        index,
        total,
        onUpdateData,
        onIndexChange,
        previousButton,
        nextButton,
    } = props;

    return (
        <NavigationContainer>
            <NavigateButton
                onClick={() => onUpdateData(index - 1)}
                ref={previousButton}
            >
                Previous
            </NavigateButton>
            <div>
                <Input
                    type="text"
                    value={index}
                    onKeyUp={(e) => {
                        if (e.keyCode === 13) {
                            e.target.blur();
                            onUpdateData(index);
                        }
                    }}
                    onChange={onIndexChange}
                />
                {`/ ${total}`}
            </div>
            <NavigateButton
                onClick={() => onUpdateData(index + 1)}
                ref={nextButton}
            >
                Next
            </NavigateButton>
            <a href={`${API_URL}/download/labelled`}>
                <DownloadButton secondary>
                    Download
                </DownloadButton>
            </a>
        </NavigationContainer>
    );
}
