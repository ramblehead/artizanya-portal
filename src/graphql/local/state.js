// Hey Emacs, this is -*- coding: utf-8 -*-

// /b/{  Local GraphQL Custom Scalars

// import { GraphQLScalarType, ValueNode } from 'graphql';
// import gql from 'graphql-tag';
// import { gql } from 'graphql.macro';

// export type IntOrString = number | string;

// const intOrStringTypeConditioner =
//   (value: string | number) => {
//     if(Number.isInteger(value as number) ||
//        typeof value === 'string') return value;
//     return null;
//   };

// export const intOrStringType = new GraphQLScalarType({
//   name: 'IntOrString',
//   description: 'Value of this type can hold both integer numbers and strings.',
//   serialize: intOrStringTypeConditioner,
//   parseValue: intOrStringTypeConditioner,
//   parseLiteral(valueNode: ValueNode) {
//     if(valueNode.kind === 'IntValue') return parseInt(valueNode.value, 10);
//     if(valueNode.kind === 'StringValue') return valueNode.value;
//     return null;
//   }
// });

// const intOrStringType = new GraphQLScalarType({
//   name: 'IntOrString',
//   description: 'Value of this type can hold both integer numbers and strings.',
//   serialize(value: string | number) {
//     if(Number.isInteger(value as number) ||
//        typeof value === 'string') return value;
//     return null;
//   },
//   parseValue(value: string | number) {
//     if(Number.isInteger(value as number) ||
//        typeof value === 'string') return value;
//     return null;
//   },
//   parseLiteral(ast: ValueNode) {
//     if(ast.kind === 'IntValue') return parseInt(ast.value, 10);
//     if(ast.kind === 'StringValue') return ast.value;
//     return null;
//   }
// });

// /b/} Local GraphQL Custom Scalars

// /b/{ Local GraphQL Schema and Defaults

// const schema = gqlLoader('./local-state.graphql');

const schema = `
type ProcessTreeItemLocalState {
  path: [String!]!
  expanded: Boolean!
}

extend type Query {
  treeItem: ProcessTreeItemLocalState!
  selectedRadioButton: Int!
}
`;

const resolvers = {
};

const defaults = {
  treeItem: {
    __typename: 'ProcessTreeItemLocalState',
    path: [],
    expanded: false
  },
  selectedRadioButton: 1
};

export {
  schema,
  resolvers,
  defaults
};

// /b/} Local GraphQL Schema and Defaults
