import { useContext } from "react";
import { AppContext } from "../store/context.tsx";
import { serviceCache } from "../Utils/cacheUtils";

/**
 * Hook to check if a service is installed and provide caching utilities
 * @param serviceName - The name of the service to check (e.g., "HDFS", "SPARK3")
 * @returns Object with service installation status and cache utilities
 */
export const useServiceCache = (serviceName: string) => {
  // @ts-ignore
  const { services } = useContext(AppContext);
  
  // Check if service is installed
  const isServiceInstalled = services && Array.isArray(services) && 
    services.some((service: any) => service.ServiceInfo.service_name === serviceName);
  
  // Cache utilities specific to this service
  const cacheKey = (key: string) => `${serviceName.toLowerCase()}_${key}`;
  
  const getCachedData = <T>(key: string): T | null => {
    return serviceCache.get<T>(cacheKey(key));
  };
  
  const setCachedData = <T>(key: string, data: T, ttlMs: number = 30000): void => {
    serviceCache.set(cacheKey(key), data, ttlMs);
  };
  
  const hasCachedData = (key: string): boolean => {
    return serviceCache.has(cacheKey(key));
  };
  
  const clearServiceCache = (): void => {
    // Clear all cache entries for this service
    // Note: This is a simple implementation. In a production system,
    // you might want to track service-specific keys for more efficient clearing
    serviceCache.clear();
  };
  
  return {
    isServiceInstalled,
    getCachedData,
    setCachedData,
    hasCachedData,
    clearServiceCache,
  };
};

/**
 * Higher-order function to wrap service hooks with installation check
 * @param serviceName - The name of the service
 * @param hookFunction - The original hook function
 * @returns Wrapped hook function that returns early if service is not installed
 */
export const withServiceInstallationCheck = (
  serviceName: string,
  hookFunction: () => void | Promise<void>
) => {
  return () => {
    const { isServiceInstalled } = useServiceCache(serviceName);
    
    if (!isServiceInstalled) {
      return;
    }
    
    return hookFunction();
  };
};
