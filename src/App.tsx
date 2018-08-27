import * as React from 'react';
// import gql from 'graphql-tag';
import { graphql, ChildProps } from 'react-apollo';

import { getElementQueryGql } from './graphql/queries';
import { GetElementQuery,
         GetElementQueryVariables } from './graphql/queries-types';

import './App.css';

const withElement = graphql<GetElementQuery, GetElementQueryVariables>(
  getElementQueryGql, {
    options: ({ id }) => ({
      variables: { id }
    })
  });

class Element extends React.Component<ChildProps<GetElementQueryVariables,
                                                 GetElementQuery>, {}> {
  render() {
    const data = this.props.data!;
    const { loading, error } = data;

    if (loading) { return <div>Loading</div>; }
    if (error) { return <div>Error</div>; }

    const element = data.element!;
    console.log(element);

    return <div>{element.name}</div>;
  }
}

let ElementWithData = withElement(Element);

const logo = require('./logo.svg');

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.ts</code> and save to reload.
        </p>
        <ElementWithData id="0003" />
      </div>
    );
  }
}

export default App;
