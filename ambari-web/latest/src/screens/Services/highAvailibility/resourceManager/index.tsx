import { Dropdown } from "react-bootstrap";
import { ServiceActionEnums } from "../../../../enums/ServiceActionEnums";
import { useEffect, useState } from "react";
import ValidateEnablement from "./ValidateEnablement";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSitemap } from "@fortawesome/free-solid-svg-icons";

function EnableHighAvailibilityResourceManger({
  isMappingOnly,
}: {
  isMappingOnly?: boolean;
}) {
  const [shouldStartEnableFlow, setShouldStartEnableFlow] = useState(false);
  const { componentName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (
      location.pathname.includes("highAvailability") &&
      componentName === "ResourceManager"
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
              `/main/services/highAvailability/ResourceManager/enable/step1`
            );
          }}
        >
          <FontAwesomeIcon className="text-secondary me-2" icon={faSitemap} />

          {ServiceActionEnums.enableRmHighAvailability}
        </Dropdown.Item>
      ) : null}
    </>
  );
}

export default EnableHighAvailibilityResourceManger;
