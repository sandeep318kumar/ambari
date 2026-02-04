import { Card, CardBody, Dropdown } from "react-bootstrap";
import { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faPencilAlt,
  faClone,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

interface ChartContainerProps {
  children: ReactNode;
  widgetHeader: string;
  onEdit?: () => void;
  onClone?: () => void;
  onDelete?: () => void;
  onViewDetails?: () => void;
  onShare?: () => void;
}

function WidgetContainer({
  children,
  widgetHeader,
  onEdit,
  onClone,
  onDelete,
  onViewDetails,
  onShare,
}: ChartContainerProps) {
  const handleEdit = () => {
    if (onEdit) onEdit();
  };

  const handleClone = () => {
    if (onClone) onClone();
  };

  const handleDelete = () => {
    if (onDelete) onDelete();
  };

  const handleViewDetails = () => {
    if (onViewDetails) onViewDetails();
  };

  const handleShare = () => {
    if (onShare) onShare();
  };

  return (
    <Card className="widget-card mh-100">
      <CardBody>
        <div className="d-flex align-items-center justify-content-between">
          <h4>{widgetHeader}</h4>
          <Dropdown>
            <Dropdown.Toggle
              as="div"
              id="widget-dropdown"
              className="cursor-pointer dropdown-no-arrow"
              variant="link"
            >
              <FontAwesomeIcon icon={faEllipsisV} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {onEdit && (
                <Dropdown.Item onClick={handleEdit}>
                  <FontAwesomeIcon icon={faPencilAlt} className="me-2" /> Edit
                </Dropdown.Item>
              )}
              {onClone && (
                <Dropdown.Item onClick={handleClone}>
                  <FontAwesomeIcon icon={faClone} className="me-2" /> Clone
                </Dropdown.Item>
              )}
              {onDelete && (
                <Dropdown.Item onClick={handleDelete} className="text-danger">
                  <FontAwesomeIcon icon={faTrash} className="me-2" /> Delete
                </Dropdown.Item>
              )}
              {onViewDetails && (
                <Dropdown.Item onClick={handleViewDetails}>
                  <FontAwesomeIcon icon={faEllipsisV} className="me-2" /> View
                  Details
                </Dropdown.Item>
              )}
              {onShare && (
                <Dropdown.Item onClick={handleShare}>
                  <FontAwesomeIcon icon={faEllipsisV} className="me-2" /> Share
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div>{children}</div>
      </CardBody>
    </Card>
  );
}

export default WidgetContainer;
