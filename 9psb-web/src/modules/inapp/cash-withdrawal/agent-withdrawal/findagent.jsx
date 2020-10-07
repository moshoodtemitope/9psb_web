import * as React from 'react';
import { Link} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";

import { Helmet } from 'react-helmet';
import {history} from '../../../../_helpers/history'

import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'

import { Formik } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import  InAppContainer from '../../../../shared/templates/inapp-container'
import  DownloadApp from '../../../../shared/elements/downloadapp-box'
import  SelectStateAndLga from '../../../../shared/elements/state-and-lga-select'
import  ErrorMessage from '../../../../shared/elements/errormessage'
import { paymentActions } from '../../../../redux/actions/payments/payments';
import { paymentsConstants } from '../../../../redux/actiontypes/payments/payments.constants';
import { numberWithCommas} from '../../../../shared/utils';
import "../styles.scss"; 
class FindAnAgent extends React.Component{
    constructor(props) {
        super(props);
        let getExistingInfo = this.props.AgentWithdrawalStep2Reducer;
        this.state={
            user:"",
            isLGaError:false,
            isStateError:false,
            existingCustomerInfo: (Object.keys(getExistingInfo).length >= 1 && getExistingInfo.request_status === paymentsConstants.AGENT_WITHDRAWAL_STEP2_SUCCESS)
            ? getExistingInfo.request_data.response : '',
            
        }
   
        if(this.state.existingCustomerInfo===""){
            history.push("/app/cash-withdrawal/agents")
        }
    }

    componentDidMount(){

    }


    handleSelectState = (e) => {
        
        
        
        this.setState({ stateChosen: e.stateId, isStateError:false })
    }

    handleSelectLGA = (e) => {
        
        
        this.setState({ lgaChosen: e, isLGaError:false })
    }

    fetchAgents = (depositPayload)=>{

        const {dispatch} = this.props;
         dispatch(paymentActions.GetAgents(depositPayload));
        
    }

    renderPageWrap = () =>{
        let  {
            isLGaError,
            stateChosen,
            isStateError,
            payload,
            lgaChosen,} = this.state;

        let GetAgentsRequest = this.props.GetAgentsReducer;
        return(
            <div className="each-section mt-80 res-mt-45">
                <div className="twosided nomargin">
                    <div>
                        <div className="page-section-mainheading app-panel">
                            <div className="border-lines"><span></span><span></span><span></span></div>
                            <h3>Find a 9PSB agent near you</h3>
                        </div>
                        
                        <div className="dashboard-section">
                            <Formik
                                initialValues={{

                                }}

                                // validationSchema={loginValidationSchema}
                                onSubmit={(values, { resetForm }) => {

                                    if(lgaChosen===""){
                                        this.setState({isLGaError:true})
                                    }

                                    if(stateChosen===""){
                                        this.setState({isStateError:true})
                                    }

                                    let payload = {
                                        lgaCode:lgaChosen,
                                        stateCode:stateChosen
                                    }
                                    this.setState({payload})

                                   
                                    this.fetchAgents(payload);

                                    // history.push("/app/cash-withdrawal/agents/locations");
                                    


                                }}
                            >
                                {({ handleSubmit,
                                    handleChange,
                                    handleBlur,
                                    resetForm,
                                    setFieldValue,
                                    setFieldTouched,
                                    values,
                                    touched,
                                    isValid,
                                    errors, }) => (
                                        <Form
                                            noValidate
                                            onSubmit={handleSubmit}
                                            className="form-content mt-0">
                                            <div className="app-panel inpage ">
                                                <div className="panel-helptext m-auto w-80 m-100 pb-30">
                                                    Enter your current location details to locate our agents closest to you
                                                    where you can withdraw cash.
                                                </div>
                                                <div className="form-wrap m-auto w-80 mt-40 m-100">
                                                    
                                                    <SelectStateAndLga
                                                        onStateChange={(selected) => {
                                                            this.handleSelectState(selected)
                                                            
                                                        }}
                                                        onLGAChange = {(selected) => {
                                                            this.handleSelectLGA(selected)
                                                            
                                                        }}
                                                        isLGaError={isLGaError}
                                                        isStateError={isStateError}

                                                    />
                                                    
                                                </div>
                                            </div>

                                            

                                            <div className="app-panel inpage">
                                                <div className="footer-with-cta toleft m-0 ">
                                                    {/* <Button variant="secondary"
                                                        type="button"
                                                        // disabled={CreateAccountStep1Request.is_request_processing}
                                                        className="ml-0 onboarding-btn light"
                                                        onClick={()=>history.push("/app/cash-withdrawal/agents/code")}
                                                    > Back
                                                     
                                                    </Button> */}
                                                    <Button variant="secondary"
                                                        type="submit"
                                                        disabled={GetAgentsRequest.is_request_processing}
                                                        className=" onboarding-btn"
                                                    > 
                                                     {GetAgentsRequest.is_request_processing?'Please wait...' :'Continue'}
                                                    </Button>

                                                </div>
                                            </div>
                                            {
                                                GetAgentsRequest.request_status === paymentsConstants.GET_AGENTS_FAILURE &&
                                                
                                                    <ErrorMessage errorMessage={GetAgentsRequest.request_data.error} 
                                                        canRetry={false} 
                                                        retryFunc={() => this.fetchAgents(payload)} />
                                                
                                            }
                                        </Form>
                                    )}
                            </Formik>
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
                    <title>9PSB - Cash Withdrawal |find agent </title>
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

export default connect(mapStateToProps)(FindAnAgent);