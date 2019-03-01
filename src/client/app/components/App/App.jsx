import React from 'react';
import styled from 'styled-components';
import queryString from 'query-string';

import LabelsCollection from '../LabelsCollection';
import Navigation from '../Navigation';

const AppContainer = styled.div`
    padding-top: 60px;
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
    padding: 0 150px 0 0;
`;

const Row = styled.div`
`;

const Column = styled.div`
    text-indent: 10px;
    &.header {
        font-weight: 700;
        color: white;
        background: #202124;
        line-height: 40px;
        &::first-letter {
            text-transform: capitalize;
        }
    }
    &.content {
        padding: 10px;
        font-size: 14px;
        line-height: 20px;
    }
`;

const ErrorContainer = styled.div`
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
            index: parseInt(query.i, 0) || 0,
            total: 0,
            columns: [],
            labels: [],
            values: [],
            collection: '',
            collectionList: [],
            changed: false,
            error: {
                code: 0,
                msg: '',
            },
        };

        this.urls = [
            index => `/data/${index}`,
            () => '/metadata',
        ];

        this.previousButton = React.createRef();
        this.nextButton = React.createRef();

        this.updateData = this.updateData.bind(this);
        this.uploadData = this.uploadData.bind(this);
    }

    componentDidMount() {
        const { index } = this.state;
        Promise.all(this.urls.map(url => fetch(`${API_URL}${url(index)}`)
            .then((res) => {
                if (res.status !== 200) {
                    throw new Error('Cannot get initial data.');
                }
                return res.json();
            })))
            .then(([document, { database, labels }]) => {
                window.history.replaceState({ index }, `Document #${index}`, `/?i=${index}`);
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
                    collection: database.collection,
                    collectionList: database.all_collections,
                });
            })
            .catch((err) => {
                this.setState({
                    error: {
                        code: 2,
                        msg: err.toString(),
                    },
                });
            });

        window.onpopstate = (event) => {
            const { state } = event;
            if (state && typeof state.index === 'number') {
                this.setState({
                    index: state.index,
                }, () => {
                    this.updateData(this.state.index, true);
                });
            }
        };

        // Keyboard binding
        document.onkeydown = (event) => {
            const { keyCode } = event;
            switch (keyCode) {
                // Left arrow key
                case 37:
                    this.previousButton.current.click();
                    break;
                // Right arrow key
                case 39:
                    this.nextButton.current.click();
                    break;
                default:
            }
        };
    }

    updateData(index, replace = false) {
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
                        error: {
                            code: 1,
                            msg: 'Save document failed.',
                        },
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
                    error: {
                        code: 0,
                        msg: null,
                    },
                }));
            })
            .catch(() => {
                this.setState({
                    error: {
                        code: 1,
                        msg: 'Cannot get the new document.',
                    },
                });
            });
    }

    uploadData(file) {
        const data = new FormData();
        data.append('file', file);

        fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: data,
        })
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(response => console.log(response))
            .catch((error) => {
                this.setState({
                    error: {
                        code: 1,
                        msg: error.toString(),
                    },
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
            collection,
            collectionList,
            error,
        } = this.state;

        return (
            <AppContainer>
                <Navigation
                    onUpdateData={this.updateData}
                    onUpload={file => this.uploadData(file)}
                    onIndexChange={e => this.setState({ index: parseInt(e.target.value, 0) })}
                    index={index}
                    total={total}
                    previousButton={this.previousButton}
                    nextButton={this.nextButton}
                    collection={collection}
                    collectionList={collectionList}
                />
                {
                    error.code === 2 ? (
                        <ErrorContainer>
                            {error.msg}
                        </ErrorContainer>
                    )
                        : (
                            <React.Fragment>
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
                                        error.code === 1 ? (
                                            <ErrorContainer>
                                                {error.msg}
                                            </ErrorContainer>
                                        )
                                            : columns.map(e => (
                                                <Row key={e}>
                                                    <Column className="header">{e}</Column>
                                                    <Column className="content">{document[e]}</Column>
                                                </Row>
                                            ))
                                    }
                                </Table>
                            </React.Fragment>
                        )
                }
            </AppContainer>
        );
    }
}
