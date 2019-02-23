// import React
import React from 'react';
import { render } from 'react-dom';
import {
    BrowserRouter as Router,
} from 'react-router-dom';
import { createStore } from 'redux';
import Loadable from 'react-loadable';

import App from './components/App';

// Reducer
import state from './redux/reducers';

// Create Redux store with initial state
const store = createStore(
    state,
    null,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

const supportsHistory = 'pushState' in window.history;

Loadable.preloadReady().then(() => {
    render(
        <Router forceRefresh={!supportsHistory}>
            <App store={store} />
        </Router>,
        document.getElementById('root'),
    );
});
