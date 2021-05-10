import React, { useReducer } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import "./styles/reset.css";
import "./styles/font.css";

import {
  reducer,
  initiateState,
  getUserId,
  getIsPassedAdminAuth,
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

const App = () => {
  const [state, dispatch] = useReducer(reducer, initiateState);
  const hasUserSignedIn = !!getUserId(state);
  const isPassedAdminAuth = getIsPassedAdminAuth(state);

  return (
    <Router>
      <Switch>
        <Route exact path="/admin">
          <AdminAuth dispatch={dispatch} />
        </Route>
        <Route exact path="/admin/sign-in">
          {isPassedAdminAuth
            ? <AdminSignIn dispatch={dispatch} />
            : <Redirect to="/admin" />
          }
        </Route>
        <Route exact path="/admin/sign-up">
          {isPassedAdminAuth
            ? <AdminSignUp dispatch={dispatch} />
            : <Redirect to="/admin" />
          }
        </Route>
        <Route path="/sign-in">
          <UserSignIn dispatch={dispatch} />
        </Route>
        <Route path="/" render={() => (
          hasUserSignedIn
            ? <Main />
            : <Redirect to="/sign-in" />
        )} />
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}

export default App;
