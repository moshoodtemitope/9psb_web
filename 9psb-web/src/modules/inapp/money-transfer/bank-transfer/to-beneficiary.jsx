import * as React from 'react';

import { connect } from 'react-redux';
import {Fragment} from "react";


import {history} from '../../../../_helpers/history'
import { Helmet } from 'react-helmet';
import Select from 'react-select';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Formik } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import  InAppContainer from '../../../../shared/templates/inapp-container'
import  DownloadApp from '../../../../shared/elements/downloadapp-box'
import  SelectAnAccount from '../../../../shared/elements/select-account'
import LeftCaret from '../../../../assets/images/left-caret.svg';
import {paymentActions} from '../../../../redux/actions/payments/payments';
import {paymentsConstants} from '../../../../redux/actiontypes/payments/payments.constants';

import { numberWithCommas, getBankNameWithCode} from '../../../../shared/utils';
import "../styles.scss"; 
class TransferToBankBeneficiaryDetails extends React.Component{
    constructor(props) {
        super(props);
        let getExistingInfo = this.props.confirmBeneficiaryReducer;
        this.state = {
            psbuser: JSON.parse(localStorage.getItem('psb-auth')),
            screenWidthSize: window.innerWidth,
            existingCustomerInfo: (Object.keys(getExistingInfo).length >= 1
                && getExistingInfo.request_status === paymentsConstants.STORE_BENEFICIARY_DATA)
                ? getExistingInfo.request_data.customerData : '',
            isAccountError: false,
            accountNumber: "",
            amountEntered:"",
            selectedAccount:"",
            lesserAccountBalanceError:false,
            sameAccountError:false
        }

       
        if(this.state.existingCustomerInfo===""){
            history.push("/app/transfer/to-bank")
        }
    }

    componentDidMount(){
        this.loadbanks()
    }


