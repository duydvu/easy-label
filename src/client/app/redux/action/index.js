const ADD_ONE_LOG = 'add new log';
const ADD_MULTIPLE_LOGS = 'add multiple logs';

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

export {
    ADD_ONE_LOG,
    addOneLog,
    ADD_MULTIPLE_LOGS,
    addMulLogs,
};
