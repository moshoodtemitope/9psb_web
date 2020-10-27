import * as React from 'react';

import { connect } from 'react-redux';
import {Fragment} from "react";

import {history} from '../../../../_helpers/history'
import Alert from 'react-bootstrap/Alert';
import { Helmet } from 'react-helmet';
import Button from 'react-bootstrap/Button'

import { Formik } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import  InAppContainer from '../../../../shared/templates/inapp-container'
import  DownloadApp from '../../../../shared/elements/downloadapp-box'
import  ErrorMessage from '../../../../shared/elements/errormessage'
import {encryptAnItem} from '../../../../shared/shared-utils/index';
import LeftCaret from '../../../../assets/images/left-caret.svg';
import {paymentActions} from '../../../../redux/actions/payments/payments';
import {paymentsConstants} from '../../../../redux/actiontypes/payments/payments.constants';

import { numberWithCommas, allowNumbersOnly} from '../../../../shared/utils';
import "../styles.scss"; 
class ConfirmNewTransferToBank extends React.Component{
    constructor(props) {
        super(props);
        let getExistingInfo = this.props.confirmBeneficiaryReducer;
        this.state={
            psbuser:JSON.parse(localStorage.getItem('psb-auth')),
            screenWidthSize: window.innerWidth,
            existingCustomerInfo: (Object.keys(getExistingInfo).length>=1 
                                        && getExistingInfo.request_status === paymentsConstants.STORE_BENEFICIARY_DATA)
                                    ? getExistingInfo.request_data.customerData: '' ,
        }

        

        if(this.state.existingCustomerInfo===""){
            history.push("/app/transfer/to-bank")
        }
    }

    componentDidMount(){
        this.clearRecords();
    }

    clearRecords = ()=>{
        const {dispatch} = this.props;
        dispatch(paymentActions.TranferToBankAccount("CLEAR"));
    }

    confirmTransfer = (payload)=>{

        const {dispatch} = this.props;
         dispatch(paymentActions.TranferToBankAccount(payload));
        
    }


    

    renderPageWrap = () =>{
        let
            {existingCustomerInfo,
            psbuser,
            payload} = this.state;

        let validationSchema = Yup.object().shape({
            txtPin: Yup.string()
                .required('Required'),
            });  

        let TranferToBankAccountRequest = this.props.TranferToBankAccountReducer;  
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
                                <h3>Confirm Transfer</h3>
                            </div>
                        </div>
                        
                        <div className="dashboard-section">
                            <Formik
                                initialValues={{
                                    txtPin:"",
                                    saveBeneficiary:false,
                                    beneficiaryAlias: ""
                                }}

                                validationSchema={validationSchema}
                                onSubmit={(values, { resetForm }) => {
                                        
                                    let payload = {
                                        main :{
                                            accountNumber: existingCustomerInfo.accountNumber,
                                            sourceAccountNumber: existingCustomerInfo.sourceAccountNumber,
                                            bankCode: existingCustomerInfo.bankCode,
                                            transactionPin: encryptAnItem(values.txtPin),
                                            amount: existingCustomerInfo.amount,
                                            narration: existingCustomerInfo.narration,
                                            saveAsBeneficiary: values.saveBeneficiary,
                                            saveBeneficiaryAs: (values.beneficiaryAlias!=="" && values.saveBeneficiary)?values.beneficiaryAlias: null
                                        },
                                        otherInfo:{ 
                                            displayName: existingCustomerInfo.displayName,
                                            bankName:existingCustomerInfo.bankName
                                        }
                                    }

                                   
                                    this.setState({payload})
                                    this.confirmTransfer(payload)


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
                                                    You are about to transfer &#8358;{numberWithCommas(existingCustomerInfo.amount, true)} from your wallet/account ({existingCustomerInfo.sourceAccountNumber}) to {existingCustomerInfo.displayName}, {existingCustomerInfo.bankName}, {existingCustomerInfo.accountNumber}.
                                                </div>
                                                {/* <div className="panel-helptext mt-20 centered m-auto pt-20">
                                                    You will be charged an additional N50 VAT plus N2.50 on tax.
                                                </div> */}
                                                <div className="form-wrap w-70 mt-40 m-auto pt-20">
                                                   

                                                    <Form.Group className="poppedinput">
                                                        <Form.Label className="block-level">Enter Security PIN</Form.Label>
                                                        <Form.Control type="password"
                                                            name="txtPin"
                                                            onChange={handleChange}
                                                            maxLength="4"
                                                            value={allowNumbersOnly(values.txtPin)}
                                                            className={errors.txtPin && touched.txtPin ? "is-invalid" : null}
                                                            required />
                                                            
                                                        {errors.txtPin && touched.txtPin ? (
                                                            <span className="invalid-feedback">{errors.txtPin}</span>
                                                        ) : null}

                                                    </Form.Group>
                                                    <Form.Group className="checkbox-input centered">
                                                        <input type="checkbox"
                                                         name="saveBeneficiary" 
                                                         checked={values.saveBeneficiary? values.saveBeneficiary:null}
                                                         onChange={handleChange} 
                                                         value={values.saveBeneficiary}
                                                         id="save-benficiary"/>
                                                        <label htmlFor="save-benficiary">Save as beneficiary</label>
                                                    </Form.Group>

                                                    {values.saveBeneficiary===true &&
                                                        <Form.Group className="poppedinput">
                                                            <Form.Label className="block-level">Beneficiary Alias(optional)</Form.Label>
                                                            <Form.Control type="text"
                                                                name="beneficiaryAlias"
                                                                onChange={handleChange}
                                                                value={values.beneficiaryAlias}
                                                                className={errors.beneficiaryAlias && touched.beneficiaryAlias ? "is-invalid" : null}
                                                                required />
                                                            
                                                        </Form.Group>
                                                    }
                                                </div>
                                            </div>

                                            <div className="app-panel inpage">
                                                <div className="footer-with-cta toleft m-0 ">
                                                    <Button variant="secondary"
                                                        type="button"
                                                        disabled={TranferToBankAccountRequest.is_request_processing}
                                                        className="ml-0 onboarding-btn light"
                                                        onClick={()=>history.goBack()}
                                                    > Back
                                                     {/* {CreateAccountStep1Request.is_request_processing?'Please wait...' :'Continue'} */}
                                                    </Button>
                                                    <Button variant="secondary"
                                                        type="submit"
                                                        disabled={TranferToBankAccountRequest.is_request_processing}
                                                        className=" onboarding-btn"
                                                    > 
                                                     {TranferToBankAccountRequest.is_request_processing?'Please wait...' :'Continue'}
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
                    <title>9PSB - Transfer to bank account | success</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Transfer to bank account</h3>
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
        confirmBeneficiaryReducer : state.paymentsReducers.confirmBeneficiaryReducer,
        saveRecipientInfoReducer : state.paymentsReducers.saveRecipientInfoReducer,
        TranferToBankAccountReducer : state.paymentsReducers.TranferToBankAccountReducer,
    };
}

export default connect(mapStateToProps)(ConfirmNewTransferToBank);