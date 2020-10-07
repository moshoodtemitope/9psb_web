import * as React from 'react';
import { Link} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';

import { Helmet } from 'react-helmet';

import {history} from '../../../_helpers/history'
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
import  SelectStateAndLga from '../../../shared/elements/state-and-lga-select'
import { numberWithCommas, allowNumbersOnly} from '../../../shared/utils';
import {encryptAnItem} from '../../../shared/shared-utils/index';
import {accountActions} from '../../../redux/actions/dashboard/dashboard';
import {dashboardConstants} from '../../../redux/actiontypes/dashboard/dashboard.constants';
import "./styles.scss"; 
class CashDeposit extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            user:"",
            screenWidthSize: window.innerWidth,
            showSiderBar: window.innerWidth>=1024?true:false,
            isLGaError:false,
            isStateError:false,
            isAccountError:false,
            stateChosen:"",
            lgaChosen:"",
            accountNumber:""
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
        dispatch(accountActions.DepositCashWithAgent("CLEAR"));
    }

    
    

    handleDeposit = (depositPayload)=>{

        const {dispatch} = this.props;
         dispatch(accountActions.DepositCashWithAgent(depositPayload));
        
    }
    setAccountChosen = (selected)=>{
        this.setState({accountNumber: selected.value,isAccountError:false, isAccountSelected:true})
    }

    handleSelectState = (e) => {
        
        
        
        this.setState({ stateChosen: e.stateId, isStateError:false })
    }

    handleSelectLGA = (e) => {
        
        
        this.setState({ lgaChosen: e, isLGaError:false })
    }

    renderPageWrap = () =>{
        const {isAccountSelected, 
                accountNumber,
                isLGaError,
                stateChosen,
                lgaChosen,
                isAccountError,
                payload,
                isStateError} = this.state;

        let validationSchema = Yup.object().shape({
            // transactionPin: Yup.string()
            //     .length(4, 'Max of characters'),
            depositAmount: Yup.string()
                .required('Required'),
        });    
        // let DepositCashWithAgentRequest = this.props.DepositCashWithAgentReducer
        
        return(
            <div className="each-section mt-80 res-mt-45">
                <div className="twosided nomargin">
                    <div>
                        <div className="page-section-mainheading app-panel">
                            <div className="border-lines"><span></span><span></span><span></span></div>
                            <h3>Find a 9PSB agent near you</h3>
                        </div>
                        
                        <div className="dashboard-section">
                            <Formik
                                initialValues={{
                                    // transactionPin:"",
                                    depositAmount:"",
                                }}

                                validationSchema={validationSchema}
                                onSubmit={(values, { resetForm }) => {
                                    let payload ={};
                                    
                                    
                                    if(accountNumber===""){
                                        this.setState({isAccountError:true})
                                    }
                                    if(accountNumber!==""){
                                        this.setState({isAccountError:false})
                                    }

                                    if(lgaChosen===""){
                                        // payload.lgaCode = "";
                                        this.setState({isLGaError:true})
                                    }

                                    if(stateChosen===""){
                                        // payload.stateCode = "";
                                        this.setState({isStateError:true})
                                    }

                                    if(accountNumber!=="" && lgaChosen!=="" && stateChosen!==""){
                                    // if(accountNumber!==""){

                                        // let payload = {
                                        //     walletNumber: accountNumber,
                                        //     depositAmount: parseFloat(values.depositAmount.replace(/,/g, '')),
                                        //     lgaCode:lgaChosen,
                                        //     stateCode:stateChosen
                                        // }

                                        payload.stateCode = stateChosen;
                                        payload.lgaCode = lgaChosen;
                                        payload.walletNumber = accountNumber;
                                        payload.depositAmount = parseFloat(values.depositAmount.replace(/,/g, ''));


                                        history.push("/app/cash-deposit/confirm", {
                                            walletNumber: accountNumber,
                                            depositAmount: parseFloat(values.depositAmount.replace(/,/g, '')),
                                            lgaCode:lgaChosen,
                                            // transactionPin: values.transactionPin!==""?encryptAnItem(values.transactionPin):null,
                                            stateCode:stateChosen
                                        });
                                        this.setState({payload})

                                        
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
                                                <div className="panel-helptext">
                                                    Enter your current location details to locate our agents closest to you
                                                    where you can deposit cash.
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
                                                    <SelectStateAndLga
                                                        onStateChange={(selected) => {
                                                            this.handleSelectState(selected)
                                                            
                                                        }}
                                                        onLGAChange = {(selected) => {
                                                            this.handleSelectLGA(selected)
                                                            
                                                        }}
                                                        isLGaError={isLGaError}
                                                        isStateError={isStateError}

                                                    />
                                                    {/* <Form.Group className="poppedinput withselect">
                                                        <Form.Label className="block-level">Select State</Form.Label>
                                                        <Select
                                                            options={IdOptions}
                                                            onChange={this.setAccountChosen}
                                                            styles={selectStyle}
                                                            name="stateChosen"
                                                        />
                                                        {errors.stateChosen && touched.stateChosen ? (
                                                            <span className="invalid-feedback">{errors.stateChosen}</span>
                                                        ) : null}

                                                    </Form.Group>
                                                    <Form.Group className="poppedinput withselect">
                                                        <Form.Label className="block-level">Select LGA</Form.Label>
                                                        <Select
                                                            options={IdOptions}
                                                            onChange={this.setAccountChosen}
                                                            styles={selectStyle}
                                                            name="lgaChosen"
                                                        />
                                                        {errors.lgaChosen && touched.lgaChosen ? (
                                                            <span className="invalid-feedback">{errors.lgaChosen}</span>
                                                        ) : null}

                                                    </Form.Group> */}
                                                    <Form.Group className="poppedinput">
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
                                                </div>
                                            </div>
                                            

                                            <div className="app-panel inpage">
                                                <div className="footer-with-cta toleft m-0 ">
                                                    <Button variant="secondary"
                                                        type="submit"
                                                        // disabled={DepositCashWithAgentRequest.is_request_processing}
                                                        className="ml-0 onboarding-btn"
                                                    > Continue
                                                     {/* {DepositCashWithAgentRequest.is_request_processing?'Please wait...' :'Continue'} */}
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
                    <title>9PSB - Cash Deposit</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Cash Deposit</h3>
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
        DepositCashWithAgentReducer : state.accountsReducers.DepositCashWithAgentReducer,
    };
}

export default connect(mapStateToProps)(CashDeposit);