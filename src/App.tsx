// import gql from 'graphql-tag';

import * as React from 'react';
import { Component } from 'react';
import { Query } from 'react-apollo';

import { getElementGql } from './graphql/queries';
import { GetElement,
         GetElementVariables } from './graphql/queries-types';

import { getElementsGql } from './graphql/queries';
import { GetElements } from './graphql/queries-types';

import SortableTree,
       { FullTree } from 'react-sortable-tree';

import { Button, ButtonGroup } from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-sortable-tree/style.css';
import './App.css';

// type TreeProps = ReactSortableTreeProps;
// type TreeProps = GetElements & ReactSortableTreeProps;

interface TreeState extends FullTree {}

class ElementsQuery extends Query<GetElements, {}> {}

class ElementsTree extends Component<{}, TreeState> {
  // constructor() {
  //   super({treeData: [], onChange: treeData => {}});
  // }

  // constructor(props: TreeProps) {
  //   super(props);
  //
  //   this.state = {
  //     treeData: [{ title: 'Chicken', children: [{ title: 'Egg' }] }],
  //   };
  // }

  render() {
    return (
      <ElementsQuery query={getElementsGql}>
        {({ loading, error, data }) => {
           if (loading) { return <div>Loading</div>; }
           if (error) { return <div>Error</div>; }
           data = data as GetElements;

           this.state = {
             treeData: []
           };

           let elements = data.elements;
           for(let element of elements) {
             this.state.treeData.push({
               id: element.id,
               title: element.name,
               subtitle: element.description
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
        }}
      </ElementsQuery>
    );
  }
}

// Render prop example for stateless functional component
// see https://hackernoon.com/react-stateless-functional-components-nine-wins-you-might-have-overlooked-997b0d933dbc
// see https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce

class ElementQuery extends Query<GetElement, GetElementVariables> {}

const ElementX = ({ id }: GetElementVariables) => (
  <ElementQuery query={getElementGql} variables={{ id }}>
    {({ loading, error, data }) => {
       if (loading) { return <div>Loading</div>; }
       if (error) { return <div>Error</div>; }
       return <div>{data!.element!.name}</div>;
    }}
  </ElementQuery>
);

// Render prop example for class component

class ElementY extends Component<GetElementVariables, {}> {
  constructor(props: GetElementVariables) {
    super(props);

    // this.state = {
    //   treeData: [{ title: 'Chicken', children: [{ title: 'Egg' }] }],
    // };
  }

  render() {
    return (
      <ElementQuery query={getElementGql} variables={{ id: this.props.id }}>
        {({ loading, error, data }) => {
           if (loading) { return <div>Loading</div>; }
           if (error) { return <div>Error</div>; }
           return <div>{data!.element!.name}</div>;
        }}
      </ElementQuery>
    );
  }
}

class RadioButtons extends Component<{}, { selected: number }> {
  constructor(props: {}) {
    super(props);

    this.state = { selected: 1 };
  }

  onRadioBtnClick = (selected: number) => this.setState({ selected });

  render() {
    return (
      <div>
        <ButtonGroup>
          <Button
            color="primary"
            onClick={() => this.onRadioBtnClick(1)}
            active={this.state.selected === 1}
          >
            One
          </Button>
          <Button
            color="primary"
            onClick={() => this.onRadioBtnClick(2)}
            active={this.state.selected === 2}
          >
            Two
          </Button>
          <Button
            color="primary"
            onClick={() => this.onRadioBtnClick(3)}
            active={this.state.selected === 3}
          >
            Three
          </Button>
        </ButtonGroup>
      </div>
    );
  }
}

class SelectedButtonIndicator extends Component<{}, { selected: number }> {
  constructor(props: {}) {
    super(props);

    this.state = { selected: 1 };
  }

  render() {
    return (
      <div>
        <p>Selected: {this.state.selected}</p>
      </div>
    );
  }
}

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
        <ElementX id="0002" />
        <ElementY id="0001" />
        <ElementsTree />
        <RadioButtons />
        <SelectedButtonIndicator />
      </div>
    );
  }
}

export default App;
