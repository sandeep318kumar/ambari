import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { Step4 } from "./Step4";

export enum enableNamenodeFederationSteps {
  GET_STARTED = "GET_STARTED",
  SELECT_HOSTS = "SELECT_HOSTS",
  REVIEW = "REVIEW",
  CONFIGURE_COMPONENTS = "CONFIGURE_COMPONENTS",
}

export default {
  0: {
    label: "Get Started",
    completed: false,
    Component: <Step1 />,
    canGoBack: false,
    isNextEnabled: false,
    name: enableNamenodeFederationSteps.GET_STARTED,
  },
  1: {
    label: "Select Hosts",
    completed: false,
    Component: <Step2 />,
    canGoBack: true,
    isNextEnabled: false,
    name: enableNamenodeFederationSteps.SELECT_HOSTS,
  },
  2: {
    label: "Review",
    completed: false,
    Component: <Step3 />,
    canGoBack: true,
    isNextEnabled: false,
    name: enableNamenodeFederationSteps.REVIEW,
  },
  3: {
    label: "Configure Components",
    completed: false,
    Component: <Step4/>,
    canGoBack: true,
    isNextEnabled: true,
    name: enableNamenodeFederationSteps.CONFIGURE_COMPONENTS,
  },
};