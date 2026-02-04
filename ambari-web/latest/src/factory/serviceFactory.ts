import Service from "../models/service";
import { ServiceType } from "../screens/ClusterWizard/clusterStore/types";

export class ServiceFactory {
    private static serviceMap = new Map<ServiceType, typeof Service>();
  
    static registerService(type: any, ServiceClass: any) {
      this.serviceMap.set(type, ServiceClass);
    }
  
    static createService(type: ServiceType, config: any): Service {
      const ServiceClass = this.serviceMap.get(type);
      if (!ServiceClass) {
        throw new Error(`Unknown service type: ${type}`);
      }
      return new ServiceClass(config);
    }
  }