import React from 'react';
import styled from 'styled-components';
import queryString from 'query-string';

import LabelsCollection from '../LabelsCollection';

const AppContainer = styled.div`
    &, * {
        font-family: 'Roboto', sans-serif;
        font-weight: 400;
    }

    .bold {
        font-weight: 700;
    }
`;

const Navigation = styled.div`
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

const Button = styled.button`
    margin: 10px;
    min-width: 100px;
    height: 40px;
    cursor: pointer;
    font-weight: 700;
    border-radius: 5px;
`;

const Input = styled.input`
    width: 50px;
    font-size: 16px;
    text-align: right;
    margin-right: 5px;
`;

const DownloadButton = styled.a`
    position: absolute;
    top: 10px;
    right: 10px;
    line-height: 40px;
    width: 100px;
    background: #6200EE;
    font-weight: 700;
    text-align: center;
    border-radius: 5px;
    color: white;
    text-decoration: none;
`;

const LabelSection = styled.div`
    position: fixed;
    top: 60px;
    right: 0;
    width: 150px;
    height: calc(100% - 50px);
    background: lightgray;
    box-sizing: border-box;
`;

const Table = styled.div`
    padding: 60px 150px 0 0;
`;

const Row = styled.div`
`;

const Column = styled.div`
    &.header {
        font-weight: 700;
        color: white;
        background: cyan;
        padding: 10px;
        &::first-letter {
            text-transform: capitalize;
        }
    }
    &.content {
        padding: 10px;
        text-indent: 10px;
        font-size: 14px;
        line-height: 20px;
    }
`;

const Error = styled.div`
    color: red;
    font-weight: 700;
`;

export default class App extends React.Component {
    constructor(props) {
        super(props);

        let query = {};
        if (window) {
            query = queryString.parse(window.location.search);
        }

        this.state = {
            document: null,
            index: parseInt(query.i, 10) || 0,
            total: null,
            columns: [],
            labels: [],
            values: [],
            changed: false,
            error: false,
        };

        this.urls = [
            index => `/data/${index}`,
            () => '/metadata',
        ];

        this.previousButton = React.createRef();
        this.nextButton = React.createRef();

        this.changeDocument = this.changeDocument.bind(this);
    }

    componentDidMount() {
        const { index } = this.state;
        Promise.all(this.urls.map(url => fetch(`${API_URL}${url(index)}`).then(res => res.json())))
            .then(([document, { database, labels }]) => {
                window.history.replaceState({ index }, `Document #${index}`, `/?i=${index}`);
                console.log();
                this.setState({
                    document,
                    total: database.count,
                    columns: database.keys.filter(e => (
                        e !== '_id'
                        && e !== 'index'
                        && !labels.map(l => l.name).includes(e)
                    )),
                    labels,
                    values: labels.map(e => document[e.name]),
                });
            });

        window.onpopstate = (event) => {
            const { state } = event;
            if (state && state.index) {
                this.setState({
                    index: state.index,
                }, () => {
                    this.changeDocument(this.state.index, true);
                });
            }
        };

        document.onkeydown = (event) => {
            const { keyCode } = event;
            switch (keyCode) {
                case 37:
                    this.previousButton.current.click();
                    break;
                case 39:
                    this.nextButton.current.click();
                    break;
                default:
            }
        };
    }

    changeDocument(index, replace = false) {
        if (index < 0) return;
        if (this.state.changed) {
            const keys = Object.keys(this.state.values);
            const body = {};
            keys.forEach((k) => {
                body[this.state.labels[k].name] = this.state.values[k];
            });
            fetch(`${API_URL}${this.urls[0](this.state.index)}`, {
                method: 'PUT',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(res => res.json())
                .then(() => {})
                .catch(() => {
                    this.setState({
                        error: 'Save document failed.',
                    });
                });
        }
        fetch(`${API_URL}${this.urls[0](index)}`).then(res => res.json())
            .then((document) => {
                window.history[replace ? 'replaceState' : 'pushState']({ index }, `Document #${index}`, `/?i=${index}`);
                this.setState(prevState => ({
                    document,
                    index,
                    values: prevState.labels.map(e => document[e.name]),
                    changed: false,
                    error: false,
                }));
            })
            .catch(() => {
                this.setState({
                    error: 'Cannot get the new document.',
                });
            });
    }

    render() {
        const {
            document,
            index,
            total,
            columns,
            labels,
            values,
            error,
        } = this.state;
        if (!document) {
            return (
                <div>
                    No document.
                </div>
            );
        }

        if (error) {
            return (
                <Error>
                    {error}
                </Error>
            );
        }

        return (
            <AppContainer>
                <Navigation>
                    <Button
                        onClick={() => this.changeDocument(index - 1)}
                        ref={this.previousButton}
                    >
                        Previous
                    </Button>
                    <div>
                        <Input
                            type="text"
                            value={index}
                            onKeyUp={(e) => {
                                if (e.keyCode === 13) {
                                    this.changeDocument(index);
                                }
                            }}
                            onChange={e => this.setState({ index: parseInt(e.target.value, 0) })}
                        />
                        {`/ ${total}`}
                    </div>
                    <Button
                        onClick={() => this.changeDocument(index + 1)}
                        ref={this.nextButton}
                    >
                        Next
                    </Button>
                    <DownloadButton href={`${API_URL}/download/labelled`}>
                        Download
                    </DownloadButton>
                </Navigation>
                <LabelSection>
                    {
                        labels.map((e, i) => (
                            <LabelsCollection
                                key={e.name}
                                name={e.name}
                                type={e.type}
                                value={values[i]}
                                onClick={(value) => {
                                    this.setState((prevState) => {
                                        const prevValues = prevState.values;
                                        prevValues[i] = value;
                                        return {
                                            values: prevValues,
                                            changed: true,
                                        };
                                    });
                                }}
                            />
                        ))
                    }
                </LabelSection>
                <Table>
                    {
                        columns.map(e => (
                            <Row key={e}>
                                <Column className="header">{e}</Column>
                                <Column className="content">{document[e]}</Column>
                            </Row>
                        ))
                    }
                </Table>
            </AppContainer>
        );
    }
}
