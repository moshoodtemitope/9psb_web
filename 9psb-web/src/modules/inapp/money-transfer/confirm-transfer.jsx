import * as React from 'react';

import { connect } from 'react-redux';
import {Fragment} from "react";


import {history} from '../../../_helpers/history'
import { Helmet } from 'react-helmet';
import Button from 'react-bootstrap/Button'

import { Formik } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import  InAppContainer from '../../../shared/templates/inapp-container'
import  DownloadApp from '../../../shared/elements/downloadapp-box'
import  ErrorMessage from '../../../shared/elements/errormessage'
import {encryptAnItem} from '../../../shared/shared-utils/index';
import LeftCaret from '../../../assets/images/left-caret.svg';
import {paymentActions} from '../../../redux/actions/payments/payments';
import {paymentsConstants} from '../../../redux/actiontypes/payments/payments.constants';
import { numberWithCommas,allowNumbersOnly} from '../../../shared/utils';
import "./styles.scss"; 
class ConfirmTransferToPhone extends React.Component{
    constructor(props) {
        super(props);
        let getExistingInfo = this.props.TransferMoneyToPhoneSTEP1Reducer;
        this.state={
            psbuser:JSON.parse(localStorage.getItem('psb-auth')),
            screenWidthSize: window.innerWidth,
            existingCustomerInfo: (Object.keys(getExistingInfo).length>=1 
                                        && getExistingInfo.request_status === paymentsConstants.TRANSFER_TO_PHONE_STEP1_SUCCESS)
                                    ? getExistingInfo.request_data.response: '' ,
        }

        if(this.state.existingCustomerInfo===""){
            history.push("/app/transfer")
        }
   
        
    }

    componentDidMount(){
        this.clearRecords();
    }

    clearRecords = ()=>{
        const {dispatch} = this.props;
        dispatch(paymentActions.TranferToPhoneNumber("CLEAR"));
    }

    bounceBackToStep = ()=>{
        
        let {existingCustomerInfo}= this.state;
        
        if(existingCustomerInfo===""){
                history.push("/app/transfer")
        }
    }


    confirmTransfer = (payload, saveBeneficiary)=>{

        const {dispatch} = this.props;
         dispatch(paymentActions.TranferToPhoneNumber(payload, saveBeneficiary));
        
    }



