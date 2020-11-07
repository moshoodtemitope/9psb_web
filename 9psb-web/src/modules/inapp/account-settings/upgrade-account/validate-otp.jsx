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
import {history} from '../../../../_helpers/history'
import LeftCaret from '../../../../assets/images/left-caret.svg';
import  InAppContainer from '../../../../shared/templates/inapp-container'
import SignupImg from '../../../../assets/images/signup2.svg';
import Select from 'react-select';
import {onboardingActions} from '../../../../redux/actions/onboarding/onboarding';
import {onboardingConstants} from '../../../../redux/actiontypes/onboarding/onboarding.constants';
import { allowNumbersOnly} from '../../../../shared/utils';
import  DownloadApp from '../../../../shared/elements/downloadapp-box'
import  ErrorMessage from '../../../../shared/elements/errormessage'
import "../styles.scss"; 
class ValidateAccountUpgradeOtp extends React.Component{
    constructor(props) {
        super(props);
        let getExistingInfo = this.props.UpgradeFetchDetailsReducer,
            getExistingInfo2 = this.props.UpgradeSendDetailsReducer;
        
        this.state = {
            user: "",
            deactivateResend: true,
            activateResendSecs: 50,
            existingCustomerInfo: (Object.keys(getExistingInfo).length >= 1
                && getExistingInfo.request_status === onboardingConstants.UPGRADE_FETCH_DETAILS_SUCCESS)
                ? getExistingInfo.request_data.response.mobileNumber : '',
            existingCustomerInfo2: (Object.keys(getExistingInfo2).length >= 1
                && getExistingInfo2.request_status === onboardingConstants.UPGRADE_SEND_DETAILS_SUCCESS)
                ? getExistingInfo2.request_data.response.mobileNumber : '',
            requestTrackingId: (Object.keys(getExistingInfo).length >= 1
                && getExistingInfo.request_status === onboardingConstants.UPGRADE_FETCH_DETAILS_SUCCESS)
                ? getExistingInfo.request_data.response.requestTrackingId : '',
            requestTrackingId2: (Object.keys(getExistingInfo2).length >= 1
                && getExistingInfo2.request_status === onboardingConstants.UPGRADE_SEND_DETAILS_SUCCESS)
                ? getExistingInfo2.request_data.response.requestTrackingId : ''

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
        dispatch(onboardingActions.UpgradeValidateOtp("CLEAR"));
        dispatch(onboardingActions.ResendRegOtp("CLEAR"));
    }


    // componentDidUpdate(prevProps) {
    //     if(!equal(this.props.CreateAccountStep1Reducer, prevProps.CreateAccountStep1Reducer)) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
    //     {
    //       this.bounceBackToStep();
    //     }
    // } 

    bounceBackToStep = ()=>{
        let getExistingInfo = this.props.UpgradeFetchDetailsReducer,
            getExistingInfo2 = this.props.UpgradeSendDetailsReducer;

        
        if(
            (Object.keys(getExistingInfo).length>=1 && (getExistingInfo.request_status !== onboardingConstants.UPGRADE_FETCH_DETAILS_SUCCESS)
             && Object.keys(getExistingInfo2).length>=1 && (getExistingInfo2.request_status !== onboardingConstants.UPGRADE_SEND_DETAILS_SUCCESS)) ||
            (Object.keys(getExistingInfo).length<1 && Object.keys(getExistingInfo2).length<1)){
                history.push("/app/dashboard")
        }
    }

    

    validateOtp = async(payload) =>{
        const {dispatch} = this.props;
        let {requestTrackingId2} = this.state;
        await dispatch(onboardingActions.UpgradeValidateOtp(payload, requestTrackingId2));
    }

    resendRegOtp = () =>{
        const {dispatch} = this.props;
        let payload= {
            requestTrackingId : this.state.requestTrackingId!==""?this.state.requestTrackingId : this.state.requestTrackingId2
        }
         dispatch(onboardingActions.ResendRegOtp(payload));
    }


    renderValidateOtp= ()=>{
        let UpgradeValidateOtpRequest = this.props.UpgradeValidateOtpReducer,
            ResendRegOtpReducer = this.props.ResendRegOtpReducer;
        
        const {
                existingCustomerInfo,
                existingCustomerInfo2,
                requestTrackingId,
                requestTrackingId2,
                payload,
                deactivateResend,
                activateResendSecs} = this.state;
        let otpValidationSchema = Yup.object().shape({
                otpCode: Yup.string()
                    .max(6, 'Max of 6 characters')
                    .required('Required'),
            });

            

        // this.activateResendOtp();
        
        return(
            <div className="each-section mt-80 res-mt-45">
                <div className="twosided nomargin">
                    <div>
                        <div className="page-section-mainheading app-panel">
                            <div className="border-lines"><span></span><span></span><span></span></div>
                            
                            <div className="subheading-title">
                                <div className="backnav" onClick={()=>{
                                     history.goBack()
                                }}>
                                    <img src={LeftCaret} alt=""/>
                                    <span>Back</span>
                                </div>
                                <h3>OTP Verification</h3>
                            </div>
                        </div>
                        
                        <div className="dashboard-section">
                            <Formik
                                initialValues={{
                                    otpCode: '',
                                }}

                                validationSchema={otpValidationSchema}
                                onSubmit={(values, { resetForm }) => {

                                    let payload = {
                                        otp: values.otpCode,
                                        requestTrackingId: requestTrackingId!=="" ? requestTrackingId : requestTrackingId2
                                    }
                                    this.setState({payload})
                                    this.validateOtp(payload);
                                        // .then(()=>{
                                        //     if(this.props.UpgradeValidateOtpReducer.request_status === onboardingConstants.UPGRADE_VALIDATE_OTP_SUCCESS){
                                        //         const {dispatch} = this.props;
                                        //         dispatch(onboardingActions.UpgradeFetchDetails("CLEAR"));
                                        //     }
                                        // })
                                    
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

                                            <div className="app-panel inpage">
                                                <div className="form-wrap w-70 mt-40 m-auto pt-20 m-100">
                                                
                                                
                                                {existingCustomerInfo !=="" &&
                                                    <div className="card-text m-t-20 mb-0">
                                                        A code has been sent to <span>{existingCustomerInfo.indexOf('+')==-1?'+':''}{existingCustomerInfo}</span>. 
                                                        <div className="mt-10">Please enter the code below</div>
                                                    </div>
                                                }

                                                {existingCustomerInfo2 !=="" &&
                                                    <div className="card-text m-t-20 mb-0">
                                                        A code has been sent to <span>{existingCustomerInfo2.indexOf('+')==-1?'+':''}{existingCustomerInfo2}</span>. 
                                                        <div className="mt-10">Please enter the code below</div>
                                                    </div>
                                                }
                                                    <Form.Group className="onboardinginput mb-0">

                                                        <Form.Label className="block-level">Enter Code</Form.Label>
                                                        <Form.Control type="password"
                                                            name="otpCode"
                                                            onChange={handleChange}
                                                            maxLength="6"
                                                            value={allowNumbersOnly(values.otpCode, 6)}
                                                            className={errors.otpCode && touched.otpCode ? "is-invalid" : null}
                                                            required />
                                                        {errors.otpCode && touched.otpCode ? (
                                                            <span className="invalid-feedback">{errors.otpCode}</span>
                                                        ) : null}

                                                    </Form.Group>
                                                    {((UpgradeValidateOtpRequest.is_request_processing === false || UpgradeValidateOtpRequest.is_request_processing === undefined)
                                                        && ResendRegOtpReducer.request_status !== onboardingConstants.RESEND_REG_OTP_SUCCESS) &&

                                                        <div className="otp-resend">
                                                            {
                                                                (activateResendSecs === 0 && ResendRegOtpReducer.is_request_processing !== true) &&
                                                                <span className="resendotp-cta" onClick={this.resendRegOtp}>Resend Otp</span>
                                                            }

                                                            {
                                                                (activateResendSecs === 0 && ResendRegOtpReducer.is_request_processing === true) &&
                                                                <span>Resending OTP...</span>
                                                            }

                                                            {
                                                                (activateResendSecs !== 0 ) &&
                                                                <span>Didn’t get the code? resend in {activateResendSecs}secs</span>
                                                            }
                                                        </div>
                                                        // <Button variant="secondary"
                                                        //     type="button"
                                                        //     disabled={deactivateResend}
                                                        //     className="ml-0 lightbtn smalltext"
                                                        //     onClick={this.resendRegOtp}
                                                        // >{activateResendSecs === 0
                                                        //     ? `${ResendRegOtpReducer.is_request_processing !== true ? 'Resend Otp' : 'Resending OTP...'}`
                                                        //     : `Didn’t get the code? resend in ${activateResendSecs}secs`}
                                                        // </Button>
                                                    }
                                                </div>
                                            </div>

                                            {(UpgradeValidateOtpRequest.request_status === onboardingConstants.UPGRADE_VALIDATE_OTP_FAILURE) &&



                                                <ErrorMessage errorMessage={UpgradeValidateOtpRequest.request_data.error} canRetry={true} retryFunc={() => this.validateOtp(payload)} />

                                            }

                                            {(ResendRegOtpReducer.request_status === onboardingConstants.RESEND_REG_OTP_FAILURE) &&



                                                <ErrorMessage errorMessage={ResendRegOtpReducer.request_data.error} canRetry={true} retryFunc={() => this.resendRegOtp()} />

                                            }
                                            <div className="app-panel inpage">
                                                <div className="footer-with-cta toleft m-0">
                                                    <Button variant="secondary"
                                                        type="button"
                                                        disabled={UpgradeValidateOtpRequest.is_request_processing}
                                                        className="ml-0 onboarding-btn light"
                                                        onClick={()=>history.goBack()}
                                                    > Back
                                                     {/* {CreateAccountStep1Request.is_request_processing?'Please wait...' :'Continue'} */}
                                                    </Button>
                                                    <Button variant="secondary"
                                                        type="submit"
                                                        disabled={UpgradeValidateOtpRequest.is_request_processing}
                                                        className=" onboarding-btn"
                                                    >  {UpgradeValidateOtpRequest.is_request_processing ? 'Validating Code...' : 'Continue'}
                                                    </Button>

                                                </div>
                                            </div>

                                            

                                            

                                            

                                        </Form>
                                    )}
                            </Formik>
                        </div>
                    </div>
                    <DownloadApp/>
                    
                </div>
            </div>
        )
        
          
        
    }

  
    


    render() {
        
        
        return (
            <Fragment>
                <Helmet>
                    <title>9PSB - Upgrade account | OTP</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Account Upgrade - OTP</h3>
                    </div>
                   {this.renderValidateOtp()}
                </div>
                </InAppContainer>
            </Fragment>
        );
    }
}


function mapStateToProps(state) {
    return {
        ResendRegOtpReducer : state.onboardingReducers.ResendRegOtpReducer,

        UpgradeValidateOtpReducer : state.onboardingReducers.UpgradeValidateOtpReducer,
        UpgradeFetchDetailsReducer : state.onboardingReducers.UpgradeFetchDetailsReducer,
        UpgradeSendDetailsReducer : state.onboardingReducers.UpgradeSendDetailsReducer,
    };
}

export default connect(mapStateToProps)(ValidateAccountUpgradeOtp);