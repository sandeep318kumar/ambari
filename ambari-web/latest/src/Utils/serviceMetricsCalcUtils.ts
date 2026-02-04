import bytesToSize from "./numberUtils.ts";

export function findCapacityPercentage (dfsNonDFSCapacity:any, capacityTotal:any)  {
  let percent:any = capacityTotal && dfsNonDFSCapacity && capacityTotal > 0 ? ((dfsNonDFSCapacity * 100) / capacityTotal).toFixed(2) : 0;
  if (isNaN(percent) || percent < 0) {
    percent = 'N/A';
  }
  return `${percent}%`;
}

export function diskPart (capacity:any, capacityTotal:any)  {
    return `${bytesToSize(capacity, 1, 'parseFloat')} / ${bytesToSize(capacityTotal, 1, 'parseFloat')}`;
}

