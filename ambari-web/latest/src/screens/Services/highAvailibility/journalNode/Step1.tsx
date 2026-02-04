import { useContext, useState } from "react";
import { AppContext } from "../../../../store/context";
import { map } from "lodash";
import { ActionTypes } from "./store/types";
import WizardFooter from "../../../../components/StepWizard/WizardFooter";
import AssignMastersAddable from "../../../../components/AssignMastersAddable";
import { Card } from "react-bootstrap";
import { ManageJournalNodesContext } from "./store/context";

function Step1() {
  const { services } = useContext(AppContext);
  const {
    dispatch,
    flushStateToDb,
    stepWizardUtilities: { handleNextImperitive, currentStep },
  } = useContext(ManageJournalNodesContext);
  const [isNextEnabled] = useState(true);
  return (
    <>
      <div className="step-title">Assign JournalNodes</div>
      <div className="step-description">
        Add or remove JournalNodes
      </div>
      <Card className="mt-2">
        <Card.Body>
          <AssignMastersAddable
           showJournalNode
            mastersToShow={["JOURNALNODE"]}
            mastersToAdd={["JOURNALNODE"]}
            mastersToCreate={[]}
            showCurrentPrefix={["JOURNALNODE"]}
            showAdditionalPrefix={["JOURNALNODE"]}
            services={map(services, "ServiceInfo.service_name")}
            mastersAddableInHA={["JOURNALNODE"]}
            dispatch={(payload:any) => {
              dispatch({
                type: ActionTypes.STORE_INFORMATION,
                payload: {
                  step: currentStep.name,
                  data: payload,
                },
              });
              flushStateToDb();
            }}
          />
        </Card.Body>
      </Card>
      <WizardFooter
        step={currentStep}
        isNextEnabled={isNextEnabled}
        onCancel={()=>{
          flushStateToDb("cancel");
        }}
        onBack={() => {}}
        onNext={() => {
          flushStateToDb("next");
          handleNextImperitive();
        }}
      />
    </>
  );
}
export default Step1;
