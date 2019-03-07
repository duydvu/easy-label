import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

const LogsModal = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #ffffff;
    height: 80%;
    width: 80%;
    padding: 15px;
    overflow: auto;
    border-radius: 4px;
    table {
        border-collapse: collapse;
        width: 100%;
    }
    th {
        background: #dddddd;
        padding: 10px 0;
    }
    td, th {
        border: 1px solid #dddddd;
        text-align: center;
    }
`;

function ActionLogs(props) {
    const {
        logs,
    } = props;

    return (
        <LogsModal>
            <table>
                <tbody>
                    <tr>
                        <th>Action</th>
                        <th>Index</th>
                        <th>Date</th>
                        <th>Data</th>
                    </tr>
                    {
                        logs.map((e, i) => (
                            <tr key={i}>
                                <td>{e.action}</td>
                                <td>{e.index}</td>
                                <td>{new Date(e.date.$date).toLocaleString()}</td>
                                <td>{JSON.stringify(e.detail)}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </LogsModal>
    );
}

export default connect(
    state => ({ logs: state.logs }),
    () => ({}),
)(ActionLogs);
