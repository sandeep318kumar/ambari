export interface State {
    enableNamenodeFederationSteps: any;
  }
  
export enum ActionTypes {
  STORE_INFORMATION = "STORE INFORMATION",
  SYNC_STATE = "SYNC STATE",
  REMOVE_KEY = "REMOVE_KEY",
}

export type Action =
  | { type: ActionTypes.STORE_INFORMATION; payload: any }
  | { type: ActionTypes.SYNC_STATE; payload: any }
  | { type: ActionTypes.REMOVE_KEY; payload: { key: string } };
