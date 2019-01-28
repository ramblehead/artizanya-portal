// Hey Emacs, this is -*- coding: utf-8 -*-

// /b/{  Local GraphQL Custom Scalars

import { GraphQLScalarType, ValueNode } from 'graphql';

export type IntOrString = number | string;

let intOrStringTypeConditioner =
  (value: string | number) => {
    if(Number.isInteger(value as number) ||
       typeof value === 'string') return value;
    return null;
  };

export const intOrStringType = new GraphQLScalarType({
  name: 'IntOrString',
  description: 'Value of this type can hold both integer numbers and strings.',
  serialize: intOrStringTypeConditioner,
  parseValue: intOrStringTypeConditioner,
  parseLiteral(valueNode: ValueNode) {
    if(valueNode.kind === 'IntValue') return parseInt(valueNode.value, 10);
    if(valueNode.kind === 'StringValue') return valueNode.value;
    return null;
  }
});

// /b/} Local GraphQL Custom Scalars

// /b/{ Local GraphQL Schema and Defaults

const schema = `
scalar IntOrString

type ProcessTreeItemLocalState {
  path: [IntOrString!]!
  expanded: Boolean!
}

type ProcessTreeLocalState {
  treeItems: [ProcessTreeItemLocalState!]!
  activeItemPath: String
  selectedItemsPath: [String!]!
}

extend type Query {
  processTreeLocalState: [ProcessTreeLocalState!]!
  selectedRadioButton: Int!
}
`;

const resolvers = {
  IntOrString: intOrStringType
};

const defaults = {
  processTreeLocalState: [],
  selectedRadioButton: 1
};

export {
  schema,
  resolvers,
  defaults
};

// /b/} Local GraphQL Schema and Defaults
