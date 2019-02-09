// Hey Emacs, this is -*- coding: utf-8 -*-

import { loader as gqlLoader } from 'graphql.macro';

const gqlGetElementGql = gqlLoader('./GetElement.graphql');
const gqlGetProcessGql = gqlLoader('./GetProcess.graphql');

export {
  gqlGetElementGql,
  gqlGetProcessGql
};
