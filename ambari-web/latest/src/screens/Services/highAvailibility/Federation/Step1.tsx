import { useContext, useEffect, useState } from "react";
import {
  Alert,
  Card,
  CardBody,
  Col,
  FormControl,
  Row,
  Stack,
} from "react-bootstrap";
import WizardFooter from "../../../../components/StepWizard/WizardFooter";
import { EnableNamenodeFederationContext } from "./store/context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMultiply } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { ActionTypes } from "./store/types";
import { messages } from "../../../messages";
import { get } from "lodash";
import useConfigsTags from "../../../../hooks/useConfigsTags";

function Step1() {
  const [isNextEnabled, setIsNextEnabled] = useState(false);
  const [existingNameServiceId, setExistingNameServiceId] = useState("");
  const [newNameServiceId, setNewNameServiceId] = useState("");
  const {
    dispatch,
    stepWizardUtilities: { currentStep, handleNextImperitive },
    flushStateToDb
  } = useContext(EnableNamenodeFederationContext);
  const [nameError, setNameError] = useState("");
  const { configsData } = useConfigsTags();

  useEffect(() => {
    getExistingNameServiceId();
  }, [configsData]);

  useEffect(() => {
    if (newNameServiceId) {
      let nameSarviceIdRegex =
        /^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])$/;
      if (nameSarviceIdRegex.test(newNameServiceId)) {
        setNameError("");
        setIsNextEnabled(true);
      } else {
        setIsNextEnabled(false);
        setNameError(
          "Must consist of letters, numbers, and hyphens. Cannot begin or end with a hyphen."
        );
      }
    }
    if (!newNameServiceId) {
      setNameError("");
      setIsNextEnabled(false);
    }
  }, [newNameServiceId]);

  const getExistingNameServiceId = () => {
    let nameService = "";
    if (configsData && Array.isArray(configsData.items)) {
      configsData.items.forEach((item: any) => {
        if (
          item.type === "hdfs-site" &&
          item.properties &&
          item.properties["dfs.nameservices"]
        ) {
          nameService = item.properties["dfs.nameservices"];
        }
      });
    }
    setExistingNameServiceId(nameService)
  };

  return (
    <>
      <h2 className="step-title">Get Started</h2>
      <h3 className="step-description light-text">
        {get(messages, "admin.nameNodeFederation.wizard.step1.body")}
      </h3>
      <Alert className="mt-2" variant="danger">
        {get(messages, "admin.nameNodeFederation.wizard.step1.alert")}
      </Alert>
      <Card className="mt-2">
        <CardBody>
          <Row className="align-items-center mb-2">
            <Col md={3} className="bolder">
              Existing Nameservice IDs:
            </Col>
            <Col md={4}>
              <div>{existingNameServiceId}</div>
            </Col>
          </Row>
          <Row className="align-items-center">
            <Col md={3} className="bolder">
              New Nameservice ID:
            </Col>
            <Col md={4}>
              <FormControl
                type="text"
                value={newNameServiceId}
                className={classNames({
                  "is-invalid": nameError,
                })}
                onChange={(e) => {
                  setNewNameServiceId(e.target.value);
                }}
              ></FormControl>
            </Col>
            <Col>
              {nameError ? (
                <Stack direction="horizontal">
                  <FontAwesomeIcon
                    icon={faMultiply}
                    color="red"
                  ></FontAwesomeIcon>
                  <div className="ms-2 text-muted text-nowrap">{nameError}</div>
                </Stack>
              ) : null}
            </Col>
          </Row>
        </CardBody>
      </Card>
      <WizardFooter
        step={currentStep}
        isNextEnabled={isNextEnabled}
        onBack={() => {}}
        onNext={() => {
          dispatch({
            type: ActionTypes.STORE_INFORMATION,
            payload: {
              step: currentStep.name,
              data: {
                nameserviceIds: {existingNameServiceId, newNameServiceId},
              },
            },
          });
          flushStateToDb("next");
          handleNextImperitive();
        }}
        onCancel={() => {
          flushStateToDb("cancel");
        }}
      />
    </>
  );
}

export default Step1;
