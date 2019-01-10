// import gql from 'graphql-tag';

// import * as _ from 'lodash';

import * as React from 'react';
import { Component } from 'react';
import { Query } from 'react-apollo';

import { getElementGql } from './graphql/land';
import { GetElement,
         GetElementVariables } from './graphql/land-types';

import { getProcessGql } from './graphql/land';
import { GetProcess,
         GetProcessVariables } from './graphql/land-types';

import * as rst from 'react-sortable-tree';

import SortableTree,
       { FullTree } from 'react-sortable-tree';


// import * as treeUtils from 'react-sortable-tree/utils/tree-data-utils';
// treeUtils.walk

import { Button, ButtonGroup } from 'reactstrap';

// import gql from 'graphql-tag';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-sortable-tree/style.css';
import './App.css';
import { ApolloClient } from 'apollo-client';

// type TreeProps = ReactSortableTreeProps;
// type TreeProps = GetElements & ReactSortableTreeProps;

interface TreeState extends FullTree {}

class ElementsQuery extends Query<GetProcess, GetProcessVariables> {}

class ElementsTree extends Component<GetProcessVariables, TreeState> {
  constructor(props: GetProcessVariables) {
    super(props);

    this.state = {
      treeData: []
    };
  }

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
      <ElementsQuery query={getProcessGql} variables={{ id: this.props.id }}>
        {({ loading, error, data }) => {
           if (loading) { return <div>Loading</div>; }
           if (error) { return <div>Error</div>; }
           data = data as GetProcess;

           const process = data.process!;

           const prevTreeData = this.state.treeData;

           this.state = {
             treeData: []
           };

           this.state.treeData.push({
             collection: process.collection,
             id: process.id,
             title: process.name,
             children: [{
               collection: 'output',
               title: 'Output Components',
               children: [],
             }, {
               collection: 'input',
               title: 'Input Components',
               children: [],
             }],
           });

           let outComponents = this.state.treeData[0].children![0].children!;

           for(let component of process.outComponents) {
             outComponents.push({
               collection: process.collection,
               id: component.id,
               title: component.name,
             });
           }

           let inComponents = this.state.treeData[0].children![1].children!;

           for(let component of process.inComponents) {
             inComponents.push({
               collection: process.collection,
               id: component.id,
               title: component.name,
             });
           }

           function getNodeKey({node}: rst.TreeNode & rst.TreeIndex): string {
             if(node.collection === 'output') return 'output';
             if(node.collection === 'input') return 'input';
             return node.collection + '/' + node.id;
           }

           rst.walk({
             treeData: this.state.treeData,
             getNodeKey,
             callback: ({node, path}: rst.FlatDataItem & rst.TreeIndex) => {
               console.log(path);

               const nodeInfo = rst.getNodeAtPath({
                 treeData: prevTreeData,
                 getNodeKey,
                 path,
                 ignoreCollapsed: false,
               });

               if(nodeInfo) {
                 node.expanded = nodeInfo.node.expanded;
               }

             },
             ignoreCollapsed: false,
           });


           // onVisibilityToggle={({node, expanded}) => {
           // }}
           return (
             <div style={{ height: 600 }}>
               <SortableTree
                 treeData={this.state.treeData}
                 onChange={treeData => this.setState({treeData})}
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

import { getSelectedRadioButtonGql } from './graphql/client';
import { GetSelectedRadioButton } from './graphql/client-types';

// const getSelectedRadioButtonGql = gql`
// {
//   selectedRadioButton @client
// }
// `;
//
// interface GetSelectedRadioButton {
//   selectedRadioButton: number;
// }

class SelectedRadioButtonQuery extends Query<GetSelectedRadioButton, {}> {}

class RadioButtons extends Component {
  onRadioButtonClick(selected: number, client: ApolloClient<any>) {
    client.writeData({ data: { selectedRadioButton : selected } });
  }

  render() {
    return (
      <SelectedRadioButtonQuery query={getSelectedRadioButtonGql}>
        {({ loading, error, data, client }) => {
           if (loading) { return <div>Loading</div>; }
           if (error) { return <div>Error</div>; }
           data = data as GetSelectedRadioButton;

           return (
             <div>
               <ButtonGroup>
                 <Button
                   color="primary"
                   onClick={() => this.onRadioButtonClick(1, client)}
                   active={data.selectedRadioButton === 1}
                 >
                   One
                 </Button>
                 <Button
                   color="primary"
                   onClick={() => this.onRadioButtonClick(2, client)}
                   active={data.selectedRadioButton === 2}
                 >
                   Two
                 </Button>
                 <Button
                   color="primary"
                   onClick={() => this.onRadioButtonClick(3, client)}
                   active={data.selectedRadioButton === 3}
                 >
                   Three
                 </Button>
               </ButtonGroup>
             </div>
           );
        }}
      </SelectedRadioButtonQuery>
    );
  }
}

class SelectedButtonIndicator extends Component {
  // constructor(props: {}) {
  //   super(props);
  //
  //   this.state = { selected: 1 };
  // }

  render() {
    return (
      <SelectedRadioButtonQuery query={getSelectedRadioButtonGql}>
        {({ loading, error, data }) => {
           data = data as GetSelectedRadioButton;
           return (
             <div>
               <p>Selected: {data.selectedRadioButton}</p>
             </div>
           );
        }}
      </SelectedRadioButtonQuery>
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
        <ElementsTree id="0000" />
        <RadioButtons />
        <SelectedButtonIndicator />
      </div>
    );
  }
}

export default App;