    setAccountChosen = (selected, e)=>{
        let {amountEntered} = this.state;
        this.setState({accountNumber: selected.value,
                        isAccountError:false,
                        selectedAccount: selected,
                        sameAccountError: selected.value===this.state.existingCustomerInfo.accountNumber?true:false,
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

    proceedToConfirm = (recipientInfo)=>{
        const {dispatch} = this.props;
        dispatch(paymentActions.saveRecipientData(recipientInfo));
    }
    

    

    loadbanks = ()=>{
        let GetBanksRequest = this.props.GetBanksReducer;

        const {dispatch} = this.props;
        if(GetBanksRequest.request_status !==paymentsConstants.GET_BANKS_SUCCESS){
            dispatch(paymentActions.GetBanks());
        }
    }

    renderTransferForm = ()=>{
        let beneficiaryData = this.props.confirmBeneficiaryReducer,
            customerData = beneficiaryData.request_data.customerData,
            GetBanksRequest = this.props.GetBanksReducer,

            allBanks        = GetBanksRequest.request_data.response;

        let {isAccountError,
            accountNumber,
            selectedAccount,
            sameAccountError,
            lesserAccountBalanceError} = this.state;

        let validationSchema = Yup.object().shape({
                    amountToSend: Yup.string()
                        .required('Required'),
                });   

        return (
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
                                <h3>Transfer to account Number
                                    <span>Existing Beneficiary > {customerData.accountName}</span>
                                </h3>
                            </div>
                        </div>

                        <div className="dashboard-section">
                            <Formik
                                initialValues={{
                                    narrationText: "",
                                    amountToSend:""
                                }}

                                validationSchema={validationSchema}
                                onSubmit={(values, { resetForm }) => {

                                    if(accountNumber===""){
                                        this.setState({isAccountError:true})
                                    }

                                    if(accountNumber!==""){
                                        let amount = parseFloat(values.amountToSend.replace(/,/g, ''));
                                        if(customerData.accountNumber !==accountNumber){
                                            // if(customerData.accountNumber !==accountNumber && customerData.bankCode==="000"){
                                            if( parseFloat(selectedAccount.walletBalance)>= amount){
                                                this.setState({isAccountError:false,sameAccountError:false, lesserAccountBalanceError: false})

                                                let payload = {
                                                    bankName: getBankNameWithCode(customerData.bankCode, allBanks),
                                                    displayName:customerData.accountName,
                                                    accountNumber: customerData.accountNumber,
                                                    sourceAccountNumber: accountNumber,
                                                    bankCode: customerData.bankCode,
                                                    amount: amount,
                                                    narration: values.narrationText!==""?values.narrationText:null,
                                                }
                                                
                                                this.proceedToConfirm(payload);
                                            }else{
                                                this.setState({lesserAccountBalanceError:true})
                                            }
                                        }else{
                                            // console.log("dsmd sdsdsdsd",customerData.accountNumber, accountNumber, customerData.bankCode)
                                            this.setState({sameAccountError:true})
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
                                                    Enter Amount you will like to transfer
                                                    </div>
                                                <div className="form-wrap w-70 mt-40 m-auto pt-20 m-100">
                                                    <Form.Group className="poppedinput withselect">
                                                        <SelectAnAccount
                                                            label = "Select Source"
                                                            onChange={(selected) => {
                                                                this.setAccountChosen(selected, selected)
                                                                
                                                            }}
                                                            isAccountError={isAccountError}
                                                            accountNumber={accountNumber}
                                                        />

                                                    </Form.Group>
                                                    <div className="blocked-bar-link selected">
                                                        <div>
                                                            <div className="main-text">Beneficiary</div>
                                                            <div className="sub-text">
                                                                <span className="customer-name">{customerData.accountName}</span>
                                                                <span className="customer-bank">{getBankNameWithCode(customerData.bankCode, allBanks)}- {customerData.accountNumber}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {sameAccountError &&
                                                        <span className="error-txt">Source and recipient wallet/account number cannot be the same</span>
                                                    }

                                                    <Form.Group className="poppedinput">
                                                        <Form.Label className="block-level">Enter Amount</Form.Label>
                                                        <Form.Control type="text"
                                                            name="amountToSend"
                                                            // onChange={handleChange}
                                                            
                                                            value={numberWithCommas(values.amountToSend)}
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
                                                            onBlur={() => setFieldTouched('amountToSend', true)}
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
                                                        <Form.Label className="block-level">Narration</Form.Label>
                                                        <Form.Control type="text"
                                                            name="narrationText"
                                                            onChange={handleChange}
                                                            placeholder="Enter description"
                                                            value={values.narrationText}
                                                            className={errors.narrationText && touched.narrationText ? "is-invalid" : null}
                                                             />
                                                        

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

                                            <div className="app-panel inpage">
                                                <div className="footer-with-cta toleft m-0 ">
                                                    <Button variant="secondary"
                                                        type="button"
                                                        // disabled={CreateAccountStep1Request.is_request_processing}
                                                        className="ml-0 onboarding-btn light"
                                                        onClick={() => history.goBack()}
                                                    > Back
                                                         {/* {CreateAccountStep1Request.is_request_processing?'Please wait...' :'Continue'} */}
                                                    </Button>
                                                    <Button variant="secondary"
                                                        type="submit"
                                                        // disabled={CreateAccountStep1Request.is_request_processing}
                                                        className="onboarding-btn"
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
                    <DownloadApp />

                </div>
            </div>
        )
    }

    renderPageWrap = () =>{
        let {isAccountError,
            accountNumber,
            selectedAccount,
            sameAccountError,
            lesserAccountBalanceError} = this.state;

        let beneficiaryData = this.props.confirmBeneficiaryReducer;
        let GetBanksRequest = this.props.GetBanksReducer;
        if(beneficiaryData.request_status === paymentsConstants.STORE_BENEFICIARY_DATA){
            return this.renderTransferForm();
            
        }
       
    }

    
    



    

  
    


    render() {
        
        
        return (
            <Fragment>
                <Helmet>
                    <title>9PSB - Transfer to bank | beneficiary</title>
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
        GetBanksReducer : state.paymentsReducers.GetBanksReducer,
    };
}

export default connect(mapStateToProps)(TransferToBankBeneficiaryDetails);