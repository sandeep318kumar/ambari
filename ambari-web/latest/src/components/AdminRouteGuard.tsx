import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useContext } from 'react';
import { AppContext } from '../store/context';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

/**
 * Admin Route Guard - Implements Ember.js ui/app/routes/main.js admin route protection
 * 
 * Ember.js Pattern:
 * if (router.get('loggedIn') && !App.isAuthorized('CLUSTER.TOGGLE_KERBEROS, SERVICE.SET_SERVICE_USERS_GROUPS, CLUSTER.UPGRADE_DOWNGRADE_STACK, CLUSTER.VIEW_STACK_DETAILS')
 *   && !(App.get('upgradeInProgress') || App.get('upgradeHolding'))) {
 *   router.transitionTo('main.dashboard.index');
 * }
 */
export const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({ children }) => {
  const { hasAuthorization, isAuthenticated } = useAuth();
  const { upgradeState } = useContext(AppContext);
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check upgrade states
  const upgradeInProgress = upgradeState === 'IN_PROGRESS';
  const upgradeHolding = upgradeState?.includes('HOLDING') || false;
  
  // Check if user has any admin permissions (matching Ember.js complex check)
  const hasAnyAdminPermission = 
    hasAuthorization('CLUSTER.TOGGLE_KERBEROS') ||
    hasAuthorization('SERVICE.SET_SERVICE_USERS_GROUPS') ||
    hasAuthorization('CLUSTER.UPGRADE_DOWNGRADE_STACK') ||
    hasAuthorization('CLUSTER.VIEW_STACK_DETAILS');
  
  // If user doesn't have admin permissions and no upgrade is running, redirect to dashboard
  if (!hasAnyAdminPermission && !upgradeInProgress && !upgradeHolding) {
    return <Navigate to="/main/dashboard/metrics" replace />;
  }
  
  // User has permission or upgrade is running, allow access
  return <>{children}</>;
};

export default AdminRouteGuard;
