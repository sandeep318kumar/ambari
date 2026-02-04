import {  get, has } from "lodash";

export const groupPropertyValues = (collection: any[], key: string) => {
  const group: any = {};
  for (let item of collection) {
    const value: any = get(item, key, "");
    if (!has(group, value)) {
      //@ts-ignore  
      group[value] = [item];
      // set(group, value, [item]);
    } else {
        group[value] = [...group[value], item];
    }
  }
  return group;
};
