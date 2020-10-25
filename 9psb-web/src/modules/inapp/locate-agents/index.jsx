import * as React from 'react';
import { Link} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';

import { Helmet } from 'react-helmet';

import {history} from '../../../_helpers/history'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Formik } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import  InAppContainer from '../../../shared/templates/inapp-container'
import  ErrorMessage from '../../../shared/elements/errormessage'
import  DownloadApp from '../../../shared/elements/downloadapp-box'

import  SelectStateAndLga from '../../../shared/elements/state-and-lga-select'
import { numberWithCommas, allowNumbersOnly} from '../../../shared/utils';
import {encryptAnItem, createTransactionSigner} from '../../../shared/shared-utils/index';
import {accountActions} from '../../../redux/actions/dashboard/dashboard';
import {dashboardConstants} from '../../../redux/actiontypes/dashboard/dashboard.constants';
import "./styles.scss"; 
class LocateAgents extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            user:"",
            screenWidthSize: window.innerWidth,
            showSiderBar: window.innerWidth>=1024?true:false,
            isLGaError:false,
            isStateError:false,
            stateChosen:"",
            lgaChosen:"",
            
        }
   
        window.addEventListener("resize", ()=>
                this.setState({screenWidthSize: window.innerWidth,
                                showSiderBar: window.innerWidth>=1024?true:false
                }));
    }

    componentDidMount(){
        this.clearRecords()
    }


    clearRecords = ()=>{
        const {dispatch} = this.props;
        dispatch(accountActions.LocateAnAgent("CLEAR"));

        // console.log("Signed is", createTransactionSigner())
        // encryptAnItem.createTransactionSigner();
    }

    
    

    LocateAnAgent = (agentPayload)=>{

        const {dispatch} = this.props;
         dispatch(accountActions.LocateAnAgent(agentPayload));
        
    }
    
    handleSelectState = (e) => {
        
        
        
        this.setState({ stateChosen: e.stateId, isStateError:false })
    }

    handleSelectLGA = (e) => {
        
        
        this.setState({ lgaChosen: e, isLGaError:false })
    }

    renderPageWrap = () =>{
        const { 
                isLGaError,
                stateChosen,
                lgaChosen,
                payload,
                isStateError} = this.state;

        let validationSchema = Yup.object().shape({
            
        });    
        let LocateAnAgentRequest = this.props.LocateAnAgentReducer
        
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
                                    // transactionPin:"",
                                   
                                }}

                                validationSchema={validationSchema}
                                onSubmit={(values, { resetForm }) => {
                                    let payload ={};
                                    
                                    if(lgaChosen===""){
                                        // payload.lgaCode = "";
                                        this.setState({isLGaError:true})
                                    }

                                    if(stateChosen===""){
                                        // payload.stateCode = "";
                                        this.setState({isStateError:true})
                                    }
                                   

                                    
                                    if(stateChosen!=="" && lgaChosen!==""){

                                        

                                        payload.stateCode = stateChosen;
                                        payload.lgaCode = lgaChosen;

                                        this.setState({payload})
                                       
                                        this.LocateAnAgent(payload)

                                       
                                        

                                        
                                    }

                                    

                                    


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
                                            <div className="app-panel inpage">
                                                <div className="panel-helptext">
                                                    Enter your current location details to locate our agents closest to you.
                                                </div>
                                                <div className="form-wrap w-70 mt-40 m-auto pt-20 m-100">
                                                    
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
                                            {LocateAnAgentRequest.request_status ===dashboardConstants.LOCATE_AGENTS_FAILURE && 
                                                
                                                <ErrorMessage errorMessage={LocateAnAgentRequest.request_data.error} canRetry={true} retryFunc={()=>this.handleDeposit(payload)} />
                                            
                                            }

                                            <div className="app-panel inpage">
                                                <div className="footer-with-cta toleft m-0 ">
                                                    <Button variant="secondary"
                                                        type="submit"
                                                        disabled={LocateAnAgentRequest.is_request_processing}
                                                        className="ml-0 onboarding-btn"
                                                    >
                                                        
                                                     {LocateAnAgentRequest.is_request_processing?'Please wait...' :'Continue'}
                                                    </Button>

                                                </div>
                                            </div>

                                            
                                            
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
                    <title>9PSB - Locate Agents</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Locate an Agent</h3>
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
        LocateAnAgentReducer : state.accountsReducers.LocateAnAgentReducer,
    };
}

export default connect(mapStateToProps)(LocateAgents);