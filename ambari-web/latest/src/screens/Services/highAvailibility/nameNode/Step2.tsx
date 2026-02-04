import { useContext, useState } from "react";
import { AppContext } from "../../../../store/context";
import { map } from "lodash";
import { EnableHighAvailibilityContext } from "./store/context";
import { ActionTypes } from "./store/types";
import WizardFooter from "../../../../components/StepWizard/WizardFooter";
import AssignMastersAddable from "../../../../components/AssignMastersAddable";
import { Card } from "react-bootstrap";

function Step2() {
  const { services } = useContext(AppContext);
  const {
    dispatch,
    flushStateToDb,
    stepWizardUtilities: { handleNextImperitive, currentStep, jumpToStep },
  } = useContext(EnableHighAvailibilityContext);
  const [isNextEnabled] = useState(true);
  return (
    <>
      <div className="step-title">Select Hosts</div>
      <div className="step-description">
        Select a host that will be running the additional NameNode.
      </div>
      <div className="step-description">
        In addition, select the hosts to run JournalNodes, which store NameNode
        edit logs in a fault tolerant manner.
      </div>
      <Card className="mt-2">
        <Card.Body>
          <AssignMastersAddable
            mastersToShow={["NAMENODE", "JOURNALNODE"]}
            mastersToAdd={[
              "NAMENODE",
              "JOURNALNODE",
              "JOURNALNODE",
              "JOURNALNODE",
            ]}
            mastersToCreate={[]}
            showCurrentPrefix={["NAMENODE"]}
            showAdditionalPrefix={["NAMENODE"]}
            mastersAddableInHA={[]}
            services={map(services, "ServiceInfo.service_name")}
            dispatch={(payload:any) => {
              dispatch({
                type: ActionTypes.STORE_INFORMATION,
                payload: {
                  step: currentStep.name,
                  data: payload,
                },
              });
            }}
          />
        </Card.Body>
      </Card>
      <WizardFooter
        step={currentStep}
        isNextEnabled={isNextEnabled}
        onBack={() => {
          flushStateToDb("back");
          jumpToStep(1);
        }}
        onNext={() => {
          flushStateToDb("next");
          handleNextImperitive();
        }}
        onCancel={() => {
          flushStateToDb("cancel");
        }}
      />
    </>
  );
}
export default Step2;
