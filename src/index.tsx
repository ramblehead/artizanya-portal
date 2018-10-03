import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { resolvers as localResolvers,
         defaults as localDefaults } from './graphql/local-resolvers';

// const localSchemaString =
//   fs.readFileSync(path.resolve(__dirname, 'graphql/local.graphql'), 'utf8');

const localSchemaString = `
# Hey Emacs, this is -*- coding: utf-8 -*-

type Query {
  selectedRadioButton: Number!
}

schema {
  query: Query
}
`;


import './index.css';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const httpLink = new HttpLink({
  uri: 'http://localhost:8529/_db/_system/land'
});

const cache = new InMemoryCache();

const stateLink = withClientState({
  cache,
  resolvers: localResolvers,
  defaults: localDefaults,
  typeDefs: localSchemaString
});

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([stateLink, httpLink]),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root') as HTMLElement
);

registerServiceWorker();
