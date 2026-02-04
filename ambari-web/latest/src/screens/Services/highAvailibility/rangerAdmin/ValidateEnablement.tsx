import Modal from "../../../../components/Modal";
import useStepWizard from "../../../../hooks/useStepWizard";
import wizardSteps from "./wizardSteps";
import { EnableHighAvailibilityProvider, EnableHighAvailibilityRangerAdminContext } from "./store/context";
import StepWizard from "../../../../components/StepWizard";
import { useState } from "react";

function ValidateEnablement() {
  const stepWizardUtilities = useStepWizard(wizardSteps, 1);
  const [showModal, setShowModal] = useState(true);
  const getModalBodyContent = () => {
    return (
      <EnableHighAvailibilityProvider stepWizardUtilities={stepWizardUtilities}>
        <StepWizard Context={EnableHighAvailibilityRangerAdminContext} wizardUtilities={stepWizardUtilities} />
      </EnableHighAvailibilityProvider>
    );
  };

  return (
    <>
      {showModal ? (
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
          }}
          modalTitle="Enable Ranger Admin HA Wizard"
          modalBody={getModalBodyContent()}
          successCallback={() => {}}
          options={{
            shouldShowFooter: false,
            modalSize:"modal-wizard"
          }}
        />
      ) : null}
    </>
  );
}

export default ValidateEnablement;
