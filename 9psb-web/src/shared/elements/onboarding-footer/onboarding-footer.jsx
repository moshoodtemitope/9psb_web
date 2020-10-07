import * as React from 'react';
import { Link} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";
import "./onboarding-footer.scss"; 
import Logo from '../../../assets/images/logo.svg';
import AppStore from '../../../assets/images/appstore.svg';
import PlayStore from '../../../assets/images/playstore.svg';
class OnboardingFooter extends React.Component{
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




    render() {
        const{screenWidthSize} = this.state
        
        return (
            <Fragment>
                 {(screenWidthSize < 1024) && 
                    <div className="bottomwrap">
                        <div className="container">
                            
                            <div className="footer-items">
                                
                            
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
                                
                            </div>
                        </div>
                    </div>
                }
            </Fragment>
        );
    }
}


function mapStateToProps(state) {
    return {
        
    };
}

export default connect(mapStateToProps)(OnboardingFooter);