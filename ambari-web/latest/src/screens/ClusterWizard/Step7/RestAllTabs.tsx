import Config from "../../CommonConfigs/Config";
import { ConfigPropertiesType } from "../../CommonConfigs/types";

type RestAllTabsProps = {
  themes: Object;
  configs: Object;
  configProperties: ConfigPropertiesType;
  setConfigProperties: any;
  services: string[];
  tabName: string;
  recommendationsDataToSend: Object;
  stack: string;
  stackVersion: string;
  hosts: string[];
  validationErrors?: any;
  wizardName?: string;
};

export default function RestAllTabs({
  themes,
  configs,
  configProperties,
  setConfigProperties,
  services,
  tabName,  
  recommendationsDataToSend,
  stack,
  stackVersion,
  hosts,
  validationErrors = [],
  wizardName = "clusterCreation",
}: RestAllTabsProps) {
  return (
    <>
      <Config
        configSection={tabName}
        configProperties={configProperties}
        setConfigProperties={setConfigProperties}
        themeData={themes}
        configPropertiesData={configs}
        servicesList={services}
        installedServices={services}
        recommendationsDataToSend={recommendationsDataToSend}
        installer={true}
        wizardName={wizardName}
        stack={stack}
        stackVersion={stackVersion}
        hosts={hosts}
        validationErrors={validationErrors}
      />
    </>
  );
}
