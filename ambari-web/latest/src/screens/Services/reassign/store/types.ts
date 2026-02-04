export interface State {
    reassignSteps: any;
    componentName?: string;
  }
  
  export enum ActionTypes {
    STORE_INFORMATION = "STORE INFORMATION",
    SYNC_STATE = "SYNC STATE",
    SET_COMPONENT_NAME = "SET COMPONENT NAME",
    REMOVE_KEY = "REMOVE KEY",
  }
  
  export type Action =
    | { type: ActionTypes.STORE_INFORMATION; payload: any }
    | { type: ActionTypes.SYNC_STATE; payload: any }
    | { type: ActionTypes.SET_COMPONENT_NAME; payload: string }
    | { type: ActionTypes.REMOVE_KEY; payload: { key: string } };
