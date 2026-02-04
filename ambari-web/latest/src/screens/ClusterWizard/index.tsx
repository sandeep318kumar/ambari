import { createContext } from "react";
import StepWizard from "../../components/StepWizard";
import useStepWizard from "../../hooks/useStepWizard";
import { redirectToAdminView } from "../../Utils/adminViewRedirect";

type PropTypes = {
  Context: any;
  Provider: any;
  wizardSteps: Partial<{
    label: string;
    completed: boolean;
    Component: any;
    canGoBack: boolean;
    isNextEnabled: boolean;
    name: string;
  }>[];
  initialActiveStep?: number;
};

export const ContextWrapper = createContext<{ Context: any }>({ Context: {} });

const ClusterCreationWizard = ({
  Context,
  Provider,
  wizardSteps,
  initialActiveStep = 0,
}: PropTypes) => {
  const stepWizardUtilities = useStepWizard(
    wizardSteps,
    initialActiveStep,
    redirectToAdminView
  );

  return (
    <ContextWrapper.Provider value={{ Context }}>
      <Provider stepWizardUtilities={stepWizardUtilities}>
        <StepWizard wizardUtilities={stepWizardUtilities} Context={Context} />
      </Provider>
    </ContextWrapper.Provider>
  );
};

export default ClusterCreationWizard;
