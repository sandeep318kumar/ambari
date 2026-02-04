import { useContext, useEffect, useRef, useState } from "react";
import { Alert, Form } from "react-bootstrap";
import { AppContext } from "../../store/context";
import KerberosApi from "../../api/KerberosApi";
import { messages } from "../messages";
import { get } from "lodash";
import Modal from "../../components/Modal";

type ManageKdcCredentialsProps = {
  isOpen: boolean;
  onClose: () => void;
};
export default function ManageKdcCredentials({isOpen, onClose }: ManageKdcCredentialsProps) {
  const [adminPrincipal, setAdminPrincipal] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [removeButton, setRemoveButton] = useState(false);
  const credentialsType = useRef("temporary");
  const { clusterName } = useContext(AppContext);

  useEffect(() => {
    const getKdcCredentials = async () => {
      const response = await KerberosApi.getKDCAdminCredentials(clusterName);
      if (response && response.items && response.items.length > 0) {
        const credentials = response.items[0];
        if (credentials) {
          setRemoveButton(true)
          credentialsType.current = credentials.Credential.type;
        }
      }
    }

    getKdcCredentials();
  }, [])
  
  function getModalBody() {
      return (
          <>
              <Alert variant="info">
                { removeButton ? get(messages, "admin.kerberos.credentials.form.header.stored")
                : get(messages, "admin.kerberos.credentials.form.header.not.stored") }
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
                  <Form.Group controlId="adminPassword" className="mt-3">
                      <Form.Label>Admin Password</Form.Label>
                      <Form.Control
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      />
                  </Form.Group>
              </Form>
          </>
      )
  }

  async function removeCredentials() {
    try {
      await KerberosApi.deleteKDCAdminCredentials(clusterName);
      setRemoveButton(false);
      setAdminPrincipal("");
      setAdminPassword("");
      onClose();
    } catch (error) {
      console.error("Error removing credentials:", error);
    }
  }

  async function handleSaveDetails() {
    const payload = {
      Credential: {
        key: adminPassword,
        principal: adminPrincipal,
        type: credentialsType.current,
      }
    };

    try {
      const method = removeButton ? "PUT" : "POST";
      await KerberosApi.submitKDCAdminCredentials(
        clusterName,
        payload,
        method
      );
      setRemoveButton(true);
      setAdminPrincipal("");
      setAdminPassword("");
    } catch (error) {
      console.error("Error posting KDC Admin Credentials:", error);
    }
  }

  return (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        modalTitle={get(messages, "admin.kerberos.credentials.store.menu.label")}
        modalBody={getModalBody()}
        options={{
            okButtonText: "SAVE",
            modalSize: "modal-md",
            cancelableViaBtn: false,
            extraButtons: (removeButton) ? [{
                text: "REMOVE",
                onClick: () => {
                  removeCredentials();
                },
                variant: "danger",
                order: 1,
              }, {
                text: "CANCEL",
                onClick: () => {
                  onClose();
                },
                variant: "dark",
                order: 2, 
              }]: [{
                text: "CANCEL",
                onClick: () => {
                  onClose();
                },
                variant: "dark",
                order: 2, 
              }]
        }}
        successCallback={() => {
            handleSaveDetails();
            onClose();
        }}
    />
  )
}