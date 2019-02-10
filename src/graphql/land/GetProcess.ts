/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetProcess
// ====================================================

export interface GetProcess_process_inComponents {
  __typename: "Component";
  collection: string;
  id: string;
  name: string;
}

export interface GetProcess_process_outComponents {
  __typename: "Component";
  collection: string;
  id: string;
  name: string;
}

export interface GetProcess_process {
  __typename: "Process";
  collection: string;
  id: string;
  name: string;
  inComponents: GetProcess_process_inComponents[];
  outComponents: GetProcess_process_outComponents[];
}

export interface GetProcess {
  process: GetProcess_process | null;
}

export interface GetProcessVariables {
  id: string;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================
