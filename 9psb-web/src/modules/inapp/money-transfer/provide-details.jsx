import * as React from 'react';
import { Link, NavLink} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";


import { Helmet } from 'react-helmet';
import {history} from '../../../_helpers/history'
import Alert from 'react-bootstrap/Alert';
import Select from 'react-select';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Formik } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import  InAppContainer from '../../../shared/templates/inapp-container'
import  DownloadApp from '../../../shared/elements/downloadapp-box'
import  SelectAnAccount from '../../../shared/elements/select-account'
import  ErrorMessage from '../../../shared/elements/errormessage'
import LeftCaret from '../../../assets/images/left-caret.svg';
import { numberWithCommas} from '../../../shared/utils';
import {encryptAnItem} from '../../../shared/shared-utils/index';
import {paymentActions} from '../../../redux/actions/payments/payments';
import {paymentsConstants} from '../../../redux/actiontypes/payments/payments.constants';
import "./styles.scss"; 
class MoneyTransferDetails extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            user:"",
            isAccountError:false,
            accountNumber:"",
            amountEntered:"",
            selectedAccount:"",
            lesserAccountBalanceError:false,
        }
   
       
    }

    componentDidMount(){
        this.clearRecords()
    }

    clearRecords = ()=>{
        const {dispatch} = this.props;
        dispatch(paymentActions.TranferToPhoneStep1("CLEAR"));
    }


    setAccountChosen = (selected)=>{
        let {amountEntered} = this.state;
        // this.setState({accountNumber: selected.value,isAccountError:false, isAccountSelected:true})
        this.setState({
            accountNumber: selected.value,
            isAccountError:false,
            selectedAccount: selected,
            isAccountSelected:true})

        if(amountEntered!==""){
            let amount = parseFloat(amountEntered.replace(/,/g, ''));
            if( parseFloat(selected.walletBalance)>= amount){
                this.setState({lesserAccountBalanceError: false})
            }else{
                this.setState({lesserAccountBalanceError: true})
            }
        }
    }
    

    renderDeposit = ()=>{

        return(
            <div className="form-wrap">

            </div>
        )
    }

    verifyAccount = (payload)=>{

        const {dispatch} = this.props;
         dispatch(paymentActions.TranferToPhoneStep1(payload));
        
    }

    renderPageWrap = () =>{
        let 
          {
            isAccountError,
            selectedAccount,
            lesserAccountBalanceError,
            payload,
            accountNumber} = this.state;
        let validationSchema = Yup.object().shape({
                phoneNumber: Yup.string()
                    .required('Required'),
                amountToSend: Yup.string()
                    .required('Required'),
        });   

        let TransferMoneyToPhoneSTEP1Request = this.props.TransferMoneyToPhoneSTEP1Reducer;
        return(
            <div className="each-section mt-80 res-mt-45">
                <div className="twosided nomargin">
                    <div>
                        <div className="page-section-mainheading app-panel">
                            <div className="border-lines"><span></span><span></span><span></span></div>
                            <div className="subheading-title">
                                <div className="backnav" onClick={()=>history.goBack()}>
                                    <img src={LeftCaret} alt=""/>
                                    <span>Back</span>
                                </div>
                                <h3>Transfer to phone number
                                    <span>New Beneficiary</span>
                                </h3>
                            </div>
                            
                        </div>
                        
                        <div className="dashboard-section">
                            <Formik
                                initialValues={{
                                    phoneNumber:"",
                                    amountToSend:"",
                                    narration:""
                                }}

                                validationSchema={validationSchema}
                                onSubmit={(values, { resetForm }) => {

                                    
                                    if(accountNumber===""){
                                        this.setState({isAccountError:true})
                                    }

                                    if(accountNumber!==""){
                                        this.setState({isAccountError:false})
                                        let amount = parseFloat(values.amountToSend.replace(/,/g, ''));
                                        if( parseFloat(selectedAccount.walletBalance)>= amount){
                                            this.setState({lesserAccountBalanceError: false})
                                            let payload = {
                                                toMobileNumber:values.phoneNumber,
                                                sourceAccountNumber: accountNumber,
                                                narration:values.narration!==""?values.narration:null,
                                                amount:parseFloat(values.amountToSend.replace(/,/g, '')),
                                            }
                                            this.setState({payload})
                                            this.verifyAccount(payload);
                                        }else{
                                            this.setState({lesserAccountBalanceError:true})
                                        }
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
                                                <div className="panel-helptext w-70 mt-20  m-auto m-100">
                                                    Enter Beneficiary details
                                                </div>
                                                <div className="form-wrap w-70 mt-40 m-auto pt-20 m-100">
                                                    <Form.Group className="poppedinput withselect">
                                                        <SelectAnAccount
                                                            label = "Select Source"
                                                            onChange={(selected) => {
                                                                this.setAccountChosen(selected)
                                                                
                                                            }}
                                                            isAccountError={isAccountError}
                                                            accountNumber={accountNumber}
                                                        />

                                                    </Form.Group>
                                                 
                                                    <Form.Group className="poppedinput">
                                                        <Form.Label className="block-level">Phone number</Form.Label>
                                                        <Form.Control type="text"
                                                            name="phoneNumber"
                                                            onChange={handleChange}
                                                            placeholder=" "
                                                            value={values.phoneNumber}
                                                            className={errors.phoneNumber && touched.phoneNumber ? "is-invalid" : null}
                                                            required />
                                                        {errors.phoneNumber && touched.phoneNumber ? (
                                                            <span className="invalid-feedback">{errors.phoneNumber}</span>
                                                        ) : null}

                                                    </Form.Group>
                                                    <Form.Group className="poppedinput">
                                                        <Form.Label className="block-level">Enter Amount</Form.Label>
                                                        <Form.Control type="text"
                                                            name="amountToSend"
                                                            // onChange={handleChange}
                                                            onChange={(e) => {
                                                                if(e.target.value!==""){
                                                                    let amount = parseFloat(e.target.value.replace(/,/g, ''));
                                                                    
                                                                    this.setState({amountEntered:e.target.value})
                                                                    if(selectedAccount!==""){
                                                                        if( parseFloat(selectedAccount.walletBalance)>= amount){
                                                                            this.setState({lesserAccountBalanceError: false})
                                                                        }else{
                                                                            this.setState({lesserAccountBalanceError: true})
                                                                        }
                                                                    }
                                                                    
                                                                    setFieldValue('amountToSend', e.target.value)
                                                                }
                                                            }}
                                                            placeholder=" "
                                                            value={numberWithCommas(values.amountToSend)}
                                                            className={((errors.amountToSend && touched.amountToSend) || lesserAccountBalanceError) ? "is-invalid" : null}
                                                            required />
                                                        {errors.amountToSend && touched.amountToSend ? (
                                                            <span className="invalid-feedback">{errors.amountToSend}</span>
                                                        ) : null}

                                                        {lesserAccountBalanceError &&
                                                            <span className="invalid-feedback">Insufficient account balance</span>
                                                        }

                                                    </Form.Group>
                                                    <Form.Group className="poppedinput">
                                                        <Form.Label className="block-level">Notes(optional)</Form.Label>
                                                        <Form.Control type="text"
                                                            name="narration"
                                                            onChange={handleChange}
                                                            value={values.narration}
                                                            className={errors.narration && touched.narration ? "is-invalid" : null}
                                                            required />
                                                        
                                                    </Form.Group>

                                                    {/* <Form.Group className="poppedinput">
                                                        <Form.Label className="block-level">Set 6-digit Withdrawal PIN</Form.Label>
                                                        <Form.Control type="text"
                                                            name="amountToSend"
                                                            onChange={handleChange}
                                                            value={values.amountToSend}
                                                            className={errors.amountToSend && touched.amountToSend ? "is-invalid" : null}
                                                            required />
                                                            <div className="forminput-helptext">This PIN will be required at the ATM</div>
                                                        {errors.amountToSend && touched.amountToSend ? (
                                                            <span className="invalid-feedback">{errors.amountToSend}</span>
                                                        ) : null}

                                                    </Form.Group> */}
                                                </div>
                                            </div>
                                            
                                            {TransferMoneyToPhoneSTEP1Request.request_status ===paymentsConstants.TRANSFER_TO_PHONE_STEP1_FAILURE && 
                                                
                                                    <ErrorMessage errorMessage={TransferMoneyToPhoneSTEP1Request.request_data.error} canRetry={false} retryFunc={()=>this.verifyAccount(payload)} />
                                                
                                            }
                                            <div className="app-panel inpage">
                                                <div className="footer-with-cta toleft m-0 ">
                                                    <Button variant="secondary"
                                                        type="button"
                                                        disabled={TransferMoneyToPhoneSTEP1Request.is_request_processing}
                                                        className="ml-0 onboarding-btn light"
                                                        onClick={()=>history.goBack()}
                                                    > Back
                                                    
                                                    </Button>
                                                    <Button variant="secondary"
                                                        type="submit"
                                                        disabled={TransferMoneyToPhoneSTEP1Request.is_request_processing}
                                                        className="onboarding-btn"
                                                    > 
                                                     {TransferMoneyToPhoneSTEP1Request.is_request_processing?'Please wait...' :'Continue'}
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
                    <title>9PSB - Transfer to Phone | details</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Transfer to Phone</h3>
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
        TransferMoneyToPhoneSTEP1Reducer : state.paymentsReducers.TransferMoneyToPhoneSTEP1Reducer,
    };
}

export default connect(mapStateToProps)(MoneyTransferDetails);