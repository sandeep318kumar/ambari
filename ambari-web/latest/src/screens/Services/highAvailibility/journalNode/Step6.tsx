import { useContext, useState } from "react";
import OperationsProgress from "../../../../components/OperationsProgress";
import { filter, map } from "lodash";
import { ManageJournalNodesContext } from "./store/context";
import { ActionTypes } from "./store/types";
import { getStepData } from "../../../../Utils/Utility";
import { updateComponent } from "../../../../Utils/taskUtils";
import { AppContext } from "../../../../store/context";
import WizardFooter from "../../../../components/StepWizard/WizardFooter";

function Step6() {
    const { clusterName } = useContext(AppContext);
  const [completionStatus, setCompletionStatus] = useState(false);
  const {
    state,
    dispatch,
    flushStateToDb,
    stepWizardUtilities: { currentStep, handleNextImperitive,handleBackImperitive },
  } = useContext(ManageJournalNodesContext);
  const operations = [
    {
      id: 1,
      label: "Start JournalNodes",
      skippable: false,
      callback: async () => {
        const step1Data = getStepData(
          state,
          "ASSIGN_JOURNALNODES",
          "masterComponentHosts",
          "manageJournalNodesSteps"
        );
        const currentJournalNodes = map(filter(step1Data, [
          "component",
          "JOURNALNODE",
        ]),"hostName");

       
        return await updateComponent(
          clusterName,
          "JOURNALNODE",
          currentJournalNodes.join(","),
          "HDFS",
          "Start",
          1
        );
      },
    },
  ];
  return (
    <>
      <h3 className="step-title">Perform Operations</h3>
      <div className="mt-3">
        <OperationsProgress
          title=""
          description=""
          setCompletionStatus={setCompletionStatus}
          operations={operations as any}
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
      </div>
      <WizardFooter
        step={currentStep}
        isNextEnabled={completionStatus}
        onNext={() => {
          flushStateToDb("next");
          handleNextImperitive();
        }}
        onCancel={() => {
          flushStateToDb("cancel");
        }}
        onBack={() => {
          flushStateToDb("back");
          handleBackImperitive();
        }}
      />
    </>
  );
}
export default Step6;
