import { useHDFSConfigUpdater } from "../hooks/useHDFSConfigUpdater";
import { useZkConfigUpdater } from "../hooks/useZkConfigUpdater";
import { useHbaseConfigUpdater } from "../hooks/useHbaseConfigUpdater.ts";
import { useRangerConfigUpdater } from "../hooks/useRangerConfigUpdater.ts";
import { useContext } from "react";
import { AppContext } from "./context.tsx";
import { useMapReduce2ConfigUpdater } from "../hooks/useMapReduce2ConfigUpdater.ts";
import { useTezConfigUpdater } from "../hooks/useTezConfigUpdater.ts";
import { useSpark3ConfigUpdater } from "../hooks/useSpark3ConfigUpdater.ts";
import { useKerberosConfigUpdater } from "../hooks/useKerberosConfigUpdater.ts";
import { useRangerKMSConfigUpdater } from "../hooks/useRangerKMSConfigUpdater.ts";
import { useAmbariMetricsConfigUpdater } from "../hooks/useAmbariMetricsConfigUpdater.ts";
import { useTrinoConfigUpdater } from "../hooks/useTrinoConfigUpdater.tsx";
import { useSSMConfigUpdater } from "../hooks/useSSMConfigUpdater.ts";
import { useYarnConfigUpdater } from "../hooks/useYarnConfigUpdater.ts";
import { useHiveConfigUpdater } from "../hooks/useHiveConfigUpdater.ts";
import { useKyuubiConfigUpdater } from "../hooks/useKyuubiConfigUpdater.ts";
import { useSqoopConfigUpdater } from "../hooks/useSqoopConfigUpdater.ts";
import { useTrinoGatewayConfigUpdater } from "../hooks/useTrinoGatewayConfigUpdater.ts";

function Updater() {
  const { services } = useContext(AppContext);
  console.log("service for updater ", services);
  services.forEach((service) => {
    const serviceName = service.ServiceInfo.service_name;
    switch (serviceName) {
      case "HDFS":
        useHDFSConfigUpdater();
        break;
      case "HBASE":
        useHbaseConfigUpdater();
        break;
      case "RANGER":
        useRangerConfigUpdater();
        break;
      case "ZOOKEEPER":
        useZkConfigUpdater();
        break;
      case "MAPREDUCE2":
        useMapReduce2ConfigUpdater();
        break;
      case "TEZ":
        useTezConfigUpdater();
        break;
      case "SPARK3":
        useSpark3ConfigUpdater();
        break;
      case "KERBEROS":
        useKerberosConfigUpdater();
        break;
      case "RANGER_KMS":
        useRangerKMSConfigUpdater();
        break;
      case "AMBARI_METRICS":
        useAmbariMetricsConfigUpdater();
        break;
      case "TRINO":
        useTrinoConfigUpdater();
        break;
      case "SSM":
        useSSMConfigUpdater();
        break;
      case "HIVE":
        useHiveConfigUpdater();
        break;
      case "YARN":
        useYarnConfigUpdater();
        break;
      case "SQOOP":
        useSqoopConfigUpdater();
        break;
      case "KYUUBI":
        useKyuubiConfigUpdater();
        break;
      case "TRINO_GATEWAY":
        useTrinoGatewayConfigUpdater();
        break;
      default:
        // Handle unknown service names if necessary
        break;
    }
  });
  return <></>;
}

export default Updater;
