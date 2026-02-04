import { useContext, useEffect, useState } from "react";
import ClusterApi from "../api/clusterApi";
import { ChooseServicesApi } from "../api/ChooseServicesApi";
import ConfigsApi from "../api/ConfigsApi";
import { isEmpty } from "lodash";
import { AppContext } from "../store/context";

function useStackServices() {
  const [services, setServices] = useState<any[]>([]);
  const [versionDetails, setVersionDetails] = useState<any>({});
  const {isClusterInstalled}=useContext(AppContext);
  const getConfigsCollectionMap = async () => { 
    //@ts-ignore
    const configs = await ConfigsApi.loadConfigsFromStack(
      versionDetails.stack,
      versionDetails.version,
      []
    );
  };

  async function getClusterVersionDetails() {
    const clusterName = await ClusterApi.getClusterName();
    const clusterDetails = await ClusterApi.getDesiredClusterConfigs(
      clusterName,
      `Clusters/provisioning_state,Clusters/security_type,Clusters/version,Clusters/cluster_id`
    );
    const cluster = clusterDetails?.Clusters;
    console.log("Cluster Details", clusterDetails, cluster);
    setVersionDetails({
      stack: cluster.version.split("-")[0],
      version: cluster.version.split("-")[1],
    });
  }

  useEffect(() => {
    const fetchServices = async () => {
      const services = await ChooseServicesApi.getServices(
        versionDetails?.stack,
        versionDetails?.version
      );
      setServices(services.items);
    };
    console.log("Version Details are",versionDetails);
    if (!isEmpty(versionDetails)) {
      fetchServices();
      getConfigsCollectionMap();
    }
  }, [versionDetails]);

  useEffect(()=>{
    if(isClusterInstalled)
    getClusterVersionDetails()
  },[isClusterInstalled])

  return { services };
}

export default useStackServices;
