import * as React from 'react';
import { Link, NavLink} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";




import Select from 'react-select';
import Button from 'react-bootstrap/Button'
import { Helmet } from 'react-helmet';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import  InAppContainer from '../../../shared/templates/inapp-container'
import  DownloadApp from '../../../shared/elements/downloadapp-box'

import  SelectAnAccount from '../../../shared/elements/select-account'
import {paymentActions} from '../../../redux/actions/payments/payments';
import {paymentsConstants} from '../../../redux/actiontypes/payments/payments.constants';

import { numberWithCommas,numberWithoutDecimals, allowNumbersOnly, getNetworkProviderWithCode} from '../../../shared/utils';

import "./styles.scss"; 
class BuyAirtime extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            psbuser:JSON.parse(localStorage.getItem('psb-auth')),
            isAccountError: false,
            accountNumber: "",
            selectedAccount:"",
            amountEntered:"",
            lesserAccountBalanceError:false,
        }
   
      
    }

    componentDidMount(){

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
        

        if(detailsType==="topup"){
            dispatch(paymentActions.saveAirtimeRecipientData(payload, undefined, "self"))
        }
    }

    renderPageWrap = () =>{
        let 
          {isAccountError,
            accountNumber,
            selectedAccount,
            lesserAccountBalanceError,
            submitType,
            psbuser,
            existingCustomerInfo,
            payload} = this.state;

         let providersList = [
                            {label:"Airtel", value: 1}, 
                            {label:"9Mobile", value: 2}, 
                            {label:"Globacom", value: 3}, 
                            {label:"Mtn", value: 4}];
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
                .required('Required'),
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
                            <h3>Airtime top up for any network</h3>
                        </div>
                        <div className="dashboard-section">
                            <Formik
                                initialValues={{
                                    amount:"",
                                    network:"",
                                    recipient:psbuser.mobileNumber,
                                    saveBeneficiary:false,
                                    beneficiaryAlias: ""
                                }}

                                validationSchema={validationSchema}
                                onSubmit={(values, { resetForm }) => {

                                    if(submitType==="topup"){
                                        if(accountNumber!==""){
                                            
                                            let amount = parseFloat(values.amount.replace(/,/g, ''));
                                            if( parseFloat(selectedAccount.walletBalance)>= amount){
                                                this.setState({isAccountError:false, lesserAccountBalanceError: false})
                                                payload= {
                                                    walletNumber: accountNumber,
                                                    recipient: values.recipient,
                                                    network: values.network,
                                                    transactionType: 1,
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

                                                <div className="action-options">
                                                    <NavLink exact to="/app/buy-airtime" className="each-option">
                                                        Yourself
                                                    </NavLink>
                                                    <NavLink exact to="/app/buy-airtime/others/choose" className="each-option">
                                                        Others
                                                    </NavLink>
                                                </div>
                                                <div className="panel-helptext mt-20 centered  m-auto m-100">
                                                    Buy airtime for yourself on the number on your account
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

                                                    <Form.Group className="poppedinput">
                                                        <Form.Label className="block-level">Phone Number</Form.Label>
                                                        <Form.Control type="text"
                                                            name="recipient"
                                                            onChange={handleChange}
                                                            placeholder=""
                                                            maxLength="13"
                                                            value={allowNumbersOnly(values.recipient)}
                                                            className={errors.recipient && touched.recipient ? "is-invalid" : null}
                                                            required />
                                                        {errors.recipient && touched.recipient ? (
                                                            <span className="invalid-feedback">{errors.recipient}</span>
                                                        ) : null}

                                                    </Form.Group>

                                                    <Form.Group className="poppedinput withselect">
                                                        <Form.Label className="block-level">Select Provider</Form.Label>
                                                        <Select
                                                           
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

                                                    <div className="panel-helptext mt-20 m-100">
                                                        How much would you like to recharge?
                                                    </div>
                                                 
                                                    
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
                                                </div>
                                            </div>

                                            <div className="app-panel inpage">
                                                <div className="footer-with-cta toleft m-0 ">
                                                   
                                                    <Button variant="secondary"
                                                        type="submit"
                                                        // disabled={CreateAccountStep1Request.is_request_processing}
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
                    <title>9PSB - Airtime Top Up</title>
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
    };
}

export default connect(mapStateToProps)(BuyAirtime);