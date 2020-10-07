import * as React from 'react';
import { Link, NavLink} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";




import {history} from '../../../../_helpers/history'

import Button from 'react-bootstrap/Button'

import { Formik } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet';
import LeftCaret from '../../../../assets/images/left-caret.svg';
import {encryptAnItem} from '../../../../shared/shared-utils/index';
import  InAppContainer from '../../../../shared/templates/inapp-container'
import  DownloadApp from '../../../../shared/elements/downloadapp-box'
import  ErrorMessage from '../../../../shared/elements/errormessage'
import {paymentActions} from '../../../../redux/actions/payments/payments';
import {paymentsConstants} from '../../../../redux/actiontypes/payments/payments.constants';
import { numberWithCommas,allowNumbersOnly, getNetworkProviderWithCode} from '../../../../shared/utils';
import "../styles.scss"; 
class ConfirmAirtimeOthersTopUp extends React.Component{
    constructor(props) {
        super(props);
        let getExistingInfo = this.props.saveAirtimeRecipientDataReducer;
        this.state={
            psbuser:JSON.parse(localStorage.getItem('psb-auth')),
            existingCustomerInfo: (Object.keys(getExistingInfo).length >= 1
            && getExistingInfo.request_status === paymentsConstants.STORE_AIRTIME_RECIPIENT_DATA
            && (getExistingInfo.request_data.source===undefined || getExistingInfo.request_data.source===null) && getExistingInfo.request_data.txtType==="others")
            ? getExistingInfo.request_data.customerData : '',
        }
   
        if(this.state.existingCustomerInfo===""){
            history.push("/app/buy-airtime/others/choose")
        }
    }

    componentDidMount(){
        this.clearRecords()
    }


    clearRecords = ()=>{
        const {dispatch} = this.props;
       
        dispatch(paymentActions.AirtimeTopUp("CLEAR"));
        
       
    }
  
    
    confirmRecharge = (payload)=>{

        const {dispatch} = this.props;
         dispatch(paymentActions.AirtimeTopUp(payload));
        
    }

    

    renderPageWrap = () =>{
        let 
          {existingCustomerInfo,
            psbuser,
            payload} = this.state;
        let AirtimeTopUpRequest = this.props.AirtimeTopUpReducer;
        let validationSchema = Yup.object().shape({
                txtPin: Yup.string()
                    .required('Required'),
                }); 
                
        let providersList = [
                {label:"Airtel", value: 1}, 
                {label:"9Mobile", value: 2}, 
                {label:"Globacom", value: 3}, 
                {label:"Mtn", value: 4}];
        
        if(this.state.existingCustomerInfo===""){
            history.push("/app/buy-airtime/others/choose")
        }
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
                                <h3>Confirm Top Up</h3>
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
                                        ...existingCustomerInfo,
                                        transactionPin: encryptAnItem(values.txtPin)
                                    }
                                    this.setState({payload})
                                    
                                    this.confirmRecharge(payload);
                                    
                                    


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
                                                    You are about to purchase &#8358;{numberWithCommas(existingCustomerInfo.amount, true)} {getNetworkProviderWithCode(existingCustomerInfo.network, providersList)} airtime from your wallet/account {existingCustomerInfo.walletNumber} to phone number - {existingCustomerInfo.recipient}.
                                                </div>
                                                <div className="panel-helptext mt-20 centered m-auto pt-20">
                                                    Please confirm.
                                                </div>
                                                <div className="form-wrap w-70 mt-40 m-auto pt-20">
                                                   

                                                    <Form.Group className="poppedinput">
                                                        <Form.Label className="block-level">Enter Security PIN</Form.Label>
                                                        <Form.Control 
                                                            type="password"
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
                                                </div>
                                            </div>

                                            
                                                
                                                
                                                
                                            

                                            <div className="app-panel inpage">
                                                <div className="footer-with-cta toleft m-0 ">
                                                    <Button variant="secondary"
                                                        type="button"
                                                        disabled={AirtimeTopUpRequest.is_request_processing}
                                                        className="ml-0 onboarding-btn light"
                                                        onClick={()=> history.goBack()}
                                                    > Back
                                                     {/* {CreateAccountStep1Request.is_request_processing?'Please wait...' :'Continue'} */}
                                                    </Button>
                                                    <Button variant="secondary"
                                                        type="submit"
                                                        disabled={AirtimeTopUpRequest.is_request_processing}
                                                        className=" onboarding-btn"
                                                    > 
                                                     {AirtimeTopUpRequest.is_request_processing?'Please wait...' :'Continue'}
                                                    </Button>

                                                </div>
                                            </div>
                                            {
                                                AirtimeTopUpRequest.request_status ===paymentsConstants.BUY_AIRTIME_FAILURE && 
                                                
                                                    <ErrorMessage errorMessage={AirtimeTopUpRequest.request_data.error} canRetry={false} retryFunc={()=>this.confirmRecharge(payload)} />
                                                
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
                    <title>9PSB - Confirm Airtime Top-Up</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Others Airtime Top Up</h3>
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
        saveAirtimeRecipientDataReducer : state.paymentsReducers.saveAirtimeRecipientDataReducer,
        AirtimeTopUpReducer : state.paymentsReducers.AirtimeTopUpReducer,
    };
}

export default connect(mapStateToProps)(ConfirmAirtimeOthersTopUp);