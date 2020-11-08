import * as React from 'react';
import { Link, NavLink} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";




import {history} from '../../../../_helpers/history'
import Alert from 'react-bootstrap/Alert';
import Select from 'react-select';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Formik } from 'formik';
import { Helmet } from 'react-helmet';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import LeftCaret from '../../../../assets/images/left-caret.svg';
import  InAppContainer from '../../../../shared/templates/inapp-container'
import  DownloadApp from '../../../../shared/elements/downloadapp-box'
import  ErrorMessage from '../../../../shared/elements/errormessage'
import  SelectAnAccount from '../../../../shared/elements/select-account'
import {paymentActions} from '../../../../redux/actions/payments/payments';
import {paymentsConstants} from '../../../../redux/actiontypes/payments/payments.constants';

import {numberWithoutDecimals, allowNumbersOnly, getNetworkProviderWithCode} from '../../../../shared/utils';
import "../styles.scss"; 
class BuyAirtimeOthers extends React.Component{
    constructor(props) {
        super(props);
        let getExistingInfo = this.props.saveAirtimeRecipientDataReducer;
        this.state={
            isAccountError: false,
            accountNumber: "",
            selectedAccount:"",
            amountEntered:"",
            lesserAccountBalanceError:false,
            existingCustomerInfo: (Object.keys(getExistingInfo).length >= 1
                && getExistingInfo.request_status === paymentsConstants.STORE_AIRTIME_RECIPIENT_DATA)
                ? getExistingInfo.request_data.customerData : '',
            
        }

        
   
        
    }

    componentDidMount(){
        this.clearRecords()
      
    }

    clearRecords = ()=>{
        const {dispatch} = this.props;
       
        dispatch(paymentActions.AddAirtimeBeneficiary("CLEAR"));
        
       
    }

  
    

