import {get} from "lodash";
import { useEffect, useState } from "react";
import Select from "react-select";
type FiltersProps = {
  items: any;
  allItems: any;
  statusKey: string;
  selectedFilter: any;
  setSelectedFilter: any;
  successLevel?:'completed'|'success'
};
function Filters({
  items,
  allItems,
  statusKey,
  selectedFilter,
  setSelectedFilter,
  successLevel='completed'
}: FiltersProps) {
  const filterMap = {
    pending: "pending",
    in_progress: "in_progress",
    failed: "failed",
    completed: "completed",
    success:"success",
    aborted: "aborted",
    timedout: "timedout",
    all: "",
  };
  const filterOptions = () => [
    {
      label: `All (${allItems.length})`,
      value: filterMap.all,
    },
    {
      label: `Pending (${
        allItems.filter((item: any) => get(item, statusKey) === "PENDING")
          .length
      })`,
      value: filterMap.pending,
    },
    {
      label: `In Progress (${
        allItems.filter((item: any) => get(item, statusKey) === "IN_PROGRESS")
          .length
      })`,
      value: filterMap.in_progress,
    },
    {
      label: `Failed (${
        allItems.filter((item: any) => get(item, statusKey) === "FAILED").length
      })`,
      value: filterMap.failed,
    },
    {
      label: `Success (${
        allItems.filter((item: any) => get(item, statusKey) === "COMPLETED"||get(item, statusKey) === "SUCCESS")
          .length
      })`,
      value: successLevel === 'completed' ? filterMap.completed : filterMap.success,
    },
    {
      label: `Aborted (${
        allItems.filter((item: any) => get(item, statusKey) === "ABORTED")
          .length
      })`,
      value: filterMap.aborted,
    },
    {
      label: `Timed Out (${
        allItems.filter((item: any) => get(item, statusKey) === "TIMEDOUT")
          .length
      })`,
      value: filterMap.timedout,
    },
  ];
  const [filterOptionsState, setFilterOptionsState] = useState<any>(
    filterOptions()
  );

  useEffect(() => {
    setFilterOptionsState(filterOptions());
    if (!selectedFilter) {
      setSelectedFilter(filterOptions()[0]);
    } else {
      //Replace Value in Label when item length changes
      const selectedValue = filterOptions().find(
        (item: any) => item.value === selectedFilter.value
      );
      const selectedLabel = selectedValue?.label.split("(")[0];
      let selectedCount = 0;
      if (selectedValue?.value === filterMap.all) {
        selectedCount = allItems.length;
      } else {
        selectedCount = allItems.filter(
          (item: any) =>
            get(item, statusKey) === selectedFilter?.value?.toUpperCase()
        ).length;
      }
      const newLabel = `${selectedLabel} (${selectedCount})`;
      const newValue = {
        ...selectedValue,
        label: newLabel,
      };
      setSelectedFilter(newValue);
    }
  }, [items.length]);
  return (
    <>
      {/* START GENAI */}
      <Select
        options={filterOptionsState}
        styles={{
          // Fixes the overlapping problem of the component
          menu: (provided) => ({ ...provided, zIndex: 9999 }),
        }}
        value={selectedFilter}
        className="w-25"
        isSearchable={false}
        onChange={(value) => {
          setSelectedFilter(value);
        }}
      />
      {/* END GENAI */}
    </>
  );
}
export default Filters;
