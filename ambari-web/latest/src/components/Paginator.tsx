import { Dropdown, DropdownButton, Pagination } from "react-bootstrap";

type PaginatorProps = {
  currentPage: number;
  maxPage: number;
  changePage: (pageNumber: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (recordsCount: number) => void;
  totalItems: number;
};

const Paginator = ({
  currentPage,
  maxPage,
  changePage,
  itemsPerPage,
  setItemsPerPage,
  totalItems,
}: PaginatorProps) => {
  const items = [];
  const perPageOptions = [10, 25, 50, 100];
  for (let number = 1; number <= maxPage; number++) {
    if (
      number === currentPage - 1 ||
      number === currentPage ||
      number === currentPage + 1 ||
      number === 1 ||
      number === maxPage
    ) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => changePage(number)}
          className="pagination-btn"
        >
          {number}
        </Pagination.Item>
      );
    } else if (number === currentPage - 2 || number === currentPage + 2) {
      items.push(<Pagination.Ellipsis key={`ellipsis-${number}`}/>);
    }
  }
  const firstItemIndex = (currentPage - 1) * itemsPerPage + 1;
  const lastItemIndex = Math.min(currentPage * itemsPerPage, totalItems);
  return (
      <div className="mt-4 p-3 py-0" data-testid="pagination">
          <div className="d-flex justify-content-between align-items-center py-0">
            <div>
              Showing {firstItemIndex}-{lastItemIndex} of {totalItems} items
            </div>
            <div className="mt-3 d-flex">
              <DropdownButton title={itemsPerPage} size="sm" variant="light">
                {perPageOptions.map((perPageOption) => {
                  return (
                    <Dropdown.Item
                      key={perPageOption}
                      onClick={() => {
                        setItemsPerPage(perPageOption);
                      }}
                    >
                      {perPageOption}
                    </Dropdown.Item>
                  );
                })}
              </DropdownButton>
              <Pagination>
                <Pagination.Prev
                  title="Previous"
                  className="ms-1"
                  onClick={() => changePage(currentPage - 1)}
                />
                {items}
                <Pagination.Next
                  className="ms-1"
                  onClick={() => changePage(currentPage + 1)}
                />
              </Pagination>
            </div>
          </div>
        </div>
  );
};

export default Paginator;
