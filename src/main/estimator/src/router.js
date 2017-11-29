import React from "react"
import { Router, Route, IndexRoute } from "react-router"
import { history } from "./store.js"
import App from "./components/App"
import Home from "./components/Home"
import PartEdit from "./components/part/PartEdit"
import PartNavigator from "./components/part/PartNavigator"
import NotFound from "./components/NotFound"

const router = (
  <Router onUpdate={() => window.scrollTo(0, 0)} history={history}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
        <Route path="parts" component={PartNavigator}/>
        <Route path="part/:partId" component={PartEdit}/>
      <Route path="*" component={NotFound}/>
    </Route>
  </Router>
);

export { router };
