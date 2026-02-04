import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import ViewApi from '../../api/ViewApi';
import { get } from 'lodash';
import Table from '../../components/Table';
import { Row as TableRow } from '@tanstack/react-table';
import viewIcon from '../../assets/img/ambari-view-default.png';

type ViewInstance = {
    instance_name: string;
    view_name: string;
    version: string;
    label?: string;
    description?: string;
};

const ViewsListPage: React.FC = () => {
    const [viewInstances, setViewInstances] = useState<ViewInstance[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchViewInstances = async () => {
            try {
                setIsLoading(true);
                const data = await ViewApi.getInstances();
                const instanceDetails = processViewData(data);
                setViewInstances(instanceDetails);
            } catch (error) {
                console.error("Failed to fetch view instances:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchViewInstances();
    }, []);

    const processViewData = (data: any): ViewInstance[] => {
        return (data?.items ?? [])
            .flatMap((item: { versions: any; }) => {
                // Extract view_name from each item
                const viewName = get(item, "ViewInfo.view_name");
                return (item?.versions ?? []).map((version: any) => ({
                    ...version,
                    view_name: viewName
                }));
            })
            .flatMap((version: { instances: any; view_name: any; }) => {
                // Extract version info
                const versionNumber = get(version, "ViewVersionInfo.version");
                return (version?.instances ?? []).map((instance: any) => ({
                    ...instance,
                    view_name: version.view_name,
                    version: versionNumber
                }));
            })
            .map((instance: { view_name: any; version: any; }) => ({
                ...get(instance, "ViewInstanceInfo", {}),
                view_name: instance.view_name,
                version: instance.version
            }))
            .filter(Boolean);
    };

    const handleViewClick = (view: ViewInstance) => {
        navigate(`/main/views/${view.view_name}/${view.version}/${view.instance_name}`);
    };

    if (isLoading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                <div>Loading views...</div>
            </Container>
        );
    }

    // @ts-ignore
    const columns = [
        {
            accessorKey: 'icon',
            header: '',
            cell: () => (
                <div className="d-flex justify-content-center align-items-center" style={{ width: '60px' }}>
                    <img src={viewIcon} alt="View icon" style={{ width: '40px', height: '40px' }} />
                </div>
            ),
            width: '60px'
        },
        {
            accessorKey: 'details',
            header: '',
            cell: ({ row }: { row: TableRow<ViewInstance> }) => {
                const view = row.original;
                return (
                    <div onClick={() => handleViewClick(view)} style={{ cursor: 'pointer' }}>
                        <h4 className="mb-1">
                            {view.label || view.instance_name}
                            <small className="text-muted"> &nbsp;&nbsp;({view.version})</small>
                        </h4>
                        <p className="text-muted mb-0">{view.description || view.instance_name}</p>
                    </div>
                );
            }
        }
    ];

    return (
        <Container fluid className="p-4" id="views">
            <Row className="mb-4">
                <Col>
                    <h2>Your Views</h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table
                        columns={columns}
                        data={viewInstances}
                        hover={true}
                        className="views-table"
                        scrollable={false}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default ViewsListPage;