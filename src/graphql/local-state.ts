// Hey Emacs, this is -*- coding: utf-8 -*-

// /b/{  Local GraphQL Custom Scalars

import { GraphQLScalarType, ValueNode } from 'graphql';

export type NumberOrString = number | string;

let mumberOrStringTypeCondition =
  (value: string | number): string | number | null => {
    if(Number.isInteger(value as number) ||
       typeof value === 'string') return value;
    return null;
  };

export const mumberOrStringType = new GraphQLScalarType({
  name: 'NumberOrString',
  description: 'Value of this type can hold both integer numbers and strings.',
  serialize: mumberOrStringTypeCondition,
  parseValue: mumberOrStringTypeCondition,
  parseLiteral(valueNode: ValueNode): string | number | null {
    if(valueNode.kind === 'IntValue') return parseInt(valueNode.value, 10);
    if(valueNode.kind === 'StringValue') return valueNode.value;
    return null;
  }
});

// /b/} Local GraphQL Custom Scalars

// /b/{ Local GraphQL Schema and Defaults

const schema = `
scalar NumberOrString

type ProcessTreeItemLocalState {
  path: [NumberOrString!]!
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
  NumberOrString: mumberOrStringType
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
