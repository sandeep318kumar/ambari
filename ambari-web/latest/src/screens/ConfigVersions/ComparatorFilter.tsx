import Select from "react-select";
import { FilterLevels } from "./constants";



type ComparatorFilterProps = {
  selectedFilters: any;
  setSelectedFilters: (filters: any) => void;
};

function ComparatorFilter({
  selectedFilters,
  setSelectedFilters,
}: ComparatorFilterProps) {
  const options = [
    { label: "Overridden Properties", value: FilterLevels.OVERRIDDEN },
    { label: "Changed Properties", value: FilterLevels.CHANGED },
    { label: "Final Properties", value: FilterLevels.FINAL },
    { label: "Show property Issues", value: FilterLevels.ISSUES },
    { label: "Clear Filters", value: FilterLevels.CLEAR },
  ];

  const handleFilterChange = (newSelectedFilters: any) => {
    // Check if "Clear Filters" was selected
    const clearFilterSelected = newSelectedFilters?.some(
      (filter: any) => filter.value === FilterLevels.CLEAR
    );

    if (clearFilterSelected) {
      // If "Clear Filters" is selected, clear all filters
      setSelectedFilters([]);
    } else {
      // Otherwise, set the selected filters normally
      setSelectedFilters(newSelectedFilters);
    }
  };

  return (
    <>
      <Select
        options={options}
        isMulti
        className="w-50"
        placeholder="Filters"
        value={selectedFilters}
        onChange={handleFilterChange}
      />
    </>
  );
}

export default ComparatorFilter;
