import { CLIENT_MENU_ITEMS, EMPL_MENU_ITEMS, ADMIN_MENU_ITEMS } from '@/common/menu-items';

const getMenuItems = (userRole) => {
  // NOTE - You can fetch from server and return here as well
  switch (userRole) {
    case 'ADMIN':
      return ADMIN_MENU_ITEMS;
    case 'EMPL':
      return EMPL_MENU_ITEMS;
    case 'CLIENT':
      return CLIENT_MENU_ITEMS;
    default:
      return CLIENT_MENU_ITEMS;
  }
};

// const getHorizontalMenuItems = () => {
//   // NOTE - You can fetch from server and return here as well
//   return HORIZONTAL_MENU_ITEMS;
// };

const findAllParent = (menuItems, menuItem) => {
  let parents = [];
  const parent = findMenuItem(menuItems, menuItem['parentKey']);

  if (parent) {
    parents.push(parent['key']);
    if (parent['parentKey']) parents = [...parents, ...findAllParent(menuItems, parent)];
  }
  return parents;
};

const findMenuItem = (
  menuItems,
  menuItemKey
) => {
  if (menuItems && menuItemKey) {
    for (let i = 0; i < menuItems.length; i++) {
      if (menuItems[i].key === menuItemKey) {
        return menuItems[i];
      }
      const found = findMenuItem(menuItems[i].children, menuItemKey);
      if (found) return found;
    }
  }
  return null;
};

export { getMenuItems, findAllParent, findMenuItem };
