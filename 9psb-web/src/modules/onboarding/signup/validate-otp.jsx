import * as React from 'react';
import { Link} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";
import equal from 'fast-deep-equal'

import { Formik } from 'formik';
import * as Yup from 'yup';
import { Helmet } from 'react-helmet';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button'
import {history} from '../../../_helpers/history'
import  OnboardingContainer from '../../../shared/templates/onboarding-container'
import SignupImg from '../../../assets/images/signup2.svg';
import Select from 'react-select';
import {onboardingActions} from '../../../redux/actions/onboarding/onboarding';
import {onboardingConstants} from '../../../redux/actiontypes/onboarding/onboarding.constants';
import { allowNumbersOnly} from '../../../shared/utils';
import "./signup.scss"; 
class ValidateSignUpOtp extends React.Component{
    constructor(props) {
        super(props);
        let getExistingInfo = this.props.CreateAccountStep1Reducer;
        
        this.state={
            user:"",
            deactivateResend: true,
            activateResendSecs: 50,
            existingCustomerInfo: (Object.keys(getExistingInfo).length>=1 
                                        && getExistingInfo.request_status === onboardingConstants.CREATE_USER_ACCOUNT_SUCCESS)
                                    ? getExistingInfo.request_data.response.mobileNumber: '' ,
            requestTrackingId: (Object.keys(getExistingInfo).length>=1 
                && getExistingInfo.request_status === onboardingConstants.CREATE_USER_ACCOUNT_SUCCESS)
            ? getExistingInfo.request_data.response.requestTrackingId: '' 
        }
   
    
    }

    componentDidMount(){
        this.clearRecords();
        this.bounceBackToStep();

        this.myInterval = setInterval(
            () => {
            const { activateResendSecs, minutes } = this.state
    
            if (activateResendSecs > -1) {
                this.setState(({ activateResendSecs }) => ({
                    deactivateResend:true,
                    activateResendSecs: activateResendSecs - 1
                }))
            }
            if (activateResendSecs === 0) {
                clearInterval(this.myInterval)
                this.setState({
                    deactivateResend:false,
                    activateResendSecs :0
                })

                
            } 
        }, 1000)
    }

     

    componentWillUnmount() {
        clearInterval(this.myInterval)
    }

    clearRecords = ()=>{
        const {dispatch} = this.props;
        dispatch(onboardingActions.ValidateRegOtp("CLEAR"));
        dispatch(onboardingActions.ResendRegOtp("CLEAR"));
    }


    // componentDidUpdate(prevProps) {
    //     if(!equal(this.props.CreateAccountStep1Reducer, prevProps.CreateAccountStep1Reducer)) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
    //     {
    //       this.bounceBackToStep();
    //     }
    // } 

    bounceBackToStep = ()=>{
        let getExistingInfo = this.props.CreateAccountStep1Reducer;

        
        if((Object.keys(getExistingInfo).length>=1 && (getExistingInfo.request_status !== onboardingConstants.CREATE_USER_ACCOUNT_SUCCESS)) ||
            (Object.keys(getExistingInfo).length<1)){
                history.push("/app/signup")
        }
    }

    

    validateOtp = async(payload) =>{
        const {dispatch} = this.props;

        await dispatch(onboardingActions.ValidateRegOtp(payload, "newreg"));
    }

    resendRegOtp = () =>{
        const {dispatch} = this.props;
        let payload= {
            requestTrackingId : this.state.requestTrackingId
        }
         dispatch(onboardingActions.ResendRegOtp(payload));
    }


