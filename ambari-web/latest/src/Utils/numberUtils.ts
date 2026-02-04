export default function bytesToSize(
  bytes: number | undefined,
  precision = 0,
  parseType = "parseInt",
  multiplyBy = 1
) {
  if (bytes === undefined) {
    return "n/a";
  } else {
    let value = bytes * multiplyBy;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
    let posttxt = 0;
    while (value >= 1024) {
      posttxt++;
      value = value / 1024;
    }
    if (value === 0) {
      precision = 0;
    }
    //@ts-expect-error
    const parsedValue = window[parseType](value);
    return parsedValue.toFixed(precision) + " " + sizes[posttxt];
  }
}

export function getCardinalityValue(cardinality: string, isMax: boolean) {
  if (cardinality) {
    const isOptional = cardinality.toString().split("-").length > 1;
    if (isOptional) {
      return parseInt(cardinality.split("-")[isMax ? 1 : 0]);
    } else {
      if (isMax)
        return /^\d+\+/.test(cardinality as string) || cardinality == "ALL"
          ? Infinity
          : parseInt(cardinality);
      return cardinality == "ALL"
        ? Infinity
        : parseInt(cardinality.toString().replace("+", ""));
    }
  } else {
    return 0;
  }
}

export function isHAComponentOnly(componentName: string) {
  return ["ZKFC", "JOURNALNODE"].includes(componentName);
}

export function to2DecimalPlaces(
  value: number | string,
  decimalPlaces = 2
): string {
  return Number(
    Math.floor(parseFloat(value + "e" + decimalPlaces)) + "e-" + decimalPlaces
  ).toFixed(decimalPlaces);
}
