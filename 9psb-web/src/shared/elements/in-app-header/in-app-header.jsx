import * as React from 'react';
import { Link, NavLink} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";
import "./in-app-header.scss"; 

import Logo from '../../../assets/images/logo.png';
// import Logo from '../../../assets/images/logo.svg';
import Logout from '../../../assets/images/logout.svg';
import AppStore from '../../../assets/images/appstore.svg';
import PlayStore from '../../../assets/images/playstore.svg';

import {onboardingActions} from '../../../redux/actions/onboarding/onboarding';
class InAppHeader extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            user:"",
            screenWidthSize: window.innerWidth
        }
   
        window.addEventListener("resize", ()=>this.setState({screenWidthSize: window.innerWidth}));
    }

    componentDidMount(){
       
    }


    logoutCustomer = ()=>{
        const {dispatch} = this.props;
        // if(this.props.CreateAccountStep1Reducer.request_status === onboardingConstants.CREATE_USER_ACCOUNT_FAILURE){
        //     dispatch(onboardingActions.CreateAccountStep1("CLEAR"));
        // }
        dispatch(onboardingActions.Logout());
    }
   
  
    


    render() {
        const{screenWidthSize} = this.state
        
        return (
            <Fragment>
                
                <div className="headingwrap">
                    <div className="container">
                        <div className="logo-wrap">
                            <Link  to='/app/dashboard'>
                                <img src={Logo} alt="" />
                            </Link>
                        </div>
                        <div className="header-items">
                            <div className="heading-cta"
                                onClick={this.logoutCustomer}>
                                <img src={Logout} alt=""/>
                                Log Out
                            </div>

                            {/* <Link className="logoutlink" to='/app/login'>
                                
                            </Link> */}
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}


function mapStateToProps(state) {
    return {
        
    };
}

export default connect(mapStateToProps)(InAppHeader);