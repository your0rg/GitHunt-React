import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import * as ReactGA from 'react-ga';
// Polyfill fetch
import 'isomorphic-fetch';

import './style/index.css';

import routes from './routes';
import createApolloClient from './helpers/create-apollo-client';

// const wsClient = new Client('ws://localhost:8080');

const networkInterface = createNetworkInterface({
  uri: '/graphql',
  opts: {
    credentials: 'same-origin',
  },
  // transportBatching: true,
});

// const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
//   networkInterface,
//   // wsClient,
// );

// Initialize Analytics
ReactGA.initialize('UA-74643563-4');

function logPageView() {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
}

const client = createApolloClient({
  networkInterface,
  initialState: window.__APOLLO_STATE__, // eslint-disable-line no-underscore-dangle
});

render((
  <ApolloProvider client={client}>
    <Router history={browserHistory} onUpdate={logPageView}>
      {routes}
    </Router>
  </ApolloProvider>
), document.getElementById('content'));
