// This is where you define what your app can DO.
// These functions can dispatch state updates, make API calls, etc.
let appSetters = {};

export const initActions = (setters) => {
  appSetters = setters;
};
const handleSortData = (payload) => {
  console.log("ACTION: Sorting data by:", payload.sortBy);
  // In a real app, you would dispatch a state update here:
  // e.g., dispatch({ type: 'SORT', payload: payload.sortBy });
};
const handleSelectItem = (payload) => {
  console.log("ACTION: Selecting item:", payload);
  // Call the state setter from your App component
  if (appSetters.setItemInFocus) {
    appSetters.setItemInFocus(payload);
  }
};

const handleShowAlert = (payload) => {
  console.log("ACTION: Sorting data by:", payload.sortBy);

  alert(`MESSAGE: ${payload.message}`);
};

export const actionRegistry = {
  SORT_DATA: handleSortData,
  SELECT_ITEM: handleSelectItem,
  SHOW_ALERT: handleShowAlert,
  // Add more client-side actions here as your app grows
};
