// import gql from 'graphql-tag';

import * as React from 'react';
import { Component } from 'react';
// import { graphql, ChildProps } from 'react-apollo';
// 
// import { getElementQueryGql } from './graphql/queries';
// import { GetElement,
//          GetElementVariables } from './graphql/queries-types';

import SortableTree from 'react-sortable-tree';

import 'react-sortable-tree/style.css';
import './App.css';

class Tree extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      treeData: [{ title: 'Chicken', children: [{ title: 'Egg' }] }],
    };
  }

  render() {
    return (
      <div style={{ height: 400 }}>
        <SortableTree
          treeData={this.state.treeData}
          onChange={treeData => this.setState({ treeData })}
        />
      </div>
    );
  }
}

// const withElement = graphql<GetElement, GetElementVariables>(
//   getElementQueryGql, {
//     options: ({ id }) => ({
//       variables: { id }
//     })
//   });

// class Element extends Component<ChildProps<GetElementVariables,
//                                            GetElement>, {}> {
//   render() {
//     const data = this.props.data!;
//     const { loading, error } = data;
// 
//     if (loading) { return <div>Loading</div>; }
//     if (error) { return <div>Error</div>; }
// 
//     const element = data.element!;
//     console.log(element);
// 
//     return <div>{element.name}</div>;
//   }
// }
// 
// let ElementWithData = withElement(Element);

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
          {/*<ElementWithData id="0003" />*/}
        <Tree />
      </div>
    );
  }
}

export default App;
