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
    }
    td, th {
        border: 1px solid #dddddd;
        text-align: center;
        padding: 10px 0;
    }
    .header {
        text-transform: capitalize;
    }
`;

function LabelColumns(props) {
    const {
        labels,
        detail,
    } = props;

    return labels.map((e) => {
        switch (e.type) {
            case 'boolean':
                return (
                    <td key={e.name}>{detail[e.name].toString()}</td>
                );
            default:
                alert('Unknown label type');
                return null;
        }
    });
}

function ActionLogs(props) {
    const {
        logs,
        labels,
    } = props;

    return (
        <LogsModal>
            <table>
                <tbody>
                    <tr>
                        <th />
                        <th>Action</th>
                        <th>Index</th>
                        <th>Date</th>
                        {
                            labels.map(e => (
                                <th key={e.name} className="header">{e.name}</th>
                            ))
                        }
                    </tr>
                    {
                        logs.map((e, i) => (
                            <tr key={new Date(e.date.$date).toString()}>
                                <td>{i + 1}</td>
                                <td>{e.action}</td>
                                <td>{e.index}</td>
                                <td>{new Date(e.date.$date).toLocaleString()}</td>
                                <LabelColumns labels={labels} detail={e.detail} />
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </LogsModal>
    );
}

export default connect(
    (state) => {
        const {
            labels,
        } = state.metadata;
        return {
            labels,
            logs: state.logs,
        };
    },
    () => ({}),
)(ActionLogs);
