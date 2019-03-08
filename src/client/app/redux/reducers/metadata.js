import {
    INIT_METADATA,
} from '../action';

const logs = (
    state = {
        total: 0,
        columns: [],
        labels: [],
        collectionList: [],
    }, action,
) => {
    const {
        total,
        columns,
        labels,
        collectionList,
    } = action;
    switch (action.type) {
        case INIT_METADATA:
            return {
                total,
                columns,
                labels,
                collectionList,
            };
        default:
            return state;
    }
};

export default logs;
