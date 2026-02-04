import { useParams } from "react-router-dom";
import ServiceDashboard from "./ServiceDashboard";

function ServiceLoader(){
    const {componentName}=useParams();
    function mapEnableFlow(){
        switch(componentName?.toLowerCase()){
            case "namenode":
            case "snamenode":
            case "secondary_namenode":
                return <ServiceDashboard serviceName="HDFS" />
            case "resourcemanager":
            case "historyserver":
                return <ServiceDashboard serviceName="YARN" />
            case "JournalNode":
            case "journalnode":
                return <ServiceDashboard serviceName="HDFS" />
            case "RangerAdmin":
            case "rangeradmin":
                return <ServiceDashboard serviceName="RANGER" />
            case "ResourceManager":
            case "resourcemanager":
                 return <ServiceDashboard serviceName="YARN" />
                return <ServiceDashboard serviceName="YARN" />
            case "app_timeline_server":
                return <ServiceDashboard serviceName="YARN" />
            case "YARN_REGISTRY_DNS":
            case "yarn_registry_dns":
                return <ServiceDashboard serviceName="YARN" />
            case "metrics_collector":
            case "METRICS_COLLECTOR":
                return <ServiceDashboard serviceName="AMBARI_METRICS" />
            case "ssm_server":
                return <ServiceDashboard serviceName="SSM" />
            case "hive_server":
                return <ServiceDashboard serviceName="HIVE" />
            case "hive_metastore":
                return <ServiceDashboard serviceName="HIVE" />
            case "historyserver":
                return <ServiceDashboard serviceName="YARN" />    

      default:
        return <div>Service Dashboard Not Available</div>;
    }
  }

  return <>{mapEnableFlow()}</>;
}

export default ServiceLoader;
