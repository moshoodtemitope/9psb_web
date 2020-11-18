import * as React from 'react';

import { connect } from 'react-redux';
import {Fragment} from "react";


import {history} from '../../../_helpers/history'
import { Helmet } from 'react-helmet';
import Button from 'react-bootstrap/Button'

import  InAppContainer from '../../../shared/templates/inapp-container'
import  DownloadApp from '../../../shared/elements/downloadapp-box'
import Done from '../../../assets/images/done.svg';
import { paymentActions } from '../../../redux/actions/payments/payments';
import { paymentsConstants } from '../../../redux/actiontypes/payments/payments.constants';
import { numberWithCommas} from '../../../shared/utils';
import "./styles.scss"; 
class BillPaymentSuccess extends React.Component{
    constructor(props) {
        super(props);
        let getExistingInfo = this.props.makeCustomerPaymentForBillReducer;
        let getExistingInfo2 = this.props.validateCustomerForBillPaymentReducer;
        this.state={
            psbuser:JSON.parse(localStorage.getItem('psb-auth')),
            existingCustomerInfo: (Object.keys(getExistingInfo).length >= 1 && getExistingInfo.request_status === paymentsConstants.PAY_FOR_BILL_SUCCESS)
                        ? getExistingInfo.request_data.response : '',
            existingCustomerInfo2: (Object.keys(getExistingInfo2).length >= 1 && getExistingInfo2.request_status === paymentsConstants.VALIDATE_CUSTOMER_FOR_BILL_SUCCESS)
                    ? getExistingInfo2.request_data.response : '',
        }
   
        if(this.state.existingCustomerInfo==="" || this.state.existingCustomerInfo2===""){
            history.push("/app/pay-bills")
        }
    }

    componentDidMount(){

    }


    clearRecords = ()=>{
        const {dispatch} = this.props;
       
        dispatch(paymentActions.makeCustomerPaymentForBill("CLEAR"));
        // dispatch(paymentActions.saveAirtimeRecipientData("CLEAR"));
       
    }

    renderPageWrap = () =>{
        let 
          {existingCustomerInfo,
            existingCustomerInfo2,
            psbuser,
            payload} = this.state;
        return(
            <div className="each-section mt-80 res-mt-45">
                <div className="twosided nomargin">
                    <div>
                        <div className="page-section-mainheading app-panel">
                            <div className="border-lines"><span></span><span></span><span></span></div>
                            <h3 className="centered">{existingCustomerInfo2.requestPayload.billerInfo} Success</h3>
                        </div>
                        
                        <div className="dashboard-section">
                            <div className="app-panel inpage centered">
                                <img className="done-icon" src={Done} alt="" />
                                <h3>Bill Payment Successful</h3>
                                <div className="panel-helptext mt-20 centered m-auto pt-20">
                                    Hi {psbuser.firstName}
                                </div>
                                <div className="panel-helptext mt-20 centered m-auto pt-20">
                                    {/* Your payment of &#8358;{existingCustomerInfo2.requestPayload.amount} from your wallet {existingCustomerInfo2.requestPayload.walletNumber}  to {existingCustomerInfo2.requestPayload.billerName} for {existingCustomerInfo2.requestPayload.selectedBouquetName} was successful. */}
                                    Your payment of &#8358;{existingCustomerInfo2.requestPayload.amount} from your wallet {existingCustomerInfo2.requestPayload.walletNumber}  for {existingCustomerInfo2.requestPayload.selectedBouquetName} was successful.
                                </div>
                                <div className="panel-helptext mt-20 centered m-auto pt-20">
                                    An SMS has been sent  you  with details.
                                </div>
                                <div className="panel-helptext mt-20 centered m-auto pt-20">
                                    Thank you for using 9PSB.
                                </div>
                            </div>
                            <div className="app-panel inpage">
                                <div className="footer-with-cta toleft m-0 ">
                                    <Button variant="secondary"
                                        type="submit"
                                       
                                        className=" onboarding-btn"
                                        onClick={()=>{
                                            this.clearRecords()
                                            history.push("/app/dashboard")
                                        }}
                                    > Done
                                        
                                    </Button>

                                </div>
                            </div>
                        </div>
                    </div>
                    <DownloadApp/>
                    
                </div>
            </div>
        )
    }

    
    



    

  
    


    render() {
        
        let{existingCustomerInfo, existingCustomerInfo2}= this.state;
        return (
            <Fragment>
                <Helmet>
                <title>9PSB - Pay for {existingCustomerInfo2.requestPayload.billerName}</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>{existingCustomerInfo2.requestPayload.billerName}</h3>
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

export default connect(mapStateToProps)(BillPaymentSuccess);