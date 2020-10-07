import React, { Fragment} from "react";
// import { Redirect, Route, Router, Switch } from "react-router-dom";
// import OnboardingRoute from "./onboarding/onboarding.routes";
import AuthenticatedRoutes from "./authenticated-routes";
// import DeviceRestriction from "../shared/templates/device-restriction";
class IndexRoute extends React.Component{
    constructor(props) {
        super(props);
        this.state={
        }

    }
    

    render(){
        
        let routerLayers
       
            routerLayers = (
                <Fragment>
                   
                    {/* <AuthenticatedRoutes  user={user}/> */}
                    <AuthenticatedRoutes  />
                </Fragment>
            )
        

        return routerLayers;
    }
}

export default IndexRoute;