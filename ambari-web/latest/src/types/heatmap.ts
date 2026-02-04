export interface HostInfo {
  hostName: string;
  publicHostName: string;
  osType: string;
  ip: string;
  rack: string;
  diskTotal: number;
  diskFree: number;
  cpuSystem: number;
  cpuUser: number;
  memTotal: number;
  memFree: number;
  hostComponents: string[];
}

export interface RackInfo {
  name: string;
  rackId: string;
  hosts: HostInfo[];
  isLoaded: boolean;
  index: number;
}

export interface HeatmapMetric {
  name: string;
  units?: string;
  maximumValue?: number;
  minimumValue?: number;
  hostNames: string[];
  hostToValueMap: Record<string, string | undefined>;
  hostToSlotMap?: Record<string, number>;
  slotDefinitions?: any[];
}

export interface HostMetricsData {
  hostName: string;
  name: string;
  data: number | string;
  metric_path: string;
  originalData?: number;
}

export interface HeatmapApiResponse {
  items: Array<{
    Hosts: {
      host_name: string;
      public_host_name: string;
      os_type: string;
      ip: string;
      rack_info: string;
    };
    metrics?: {
      disk?: {
        disk_total: number;
        disk_free: number;
      };
      cpu?: {
        cpu_system: number;
        cpu_user: number;
      };
      memory?: {
        mem_total: number;
        mem_free: number;
      };
    };
    host_components: Array<{
      HostRoles: {
        component_name: string;
      };
    }>;
  }>;
}
