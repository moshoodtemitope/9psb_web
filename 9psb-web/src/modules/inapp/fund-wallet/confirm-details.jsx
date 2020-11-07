import * as React from 'react';

import { connect } from 'react-redux';
import {Fragment} from "react";



import {history} from '../../../_helpers/history'

import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Formik } from 'formik';
import { Helmet } from 'react-helmet';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import  InAppContainer from '../../../shared/templates/inapp-container'
import  DownloadApp from '../../../shared/elements/downloadapp-box'
import {encryptAnItem} from '../../../shared/shared-utils/index';
import ErrorMessage from '../../../shared/elements/errormessage'


import {accountActions} from '../../../redux/actions/dashboard/dashboard';
import {dashboardConstants} from '../../../redux/actiontypes/dashboard/dashboard.constants';
import LeftCaret from '../../../assets/images/left-caret.svg';
import { numberWithCommas, allowNumbersOnly, } from '../../../shared/utils';
import "./styles.scss"; 
import { min } from 'date-fns/esm';
class ConfirmCardDetails extends React.Component{
    constructor(props) {
        super(props);
        let getExistingInfo = this.props.ChargeACardReducer;
        let getExistingInfo2 = this.props.ValidateACardReducer;

        let tempUserData = JSON.parse(localStorage.getItem('psb-auth'));
        tempUserData.fundWallet_status = null;
        localStorage.setItem('psb-auth', JSON.stringify(tempUserData));

        if((Object.keys(getExistingInfo).length>=1 
        && getExistingInfo.request_status === dashboardConstants.CHARGE_A_CARD_SUCCESS)){
            this.state={
                psbuser:JSON.parse(localStorage.getItem('psb-auth')),
                existingCustomerInfo: (Object.keys(getExistingInfo).length>=1 
                                            && getExistingInfo.request_status === dashboardConstants.CHARGE_A_CARD_SUCCESS
                                            && getExistingInfo.request_data.response.responseObject.responsecode!=="success" 
                                            && getExistingInfo.request_data.response.responseObject.responsecode!==""
                                            && getExistingInfo.request_data.response.statusCode==="02"
                                            && getExistingInfo.request_data.response.responseObject.status==="02")
                                        ? getExistingInfo.request_data.response.responseObject: '' ,
                
            }
        }

        if((Object.keys(getExistingInfo2).length>=1 
        && getExistingInfo2.request_status === dashboardConstants.VALIDATE_A_CARD_SUCCESS)){
            this.state={
                psbuser:JSON.parse(localStorage.getItem('psb-auth')),
                existingCustomerInfo: (Object.keys(getExistingInfo2).length>=1 
                                            && getExistingInfo2.request_status === dashboardConstants.VALIDATE_A_CARD_SUCCESS
                                            && getExistingInfo2.request_data.response.responseObject.responsecode!=="success" 
                                            && getExistingInfo2.request_data.response.responseObject.responsecode!==""
                                            && getExistingInfo2.request_data.response.statusCode==="02"
                                            && getExistingInfo2.request_data.response.responseObject.status==="02")
                                        ? getExistingInfo2.request_data.response.responseObject: '' ,
                
            }
        }

        
        
        if(this.state.existingCustomerInfo===""){
            history.push("/app/fund-wallet")
        }
        
        
    }

    componentDidMount(){
        this.clearRecords()
       
    }


    clearRecords = ()=>{
        const {dispatch} = this.props;
        let ValidateACardRequest = this.props.ValidateACardReducer;
        if(ValidateACardRequest.request_status ===dashboardConstants.VALIDATE_A_CARD_FAILURE || this.state.psbuser.fundWallet_status===null){
            dispatch(accountActions.ValidateACard("CLEAR"));
        }
    }

    

    
    

    handleCardValidationRequest =async (depositPayload)=>{

        const {dispatch} = this.props;
         await dispatch(accountActions.ValidateACard(depositPayload));
        
    }

    handleCardValidation = (depositPayload)=>{

        const {dispatch} = this.props;
         dispatch(accountActions.ValidateACard(depositPayload));
        
    }

