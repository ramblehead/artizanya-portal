// -*- coding: utf-8; mode: typescript -*-

declare module 'xregexp' {
  function matchRecursive(
    str: string,
    left: string,
    right: string,
    flags: string,
    options: {
      valueNames: string[],
      escapeChar?: string
    }): { name: string, value: string, start: number, end: number }[];
}

declare module 'graphql-tag' {
  function gql(literals: any, ...placeholders: any[]): any;
  export = gql;
}
