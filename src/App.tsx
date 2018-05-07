import * as React from 'react';
// import gql from 'graphql-tag';
import { graphql, ChildProps } from 'react-apollo';
import { getCharacterQueryGql } from './graphql/queries';
import { GetCharacterQuery,
         GetCharacterQueryVariables } from './graphql/queries-types';

import './App.css';

// const { getCharacterQueryGql } = require('./graphql/queries');

// const getCharacterQueryGql = gql`
//   query GetCharacter($episode: String!) {
//     hero(episode: $episode) {
//       name
//       id
//       appearsIn {
//         title
//       }
//       friends {
//         name
//         id
//         appearsIn {
//           title
//         }
//       }
//     }
//   }
// `

// interface AppearsIn {
//   title: string;
// }
//
// interface Hero {
//   name: string;
//   id: string;
//   appearsIn: AppearsIn[];
//   friends: Hero[];
// }
//
// interface GetCharacterQuery {
//   hero: Hero;
// }
//
// interface GetCharacterQueryVariables {
//   episode: string;
// }

const withCharacter = graphql<GetCharacterQuery, GetCharacterQueryVariables>(
  getCharacterQueryGql, {
    options: ({ episode }) => ({
      variables: { episode }
    })
  });

class Character extends React.Component<ChildProps<GetCharacterQueryVariables,
                                                   GetCharacterQuery>, {}> {
  render() {
    const data = this.props.data!;
    const { loading, error } = data;

    if (loading) { return <div>Loading</div>; }
    if (error) { return <div>Error</div>; }

    const hero = data.hero!;
    console.log(hero);

    return <div>{hero.name}</div>;
  }
}

let CharacterWithData = withCharacter(Character);

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
        <CharacterWithData episode="Awakens" />
      </div>
    );
  }
}

export default App;
