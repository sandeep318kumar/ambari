import React, { createContext, useState, useEffect, ReactNode } from "react";
import modalManager, { CustomModalProps } from "./ModalManager";

interface ModalContextType {
  modalStack: CustomModalProps[];
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [modalStack, setModalStack] = useState<CustomModalProps[]>([]);

  useEffect(() => {
    const unsubscribe = modalManager.subscribe(setModalStack);
    return () => unsubscribe();
  }, []);

  const hideModal = () => {
    modalManager.hide();
  };

  return (
    <ModalContext.Provider value={{ modalStack, hideModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
