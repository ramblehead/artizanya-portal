// Hey Emacs, this is -*- coding: utf-8 -*-

const typeDefs = `
extend type Query {
  selectedRadioButton: Int!
}
`;

const resolvers = {
};

const defaults = {
  selectedRadioButton: 1
};

export {
  typeDefs,
  resolvers,
  defaults
};
