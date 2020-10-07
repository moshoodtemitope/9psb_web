import React from 'react';
import IndexRoute from "./modules/routes";
import {BrowserRouter as Router, Switch} from "react-router-dom";
import {history} from "./_helpers/history";
import 'bootstrap/dist/css/bootstrap.min.css';


class App extends React.Component {


  render() {

    return (
        <Router history={history}>
        
            <Switch>
                <IndexRoute />
            </Switch>
        </Router>
    );
  }
}

export default App;
