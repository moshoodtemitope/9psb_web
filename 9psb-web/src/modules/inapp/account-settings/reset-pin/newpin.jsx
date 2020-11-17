import * as React from 'react';

import { connect } from 'react-redux';
import {Fragment} from "react";

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';


import {history} from '../../../../_helpers/history'
import Alert from 'react-bootstrap/Alert';
import Select from 'react-select';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Helmet } from 'react-helmet';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import LeftCaret from '../../../../assets/images/left-caret.svg';
import  InAppContainer from '../../../../shared/templates/inapp-container'
import  DownloadApp from '../../../../shared/elements/downloadapp-box'
import  SelectAnAccount from '../../../../shared/elements/select-account'
import  ErrorMessage from '../../../../shared/elements/errormessage'

import { numberWithCommas} from '../../../../shared/utils';
import {encryptAnItem} from '../../../../shared/shared-utils/index';


import {onboardingConstants} from '../../../../redux/actiontypes/onboarding/onboarding.constants'
import {onboardingActions} from '../../../../redux/actions/onboarding/onboarding';
import {  allowNumbersOnly} from '../../../../shared/utils';
import "../styles.scss"; 
class NewTxtPin extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            user:"",
            requestTrackingId:this.props.location.state && this.props.location.state.requestTrackingId
                                    ? this.props.location.state.requestTrackingId:""
            
        }
        
      if(this.state.requestTrackingId===""){
        history.push("/app/account-settings");
      }
    }

    componentDidMount(){
        this.clearRecords()
    }

    clearRecords = ()=>{
        const {dispatch} = this.props;
        dispatch(onboardingActions.ResendRegOtp("CLEAR"));
        dispatch(onboardingActions.CompletePinReset("CLEAR"));
    }


    changePin = (payload)=>{
        const {dispatch} = this.props;
        dispatch(onboardingActions.CompletePinReset(payload));
    }
   
    resendRegOtp = () =>{
        const {dispatch} = this.props;
        let payload= {
            requestTrackingId : this.state.requestTrackingId
        }
        dispatch(onboardingActions.CompletePinReset("CLEAR"));
        dispatch(onboardingActions.ResendRegOtp(payload));
    }
    


    renderPageWrap = () =>{
        let {payload, requestTrackingId}= this.state;
       
        let validationChangeSchema = Yup.object().shape({
                otp: Yup.string()
                    .length(6, '6 Digits OTP')
                    .required('Required'),
                newPin: Yup.string()
                    .length(4, '4 Digits PIN')
                    .required('Required'),
                conmfirmNewPin: Yup.string()
                    .length(4, '4 Digits PIN')
                    .required('Required')
                    .oneOf([Yup.ref('newPin'), null], 'New PIN must match'),
        });   

        let completePinResetRequest = this.props.CompletePinResetReducer,
            resendRegOtpRequest =  this.props.ResendRegOtpReducer;
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
                                <h3>Reset your PIN</h3>
                            </div>
                        </div>
                        
                        <div className="dashboard-section">
                            <Formik
                                initialValues={{
                                    otp:"",
                                    newPin:"",
                                    conmfirmNewPin:""
                                }}

                                validationSchema={validationChangeSchema}
                                onSubmit={(values, { resetForm }) => {

                                    let payload = {
                                        otp: values.otp,
                                        newPin: encryptAnItem(values.newPin),
                                        requestTrackingId
                                      }
                                   
                                      this.setState({payload});

                                      this.changePin(payload);

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
                                                <div className="panel-helptext w-70 mt-20  m-auto m-100">
                                                    {/* Change Password */}
                                                </div>
                                                <div className="form-wrap w-70 mt-40 m-auto pt-20 m-100">
                                                    
                                                        
                                                 
                                                    <Form.Group className="">
                                                        <Form.Label className="block-level">OTP sent to your phone</Form.Label>
                                                        <Form.Control type="password"
                                                            name="otp"
                                                            onChange={(e)=> setFieldValue('otp', e.target.value)}
                                                            maxLength="6"
                                                            value={allowNumbersOnly(values.otp,6)}
                                                            className={errors.otp && touched.otp ? "is-invalid" : null}
                                                            required />
                                                        {errors.otp && touched.otp ? (
                                                            <span className="invalid-feedback">{errors.otp}</span>
                                                        ) : null}

                                                    </Form.Group>
                                                    <Form.Group className="poppedinput">
                                                        <Form.Label className="block-level">New PIN</Form.Label>
                                                        <Form.Control type="password"
                                                            name="newPin"
                                                            onChange={(e)=> setFieldValue('newPin', e.target.value)}
                                                            value={allowNumbersOnly(values.newPin,4)}
                                                            maxLength="4"
                                                            className={errors.newPin && touched.newPin ? "is-invalid" : null}
                                                            required />
                                                        {errors.newPin && touched.newPin ? (
                                                            <span className="invalid-feedback">{errors.newPin}</span>
                                                        ) : null}

                                                    </Form.Group>
                                                    <Form.Group className="poppedinput">
                                                        <Form.Label className="block-level">Retype New PIN</Form.Label>
                                                        <Form.Control type="password"
                                                            name="conmfirmNewPin"
                                                            onChange={(e)=> setFieldValue('conmfirmNewPin', e.target.value)}
                                                            maxLength="4"
                                                            value={allowNumbersOnly(values.conmfirmNewPin,4)}
                                                            className={errors.conmfirmNewPin && touched.conmfirmNewPin ? "is-invalid" : null}
                                                            required />
                                                        {errors.conmfirmNewPin && touched.conmfirmNewPin ? (
                                                            <span className="invalid-feedback">{errors.conmfirmNewPin}</span>
                                                        ) : null}

                                                    </Form.Group>
                                                    
                                                 
                                                </div>
                                            </div>
                                            
                                            {completePinResetRequest.request_status ===onboardingConstants.COMPLETE_PIN_RESET_FAILURE && 
                                               
                                                    <ErrorMessage errorMessage={completePinResetRequest.request_data.error} 
                                                        canRetry={true} 
                                                        canRetry={(completePinResetRequest.request_data.error==="The OTP has expired." ||
                                                                    completePinResetRequest.request_data.error!=="The OTP entered is not valid.")
                                                                    ?true:false} 
                                                        retryText={completePinResetRequest.request_data.error!=="The OTP has expired."?null:"Resend OTP"}
                                                        retryFunc={()=>{
                                                            if(completePinResetRequest.request_data.error!=="The OTP has expired."){
                                                                this.changePin(payload)
                                                            }else{
                                                                this.resendRegOtp()
                                                            }
                                                        }} 
                                                    />
                                                
                                            }

                                            {resendRegOtpRequest.request_status ===onboardingConstants.RESEND_REG_OTP_FAILURE && 
                                                
                                                <ErrorMessage errorMessage={resendRegOtpRequest.request_data.error} 
                                                    // canRetry={true} 
                                                    // canRetry={(resendRegOtpRequest.request_data.error==="we are  unable to send otp at the moment, please try again later")
                                                    //             ?true:false} 
                                                    
                                                    retryFunc={()=>{this.resendRegOtp() }} 
                                                />
                                            
                                            }

                                            <div className="app-panel inpage">
                                                <div className="footer-with-cta toleft m-0 ">
                                                    <Button variant="secondary"
                                                        type="button"
                                                        disabled={completePinResetRequest.is_request_processing || resendRegOtpRequest.is_request_processing}
                                                        className="ml-0 onboarding-btn light"
                                                        onClick={()=>history.goBack()}
                                                    > Back
                                                     {/* {CreateAccountStep1Request.is_request_processing?'Please wait...' :'Continue'} */}
                                                    </Button>
                                                    <Button variant="secondary"
                                                        type="submit"
                                                        disabled={completePinResetRequest.is_request_processing || resendRegOtpRequest.is_request_processing}
                                                        className="ml-10 onboarding-btn"
                                                    > 
                                                     {completePinResetRequest.is_request_processing?'Please wait...' :'Update'}
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
                <title>9PSB - New PIN</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Reset PIN</h3>
                    </div>
                   {this.renderPageWrap()}
                </div>
                </InAppContainer>
            </Fragment>
        );
    }
}



function mapStateToProps(state) {
    return {
        CompletePinResetReducer : state.onboardingReducers.CompletePinResetReducer,
        ResendRegOtpReducer : state.onboardingReducers.ResendRegOtpReducer
    };
}

export default connect(mapStateToProps)(NewTxtPin);