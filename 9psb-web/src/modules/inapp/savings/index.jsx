import * as React from 'react';
import { Link, NavLink} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';


import {history} from '../../../_helpers/history'
import { Formik } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button'
import Select from 'react-select';
import {encryptAnItem} from '../../../shared/shared-utils/index';
import  InAppContainer from '../../../shared/templates/inapp-container'
import  DownloadApp from '../../../shared/elements/downloadapp-box'
import { Helmet } from 'react-helmet';
import PageLoader from '../../../shared/elements/pageloader'
import ErrorMessage from '../../../shared/elements/errormessage'
import Done from '../../../assets/images/done.svg';
import CaretUp from '../../../assets/images/caret-up.svg';
import CaretDown from '../../../assets/images/caret-down.svg';
import {paymentActions} from '../../../redux/actions/payments/payments';
import BillsIcon from '../../../assets/images/ac-bills.svg';
import SavingsIc1 from '../../../assets/images/savings-ic1.svg';
import SavingsIc2 from '../../../assets/images/savings-ic2.svg';

import {paymentsConstants} from '../../../redux/actiontypes/payments/payments.constants';
import {onboardingActions} from '../../../redux/actions/onboarding/onboarding';
import {onboardingConstants} from '../../../redux/actiontypes/onboarding/onboarding.constants'
import { numberWithCommas, getDateFromISO, allowNumbersOnly} from '../../../shared/utils';
import './styles.scss';
class GetAllSavings extends React.Component{
    constructor(props) {
        super(props);
        
        this.state={
            psbuser:JSON.parse(localStorage.getItem('psb-auth')),
            showSavingsPrompt:false,
            showCheckCashoutErrorPrompt:false
            
        }

        // if(this.state.psbuser.savings===null){
        //     history.push("/app/dashboard")
        // }
   
        
    }

    componentDidMount(){
        this.clearRecords();
        this.getAllCustomerSavings();
    }


    cashoutASavings = async(payload)=>{
        const{dispatch} = this.props;
        

       
        await dispatch(paymentActions.CashoutSavings(payload))
        
    }

    getAllCustomerSavings = () => {
        const { dispatch } = this.props;
        let {psbuser}= this.state;

        if (psbuser.savings) {
            let payload = {
                accountNumber: psbuser.savings.walletNumber
            }


            dispatch(paymentActions.GetSavings(payload));
        }
    }

    getCashoutDetails = (termDepositId) => {
        this.checkCashout(termDepositId)
            .then(()=>{
                if(this.props.CheckSavingsCashoutReducer.request_status === paymentsConstants.CHECK_SAVINGS_CASHOUT_SUCCESS){
                   
                    this.setState({showSavingsPrompt: true})
                }

                if(this.props.CheckSavingsCashoutReducer.request_status === paymentsConstants.CHECK_SAVINGS_CASHOUT_FAILURE){
                    
                    this.setState({showCheckCashoutErrorPrompt: true})
                }
            })
    }

    checkCashout =  async(termDepositId) => {
        const { dispatch } = this.props;
        let {psbuser}= this.state,
            payload={
                savingsAccount: psbuser.savings.walletNumber,
                termDepositId
            };
            this.setState({payload})
            this.clearRecords();
        
        await dispatch(paymentActions.CheckSavingsCashout(payload))
    }

    clearRecords = ()=>{
        const {dispatch} = this.props;
        dispatch(paymentActions.CheckSavingsCashout("CLEAR"));
        dispatch(paymentActions.CashoutSavings("CLEAR"));
    }

    renderPreload = () =>{
        let GetSavingsRequest = this.props.GetSavingsReducer;
        

        if (GetSavingsRequest.request_status === paymentsConstants.GET_ALL_SAVINGS_PENDING) {
            return (
                <div>
                    <PageLoader />
                </div>

            )
        }

        
    }

    handleCloseSavingsPromptOptions = () => {
       
        this.setState({ showSavingsPrompt: false })
        this.clearRecords();
    };

    handleCloseCheckCashoutErrorPrompt = () => {
        this.clearRecords();
        this.setState({ showCheckCashoutErrorPrompt: false })
    };

    goToNewSavings = ()=>{
        let {psbuser} = this.state;
       
        history.push("/app/savings/create", {walletNumber:psbuser.savings.walletNumber})
        
    }

