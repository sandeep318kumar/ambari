import { Button, Form, Modal } from "react-bootstrap";
import DefaultButton from "../../components/DefaultButton";
import { useState } from "react";

type FormDataType = {
  name: string;
  description: string;
};

type CreateNewConfigGroupProps = {
  isOpen: boolean;
  onClose: () => void;
  successCallback: (formData: any) => void;
  existingConfigGroups: string[];
  config?: FormDataType;
  isRename?: boolean;
};

export default function CreateNewConfigGroup({
  isOpen,
  onClose,
  successCallback,
  existingConfigGroups,
  config = {
    name: "",
    description: "",
  },
  isRename = false,
}: CreateNewConfigGroupProps) {
  const [formData, setFormData] = useState(config);

  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      className="custom-modal-container modal-width make-scrollable custom-scrollbar"
    >
      <Modal.Header closeButton>
        <h2>{isRename ? "Rename " : "Create New "} Configuration Group</h2>
      </Modal.Header>
      <Form
        onSubmit={(e: any) => {
          e.preventDefault();
          successCallback(formData);
          onClose();
        }}
      >
        <Modal.Body>
          {existingConfigGroups.includes(formData.name) ? (
            <div className="text-warning fs-12 mb-2">
              Configuration Group with given name already exists
            </div>
          ) : null}
          <Form.Group className="d-flex mb-3">
            <Form.Label className="w-25 d-flex justify-content-end me-4 pt-2">
              Name:
            </Form.Label>
            <Form.Control
              type="text"
              value={formData.name}
              className="custom-form-control"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="d-flex mb-3">
            <Form.Label className="w-25 d-flex justify-content-end me-4 pt-2">
              Description:
            </Form.Label>
            <Form.Control
              type="text"
              as="textarea"
              rows={4}
              value={formData.description}
              className="custom-form-control"
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <DefaultButton onClick={onClose}>CANCEL</DefaultButton>
          <Button
            type="submit"
            className="custom-btn text-white"
            disabled={
              formData.name === "" ||
              existingConfigGroups.includes(formData.name)
            }
          >
            OK
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
