import * as React from 'react';
import gql from 'graphql-tag';
import { graphql, ChildProps } from 'react-apollo';

import './App.css';

const HERO_QUERY = gql`
  query GetCharacter($episode: String!) {
    hero(episode: $episode) {
      name
      id
      appearsIn {
        title
      }
      friends {
        name
        id
        appearsIn {
          title
        }
      }
    }
  }
`;

interface AppearsIn {
  title: string;
}

interface Hero {
  name: string;
  id: string;
  appearsIn: AppearsIn[];
  friends: Hero[];
}

interface Response {
  hero: Hero;
}

interface InputProps {
  episode: string;
}

const withCharacter = graphql<Response, InputProps>(HERO_QUERY, {
  options: ({ episode }) => ({
    variables: { episode }
  })
});

class Character extends React.Component<ChildProps<InputProps, Response>, {}> {
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
