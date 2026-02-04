import BackgroundOperations from "../screens/BackgroundOperations";
import modalManager from "../store/ModalManager";

function showBackgroundModal() {
  modalManager.show(
    <BackgroundOperations isOpen onClose={() => modalManager.hide()} />
  );
}
export default showBackgroundModal;
