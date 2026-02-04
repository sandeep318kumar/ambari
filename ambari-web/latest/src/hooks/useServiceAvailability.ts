import { useContext, useMemo } from 'react';
import { AppContext } from '../store/context';

/**
 * Utility hook to check if specific services are installed in the cluster
 * This helps individual service hooks determine if they should run their logic
 */
export const useServiceAvailability = () => {
  const { services } = useContext(AppContext);
  
  // Create a stable map of installed services to prevent unnecessary re-renders
  const installedServicesMap = useMemo(() => {
    const serviceMap = new Map<string, any>();
    
    if (services && Array.isArray(services)) {
      services.forEach((service: any) => {
        const serviceName = service?.ServiceInfo?.service_name;
        if (serviceName) {
          serviceMap.set(serviceName, service);
        }
      });
    }
    
    return serviceMap;
  }, [services]);

  // Helper function to check if a service is installed
  const isServiceInstalled = (serviceName: string): boolean => {
    return installedServicesMap.has(serviceName);
  };

  // Helper function to get service info
  const getServiceInfo = (serviceName: string): any | null => {
    return installedServicesMap.get(serviceName) || null;
  };

  // Helper function to check multiple services at once
  const areServicesInstalled = (...serviceNames: string[]): boolean => {
    return serviceNames.every(name => installedServicesMap.has(name));
  };

  // Helper function to get all installed service names
  const getInstalledServiceNames = (): string[] => {
    return Array.from(installedServicesMap.keys());
  };

  return {
    isServiceInstalled,
    getServiceInfo,
    areServicesInstalled,
    getInstalledServiceNames,
    installedServicesCount: installedServicesMap.size,
    hasAnyServices: installedServicesMap.size > 0,
  };
};

/**
 * Higher-order hook that wraps service updater hooks to only run when the service is installed
 * This ensures that service hooks only execute their logic when the service is actually available
 */
export const withServiceCheck = <T extends any[]>(
  serviceName: string,
  hook: (...args: T) => void
) => {
  return (...args: T) => {
    const { isServiceInstalled } = useServiceAvailability();
    
    // Only run the actual hook logic if the service is installed
    if (isServiceInstalled(serviceName)) {
      hook(...args);
    } else if (process.env.NODE_ENV === 'development') {
      console.log(`Service ${serviceName} not installed, skipping hook execution`);
    }
  };
};
