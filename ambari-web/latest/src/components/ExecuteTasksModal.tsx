import { Button, Modal, ProgressBar } from "react-bootstrap";
import { TaskExecutionStatus } from "../constants";
import { useEffect } from "react";

type PropTypes = {
  tasks: Task[];
  isOpen: boolean;
  onClose: Function;
  totalCount: number;
  successCount: number;
  failedCount: number;
  successCallback?: any;
};
type Task = {
  status: TaskExecutionStatus;
};
function ExecuteTasksModal({
  isOpen,
  onClose,
  totalCount,
  successCount,
  failedCount,
  successCallback,
}: PropTypes) {
  function getCurrentProgress() {
    return ((successCount + failedCount) / totalCount) * 100;
  }
  function getVariant() {
    if (failedCount > 0) {
      return "danger";
    } else if (successCount === totalCount) {
      return "success";
    } else {
      return "info";
    }
  }
  useEffect(() => {
    if (totalCount && successCount && successCount === totalCount) {
      successCallback();
      onClose();
    }
  }, [totalCount, successCount]);
  return (
    <Modal
      show={isOpen}
      onHide={onClose as any}
      size="lg"
      className="custom-modal-container modal-width"
      data-testid="confirmation-modal"
    >
      <Modal.Header>
        <Modal.Title>
          <h2>
            Initialising {successCount} of {totalCount} tasks
          </h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ProgressBar now={getCurrentProgress()} variant={getVariant()} />
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="text-white"
          variant="primary"
          disabled={successCount + failedCount !== totalCount}
          onClick={() => {
            onClose();
          }}
        >
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ExecuteTasksModal;