    renderSavingsInterestDetails = () => {
        let { showSavingsPrompt, 
            cashoutSavingsPayload, 
            psbuser,
            payload } = this.state;

        let checkValidationSchema = Yup.object().shape({
            transactionPin: Yup.string()
                .required('Required'),
                
          });

        let 
            getCashoutInfoRequest =  this.props.CheckSavingsCashoutReducer,
            cashoutSavingsRequest =  this.props.CashoutSavingsReducer,
            savingsDetails = getCashoutInfoRequest.request_data.response;
           
        if (cashoutSavingsRequest.request_status !== paymentsConstants.CASHOUT_SAVINGS_SUCCESS) { 
            return (
                <Modal show={showSavingsPrompt} onHide={cashoutSavingsRequest.is_request_processing !== true ? this.handleCloseSavingsPromptOptions : () => { }} size="lg" centered="true" dialogClassName="modal-40w" animation={false}>
                    <Modal.Header className="txt-header modal-bg modal-header">
                        <Modal.Title>
                            <div className="modal-bg">
                                <h2>Savings withdrawal</h2>
                            </div>
                        </Modal.Title>
                        <div className="closeicon" onClick={this.handleCloseSavingsPromptOptions}>X</div>
                    </Modal.Header>

                    <Modal.Body>
                        <Formik
                            initialValues={{
                                transactionPin: '',
                            }}

                            validationSchema={checkValidationSchema}
                            onSubmit={(values, { resetForm }) => {



                                let cashoutSavingsPayload = {
                                    savingsAccount: payload.savingsAccount,
                                    termDepositId: payload.termDepositId,
                                    transactionPin: encryptAnItem(values.transactionPin)
                                };
                                this.setState({ cashoutSavingsPayload })



                                this.cashoutASavings(cashoutSavingsPayload)





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
                                        className="form-content mt-0 w-80">




                                        <div className="form-wrap">
                                            <div className="form-text mb-10">
                                                <div className="light-text mb-10">Hi {psbuser.firstName}</div>
                                                <div className="light-text mb-10">
                                                    You are about to withdraw &#x20A6;{numberWithCommas(savingsDetails.amount, true)} from your account to your wallet {payload.savingsAccount}.

                                                </div>
                                                <div>
                                                    You will be charged {numberWithCommas(savingsDetails.penaltyRate, true)}% liquidation fee of &#x20A6;{numberWithCommas(savingsDetails.penaltyAmount, true)} because it’s before maturity date
                                                </div>
                                            </div>
                                            <Form.Group className=" poppedinput inputfield mb-0">
                                                <Form.Control type="password"
                                                    name="transactionPin"
                                                    onChange={handleChange}
                                                    placeholder="Transaction PIN"
                                                    value={allowNumbersOnly(values.transactionPin, 4)}
                                                    className={errors.transactionPin && touched.transactionPin ? "is-invalid mb-0" : "mb-0"}
                                                />
                                                {errors.transactionPin && touched.transactionPin ? (
                                                    <span className="invalid-feedback">{errors.transactionPin}</span>
                                                ) : null}


                                            </Form.Group>

                                        </div>







                                        {(cashoutSavingsRequest.request_status === paymentsConstants.CASHOUT_SAVINGS_FAILURE) &&



                                            <ErrorMessage errorMessage={cashoutSavingsRequest.request_data.error} canRetry={true} retryFunc={() => this.cashoutASavings(cashoutSavingsPayload)} />

                                        }
                                        <div className="footer-with-cta toleft mt-30">
                                            <Button variant="secondary"
                                                type="button"
                                                disabled={cashoutSavingsRequest.is_request_processing}
                                                className="ml-0 onboarding-btn light"
                                                onClick={cashoutSavingsRequest.is_request_processing !== true ? this.handleCloseSavingsPromptOptions : () => { }}
                                            > Cancel
                                                {/* {CreateAccountStep1Request.is_request_processing?'Please wait...' :'Continue'} */}
                                            </Button>
                                            <Button variant="secondary"
                                                type="submit"
                                                disabled={cashoutSavingsRequest.is_request_processing}
                                                className=" onboarding-btn"
                                            >  {cashoutSavingsRequest.is_request_processing ? 'Please wait...' : 'Withdraw'}
                                            </Button>

                                        </div>
                                        {/* {loginRequest.request_status === authConstants.LOGIN_USER_FAILURE &&
                                        <Alert variant="danger mt-20">
                                            {loginRequest.request_data.error !== undefined ? loginRequest.request_data.error : null}


                                        </Alert>
                                    } */}

                                    </Form>
                                )}
                        </Formik>

                    </Modal.Body>

                </Modal>
            )
        }

        if (cashoutSavingsRequest.request_status === paymentsConstants.CASHOUT_SAVINGS_SUCCESS) { 
            return (
                <Modal show={showSavingsPrompt} onHide={this.handleCloseSavingsPromptOptions} size="lg" centered="true" dialogClassName="modal-40w" animation={false}>
                    <Modal.Header className="txt-header modal-bg modal-header">
                        <Modal.Title>
                            <div className="modal-bg">
                                <h2>Savings withdrawal</h2>
                            </div>
                        </Modal.Title>
                        <div className="closeicon" onClick={this.handleCloseSavingsPromptOptions}>X</div>
                    </Modal.Header>

                    <Modal.Body>
                        <Formik
                            initialValues={{
                              
                            }}

                            
                            onSubmit={(values, { resetForm }) => {
                                this.handleCloseSavingsPromptOptions()
                                this.getAllCustomerSavings();

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
                                        className="form-content mt-0 w-80">




                                        <div className="form-wrap">
                                            <div className="form-text mb-10">
                                                <div className="light-text mb-10">Hi {psbuser.firstName}</div>
                                                <div className="light-text mb-10">
                                                    Your  withdrawal of &#x20A6;{numberWithCommas(savingsDetails.amount, true)} from your account wallet {payload.savingsAccount} was successful.

                                                </div>
                                               
                                            </div>
                                            

                                        </div>






                                        <div className="footer-with-cta toleft mt-30">
                                           
                                            <Button variant="secondary"
                                                type="submit"
                                                
                                                className=" onboarding-btn"
                                            >  Okay
                                            </Button>

                                        </div>
                                        {/* {loginRequest.request_status === authConstants.LOGIN_USER_FAILURE &&
                                        <Alert variant="danger mt-20">
                                            {loginRequest.request_data.error !== undefined ? loginRequest.request_data.error : null}


                                        </Alert>
                                    } */}

                                    </Form>
                                )}
                        </Formik>

                    </Modal.Body>

                </Modal>
            )
        }
    }

