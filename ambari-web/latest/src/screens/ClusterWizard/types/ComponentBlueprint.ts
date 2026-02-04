export interface ComponentBlueprint {
    blueprint: { host_groups: HostGroups[] };
    blueprint_cluster_binding: {
      host_groups: {
        name: string;
        hosts: {
          fqdn: string;
        }[];
      }[];
    };
  }
  
  interface HostGroups {
    name: string;
    components: {
      name: string;
    }[];
  }