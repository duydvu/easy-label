import React from 'react';
import styled from 'styled-components';
import queryString from 'query-string';

const AppContainer = styled.div`
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
`;

const Header = styled.div`
    display: flex;
    justify-content: center;
    padding: 10px;
`;

const Button = styled.button`
    margin: 0 10px;
    cursor: pointer;
`;

const Table = styled.div`
    display: grid;
    grid-template-rows: auto auto;
`;

const Row = styled.div`
`;

const Column = styled.div`
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
        };

        this.urls = [
            '/metadata',
            `/data/${this.state.index}`,
        ];

        this.changeDocument = this.changeDocument.bind(this);
    }

    componentDidMount() {
        Promise.all(this.urls.map(url => fetch(`${API_URL}${url}`).then(res => res.json())))
            .then((data) => {
                this.setState({
                    total: data[0].count,
                    columns: data[0].keys.filter(e => e !== '_id' && e !== 'index'),
                    document: data[1],
                });
            });
    }

    changeDocument(index) {
        fetch(`${API_URL}/data/${index}`).then(res => res.json())
            .then((document) => {
                window.history.pushState(`/?i=${index}`, `Document #${index}`);
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
                <Header>
                    <Button onClick={() => this.changeDocument(this.state.index - 1)}>
                        previous
                    </Button>
                    <div>{`${index} / ${total}`}</div>
                    <Button onClick={() => this.changeDocument(this.state.index + 1)}>
                        next
                    </Button>
                </Header>
                <Table>
                    {
                        columns.map(e => (
                            <Row key={e}>
                                <Column>{e}</Column>
                                <Column>{document[e]}</Column>
                            </Row>
                        ))
                    }
                </Table>
            </AppContainer>
        );
    }
}
