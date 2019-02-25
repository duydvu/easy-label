import React from 'react';
import styled from 'styled-components';
import queryString from 'query-string';

import LabelsCollection from '../LabelsCollection';

const AppContainer = styled.div`
    &, * {
        font-family: 'Roboto', sans-serif;
        font-weight: 300;
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
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    z-index: 100;
    background: white;
    box-shadow: 0px 2px 9px rgba(0, 0, 0, 0.4);
`;

const Button = styled.button`
    margin: 10px;
    min-width: 100px;
    height: 30px;
    cursor: pointer;
`;

const LabelSection = styled.div`
    position: fixed;
    top: 50px;
    right: 0;
    width: 150px;
    height: calc(100% - 50px);
    background: lightgray;
    box-sizing: border-box;
`;

const Table = styled.div`
    padding: 50px 150px 0 0;
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
    }
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
        };

        this.urls = [
            index => `/data/${index}`,
            () => '/metadata',
        ];

        this.changeDocument = this.changeDocument.bind(this);
    }

    componentDidMount() {
        const { index } = this.state;
        Promise.all(this.urls.map(url => fetch(`${API_URL}${url(index)}`).then(res => res.json())))
            .then((data) => {
                window.history.replaceState({ index }, `Document #${index}`, `/?i=${index}`);
                this.setState({
                    document: data[0],
                    total: data[1].database.count,
                    columns: data[1].database.keys.filter(e => e !== '_id' && e !== 'index'),
                    labels: data[1].labels,
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
    }

    changeDocument(index, replace = false) {
        if (index < 0) return;
        fetch(`${API_URL}${this.urls[0](index)}`).then(res => res.json())
            .then((document) => {
                window.history[replace ? 'replaceState' : 'pushState']({ index }, `Document #${index}`, `/?i=${index}`);
                this.setState({
                    document,
                    index,
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
                <Navigation>
                    <Button onClick={() => this.changeDocument(index - 1)}>
                        previous
                    </Button>
                    <div>{`${index} / ${total}`}</div>
                    <Button onClick={() => this.changeDocument(index + 1)}>
                        next
                    </Button>
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
