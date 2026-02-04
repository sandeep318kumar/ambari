import { Button, Modal } from "react-bootstrap";
import DefaultButton from "./DefaultButton";

type PropTypes = {
    isOpen: boolean;
    onClose: () => void;
    onCancel: () => void;
};

const RedhatSatelliteUsageInfo = ({ isOpen, onClose, onCancel }: PropTypes) => {
    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Use RedHat Satellite/Spacewalk</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                In order for Ambari to install packages from the right repositories, it
                is recommended that you edit the names of the repo's for each operating
                system so they match the channel names in your RedHat
                Satellite/Spacewalk instance.
            </Modal.Body>
            <Modal.Footer>
                <DefaultButton size="sm" onClick={onCancel}>
                    Cancel
                </DefaultButton>
                <Button
                    variant="success"
                    size="sm"
                    onClick={onClose}
                    className="rounded-1"
                >
                    OK
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RedhatSatelliteUsageInfo;