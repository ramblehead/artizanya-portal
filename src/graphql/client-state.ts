// Hey Emacs, this is -*- coding: utf-8 -*-

const resolvers = {
};

const defaults = {
  selectedRadioButton: 1
};

const typeDefs = `
type Query {
  selectedRadioButton: Number!
}

schema {
  query: Query
}
`;

export {
  resolvers,
  defaults,
  typeDefs
};
