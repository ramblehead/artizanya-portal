// Hey Emacs, this is -*- coding: utf-8 -*-

import { loader as gqlLoader } from 'graphql.macro';

const getElementGql = gqlLoader('./land/GetElement.graphql');
const getProcessGql = gqlLoader('./land/GetProcess.graphql');

export {
  getElementGql,
  getProcessGql
};
