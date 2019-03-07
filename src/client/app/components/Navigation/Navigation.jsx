import React from 'react';
import styled from 'styled-components';
import Button from '../Button';
import ActionLogs from '../ActionLogs';
import Modal from '../Modal';

const NavigationContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    padding: 10px;
    z-index: 100;
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,.5);
    box-sizing: border-box;
    .nav_wrapper {
        position: absolute;
        top: 10px;
        left: 50%;
        height: 40px;
        transform: translate(-50%, 0);
        display: flex;
        align-items: center;
    }
`;

const NavigateButton = styled(Button)`
    width: 40px;
    height: 100%;
    margin: 0 10px;
    border-radius: 20px;
    background: #607d8b;
    color: #ffffff;
    display: flex;
    justify-content: center;
    transition: 0.2s ease-in;
    i {
        font-weight: 700;
    }
    &:active {
        background: #455a64;
    }
`;

const Input = styled.input`
    width: 40px;
    font-size: 16px;
    text-align: right;
    padding: 3px 5px;
    margin-right: 3px;
    border: none;
    border-radius: 5px;
    background: #eceff1;
`;

const FileInput = styled.input`
    display: none;
`;

const SideNavToggleButton = styled(Button)`
    float: right;
    width: 40px;
    height: 100%;
    padding: 10px 8px;
    box-sizing: border-box;
    transition: 0.1s linear;
    div {
        height: 4px;
        background-color: #000000;
        border-radius: 2px;
        margin-bottom: 4px;
        transition: inherit;
    }
    &:active {
        padding: 12px 8px;
        div {
            margin-bottom: 2px;
        }
    }
`;

const SideNav = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    width: 230px;
    height: 100%;
    padding-top: 60px;
    box-sizing: border-box;
    margin-right: ${props => (props.show ? '0' : '-230px')};
    background: #ffffff;
    transition: 0.3s ease-out;
`;

const SideNavItem = styled.div`
    height: 50px;
    background-color: #ffffff;
    transition: 0.2s ease-out;
    cursor: pointer;
    user-select: none;
    &:hover {
        background-color: #eeeeee;
    }
    &:active {
        background-color: #dddddd;
    }
    & > * {
        width: 100%;
        height: 100%;
        padding: 0 15px;
        display: block;
    }
    a {
        color: inherit;
        text-decoration: none;
    }
    * {
        color: #212121;
        line-height: 50px;
    }
    i, i ~ * {
        float: left;
        margin-right: 5px;
    }
`;

const Select = styled.select`
    background: none;
    border: none;
    display: block;
    width: 100%;
    height: 100%;
    cursor: pointer;
`;

export default class Navigation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showNav: false,
            showLogs: false,
        };

        this.uploadButton = React.createRef();
    }

    render() {
        const {
            index,
            total,
            onUpdateData,
            onUpload,
            onIndexChange,
            onCollectionChange,
            previousButton,
            nextButton,
            collection,
            collectionList,
        } = this.props;

        const {
            showNav,
            showLogs,
        } = this.state;

        return (
            <NavigationContainer>
                <div className="nav_wrapper">
                    <NavigateButton
                        onClick={() => onUpdateData(index - 1)}
                        refObj={previousButton}
                    >
                        <i className="material-icons">chevron_left</i>
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
                        refObj={nextButton}
                    >
                        <i className="material-icons">chevron_right</i>
                    </NavigateButton>
                </div>
                <SideNavToggleButton
                    div
                    onClick={() => this.setState({ showNav: true })}
                >
                    <div />
                    <div />
                    <div />
                </SideNavToggleButton>
                <Modal
                    isShow={showNav}
                    onClose={() => this.setState({ showNav: false })}
                >
                    <SideNav show={showNav} onClick={e => e.stopPropagation()}>
                        <SideNavItem>
                            <Select value={collection} onChange={onCollectionChange}>
                                {
                                    collectionList.map(e => (
                                        <option value={e} key={e}>{e}</option>
                                    ))
                                }
                            </Select>
                        </SideNavItem>
                        <SideNavItem>
                            <a href={`${API_URL}/download/labelled`}>
                                <i className="material-icons">file_download</i>
                                <span>Download</span>
                            </a>
                        </SideNavItem>
                        <SideNavItem>
                            <Button
                                div
                                onClick={() => this.uploadButton.current.click()}
                            >
                                <i className="material-icons">file_upload</i>
                                <span>Upload</span>
                                <FileInput
                                    type="file"
                                    id="upload"
                                    onChange={() => (
                                        onUpload(this.uploadButton.current.files[0])
                                    )}
                                    ref={this.uploadButton}
                                />
                            </Button>
                        </SideNavItem>
                        <SideNavItem>
                            <Button
                                div
                                onClick={() => this.setState({ showLogs: true })}
                            >
                                <i className="material-icons">history</i>
                                <span>Action logs</span>
                            </Button>
                        </SideNavItem>
                    </SideNav>
                </Modal>
                <Modal isShow={showLogs} onClose={() => this.setState({ showLogs: false })}>
                    <ActionLogs />
                </Modal>
            </NavigationContainer>
        );
    }
}
