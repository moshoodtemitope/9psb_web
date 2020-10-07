import * as React from 'react';

import { connect } from 'react-redux';
import {Fragment} from "react";


import {history} from '../../../_helpers/history'
import Button from 'react-bootstrap/Button'
import { Helmet } from 'react-helmet';
import  InAppContainer from '../../../shared/templates/inapp-container'
import  DownloadApp from '../../../shared/elements/downloadapp-box'

import Done from '../../../assets/images/done.svg';
import { getDateFromISO} from '../../../shared/utils';
import {accountActions} from '../../../redux/actions/dashboard/dashboard';
import {dashboardConstants} from '../../../redux/actiontypes/dashboard/dashboard.constants';
import "./styles.scss"; 
class SuccessFulFundWallet extends React.Component{
    constructor(props) {
        super(props);
        let getExistingInfo = this.props.ChargeACardReducer;
        let getExistingInfo2 = this.props.ValidateACardReducer;
        let getExistingInfo3 = this.props.QueryCardValidationStateReducer;
        this.state={
            psbuser:JSON.parse(localStorage.getItem('psb-auth')),
            existingCustomerInfo: ((Object.keys(getExistingInfo).length>=1 
                                    && getExistingInfo.request_status === dashboardConstants.CHARGE_A_CARD_SUCCESS))
                                    ? getExistingInfo.request_data.response: '' ,
            existingCustomerInfo2: ((Object.keys(getExistingInfo2).length>=1 
                                    && getExistingInfo2.request_status === dashboardConstants.VALIDATE_A_CARD_SUCCESS
                                    && getExistingInfo2.request_data.requestType==="completed"))
                                    ? getExistingInfo2.request_data.response: '' ,
            existingCustomerInfo3: ((Object.keys(getExistingInfo3).length>=1 
                                    && getExistingInfo3.request_status === dashboardConstants.QUERY_CARD_VALIDATIONSTATE_SUCCESS
                                    && getExistingInfo3.request_data.response.responseObject.responseCode==="success"))
                                    ? getExistingInfo3.request_data.response: '' ,
            
        }

        if(this.state.existingCustomerInfo==="" && this.state.existingCustomerInfo2==="" && this.state.existingCustomerInfo3===""){
            history.push("/app/fund-wallet")
        }

       
   
        
    }

    componentDidMount(){
        this.bounceBackToStep();
    }


    clearRecords = ()=>{
        const {dispatch} = this.props;
        dispatch(accountActions.ChargeACard("CLEAR"));
        dispatch(accountActions.ValidateACard("CLEAR"));
        dispatch(accountActions.QueryCardValidationState("CLEAR"));
    }

    bounceBackToStep = ()=>{
        
        let {existingCustomerInfo}= this.state;
        
        if(existingCustomerInfo===""){
                history.push("/app/fund-wallet")
        }
    }

    

    

    renderPageWrap = () =>{
        let 
          {psbuser, existingCustomerInfo} = this.state;
        return(
            <div className="each-section mt-80 res-mt-45">
            <div className="twosided nomargin">
                <div>
                    <div className="page-section-mainheading app-panel">
                        <div className="border-lines"><span></span><span></span><span></span></div>
                        <h3>Fund Wallet</h3>
                    </div>
                    
                    <div className="dashboard-section">
                        <div className="app-panel inpage centered">
                            <img className="done-icon" src={Done} alt="" />
                            <h3 className="centered">Fund Wallet Succesful</h3>
                            <div className="panel-helptext mt-20 centered m-auto pt-20">
                                Hi {psbuser.firstName}
                            </div>
                            <div className="panel-helptext mt-20 centered m-auto pt-20">
                               You have successfully funded your wallet
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
        let {existingCustomerInfo} = this.state
        
        return (
            <Fragment>
                <Helmet>
                    <title>9PSB - Fund Wallet</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Fund Wallet</h3>
                    </div>
                    {existingCustomerInfo!=="" &&
                        this.renderPageWrap()
                    }
                </div>
                </InAppContainer>
            </Fragment>
        );
    }
}



function mapStateToProps(state) {
    return {
        ChargeACardReducer : state.accountsReducers.ChargeACardReducer,
        ValidateACardReducer : state.accountsReducers.ValidateACardReducer,
        QueryCardValidationStateReducer : state.accountsReducers.QueryCardValidationStateReducer,
    };
}

export default connect(mapStateToProps)(SuccessFulFundWallet);