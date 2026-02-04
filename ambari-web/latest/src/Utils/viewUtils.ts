/**
 * Utility functions for working with Ambari views
 */

/**
 * Generates a URL for an Ambari view
 *
 * @param viewName - The name of the view (e.g., 'ADMIN_VIEW')
 * @param viewVersion - The version of the view (e.g., '2.7.6.3')
 * @param instanceName - The instance name (e.g., 'INSTANCE')
 * @param viewPath - Optional path within the view (e.g., '/clusterInformation')
 * @returns The full URL path to the view
 */
export const generateViewUrl = (
    viewName: string,
    viewVersion: string,
    instanceName: string,
    viewPath: string = ''
): string => {
    // Construct the base view URL
    let url = `/main/views/${viewName}/${viewVersion}/${instanceName}`;

    // Add the view path if provided
    if (viewPath) {
        // Ensure viewPath starts with a slash or hash
        if (!viewPath.startsWith('/') && !viewPath.startsWith('#')) {
            viewPath = '/' + viewPath;
        }
        url += viewPath;
    }

    return url;
};



export default {
    generateViewUrl
};