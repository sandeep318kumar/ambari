import { useContext, useMemo } from "react";
import { ServiceContext } from "../../../store/ServiceContext";
import ChartContainer from "../ChartContainer";
import { isEmpty } from "lodash";

export default function NameNodeUptime() {
  const { allServiceModels } = useContext(ServiceContext);

  const modelValue = isEmpty(allServiceModels["hdfs"]?.["namenodeUptime"]) ? 0 : allServiceModels["hdfs"]?.["namenodeUptime"];

  const parseUptimeToMilliseconds = (uptimeStr: string): number => {
    if (!uptimeStr || uptimeStr === "Not Running") return 0;
    
    let totalMs = 0;
    const dayMatch = uptimeStr.match(/(\d+)d/);
    const hourMatch = uptimeStr.match(/(\d+)h/);
    const minuteMatch = uptimeStr.match(/(\d+)m/);
    const secondMatch = uptimeStr.match(/(\d+)s/);
    
    if (dayMatch) totalMs += parseInt(dayMatch[1]) * 24 * 60 * 60 * 1000;
    if (hourMatch) totalMs += parseInt(hourMatch[1]) * 60 * 60 * 1000;
    if (minuteMatch) totalMs += parseInt(minuteMatch[1]) * 60 * 1000;
    if (secondMatch) totalMs += parseInt(secondMatch[1]) * 1000;
    
    return totalMs;
  };

  const getStartTime = (uptimeStr: string): string => {
    const uptimeMs = parseUptimeToMilliseconds(uptimeStr);
    if (uptimeMs === 0) return "";
    
    const now = new Date();
    const startTime = new Date(now.getTime() - uptimeMs);
    
    const weekday = startTime.toLocaleDateString('en-US', { weekday: 'short' });
    const month = startTime.toLocaleDateString('en-US', { month: 'short' });
    const day = startTime.getDate();
    const year = startTime.getFullYear();
    const hours = String(startTime.getHours()).padStart(2, '0');
    const minutes = String(startTime.getMinutes()).padStart(2, '0');
    const seconds = String(startTime.getSeconds()).padStart(2, '0');
    
    return `${weekday} ${month} ${day} ${year}\n${hours}:${minutes}:${seconds}`;
  };

  const getUptime = () => {
    if (!modelValue) return "Not Running";
    return modelValue;
  };

  const uptime = getUptime();
  
  const startTime = useMemo(() => {
    return getStartTime(uptime);
  }, [uptime]);

  const dataToDisplay = startTime 
    ? `${uptime}\n${startTime}`
    : `${uptime}`;

  return (
    <ChartContainer
      text={uptime}
      onHoverContent={dataToDisplay}
    >
      <div className="p-3"></div>
    </ChartContainer>
  );
}
