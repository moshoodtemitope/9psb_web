import * as React from 'react';
import { Link} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";


import {history} from '../../../../_helpers/history'

import Button from 'react-bootstrap/Button'
import { Helmet } from 'react-helmet';

import Form from 'react-bootstrap/Form';
import  InAppContainer from '../../../../shared/templates/inapp-container'
import  DownloadApp from '../../../../shared/elements/downloadapp-box'

import Done from '../../../../assets/images/done.svg';
import { paymentActions } from '../../../../redux/actions/payments/payments';
import { paymentsConstants } from '../../../../redux/actiontypes/payments/payments.constants';
import { numberWithCommas} from '../../../../shared/utils';
import "../styles.scss"; 
class CashWithdrawalLocations extends React.Component{
    constructor(props) {
        super(props);
        let getExistingInfo = this.props.AgentWithdrawalStep2Reducer;
        let getExistingInfo2 = this.props.GetAgentsReducer;
        this.state={
            user:"",
            existingCustomerInfo: (Object.keys(getExistingInfo).length >= 1 && getExistingInfo.request_status === paymentsConstants.AGENT_WITHDRAWAL_STEP2_SUCCESS)
                        ? getExistingInfo.request_data.response : '',
            existingCustomerInfo2: (Object.keys(getExistingInfo2).length >= 1 && getExistingInfo2.request_status === paymentsConstants.GET_AGENTS_SUCCESS)
                        ? getExistingInfo2.request_data.response : '',
            
        }
   
        if(this.state.existingCustomerInfo==="" || this.state.existingCustomerInfo2===""){
            history.push("/app/cash-withdrawal/agents")
        }
    }

    componentDidMount(){

    }

    

    

    renderPageWrap = () =>{
        let 
          {existingCustomerInfo,existingCustomerInfo2} = this.state;

          let allAgents = [];
          existingCustomerInfo2.map((eachAgent)=>{
            allAgents.push({
                agentName:eachAgent.agentName,
                agentAddress:eachAgent.agentAddress
            })
          })
          
        return(
            <div className="each-section mt-80 res-mt-45">
                <div className="twosided nomargin">
                    <div>
                        <div className="page-section-mainheading app-panel">
                            <div className="border-lines"><span></span><span></span><span></span></div>
                            <h3>Find a 9PSB agent near you</h3>
                        </div>
                        
                        
                        <div className="dashboard-section">
                            <div className="app-panel inpage centered">
                                <img className="done-icon" src={Done} alt=""/>
                                <h3>Your withdrawal code is <span className="green-blocked-text">{existingCustomerInfo.code}</span> </h3>
                                <div className="panel-helptext mt-20 mh-auto">
                                Please visit any of the locations below to make your withdrawal.
                                Kindly reference your withdrawal code.
                                </div>
                            </div>
                            <div className="app-panel inpage nopadding">
                                <h4 className="result-heading">Our Locations near you</h4>
                                {
                                    allAgents.length>=1 &&
                                    <div className="all-locations pb-30">
                                        {
                                            allAgents.map((eachAgent, index)=>{
                                                return(
                                                    <div key={index} className="eachresult">
                                                     {eachAgent.agentName}, {eachAgent.agentAddress}
                                                </div>
                                                )
                                            })
                                        }
                                    </div>
                                }
                                { allAgents.length===0 &&
                                    <div className="all-locations pb-30">
                                        <div className="eachresult">
                                            No agents in the selected area
                                        </div>

                                    </div>
                                }

                            </div>
                            <div className="app-panel inpage">
                                <div className="footer-with-cta toleft m-0 ">
                                    <Button variant="secondary"
                                        type="button"
                                        onClick={()=>history.goBack()}
                                        className="ml-0 onboarding-btn light"
                                    > Back
                                    
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
                    <title>9PSB - Cash Withdrawal locations</title>
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
        GetAgentsReducer: state.paymentsReducers.GetAgentsReducer,
    };
}

export default connect(mapStateToProps)(CashWithdrawalLocations);