    renderValidateOtp= ()=>{
        let ValidateRegOtpRequest = this.props.ValidateRegOtpReducer,
            ResendRegOtpReducer = this.props.ResendRegOtpReducer;
        
        const {existingCustomerInfo,
                requestTrackingId,
                deactivateResend,
                activateResendSecs} = this.state;
        let otpValidationSchema = Yup.object().shape({
                otpCode: Yup.string()
                    .max(6, 'Max of 6 characters')
                    .required('Required'),
            });

        // this.activateResendOtp();

        
          
        return(
            <div className="onboardingcontent-wrap">
                <div className="eachsection imgsection">
                    <img src={SignupImg} alt=""/>
                </div>
                <div className="eachsection ">
                    <div className="onboarding-info">
                        <div className="cardpanel">
                            <div className="indicator two-of-3"></div>
                            <div className="indicator-text">
                                <div className="back-nav">
                                    <Link to="/app/signup/provide-details"> &lt; Go Back</Link>
                                </div>
                                <div className="current-stage">
                                    2 of 3
                                </div>
                            </div>
                            <div className="card-heading mb-10">We sent you a code</div>
                            <div className="card-text">
                                Just to be sure it is you, a code has been sent to <span>{existingCustomerInfo.indexOf('+')==-1?'+':''}{existingCustomerInfo}</span>. Please enter the code below
                            </div>
                            <Formik
                                initialValues={{
                                    otpCode: '',
                                }}

                                validationSchema={otpValidationSchema}
                                onSubmit={(values, { resetForm }) => {

                                    let payload = {
                                        otp: values.otpCode,
                                        requestTrackingId
                                    }
                                    this.validateOtp(payload);
                                    
                                    // history.push("/store/dashboard")
                                }}
                            >
                                {({ handleSubmit,
                                    handleChange,
                                    handleBlur,
                                    resetForm,
                                    setFieldValue,
                                    setFieldTouched,
                                    values,
                                    touched,
                                    isValid,
                                    errors, }) => (
                                        <Form
                                            noValidate
                                            onSubmit={handleSubmit}
                                            className="form-content mt-0">



                                            <Form.Group className="onboardinginput">

                                                <Form.Label className="block-level">Enter Code</Form.Label>
                                                <Form.Control type="password"
                                                    name="otpCode"
                                                    onChange={handleChange}
                                                    maxLength="6"
                                                    value={allowNumbersOnly(values.otpCode,6)}
                                                    className={errors.otpCode && touched.otpCode ? "is-invalid" : null}
                                                    required />
                                                {errors.otpCode && touched.otpCode ? (
                                                    <span className="invalid-feedback">{errors.otpCode}</span>
                                                ) : null}

                                            </Form.Group>

                                            
                                            {ValidateRegOtpRequest.request_status === onboardingConstants.VALIDATE_OTP_FAILURE &&
                                                <Alert variant="danger mt-20">
                                                   
                                                    {ValidateRegOtpRequest.request_data.error !== undefined ? ValidateRegOtpRequest.request_data.error : "An error occured please try again"}

                                                </Alert>
                                            }

                                            {ResendRegOtpReducer.request_status === onboardingConstants.RESEND_REG_OTP_FAILURE &&
                                                <Alert variant="danger mt-20">
                                                  
                                                    {ResendRegOtpReducer.request_data.error !== undefined ? ResendRegOtpReducer.request_data.error : "An error occured please try again"}

                                                </Alert>
                                            }

                                            <div className="footer-with-cta centered blocked-style mt-60">
                                                {((ValidateRegOtpRequest.is_request_processing === false || ValidateRegOtpRequest.is_request_processing === undefined)
                                                    && ResendRegOtpReducer.request_status !==onboardingConstants.RESEND_REG_OTP_SUCCESS) &&
                                                    <Button variant="secondary"
                                                        type="button"
                                                        disabled={deactivateResend}
                                                        className="ml-0 lightbtn smalltext"
                                                        onClick={this.resendRegOtp}
                                                    >{activateResendSecs===0
                                                                ?`${ResendRegOtpReducer.is_request_processing!==true? 'Resend Otp': 'Resending OTP...'}`
                                                                :`Didn’t get the code? resend in ${activateResendSecs}secs`} 
                                                    </Button>
                                                }
                                                <Button variant="secondary"
                                                    type="submit"
                                                    disabled={ValidateRegOtpRequest.is_request_processing}
                                                    className="ml-0 onboarding-btn"
                                                >  {ValidateRegOtpRequest.is_request_processing? 'Validating Code...':'Continue'}
                                                </Button>

                                            </div>

                                            

                                        </Form>
                                    )}
                            </Formik>
                        </div>
                        <div className="signup-info">
                           Already have an account? <Link to='/'>Sign In</Link> 
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
                    <title>9PSB - Create account | OTP</title>
                </Helmet>
                <OnboardingContainer>
                <div className="onboarding-page">
                   {this.renderValidateOtp()}
                </div>
                </OnboardingContainer>
            </Fragment>
        );
    }
}


function mapStateToProps(state) {
    return {
        CreateAccountStep1Reducer : state.onboardingReducers.CreateAccountStep1Reducer,
        ValidateRegOtpReducer : state.onboardingReducers.ValidateRegOtpReducer,
        ResendRegOtpReducer : state.onboardingReducers.ResendRegOtpReducer
    };
}

export default connect(mapStateToProps)(ValidateSignUpOtp);