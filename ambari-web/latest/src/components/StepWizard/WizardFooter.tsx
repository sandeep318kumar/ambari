import { Button, Stack } from "react-bootstrap";
import { ArrowLeft, ArrowRight } from "react-bootstrap-icons";
import { Step } from "../../types/StepWizard";
import Modal from "../Modal";
import { useState } from "react";

interface PropTypes {
  onBack: Function;
  step: Step;
  onNext: Function;
  isNextEnabled: boolean;
  isBackEnabled?: boolean;
  onCancel?: () => void;
  lifted?: boolean;
  sideItems?: any;
}

function WizardFooter({
  onBack,
  step,
  onNext,
  isNextEnabled,
  onCancel = () => {},
  isBackEnabled = true,
  lifted = false,
  sideItems,
}: PropTypes) {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  return (
    <div
      className="step-wizard-footer d-flex justify-content-between bg-white p-2"
      style={{
        position: "absolute",
        bottom: lifted ? "0px" : "-40px",
        left: "0px",
        width: "100%",
      }}
    >
      <Modal
        isOpen={showConfirmationModal}
        onClose={() => {
          setShowConfirmationModal(false);
        }}
        options={{}}
        modalTitle="Confirmation"
        modalBody="Are you sure you want to cancel the operation?"
        successCallback={() => {
          onCancel();
        }}
      />
      <Stack direction="horizontal">
        {step.canGoBack ? (
          <Button
            variant="outline-secondary"
            className="d-flex align-items-center ms-3 h-100"
            onClick={() => {
              onBack();
            }}
            disabled={!isBackEnabled}
          >
            <ArrowLeft />
            <span className="ms-1">BACK</span>
          </Button>
        ) : null}
        <Button
          variant="outline-secondary"
          className="d-flex align-items-center ms-3 h-100"
          onClick={() => {
            setShowConfirmationModal(true);
          }}
        >
          <span className="ms-1">CANCEL</span>
        </Button>
      </Stack>
      <Stack direction="horizontal" className="align-items-center">
        {sideItems ? sideItems : null}

        <Button
          variant="success"
          className="me-3"
          onClick={() => {
            onNext();
          }}
          disabled={!isNextEnabled}
        >
          <span className="me-1">{step.nextLabel || "NEXT"}</span>
          <ArrowRight />
        </Button>
      </Stack>
    </div>
  );
}
export default WizardFooter;
