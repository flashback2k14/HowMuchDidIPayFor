export const ActionType = {
  CLEAR_STATE: "clearState",
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
  SET_CURRENT_SELECTED_BILLING: "setCurrentSelectedBilling",
  SET_CURRENT_BILLING_ENTRIES: "setCurrentBillingEntries",
  SET_USER_PROFILE: "setUserProfile",
  SET_USER_SETTINGS: "setUserSettings",
  SET_USER_BILLINGS: "setUserBillings"
};

export const StateProperty = {
  CURRENT_USER: "currentUser",
  CURRENT_SETTING: "currentSetting",
  CURRENT_BILLINGS: "currentBillings",
  CURRENT_SELECTED_BILLING: "currentSelectedBilling",
  CURRENT_BILLING_ENTRIES: "currentBillingEntries",
  USER_PROFILE: "userProfile",
  USER_SETTINGS: "userSettings",
  USER_BILLINGS: "userBillings"
};

export const extendDocuments = docs => {
  return docs.map((item, index) => {
    let doc = item.data();
    doc.id = item.id;
    doc.pos = ++index;
    return doc;
  });
};
