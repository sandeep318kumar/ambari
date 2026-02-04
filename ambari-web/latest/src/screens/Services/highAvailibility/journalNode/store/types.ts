export interface State {
    manageJournalNodesSteps: any;
  }
  
  export enum ActionTypes {
    STORE_INFORMATION = "STORE INFORMATION",
    SYNC_STATE = "SYNC STATE",
    REMOVE_KEY = "REMOVE KEY",
  }
  
  export type Action =
    | { type: ActionTypes.STORE_INFORMATION; payload: any }
    | { type: ActionTypes.SYNC_STATE; payload: any }
    | { type: ActionTypes.REMOVE_KEY; payload: any };
