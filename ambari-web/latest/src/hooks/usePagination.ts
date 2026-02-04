import { useState, useEffect, useMemo } from 'react';

const usePagination = (items: any[], initialItemsPerPage=10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

// Calculate max page based on current items and itemsPerPage
  const maxPage = Math.max(1, Math.ceil(items.length / itemsPerPage));

  // Reset to page 1 if the data changes significantly or if current page is out of bounds
  useEffect(() => {
    if (currentPage > maxPage) {
      setCurrentPage(1);
    }
  }, [items.length, maxPage, currentPage]);

  // Use useMemo to ensure we don't unnecessarily recalculate the current items
  // This helps ensure that sorting is preserved when paginating
  const currentItems = useMemo(() => {
    // Get the current slice of items based on pagination settings
    return items.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
  }, [items, currentPage, itemsPerPage]);

  const changePage = (newPage: number) => {
    const safePage = Math.max(1, Math.min(newPage, maxPage));
    setCurrentPage(safePage);
  };

  const updateItemsPerPage = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to the first page when changing items per page
  };

  return {
    currentItems,
    changePage,
    currentPage,
    maxPage,
    itemsPerPage,
    setItemsPerPage: updateItemsPerPage
  };
};
export default usePagination;