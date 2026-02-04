import { useLocation } from "react-router-dom";
import Modal from "../../components/Modal";
import ClusterCreationWizard from "../ClusterWizard";
import {
  AddServiceContext,
  AddServiceProvider,
} from "./AddServiceWizard/wizardDataStore/context";
import addServiceWizardSteps from "./AddServiceWizard/addServiceWizardSteps";
import modalManager from "../../store/ModalManager";
import {
  AddHostContext,
  AddHostProvider,
} from "../Hosts/AddHostWizard/wizardDataStore/context";
import addHostWizardSteps from "../Hosts/AddHostWizard/addHostWizardSteps";
import { useContext } from "react";

function AddWizardUrlMapping() {
  const {flushStateToDb} = useContext(AddHostContext)
  const location = useLocation();
  function mapUrlToComponent() {
    if (location.pathname.includes("service/add")) {
      return (
        <Modal
          isOpen={true}
          onClose={() => {
            modalManager.show(
              <Modal
                options={{}}
                modalTitle="Confirmation"
                isOpen={true}
                modalBody={
                  <div>
                    Are you sure you want to cancel the service creation? All
                    your progress will be lost.
                  </div>
                }
                onClose={() => {
                  modalManager.hide();
                }}
                successCallback={() => {
                  modalManager.hide();
                  window.location.href = "/#/main/dashboard/metrics";
                }}
              />
            );
          }}
          modalTitle="Add Service"
          options={{
            modalSize: "modal-wizard",
            shouldShowFooter: false,
          }}
          successCallback={() => {}}
          modalBody={
            <ClusterCreationWizard
              Context={AddServiceContext}
              Provider={AddServiceProvider}
              wizardSteps={addServiceWizardSteps as any}
              initialActiveStep={1}
            />
          }
        ></Modal>
      );
    } else if (location.pathname.includes("host/add")) {
      return (
        <Modal
          isOpen={true}
          onClose={() => {
            modalManager.show(
              <Modal
                options={{}}
                modalTitle="Confirmation"
                isOpen={true}
                modalBody={
                  <div>
                    Are you sure you want to cancel the host addition? All your
                    progress will be lost.
                  </div>
                }
                onClose={() => {
                  flushStateToDb("cancel");
                  modalManager.hide();
                }}
                successCallback={() => {
                  modalManager.hide();
                  window.location.href = "/#/main/hosts";
                }}
              />
            );
          }}
          modalTitle="Add Hosts"
          options={{
            modalSize: "modal-wizard",
            shouldShowFooter: false,
          }}
          successCallback={() => {}}
          modalBody={
            <ClusterCreationWizard
              Context={AddHostContext}
              Provider={AddHostProvider}
              wizardSteps={addHostWizardSteps as any}
              initialActiveStep={1}
            />
          }
        ></Modal>
      );
    }
  }
  return mapUrlToComponent();
}
export default AddWizardUrlMapping;
