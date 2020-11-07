import * as React from 'react';
import { Link, NavLink} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";



import {history} from '../../../../_helpers/history'


import Button from 'react-bootstrap/Button'

import { Formik } from 'formik';
import * as Yup from 'yup';
import { Helmet } from 'react-helmet';
import Form from 'react-bootstrap/Form';
import {encryptAnItem} from '../../../../shared/shared-utils/index';
import  InAppContainer from '../../../../shared/templates/inapp-container'
import  DownloadApp from '../../../../shared/elements/downloadapp-box'
import LeftCaret from '../../../../assets/images/left-caret.svg';
import  ErrorMessage from '../../../../shared/elements/errormessage'
import {paymentActions} from '../../../../redux/actions/payments/payments';
import {paymentsConstants} from '../../../../redux/actiontypes/payments/payments.constants';
import { numberWithCommas,
        allowNumbersOnly,
        getDataPlanNameCode,
        getNetworkProviderWithCode} from '../../../../shared/utils';
import "../styles.scss"; 
class BuyDataOthersConfirm extends React.Component{
    constructor(props) {
        super(props);
        let getExistingInfo = this.props.saveDataTopUpRecipientDataReducer;
        let getDataPlans = this.props.GetDataTopUpPlansReducer;
        this.state={
            psbuser:JSON.parse(localStorage.getItem('psb-auth')),
            existingCustomerInfo: (Object.keys(getExistingInfo).length >= 1
                    && getExistingInfo.request_status === paymentsConstants.STORE_DATATOPUP_RECIPIENT_DATA
                    && getExistingInfo.request_data.source===null && getExistingInfo.request_data.txtType==="others")
                    ? getExistingInfo.request_data.customerData : '',
            dataPlansInfo: (Object.keys(getDataPlans).length >= 1
                    && getDataPlans.request_status === paymentsConstants.FETCH_DATATOPUP_PLANS_SUCCESS
                    )
                    ? getDataPlans.request_data.response : '',
        }
        
        
        if(this.state.existingCustomerInfo===""){
            history.push("/app/buy-data/others/choose")
        }
    }

    componentDidMount(){
        this.clearRecords()
    }


    clearRecords = ()=>{
        const {dispatch} = this.props;
       
        dispatch(paymentActions.DataTopUpTopUp("CLEAR"));
        
       
    }
  
    
    confirmRecharge = (payload)=>{

        const {dispatch} = this.props;
         dispatch(paymentActions.DataTopUpTopUp(payload));
        
    }

    renderPageWrap = () =>{
        let 
          {existingCustomerInfo,
            psbuser,
            dataPlansInfo,
            payload} = this.state;
            // let {dataPlansInfo} = this.state;
        let DataTopUpTopUpRequest = this.props.DataTopUpTopUpReducer;
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
            history.push("/app/buy-data/others/choose")
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
                                <h3>Data Top Up</h3>
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
                                                    
                                                    You are about to purchase  {getDataPlanNameCode(existingCustomerInfo.amount, existingCustomerInfo.network, dataPlansInfo)} Data from your wallet {existingCustomerInfo.walletNumber} to phone number - {existingCustomerInfo.recipient}.
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

                                            {
                                                DataTopUpTopUpRequest.request_status ===paymentsConstants.BUY_DATATOPUP_FAILURE && 
                                                
                                                    <ErrorMessage errorMessage={DataTopUpTopUpRequest.request_data.error} canRetry={false} retryFunc={()=>this.confirmRecharge(payload)} />
                                                
                                            }

                                            <div className="app-panel inpage">
                                                <div className="footer-with-cta toleft m-0 ">
                                                    <Button variant="secondary"
                                                        type="button"
                                                        disabled={DataTopUpTopUpRequest.is_request_processing}
                                                        className="ml-0 onboarding-btn light"
                                                        onClick={()=>history.push("/app/buy-data/others")}
                                                    > Back
                                                     
                                                    </Button>
                                                    <Button variant="secondary"
                                                        type="submit"
                                                        disabled={DataTopUpTopUpRequest.is_request_processing}
                                                        className=" onboarding-btn"
                                                    > 
                                                     {DataTopUpTopUpRequest.is_request_processing?'Please wait...' :'Continue'}
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
                    <title>9PSB - confirm Data Top-Up for others</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Data Top-Up for others</h3>
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
        saveDataTopUpRecipientDataReducer : state.paymentsReducers.saveDataTopUpRecipientDataReducer,
        DataTopUpTopUpReducer : state.paymentsReducers.DataTopUpTopUpReducer,
        GetDataTopUpPlansReducer: state.paymentsReducers.GetDataTopUpPlansReducer,
    };
}

export default connect(mapStateToProps)(BuyDataOthersConfirm);