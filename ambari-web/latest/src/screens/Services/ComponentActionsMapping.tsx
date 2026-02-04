import { ServiceActionEnums } from "../../enums/ServiceActionEnums.ts";

export const ComponentActionsMapping = {
  HDFS: [
    {
      component: "DATANODE",
      actionMap: {
        actionRestart: ServiceActionEnums.restartDataNodeAction,
      },
    },
    {
      component: "JOURNALNODE",
      actionMap: {
        actionRestart: ServiceActionEnums.restartJournalNodeAction,
      },
    },
    {
      component: "ZKFC",
      actionMap: {
        actionRestart: ServiceActionEnums.restartZKFC,
      },
    },
  ],
  RANGER: [
    {
      component: "RANGER_TAGSYNC",
      actionMap: {
        actionRestart: ServiceActionEnums.restartRangerTagSyncsAction,
      },
    },
  ],
  YARN: [
  {
    component: "NODEMANAGER",
    actionMap: {
      actionRestart: ServiceActionEnums.restartNodeManagerAction,
    },
  },
],
  ZOOKEEPER: [
    {
      component: "ZOOKEEPER_SERVER",
      actionMap: {
        actionRestart: ServiceActionEnums.restartZooKeeperServerAction,
      },
    },
  ],
  PINOT: [
    {
      component: "PINOT_BROKER",
      actionMap: {
        actionRestart: "Restart Pinot Brokers",
      },
    },
    {
      component: "PINOT_MINION",
      actionMap: {
        actionRestart: "Restart Pinot Minions",
      },
    },
    {
      component: "PINOT_SERVER",
      actionMap: {
        actionRestart: "Restart Pinot Servers",
      },
    },
  ],
};
