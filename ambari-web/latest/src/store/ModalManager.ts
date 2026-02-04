import { ReactNode } from "react";
import { ModalProps } from "../components/Modal";

export type CustomModalProps = Omit<ModalProps, "isOpen"> | ReactNode;

class ModalManager {
  private listeners: ((props: CustomModalProps[]) => void)[] = [];
  private modalStack: CustomModalProps[] = [];

  show(props: CustomModalProps) {
    this.modalStack.push(props);
    this.notify();
  }

  hide() {
    const modal = this.modalStack.pop();
    if (this.isModalProps(modal) && modal.onClose) {
      modal.onClose();
    }
    this.notify();
  }

  subscribe(listener: (props: CustomModalProps[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener([...this.modalStack]));
  }

  private isModalProps(
    modal: CustomModalProps | undefined
  ): modal is Omit<ModalProps, "isOpen"> {
    return (modal as Omit<ModalProps, "isOpen">)?.onClose !== undefined;
  }
}

const modalManager = new ModalManager();
export default modalManager;