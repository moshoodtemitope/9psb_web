import * as React from 'react';

import { connect } from 'react-redux';
import {Fragment} from "react";



import {history} from '../../../../_helpers/history'

import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Formik } from 'formik';
import { Helmet } from 'react-helmet';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import  InAppContainer from '../../../../shared/templates/inapp-container'
import  DownloadApp from '../../../../shared/elements/downloadapp-box'
import {encryptAnItem} from '../../../../shared/shared-utils/index';
import ErrorMessage from '../../../../shared/elements/errormessage'
import { paymentActions } from '../../../../redux/actions/payments/payments';
import { paymentsConstants } from '../../../../redux/actiontypes/payments/payments.constants';

import LeftCaret from '../../../../assets/images/left-caret.svg';
import { numberWithCommas, allowNumbersOnly} from '../../../../shared/utils';
import "../styles.scss"; 
class ConfirmAgentCashWithdrawal extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            psbuser:JSON.parse(localStorage.getItem('psb-auth')),
            
        }
        
        if(this.props.location.state===undefined){
            history.push("/app/cash-withdrawal/agents")
        }else{
            
            this.withdrawalAmount  = this.props.location.state.withdrawalAmount;
            this.walletNumber  = this.props.location.state.walletNumber;

            
        }
        
        
    }

    componentDidMount(){
        this.clearRecords()
    }

    clearRecords = ()=>{
        const {dispatch} = this.props;
       
        dispatch(paymentActions.AgentWithdrawalStep2("CLEAR"));
       
    }

    confirmWithdrawal = (payload)=>{

        const {dispatch} = this.props;
        

        dispatch(paymentActions.AgentWithdrawalStep2(payload));
        
       
        
        
    }

    confirmWithdrawal = (payload)=>{

        const {dispatch} = this.props;
        dispatch(paymentActions.AgentWithdrawalStep2(payload));
        
       
        
        
    }



    renderPageWrap = () =>{
        let 
        {psbuser, payload} = this.state;

        let validationSchema = Yup.object().shape({
            txtPin: Yup.string()
                .required('Required'),
            }); 
        let AgentWithdrawalStep2ReducerRequest = this.props.AgentWithdrawalStep2Reducer;
        
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
                                <h3>Confirm Withdrawal</h3>
                            </div>
                            
                        </div>
                        
                        <div className="dashboard-section">
                            <Formik
                                initialValues={{
                                    txtPin:"",
                                }}

                                validationSchema={validationSchema}
                                onSubmit={(values, { resetForm }) => {

                                    let payload = {
                                        withdrawalAmount: this.withdrawalAmount,
                                        walletNumber: this.walletNumber,
                                        transactionPin: encryptAnItem(values.txtPin)
                                    }

                                    this.setState({payload})

                                    
                                    this.confirmWithdrawal(payload)


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
                                                    You are about to withdraw &#8358;{numberWithCommas(this.withdrawalAmount, true)} from one of our agents.
                                                    {/* You are about to withdraw &#8358;{numberWithCommas(this.withdrawalAmount, true)} from your wallet/account number {this.walletNumber} via Agent Withdrawal. */}
                                                </div>
                                                <div className="panel-helptext mt-20 centered m-auto pt-20">
                                                    You will be charged an additional N50 VAT plus N2.50 on tax.
                                                </div>
                                                <div className="form-wrap w-70 mt-40 m-auto pt-20">
                                                   

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
                                                </div>
                                            </div>

                                            {
                                                AgentWithdrawalStep2ReducerRequest.request_status === paymentsConstants.AGENT_WITHDRAWAL_STEP2_FAILURE &&
                                                
                                                    <ErrorMessage errorMessage={AgentWithdrawalStep2ReducerRequest.request_data.error} 
                                                        canRetry={false} 
                                                        retryFunc={() => this.confirmWithdrawal(payload)} />
                                                
                                            }
                                            
                                            <div className="app-panel inpage">
                                                <div className="footer-with-cta toleft m-0 ">
                                                    <Button variant="secondary"
                                                        type="button"
                                                        disabled={AgentWithdrawalStep2ReducerRequest.is_request_processing}
                                                        className="ml-0 onboarding-btn light"
                                                        onClick={()=>{
                                                            history.goBack()
                                                        }}
                                                    > Back
                                                    
                                                    </Button>
                                                    <Button variant="secondary"
                                                        type="submit"
                                                        disabled={AgentWithdrawalStep2ReducerRequest.is_request_processing}
                                                        className=" onboarding-btn"
                                                    > 
                                                    {AgentWithdrawalStep2ReducerRequest.is_request_processing?'Please wait...' :'Get withdrawal code'}
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
                    <title>9PSB - Cash Withdrawal | confirm</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Cash Withdrawal Via Agent</h3>
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

export default connect(mapStateToProps)(ConfirmAgentCashWithdrawal);