    setAccountChosen = (selected, e)=>{
        let {amountEntered} = this.state;
        this.setState({accountNumber: selected.value,
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

    proceedWithDetails = (detailsType, payload)=>{
        const{dispatch} = this.props;
        if(detailsType==="beneficiary"){
            dispatch(paymentActions.AddAirtimeBeneficiary(payload))
        }

        if(detailsType==="topup"){
            dispatch(paymentActions.saveAirtimeRecipientData(payload, null, "others"))
        }
    }

    renderPageWrap = () =>{
        let 
          {isAccountError,
            accountNumber,
            selectedAccount,
            lesserAccountBalanceError,
            submitType,
            existingCustomerInfo,
            payload} = this.state;


           

        let AddAirtimeBeneficiaryRequest = this.props.AddAirtimeBeneficiaryReducer;
        let providersList = [
                            {label:"Airtel", value: 1}, 
                            {label:"9Mobile", value: 2}, 
                            {label:"Globacom", value: 3}, 
                            {label:"MTN", value: 4}];
        const selectStyle = {
            control: base => ({
                ...base,
                // border: 0,
                // This line disable the blue border
                boxShadow: "none"
            })
        };

        let validationSchema = Yup.object().shape({
            recipient: Yup.string()
                .required('Required')
                .min('11','Enter valid phone number'),
            network: Yup.string()
                .required('Required'),
            amount: Yup.string()
                .required('Required'),
        });   
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
                                <h3>Airtime top up for any network</h3>
                            </div>
                        </div>
                        <div className="dashboard-section">
                            <Formik
                                initialValues={{
                                    amount:existingCustomerInfo!==""?numberWithoutDecimals(existingCustomerInfo.lastAmount) || numberWithoutDecimals(existingCustomerInfo.amount):"",
                                    network:existingCustomerInfo!==""?existingCustomerInfo.network:"",
                                    recipient:existingCustomerInfo!==""?existingCustomerInfo.mobileNumber||existingCustomerInfo.recipient:"",
                                    saveBeneficiary:false,
                                    beneficiaryAlias: ""
                                }}

                                validationSchema={validationSchema}
                                onSubmit={(values, { resetForm }) => {

                                    let payload ;
                                    
                                    
                                    if(submitType==="saved"){
                                        this.setState({isAccountError:false, lesserAccountBalanceError: false})
                                        let amount = parseFloat(values.amount.replace(/,/g, ''));
                                        payload = {
                                            network: values.network,
                                            mobileNumber: values.recipient,
                                            displayName: (values.beneficiaryAlias!=="" && values.saveBeneficiary)?values.beneficiaryAlias: null,
                                            lastAmount: amount,
                                        }
                                        this.setState(({payload}))
                                        this.proceedWithDetails("beneficiary", payload)
                                    }

                                    if(submitType==="topup"){
                                        if(accountNumber!==""){
                                            // this.setState({isAccountError:true})
                                            let amount = parseFloat(values.amount.replace(/,/g, ''));
                                            if( parseFloat(selectedAccount.walletBalance)>= amount){
                                                this.setState({isAccountError:false, lesserAccountBalanceError: false})
                                                payload= {
                                                    walletNumber: accountNumber,
                                                    recipient: values.recipient,
                                                    network: values.network,
                                                    transactionType: 2,
                                                    amount: parseInt(values.amount.replace(/,/g, ''))
                                                }
                                                this.setState(({payload}));

                                                
                                                this.proceedWithDetails("topup", payload)
                                            }else{
                                                this.setState({lesserAccountBalanceError:true})
                                            }
                                        }else{
                                            this.setState({isAccountError:true})
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

                                               
                                                <div className="panel-helptext mt-20 centered  m-auto m-100">
                                                    Buy airtime for others on your account
                                                </div>
                                                
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
                                                        Enter recipient&apos;s details
                                                    </div>

                                                    <Form.Group className="poppedinput">
                                                        <Form.Label className="block-level">Phone Number</Form.Label>
                                                        <Form.Control type="text"
                                                            name="recipient"
                                                            onChange={handleChange}
                                                            placeholder=""
                                                            maxLength="11"
                                                            value={allowNumbersOnly(values.recipient, 11)}
                                                            className={errors.recipient && touched.recipient ? "is-invalid" : null}
                                                            required />
                                                        {errors.recipient && touched.recipient ? (
                                                            <span className="invalid-feedback">{errors.recipient}</span>
                                                        ) : null}

                                                    </Form.Group>
                                                    <Form.Group className="poppedinput withselect">
                                                        <Form.Label className="block-level">Select Provider</Form.Label>
                                                        <Select
                                                            defaultValue={{
                                                                label:existingCustomerInfo!==""? getNetworkProviderWithCode(existingCustomerInfo.network, providersList):null,
                                                                value: existingCustomerInfo!==""? existingCustomerInfo.network:null
                                                            }}
                                                            options={providersList}
                                                            styles={selectStyle}
                                                            onChange={(selected) => setFieldValue('network', selected.value)}
                                                            onBlur={()=> setFieldTouched('network', true)}
                                                            className={errors.network && touched.network ? "is-invalid" : null}
                                                            name="network"
                                                        />
                                                        {errors.network && touched.network ? (
                                                            <span className="invalid-feedback">{errors.network}</span>
                                                        ) : null}

                                                    </Form.Group>
                                                 
                                                    
                                                    <Form.Group className="poppedinput">
                                                        <Form.Label className="block-level">Enter Amount</Form.Label>
                                                        <Form.Control type="text"
                                                            name="amount"
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
                                                                    
                                                                    setFieldValue('amount', e.target.value)
                                                                }else{
                                                                    setFieldValue('amount', e.target.value)
                                                                }
                                                            }}
                                                            onBlur={() => setFieldTouched('amount', true)}
                                                            value={numberWithoutDecimals(values.amount)}
                                                            className={((errors.amount && touched.amount) || lesserAccountBalanceError) ? "is-invalid" : null}
                                                            required />
                                                        {errors.amount && touched.amount ? (
                                                            <span className="invalid-feedback">{errors.amount}</span>
                                                        ) : null}

                                                        {lesserAccountBalanceError &&
                                                            <span className="invalid-feedback">Insufficient account balance</span>
                                                        }

                                                    </Form.Group>
                                                    {/* {existingCustomerInfo==="" &&
                                                        <Form.Group className="checkbox-input centered">
                                                            <input type="checkbox"
                                                            name="saveBeneficiary" 
                                                            checked={values.saveBeneficiary? values.saveBeneficiary:null}
                                                            onChange={handleChange} 
                                                            value={values.saveBeneficiary}
                                                            id="save-benficiary"/>
                                                            <label htmlFor="save-benficiary">Save as beneficiary</label>
                                                        </Form.Group>
                                                    } */}
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
                                            {AddAirtimeBeneficiaryRequest.request_status ===paymentsConstants.SAVE_AIRTIME_BENEFICIARY_FAILURE && 
                                                        
                                                    <ErrorMessage errorMessage={AddAirtimeBeneficiaryRequest.request_data.error} canRetry={false} retryFunc={()=>this.proceedWithDetails("beneficiary", payload)} />
                                                
                                                
                                            }
                                            <div className="app-panel inpage">
                                                <div className="footer-with-cta toleft m-0 ">
                                                    {values.saveBeneficiary===true &&
                                                        <Button variant="secondary"
                                                            type="submit"
                                                            className="ml-0 onboarding-btn grayed"
                                                            disabled={AddAirtimeBeneficiaryRequest.is_request_processing}
                                                            onClick={()=>this.setState({submitType: "saved"})}
                                                        > 
                                                     {AddAirtimeBeneficiaryRequest.is_request_processing?'Please wait...' :'Save'}
                                                    </Button>
                                                    }
                                                    {values.saveBeneficiary===false &&
                                                        <Button variant="secondary"
                                                            type="submit"
                                                            className="ml-0 onboarding-btn light"
                                                            onClick={()=> history.goBack()}
                                                        > Back
                                                     
                                                    </Button>
                                                    }
                                                    <Button variant="secondary"
                                                        type="submit"
                                                        disabled={AddAirtimeBeneficiaryRequest.is_request_processing}
                                                        className=" onboarding-btn"
                                                        onClick={()=>this.setState({submitType: "topup"})}
                                                    > Continue
                                                     {/* {CreateAccountStep1Request.is_request_processing?'Please wait...' :'Continue'} */}
                                                    </Button>

                                                </div>
                                            </div>
                                            
                                        </Form>
                                    )}
                            </Formik>
                        </div>
                        
                        <div className="dashboard-section">
                            
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
                    <title>9PSB - Airtime Top-Up others</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Airtime Top Up</h3>
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
        saveAirtimeRecipientDataReducer : state.paymentsReducers.saveAirtimeRecipientDataReducer,
        AddAirtimeBeneficiaryReducer : state.paymentsReducers.AddAirtimeBeneficiaryReducer,
    };
}

export default connect(mapStateToProps)(BuyAirtimeOthers);