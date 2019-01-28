// Hey Emacs, this is -*- coding: utf-8 -*-

const schema = `
type ExpandedNodePath {
  value: [String!]!
}

extend type Query {
  expandedNodePaths: [ExpandedNodePath!]!
  selectedRadioButton: Int!
}
`;

const resolvers = {
};

const defaults = {
  selectedRadioButton: 1,
  expandedNodePaths: []
};

export {
  schema,
  resolvers,
  defaults
};
