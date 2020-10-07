import * as React from 'react';

import { connect } from 'react-redux';
import {Fragment} from "react";

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file


import { Helmet } from 'react-helmet';
import Iframe from 'react-iframe'
import {history} from '../../../_helpers/history'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Formik } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import  InAppContainer from '../../../shared/templates/inapp-container'
import  ErrorMessage from '../../../shared/elements/errormessage'
import  DownloadApp from '../../../shared/elements/downloadapp-box'
import  SelectAnAccount from '../../../shared/elements/select-account'
import {encryptAnItem} from '../../../shared/shared-utils/index';

import { numberWithCommas, allowNumbersOnly, validateCreditCardNumber, validateCardExpiry} from '../../../shared/utils';

import {accountActions} from '../../../redux/actions/dashboard/dashboard';
import {dashboardConstants} from '../../../redux/actiontypes/dashboard/dashboard.constants';
import "./styles.scss"; 
class FundWallet extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            user:"",
            screenWidthSize: window.innerWidth,
            showSiderBar: window.innerWidth>=1024?true:false,
            isExpiryValid:null,
            isAccountError:false,
            accountNumber:"",
            formartedDate:"",
            payload:"",
            showModalValidation:false,
            enableCloseModal:false,
            enableGotoSuccess:false
        }
   
        window.addEventListener("resize", ()=>
                this.setState({screenWidthSize: window.innerWidth,
                                showSiderBar: window.innerWidth>=1024?true:false
                }));
    }

    componentDidMount(){
        this.clearRecords()
    }


    clearRecords = ()=>{
        const {dispatch} = this.props;
        dispatch(accountActions.ChargeACard("CLEAR"));
    }

    
    

    setAccountChosen = (selected)=>{
        this.setState({accountNumber: selected.value,isAccountError:false, isAccountSelected:true})
    }

   

    handleDate =(e)=> {
        var date = e.target.value.trim();
        let {eventTriggered} = this.state;
        if(eventTriggered===8 || eventTriggered===46){
           
            this.setState({formartedDate: validateCardExpiry(date,eventTriggered).toString()});
        }else{
            
            this.setState({formartedDate: validateCardExpiry(date).toString()});
        }
       

    }

    handleDateKeyPress=(e)=>{
        var eventTriggered = e.keyCode;
        this.setState({eventTriggered})
        // return eventTriggered;
    }

    sendfundWalletInfo = async (payload)=>{
        const {dispatch} = this.props;

        await dispatch(accountActions.ChargeACard(payload));
    }

    queryCardValidationStaus = async (payload)=>{
        const {dispatch} = this.props;

        await dispatch(accountActions.QueryCardValidationState(payload));
    }

    handleCloseModalValidation = () => {
        this.setState({ showModalValidation: false })
    };

    renderModalForValidation = (details)=>{
        let {showModalValidation, enableCloseModal, enableGotoSuccess} = this.state;
        
        return (
            <Modal show={showModalValidation} onHide={enableCloseModal===true? this.handleCloseModalValidation: ()=>{}} size="lg" centered="true" dialogClassName="modal-40w" animation={false}>
            {/* <Modal show={showModalValidation}  size="lg" centered="true" dialogClassName="modal-40w" animation={false}> */}
                <Modal.Body>
                <Iframe url={details.request_data.response.responseObject.authurl}
                width="100%"
                // height="450px"
                // id="myId"
                className="validation-modal"
                display="initial"
                position="relative"/>
                </Modal.Body>
                
                {enableGotoSuccess===true &&
                    <Modal.Footer>
                        <Button  
                            onClick={()=>history.push("/app/fund-wallet/success")}>
                                Done
                        </Button>
                    </Modal.Footer>
                }
            </Modal>
        )

    }

    renderPageWrap = () =>{
        const {isAccountSelected, 
                accountNumber,
                formartedDate,
                isAccountError,
                isExpiryValid,
                payload,
                showModalValidation,
                } = this.state;

        let validationSchema = Yup.object().shape({
            cardPin: Yup.string()
                .required('Required'),
            depositAmount: Yup.string() 
                .required('Required'),
            cardNumber: Yup.string() 
                .required('Required'),
            cardExpiry: Yup.string()
                .required('Required format is mm/yy'),
            cardCvv: Yup.string() 
                .required('Required'),
        });    
        
        let ChargeACardRequest = this.props.ChargeACardReducer,
            QueryCardValidationStateRequest =  this.props.QueryCardValidationStateReducer;
        
        return(
            <div className="each-section mt-80 res-mt-45">
                {showModalValidation && this.renderModalForValidation(this.props.ChargeACardReducer)}
                <div className="twosided nomargin">
                    <div>
                        <div className="page-section-mainheading app-panel">
                            <div className="border-lines"><span></span><span></span><span></span></div>
                            <h3>Enter funding details</h3>
                        </div>
                        
                        <div className="dashboard-section">
                            <Formik
                                initialValues={{
                                    depositAmount:"",
                                    cardPin:"",
                                    cardNumber:"",
                                    cardExpiry:"",
                                    cardCvv:"",
                                }}

                                validationSchema={validationSchema}
                                onSubmit={(values, { resetForm }) => {

                                    
                                    
                                    if(accountNumber===""){
                                        this.setState({isAccountError:true})
                                    }
                                    if(accountNumber!==""){
                                        this.setState({isAccountError:false})
                                    }

                                   

                                    if(accountNumber!==""){
                                        
                                        let cardDate= formartedDate.split('/'),
                                            payload="";
                                            
                                        if(cardDate[1].length===2 && cardDate[0].length===2){
                                            payload = {
                                                cardNumber: encryptAnItem(values.cardNumber.replace(/ /g, '')),
                                                year: encryptAnItem(cardDate[1]),
                                                month: encryptAnItem(cardDate[0]),
                                                cvv: encryptAnItem(values.cardCvv),
                                                // cvv: values.cardCvv,
                                                pin: encryptAnItem(values.cardPin),
                                                // pin: values.cardPin,
                                                amount: parseFloat(values.depositAmount.replace(/,/g, '')),
                                                acountNumber: accountNumber
                                            }
                                            
                                            this.setState({payload, isExpiryValid: true})
                                            this.sendfundWalletInfo(payload)
                                                .then(()=>{
                                                    if(this.props.ChargeACardReducer.request_status=== dashboardConstants.CHARGE_A_CARD_SUCCESS
                                                        && (this.props.ChargeACardReducer.request_data.response.responseObject.status==="03"
                                                           || this.props.ChargeACardReducer.request_data.response.statusCode==="03")){
                                                    
                                                        this.setState({showModalValidation: true});
                                                        let funcPayload = {
                                                            transactionReference: this.props.ChargeACardReducer.request_data.response.responseObject.transactionreference,
                                                            responsecode: this.props.ChargeACardReducer.request_data.response.responseObject.responsecode,
                                                            uniqueIdentifier: this.props.ChargeACardReducer.request_data.response.uniqueIdentifier,
                                                        }
                                                        
                                                        var execQuery = setInterval(
                                                                        () => {
                                                                        this.queryCardValidationStaus(funcPayload).then(
                                                                            ()=>{
                                                                                if(this.props.QueryCardValidationStateReducer.request_status=== dashboardConstants.QUERY_CARD_VALIDATIONSTATE_SUCCESS
                                                                                    && (this.props.QueryCardValidationStateReducer.request_data.response.responseObject.responseCode==="success")){
                                                                                        
                                                                                        clearInterval(execQuery);
                                                                                        this.setState({enableCloseModal: true, enableGotoSuccess:true})
                                                                                    }
                                                                                    if(this.props.QueryCardValidationStateReducer.request_status=== dashboardConstants.QUERY_CARD_VALIDATIONSTATE_FAILURE){
                                                                                            
                                                                                            clearInterval(execQuery);
                                                                                            this.setState({enableCloseModal: true, enableGotoSuccess:false})
                                                                                        }
                                                                            })
                                                                        }, 2500);

                                                        
                                                         

                                                        
                                                    }
                                                })
                                        }else{
                                            this.setState({payload, isExpiryValid: false})
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

                                                    <Form.Group className="poppedinput">
                                                        <h4 className="panel-heading-text">Enter Amount</h4>
                                                        <div className="panel-helptext">
                                                            Kindly enter amount that you will like to fund your wallet with
                                                        </div>

                                                        <Form.Label className="block-level">Enter Amount</Form.Label>
                                                        {/* <Form.Label className="block-level">Enter Amount(optional)</Form.Label> */}
                                                        <Form.Control type="text"
                                                            name="depositAmount"
                                                            onChange={handleChange}
                                                            value={numberWithCommas(values.depositAmount)}
                                                            className={errors.depositAmount && touched.depositAmount ? "is-invalid" : null}
                                                            required />
                                                        {errors.depositAmount && touched.depositAmount ? (
                                                            <span className="invalid-feedback">{errors.depositAmount}</span>
                                                        ) : null}

                                                    </Form.Group>
                                                    <Form.Group className="poppedinput withselect">

                                                        
                                                        
                                                            <SelectAnAccount
                                                                label = "Select account to fund"
                                                                onChange={(selected) => {
                                                                    this.setAccountChosen(selected)
                                                                    
                                                                }}
                                                                isAccountError={isAccountError}
                                                                accountNumber={accountNumber}
                                                            />
                                                           

                                                    </Form.Group>
                                                    
                                                    

                                                    {/* <Form.Group className="poppedinput">
                                                        <Form.Label className="block-level">Enter Security Pin (optional)</Form.Label>
                                                        
                                                        <Form.Control type="password"
                                                            name="transactionPin"
                                                            onChange={handleChange}
                                                            value={allowNumbersOnly(values.transactionPin)}
                                                            maxLength="4"
                                                            className={errors.transactionPin && touched.transactionPin ? "is-invalid" : null}
                                                            required />
                                                        {errors.transactionPin && touched.transactionPin ? (
                                                            <span className="invalid-feedback">{errors.transactionPin}</span>
                                                        ) : null}

                                                    </Form.Group> */}
                                                    <h4 className="panel-heading-text">Card details</h4>
                                                    <div className="panel-helptext">
                                                        Enter you card details to fund your wallet
                                                    </div>
                                                    <Form.Group className="poppedinput">
                                                        <Form.Label className="block-level">Card Number</Form.Label>
                                                        
                                                        <Form.Control type="text"
                                                            name="cardNumber"
                                                            onChange={handleChange}
                                                            value={validateCreditCardNumber(allowNumbersOnly(values.cardNumber))}
                                                            className={errors.cardNumber && touched.cardNumber ? "is-invalid" : null}
                                                            required />
                                                        {errors.cardNumber && touched.cardNumber ? (
                                                            <span className="invalid-feedback">{errors.cardNumber}</span>
                                                        ) : null}

                                                    </Form.Group>
                                                    <Form.Group className="poppedinput">
                                                        <Form.Label className="block-level">Card PIN</Form.Label>
                                                        
                                                        <Form.Control type="password"
                                                            name="cardPin"
                                                            maxLength="4"
                                                            onChange={handleChange}
                                                            value={allowNumbersOnly(values.cardPin, 4)}
                                                            className={errors.cardPin && touched.cardPin ? "is-invalid" : null}
                                                            required />
                                                        {errors.cardPin && touched.cardPin ? (
                                                            <span className="invalid-feedback">{errors.cardPin}</span>
                                                        ) : null}

                                                    </Form.Group>
                                                    <Form.Row>
                                                        <Col>
                                                            <Form.Group className="poppedinput">
                                                                <Form.Label className="block-level">Expiry Date</Form.Label>

                                                                <Form.Control type="text"
                                                                    name="cardExpiry"
                                                                    onChange={handleChange}
                                                                    value={allowNumbersOnly(values.cardExpiry)}
                                                                    // value={validateCardExpiry(allowNumbersOnly(values.cardExpiry))}
                                                                    className={((errors.cardExpiry && touched.cardExpiry)|| isExpiryValid===false) ? "is-invalid" : null}
                                                                    onChange={(e) => {
                                                                        setFieldValue('cardExpiry', formartedDate)
                                                                        this.handleDate(e);
                                                                    }}
                                                                    maxLength="5"
                                                                    value={formartedDate}
                                                                    //  onKeyPress={checkValue}
                                                                    onKeyDown={this.handleDateKeyPress}
                                                                    placeholder="MM / YY"
                                                                    required />
                                                                {((errors.cardExpiry && touched.cardExpiry) || isExpiryValid===false) ? (
                                                                    <span className="invalid-feedback">{errors.cardExpiry || "Required format is mm/yy"}</span>
                                                                ) : null}
                                                            </Form.Group>
                                                        </Col>
                                                        <Col>
                                                            <Form.Group className="poppedinput">
                                                                <Form.Label className="block-level">CVV</Form.Label>
                                                                
                                                                <Form.Control type="password"
                                                                    name="cardCvv"
                                                                    maxLength="3"
                                                                    onChange={handleChange}
                                                                    value={allowNumbersOnly(values.cardCvv, 3)}
                                                                    className={errors.cardCvv && touched.cardCvv ? "is-invalid" : null}
                                                                    required />
                                                                {errors.cardCvv && touched.cardCvv ? (
                                                                    <span className="invalid-feedback">{errors.cardCvv}</span>
                                                                ) : null}

                                                            </Form.Group>
                                                        </Col>
                                                    </Form.Row>
                                                </div>
                                                
                                            </div>
                                            
                                            
                                            <div className="app-panel inpage">
                                                <div className="footer-with-cta toleft m-0 ">
                                                    <Button variant="secondary"
                                                        type="submit"
                                                        disabled={ChargeACardRequest.is_request_processing}
                                                        className="ml-0 onboarding-btn"
                                                    > 
                                                     {ChargeACardRequest.is_request_processing?'Please wait...' :'Continue'}
                                                    </Button>

                                                </div>
                                            </div>
                                            {
                                                ChargeACardRequest.request_status=== dashboardConstants.CHARGE_A_CARD_FAILURE &&
                                                <ErrorMessage errorMessage={ChargeACardRequest.request_data.error} canRetry={false} retryFunc={()=>this.sendfundWalletInfo(payload)} />
                                            }
                                            
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
                    <title>9PSB - Fund Wallet</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Fund Wallet</h3>
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
        
        ChargeACardReducer : state.accountsReducers.ChargeACardReducer,
        QueryCardValidationStateReducer : state.accountsReducers.QueryCardValidationStateReducer,
    };
}

export default connect(mapStateToProps)(FundWallet);