// -*- coding: utf-8 -*-

export * from 'xregexp';

declare module 'xregexp' {

  interface MatchRecursiveResult {
    name: string;
    value: string;
    start: number;
    end: number;
  }

  function matchRecursive(
    str: string,
    left: string,
    right: string,
    flags?: string,
    options?: {
      valueNames: string[],
      escapeChar?: string
    }):
  string[] | MatchRecursiveResult[];

}
