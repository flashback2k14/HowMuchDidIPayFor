export const ActionType = {
  CLEAR_STATE: "clearState",
  CLEAR_ERROR: "clearError",
  FETCH_USER_PROFILE: "fetchUserProfile",
  FETCH_USER_SETTINGS: "fetchUserSettings",
  FETCH_USER_BILLINGS: "fetchUserBillings",
  FETCH_USER_BILLING_ENTRIES_FOR_SELECTION:
    "fetchUserBillingEntriesForSelection"
};

export const MutationType = {
  SET_CURRENT_USER: "setCurrentUser",
  SET_CURRENT_SETTING: "setCurrentSetting",
  SET_CURRENT_BILLINGS: "setCurrentBillings",
  SET_CURRENT_BILLING_INTERVALLS: "setCurrentBillingIntervalls",
  SET_CURRENT_BILLING_COVERED_DAYS: "setCurrentBillingCoveredDays",
  SET_CURRENT_SELECTED_BILLING: "setCurrentSelectedBilling",
  SET_CURRENT_BILLING_ENTRIES: "setCurrentBillingEntries",
  SET_CURRENT_ERROR: "setCurrentError",
  SET_USER_PROFILE: "setUserProfile",
  SET_USER_SETTINGS: "setUserSettings",
  SET_USER_BILLINGS: "setUserBillings"
};

export const StateProperty = {
  CURRENT_USER: "currentUser",
  CURRENT_SETTING: "currentSetting",
  CURRENT_BILLINGS: "currentBillings",
  CURRENT_BILLING_INTERVALS: "currentBillingIntervals",
  CURRENT_BILLING_COVERED_DAYS: "currentBillingCoveredDays",
  CURRENT_SELECTED_BILLING: "currentSelectedBilling",
  CURRENT_BILLING_ENTRIES: "currentBillingEntries",
  CURRENT_ERROR: "currentError",
  USER_PROFILE: "userProfile",
  USER_SETTINGS: "userSettings",
  USER_BILLINGS: "userBillings"
};

export const convertDocument = docs => {
  return docs.map(item => {
    let doc = item.data();
    doc.id = item.id;
    return doc;
  });
};

export const setDocumentPosition = docs => {
  return docs.map((item, index) => {
    item.pos = ++index;
    return item;
  });
};

export const immutableSort = (arr, compareFunction) => {
  return [...arr].sort(compareFunction);
};
