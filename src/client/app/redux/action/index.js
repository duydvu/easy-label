const ADD_ONE_LOG = 'add new log';
const ADD_MULTIPLE_LOGS = 'add multiple logs';
const INIT_METADATA = 'initialize metadata';

/**
 * @typedef {Object} Log
 * @property {string} action - type of the log
 * @property {Object} detail - object contains detail of the log
 */

/**
 * @param {Log} log - log to be added
 */
const addOneLog = log => ({
    type: ADD_ONE_LOG,
    log,
});

/**
 * @param {Log[]} logs - array of logs to be added
 */
const addMulLogs = logs => ({
    type: ADD_MULTIPLE_LOGS,
    logs,
});

/**
 * @param {number} total - The total number of documents
 * @param {string[]} columns - Array of columns from the document keys
 * @param {Object[]} labels - Hold information of the labels
 * @param {string} labels[].type - Data type of the label
 * @param {string} labels[].name - Label's name
 * @param {string[]} collectionList - List of collection names from the database
 */
const initMetadata = (total, columns, labels, collectionList) => ({
    type: INIT_METADATA,
    total,
    columns,
    labels,
    collectionList,
});

export {
    ADD_ONE_LOG,
    ADD_MULTIPLE_LOGS,
    INIT_METADATA,
    addOneLog,
    addMulLogs,
    initMetadata,
};
