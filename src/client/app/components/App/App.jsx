import React from 'react';
import styled from 'styled-components';
import queryString from 'query-string';

import LabelsCollection from '../LabelsCollection';
import Navigation from '../Navigation';

const AppContainer = styled.div``;

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

        this.updateData = this.updateData.bind(this);
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
                    this.updateData(this.state.index, true);
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
                        error: 'Save document failed.',
                    });
                });
        }
        fetch(`${API_URL}${this.urls[0](index)}`).then(res => res.json())
            .then((document) => {
                if (!document) {
                    this.setState({
                        error: 'Cannot get the new document.',
                    });
                    return;
                }
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

        return (
            <AppContainer>
                <Navigation
                    onUpdateData={this.updateData}
                    onIndexChange={e => this.setState({ index: parseInt(e.target.value, 0) })}
                    index={index}
                    total={total}
                    previousButton={this.previousButton}
                    nextButton={this.nextButton}
                />
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
                        error ? (
                            <Error>
                                {error}
                            </Error>
                        )
                            : columns.map(e => (
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
