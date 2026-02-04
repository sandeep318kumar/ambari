import { Button, Modal } from "react-bootstrap";
import DefaultButton from "./DefaultButton";
import { ModalType } from "../screens/ClusterWizard/constants";

type PropTypes = {
  isOpen: boolean;
  onClose: () => void;
  onCancel: () => void;
  title : React.ReactNode;
  body: React.ReactNode;
  modalType?: string;
};

const MissingServiceModal = ({
  isOpen,
  onClose,
  onCancel,
  title,
  body,
  modalType,
}: PropTypes) => {
  return (
    <Modal size="lg"show={isOpen} onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <DefaultButton size="sm" onClick={onCancel}>
          Cancel
        </DefaultButton>
        <Button
          variant= {modalType === ModalType.MISSING_SERVICE ? "warning" : "success"}
          size="sm"
          onClick={onClose}
          className="rounded-1"
        >
          {modalType === ModalType.MISSING_SERVICE ? "PROCEED ANYWAY" : "OK"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MissingServiceModal;
