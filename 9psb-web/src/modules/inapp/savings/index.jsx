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
import {paymentsConstants} from '../../../redux/actiontypes/payments/payments.constants';


import { numberWithCommas, getDateFromISO, allowNumbersOnly} from '../../../shared/utils';

class GetAllSavings extends React.Component{
    constructor(props) {
        super(props);
        
        this.state={
            psbuser:JSON.parse(localStorage.getItem('psb-auth')),
            showSavingsPrompt:false,
            showCheckCashoutErrorPrompt:false
            
        }

        if(this.state.psbuser.savings===null){
            history.push("/app/dashboard")
        }
   
        
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
        let {psbuser}= this.state,
            payload={
                accountNumber: psbuser.savings.walletNumber
            }

        
        dispatch(paymentActions.GetSavings(payload));
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

        if (GetSavingsRequest.request_status === paymentsConstants.GET_ALL_SAVINGS_FAILURE) {
            return (
                <ErrorMessage errorMessage={GetSavingsRequest.request_data.error} canRetry={true} retryFunc={() => this.getAllCustomerSavings()} />
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
        return (
            <div className="dashboard-section">
                <div className="app-panel inpage">
                    {showSavingsPrompt===true && this.renderSavingsInterestDetails()}
                    {showCheckCashoutErrorPrompt===true && this.renderCheckCashoutErrorPrompt()}
                    <div className="w-80 m-100 m-auto ">
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

                                                        {/* {
                                                            eachSavings.savingsStatus===1 && 
                                                            <img src={CaretDown} alt="" />
                                                        } */}
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
                                                        
                                                        {/* {eachSavings.savingsStatus===1 &&
                                                            <div className="savings-status done">{eachSavings.savingsStatusDesc} </div>
                                                        }
                                                        {eachSavings.savingsStatus===1 &&
                                                            <div className="savings-status cancelled">{eachSavings.savingsStatusDesc} </div>
                                                        } */}
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
                    </div>
                </div>
            </div>
        )
    }

    
    renderPageWrap = () =>{
        let 
        {
            psbuser,
        } = this.state;
            
            let GetSavingsRequest = this.props.GetSavingsReducer;
            
        return(
            <div className="each-section mt-80 res-mt-45">
                <div className="twosided nomargin">
                    <div>
                    <div className="page-section-mainheading app-panel">
                            <div className="border-lines"><span></span><span></span><span></span></div>
                            <div className="subheading-title">
                                {/* <div className="backnav" onClick={()=>{
                                    history.goBack()
                                }}>
                                    <img src={LeftCaret} alt=""/>
                                    <span>Back</span>
                                </div> */}
                                <h3>View Savings</h3>
                            </div>
                            
                        </div>

                        {GetSavingsRequest.request_status !== paymentsConstants.GET_ALL_SAVINGS_SUCCESS && 
                            <div className="dashboard-section">
                                <div className="app-panel inpage">
                                    {this.renderPreload()}
                                </div>
                            </div>
                        }
                        {GetSavingsRequest.request_status === paymentsConstants.GET_ALL_SAVINGS_SUCCESS && 
                            this.renderAllSavings()
                            
                        }
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
                    <title>9PSB - Savings</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>9PSB - My Savings</h3>
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
    };
}

export default connect(mapStateToProps)(GetAllSavings);