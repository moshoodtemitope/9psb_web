import * as React from 'react';
import { Link} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";
import "./onboarding-header.scss"; 
import Logo from '../../../assets/images/logo.png';
// import Logo from '../../../assets/images/logo.svg';
import AppStore from '../../../assets/images/appstore.svg';
import PlayStore from '../../../assets/images/playstore.svg';
class OnboardingHeader extends React.Component{
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



    renderHeadingWrap(){
        // let adminGetCustomerTypesRequest = this.props.adminGetCustomerTypes;
        const {user} = this.state;
        return(
            <div className="mainheader-wrap">
                heading
            </div>
        )
    }

  
    


    render() {
        const{screenWidthSize} = this.state
        
        return (
            <Fragment>
                
                <div className="headingwrap">
                    <div className="container">
                        <div className="logo-wrap">
                            <Link  to='/'>
                                <img src={Logo} alt="" />
                            </Link>
                        </div>
                        <div className="header-items">
                            {(screenWidthSize>=1024) && <Link  to='/'>Back to homepage</Link>}
                            <Link  to='/app/signup'>Open an Account</Link>
                            {(screenWidthSize>=1024) && 
                                <div className="download-app">
                                    <span>Download app</span>
                                    <div className="download-links">
                                        <a href="#">
                                            <img src={AppStore} alt=""/>
                                        </a>
                                        <a href="#">
                                            <img src={PlayStore} alt=""/>
                                        </a>
                                    </div>
                                </div>
                            }
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

export default connect(mapStateToProps)(OnboardingHeader);