import { useContext, useState } from "react";
import { AppContext } from "../../../../store/context";
import { map } from "lodash";
import { EnableNamenodeFederationContext } from "./store/context";
import { ActionTypes } from "./store/types";
import WizardFooter from "../../../../components/StepWizard/WizardFooter";
import AssignMastersAddable from "../../../../components/AssignMastersAddable";
import { Card } from "react-bootstrap";

function Step2() {
  const { services } = useContext(AppContext);
  const {
    dispatch,
    flushStateToDb,
    stepWizardUtilities: { handleNextImperitive, currentStep },
  } = useContext(EnableNamenodeFederationContext);
  const [isNextEnabled] = useState(true);
  return (
    <>
      <div className="step-title">Select Hosts</div>
      <div className="step-description">
        Select a host that will be running the additional NameNode.
      </div>
      <Card className="mt-2">
        <Card.Body>
          <AssignMastersAddable
            mastersToShow={["NAMENODE"]}
            mastersToAdd={["NAMENODE", "NAMENODE"]}
            mastersToCreate={[]}
            showCurrentPrefix={["NAMENODE"]}
            showAdditionalPrefix={["NAMENODE"]}
            services={map(services, "ServiceInfo.service_name")}
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
        onBack={() => {
          flushStateToDb("back");
        }}
        onNext={() => {
          flushStateToDb("next");
          handleNextImperitive();
        }}
      />
    </>
  );
}
export default Step2;
