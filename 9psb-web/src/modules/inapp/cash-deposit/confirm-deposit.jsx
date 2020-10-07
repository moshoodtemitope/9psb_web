import * as React from 'react';

import { connect } from 'react-redux';
import {Fragment} from "react";



import {history} from '../../../_helpers/history'

import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Formik } from 'formik';
import { Helmet } from 'react-helmet';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import  InAppContainer from '../../../shared/templates/inapp-container'
import  DownloadApp from '../../../shared/elements/downloadapp-box'
import {encryptAnItem} from '../../../shared/shared-utils/index';
import ErrorMessage from '../../../shared/elements/errormessage'

import {dashboardConstants} from '../../../redux/actiontypes/dashboard/dashboard.constants';
import {accountActions} from '../../../redux/actions/dashboard/dashboard';
import LeftCaret from '../../../assets/images/left-caret.svg';
import { numberWithCommas, allowNumbersOnly} from '../../../shared/utils';
import "./styles.scss"; 
class ConfirmCashDeposit extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            psbuser:JSON.parse(localStorage.getItem('psb-auth')),
            
        }
        
        if(this.props.location.state===undefined){
            history.push("/app/cash-deposit")
        }else{
            this.walletNumber  = this.props.location.state.walletNumber;
            this.depositAmount  = this.props.location.state.depositAmount;
            this.lgaCode  = this.props.location.state.lgaCode;
            this.stateCode  = this.props.location.state.stateCode;

            
        }
        
        
    }

    componentDidMount(){
        this.clearRecords()
    }


    clearRecords = ()=>{
        const {dispatch} = this.props;
        dispatch(accountActions.DepositCashWithAgent("CLEAR"));
    }

    
    

    handleDeposit = (depositPayload)=>{

        const {dispatch} = this.props;
         dispatch(accountActions.DepositCashWithAgent(depositPayload));
        
    }



    renderPageWrap = () =>{
        let 
        {psbuser, payload} = this.state;

        let validationSchema = Yup.object().shape({
            txtPin: Yup.string()
                .required('Required'),
            }); 

        let DepositCashWithAgentRequest = this.props.DepositCashWithAgentReducer;
        return(
            <div className="each-section mt-80 res-mt-45">
                <div className="twosided nomargin">
                    <div>
                        <div className="page-section-mainheading app-panel">
                            <div className="border-lines"><span></span><span></span><span></span></div>
                            <div className="subheading-title">
                                <div className="backnav" onClick={()=>{
                                    history.goBack()
                                }}>
                                    <img src={LeftCaret} alt=""/>
                                    <span>Back</span>
                                </div>
                                <h3>Confirm Cash Deposit</h3>
                            </div>
                            
                        </div>
                        
                        <div className="dashboard-section">
                            <Formik
                                initialValues={{
                                    txtPin:"",
                                }}

                                // validationSchema={validationSchema}
                                onSubmit={(values, { resetForm }) => {

                                    let payload = {
                                        walletNumber: this.walletNumber,
                                        depositAmount: this.depositAmount,
                                        lgaCode: this.lgaCode,
                                        stateCode: this.stateCode,
                                        // transactionPin: encryptAnItem(values.txtPin)
                                    }

                                    this.setState({payload})

                                    
                                    this.handleDeposit(payload)


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
                                                
                                                <div className="panel-helptext mt-20 centered m-auto">
                                                Hi {psbuser.firstName}
                                                </div>
                                                <div className="panel-helptext mt-20 centered m-auto pt-20">
                                                    You are about to deposit &#8358;{numberWithCommas(this.depositAmount, true)} to your account number {this.walletNumber} via agent.
                                                </div>
                                               
                                                {/* <div className="form-wrap w-70 mt-40 m-auto pt-20">
                                                   

                                                    <Form.Group className="poppedinput">
                                                        <Form.Label className="block-level">Enter Security PIN</Form.Label>
                                                        <Form.Control type="password"
                                                            name="amountToSend"
                                                            onChange={handleChange}
                                                            value={allowNumbersOnly(values.txtPin, 4)}
                                                            onChange={(e)=> setFieldValue('txtPin',allowNumbersOnly(e.target.value, 4))  }
                                                            className={errors.txtPin && touched.txtPin ? "is-invalid" : null}
                                                            required />
                                                            
                                                        {errors.txtPin && touched.txtPin ? (
                                                            <span className="invalid-feedback">{errors.txtPin}</span>
                                                        ) : null}

                                                    </Form.Group>
                                                </div> */}
                                            </div>

                                            
                                            
                                            <div className="app-panel inpage">
                                                <div className="footer-with-cta toleft m-0 ">
                                                    <Button variant="secondary"
                                                        type="button"
                                                        disabled={DepositCashWithAgentRequest.is_request_processing}
                                                        className="ml-0 onboarding-btn light"
                                                        onClick={()=>{
                                                           history.goBack()
                                                        }}
                                                    > Back
                                                    
                                                    </Button>
                                                    <Button variant="secondary"
                                                        type="submit"
                                                        disabled={DepositCashWithAgentRequest.is_request_processing}
                                                        className=" onboarding-btn"
                                                    > 
                                                    {DepositCashWithAgentRequest.is_request_processing?'Please wait...' :'Continue'}
                                                    </Button>

                                                </div>
                                            </div>

                                            {DepositCashWithAgentRequest.request_status ===dashboardConstants.DEPOSIT_USING_AGENT_FAILURE && 
                                                
                                                    <ErrorMessage errorMessage={DepositCashWithAgentRequest.request_data.error} canRetry={false} retryFunc={()=>this.handleDeposit(payload)} />
                                                
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
                    <title>9PSB - 9PSB - Cash Deposit | confirm</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>9PSB - Cash Deposit Via Agent</h3>
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
        DepositCashWithAgentReducer : state.accountsReducers.DepositCashWithAgentReducer,
    };
}

export default connect(mapStateToProps)(ConfirmCashDeposit);