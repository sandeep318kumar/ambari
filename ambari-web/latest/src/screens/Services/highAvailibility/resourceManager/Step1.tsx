import { useContext } from "react";
import WizardFooter from "../../../../components/StepWizard/WizardFooter";
import { EnableHighAvailibilityContext } from "./store/context";

function Step1() {
  const {
    flushStateToDb,
    stepWizardUtilities: { currentStep, handleNextImperitive },
  } = useContext(EnableHighAvailibilityContext);
  return (
    <>
      <h3 className="step-title">Get Started</h3>
      <h5 className="step-description light-text">
        This wizard will walk you through enabling ResourceManager HA on your
        cluster.
        <br />
        Once enabled, you will be running a Standby ResourceManager in addition
        to your Active ResourceManager.
        <br />
        This allows for an Active-Standby ResourceManager configuration that
        automatically performs failover.
      </h5>
      <div className="fw-bold fs-12">
        You should plan a cluster maintenance window and prepare for cluster
        downtime when enabling ResourceManager HA.
      </div>
      <WizardFooter
        step={currentStep}
        isNextEnabled={true}
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

export default Step1;
