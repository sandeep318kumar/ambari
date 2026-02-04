import React from 'react';
import ViewIframe from '../../components/ViewIframe/ViewIframe';
import { useParams } from 'react-router-dom';

/**
 * ViewDetails component that renders a specific Ambari view
 * Uses the ViewIframe component to display the view content
 */
const ViewDetails: React.FC = () => {
    useParams<{
        viewName: string;
        viewVersion: string;
        instanceName: string;
    }>();

    return (
        <div className="view-details-container">
            <ViewIframe />
        </div>
    );
};

export default ViewDetails;