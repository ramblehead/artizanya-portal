// import gql from 'graphql-tag';

import * as React from 'react';
import { Component } from 'react';
import { graphql, ChildProps } from 'react-apollo';

import { getElementGql } from './graphql/queries';
import { GetElement,
         GetElementVariables } from './graphql/queries-types';

import { getElementIdsGql } from './graphql/queries';
import { GetElementIds } from './graphql/queries-types';

import SortableTree,
       { ReactSortableTreeProps,
         FullTree as TreeState } from 'react-sortable-tree';

import 'react-sortable-tree/style.css';
import './App.css';

type TreeProps =
  ChildProps<{}, GetElementIds> & ReactSortableTreeProps;

const withElementIds = graphql<{}, GetElementIds>(
  getElementIdsGql, {
    options: () => ({
      variables: {}
    })
  });

class Tree extends Component<TreeProps, TreeState> {
  // constructor(props: any) {
  //   super(props);
  //
  //   this.state = {
  //     treeData: [{ title: 'Chicken', children: [{ title: 'Egg' }] }],
  //   };
  // }

  render() {
    const data = this.props.data!;
    const { loading, error } = data;

    if (loading) { return <div>Loading</div>; }
    if (error) { return <div>Error</div>; }

    this.state = {
      treeData: []
    };

    let elementIds = data.elementIds!.slice();
    elementIds.sort();
    for(let elementId of elementIds) {
      this.state.treeData.push({
        title: elementId
        // subtitle: element.description
      });
    }

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

let TreeWithData = withElementIds(Tree);

const withElement = graphql<GetElementVariables, GetElement>(
  getElementGql, {
    options: ({ id }) => ({
      variables: { id }
    })
  });

class Element extends Component<ChildProps<GetElementVariables,
                                           GetElement>, {}>
{
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
        <TreeWithData />
      </div>
    );
  }
}

export default App;
