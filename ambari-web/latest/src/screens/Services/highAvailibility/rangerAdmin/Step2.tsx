import { useContext, useState } from "react";
import { AppContext } from "../../../../store/context";
import { map } from "lodash";
import { ActionTypes } from "./store/types";
import WizardFooter from "../../../../components/StepWizard/WizardFooter";
import AssignMastersAddable from "../../../../components/AssignMastersAddable";
import { Alert, Card } from "react-bootstrap";
import { EnableHighAvailibilityRangerAdminContext } from "./store/context";

function Step2() {
  const { services } = useContext(AppContext);
  const {
    dispatch,
    flushStateToDb,
    stepWizardUtilities: { handleNextImperitive, currentStep },
  } = useContext(EnableHighAvailibilityRangerAdminContext);
  const [isNextEnabled] = useState(true);
  return (
    <>
      <div className="step-title">Select Hosts</div>
      <div className="step-description">
      Select a host or hosts that will be running the additional Ranger Admin components.
      </div>
      
      <Card className="mt-2">
        <Card.Body>
          <Alert className="my-1 fs-12" variant="warning">
            Be sure that load balancer located separately from Ranger Admin components. 
          </Alert>
          <AssignMastersAddable
            mastersToShow={["RANGER_ADMIN"]}
            mastersToAdd={[
              "RANGER_ADMIN",
            ]}
            mastersToCreate={[]}
            showCurrentPrefix={["RANGER_ADMIN"]}
            showAdditionalPrefix={["RANGER_ADMIN"]}
            mastersAddableInHA={["RANGER_ADMIN"]}
            services={map(services, "ServiceInfo.service_name")}
            showInstalledMastersFirst={true}
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
