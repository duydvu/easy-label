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
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    z-index: 100;
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,.5);
    box-sizing: border-box;
    .nav_wrapper {
        display: inherit;
        align-items: inherit;
    }
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
    line-height: 40px;
    width: 100px;
    font-weight: 700;
    text-decoration: none;
`;

const UploadButton = styled(DownloadButton)`
    margin: 0 10px;
    label {
        display: block;
        cursor: inherit;
    }
    input[type=file] {
        display: none;
    }
`;

export default function Navigation(props) {
    const {
        index,
        total,
        onUpdateData,
        onUpload,
        onIndexChange,
        previousButton,
        nextButton,
        collection,
        collectionList,
    } = props;

    const uploadButton = React.createRef();

    return (
        <NavigationContainer>
            <div>
                <select value={collection}>
                    {
                        collectionList.map(e => (
                            <option value={e} key={e}>{e}</option>
                        ))
                    }
                </select>
            </div>
            <div className="nav_wrapper">
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
                        onKeyDown={(e) => {
                            e.stopPropagation();
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
            </div>
            <div>
                <UploadButton secondary>
                    <label htmlFor="upload">
                        Upload
                        <input
                            type="file"
                            id="upload"
                            onChange={() => onUpload(uploadButton.current.files[0])}
                            ref={uploadButton}
                        />
                    </label>
                </UploadButton>
                <a href={`${API_URL}/download/labelled`}>
                    <DownloadButton secondary>
                        Download
                    </DownloadButton>
                </a>
            </div>
        </NavigationContainer>
    );
}
