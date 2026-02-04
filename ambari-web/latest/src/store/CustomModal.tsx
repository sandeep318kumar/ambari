import React from "react";
import { useModal } from "./ModalContext";
import Modal, { ModalProps } from "../components/Modal";
import { get } from "lodash";

const CustomModal: React.FC = () => {
  const { modalStack, hideModal } = useModal();

  return (
    <>
      {modalStack.map((modal, index) =>
        React.isValidElement(modal) ? (
          <React.Fragment key={index}>{modal}</React.Fragment>
        ) : (
          <Modal
            key={index}
            {...(modal as Omit<ModalProps, "isOpen">)}
            isOpen={true}
            onClose={() => {
              hideModal();
              get(modal, "onClose", () => {})();
            }}
          />
        )
      )}
    </>
  );
};

export default CustomModal;
