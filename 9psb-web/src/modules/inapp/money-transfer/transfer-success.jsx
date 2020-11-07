import * as React from 'react';

import { connect } from 'react-redux';
import {Fragment} from "react";

import { Helmet } from 'react-helmet';
import {history} from '../../../_helpers/history'

import Button from 'react-bootstrap/Button'


import  InAppContainer from '../../../shared/templates/inapp-container'
import  DownloadApp from '../../../shared/elements/downloadapp-box'
import {paymentActions} from '../../../redux/actions/payments/payments';
import {paymentsConstants} from '../../../redux/actiontypes/payments/payments.constants';
import Done from '../../../assets/images/done.svg';
import { numberWithCommas} from '../../../shared/utils';
import "./styles.scss"; 
class TransferToPhoneSuccess extends React.Component{
    constructor(props) {
        super(props);
        let getExistingInfo = this.props.TransferMoneyToPhoneNumberReducer;
        this.state={
            psbuser:JSON.parse(localStorage.getItem('psb-auth')),
            screenWidthSize: window.innerWidth,
            existingCustomerInfo: (Object.keys(getExistingInfo).length>=1 
                                        && getExistingInfo.request_status === paymentsConstants.TRANSFER_TO_PHONE_NUMBER_SUCCESS)
                                    ? getExistingInfo.request_data.response: '' ,
        }



       

        if(this.state.existingCustomerInfo===""){
            history.push("/app/transfer")
        }
    }

    componentDidMount(){

    }


    clearRecords = ()=>{
        const {dispatch} = this.props;
        dispatch(paymentActions.TranferToPhoneNumber("CLEAR"));
    }
    

    renderDeposit = ()=>{

        return(
            <div className="form-wrap">

            </div>
        )
    }

    renderPageWrap = () =>{
        let
            {existingCustomerInfo,
                psbuser
            } = this.state;
        return(
            <div className="each-section mt-80 res-mt-45">
                <div className="twosided nomargin">
                    <div>
                        <div className="page-section-mainheading app-panel">
                            <div className="border-lines"><span></span><span></span><span></span></div>
                            <h3>Transfer Success</h3>
                        </div>
                        
                        <div className="dashboard-section">
                            <div className="app-panel inpage centered">
                                <img className="done-icon" src={Done} alt="" />
                                <h3 className="centered">Transfer Successful</h3>
                                <div className="panel-helptext mt-20 centered m-auto pt-20">
                                    Hi {psbuser.firstName}
                                </div>
                                <div className="panel-helptext mt-20 centered m-auto pt-20">
                                    Your transfer of &#8358;{existingCustomerInfo.amount} to {existingCustomerInfo.toMobileNumber} was successful. 
                                </div>
                                <div className="panel-helptext mt-20 centered m-auto pt-20">
                                    An SMS has been sent  you &amp; the recipient with details.
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
                                            this.clearRecords();
                                            history.push("/app/transfer")
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
                    <title>9PSB -Transfer to Phone | success</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Transfer to Phone</h3>
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
        TransferMoneyToPhoneNumberReducer : state.paymentsReducers.TransferMoneyToPhoneNumberReducer,
    };
}

export default connect(mapStateToProps)(TransferToPhoneSuccess);