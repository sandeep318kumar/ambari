import React from 'react';
import { Link } from 'react-router-dom';
import { generateViewUrl } from '../../Utils/viewUtils';

interface ViewLinkProps {
    viewName: string;
    viewVersion: string;
    instanceName: string;
    viewPath?: string;
    className?: string;
    children?: React.ReactNode;
}

/**
 * A component that renders a link to any Ambari view
 */
const ViewLink: React.FC<ViewLinkProps> = ({
                                               viewName,
                                               viewVersion,
                                               instanceName,
                                               viewPath = '',
                                               className = '',
                                               children
                                           }) => {
    const viewUrl = generateViewUrl(viewName, viewVersion, instanceName, viewPath);

    return (
        <Link to={viewUrl} className={className}>
            {children || `${viewName} View`}
        </Link>
    );
};

export default ViewLink;