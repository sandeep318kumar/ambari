import { Dropdown } from "react-bootstrap";
import React, { memo, ReactNode } from "react";
import { get } from "lodash";
import { getIcon } from "./icon";

type DropDirections = "up" | "down" | "start" | "end";

type Menu = {
  label: ReactNode;
  submenu?: Menu[];
  [key: string]: any;
};

type NestedDropdownProps = {
  menu: Menu;
  dropDirection?: DropDirections;
};

type SubmenuProps = {
  items?: Menu[];
  dropDirection?: DropDirections;
};

const Submenu = memo(({ items, dropDirection }: SubmenuProps) => {
  return (
    <Dropdown.Menu>
      {items &&
        items.map((item: any, index: number) => {
          return (
            <React.Fragment key={`menu-item-${item.label?.toString() || index}`}>
              {item.submenu && item.submenu.length && !get(item, "isDisabled", false) ? (
                <Dropdown drop={dropDirection}>
                  <Dropdown.Toggle className="custom-text-toggle">
                    {get(item, "icon", false)
                      ? getIcon(item.icon, get(item, "iconClass", ""))
                      : null}
                    <span>{item.label}</span>
                  </Dropdown.Toggle>
                  <Submenu items={item.submenu} dropDirection={dropDirection} />
                </Dropdown>
              ) : (
                get(item, "isVisible", true) && (
                  <Dropdown.Item
                    className={
                      get(item, "isDisabled", false) ? "disabled-btn" : ""
                    }
                    onClick={() => {
                      if (!get(item, "isDisabled", false)) {
                        item.onClick();
                      }
                    }}
                  >
                    {get(item, "icon", false)
                      ? getIcon(item.icon, get(item, "iconClass", ""))
                      : null}
                    {item.label}
                  </Dropdown.Item>
                )
              )}
            </React.Fragment>
          );
        })}
    </Dropdown.Menu>
  );
});

function NestedDropdown({ menu, dropDirection }: NestedDropdownProps) {
  dropDirection = dropDirection || "down";

  return (
    <Dropdown drop="down">
      <Dropdown.Toggle
        variant="primary"
        className="custom-btn text-white ps-3 pe-3"
      >
        <span className="me-2">{menu.label}</span>
      </Dropdown.Toggle>
      <Submenu items={menu.submenu} dropDirection={dropDirection} />
    </Dropdown>
  );
}

export default memo(NestedDropdown);
