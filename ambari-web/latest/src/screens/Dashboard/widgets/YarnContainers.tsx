import { useContext, useEffect, useState } from "react";
import { ServiceContext } from "../../../store/ServiceContext";
import ChartContainer from "../ChartContainer";

interface ContainerData {
  allocated: number;
  pending: number;
  reserved: number;
  total: number;
}

export default function YarnContainers() {
  const { allServiceModels } = useContext(ServiceContext);
  const [containerData, setContainerData] = useState<ContainerData>({
    allocated: 0,
    pending: 0,
    reserved: 0,
    total: 0,
  });


  useEffect(() => {
    if (allServiceModels?.yarn) {
      const yarnService = allServiceModels.yarn;
      const allocated = yarnService.containersAllocated || 0;
      const pending = yarnService.containersPending || 0;
      const reserved = yarnService.containersReserved || 0;
      const total = allocated + pending + reserved;

      setContainerData({
        allocated,
        pending,
        reserved,
        total,
      });
    }
  }, [allServiceModels?.yarn]);

  const isLoading = !allServiceModels?.yarn;

  const displayText = `${containerData.allocated}/${containerData.pending}/${containerData.reserved}`;
  const hoverContent = `${containerData.allocated} allocated, ${containerData.pending} pending, ${containerData.reserved} reserved`;

  if (isLoading) {
    return (
      <ChartContainer text="Loading..." onHoverContent="Fetching YARN container metrics...">
        <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer text={displayText} onHoverContent={hoverContent}>
    </ChartContainer>
  );
}
