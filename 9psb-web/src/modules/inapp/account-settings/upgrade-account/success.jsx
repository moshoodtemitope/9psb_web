import * as React from 'react';
import { Link, NavLink} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';


import {history} from '../../../../_helpers/history'

import Button from 'react-bootstrap/Button'
import  InAppContainer from '../../../../shared/templates/inapp-container'
import  DownloadApp from '../../../../shared/elements/downloadapp-box'
import { Helmet } from 'react-helmet';
import Done from '../../../../assets/images/done.svg';
import {paymentActions} from '../../../../redux/actions/payments/payments';
import {paymentsConstants} from '../../../../redux/actiontypes/payments/payments.constants';

import {onboardingActions} from '../../../../redux/actions/onboarding/onboarding';
import {onboardingConstants} from '../../../../redux/actiontypes/onboarding/onboarding.constants';
import { numberWithCommas, getDataPlanNameCode} from '../../../../shared/utils';

class AccountUpgradeSuccess extends React.Component{
    constructor(props) {
        super(props);
        let getExistingInfo = this.props.UpgradeValidateOtpReducer,
            getExistingInfo2 = this.props.UpgradeSendDetailsReducer;
        this.state={
            psbuser:JSON.parse(localStorage.getItem('psb-auth')),
            existingCustomerInfo: (Object.keys(getExistingInfo).length >= 1
                        && getExistingInfo.request_status === onboardingConstants.UPGRADE_VALIDATE_OTP_SUCCESS)
                        ? getExistingInfo.request_data.response : '',
            existingCustomerInfo2: (Object.keys(getExistingInfo2).length >= 1
                && getExistingInfo2.request_status === onboardingConstants.UPGRADE_SEND_DETAILS_SUCCESS)
                ? getExistingInfo2.request_data.response : '',
        }

        if(this.state.existingCustomerInfo==="" &&  this.state.existingCustomerInfo2===""){
            history.push("/app/dashboard")
        }else{
            if(this.state.existingCustomerInfo.hashFromSentDetails==="" && this.state.existingCustomerInfo2.requestTrackingId===""){
                history.push("/app/dashboard")
            }
        }
   
        
    }

    componentDidMount(){

    }

    clearRecords = ()=>{
        const {dispatch} = this.props;
        dispatch(onboardingActions.UpgradeFetchDetails("CLEAR"));
        dispatch(onboardingActions.UpgradeSendDetails("CLEAR"));
        dispatch(onboardingActions.UpgradeValidateOtp("CLEAR"));
        dispatch(onboardingActions.UpgradeValidateOtp("CLEAR"));
    }

    
    renderPageWrap = () =>{
        let 
        {
            existingCustomerInfo,
            existingCustomerInfo2,
            psbuser,
            } = this.state;
        let successDetails;
            if(existingCustomerInfo!==""){
                successDetails =existingCustomerInfo;
            }
            if(existingCustomerInfo2!==""){
                successDetails =existingCustomerInfo2;
            }

            
            
        return(
            <div className="each-section mt-80 res-mt-45">
                <div className="twosided nomargin">
                    <div>
                        <div className="page-section-mainheading app-panel">
                            <div className="border-lines"><span></span><span></span><span></span></div>
                            <h3 className="centered">Success</h3>
                        </div>
                        
                        <div className="dashboard-section">
                            <div className="app-panel inpage centered">
                                <img className="done-icon" src={Done} alt="" />
                                <h2>Account upgrade successful</h2>
                                <div className="panel-helptext mt-20 centered m-auto pt-20">
                                    Hi {psbuser.firstName}
                                </div>
                                <div className="panel-helptext mt-20 centered m-auto pt-20">
                                Your total transaction limit has been increased to &#x20A6;{numberWithCommas(successDetails.transactionLimit, true)} and your balance limit to &#x20A6;{numberWithCommas(successDetails.balanceLimit, true)} . 
                                </div>
                                {/* <div className="panel-helptext mt-20 centered m-auto pt-20">
                                    An SMS has been sent to you with details.
                                </div> */}
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
                                            }
                                        }
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
        
        
        return (
            <Fragment>
                <Helmet>
                    <title>9PSB - Upgrade account | Success</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Account Upgrade</h3>
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
        UpgradeValidateOtpReducer : state.onboardingReducers.UpgradeValidateOtpReducer,
        UpgradeSendDetailsReducer : state.onboardingReducers.UpgradeSendDetailsReducer,
    };
}

export default connect(mapStateToProps)(AccountUpgradeSuccess);