    renderCheckCashoutErrorPrompt = () => {
        let { showCheckCashoutErrorPrompt } = this.state;

        

        let 
            getCashoutInfoRequest =  this.props.CheckSavingsCashoutReducer;
        return (
            <Modal show={showCheckCashoutErrorPrompt} onHide={this.handleCloseCheckCashoutErrorPrompt } size="lg" centered="true" dialogClassName="modal-40w" animation={false}>
                <Modal.Header className="txt-header modal-bg modal-header">
                    <Modal.Title>
                        <div className="modal-bg">
                            <h2>Cashout Error</h2>
                        </div>
                    </Modal.Title>
                    <div className="closeicon" onClick={this.handleCloseCheckCashoutErrorPrompt}>X</div>
                </Modal.Header>

                <Modal.Body>
                    <Formik
                        initialValues={{
                           
                        }}

                        onSubmit={(values, { resetForm }) => {
                            this.handleCloseCheckCashoutErrorPrompt()
                           
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
                                    className="form-content mt-0 w-80">









                                    
                                    {(getCashoutInfoRequest.request_status === paymentsConstants.CASHOUT_SAVINGS_FAILURE) &&



                                        <ErrorMessage errorMessage={getCashoutInfoRequest.request_data.error} canRetry={false}  />

                                    }
                                    <div className="footer-with-cta toleft mt-30">
                                        
                                       
                                        <Button variant="secondary"
                                            type="subimit"
                                            className=" onboarding-btn"
                                        >  Okay
                                        </Button>

                                    </div>
                                    {/* {loginRequest.request_status === authConstants.LOGIN_USER_FAILURE &&
                                    <Alert variant="danger mt-20">
                                        {loginRequest.request_data.error !== undefined ? loginRequest.request_data.error : null}


                                    </Alert>
                                } */}

                                </Form>
                            )}
                    </Formik>

                </Modal.Body>

            </Modal>
        )
    }

    handleCollapseState = (itemId)=>{
        let elementSelected="" ;
        if(itemId && itemId.parentNode && itemId.parentNode.id){
            elementSelected = document.querySelector(`#${itemId.parentNode.id}`)
        }else{
            if(itemId.parentNode){
                elementSelected = document.querySelector(`#${itemId.parentNode.parentNode.id}`)
            }
            
        }
        if(elementSelected !==""){
            
            if(elementSelected.classList.contains("uncollapsed")){
                elementSelected.classList.remove("uncollapsed")
                elementSelected.classList.add("collapsed")
                return false;
            }

            if(elementSelected.classList.contains("collapsed")){
                elementSelected.classList.remove("collapsed")
                elementSelected.classList.add("uncollapsed")
                return false;
            }
        }
        
    }

