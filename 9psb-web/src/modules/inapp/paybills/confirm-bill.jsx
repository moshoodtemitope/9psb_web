import * as React from 'react';
import { Link, NavLink} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";


import {history} from '../../../_helpers/history'
import { Helmet } from 'react-helmet';
import Button from 'react-bootstrap/Button'

import { Formik } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import {encryptAnItem} from '../../../shared/shared-utils/index';
import LeftCaret from '../../../assets/images/left-caret.svg';
import  InAppContainer from '../../../shared/templates/inapp-container'
import  DownloadApp from '../../../shared/elements/downloadapp-box'
import { paymentActions } from '../../../redux/actions/payments/payments';
import ErrorMessage from '../../../shared/elements/errormessage'
import { paymentsConstants } from '../../../redux/actiontypes/payments/payments.constants';

import { numberWithCommas,
    allowNumbersOnly} from '../../../shared/utils';
import "./styles.scss"; 
class ConfirmBillPayment extends React.Component{
    constructor(props) {
        super(props);
        let getExistingInfo = this.props.validateCustomerForBillPaymentReducer;
        this.state={
            psbuser:JSON.parse(localStorage.getItem('psb-auth')),
            existingCustomerInfo: (Object.keys(getExistingInfo).length >= 1 && getExistingInfo.request_status === paymentsConstants.VALIDATE_CUSTOMER_FOR_BILL_SUCCESS)
                        ? getExistingInfo.request_data.response : '',
            
        }

        if(this.state.existingCustomerInfo===""){
            history.push("/app/pay-bills")
        }


        
    }

    componentDidMount(){
        this.clearRecords()
    }

    clearRecords = ()=>{
        const {dispatch} = this.props;
       
        dispatch(paymentActions.makeCustomerPaymentForBill("CLEAR"));
       
    }

    confirmPayment = (payload)=>{

        const {dispatch} = this.props;
         dispatch(paymentActions.makeCustomerPaymentForBill(payload));
        
    }


    renderPageWrap = () =>{
        let 
          {existingCustomerInfo,
            psbuser,
            payload} = this.state;
        
        let makeCustomerPaymentForBillRequest = this.props.makeCustomerPaymentForBillReducer;

        let validationSchema = Yup.object().shape({
                txtPin: Yup.string()
                    .required('Required'),
                }); 
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
                                <h3>{existingCustomerInfo.requestPayload.billerInfo} confirmation</h3>
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
                                        amount:existingCustomerInfo.requestPayload.amount,
                                        paymentCode: existingCustomerInfo.requestPayload.forRequest.paymentCode,
                                        customerUniqueReference:existingCustomerInfo.requestPayload.forRequest.subscriberId,
                                        transactionPin: encryptAnItem(values.txtPin),
                                        billerId: existingCustomerInfo.requestPayload.forRequest.billerId,
                                        categoryId: existingCustomerInfo.requestPayload.forRequest.categoryId,
                                        walletNumber: existingCustomerInfo.requestPayload.walletNumber,
                                    }

                                    
                                    this.setState({payload})
                                    this.confirmPayment(payload);
                                    // history.push("/app/pay-bills/success");
                                    


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
                                    You are about to pay { existingCustomerInfo.requestPayload.amount!=="" && <span>&#8358;{existingCustomerInfo.requestPayload.amount}</span> }  from your wallet {existingCustomerInfo.requestPayload.walletNumber}  to {existingCustomerInfo.requestPayload.billerName} {(existingCustomerInfo.fullName && existingCustomerInfo.fullName!=="") && <span>(Recipient: {existingCustomerInfo.fullName} {(existingCustomerInfo.customerId && existingCustomerInfo.customerId!=="") && <span>-{existingCustomerInfo.customerId}</span>}) </span>} for {existingCustomerInfo.requestPayload.selectedBouquetName}.
                                                </div>
                                                {/* <div className="panel-helptext mt-20 centered m-auto pt-20">
                                                    This payment has been set to reoccur once every month.
                                                </div> */}
                                                <div className="form-wrap w-70 mt-40 m-auto pt-20">
                                                   

                                                    <Form.Group className="poppedinput">
                                                        <Form.Label className="block-level">Enter Security PIN</Form.Label>
                                                        <Form.Control type="password"
                                                            name="txtPin"
                                                            onChange={handleChange}
                                                            value={allowNumbersOnly(values.txtPin,4)}
                                                            maxLength="4"
                                                            className={errors.txtPin && touched.txtPin ? "is-invalid" : null}
                                                            required />
                                                            
                                                        {errors.txtPin && touched.txtPin ? (
                                                            <span className="invalid-feedback">{errors.txtPin}</span>
                                                        ) : null}

                                                    </Form.Group>
                                                    {/* <Form.Group className="checkbox-input centered">
                                                        <input type="checkbox" name="" id="save-benficiary"/>
                                                        <label htmlFor="save-benficiary">Save as beneficiary</label>
                                                    </Form.Group> */}
                                                </div>
                                            </div>

                                            {
                                                makeCustomerPaymentForBillRequest.request_status === paymentsConstants.PAY_FOR_BILL_FAILURE &&
                                                
                                                    <ErrorMessage errorMessage={makeCustomerPaymentForBillRequest.request_data.error} canRetry={false} retryFunc={() => this.confirmPayment(payload)} />
                                                
                                            }

                                            <div className="app-panel inpage">
                                                <div className="footer-with-cta toleft m-0 ">
                                                    <Button variant="secondary"
                                                        type="button"
                                                        disabled={makeCustomerPaymentForBillRequest.is_request_processing}
                                                        className="ml-0 onboarding-btn light"
                                                        onClick={()=>history.goBack()}
                                                    > Back
                                                     {/* {CreateAccountStep1Request.is_request_processing?'Please wait...' :'Continue'} */}
                                                    </Button>
                                                    <Button variant="secondary"
                                                        type="submit"
                                                        disabled={makeCustomerPaymentForBillRequest.is_request_processing}
                                                        className="ml-20 onboarding-btn"
                                                    > 
                                                     {makeCustomerPaymentForBillRequest.is_request_processing?'Please wait...' :'Continue'}
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
        let{existingCustomerInfo}= this.state;
        
        return (
            <Fragment>
                <Helmet>
                    <title>9PSB - Pay {existingCustomerInfo.requestPayload.billerName} bills</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Pay {existingCustomerInfo.requestPayload.billerName} bills</h3>
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
        validateCustomerForBillPaymentReducer: state.paymentsReducers.validateCustomerForBillPaymentReducer,
        makeCustomerPaymentForBillReducer: state.paymentsReducers.makeCustomerPaymentForBillReducer,
    };
}

export default connect(mapStateToProps)(ConfirmBillPayment);