import * as React from 'react';

import { connect } from 'react-redux';
import {Fragment} from "react";




import {history} from '../../../../_helpers/history'

import Button from 'react-bootstrap/Button'
import { Helmet } from 'react-helmet';
import  InAppContainer from '../../../../shared/templates/inapp-container'
import  DownloadApp from '../../../../shared/elements/downloadapp-box'
import Done from '../../../../assets/images/done.svg';


import {onboardingConstants} from '../../../../redux/actiontypes/onboarding/onboarding.constants'
import {onboardingActions} from '../../../../redux/actions/onboarding/onboarding';

import "../styles.scss"; 
class PinResetSuccess extends React.Component{
    constructor(props) {
        super(props);
        let getExistingInfo = this.props.CompletePinResetReducer;
        this.state={
            
            existingCustomerInfo: (Object.keys(getExistingInfo).length >= 1
                        && getExistingInfo.request_status === onboardingConstants.COMPLETE_PIN_RESET_SUCCESS)
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
       
        dispatch(onboardingActions.ChangePassword("CLEAR"));
        // dispatch(paymentActions.saveAirtimeRecipientData("CLEAR"));
       
    }

    renderPageWrap = () =>{
        
        return(
            <div className="each-section mt-80 res-mt-45">
                <div className="twosided nomargin">
                    <div>
                        <div className="page-section-mainheading app-panel">
                            <div className="border-lines"><span></span><span></span><span></span></div>
                            <h3 className="centered">Successful</h3>
                        </div>
                        
                        <div className="dashboard-section">
                            <div className="app-panel inpage centered">
                                <img className="done-icon" src={Done} alt="" />
                                <h3>Pin Change Successful</h3>
                                
                               
                                <div className="panel-helptext mt-20 centered m-auto pt-20">
                                    You have successfully changed your transaction PIN
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
                <title>9PSB - Reset PIN succcess</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Reset PIN</h3>
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
        CompletePinResetReducer : state.onboardingReducers.CompletePinResetReducer,
    };
}

export default connect(mapStateToProps)(PinResetSuccess);