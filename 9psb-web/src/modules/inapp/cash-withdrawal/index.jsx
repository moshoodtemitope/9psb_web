import * as React from 'react';
import { Link, NavLink} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";


import {history} from '../../../_helpers/history'
import { Helmet } from 'react-helmet';

import Button from 'react-bootstrap/Button'

import { Formik } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import  InAppContainer from '../../../shared/templates/inapp-container'
import  DownloadApp from '../../../shared/elements/downloadapp-box'
import  SelectAnAccount from '../../../shared/elements/select-account'
import { numberWithCommas, allowNumbersOnly} from '../../../shared/utils';
import "./styles.scss"; 
class CashWithdrawal extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            user:"",
            isAmountExceedMax:false,
            isAccountError: false,
            accountNumber: "",
            selectedAccount:"",
            lesserAccountBalanceError:false,
            
        }
   
        
    }

    componentDidMount(){

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
            amountToWithdraw: Yup.string()
                .required('Required'),
            withdrawalPin: Yup.string()
                .required('Required'),
        });  
        let{
            isAmountExceedMax,
            accountNumber,
            selectedAccount,
            isAccountError,
            lesserAccountBalanceError,
            }= this.state;

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
                                    amountToWithdraw:"",
                                    withdrawalPin:""
                                }}

                                validationSchema={validationSchema}
                                onSubmit={(values, { resetForm }) => {

                                    let withdrawalAmount = parseFloat(values.amountToWithdraw.replace(/,/g, ''));
                                  
                                    if(withdrawalAmount<=1000000){
                                        this.setState({isAmountExceedMax:false});


                                        // if(accountNumber!==""){
                                        if(accountNumber!==""){
                                            
                                            if( parseFloat(selectedAccount.walletBalance)>= withdrawalAmount){
                                                this.setState({isAccountError:false, lesserAccountBalanceError: false})
                                                
                                                history.push("/app/cash-withdrawal/confirm", {
                                                    withdrawalCode: values.withdrawalPin,
                                                    withdrawalAmount,
                                                    walletNumber:accountNumber,
                                                });
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
                                                    <NavLink exact to="/app/cash-withdrawal/agents" className="each-option">
                                                        From Agent
                                                    </NavLink>
                                                </div>
                                                <div className="panel-helptext mt-20 centered m-auto">
                                                    Withdraw without a card from an ATM machine
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
                                                            name="amountToWithdraw"   
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
                                                                setFieldValue('amountToWithdraw', e.target.value)
                                                            }}
                                                            value={numberWithCommas(values.amountToWithdraw)}
                                                            className={((errors.amountToWithdraw && touched.amountToWithdraw)|| isAmountExceedMax|| lesserAccountBalanceError) ? "is-invalid" : null}
                                                            required />
                                                            
                                                                {errors.amountToWithdraw && touched.amountToWithdraw ? (
                                                                    <span className="invalid-feedback">{errors.amountToWithdraw}</span>
                                                                ) : null}
                                                                <div className={isAmountExceedMax ? "forminput-helptext error-txt" : "forminput-helptext"}  >Maximum of &#8358;1,000,000</div>
                                                                {lesserAccountBalanceError &&
                                                                    <span className="invalid-feedback">Insufficient account balance</span>
                                                                }
                                                            
                                                    </Form.Group>

                                                    <Form.Group className="poppedinput">
                                                        <Form.Label className="block-level">Set 6-digit Withdrawal PIN</Form.Label>
                                                        <Form.Control type="password"
                                                            name="withdrawalPin"
                                                            value={allowNumbersOnly(values.withdrawalPin, 6)}
                                                            onChange={(e)=> setFieldValue('withdrawalPin',allowNumbersOnly(e.target.value, 6))  }
                                                            className={errors.withdrawalPin && touched.withdrawalPin ? "is-invalid" : null}
                                                            required />
                                                            
                                                        {errors.withdrawalPin && touched.withdrawalPin ? (
                                                            <span className="invalid-feedback">{errors.withdrawalPin}</span>
                                                        ) : null}
                                                        <div className="forminput-helptext">This PIN will be required at the ATM</div>

                                                    </Form.Group>
                                                </div>
                                            </div>

                                            <div className="app-panel inpage">
                                                <div className="footer-with-cta toleft m-0 ">
                                                    <Button variant="secondary"
                                                        type="submit"
                                                        // disabled={CreateAccountStep1Request.is_request_processing}
                                                        className="ml-0 onboarding-btn"
                                                    > Continue
                                                     {/* {CreateAccountStep1Request.is_request_processing?'Please wait...' :'Continue'} */}
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
                    <title>9PSB - Cash Withdrawal</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Cash Withdrawal</h3>
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
        
    };
}

export default connect(mapStateToProps)(CashWithdrawal);