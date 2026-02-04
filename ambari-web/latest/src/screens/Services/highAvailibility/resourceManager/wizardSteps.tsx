import { messages } from "../../../messages";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";

export enum enableResourceManagerSteps {
  GET_STARTED = "GET_STARTED",
  SELECT_HOSTS = "SELECT_HOSTS",
  REVIEW = "REVIEW",
  CREATE_CHECKPOINT = "CONFIGURE_COMPONENTS",
}

export default {
  1: {
    label: messages["admin.rm_highAvailability.wizard.step1.header"],
    completed: false,
    Component: <Step1/>,
    canGoBack: false,
    isNextEnabled: false,
    name: enableResourceManagerSteps.GET_STARTED,
    keysToRemove: [enableResourceManagerSteps.SELECT_HOSTS, enableResourceManagerSteps.REVIEW, enableResourceManagerSteps.CREATE_CHECKPOINT],
  },
  2: {
    label: messages["admin.rm_highAvailability.wizard.step2.header"],
    completed: false,
    Component: <Step2/>,
    canGoBack: true,
    isNextEnabled: false,
    name: enableResourceManagerSteps.SELECT_HOSTS,
    keysToRemove: [enableResourceManagerSteps.REVIEW, enableResourceManagerSteps.CREATE_CHECKPOINT],
  },
  3: {
    label: messages["admin.rm_highAvailability.wizard.step3.header"],
    completed: false,
    Component: <Step3/>,
    canGoBack: true,
    isNextEnabled: false,
    name: enableResourceManagerSteps.REVIEW,
    keysToRemove: [enableResourceManagerSteps.CREATE_CHECKPOINT],
  },
  4: {
    label: messages["admin.rm_highAvailability.wizard.step4.header"],
    completed: false,
    Component: <Step4/>,
    canGoBack: false,
    isNextEnabled: true,
    name: enableResourceManagerSteps.CREATE_CHECKPOINT,
  },
};