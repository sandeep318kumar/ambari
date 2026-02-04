import { Button, Modal } from "react-bootstrap";
import DefaultButton from "./DefaultButton";

type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  modalTitle: any;
  modalBody: any;
  successCallback: () => void;
  buttonVariant?: string;
  cancellable?: boolean;
  primaryButtonText?: string;
  okButtonText?: string;
};

export default function ConfirmationModal({
  isOpen,
  onClose,
  modalTitle,
  modalBody,
  successCallback,
  buttonVariant = "success",
  cancellable = true,
  okButtonText = "OK",
}: ConfirmationModalProps) {
  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      size="lg"
      className="custom-modal-container modal-width"
      data-testid="confirmation-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h3>{modalTitle}</h3>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{modalBody}</Modal.Body>
      <Modal.Footer className="d-flex justify-content-end">
        {cancellable ? (
          <DefaultButton
            size="sm"
            onClick={onClose}
            data-testid="confirm-cancel-btn"
          >
            CANCEL
          </DefaultButton>
        ) : null}
        <Button
          className="custom-btn"
          variant={buttonVariant}
          onClick={successCallback}
          size="sm"
          data-testid="confirm-ok-btn"
        >
          {okButtonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