    renderAllSavings = ()=>{
        let GetSavingsRequest = this.props.GetSavingsReducer,
            allSavings = GetSavingsRequest.request_data.response,
            getCashoutInfoRequest =  this.props.CheckSavingsCashoutReducer,
            CheckSavingsCashoutRequest = this.props.CheckSavingsCashoutReducer;

           
            let 
            {
              
              showSavingsPrompt,
              showCheckCashoutErrorPrompt,
              payload} = this.state;
        if(allSavings.length >=1){
            return (
                <div className="dashboard-section">
                    {/* <div className="app-panel inpage"> */}
                        <div className="savings-tabs">
                            <NavLink exact to="/app/savings">
                                Active savings plan
                            </NavLink>
                            {/* <NavLink exact to="/app/savings/history">
                                Savings history
                            </NavLink> */}
                        </div>
                        <div className="page-section-mainheading app-panel">
                            <div className="border-lines"><span></span><span></span><span></span></div>
                            <div className="subheading-title">
                                <h3 className="text-left">My Savings</h3>
                            </div>

                        </div>
                        
                        {showSavingsPrompt===true && this.renderSavingsInterestDetails()}
                        {showCheckCashoutErrorPrompt===true && this.renderCheckCashoutErrorPrompt()}
                        <div className="all-savings-list">
                            {
                                allSavings.map((eachSavings, index) => {
                                    return(
                                        <div key={index} className="each-savings-info collapsed" id={`item-${index}`}>
                                            <div className="saving-detail">
                                                <div className="amount-info">
                                                <div className="amount-text">&#x20A6;{numberWithCommas(eachSavings.amount, true)}</div>
                                                    <div className="interest-txt">{numberWithCommas(eachSavings.interestRate, true)}% Interest</div>
                                                </div>
                                                <div className={eachSavings.savingsStatus===1?"saving-status ongoing":"saving-status done"}>
                                                    {eachSavings.savingsStatusDesc}
                                                </div>
                                            </div>
                                            <div className="saving-control" onClick={(e)=>{e.preventDefault(); this.handleCollapseState(e.target)}}>
                                                <img src={CaretDown} className="caretdown" alt="" onClick={(e)=>{ e.preventDefault(); this.handleCollapseState(e)}} />
                                                <img src={CaretUp} className="caretup" alt="" onClick={(e)=>{ e.preventDefault(); this.handleCollapseState(e)}} />
                                            </div>
                                            <div className="other-details-wrap">
                                                <div className="date-info">
                                                    <div className="date-started">Saved: {getDateFromISO(eachSavings.startDate)}</div>
                                                    <div className="date-matured">Maturity: {getDateFromISO(eachSavings.maturityDate)} </div>
                                                </div>
                                                <div className="cta-wrapper">
                                                    <Button variant="secondary"
                                                        type="submit"
                                                        disabled={CheckSavingsCashoutRequest.is_request_processing}
                                                        className=" onboarding-btn"
                                                        onClick={() => this.getCashoutDetails(eachSavings.id)}
                                                    >
                                                        Withdraw
                                                        
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                )})
                            
                            }
                            
                            
                        </div>
                        {/* <div className="w-80 m-100 m-auto ">
                            
                            <div className="blocked-list">
                                    {
                                        allSavings.map((eachSavings, index) => {
                                            return(
                                                <div key={index} className="savings-bar mb-20">
                                                    <div>
                                                        <div className="amount-info">
                                                            <div className="amount-saved">&#x20A6;{numberWithCommas(eachSavings.amount, true)}</div>
                                                            <div className="interest-rate">{numberWithCommas(eachSavings.interestRate, true)}%</div>
                                                            
                                                        </div>
                                                        <div className="date-info">
                                                            <div className="date-saved">Date saved: {getDateFromISO(eachSavings.startDate)}</div>
                                                            <div className="maturity-date">Maturity: {getDateFromISO(eachSavings.maturityDate)}</div>
                                                            
                                                        </div>
                                                        <div className="savings-ctas">
                                                            {eachSavings.savingsStatus===1 &&
                                                                <span className="savings-status pending">{eachSavings.savingsStatusDesc} </span>
                                                            }
                                                            {eachSavings.savingsStatus!==1 &&
                                                                <span className="savings-status">{eachSavings.savingsStatusDesc} </span>
                                                            }
                                                            {
                                                                eachSavings.savingsStatus===1 && 
                                                                <img src={CaretUp} alt="" />
                                                            }

                                                            
                                                            {eachSavings.savingsStatus===1 &&
                                                                <div className="footer-with-cta centered m-0 ">
                                                                    <Button variant="secondary"
                                                                        type="button"
                                                                        className="ml-0 onboarding-btn light"
                                                                        onClick={() => history.push("/app/dashboard")}
                                                                    > Cancel 
                                                            
                                                                    </Button>
                                                                    <Button variant="secondary"
                                                                        type="submit"
                                                                        disabled={CheckSavingsCashoutRequest.is_request_processing}
                                                                        className=" onboarding-btn"
                                                                        onClick={() => this.getCashoutDetails(eachSavings.id)}
                                                                    >
                                                                        Withdraw
                                                                        
                                                                    </Button>

                                                                </div>
                                                            }
                                                            
                                                            
                                                        </div>
                                                    </div>
                                                    {(getCashoutInfoRequest.request_status === paymentsConstants.CHECK_SAVINGS_CASHOUT_FAILURE) &&

                                                        <Alert variant="danger">
                                                            {getCashoutInfoRequest.request_data.error || "An error occured please try again later."}
                                                        </Alert>

                                                        

                                                    }
                                                </div>
                                            )
                                        })
                                    }
                            
                                    {
                                        allSavings.map((eachSavings, index) => {
                                            return(
                                                <div key={index} className="savings-bar mb-20">
                                                    <div>
                                                        <div className="amount-info">
                                                            <div className="amount-saved">&#x20A6;{numberWithCommas(eachSavings.amount, true)}</div>
                                                            <div className="interest-rate">{numberWithCommas(eachSavings.interestRate, true)}%</div>
                                                            
                                                        </div>
                                                        <div className="date-info">
                                                            <div className="date-saved">Date saved: {getDateFromISO(eachSavings.startDate)}</div>
                                                            <div className="maturity-date">Maturity: {getDateFromISO(eachSavings.maturityDate)}</div>
                                                            
                                                        </div>
                                                        <div className="savings-ctas">
                                                            {eachSavings.savingsStatus===1 &&
                                                                <span className="savings-status pending">{eachSavings.savingsStatusDesc} </span>
                                                            }
                                                            {eachSavings.savingsStatus!==1 &&
                                                                <span className="savings-status">{eachSavings.savingsStatusDesc} </span>
                                                            }
                                                            {
                                                                eachSavings.savingsStatus===1 && 
                                                                <img src={CaretUp} alt="" />
                                                            }

                                                           
                                                            {eachSavings.savingsStatus===1 &&
                                                                <div className="footer-with-cta centered m-0 ">
                                                                    <Button variant="secondary"
                                                                        type="button"
                                                                        className="ml-0 onboarding-btn light"
                                                                        onClick={() => history.push("/app/dashboard")}
                                                                    > Cancel 
                                                            
                                                                    </Button>
                                                                    <Button variant="secondary"
                                                                        type="submit"
                                                                        disabled={CheckSavingsCashoutRequest.is_request_processing}
                                                                        className=" onboarding-btn"
                                                                        onClick={() => this.getCashoutDetails(eachSavings.id)}
                                                                    >
                                                                        Withdraw
                                                                        
                                                                    </Button>

                                                                </div>
                                                            }
                                                            
                                                            
                                                        </div>
                                                    </div>
                                                    {(getCashoutInfoRequest.request_status === paymentsConstants.CHECK_SAVINGS_CASHOUT_FAILURE) &&

                                                        <Alert variant="danger">
                                                            {getCashoutInfoRequest.request_data.error || "An error occured please try again later."}
                                                        </Alert>

                                                        

                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                    
                                

                            </div>
                        </div> */}
                    {/* </div> */}
                </div>
            )
        }else{
            return(
                <div className="dashboard-section">
                    
                    
                    <div className="savings-tabs">
                        <NavLink exact to="/app/savings">
                            Active savings plan
                        </NavLink>
                        {/* <NavLink exact to="/app/savings/history">
                            Savings history
                        </NavLink> */}
                    </div>
                    
                    <div className="page-section-mainheading app-panel">
                        <div className="border-lines"><span></span><span></span><span></span></div>
                        <div className="subheading-title">
                            <h3 className="text-left">My Savings</h3>
                        </div>

                    </div>
                    {/* <div className="all-savings-list">
                        <div className="each-savings-info collapsed" id="item-22">
                            <div className="saving-detail">
                                <div className="amount-info">
                                <div className="amount-text">&#x20A6;{numberWithCommas(30000, true)}</div>
                                    <div className="interest-txt">5% Interest</div>
                                </div>
                                <div className="saving-status done">
                                    Matured
                                </div>
                            </div>
                            <div className="saving-control" onClick={(e)=>{e.preventDefault(); this.handleCollapseState(e.target)}}>
                                <img src={CaretDown} className="caretdown" alt="" onClick={(e)=>{ e.preventDefault(); this.handleCollapseState(e)}} />
                                <img src={CaretUp} className="caretup" alt="" onClick={(e)=>{ e.preventDefault(); this.handleCollapseState(e)}} />
                            </div>
                            <div className="other-details-wrap">
                                <div className="date-info">
                                    <div className="date-started">Saved: 07/09/2020</div>
                                    <div className="date-matured">Maturity: 07/09/2016 </div>
                                </div>
                                <div className="cta-wrapper">
                                    <Button variant="secondary"
                                        type="submit"
                                        // disabled={CheckSavingsCashoutRequest.is_request_processing}
                                        className=" onboarding-btn"
                                        // onClick={() => this.getCashoutDetails(eachSavings.id)}
                                    >
                                        Withdraw
                                        
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="each-savings-info collapsed" id="item-20">
                            <div className="saving-detail">
                                <div className="amount-info">
                                    <div className="amount-text">&#x20A6;{numberWithCommas(30000, true)}</div>
                                    <div className="interest-txt">5% Interest</div>
                                </div>
                                <div className="saving-status ongoing">
                                    In progress
                                </div>
                            </div>
                            <div className="saving-control" onClick={(e)=>{e.preventDefault(); this.handleCollapseState(e.target)}}>
                                <img src={CaretDown} className="caretdown" alt="" onClick={(e)=>{ e.preventDefault(); this.handleCollapseState(e)}} />
                                <img src={CaretUp} className="caretup" alt="" onClick={(e)=>{ e.preventDefault(); this.handleCollapseState(e)}} />
                            </div>
                            <div className="other-details-wrap">
                                <div className="date-info">
                                    <div className="date-started">Saved: 07/09/2020</div>
                                    <div className="date-matured">Maturity: 07/09/2016 </div>
                                </div>
                                <div className="cta-wrapper">
                                    <Button variant="secondary"
                                        type="submit"
                                        // disabled={CheckSavingsCashoutRequest.is_request_processing}
                                        className=" onboarding-btn"
                                        // onClick={() => this.getCashoutDetails(eachSavings.id)}
                                    >
                                        Withdraw
                                        
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    <div className="app-panel nosavings">
                        <img src={SavingsIc1} alt=""/>
                        <div className="upgrading-heading">No Savings yet</div>
                        <div className="upgrade-txt">
                            You presently don't have any savings
                        </div>
                        <div className="upgrade-cta">
                            <Button variant="secondary"
                                type="button"
                                onClick={() => this.goToNewSavings()}
                                className="ml-0 onboarding-btn"
                            > Add savings
                                
                            </Button>
                        </div>
                    </div>
                </div>
            )
        }
    }


    handleCloseUpgradeOptions = () => {
        if(this.props.UpgradeFetchDetailsReducer.request_status !== onboardingConstants.UPGRADE_FETCH_DETAILS_PENDING){
            this.setState({ showUpgradePrompt: false })
        }
    };
    renderUpgradeOptions = () => {
        let { showUpgradePrompt, bvnDetailsPayload, psbuser } = this.state;

        let checkValidationSchema = Yup.object().shape({
            upgradeOption: Yup.string()
                .required('Required'),
            theBVN: Yup.string()
                .when('upgradeOption',{
                    is:(value)=>value==="1",
                    then: Yup.string()
                        .required('Required')
                        .min(10, 'Valid BVN only')
                        .max(11, 'Valid BVN only')
                        
                }),
            
                
          });

        let upgradeOptions,
            UpgradeFetchDetailsRequest =  this.props.UpgradeFetchDetailsReducer;

        if (psbuser.isBvnLinked === true) {
            upgradeOptions = [
                { value: "0", label: 'Provide your details instead' },
            ];
        }else{
            upgradeOptions = [
                { value: "1", label: 'BVN' },
                { value: "0", label: 'Provide your details instead' },
            ];
        }
            
        return (
            <Modal show={showUpgradePrompt} onHide={this.handleCloseUpgradeOptions} size="lg" centered="true" dialogClassName="modal-40w" animation={false}>
                <Modal.Header className="txt-header modal-bg modal-header">
                    <Modal.Title>
                        <div className="modal-bg">
                            <h2>Update your account</h2>
                            <div className="modal-helptxt">Increase your transaction limit</div>
                        </div>
                    </Modal.Title>
                    <div className="closeicon" onClick={this.handleCloseUpgradeOptions}>X</div>
                </Modal.Header>

                <Modal.Body>
                    <Formik
                        initialValues={{
                            upgradeOption: '',
                            theBVN: ''
                        }}

                        validationSchema={checkValidationSchema}
                        onSubmit={(values, { resetForm }) => {

                            
                            if (values.upgradeOption === "1" && values.theBVN!=="") {
                                let bvnDetails = {
                                    bvnNumber:   values.theBVN
                                };
                                this.setState({bvnDetailsPayload: bvnDetails})

                                
                                this.getBVNDetails(bvnDetails)
                                


                            }
                            if(values.upgradeOption === "0"){
                                history.push("/app/account-settings/account-upgrade")
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
                                    className="form-content mt-0 w-70">




                                    <div className="form-wrap">
                                        <Form.Group className="poppedinput withselect">
                                            {/* <Form.Group className="onboardinginput withselect"> */}
                                            <Form.Label className="block-level">Verification method</Form.Label>
                                            <Select
                                                options={upgradeOptions}
                                                onChange={(selected) => setFieldValue('upgradeOption', selected.value)}
                                                onBlur={() => setFieldTouched('upgradeOption', true)}
                                                className={errors.upgradeOption && touched.upgradeOption ? "is-invalid" : null}
                                                name="upgradeOption"
                                            />
                                            {errors.upgradeOption && touched.upgradeOption ? (
                                                <span className="invalid-feedback">{errors.upgradeOption}</span>
                                            ) : null}
                                        </Form.Group>


                                        {values.upgradeOption === "1" &&
                                            <Form.Group className="inputfield mb-0">
                                                <Form.Control type="text"
                                                        name="theBVN"
                                                        onChange={handleChange}
                                                        placeholder="Enter BVN number"
                                                        value={allowNumbersOnly(values.theBVN,11)}
                                                        className={errors.theBVN && touched.theBVN ? "is-invalid mb-0" : "mb-0"}
                                                    />
                                                {errors.theBVN && touched.theBVN ? (
                                                    <span className="invalid-feedback">{errors.theBVN}</span>
                                                ) : null}
                                                <div className="bvn-info text-left">
                                                    Dial *565*0# to get you BVN
                                            </div>

                                            </Form.Group>
                                        }
                                    </div>






                                    
                                    {(UpgradeFetchDetailsRequest.request_status === onboardingConstants.UPGRADE_FETCH_DETAILS_FAILURE) &&



                                        <ErrorMessage errorMessage={UpgradeFetchDetailsRequest.request_data.error} canRetry={UpgradeFetchDetailsRequest.request_data.error!=="Your account has already been linked to a BVN"?true:false} retryFunc={() => this.getBVNDetails(bvnDetailsPayload)} />

                                    }
                                    <div className="footer-with-cta toleft ">
                                        <Button variant="secondary"
                                            type="submit"
                                            disabled={UpgradeFetchDetailsRequest.is_request_processing}
                                            className="ml-0 onboarding-btn"
                                        >  {UpgradeFetchDetailsRequest.is_request_processing ? 'Please wait...' : 'Continue'}
                                        </Button>

                                    </div>
                                    {/* {loginRequest.request_status === authConstants.LOGIN_USER_FAILURE &&
                                    <Alert variant="danger mt-20">
                                        {loginRequest.request_data.error !== undefined ? loginRequest.request_data.error : null}


                                    </Alert>
                                } */}

                                </Form>
                            )}
                    </Formik>

                </Modal.Body>

            </Modal>
        )
    }

    handleUpgradePrompt = ()=>{
        let {psbuser} = this.state;
        const {dispatch} = this.props;
        dispatch(onboardingActions.UpgradeFetchDetails("CLEAR"));

        
        if(psbuser.kycLevel===1){
            history.push("/app/account-settings/account-upgrade")
        }else{
            this.setState({showUpgradePrompt: true})
        }
    }
    renderUpgradeToSave =()=>{
        return(
            <div className="twosided nomargin mt-40 res-mt-45">
                <div className="savings-wrap">
                    <div className="savings-heading-panel">
                        <div className="wallet-balance">
                            <div className="each-summary-title">9rasave balance</div>
                            <div className="wallet-amount">&#x20A6;0.00</div>
                            {/* <div className="wallet-amount">&#x20A6;{numberWithCommas(`${defaultAccount.walletBalance}`, true)}</div> */}
                        </div>
                        {/* <div className="fund-wallet-cta">
                            <Button variant="primary"
                                type="button"
                                className="ml-0 mt-20 fundwallet-btn"
                                // onClick={() => this.goToNewSavings()}
                            >  Add Savings
                            </Button>
                        </div> */}
                    </div>
                    <div className="app-panel nosavings">
                        <img src={SavingsIc2} alt=""/>
                        <div className="upgrading-heading">Upgrade account to start saving</div>
                        <div className="upgrade-txt">
                            Increase your spending limit and also save your funds and earn interest
                        </div>
                        <div className="upgrade-cta">
                            <Button variant="secondary"
                                type="button"
                                onClick={()=>this.handleUpgradePrompt()}
                                className="ml-0 onboarding-btn"
                            > Upgrade Now
                                
                            </Button>
                        </div>
                    </div>
                </div>
                <DownloadApp />
            </div>
        )
    }

   

    
    renderPageWrap = () =>{
        let 
        {
            psbuser,
            showUpgradePrompt
        } = this.state;
            
            let GetSavingsRequest = this.props.GetSavingsReducer;
           
        if (this.state.psbuser.savings!==null) {
            return (
                <div className="each-section mt-30 res-mt-45">
                    {showUpgradePrompt===true && this.renderUpgradeOptions()}
                    <div className="twosided nomargin">
                        <div>
                            {GetSavingsRequest.request_status === paymentsConstants.GET_ALL_SAVINGS_SUCCESS &&
                                <div className="savings-heading-panel">
                                    <div className="wallet-balance">
                                        <div className="each-summary-title">9rasave balance</div>
                                        <div className="wallet-amount">&#x20A6;{numberWithCommas(JSON.parse(localStorage.getItem('psb-auth')).savings.walletBalance, true)}</div>
                                        {/* <div className="wallet-amount">&#x20A6;{numberWithCommas(`${defaultAccount.walletBalance}`, true)}</div> */}
                                    </div>
                                    <div className="fund-wallet-cta">
                                        <Button variant="primary"
                                            type="button"
                                            className="ml-0 mt-20 fundwallet-btn"
                                            onClick={() => this.goToNewSavings()}
                                        >  Add Savings
                                        </Button>
                                    </div>
                                </div>
                            }
                            

                            {GetSavingsRequest.request_status === paymentsConstants.GET_ALL_SAVINGS_PENDING &&
                                <div className="dashboard-section">
                                    <div className="app-panel inpage">
                                        {this.renderPreload()}
                                    </div>
                                </div>
                            }
                            {GetSavingsRequest.request_status === paymentsConstants.GET_ALL_SAVINGS_FAILURE &&
                                    <ErrorMessage errorMessage={GetSavingsRequest.request_data.error} canRetry={true} retryFunc={() => this.getAllCustomerSavings()} />
                                
                            }
                            {GetSavingsRequest.request_status === paymentsConstants.GET_ALL_SAVINGS_SUCCESS &&
                                this.renderAllSavings()

                            }
                        </div>
                        <DownloadApp />

                    </div>
                </div>
            )
        }
        if(psbuser.kycLevel !== 2 && psbuser.kycLevel !== undefined ){
            return(
                <div>
                    {showUpgradePrompt===true && this.renderUpgradeOptions()}
                    {this.renderUpgradeToSave()}
                </div>
            )
            
        }

        if(this.state.psbuser.savings ===null){
            return(
                <div className="twosided nomargin mt-40 res-mt-45">
                    {showUpgradePrompt===true && this.renderUpgradeOptions()}
                    <div className="savings-wrap">
                        <div className="app-panel nosavings">
                            <img src={SavingsIc1} alt=""/>
                            <div className="upgrading-heading">No savings account found</div>
                        </div>
                    </div>
                    <DownloadApp />
                </div>
            )
        }

        
    }

    
    



    

  
    


    render() {
        
        
        return (
            <Fragment>
                <Helmet>
                    <title>9PSB - Savings</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading bland">
                        <h3> My Savings</h3>
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
        GetSavingsReducer : state.paymentsReducers.GetSavingsReducer,
        CheckSavingsCashoutReducer : state.paymentsReducers.CheckSavingsCashoutReducer,
        CashoutSavingsReducer : state.paymentsReducers.CashoutSavingsReducer,
        UpgradeFetchDetailsReducer : state.onboardingReducers.UpgradeFetchDetailsReducer,
        
    };
}

export default connect(mapStateToProps)(GetAllSavings);