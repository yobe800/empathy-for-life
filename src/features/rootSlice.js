import logWarnOrErrInDevelopment from "../utils/logWarnOrErrInDevelopment";

const initiateState = {
  user: {
    id: null,
    userName: null,
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

const adminAuthPassed = () => {
  return { type: "adminAuthPassed" };
};
const userAdded = (user) => {
  return { type: "userAdded", payload: user };
};

const getUserId = (state) => {
  return state.user.id;
};
const getIsPassedAdminAuth = (state) => {
  return state.isPassedAdminAuth;
};

export {
  reducer,
  initiateState,
  adminAuthPassed,
  userAdded,
  getUserId,
  getIsPassedAdminAuth,
};
