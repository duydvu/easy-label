import {
    ADD_ONE_LOG,
    ADD_MULTIPLE_LOGS,
} from '../action';

const logs = (
    state = [], action,
) => {
    switch (action.type) {
        case ADD_ONE_LOG:
            return [
                action.log,
                ...state,
            ];
        case ADD_MULTIPLE_LOGS:
            return [
                ...action.logs,
                ...state,
            ];
        default:
            return state;
    }
};

export default logs;
