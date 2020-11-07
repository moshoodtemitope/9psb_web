import * as React from 'react';
import { Link, NavLink} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";



import {history} from '../../../_helpers/history'
import LeftCaret from '../../../assets/images/left-caret.svg';
import Select from 'react-select';
import Button from 'react-bootstrap/Button'
import { Helmet } from 'react-helmet';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal'
import  InAppContainer from '../../../shared/templates/inapp-container'
import  DownloadApp from '../../../shared/elements/downloadapp-box'
import {encryptAnItem} from '../../../shared/shared-utils/index';
import  SelectAnAccount from '../../../shared/elements/select-account'
import {paymentActions} from '../../../redux/actions/payments/payments';
import {paymentsConstants} from '../../../redux/actiontypes/payments/payments.constants';
import  ErrorMessage from '../../../shared/elements/errormessage'

import { numberWithCommas,allowNumbersOnly} from '../../../shared/utils';

import "./styles.scss"; 
class CreateSavings extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            psbuser:JSON.parse(localStorage.getItem('psb-auth')),
            showSavingsPrompt:false,
            lessAmountError:false,
            walletNumber:this.props.location.state && this.props.location.state.walletNumber
                                    ? this.props.location.state.walletNumber:""
        }

        if(this.state.walletNumber===""){
            history.push("/app/dashboard");
          }
   
      
    }

    componentDidMount(){
        this.clearRecords()
    }

    clearRecords = ()=>{
        const {dispatch} = this.props;
        dispatch(paymentActions.GetSavingsInterest("CLEAR"));
        dispatch(paymentActions.CreateSavings("CLEAR"));
    }

    getInterestDetails = async(payload)=>{
        const{dispatch} = this.props;
        

       
        await dispatch(paymentActions.GetSavingsInterest(payload))
        
    }

    createASavings = async(payload)=>{
        const{dispatch} = this.props;
        

       
        await dispatch(paymentActions.CreateSavings(payload))
        
    }

    handleCloseSavingsPromptOptions = () => {
        this.setState({ showSavingsPrompt: false })
    };


    proceedWithDetails = async(payload)=>{
        
        this.getInterestDetails(payload)
            .then(()=>{
                if(this.props.GetSavingsInterestReducer.request_status ===paymentsConstants.GET_SAVINGS_INTEREST_SUCCESS){
                    this.setState({showSavingsPrompt: true})
                }
            })

       
        
        
    }

    renderSavingsInterestDetails = () => {
        let { showSavingsPrompt, 
            newSavingsPayload, 
            psbuser,
            payload } = this.state;

        let checkValidationSchema = Yup.object().shape({
            transactionPin: Yup.string()
                .required('Required'),
                
          });

        let 
            getSavingsInterestRequest =  this.props.GetSavingsInterestReducer,
            createSavingsRequest =  this.props.CreateSavingsReducer,
            savingsDetails = getSavingsInterestRequest.request_data.response;
            // console.log("savings data", getSavingsInterestRequest.request_data.response)
        return (
            <Modal show={showSavingsPrompt} onHide={createSavingsRequest.is_request_processing !==true ? this.handleCloseSavingsPromptOptions: ()=>{} } size="lg" centered="true" dialogClassName="modal-40w" animation={false}>
                <Modal.Header className="txt-header modal-bg modal-header">
                    <Modal.Title>
                        <div className="modal-bg">
                            <h2>Confirm Savings</h2>
                        </div>
                    </Modal.Title>
                    <div className="closeicon" onClick={createSavingsRequest.is_request_processing !==true ? this.handleCloseSavingsPromptOptions: ()=>{} }>X</div>
                </Modal.Header>

                <Modal.Body>
                    <Formik
                        initialValues={{
                            transactionPin: '',
                        }}

                        validationSchema={checkValidationSchema}
                        onSubmit={(values, { resetForm }) => {

                           
                           
                            let newSavingsPayload = {
                                accountNumber: payload.accountNumber,
                                amount: payload.amount,
                                lockPeriodDays: payload.lockDownDays,
                                transactionPin: encryptAnItem(values.transactionPin)
                            };
                            this.setState({newSavingsPayload})

                            
                            
                            this.createASavings(newSavingsPayload)
                            


                            
                           
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
                                                You will earn {savingsDetails.interestRate}% upfront on your savings
                                            </div>
                                            <div>
                                                During these {savingsDetails.days} days you won’t be able to withdraw your funds except you break the savings at {savingsDetails.penaltyRate}% charge of your saved amount
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






                                    
                                    {(createSavingsRequest.request_status === paymentsConstants.CREATE_SAVINGS_FAILURE) &&



                                        <ErrorMessage errorMessage={createSavingsRequest.request_data.error} canRetry={true} retryFunc={() => this.createASavings(newSavingsPayload)} />

                                    }
                                    <div className="footer-with-cta toleft mt-30">
                                        <Button variant="secondary"
                                            type="button"
                                            disabled={createSavingsRequest.is_request_processing}
                                            className="ml-0 onboarding-btn light"
                                            onClick={createSavingsRequest.is_request_processing !==true ? this.handleCloseSavingsPromptOptions: ()=>{} }
                                        > Cancel
                                            {/* {CreateAccountStep1Request.is_request_processing?'Please wait...' :'Continue'} */}
                                        </Button>
                                        <Button variant="secondary"
                                            type="submit"
                                            disabled={createSavingsRequest.is_request_processing}
                                            className=" onboarding-btn"
                                        >  {createSavingsRequest.is_request_processing ? 'Please wait...' : 'Continue'}
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
    

    renderPageWrap = () =>{
        let 
          {
            lessAmountError,
            walletNumber,
            showSavingsPrompt,
            payload} = this.state;
        let getSavingsInterestRequest =  this.props.GetSavingsInterestReducer;
        let durationList = [
            { label: "30 days", value: 30 },
            { label: "60 days", value: 60 },
            { label: "90 days", value: 90 },
        ];
        const selectStyle = {
            control: base => ({
                ...base,
                // border: 0,
                // This line disable the blue border
                boxShadow: "none"
            })
        };

        let validationSchema = Yup.object().shape({
            duration: Yup.string()
                .required('Required'),
            amount: Yup.string()
                .required('Required'),
        });   

        
        return(
            <div className="each-section mt-80 res-mt-45">
                <div className="twosided nomargin">
                    <div>
                    {showSavingsPrompt===true && this.renderSavingsInterestDetails()}
                        <div className="page-section-mainheading app-panel">
                            <div className="border-lines"><span></span><span></span><span></span></div>
                            <div className="subheading-title">
                                <div className="backnav" onClick={()=>{
                                    history.goBack()
                                }}>
                                    <img src={LeftCaret} alt=""/>
                                    <span>Back</span>
                                </div>
                                <h3>Earn interest on your savings</h3>
                            </div>
                            
                        </div>
                        <div className="dashboard-section">
                            <Formik
                                initialValues={{
                                    amount:"",
                                    duration:"",
                                }}

                                validationSchema={validationSchema}
                                onSubmit={(values, { resetForm }) => {

                                    
                                       
                                            
                                    let amount = parseFloat(values.amount.replace(/,/g, ''));
                                    if(amount > 1){
                                        this.setState({lessAmountError: false})
                                        payload= {
                                            lockDownDays: values.duration,
                                            amount,
                                            accountNumber: walletNumber
                                        }
                                        this.setState(({payload}));

                                        
                                        this.proceedWithDetails(payload)
                                    }else{
                                        this.setState({lessAmountError:true})
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

                                                    

                                                    
                                                 
                                                    
                                                    <Form.Group className="poppedinput">
                                                        <Form.Label className="block-level">Enter amount you want to save</Form.Label>
                                                        <Form.Control type="text"
                                                            name="amount"
                                                            onChange={handleChange}
                                                            onBlur={() => setFieldTouched('amount', true)}
                                                            value={numberWithCommas(values.amount)}
                                                            className={((errors.amount && touched.amount) || lessAmountError) ? "is-invalid" : null}
                                                            required />
                                                        {errors.amount && touched.amount ? (
                                                            <span className="invalid-feedback">{errors.amount}</span>
                                                        ) : null}

                                                        {lessAmountError &&
                                                            <span className="invalid-feedback">Insufficient account balance</span>
                                                        }

                                                    </Form.Group>
                                                    <Form.Group className="withselect">
                                                        <Form.Label className="block-level">Select Period</Form.Label>
                                                        <Select
                                                           
                                                            options={durationList}
                                                            styles={selectStyle}
                                                            onChange={(selected) => setFieldValue('duration', selected.value)}
                                                            onBlur={()=> setFieldTouched('duration', true)}
                                                            className={errors.duration && touched.duration ? "is-invalid" : null}
                                                            name="duration"
                                                        />
                                                        {errors.duration && touched.duration ? (
                                                            <span className="invalid-feedback">{errors.duration}</span>
                                                        ) : null}

                                                    </Form.Group>
                                                </div>
                                            </div>

                                            {getSavingsInterestRequest.request_status ===paymentsConstants.GET_SAVINGS_INTEREST_FAILURE && 
                                                
                                                <ErrorMessage errorMessage={getSavingsInterestRequest.request_data.error} canRetry={false} retryFunc={()=>this.proceedWithDetails(payload)} />
                                            
                                            }

                                            <div className="app-panel inpage">
                                                <div className="footer-with-cta toleft m-0 ">
                                                    <Button variant="secondary"
                                                        type="button"
                                                        disabled={getSavingsInterestRequest.is_request_processing}
                                                        className="ml-0 onboarding-btn light"
                                                        onClick={()=>history.goBack()}
                                                    > Cancel
                                                     {/* {CreateAccountStep1Request.is_request_processing?'Please wait...' :'Continue'} */}
                                                    </Button>
                                                    <Button variant="secondary"
                                                        type="submit"
                                                        disabled={getSavingsInterestRequest.is_request_processing}
                                                        className=" onboarding-btn"
                                                        onClick={()=>this.setState({submitType: "topup"})}
                                                    > 
                                                     {getSavingsInterestRequest.is_request_processing?'Please wait...' :'Continue'}
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
                    <title>9PSB - Savings</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Add savings</h3>
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
        GetSavingsInterestReducer : state.paymentsReducers.GetSavingsInterestReducer,
        CreateSavingsReducer : state.paymentsReducers.CreateSavingsReducer,
    };
}

export default connect(mapStateToProps)(CreateSavings);