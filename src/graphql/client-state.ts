// Hey Emacs, this is -*- coding: utf-8 -*-

const typeDefs = `
extend type Query {
  expandedNodes: [String!]!
  selectedRadioButton: Int!
}
`;

const resolvers = {
};

const defaults = {
  selectedRadioButton: 1,
  expandedNodes: []
};

export {
  typeDefs,
  resolvers,
  defaults
};
