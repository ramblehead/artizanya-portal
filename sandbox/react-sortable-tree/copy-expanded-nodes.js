// Hey Emacs, this is -*- coding: utf-8 -*-

rst = require("react-sortable-tree");

tree = [{
  collection: "processes",
  id: "0000",
  title: "Process 1",
  children: [{
    collection: "output",
    title: 'Output Components',
    children: [],
  }, {
    collection: "input",
    title: 'Input Components',
    children: [],
    expanded: false,
  }],
  expanded: true,
}]

function getNodeKey({node, treeIndex}) {
  if(node.collection === "output") return "output";
  if(node.collection === "input") return "input";
  return node.collection + "/" + node.id;
}

rst.walk({
  treeData: tree,
  getNodeKey,
  callback: ({node, treeIndex, path}) => {
    console.log(path);
  },
  ignoreCollapsed: true,
})

nodeInfo = rst.getNodeAtPath({
  treeData: tree,
  getNodeKey,
  path: ['processes/0000'],
  ignoreCollapsed: true,
})

!!nodeInfo.node.expanded

rst.
