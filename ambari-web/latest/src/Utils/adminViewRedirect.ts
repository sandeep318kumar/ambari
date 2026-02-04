import { ServiceApi } from '../api/ServiceApi';

export async function redirectToAdminView(adminPage = "") {
//   if (!localStorage.getItem('app.isAuthorized.CLUSTER.UPGRADE_DOWNGRADE_STACK')) {
//     window.location.replace('/#/login');
//     return;
//   }

  try {
    const data = await ServiceApi.getAmbariServerVersion();
    const components = data?.components || [];

    if (Array.isArray(components)) {
      const mappedVersions = components
        .filter(component => 
          component?.RootServiceComponents?.component_name === 'AMBARI_SERVER' &&
          component?.RootServiceComponents?.component_version
        )
        .map(component => component.RootServiceComponents.component_version);

      if (mappedVersions.length > 0) {
        const sortedVersions = mappedVersions.sort();
        const latestVersion = sortedVersions[sortedVersions.length - 1].replace(/[^\d.-]/g, '');
        const appRoot = window.location.origin;
        window.location.replace(`${appRoot}/views/ADMIN_VIEW/${latestVersion}/INSTANCE/#/${adminPage}`);
      }
    }
  } catch (error) {
    console.error('Error getting admin version:', error);
    window.location.replace('/#/main/views/index');
  }
}