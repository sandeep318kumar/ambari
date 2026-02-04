import { useContext, useEffect, useState } from "react";
import { ReassignContext } from "./store/context";
import { AppContext } from "../../../store/context";
import { Card } from "react-bootstrap";
import AssignMastersAddable from "../../../components/AssignMastersAddable";
import { flatten, get, map } from "lodash";
import { ActionTypes } from "./store/types";
import WizardFooter from "../../../components/StepWizard/WizardFooter";
import { useParams } from "react-router-dom";

function Step2() {
  const { services } = useContext(AppContext);
  const {
    state,
    dispatch,
    flushStateToDb,
    stepWizardUtilities: { handleNextImperitive, currentStep, jumpToStep },
  } = useContext(ReassignContext);
  const { componentName } = useParams();
  const [isNextEnabled, setIsNextEnabled] = useState(false);
  useEffect(() => {
    console.log("State is", state);
    const assignHostsData = get(
      state,
      "reassignSteps.ASSIGN_MASTER.data",
      undefined
    );
    if (assignHostsData) {
      const allMasterServices = flatten(
        map(assignHostsData.masterHostsMapping, "masterServices")
      );
      
      // Count how many components have been reassigned (moved to different hosts)
      let reassignedCount = 0;
      
      const existingComponents = allMasterServices
        .filter((service: any) => service.component_name === componentName)
        .map((service: any) => service.selectedHost); // Original host
      
      const newComponents = allMasterServices
        .filter((service: any) => service.component_name === componentName)
        .map((service: any) => service.movedHost || service.selectedHost); // New host or original if not moved
      
      existingComponents.forEach((existingHost: string) => {
        if (!newComponents.includes(existingHost)) {
          reassignedCount++;
        }
      });
      
      setIsNextEnabled(reassignedCount === 1);
    }
  }, [state]);
  return (
    <>
      <div className="step-title">Select Target Host</div>
      <div className="step-description mt-1">
        Assign {componentName} to new host.
      </div>

      <Card className="mt-4">
        <Card.Body>
          <AssignMastersAddable
            mastersToShow={[componentName!]}
            mastersToAdd={[]}
            mastersToCreate={[]}
            showCurrentPrefix={[componentName!]}
            showAdditionalPrefix={[]}
            mastersAddableInHA={[]}
            services={map(services, "ServiceInfo.service_name")}
            showInstalledMastersFirst={true}
            mastersToMove={[componentName!]}
            dispatch={(payload: any) => {
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
        onCancel={()=>{
          flushStateToDb("cancel");
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
