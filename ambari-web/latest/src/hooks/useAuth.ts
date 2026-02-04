import { useUserContext } from '../store/UserContext';

/**
 * Custom hook for accessing user authentication and authorization data
 */
export const useAuth = () => {
  const context = useUserContext();
  
  return {
    // User data
    user: context.user,
    isAuthenticated: context.isAuthenticated,
    isLoading: context.isLoading,
    
    // Authorization data
    authorizations: context.authorizations,
    privileges: context.privileges,
    clusterPrivileges: context.clusterPrivileges,
    viewPrivileges: context.viewPrivileges,
    
    // Helper methods
    havePermissions: context.havePermissions,
    hasAuthorization: context.hasAuthorization,
    hasPrivilege: context.hasPrivilege,
    isAdmin: context.isAdmin,
    isOperator: context.isOperator,
    isClusterUser: context.isClusterUser,
    
    // Actions
    login: context.login,
    logout: context.logout,
    refreshUserData: context.refreshUserData
  };
};

/**
 * Hook for checking specific authorizations
 */
export const useAuthorization = (authId: string) => {
  const { hasAuthorization } = useAuth();
  return hasAuthorization(authId);
};

/**
 * Hook for checking specific privileges
 */
export const usePrivilege = (permissionName: string, clusterName?: string) => {
  const { hasPrivilege } = useAuth();
  return hasPrivilege(permissionName, clusterName);
};

/**
 * Hook for checking admin status
 */
export const useIsAdmin = () => {
  const { isAdmin } = useAuth();
  return isAdmin();
};

/**
 * Hook for checking operator status
 */
export const useIsOperator = () => {
  const { isOperator } = useAuth();
  return isOperator();
};

/**
 * Hook for checking cluster user status
 */
export const useIsClusterUser = () => {
  const { isClusterUser } = useAuth();
  return isClusterUser();
};

export default useAuth;
