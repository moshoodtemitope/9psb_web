import * as React from 'react';

import { connect } from 'react-redux';
import {Fragment} from "react";


import {history} from '../../../../_helpers/history'
import { Helmet } from 'react-helmet';

import Button from 'react-bootstrap/Button'


import  InAppContainer from '../../../../shared/templates/inapp-container'
import  DownloadApp from '../../../../shared/elements/downloadapp-box'
import {paymentActions} from '../../../../redux/actions/payments/payments';
import {paymentsConstants} from '../../../../redux/actiontypes/payments/payments.constants';
import Done from '../../../../assets/images/done.svg';
import { numberWithCommas} from '../../../../shared/utils';
import "../styles.scss"; 
class TransferToBankSuccess extends React.Component{
    constructor(props) {
        super(props);
        let getExistingInfo = this.props.saveRecipientInfoReducer;
        let getTransferInfo = this.props.TranferToBankAccountReducer;
        this.state={
            psbuser:JSON.parse(localStorage.getItem('psb-auth')),
            screenWidthSize: window.innerWidth,
            existingCustomerInfo: (Object.keys(getExistingInfo).length>=1 
                                        && getExistingInfo.request_status === paymentsConstants.STORE_RECIPIENT_DATA)
                                    ? getExistingInfo.request_data.customerData: '' ,
            transferInfo: (Object.keys(getTransferInfo).length >= 1
                && getTransferInfo.request_status === paymentsConstants.TRANSFER_TO_BANK_SUCCESS)
                ? getTransferInfo.request_data.response: '',
        }

       

        if(this.state.transferInfo===""){
            history.push("/app/transfer/to-bank")
        }
    }

    componentDidMount(){

    }

    clearRecords = ()=>{
        const {dispatch} = this.props;
        dispatch(paymentActions.saveRecipientData("CLEAR"))
         dispatch(paymentActions.confirmBeneficiary("CLEAR"))
        dispatch(paymentActions.TranferToBankAccount("CLEAR"));
    }

    

    renderPageWrap = () =>{
        let {transferInfo,psbuser}= this.state;
        return(
            <div className="each-section mt-80 res-mt-45">
                <div className="twosided nomargin">
                    <div>
                        <div className="page-section-mainheading app-panel">
                            <div className="border-lines"><span></span><span></span><span></span></div>
                            <h3 className="centered">Transfer Success</h3>
                        </div>
                        
                        <div className="dashboard-section">
                            <div className="app-panel inpage centered">
                                <img className="done-icon" src={Done} alt="" />
                                <h3>Transfer Succesful</h3>
                                <div className="panel-helptext mt-20 centered m-auto pt-20">
                                    Hi {psbuser.firstName}
                                </div>
                                <div className="panel-helptext mt-20 centered m-auto pt-20">
                                    Your transfer of &#8358;{numberWithCommas(transferInfo.main.amount, true)}  from your account({transferInfo.main.sourceAccountNumber}) to {transferInfo.otherInfo.displayName}, {transferInfo.otherInfo.bankName}, Account-{transferInfo.main.accountNumber} was successful. 
                                </div>
                                <div className="panel-helptext mt-20 centered m-auto pt-20">
                                    An SMS has been sent  to recipient with details.
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
                    <title>9PSB - Transfer to bank | success</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Transfer to bank account</h3>
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
        saveRecipientInfoReducer : state.paymentsReducers.saveRecipientInfoReducer,
        TranferToBankAccountReducer : state.paymentsReducers.TranferToBankAccountReducer,
    };
}

export default connect(mapStateToProps)(TransferToBankSuccess);