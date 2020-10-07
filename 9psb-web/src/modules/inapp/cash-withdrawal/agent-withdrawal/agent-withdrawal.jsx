import * as React from 'react';
import { Link, NavLink} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";

import { Helmet } from 'react-helmet';
import Button from 'react-bootstrap/Button'
import {history} from '../../../../_helpers/history'
import Col from 'react-bootstrap/Col'
import { Formik } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import  InAppContainer from '../../../../shared/templates/inapp-container'
import  DownloadApp from '../../../../shared/elements/downloadapp-box'
import  SelectAnAccount from '../../../../shared/elements/select-account'
import {encryptAnItem} from '../../../../shared/shared-utils/index';
import ErrorMessage from '../../../../shared/elements/errormessage'
import LeftCaret from '../../../../assets/images/left-caret.svg';
import { paymentActions } from '../../../../redux/actions/payments/payments';
import { paymentsConstants } from '../../../../redux/actiontypes/payments/payments.constants';
import { numberWithCommas, allowNumbersOnly} from '../../../../shared/utils';
import "../styles.scss"; 
class AgentWithdrawal extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            isAmountExceedMax:false,
            isAccountError: false,
            accountNumber: "",
            selectedAccount:"",
            lesserAccountBalanceError:false,
            
        }
   
        
    }

    componentDidMount(){
        this.clearRecords()
    }

    clearRecords = ()=>{
        const {dispatch} = this.props;
       
        dispatch(paymentActions.AgentWithdrawalStep2("CLEAR"));
       
    }


    setAccountChosen = (selected, e)=>{
        let {amountToPay} = this.state;
        this.setState({accountNumber: selected.value,
                        isAccountError:false,
                        selectedAccount: selected,
                        isAccountSelected:true})

        if (amountToPay !== "" && amountToPay !== undefined) {
           
            if (parseFloat(selected.walletBalance) >= amountToPay) {
                this.setState({ lesserAccountBalanceError: false })
            } else {
               
                this.setState({ lesserAccountBalanceError: true })
            }
        }
    }

   
    

    

    renderPageWrap = () =>{
        let validationSchema = Yup.object().shape({
            withdrawalAmount: Yup.string()
                .required('Required'),
            // txtPin: Yup.string()
            //     .required('Required'),
        });  

        let{
            isAmountExceedMax,
            accountNumber,
            selectedAccount,
            isAccountError,
            payload,
            lesserAccountBalanceError,
            }= this.state;
            let AgentWithdrawalStep2ReducerRequest = this.props.AgentWithdrawalStep2Reducer;
        return(
            <div className="each-section mt-80 res-mt-45">
                <div className="twosided nomargin">
                    <div>
                        <div className="page-section-mainheading app-panel">
                            <div className="border-lines"><span></span><span></span><span></span></div>
                            
                            <h3>Select a withdrawal option</h3>
                        </div>
                        
                        <div className="dashboard-section">
                            <Formik
                                initialValues={{
                                    withdrawalAmount:"",
                                    // txtPin:"",
                                }}

                                validationSchema={validationSchema}
                                onSubmit={(values, { resetForm }) => {

                                    let withdrawalAmount = parseFloat(values.withdrawalAmount.replace(/,/g, ''));
                                    
                                    if(withdrawalAmount<=1000000){
                                        this.setState({isAmountExceedMax:false});


                                        if(accountNumber!==""){
                                            
                                            if( parseFloat(selectedAccount.walletBalance)>= withdrawalAmount){
                                                this.setState({isAccountError:false, lesserAccountBalanceError: false})
                                                
                                                // let payload = {
                                                //     withdrawalAmount: withdrawalAmount,
                                                //     walletNumber: accountNumber,
                                                //     // transactionPin: encryptAnItem(values.txtPin)
                                                // }

                                                history.push("/app/cash-withdrawal/agents/confirm", {
                                                    withdrawalAmount: withdrawalAmount,
                                                    walletNumber: accountNumber,
                                                    
                                                });
            
                                                // this.setState({payload})
            
                                                
                                                // this.confirmWithdrawal(payload)
                                            }else{
                                                this.setState({lesserAccountBalanceError:true})
                                            }
                                        }else{
                                            this.setState({isAccountError:true})
                                        }



                                        
                                    }else{
                                        this.setState({isAmountExceedMax:true})
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
                                                <div className="action-options">
                                                    <NavLink exact to="/app/cash-withdrawal" className="each-option">
                                                        Via ATM (Cardless)
                                                    </NavLink>
                                                    <NavLink to="/app/cash-withdrawal/agents" className="each-option">
                                                        From Agent
                                                    </NavLink>
                                                </div>
                                                <div className="panel-helptext mt-20 centered m-auto">
                                                    Withdraw physically from an agent location
                                                </div>
                                                <div className="form-wrap w-70 mt-40 m-auto pt-20">
                                                    <SelectAnAccount
                                                        label="Select Source"
                                                        onChange={(selected) => {
                                                            this.setAccountChosen(selected, selected)

                                                        }}
                                                        isAccountError={isAccountError}
                                                        accountNumber={accountNumber}
                                                    />
                                                 
                                                    <Form.Group className="poppedinput">
                                                        <Form.Label className="block-level">Enter Amount</Form.Label>
                                                        <Form.Control type="text"
                                                            name="withdrawalAmount"   
                                                            onChange={(e) => {
                                                                

                                                                let withdrawalAmount = parseFloat(e.target.value.replace(/,/g, ''));
                                                                this.setState({amountToPay: withdrawalAmount})
                                                                if(withdrawalAmount<=1000000){
                                                                    this.setState({isAmountExceedMax:false})
                                                                    if(selectedAccount!==""){
                                                                        if (parseFloat(selectedAccount.walletBalance) >= withdrawalAmount) {
                                                                            this.setState({ lesserAccountBalanceError: false })
                                                                        } else {
                                                                            this.setState({ lesserAccountBalanceError: true })
                                                                        }
                                                                    }
                                                                }else{
                                                                    this.setState({isAmountExceedMax:true})
                                                                }
                                                                setFieldValue('withdrawalAmount', e.target.value)
                                                            }}
                                                            value={numberWithCommas(values.withdrawalAmount)}
                                                            className={((errors.withdrawalAmount && touched.withdrawalAmount)|| isAmountExceedMax || lesserAccountBalanceError) ? "is-invalid" : null}
                                                            required />
                                                        {errors.withdrawalAmount && touched.withdrawalAmount ? (
                                                            <span className="invalid-feedback">{errors.withdrawalAmount}</span>
                                                        ) : null}
                                                        <div className={isAmountExceedMax?"forminput-helptext error-txt":"forminput-helptext"}  >Maximum of &#8358;1,000,000</div>
                                                        
                                                        {lesserAccountBalanceError &&
                                                            <span className="invalid-feedback">Insufficient account balance</span>
                                                        }
                                                    </Form.Group>

                                                    {/* <Form.Group className="poppedinput">
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

                                                    </Form.Group> */}
                                                </div>
                                            </div>

                                            
                                            
                                            <div className="app-panel inpage">
                                                <div className="footer-with-cta toleft m-0 ">
                                                    <Button variant="secondary"
                                                        type="submit"
                                                        
                                                        className=" onboarding-btn"
                                                    > 
                                                    Continue
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
                    <title>9PSB - Cash Withdrawal from Agent</title>
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
    };
}

export default connect(mapStateToProps)(AgentWithdrawal);