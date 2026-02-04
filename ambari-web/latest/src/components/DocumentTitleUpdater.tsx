/* START GENAI */
import { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { AppContext } from '../store/context';

/**
 * Component to dynamically update the document title based on authentication state and cluster name
 * - Before sign in (login page): "Ambari"
 * - After sign in with cluster: "Ambari - {clusterName}"
 * - After sign in without cluster: "Ambari"
 * - After sign out: "Ambari"
 */
const DocumentTitleUpdater = () => {
  const { clusterName, sessionExists, sessionsValidated } = useContext(AppContext);
  
  // Check if user is on login page
  const isLoginPage = window.location.hash === '#/login';
  
  // Determine the title based on conditions
  let title = 'Ambari';
  
  // Only show cluster name if user is authenticated and not on login page
  if (!isLoginPage && sessionExists && sessionsValidated && clusterName) {
    title = `Ambari - ${clusterName}`;
  }
  
  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
};

export default DocumentTitleUpdater;
/* END GENAI */
