import { ReactNode } from "react";

type SideItem = {
  id: string;
  icon: ReactNode;
  name: ReactNode;
  path?: string;
  children: SideItem[];
  style?: unknown;
  className?: string;
  link?: string;
  dataHref?: string;
  noAlerts?: boolean;
  hasCriticalAlerts?: boolean;
  alertsCountDisplay?: string;
  goToConfigs?: () => void;
  isRestartRequired?: boolean;
  restartRequiredMessage?: string;
  isInPassive?: boolean;
  maintenanceModeTooltip?: string;
  dropDownIcon?: any;
  sideItems?:boolean;
};


export default SideItem;