import * as React from 'react';
import { Link} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";


import { Helmet } from 'react-helmet';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import {history} from '../../../_helpers/history'
import Button from 'react-bootstrap/Button'
import  OnboardingContainer from '../../../shared/templates/onboarding-container'
import SuccessImg from '../../../assets/images/done.svg';
import ForgotPwImg from '../../../assets/images/forgot1.svg';
import Select from 'react-select';
import {onboardingActions} from '../../../redux/actions/onboarding/onboarding';
import {onboardingConstants} from '../../../redux/actiontypes/onboarding/onboarding.constants';
import "./signup.scss"; 
class SuccessNewPw extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            user:"",
            
        }
   
    
    }

    componentDidMount(){
       this.bounceBackToStep();
    }

    bounceBackToStep = ()=>{
        let getExistingInfo = this.props.CompletePasswordResetReducer;
        this.props.dispatch(onboardingActions.InititatePasswordReset("CLEAR"));
        this.props.dispatch(onboardingActions.ValidateRegOtp("CLEAR"));
        
        if((Object.keys(getExistingInfo).length>=1 
            && (getExistingInfo.request_status !== onboardingConstants.COMPLETE_PASSWORD_RESET_SUCCESS))){
                history.push("/")
        }
    }


    renderSuccessPasswordReset=()=>{
        // let adminGetCustomerTypesRequest = this.props.adminGetCustomerTypes;
        const {user} = this.state;
        

        

        
          
        return(
            <div className="onboardingcontent-wrap">
                <div className="eachsection imgsection">
                    <img src={ForgotPwImg} alt=""/>
                </div>
                <div className="eachsection ">
                    <div className="onboarding-info">
                        <div className="cardpanel">
                            <div className="success-icon">
                                <img src={SuccessImg} alt=""/>
                            </div>
                            <div className="card-heading  text-center">Password Reset successful</div>
                            <div className="card-text success-txt">
                                Login to your account with your phone number and new password.
                            </div>
                            <div className="footer-with-cta centered blocked-style mt-60">
                                                
                                <Button variant="secondary"
                                    type="submit"
                                    // disabled={loginRequest.is_request_processing}
                                    className="ml-0 onboarding-btn"
                                    onClick={()=>{
                                        this.props.dispatch(onboardingActions.InititatePasswordReset("CLEAR"));
                                        this.props.dispatch(onboardingActions.ValidateRegOtp("CLEAR"));
                                        this.props.dispatch(onboardingActions.CompletePasswordReset("CLEAR"));
                                        history.push("/");
                                    }}
                                > Login
                                </Button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

  
    


    render() {
        
        
        return (
            <Fragment>
                <Helmet>
                    <title>9PSB - Reset password success</title>
                </Helmet>
                <OnboardingContainer>
                <div className="onboarding-page">
                   {this.renderSuccessPasswordReset()}
                </div>
                </OnboardingContainer>
            </Fragment>
        );
    }
}


function mapStateToProps(state) {
    return {
        CompletePasswordResetReducer : state.onboardingReducers.CompletePasswordResetReducer,
    };
}

export default connect(mapStateToProps)(SuccessNewPw);