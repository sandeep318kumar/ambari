import { Dropdown } from "react-bootstrap";
import { ServiceActionEnums } from "../../../../enums/ServiceActionEnums";
import { useEffect, useState } from "react";
import ValidateEnablement from "./ValidateEnablement";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSitemap } from "@fortawesome/free-solid-svg-icons";

function ManageJournalNodes({ isMappingOnly }: { isMappingOnly?: boolean }) {
  const [shouldStartEnableFlow, setShouldStartEnableFlow] = useState(false);
  const { componentName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (
      location.pathname.includes("highAvailability") &&
      componentName === "JournalNode"
    ) {
      setShouldStartEnableFlow(true);
    }
  }, []);
  return (
    <>
      {shouldStartEnableFlow ? <ValidateEnablement /> : null}
      {!isMappingOnly ? (
        <Dropdown.Item
          onClick={() => {
            navigate(
              `/main/services/highAvailability/JournalNode/manage/step1`
            );
          }}
        >
          <FontAwesomeIcon className="text-secondary me-2" icon={faSitemap} />

          {ServiceActionEnums.manageJournalNodes}
        </Dropdown.Item>
      ) : null}
    </>
  );
}

export default ManageJournalNodes;
