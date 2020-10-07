import * as React from 'react';

import { connect } from 'react-redux';
import {Fragment} from "react";




import {history} from '../../../_helpers/history'

import Button from 'react-bootstrap/Button'

import { Helmet } from 'react-helmet';
import  InAppContainer from '../../../shared/templates/inapp-container'
import  DownloadApp from '../../../shared/elements/downloadapp-box'
import Done from '../../../assets/images/done.svg';
import {paymentActions} from '../../../redux/actions/payments/payments';
import {paymentsConstants} from '../../../redux/actiontypes/payments/payments.constants';
import { numberWithCommas} from '../../../shared/utils';
import "./styles.scss"; 
class AirtimePurchaseSuccess extends React.Component{
    constructor(props) {
        super(props);
        let getExistingInfo = this.props.saveAirtimeRecipientDataReducer;
        let getTxtStatus = this.props.AirtimeTopUpReducer;
        this.state={
            psbuser:JSON.parse(localStorage.getItem('psb-auth')),
            existingCustomerInfo: (Object.keys(getExistingInfo).length >= 1
            && getExistingInfo.request_status === paymentsConstants.STORE_AIRTIME_RECIPIENT_DATA
            && getTxtStatus.request_status === paymentsConstants.BUY_AIRTIME_SUCCESS
            && (getExistingInfo.request_data.source===undefined || getExistingInfo.request_data.source===null))
            ? getExistingInfo.request_data.customerData : '',
        }
   
        if(this.state.existingCustomerInfo===""){
            history.push("/app/buy-airtime/others/choose")
        }
    }

    componentDidMount(){

    }


    clearRecords = ()=>{
        const {dispatch} = this.props;
       
        dispatch(paymentActions.AirtimeTopUp("CLEAR"));
        // dispatch(paymentActions.saveAirtimeRecipientData("CLEAR"));
       
    }

    renderPageWrap = () =>{
        let 
          {existingCustomerInfo,
            psbuser,
            payload} = this.state;

            
        return(
            <div className="each-section mt-80 res-mt-45">
                <div className="twosided nomargin">
                    <div>
                        <div className="page-section-mainheading app-panel">
                            <div className="border-lines"><span></span><span></span><span></span></div>
                            <h3 className="centered">Airtime Top-up Success</h3>
                        </div>
                        
                        <div className="dashboard-section">
                            <div className="app-panel inpage centered">
                                <img className="done-icon" src={Done} alt="" />
                                <h3>Airtime Top Up Successful</h3>
                                <div className="panel-helptext mt-20 centered m-auto pt-20">
                                    Hi {psbuser.firstName}
                                </div>
                                <div className="panel-helptext mt-20 centered m-auto pt-20">
                                    Your airtime purchase of &#8358;{numberWithCommas(existingCustomerInfo.amount, true)} was successful. 
                                </div>
                                <div className="panel-helptext mt-20 centered m-auto pt-20">
                                    An SMS has been sent to you with details.
                                </div>
                                <div className="panel-helptext mt-20 centered m-auto pt-20">
                                    Thank you for using 9PSB.
                                </div>
                            </div>
                            <div className="app-panel inpage">
                                <div className="footer-with-cta toleft m-0 ">
                                    <Button variant="secondary"
                                        type="submit"
                                        // disabled={CreateAccountStep1Request.is_request_processing}
                                        className=" onboarding-btn"
                                        onClick={()=>{
                                            this.clearRecords()
                                            history.push("/app/dashboard")
                                        }}
                                    > Done
                                        {/* {CreateAccountStep1Request.is_request_processing?'Please wait...' :'Continue'} */}
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
        
        
        return (
            <Fragment>
                <Helmet>
                    <title>9PSB - Airtime Top Up success</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Self Airtime Top Up</h3>
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

export default connect(mapStateToProps)(AirtimePurchaseSuccess);