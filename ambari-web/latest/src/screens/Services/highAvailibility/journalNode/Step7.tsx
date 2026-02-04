import { useContext, useState } from "react";
import OperationsProgress from "../../../../components/OperationsProgress";
import { ManageJournalNodesContext } from "./store/context";
import { ActionTypes } from "./store/types";
import { startAllServices } from "../../../../Utils/taskUtils";
import { AppContext } from "../../../../store/context";
import WizardFooter from "../../../../components/StepWizard/WizardFooter";
import modalManager from "../../../../store/ModalManager";

function Step7() {
  const { clusterName } = useContext(AppContext);
  const [completionStatus, setCompletionStatus] = useState(false);
  const {
    dispatch,
    flushStateToDb,
    stepWizardUtilities: { currentStep, handleBackImperitive },
  } = useContext(ManageJournalNodesContext);
  const operations = [
    {
      id: 1,
      label: "Start all services",
      skippable: false,
      callback: async () => {
        return await startAllServices(clusterName);
      },
    },
  ];
  return (
    <>
      <h3 className="step-title">Start services</h3>
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
          flushStateToDb("cancel"); // Clear persisted data on completion
          modalManager.hide();
          window.location.href = "/#/main/services/HDFS/summary";
        }}
        onBack={() => {
          flushStateToDb("back");
          handleBackImperitive();
        }}
      />
    </>
  );
}
export default Step7;
