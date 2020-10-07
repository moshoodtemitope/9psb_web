import * as React from 'react';
import { Link, NavLink} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';


import {history} from '../../../_helpers/history'

import Button from 'react-bootstrap/Button'
import  InAppContainer from '../../../shared/templates/inapp-container'
import  DownloadApp from '../../../shared/elements/downloadapp-box'
import { Helmet } from 'react-helmet';
import Done from '../../../assets/images/done.svg';
import {paymentActions} from '../../../redux/actions/payments/payments';
import {paymentsConstants} from '../../../redux/actiontypes/payments/payments.constants';
import { numberWithCommas, getDataPlanNameCode} from '../../../shared/utils';
import "./styles.scss"; 
class DataTopUpSuccess extends React.Component{
    constructor(props) {
        super(props);
        let getExistingInfo = this.props.saveDataTopUpRecipientDataReducer;
        let getTxtStatus = this.props.DataTopUpTopUpReducer;
        let getDataPlans = this.props.GetDataTopUpPlansReducer;
        this.state={
            psbuser:JSON.parse(localStorage.getItem('psb-auth')),
            existingCustomerInfo: (Object.keys(getExistingInfo).length >= 1
                        && getExistingInfo.request_status === paymentsConstants.STORE_DATATOPUP_RECIPIENT_DATA
                        && getTxtStatus.request_status === paymentsConstants.BUY_DATATOPUP_SUCCESS
                        && getExistingInfo.request_data.source===null)
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

    }


    clearRecords = ()=>{
        const {dispatch} = this.props;
       
        dispatch(paymentActions.DataTopUpTopUp("CLEAR"));
        // dispatch(paymentActions.saveAirtimeRecipientData("CLEAR"));
       
    }

    renderPageWrap = () =>{
        let 
        {
            existingCustomerInfo,
            dataPlansInfo,
            psbuser,
            payload} = this.state;
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
                                <h3>Data Top Up Successful</h3>
                                <div className="panel-helptext mt-20 centered m-auto pt-20">
                                    Hi {psbuser.firstName}
                                </div>
                                <div className="panel-helptext mt-20 centered m-auto pt-20">
                                    Your Date purchase of  {getDataPlanNameCode(existingCustomerInfo.amount, existingCustomerInfo.network, dataPlansInfo)} was successful. 
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
                    <title>9PSB - Data Top-up success</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Data Top Up Self</h3>
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

export default connect(mapStateToProps)(DataTopUpSuccess);