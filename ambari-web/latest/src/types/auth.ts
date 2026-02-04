// User authentication and authorization types
export interface User {
  user_name: string;
  user_id: number;
  user_type: string;
  admin: boolean;
  operator: boolean;
  cluster_user: boolean;
  active: boolean;
  ldap_user: boolean;
  principal_type: string;
}

export interface Privilege {
  privilege_id: number;
  permission_name: string;
  permission_label: string;
  principal_name: string;
  principal_type: string;
  type: 'CLUSTER' | 'VIEW' | 'AMBARI';
  cluster_name?: string;
  view_name?: string;
  version?: string;
  instance_name?: string;
}

export interface Authorization {
  authorization_id: string;
  authorization_name: string;
  resource_type: string;
}

export interface UserContextType {
  // User data
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Authorization data
  authorizations: Authorization[];
  privileges: Privilege[];
  
  // Parsed privileges for easy access
  clusterPrivileges: Record<string, string[]>;
  viewPrivileges: Record<string, {
    privileges: string[];
    version: string;
    view_name: string;
  }>;
  
  // Helper methods
  havePermissions: (authRoles: string) => boolean;
  hasAuthorization: (authId: string) => boolean;
  hasPrivilege: (permissionName: string, clusterName?: string) => boolean;
  isAdmin: () => boolean;
  isOperator: () => boolean;
  isClusterUser: () => boolean;
  isClusterOperator: () => boolean;
  loginError: string | null;
  
  // Actions
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

export interface LoginResponse {
  Users: User;
  privileges?: Privilege[];
}

export interface AuthorizationResponse {
  items: Array<{
    AuthorizationInfo: Authorization;
  }>;
}

export interface PrivilegeResponse {
  items: Array<{
    PrivilegeInfo: Privilege;
  }>;
}
