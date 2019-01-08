// Hey Emacs, this is -*- coding: utf-8 -*-

st=require("react-sortable-tree");

tree = [{
  collection: "processes",
  id: "0000",
  title: "Process 1",
  children: [{
    collection: "output",
    title: 'Output Components',
    children: [],
    expanded: true,
  }, {
    collection: "input",
    title: 'Input Components',
    children: [],
    expanded: false,
  }],
  expanded: true,
}]

st.walk({
  treeData: tree,
  getNodeKey: ({node, treeIndex}) => {
    if(node.collection === "output") return "output";
    if(node.collection === "input") return "input";
    return node.collection + "/" + node.id;
  },
  callback: ({node, treeIndex, path}) => {
    console.log(path);
  },
  ignoreCollapsed: true,
})

st.walk();

st.getNodeAtPath

st.

// Hey Emacs, this is coding: utf-8; mode: js2; eval: (tern-mode 1);
