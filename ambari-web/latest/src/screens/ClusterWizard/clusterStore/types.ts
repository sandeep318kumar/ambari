export interface State {
  clusterCreationSteps: any;
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

export enum ServiceType {
  HDFS = "HDFS",
  ONEFS = "ONEFS",
  HBASE = "HBASE",
  YARN = "YARN",
  MAPREDUCE2 = "MAPREDUCE2",
  STORM = "STORM",
  RANGER = "RANGER",
  FLUME = "FLUME",
}
