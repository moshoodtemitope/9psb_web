import * as React from 'react';
import { Link} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";
import { Helmet } from 'react-helmet';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import {history} from '../../../_helpers/history'
import  OnboardingContainer from '../../../shared/templates/onboarding-container'
import PinImg from '../../../assets/images/lock.svg';
import Select from 'react-select';
import SuccessImg from '../../../assets/images/done.svg';
import {onboardingActions} from '../../../redux/actions/onboarding/onboarding';
import {onboardingConstants} from '../../../redux/actiontypes/onboarding/onboarding.constants';
import "./signup.scss"; 
class SignUpCreatePinSuccess extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            psbuser:JSON.parse(localStorage.getItem('psb-auth')),
        }
   
    
    }

    componentDidMount(){
        this.bounceBackToStep();
    }

    bounceBackToStep = ()=>{
        let getExistingInfo = this.props.CreateTransactionPinReducer;

        
        
        if( (getExistingInfo===undefined || getExistingInfo.request_status !== onboardingConstants.CREATE_PIN_SUCCESS)){
                history.push("/")
        }
    }



    renderCreatePinSuccess = ()=>{
        // let adminGetCustomerTypesRequest = this.props.adminGetCustomerTypes;
        const {psbuser} = this.state;
        let loginValidationSchema = Yup.object().shape({
            phoneNumber: Yup.string()
                .required('Required'),
                password:  Yup.string()
                .required('Required'),
          });

       

        
          
        return(
            <div className="onboardingcontent-wrap">
                <div className="eachsection imgsection">
                    <img src={PinImg} alt=""/>
                </div>
                <div className="eachsection ">
                    <div className="onboarding-info">
                    <div className="cardpanel">
                            <div className="card-heading mb-10 text-center">PIN Created Succesfully</div>
                            <div className="success-icon">
                                <img src={SuccessImg} alt=""/>
                            </div>
                            <div className="card-text success-txt">
                                And that’s all. Enjoy unparalleled banking services.
                            </div>
                            <div className="card-text success-txt">
                                Head over to your dashboard.
                            </div>
                            <div className="footer-with-cta centered blocked-style mt-60">
                                                
                                <Button variant="secondary"
                                    type="submit"
                                    // disabled={loginRequest.is_request_processing}
                                    className="ml-0 onboarding-btn"
                                    onClick={()=>history.push("/app/dashboard")}
                                > Continue
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
                    <title>9PSB - Create account pin | success</title>
                </Helmet>
                <OnboardingContainer>
                <div className="onboarding-page">
                   {this.renderCreatePinSuccess()}
                </div>
                </OnboardingContainer>
            </Fragment>
        );
    }
}


function mapStateToProps(state) {
    return {
        CreateTransactionPinReducer : state.onboardingReducers.CreateTransactionPinReducer
    };
}

export default connect(mapStateToProps)(SignUpCreatePinSuccess);