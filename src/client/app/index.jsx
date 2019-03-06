import React from 'react';
import { render } from 'react-dom';
import {
    BrowserRouter as Router,
} from 'react-router-dom';
import {
    createStore,
    applyMiddleware,
    compose,
} from 'redux';
import { Provider } from 'react-redux';
import Loadable from 'react-loadable';

import GlobalStyle from './components/GlobalStyle';
import App from './components/App';

// Reducer
import {
    state,
    logger,
    crashReporter,
} from './redux/reducers';

// Create Redux store with initial state
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    state,
    composeEnhancers(applyMiddleware(logger, crashReporter)),
);

const supportsHistory = 'pushState' in window.history;

Loadable.preloadReady().then(() => {
    render(
        <Router forceRefresh={!supportsHistory}>
            <Provider store={store}>
                <React.Fragment>
                    <GlobalStyle />
                    <App />
                </React.Fragment>
            </Provider>
        </Router>,
        document.getElementById('root'),
    );
});
