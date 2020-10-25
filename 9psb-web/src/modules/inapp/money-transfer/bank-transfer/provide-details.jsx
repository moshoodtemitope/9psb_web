import * as React from 'react';

import { connect } from 'react-redux';
import {Fragment} from "react";

import { Helmet } from 'react-helmet';
import {history} from '../../../../_helpers/history'

import Select from 'react-select';
import Button from 'react-bootstrap/Button'

import { Formik } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import  InAppContainer from '../../../../shared/templates/inapp-container'
import  ErrorMessage from '../../../../shared/elements/errormessage'
import LeftCaret from '../../../../assets/images/left-caret.svg';
import  DownloadApp from '../../../../shared/elements/downloadapp-box'
import  SelectAnAccount from '../../../../shared/elements/select-account'
import {paymentActions} from '../../../../redux/actions/payments/payments';
import {paymentsConstants} from '../../../../redux/actiontypes/payments/payments.constants';

import { numberWithCommas,getBankNameWithCode} from '../../../../shared/utils';
import "../styles.scss"; 
class BankTransferDetails extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            user:"",
            isAccountError: false,
            accountNumber: "",
            amountEntered:"",
            selectedAccount:"",
            lesserAccountBalanceError:false,
            sameAccountError:false
        }
   
        
    }

    componentDidMount(){
        this.clearRecords();
    }


    clearRecords = ()=>{
        const {dispatch} = this.props;
       
        dispatch(paymentActions.confirmBeneficiary("CLEAR"));
       
    }


    setAccountChosen = (selected, e)=>{
        let {amountEntered} = this.state;
        this.setState({accountNumber: selected.value,
                        isAccountError:false,
                        selectedAccount: selected,
                        sameAccountError: selected.value===this.state.destinationAccountNumber?true:false,
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

    

    // proceedToConfirm = (recipientInfo)=>{
    //     const {dispatch} = this.props;
    //     dispatch(paymentActions.saveRecipientData(recipientInfo));
    // }

    proceedWithBeneficiary = (BeneficiaryData, source)=>{
        const {dispatch} = this.props;
        
        this.setState({BeneficiaryData})
        dispatch(paymentActions.confirmBeneficiary(BeneficiaryData, source));
        // history.push("/app/transfer/to-bank/sendTobeneficiary")
    }
    

    loadbanks = ()=>{
        let GetBanksRequest = this.props.GetBanksReducer;

        const {dispatch} = this.props;
        if(GetBanksRequest.request_status !==paymentsConstants.GET_BANKS_SUCCESS){
            dispatch(paymentActions.GetBanks());
        }
    }
    
    renderTransferForm =()=>{
        let 
            GetBanksRequest = this.props.GetBanksReducer,
            confirmBeneficiaryRequest = this.props.confirmBeneficiaryReducer,
            allBanks        = GetBanksRequest.request_data.response;

        let {isAccountError,
            accountNumber,
            selectedAccount,
            sameAccountError,
            BeneficiaryData,
            lesserAccountBalanceError} = this.state;

            

        let banksList = [],
            allbanks = GetBanksRequest.request_data.response;

            allbanks.map((eachbank,index)=>{
                banksList.push({
                    label: eachbank.bankName,
                    value: eachbank.bankCode
                })
            })

        const selectStyle = {
            control: base => ({
                ...base,
                // border: 0,
                // This line disable the blue border
                boxShadow: "none"
            })
        };

        let validationSchema = Yup.object().shape({
            amountToSend: Yup.string()
                .required('Required'),
            destinationAccountNumber: Yup.string()
                .required('Required'),
            bankChosen: Yup.string()
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
                                    <span>New Beneficiary</span>
                                </h3>
                            </div>
                        </div>

                        <div className="dashboard-section">
                            <Formik
                                initialValues={{
                                    narrationText: "",
                                    amountToSend:"",
                                    bankChosen:"",
                                    destinationAccountNumber:""
                                }}

                                validationSchema={validationSchema}
                                onSubmit={(values, { resetForm }) => {

                                    
                                    if(accountNumber===""){
                                        this.setState({isAccountError:true})
                                    }

                                    if(accountNumber!==""){
                                        let amount = parseFloat(values.amountToSend.replace(/,/g, ''));
                                        if(values.destinationAccountNumber !==accountNumber && values.bankChosen==="000"){
                                            if( parseFloat(selectedAccount.walletBalance)>= amount){
                                                this.setState({isAccountError:false,sameAccountError:false, lesserAccountBalanceError: false})

                                                let payload = {
                                                    bankName: getBankNameWithCode(values.bankChosen, allBanks),
                                                    accountNumber: values.destinationAccountNumber,
                                                    sourceAccountNumber: accountNumber,
                                                    bankCode: values.bankChosen,
                                                    amount: amount,
                                                    narration: values.narrationText!==""?values.narrationText:null,
                                                }
                                                
                                                this.proceedWithBeneficiary(payload, "new");
                                            }else{
                                                this.setState({lesserAccountBalanceError:true})
                                            }
                                        }else{
                                            if(values.bankChosen!=="000"){
                                                this.setState({sameAccountError:false})
                                                if(parseFloat(selectedAccount.walletBalance)>= amount){
                                                    this.setState({isAccountError:false,sameAccountError:false, lesserAccountBalanceError: false})

                                                    let payload = {
                                                        bankName: getBankNameWithCode(values.bankChosen, allBanks),
                                                        accountNumber: values.destinationAccountNumber,
                                                        sourceAccountNumber: accountNumber,
                                                        bankCode: values.bankChosen,
                                                        amount: amount,
                                                        narration: values.narrationText!==""?values.narrationText:null,
                                                    }
                                                    
                                                    this.proceedWithBeneficiary(payload, "new");
                                                }else{
                                                    this.setState({lesserAccountBalanceError:true})
                                                }
                                            }else{
                                                this.setState({sameAccountError:true})
                                            }
                                            
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

                                                <div className="form-wrap w-70 mt-40 m-auto pt-20 m-100">
                                                    <Form.Group className="poppedinput withselect">
                                                        <SelectAnAccount
                                                            label="Select Source"
                                                            onChange={(selected) => {
                                                                this.setAccountChosen(selected, selected)

                                                            }}
                                                            isAccountError={isAccountError}
                                                            accountNumber={accountNumber}
                                                        />

                                                    </Form.Group>

                                                    <div className="panel-helptext mt-20 m-100">
                                                        Enter Beneficiary details
                                                    </div>

                                                    <Form.Group className="poppedinput">
                                                        <Form.Label className="block-level">Account Number</Form.Label>
                                                        <Form.Control type="text"
                                                            name="destinationAccountNumber"
                                                            onChange={(e) => {
                                                               
                                                                    this.setState({
                                                                        destinationAccountNumber: e.target.value,
                                                                        sameAccountError: accountNumber===e.target.value?true:false,
                                                                    })
                                                                    setFieldValue('destinationAccountNumber', e.target.value)
                                                                }
                                                            }
                                                            maxLength="10"
                                                            value={values.destinationAccountNumber}
                                                            className={errors.destinationAccountNumber && touched.destinationAccountNumber ? "is-invalid" : null}
                                                            required />
                                                        {errors.destinationAccountNumber && touched.destinationAccountNumber ? (
                                                            <span className="invalid-feedback">{errors.destinationAccountNumber}</span>
                                                        ) : null}

                                                        {sameAccountError &&
                                                            <span className="error-txt">Source and recipient wallet/account number cannot be the same</span>
                                                        }

                                                    </Form.Group>
                                                    <Form.Group className="poppedinput withselect">
                                                        <Form.Label className="block-level">Select Bank</Form.Label>
                                                        <Select
                                                            options={banksList}
                                                            // onChange={handleChange}
                                                            onChange={(selected) => setFieldValue('bankChosen', selected.value)}
                                                            onBlur={()=> setFieldTouched('bankChosen', true)}
                                                            styles={selectStyle}
                                                            // value={values.bankChosen}
                                                            noOptionsMessage={() => `No banks loaded`}
                                                            className={errors.bankChosen && touched.bankChosen ? "is-invalid" : null}
                                                            name="bankChosen"
                                                        />
                                                        {errors.bankChosen && touched.bankChosen ? (
                                                            <span className="invalid-feedback">{errors.bankChosen}</span>
                                                        ) : null}

                                                    </Form.Group>
                                                    <Form.Group className="poppedinput">
                                                        <Form.Label className="block-level">Enter Amount</Form.Label>
                                                        <Form.Control type="text"
                                                            name="amountToSend"
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
                                            {confirmBeneficiaryRequest.request_status ===paymentsConstants.CONFIRM_ACCOUNT_FAILURE && 
                                                <div className="">
                                                    <ErrorMessage errorMessage={confirmBeneficiaryRequest.request_data.error} canRetry={false} retryFunc={()=>this.proceedWithBeneficiary(BeneficiaryData, "new")} />
                                                </div>
                                                
                                            }
                                            <div className="app-panel inpage">
                                                <div className="footer-with-cta toleft m-0 ">
                                                    <Button variant="secondary"
                                                        type="button"
                                                        disabled={confirmBeneficiaryRequest.is_request_processing}
                                                        className="ml-0 onboarding-btn light"
                                                        onClick={() => history.goBack()}
                                                    > Back
                                                     {/* {CreateAccountStep1Request.is_request_processing?'Please wait...' :'Continue'} */}
                                                    </Button>
                                                    <Button variant="secondary"
                                                        type="submit"
                                                        disabled={confirmBeneficiaryRequest.is_request_processing}
                                                        className=" onboarding-btn"
                                                    > 
                                                     {confirmBeneficiaryRequest.is_request_processing?'Please wait...' :'Continue'}
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

        let  GetBanksRequest = this.props.GetBanksReducer,
            allBanks        = GetBanksRequest.request_data.response;

        
            
            return this.renderTransferForm();
    }

    
    



    

  
    


    render() {
        
        
        return (
            <Fragment>
                <Helmet>
                    <title>9PSB - Transfer to account | details</title>
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

export default connect(mapStateToProps)(BankTransferDetails);