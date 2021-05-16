import React, { useState, useEffect, useReducer } from "react";
import {
  Switch,
  Route,
  Redirect,
  useLocation,
} from "react-router-dom";

import "./styles/reset.css";
import "./styles/font.css";

import logWarnOrErrInDevelopment from "../utils/logWarnOrErrInDevelopment";

import {
  reducer,
  initiateState,
  actionCreators,
  selectors,
} from "../features/rootSlice";

import UserSignIn from "./UserSignIn";
import AdminAuth from "./AdminAuth";
import AdminSignIn from "./AdminSignIn";
import AdminSignUp from "./AdminSignUp";
import Main from "./Main";
import Modal from "./Modal";
import DogProfile from "./DogProfile";
import Posts from "./Posts";
import DogsInformation from "./DogsInformation";
import DogForm from "./DogForm";
import PostForm from "./PostForm";

const App = () => {
  const location = useLocation();
  const modal = location.state?.modal;
  const [state, dispatch] = useReducer(reducer, initiateState);
  const [isLoading, setIsLoading] = useState(true);

  const userName = selectors.getUserName(state);
  const hasUserSignedIn = !!selectors.getUserId(state);
  const isPassedAdminAuth = (
    selectors.getIsPassedAdminAuth(state)
  );
  const isAdministrator = (
    selectors.getIsAdministrator(state)
  );

  useEffect(() => {
    if (hasUserSignedIn || !isLoading) {
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    const fetchUser = async () => {

      try {
        const serverUrl = process.env.REACT_APP_SERVER_URL;
        const response = await fetch(
          `${serverUrl}/user`,
          { credentials: "include" },
          signal,
        );
        const { message, result } = await response.json();

        if (message === "ok") {
          const userSession = {
            id: result._id,
            name: result.user_name,
            isAdministrator: result.is_administrator,
            character: result.character,
            accessTime: result.access_time,
          };

          if (userSession.isAdministrator) {
            dispatch(
              actionCreators.adminAuthPassed(),
            );
          }

          dispatch(
            actionCreators.userAdded(userSession),
          );
        }
      } catch (error) {
        logWarnOrErrInDevelopment(error);
      } finally {
        setIsLoading(false);
      }

    };

    fetchUser();

    return () => controller.abort();
  }, [hasUserSignedIn, isLoading, dispatch]);

  if (isLoading) {
    return <h1>로딩 중</h1>;
  }

  return (
    <>
      <Switch location={modal || location}>
        <Route exact path="/admin">
          {isPassedAdminAuth
            ? <Redirect to="/" />
            : <AdminAuth dispatch={dispatch} />
          }
        </Route>
        <Route exact path="/admin/sign-in">
          {isPassedAdminAuth
            ? <AdminSignIn
                dispatch={dispatch}
                isAdministrator={isAdministrator}
              />
            : <Redirect to="/admin" />
          }
        </Route>
        <Route exact path="/admin/sign-up">
          {isPassedAdminAuth
            ? <AdminSignUp
                dispatch={dispatch}
                isAdministrator={isAdministrator}
              />
            : <Redirect to="/admin" />
          }
        </Route>
        <Route path="/sign-in">
          {hasUserSignedIn
            ? <Redirect to="/" />
            : <UserSignIn dispatch={dispatch} />
          }
        </Route>
        <Route exact path="/">
          {hasUserSignedIn
            ? <Main userName={userName} />
            : <Redirect to="/sign-in" />
          }
        </Route>
        <Redirect to="/" />
      </Switch>
      {modal
        ? <Modal>
            <Switch>
              <Route exact path="/posts">
                <Posts />
              </Route>
              <Route path="/posts/new">
                <PostForm />
              </Route>
              <Route exact path="/dogs">
                <DogsInformation />
              </Route>
              <Route path="/dogs/new">
                <DogForm />
              </Route>
              <Route path="/dogs/edit/:id">
                <DogForm />
              </Route>
              <Route path="/dogs/:id">
                <DogProfile />
              </Route>
            </Switch>
          </Modal>
        : null
      }
    </>
  );
}

export default App;
