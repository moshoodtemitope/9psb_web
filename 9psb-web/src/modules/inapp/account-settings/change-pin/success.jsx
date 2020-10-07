import * as React from 'react';
import { Link, NavLink} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';

import { Helmet } from 'react-helmet';
import {history} from '../../../../_helpers/history'
import Alert from 'react-bootstrap/Alert';
import Select from 'react-select';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import  InAppContainer from '../../../../shared/templates/inapp-container'
import  DownloadApp from '../../../../shared/elements/downloadapp-box'
import Done from '../../../../assets/images/done.svg';


import {onboardingConstants} from '../../../../redux/actiontypes/onboarding/onboarding.constants'
import {onboardingActions} from '../../../../redux/actions/onboarding/onboarding';

import "../styles.scss"; 
class PinChangeSuccess extends React.Component{
    constructor(props) {
        super(props);
        let getExistingInfo = this.props.ChangeTransactionPinReducer;
        this.state={
            
            existingCustomerInfo: (Object.keys(getExistingInfo).length >= 1
                        && getExistingInfo.request_status === onboardingConstants.CHANGE_PIN_SUCCESS)
                        ? getExistingInfo.request_data.response : '',
            
        }
   
        if(this.state.existingCustomerInfo===""){
            history.push("/app/account-settings")
        }
    }

    componentDidMount(){

    }


    clearRecords = ()=>{
        const {dispatch} = this.props;
       
        dispatch(onboardingActions.ChangePin("CLEAR"));
        // dispatch(paymentActions.saveAirtimeRecipientData("CLEAR"));
       
    }

    renderPageWrap = () =>{
        
        return(
            <div className="each-section mt-80 res-mt-45">
                <div className="twosided nomargin">
                    <div>
                        <div className="page-section-mainheading app-panel">
                            <div className="border-lines"><span></span><span></span><span></span></div>
                            <h3>Successful</h3>
                        </div>
                        
                        <div className="dashboard-section">
                            <div className="app-panel inpage centered">
                                <img className="done-icon" src={Done} alt="" />
                                <h3 className="centered">PIN Change Successful</h3>
                                
                               
                                <div className="panel-helptext mt-20 centered m-auto pt-20">
                                    You have successfully changed your transaction pin
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
                    <title>9PSB - Change Pin success</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Change PIN</h3>
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
        ChangeTransactionPinReducer : state.onboardingReducers.ChangeTransactionPinReducer,
    };
}

export default connect(mapStateToProps)(PinChangeSuccess);