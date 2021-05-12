import logWarnOrErrInDevelopment from "../utils/logWarnOrErrInDevelopment";

const initiateState = {
  user: {
    id: null,
    name: null,
    isAdministrator: false,
    character: null,
    accessTime: null,
  },
  isPassedAdminAuth: false,
};

const reducer = (state, action) => {
  const { payload, type } = action;

  switch (type) {
    case "adminAuthPassed":
      return { ...state, isPassedAdminAuth: true };
    case "userAdded":
      return { ...state, user: { ...state.user, ...payload }};
    default:
      logWarnOrErrInDevelopment(
        new Error("There is no match action type"),
        "warn",
      );
      return state;
  }
};


const actionCreators = {
  adminAuthPassed: () => {
    return { type: "adminAuthPassed" };
  },
  userAdded: (user) => {
    return { type: "userAdded", payload: user };
  },
};

const selectors = {
  getUserId: (state) => {
    return state.user.id;
  },
  getUserName: (state) => {
    return state.user.name;
  },
  getIsAdministrator: (state) => {
    return state.user.isAdministrator;
  },
  getIsPassedAdminAuth: (state) => {
    return state.isPassedAdminAuth;
  },
};

export {
  reducer,
  initiateState,
  actionCreators,
  selectors,
};
