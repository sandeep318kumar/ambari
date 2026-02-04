import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Step6 from "./Step6";
import Step7 from "./Step7";

export enum manageJournalNodesSteps {
  ASSIGN_JOURNALNODES = "ASSIGN_JOURNALNODES",
  REVIEW= "REVIEW",
  SAVE_NAMESPACE= "SAVE_NAMESPACE",
  ADD_REMOVE_JOURNALNODES= "ADD_REMOVE_JOURNALNODES",
  COPY_JOURNALNODE_DIRECTORIES= "COPY_JOURNALNODE_DIRECTORIES",
  START_JOURNALNODES= "START_JOURNALNODES",
  START_ALL_SERVICES= "START_ALL_SERVICES",
}

export default {
  0: {
    label: "Assign JournalNodes",
    completed: false,
    Component: <Step1/>,
    canGoBack: false,
    isNextEnabled: false,
    name: manageJournalNodesSteps.ASSIGN_JOURNALNODES,
  },
  1: {
    label: "Review",
    completed: false,
    Component: <Step2/>,
    canGoBack: true,
    isNextEnabled: false,
    name: manageJournalNodesSteps.REVIEW,
  },
  2: {
    label: "Save Namespace",
    completed: false,
    Component: <Step3/>,
    canGoBack: true,
    isNextEnabled: false,
    name: manageJournalNodesSteps.SAVE_NAMESPACE,
  },
  3: {
    label: "Add/ Remove JournalNodes",
    completed: false,
    Component: <Step4/>,
    canGoBack: false,
    isNextEnabled: true,
    name: manageJournalNodesSteps.ADD_REMOVE_JOURNALNODES,
  },
  4: {
    label: "Copy JournalNode Directories",
    completed: false,
    Component: <Step5/>,
    canGoBack: false,
    isNextEnabled: true,
    name: manageJournalNodesSteps.COPY_JOURNALNODE_DIRECTORIES,
  },
  5: {
    label: "Start JournalNodes",
    completed: false,
    Component: <Step6/>,
    canGoBack: false,
    isNextEnabled: true,
    name: manageJournalNodesSteps.START_JOURNALNODES,
  },
  6: {
    label: "Start All Services",
    completed: false,
    Component: <Step7/>,
    canGoBack: false,
    isNextEnabled: false,
    name: manageJournalNodesSteps.START_ALL_SERVICES
  },
};