    renderPageWrap = () =>{
        let
            {existingCustomerInfo,
            psbuser,
            payload} = this.state;
        let validationSchema = Yup.object().shape({
            txtPin: Yup.string()
                .required('Required'),
            });   
        let TransferMoneyToPhoneNumberRequest = this.props.TransferMoneyToPhoneNumberReducer
        return(
            <div className="each-section mt-80 res-mt-45">
                <div className="twosided nomargin">
                    <div>
                        <div className="page-section-mainheading app-panel">
                            <div className="border-lines"><span></span><span></span><span></span></div>
                            
                            <div className="subheading-title">
                                <div className="backnav" onClick={()=>history.goBack()}>
                                    <img src={LeftCaret} alt=""/>
                                    <span>Back</span>
                                </div>
                                <h3>Confirm Transfer</h3>
                            </div>
                            
                        </div>
                        
                        <div className="dashboard-section">
                            <Formik
                                initialValues={{
                                    txtPin:"",
                                    saveBeneficiary:false,
                                    beneficiaryAlias: ""
                                }}

                                validationSchema={validationSchema}
                                onSubmit={(values, { resetForm }) => {

                                    let payload;
                                    
                                    payload = {
                                        transferInfo:{
                                            transactionPin: encryptAnItem(values.txtPin),
                                            toMobileNumber: existingCustomerInfo.toMobileNumber,
                                            sourceAccountNumber:existingCustomerInfo.sourceAccountNumber,
                                            reciepientName: existingCustomerInfo.displayName,
                                            amount: existingCustomerInfo.amount,
                                            narration: existingCustomerInfo.narration,
                                        },
                                        beneficiaryInfo:{
                                            bankCode:existingCustomerInfo.bankCode,
                                            beneficiaryName: existingCustomerInfo.displayName,
                                            displayName: values.beneficiaryAlias!==""?values.beneficiaryAlias : null,
                                            beneficiaryAccountNumber: existingCustomerInfo.accountNumber
                                        }
                                    }
                                    
                                    

                                    // history.push("/app/transfer/success");
                                    this.setState({payload})
                                    
                                    this.confirmTransfer(payload, values.saveBeneficiary);
                                    // return;
                                    // this.registerStep2(payload)
                                    //     .then(() => {

                                    //     })


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
                                                    You are about to transfer &#8358;{numberWithCommas(existingCustomerInfo.amount, true)} from your wallet/nuban account to {existingCustomerInfo.displayName} with Phone/Wallet number - {existingCustomerInfo.accountNumber}.
                                                </div>
                                                <div className="panel-helptext mt-20 centered m-auto pt-20">
                                                    Please confirm.
                                                </div>
                                                <div className="form-wrap w-70 mt-40 m-auto pt-20">
                                                   

                                                    <Form.Group className="poppedinput">
                                                        <Form.Label className="block-level">Enter Security PIN</Form.Label>
                                                        <Form.Control type="password"
                                                            name="txtPin"
                                                            onChange={handleChange}
                                                            maxLength="4"
                                                            value={allowNumbersOnly(values.txtPin)}
                                                            className={errors.txtPin && touched.txtPin ? "is-invalid" : null}
                                                            required />
                                                            
                                                        {errors.txtPin && touched.txtPin ? (
                                                            <span className="invalid-feedback">{errors.txtPin}</span>
                                                        ) : null}

                                                    </Form.Group>
                                                    <Form.Group className="checkbox-input centered">
                                                        <input type="checkbox"
                                                         name="saveBeneficiary" 
                                                         checked={values.saveBeneficiary? values.saveBeneficiary:null}
                                                         onChange={handleChange} 
                                                         value={values.saveBeneficiary}
                                                         id="save-benficiary"/>
                                                        <label htmlFor="save-benficiary">Save as beneficiary</label>
                                                    </Form.Group>
                                                    {values.saveBeneficiary===true &&
                                                        <Form.Group className="poppedinput">
                                                            <Form.Label className="block-level">Beneficiary Alias(optional)</Form.Label>
                                                            <Form.Control type="text"
                                                                name="beneficiaryAlias"
                                                                onChange={handleChange}
                                                                value={values.beneficiaryAlias}
                                                                className={errors.beneficiaryAlias && touched.beneficiaryAlias ? "is-invalid" : null}
                                                                required />
                                                            
                                                        </Form.Group>
                                                    }
                                                </div>
                                            </div>
                                            

                                            <div className="app-panel inpage">
                                                <div className="footer-with-cta toleft m-0 ">
                                                    <Button variant="secondary"
                                                        type="button"
                                                        disabled={TransferMoneyToPhoneNumberRequest.is_request_processing}
                                                        className="ml-0 onboarding-btn light"
                                                        onClick={()=>history.goBack()}
                                                    > Back
                                                     {/* {CreateAccountStep1Request.is_request_processing?'Please wait...' :'Continue'} */}
                                                    </Button>
                                                    {( TransferMoneyToPhoneNumberRequest.request_status !== paymentsConstants.TRANSFER_TO_PHONE_NUMBER_SUCCESS 
                                                        && TransferMoneyToPhoneNumberRequest.request_data.error!=="Insufficient balance.") &&
                                                        <Button variant="secondary"
                                                            type="submit"
                                                            disabled={TransferMoneyToPhoneNumberRequest.is_request_processing}
                                                            className=" onboarding-btn"
                                                        > 
                                                            {TransferMoneyToPhoneNumberRequest.is_request_processing?'Please wait...' :'Continue'}
                                                        </Button>
                                                    }

                                                </div>
                                            </div>

                                            {TransferMoneyToPhoneNumberRequest.request_status ===paymentsConstants.TRANSFER_TO_PHONE_NUMBER_FAILURE && 
                                                <div className="">
                                                    {
                                                        TransferMoneyToPhoneNumberRequest.request_data.failedRequest==="savebeneficiary" &&
                                                        <ErrorMessage errorMessage={TransferMoneyToPhoneNumberRequest.request_data.error} canRetry={false} retryFunc={()=>this.confirmTransfer(payload, true)} />
                                                    }
                                                    {
                                                        TransferMoneyToPhoneNumberRequest.request_data.failedRequest==="transfer" &&
                                                        <ErrorMessage errorMessage={TransferMoneyToPhoneNumberRequest.request_data.error} 
                                                                    // canRetry={TransferMoneyToPhoneNumberRequest.request_data.error!=="Insufficient balance."? true: false} 
                                                                    retryFunc={()=>this.confirmTransfer(payload, false)} />
                                                    }
                                                    
                                                </div>
                                            }

                                            
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
                    <title>9PSB - Transfer to phone | confirm</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Transfer to phone</h3>
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
        TransferMoneyToPhoneSTEP1Reducer : state.paymentsReducers.TransferMoneyToPhoneSTEP1Reducer,
        TransferMoneyToPhoneNumberReducer : state.paymentsReducers.TransferMoneyToPhoneNumberReducer,
    };
}

export default connect(mapStateToProps)(ConfirmTransferToPhone);