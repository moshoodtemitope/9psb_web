import * as React from 'react';
import { Link} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";

import { Formik } from 'formik';
import * as Yup from 'yup';
import { Helmet } from 'react-helmet';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import {history} from '../../../_helpers/history'
import Alert from 'react-bootstrap/Alert';
import  OnboardingContainer from '../../../shared/templates/onboarding-container'

import ForgotPwImg from '../../../assets/images/forgot1.svg';
import Select from 'react-select';
import {onboardingActions} from '../../../redux/actions/onboarding/onboarding';
import {onboardingConstants} from '../../../redux/actiontypes/onboarding/onboarding.constants';
import { allowNumbersOnly} from '../../../shared/utils';
import "./signup.scss"; 
class ResetPwValidateOtp extends React.Component{
    constructor(props) {
        super(props);
        let getExistingInfo = this.props.InititatePasswordResetReducer;
        this.state={
            user:"",
            deactivateResend: true,
            activateResendSecs: 50,
            requestTrackingId: (Object.keys(getExistingInfo).length>=1 
                && getExistingInfo.request_status === onboardingConstants.INITIATE_PASSWORD_RESET_SUCCESS)
            ? getExistingInfo.request_data.response.requestTrackingId: '' 
        }
   
    
    }

    componentDidMount(){
        this.clearRecords();
        this.bounceBackToStep();
        this.myInterval = setInterval(
            () => {
            const { activateResendSecs } = this.state
    
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

    bounceBackToStep = ()=>{
        let getExistingInfo = this.props.InititatePasswordResetReducer;

        
        if((Object.keys(getExistingInfo).length>=1 && (getExistingInfo.request_status !== onboardingConstants.INITIATE_PASSWORD_RESET_SUCCESS)) ||
            (Object.keys(getExistingInfo).length<1)){
                history.push("/")
        }
    }

    validateOtp = async(payload) =>{
        const {dispatch} = this.props;

        await dispatch(onboardingActions.ValidateRegOtp(payload, "isPasswordReset"));
    }

    resendRegOtp = () =>{
        const {dispatch} = this.props;
        let payload= {
            requestTrackingId : this.state.requestTrackingId
        }
         dispatch(onboardingActions.ResendRegOtp(payload));
    }



    renderValidateOtp=()=>{
        let ValidateRegOtpRequest = this.props.ValidateRegOtpReducer,
            ResendRegOtpReducer = this.props.ResendRegOtpReducer;
            const {
                requestTrackingId,
                deactivateResend,
                activateResendSecs} = this.state;
        let otpValidationSchema = Yup.object().shape({
            otpCode: Yup.string()
                .max(6, 'Max of 6 characters')
                .required('Required'),
          });

        

        
          
        return(
            <div className="onboardingcontent-wrap">
                <div className="eachsection imgsection">
                    <img src={ForgotPwImg} alt=""/>
                </div>
                <div className="eachsection ">
                    <div className="onboarding-info">
                        <div className="cardpanel">
                            <div className="card-heading mb-10">We sent you a code</div>
                            <div className="card-text">
                                Just to be sure it is you. please enter the code below
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

                                           


                                        </Form>
                                    )}
                            </Formik>
                        </div>
                        <div className="signup-info">
                            I remember my password? <Link to='/'>Sign In</Link> 
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
                    <title>9PSB - Reset password | OTP</title>
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
        InititatePasswordResetReducer : state.onboardingReducers.InititatePasswordResetReducer,
        ValidateRegOtpReducer : state.onboardingReducers.ValidateRegOtpReducer,
        ResendRegOtpReducer : state.onboardingReducers.ResendRegOtpReducer
    };
}

export default connect(mapStateToProps)(ResetPwValidateOtp);