    renderPinValidation = ()=>{
        let 
        {psbuser, payload} = this.state;

        let validationSchema = Yup.object().shape({
            txtPin: Yup.string()
                .required('Required'),
            }); 

        let ValidateACardRequest = this.props.ValidateACardReducer;
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
                                <h3>Confirm Cash Deposit</h3>
                            </div>
                            
                        </div>
                        
                        <div className="dashboard-section">
                            <Formik
                                initialValues={{
                                    txtPin:"",
                                }}

                                validationSchema={validationSchema}
                                onSubmit={(values, { resetForm }) => {

                                    let payload = {
                                        walletNumber: this.walletNumber,
                                        depositAmount: this.depositAmount,
                                        lgaCode: this.lgaCode,
                                        stateCode: this.stateCode,
                                        transactionPin: encryptAnItem(values.txtPin)
                                    }

                                    this.setState({payload})

                                    
                                    this.handleCardValidationRequest(payload)
                                        .then(()=>{
                                            if(this.props.ValidateACardReducer.request_status ===dashboardConstants.VALIDATE_A_CARD_SUCCESS){
                                               
                                                this.setState({existingCustomerInfo: this.props.ValidateACardReducer.request_data.response.responseObject})
                                            }
                                        })


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
                                                
                                                <div className="panel-helptext mt-20 centered m-auto">
                                                Hi {psbuser.firstName}
                                                </div>
                                                <div className="panel-helptext mt-20 centered m-auto pt-20">
                                                    You are about to deposit &#8358;{numberWithCommas(this.depositAmount, true)} from your wallet {this.walletNumber} via agent.
                                                </div>
                                               
                                                <div className="form-wrap w-70 mt-40 m-auto pt-20">
                                                   

                                                    <Form.Group className="poppedinput">
                                                        <Form.Label className="block-level">Enter Security PIN</Form.Label>
                                                        <Form.Control type="password"
                                                            name="amountToSend"
                                                            onChange={handleChange}
                                                            value={allowNumbersOnly(values.txtPin, 4)}
                                                            onChange={(e)=> setFieldValue('txtPin',allowNumbersOnly(e.target.value, 4))  }
                                                            className={errors.txtPin && touched.txtPin ? "is-invalid" : null}
                                                            required />
                                                            
                                                        {errors.txtPin && touched.txtPin ? (
                                                            <span className="invalid-feedback">{errors.txtPin}</span>
                                                        ) : null}

                                                    </Form.Group>
                                                </div>
                                            </div>

                                            
                                            {ValidateACardRequest.request_status ===dashboardConstants.VALIDATE_A_CARD_FAILURE && 
                                                
                                                <ErrorMessage errorMessage={ValidateACardRequest.request_data.error} canRetry={false} retryFunc={()=>this.handleCardValidationRequest(payload)} />
                                            
                                            }
                                            <div className="app-panel inpage">
                                                <div className="footer-with-cta toleft m-0 ">
                                                    <Button variant="secondary"
                                                        type="button"
                                                        disabled={ValidateACardRequest.is_request_processing}
                                                        className="ml-0 onboarding-btn light"
                                                        onClick={()=>{
                                                           history.goBack()
                                                        }}
                                                    > Back
                                                    
                                                    </Button>
                                                    <Button variant="secondary"
                                                        type="submit"
                                                        disabled={ValidateACardRequest.is_request_processing}
                                                        className=" onboarding-btn"
                                                    > 
                                                    {ValidateACardRequest.is_request_processing?'Please wait...' :'Continue'}
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

    renderOTPValidation = (infoData)=>{
        let 
        {psbuser, payload} = this.state;

        let validationSchema = Yup.object().shape({
            otpCode: Yup.string()
                .required('Required'),
            }); 

        let ValidateACardRequest = this.props.ValidateACardReducer;
        

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
                                <h3>Enter OTP 
                                </h3>
                            </div>
                            
                        </div>
                        
                        <div className="dashboard-section">
                            <Formik
                                initialValues={{
                                    otpCode:"",
                                }}

                                validationSchema={validationSchema}
                                onSubmit={(values, { resetForm }) => {

                                    let payload = {
                                        data: values.otpCode,
                                        reference:infoData.otptransactionidentifier,
                                        cardResponseCode:infoData.responsecode
                                    }

                                    this.setState({payload})

                                    
                                    this.handleCardValidationRequest(payload)
                                        .then(()=>{
                                            if(this.props.ValidateACardReducer.request_status ===dashboardConstants.VALIDATE_A_CARD_SUCCESS){
                                               
                                                this.setState({existingCustomerInfo: this.props.ValidateACardReducer.request_data.response.responseObject})
                                            }
                                        })


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
                                                
                                                <div className="panel-helptext mt-20  m-auto pt-20">
                                                    {(infoData.responsemessage!=="" && infoData.responsemessage!==undefined && infoData.responsemessage!==null)
                                                        ?`${infoData.responsemessage}`:"Please enter the OTP sent to you"}
                                                </div>
                                               
                                                <div className="form-wrap w-70 mt-40 m-auto pt-20">
                                                   

                                                    <Form.Group className="poppedinput">
                                                        <Form.Label className="block-level">OTP Code</Form.Label>
                                                        <Form.Control type="password"
                                                            name="otpCode"
                                                            onChange={handleChange}
                                                            value={allowNumbersOnly(values.otpCode)}
                                                            onChange={(e)=> setFieldValue('otpCode',allowNumbersOnly(e.target.value))  }
                                                            className={errors.otpCode && touched.otpCode ? "is-invalid" : null}
                                                            required />
                                                            
                                                        {errors.otpCode && touched.otpCode ? (
                                                            <span className="invalid-feedback">{errors.otpCode}</span>
                                                        ) : null}

                                                    </Form.Group>
                                                </div>
                                            </div>

                                            
                                            {ValidateACardRequest.request_status ===dashboardConstants.VALIDATE_A_CARD_FAILURE && 
                                                
                                                    <ErrorMessage errorMessage={ValidateACardRequest.request_data.error} canRetry={false} retryFunc={()=>this.handleCardValidationRequest(payload)} />
                                                
                                            }
                                            <div className="app-panel inpage">
                                                <div className="footer-with-cta toleft m-0 ">
                                                    <Button variant="secondary"
                                                        type="button"
                                                        disabled={ValidateACardRequest.is_request_processing}
                                                        className="ml-0 onboarding-btn light"
                                                        onClick={()=>{
                                                           history.goBack()
                                                        }}
                                                    > Back
                                                    
                                                    </Button>
                                                    <Button variant="secondary"
                                                        type="submit"
                                                        disabled={ValidateACardRequest.is_request_processing}
                                                        className=" onboarding-btn"
                                                    > 
                                                    {ValidateACardRequest.is_request_processing?'Please wait...' :'Continue'}
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

    renderPhoneValidation = (infoData)=>{
        let 
        {psbuser, payload} = this.state;

        let validationSchema = Yup.object().shape({
            phoneNumber: Yup.string()
                .min(10, "A minimum of 10 digits required")
                .required('Required'),
            }); 

        let ValidateACardRequest = this.props.ValidateACardReducer;
       

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
                                <h3>Enter Phone number 
                                </h3>
                            </div>
                            
                        </div>
                        
                        <div className="dashboard-section">
                            <Formik
                                initialValues={{
                                    phoneNumber:"",
                                }}

                                validationSchema={validationSchema}
                                onSubmit={(values, { resetForm }) => {

                                    let payload = {
                                        data: values.phoneNumber,
                                        reference:infoData.transactionreference,
                                        cardResponseCode:infoData.responsecode
                                    }

                                    this.setState({payload})

                                    
                                    this.handleCardValidationRequest(payload)
                                        .then(()=>{
                                            if(this.props.ValidateACardReducer.request_status ===dashboardConstants.VALIDATE_A_CARD_SUCCESS){
                                               
                                                this.setState({existingCustomerInfo: this.props.ValidateACardReducer.request_data.response.responseObject})
                                            }
                                        })


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
                                                
                                                <div className="panel-helptext mt-20  m-auto pt-20">
                                                    {(infoData.responsemessage!=="" && infoData.responsemessage!==undefined && infoData.responsemessage!==null)
                                                        ?`${infoData.responsemessage}`:"Kindly enter a mobile no (at least 10 digits)"}
                                                </div>
                                               
                                                <div className="form-wrap w-70 mt-40 m-auto pt-20">
                                                   

                                                    <Form.Group className="poppedinput">
                                                        <Form.Label className="block-level">Phone number</Form.Label>
                                                        <Form.Control type="text"
                                                            name="phoneNumber"
                                                            onChange={handleChange}
                                                            value={allowNumbersOnly(values.phoneNumber)}
                                                            onChange={(e)=> setFieldValue('phoneNumber',allowNumbersOnly(e.target.value))  }
                                                            className={errors.phoneNumber && touched.phoneNumber ? "is-invalid" : null}
                                                            required />
                                                            
                                                        {errors.phoneNumber && touched.phoneNumber ? (
                                                            <span className="invalid-feedback">{errors.phoneNumber}</span>
                                                        ) : null}

                                                    </Form.Group>
                                                </div>
                                            </div>

                                            
                                            {ValidateACardRequest.request_status ===dashboardConstants.VALIDATE_A_CARD_FAILURE && 
                                                
                                                <ErrorMessage errorMessage={ValidateACardRequest.request_data.error} canRetry={false} retryFunc={()=>this.handleCardValidationRequest(payload)} />
                                                
                                            }
                                            <div className="app-panel inpage">
                                                <div className="footer-with-cta toleft m-0 ">
                                                    <Button variant="secondary"
                                                        type="button"
                                                        disabled={ValidateACardRequest.is_request_processing}
                                                        className="ml-0 onboarding-btn light"
                                                        onClick={()=>{
                                                           history.goBack()
                                                        }}
                                                    > Back
                                                    
                                                    </Button>
                                                    <Button variant="secondary"
                                                        type="submit"
                                                        disabled={ValidateACardRequest.is_request_processing}
                                                        className=" onboarding-btn"
                                                    > 
                                                    {ValidateACardRequest.is_request_processing?'Please wait...' :'Continue'}
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





    renderPageWrap = () =>{
        let 
        {psbuser, payload, existingCustomerInfo} = this.state;

        let getExistingInfo ;
        getExistingInfo = this.props.ChargeACardReducer.request_data.response.responseObject;
       
        return(
            <div>
                {existingCustomerInfo.responsecode === "send_otp" && 
                    this.renderOTPValidation(existingCustomerInfo)
                }
                {existingCustomerInfo.responsecode === "send_phone" && 
                    this.renderPhoneValidation(existingCustomerInfo)
                }

                {/* {(this.props.ChargeACardReducer.request_data.response.responseObject.responsecode === "send_otp"
                 || (this.props.ValidateACardReducer.request_data.response!==undefined 
                        && this.props.ValidateACardReducer.request_data.response.responseObject.responsecode === "send_otp"
                        && this.props.ValidateACardReducer.request_data.response.responseObject.responsecode !== "send_phone")) && 
                    this.renderOTPValidation(this.props.ChargeACardReducer.request_data.response.responseObject)
                }
                {(this.props.ChargeACardReducer.request_data.response.responseObject.responsecode === "send_phone"
                  || (this.props.ValidateACardReducer.request_data.response!==undefined 
                        && this.props.ValidateACardReducer.request_data.response.responseObject.responsecode === "send_phone"
                        && this.props.ValidateACardReducer.request_data.response.responseObject.responsecode !== "send_otp")) && 
                    this.renderPhoneValidation(this.props.ChargeACardReducer.request_data.response.responseObject)
                } */}

                
            </div>
        )
        
    }

    
    



    

  
    


    render() {
        
        
        return (
            <Fragment>
                <Helmet>
                    <title>9PSB -Fund Wallet | confirm</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>9PSB - Fund Wallet</h3>
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
        
        ChargeACardReducer : state.accountsReducers.ChargeACardReducer,
        ValidateACardReducer : state.accountsReducers.ValidateACardReducer,
    };
}

export default connect(mapStateToProps)(ConfirmCardDetails);