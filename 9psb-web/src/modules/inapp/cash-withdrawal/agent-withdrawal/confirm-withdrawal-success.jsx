import * as React from 'react';
import { Link, NavLink} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";



import {history} from '../../../../_helpers/history'
import { Helmet } from 'react-helmet';
import Button from 'react-bootstrap/Button'

import LeftCaret from '../../../../assets/images/left-caret.svg';
import  InAppContainer from '../../../../shared/templates/inapp-container'
import  DownloadApp from '../../../../shared/elements/downloadapp-box'
import Done from '../../../../assets/images/done.svg';
import { paymentActions } from '../../../../redux/actions/payments/payments';
import { paymentsConstants } from '../../../../redux/actiontypes/payments/payments.constants';
import { numberWithCommas, getDateFromISO} from '../../../../shared/utils';
import "../styles.scss"; 
class ConfirmAgentWithdrawalSuccess extends React.Component{
    constructor(props) {
        super(props);
        let getExistingInfo = this.props.AgentWithdrawalStep2Reducer;
        this.state={
            psbuser:JSON.parse(localStorage.getItem('psb-auth')),
            existingCustomerInfo: (Object.keys(getExistingInfo).length >= 1 && getExistingInfo.request_status === paymentsConstants.AGENT_WITHDRAWAL_STEP2_SUCCESS)
            ? getExistingInfo.request_data.response : '',
            
        }
   
        if(this.state.existingCustomerInfo===""){
            history.push("/app/cash-withdrawal/agents")
        }
    }

    componentDidMount(){

    }

    clearRecords = ()=>{
        const {dispatch} = this.props;
       
        dispatch(paymentActions.AgentWithdrawalStep2("CLEAR"));
        // dispatch(paymentActions.saveAirtimeRecipientData("CLEAR"));
       
    }


    

    renderPageWrap = () =>{
        let 
        {existingCustomerInfo,
          psbuser,
          } = this.state;
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
                                <h3 className="centered">Request completed</h3>
                            </div>
                        </div>
                        
                        <div className="dashboard-section">
                            <div className="app-panel inpage centered">
                                <img className="done-icon" src={Done} alt="" />
                                <h3>Your withdrawal code is <span className="green-blocked-text">{existingCustomerInfo.code}</span> </h3>
                                
                                <div className="panel-helptext mt-20 centered m-auto pt-20">
                                    Hi {psbuser.firstName}
                                </div>
                                <div className="panel-helptext mt-20 centered m-auto pt-20">
                                    Hi Seyi
                                </div>
                                <div className="panel-helptext mt-20 centered m-auto pt-20">
                                    Your agent withdrawal code is {existingCustomerInfo.code}. Please visit any of our agent locations &amp; handover the code to the agent to get cash.
                                </div>
                                <div className="panel-helptext mt-20 centered m-auto pt-20">
                                    Your withdrawal code expires {getDateFromISO(existingCustomerInfo.codeExpiry)}
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
                                        type="button"
                                        // disabled={CreateAccountStep1Request.is_request_processing}
                                        className=" onboarding-btn"
                                        onClick={()=>{
                                            // this.clearRecords()
                                            history.push('/app/cash-withdrawal/agents/findagent')
                                        }}
                                    > See agents locations 
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
                    <title>9PSB - Cash Withdrawal success</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Cash Withdrawal from Agent</h3>
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
        AgentWithdrawalStep2Reducer: state.paymentsReducers.AgentWithdrawalStep2Reducer,
    };
}

export default connect(mapStateToProps)(ConfirmAgentWithdrawalSuccess);