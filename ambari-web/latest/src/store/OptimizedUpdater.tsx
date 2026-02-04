import { useHDFSConfigUpdater } from "../hooks/useHDFSConfigUpdater";
import { useZkConfigUpdater } from "../hooks/useZkConfigUpdater";
import { useHbaseConfigUpdater } from "../hooks/useHbaseConfigUpdater.ts";
import { useRangerConfigUpdater } from "../hooks/useRangerConfigUpdater.ts";
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
import { usePinotConfigUpdater } from "../hooks/usePinotConfigUpdater.ts";

function OptimizedUpdater() {

  // Call all hooks unconditionally - this fixes the Rules of Hooks violation
  // The hooks will internally check if their service is installed and act accordingly
  // This maintains the same functionality but follows React's Rules of Hooks

  useHDFSConfigUpdater();
  useHbaseConfigUpdater();
  useRangerConfigUpdater();
  useZkConfigUpdater();
  useMapReduce2ConfigUpdater();
  useTezConfigUpdater();
  useSpark3ConfigUpdater();
  useKerberosConfigUpdater();
  useRangerKMSConfigUpdater();
  useAmbariMetricsConfigUpdater();
  useTrinoConfigUpdater();
  useSSMConfigUpdater();
  useHiveConfigUpdater();
  useYarnConfigUpdater();
  useSqoopConfigUpdater();
  useKyuubiConfigUpdater();
  useTrinoGatewayConfigUpdater();
  usePinotConfigUpdater();

  return <></>;
}

export default OptimizedUpdater;
