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

class CreateSavingsSuccess extends React.Component{
    constructor(props) {
        super(props);
        let getExistingInfo = this.props.CreateSavingsReducer;
        this.state={
            psbuser:JSON.parse(localStorage.getItem('psb-auth')),
            existingCustomerInfo: (Object.keys(getExistingInfo).length >= 1
                        && getExistingInfo.request_status === paymentsConstants.CREATE_SAVINGS_SUCCESS)
                        ? getExistingInfo.request_data.response : '',
        }

        if(this.state.existingCustomerInfo===""){
            history.push("/app/dashboard")
        }
   
        
    }

    componentDidMount(){

    }

    clearRecords = ()=>{
        const {dispatch} = this.props;
        dispatch(paymentActions.CreateSavings("CLEAR"));
    }

    
    renderPageWrap = () =>{
        let 
        {
            existingCustomerInfo,
            psbuser,
            } = this.state;
        let successDetails;
            
            console.log("lelele", `1-${existingCustomerInfo}`)
            
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
                                <h2 className="fz-20">Savings added and locked succesfully</h2>
                                <div className="panel-helptext mt-20 centered m-auto pt-20">
                                    Hi {psbuser.firstName}
                                </div>
                                {(existingCustomerInfo.message!==null && existingCustomerInfo.message!==undefined && existingCustomerInfo.message!=="") &&
                                    <div className="panel-helptext mt-20 centered m-auto pt-20">
                                        {existingCustomerInfo.message}
                                    </div>
                                }
                                {(existingCustomerInfo.message===null || existingCustomerInfo.message===undefined || existingCustomerInfo.message==="") &&
                                    <div className="panel-helptext mt-20 centered m-auto pt-20">
                                        Your savings has been created and locked for {existingCustomerInfo.days} days with interest rate of {existingCustomerInfo.interestRate}%.
                                    </div>
                                }
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
                    <title>9PSB - Savings</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Add Savings</h3>
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
        CreateSavingsReducer : state.paymentsReducers.CreateSavingsReducer,
    };
}

export default connect(mapStateToProps)(CreateSavingsSuccess);