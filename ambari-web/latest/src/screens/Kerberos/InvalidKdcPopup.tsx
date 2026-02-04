import { useState } from "react";
import Modal from "../../components/Modal";
import { messages } from "../messages";
import { get } from "lodash";
import { Alert, Form } from "react-bootstrap";

type InvalidKDCPopupProps = {
    isOpen: boolean;
    onClose: () => void;
    handleSave: (adminPrincipal: string, adminPassword: string, saveCredentials: boolean) => void;
};

export default function invalidKDCPopup({isOpen, onClose, handleSave}: InvalidKDCPopupProps): React.ReactElement {
    const [adminPrincipal, setAdminPrincipal] = useState("");
    const [adminPassword, setAdminPassword] = useState("");
    const [saveCredentials, setSaveCredentials] = useState(false);
    
    function getModalBody() {
        return (
            <>
                <Alert variant="warning">
                Warning: Missing KDC administrator credentials. Please enter admin principal and password.
                </Alert>
                <Form>
                    <Form.Group controlId="adminPrincipal">
                        <Form.Label>Admin Principal</Form.Label>
                        <Form.Control
                        type="text"
                        value={adminPrincipal}
                        onChange={(e) => setAdminPrincipal(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="adminPassword">
                        <Form.Label>Admin Password</Form.Label>
                        <Form.Control
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="saveCredentials">
                        <Form.Check
                        type="checkbox"
                        id="save-admin-credentials-checkbox"
                        label="Save Admin Credentials"
                        checked={saveCredentials}
                        onChange={(e) => setSaveCredentials(e.target.checked)}
                        />
                    </Form.Group>
                </Form>
            </>
        )
    }

    async function handleSaveDetails() {
        handleSave(adminPrincipal, adminPassword, saveCredentials);
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={() => onClose()}
                modalTitle={get(messages, "popup.invalid.KDC.header", "")}
                modalBody={getModalBody()}
                options={{
                    okButtonText: "SAVE",
                    cancelableViaIcon: true,
                    cancelableViaBtn: true,
                    modalSize: "modal-md",
                }}
                successCallback={() => {
                    handleSaveDetails();
                }}
            />
        </>
    )
}
