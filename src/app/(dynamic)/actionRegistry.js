// This is where you define what your app can DO.
// These functions can dispatch state updates, make API calls, etc.
let appSetters = {};

export const initActions = (setters) => {
  appSetters = setters;
};
const handleSortData = (e, payload) => {
  console.log("ACTION: Sorting data by:", payload.sortBy);
  // In a real app, you would dispatch a state update here:
  // e.g., dispatch({ type: 'SORT', payload: payload.sortBy });
};
const handleSelectItem = (e, payload) => {
  console.log("ACTION: Selecting item:", payload);
  // Call the state setter from your App component
  if (appSetters.setItemInFocus) {
    appSetters.setItemInFocus(payload);
  }
};

const handleShowAlert = (e, payload) => {
  console.log("ACTION: Sorting data by:", payload.sortBy);

  alert(`MESSAGE: ${payload.message}`);
};
const handleToggleExpand = (e, payload) => {
  e.stopPropagation();

  const { id } = payload;
  if (appSetters.setExpandedItems) {
    // Update the state by toggling the boolean value for the given id
    appSetters.setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }
};

const handleToggleMenu = (e, payload) => {
  e.stopPropagation();
  console.log("clicked");
  if (appSetters.setMenuAnchor) {
    // If an anchor is already set, close the menu.
    // Otherwise, open it by setting the anchor to the button that was clicked.
    appSetters.setMenuAnchor((prev) => (prev ? null : e.currentTarget));
  }
};
const handleEditItem = (e, payload) => {
  e.stopPropagation();
  console.log("clicked handleEditItem");
};
const handleDeleteItem = (e, payload) => {
  e.stopPropagation();
  console.log("clicked handleDeleteItem");
};

export const actionRegistry = {
  SORT_DATA: handleSortData,
  SELECT_ITEM: handleSelectItem,
  SHOW_ALERT: handleShowAlert,
  TOGGLE_EXPAND: handleToggleExpand,
  TOGGLE_MENU: handleToggleMenu,
  // EDIT_ITEM: handleEditItem,
  // DELETE_ITEM: handleDeleteItem,

  // Add more client-side actions here as your app grows
};
