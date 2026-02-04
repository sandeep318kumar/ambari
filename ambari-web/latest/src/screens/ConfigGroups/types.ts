type ConfigGroupItemType = {
  ConfigGroup: {
    href?: string;
    cluster_name?: string;
    description?: string;
    desired_configs?: [];
    group_name: string;
    hosts?: { host_name?: string }[];
    id?: number;
    tag?: string;
  };
};

type DesiredConfigsItemType = {
  href?: string;
  tag?: string;
  type?: string;
  version?: number;
  Config?: Object;
  properties?: Object;
  data?: Object;
};

type ConfigGroupType = {
  href?: string;
  items: ConfigGroupItemType[];
};

type DesiredConfigsType = {
  href?: string;
  items: DesiredConfigsItemType[];
};

type HostInfoType = {
  cpu_count: number;
  disk_info: [];
  host_name: string;
  ip: string;
  os_arch: string;
  os_type: string;
  public_host_name: string;
  total_mem: number;
};

type HostType = {
  Hosts: HostInfoType;
  host_components?: [];
  isChecked?: boolean;
  isShown?: boolean;
};

type HostDataType = {
  items: HostType[];
};

export type {
  ConfigGroupItemType,
  DesiredConfigsItemType,
  ConfigGroupType,
  DesiredConfigsType,
  HostInfoType,
  HostType,
  HostDataType,
};
