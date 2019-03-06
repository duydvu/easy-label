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
                ...state,
                action.log,
            ];
        case ADD_MULTIPLE_LOGS:
            return [
                ...state,
                ...action.logs,
            ];
        default:
            return state;
    }
};

export default logs;
