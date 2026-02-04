import { useContext, useEffect, useState } from "react";
import { getStepData } from "../../../../Utils/Utility";
import { EnableHighAvailibilityContext } from "./store/context";
import { filter, find, map } from "lodash";
import { startServices, updateComponent } from "../../../../Utils/taskUtils";
import { AppContext } from "../../../../store/context";
import { ServiceContext } from "../../../../store/ServiceContext";
import OperationsProgress from "../../../../components/OperationsProgress";
import WizardFooter from "../../../../components/StepWizard/WizardFooter";
import { ActionTypes } from "./store/types";
import { enableNamenodeSteps } from "./wizardSteps";

enum COMMANDS {
  startZooKeeperServers = "startZooKeeperServers",
  startAmbariInfra = "startAmbariInfra",
  startMysqlServer = "startMysqlServer",
  startRanger = "startRanger",
  startNameNode = "startNameNode",
}

function Step7() {
  const {
    state,
    dispatch,
    flushStateToDb,
    stepWizardUtilities: { currentStep, handleNextImperitive, jumpToStep },
  } = useContext(EnableHighAvailibilityContext);
  const { clusterName, services } = useContext(AppContext);
  const { serviceModels: allServiceModels }: any = useContext(ServiceContext);
  const [completionStatus, setCompletionStatus] = useState(false);
  const [stepOperations, setStepOperations] = useState<any>([]);
  const masterComponentHosts = getStepData(
    state,
    "SELECT_HOSTS",
    "masterComponentHosts",
    "enableHighAvailibilitySteps"
  );

  const selectedServices = map(services, "ServiceInfo.service_name");

  function initializeTasks() {
    let id = 0;
    const allOps = [];
    const tasksToRemove = [];
    const rangerMasterComponents =
      allServiceModels?.["ranger"]?.masterComponents;
    if (!selectedServices.includes("AMBARI_INFRA_SOLR")) {
      tasksToRemove.push(COMMANDS.startAmbariInfra);
    }
    if (
      !selectedServices.includes("RANGER")||
      find(rangerMasterComponents, ["componentName", "RANGER_ADMIN"])
        ?.installedCount === 0
    ) {
      tasksToRemove.push(COMMANDS.startRanger);
    }
    tasksToRemove.push(COMMANDS.startMysqlServer);

    if (!tasksToRemove.includes(COMMANDS.startZooKeeperServers)) {
      allOps.push({
        id: id++,
        label: "Start Zookeeper Servers",
        skippable: false,
        callback: async () => {
          const hostNames = map(
            filter(masterComponentHosts, ["component", "ZOOKEEPER_SERVER"]),
            "hostName"
          );
          return await updateComponent(
            clusterName,
            "ZOOKEEPER_SERVER",
            hostNames,
            "HDFS",
            "Start",
            1
          );
        },
      });
    }
    if (!tasksToRemove.includes(COMMANDS.startAmbariInfra)) {
      allOps.push({
        id: id++,
        label: "Start Ambari Infra",
        skippable: false,
        callback: async () => {
          return await startServices(
            clusterName,
            false,
            ["AMBARI_INFRA_SOLR"],
            true
          );
        },
      });
    }
    if (!tasksToRemove.includes(COMMANDS.startRanger)) {
      const hostNames = map(
        filter(masterComponentHosts, ["component", "RANGER_ADMIN"]),
        "hostName"
      );
      allOps.push({
        id: id++,
        label: "Start Ranger",
        skippable: false,
        callback: async () => {
          return await updateComponent(
            clusterName,
            "RANGER_ADMIN",
            hostNames,
            "RANGER",
            "Start",
            1
          );
        },
      });
    }
    if (!tasksToRemove.includes(COMMANDS.startNameNode)) {
      const hostName=map(filter(masterComponentHosts, (masterComponentHost:any)=>{
        return masterComponentHost.component === "NAMENODE" && masterComponentHost.isInstalled;
      }),"hostName");
      allOps.push({
        id: id++,
        label: "Start NameNode",
        skippable: false,
        callback: async () => {
          return await updateComponent(
            clusterName,
            "NAMENODE",
            hostName,
            "HDFS",
            "Start",
            1
          );
        },
      });
    }
    return allOps;
  }
 const savedOperationsState = getStepData(
    state,
    enableNamenodeSteps.START_COMPONENTS,
    "operationsState",
    "enableHighAvailibilitySteps"
  );
  useEffect(()=>{
    const operations = (() => {
       const initialOperations = initializeTasks();
      if (savedOperationsState && Array.isArray(savedOperationsState)) {
        return initialOperations.map((originalOp) => {
          const savedOp = savedOperationsState.find(
            (saved: any) => saved.id === originalOp.id
          );
          return savedOp
            ? { ...originalOp, ...savedOp, callback: originalOp.callback }
            : originalOp;
        });
      }

      return initialOperations;
    })();
    setStepOperations(operations);
  },[JSON.stringify(savedOperationsState)])

  useEffect(() => {
    initializeTasks();
  }, []);

  //START GENAI





  if (!stepOperations || stepOperations.length === 0) {
    return <div>Loading...</div>;
  }

  //END GENAI

  return (
    <>
      <OperationsProgress
        title=""
        description=""
        setCompletionStatus={setCompletionStatus}
        operations={stepOperations as any}
        dispatch={(operationsState: any) => {
          dispatch({
            type: ActionTypes.STORE_INFORMATION,
            payload: {
              step: currentStep.name,
              data: {
                operationsState,
              },
            },
          });
        }}
      />
      <WizardFooter
        step={currentStep}
        isNextEnabled={completionStatus}
        onNext={() => {
          flushStateToDb("next");
          handleNextImperitive();
        }}
        onBack={() => {
          jumpToStep(6);
          flushStateToDb("back");
        }}
        onCancel={() => {
          flushStateToDb("cancel");
        }}
      />
    </>
  );
}

export default Step7;