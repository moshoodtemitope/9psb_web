import * as React from 'react';
import { Link, NavLink} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";


import {history} from '../../../../_helpers/history'
import Alert from 'react-bootstrap/Alert';
import Select from 'react-select';
import Button from 'react-bootstrap/Button'
import LeftCaret from '../../../../assets/images/left-caret.svg';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Helmet } from 'react-helmet';
import Form from 'react-bootstrap/Form';
import  InAppContainer from '../../../../shared/templates/inapp-container'
import  DownloadApp from '../../../../shared/elements/downloadapp-box'
import ErrorMessage from '../../../../shared/elements/errormessage'
import  SelectAnAccount from '../../../../shared/elements/select-account'
import { paymentActions } from '../../../../redux/actions/payments/payments';
import { paymentsConstants } from '../../../../redux/actiontypes/payments/payments.constants';
import {numberWithoutDecimals, allowNumbersOnly, getNetworkProviderWithCode, getDataPlanNameCode} from '../../../../shared/utils';
import "../styles.scss"; 
class BuyDataOthers extends React.Component{
    constructor(props) {
        super(props);
        let getExistingInfo = this.props.saveDataTopUpRecipientDataReducer;
        let getDataPlans = this.props.GetDataTopUpPlansReducer;

        
        this.state={
            isAccountError: false,
            accountNumber: "",
            selectedAccount:"",
            lesserAccountBalanceError:false,
            existingCustomerInfo: (Object.keys(getExistingInfo).length >= 1
                && getExistingInfo.request_status === paymentsConstants.STORE_DATATOPUP_RECIPIENT_DATA)
                ? getExistingInfo.request_data.customerData : '',
            dataPlansInfo: (Object.keys(getDataPlans).length >= 1
                && getDataPlans.request_status === paymentsConstants.FETCH_DATATOPUP_PLANS_SUCCESS
                )
                ? getDataPlans.request_data.response : '',
            selectedProviderDataPlans:[],

        }
        
        if(this.state.dataPlansInfo===""){
            history.push("/app/buy-data/others/choose")
        }

        

        
        
    }

    componentDidMount(){
        this.clearRecords()
      
    }

    clearRecords = ()=>{
        const {dispatch} = this.props;
       
        dispatch(paymentActions.AddDataTopUpBeneficiary("CLEAR"));
        
       
    }

    setAccountChosen = (selected, e)=>{
        
        this.setState({accountNumber: selected.value,
                        isAccountError:false,
                        selectedAccount: selected,
                        isAccountSelected:true})
    }

    proceedWithDetails = (detailsType, payload)=>{
        const{dispatch} = this.props;
        

        if(detailsType==="topup"){
            dispatch(paymentActions.saveDataTopUpRecipientData(payload, null, "others"))
        }
    }

    selectAProvider = (networkId)=>{
        let {dataPlansInfo} = this.state;
        let formattedPlans =[]
        let providerDataPlans = dataPlansInfo.filter(eachPlan=>eachPlan.networkId==networkId);

        providerDataPlans.map(eachPlan=>{
            formattedPlans.push({
                label:`${eachPlan.network}- ${eachPlan.description}`,
                value:eachPlan.amount,
                productId: eachPlan.productId
            })
        })

        this.setState({selectedProviderDataPlans: formattedPlans});
    }



    renderPageWrap = () =>{
        let 
        {isAccountError,
          accountNumber,
          selectedAccount,
          lesserAccountBalanceError,
          submitType,
          dataPlansInfo,
          existingCustomerInfo,
          selectedProviderDataPlans,
          payload} = this.state;


          let AddDataTopUpBeneficiaryRequest = this.props.AddDataTopUpBeneficiaryReducer;
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
                .required('Required')
                .length('11','Enter valid phone number'),
            network: Yup.string()
                .required('Required'),
            amount: Yup.string()
                .required('Required'), 
            selectedPlan: Yup.string()
                // .required('Required'), 
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
                                <h3>Data Top Up</h3>
                            </div>
                        </div>
                        <div className="dashboard-section">
                            <Formik
                                initialValues={{
                                    amount:existingCustomerInfo!==""?numberWithoutDecimals(existingCustomerInfo.lastAmount) || numberWithoutDecimals(existingCustomerInfo.amount):"",
                                    network:existingCustomerInfo!==""?existingCustomerInfo.network:"",
                                    recipient:existingCustomerInfo!==""?existingCustomerInfo.mobileNumber||existingCustomerInfo.recipient:"",
                                    saveBeneficiary:false,
                                    beneficiaryAlias: "",
                                    selectedPlan:""
                                }}

                                validationSchema={validationSchema}
                                onSubmit={(values, { resetForm }) => {
                                    
                                    if(submitType==="saved"){
                                        this.setState({isAccountError:false, lesserAccountBalanceError: false})
                                        let amount = parseFloat(values.amount);
                                        payload = {
                                            network: values.network,
                                            mobileNumber: values.recipient,
                                            displayName: (values.beneficiaryAlias!=="" && values.saveBeneficiary)?values.beneficiaryAlias: null,
                                            lastAmount: amount,
                                            productId:this.state.productId
                                        }
                                        this.setState(({payload}))
                                        this.proceedWithDetails("beneficiary", payload)
                                    }


                                    if(submitType==="topup"){
                                        if(accountNumber!==""){
                                            
                                            let amount = parseFloat(values.amount);
                                            if( parseFloat(selectedAccount.walletBalance)>= amount){
                                                this.setState({isAccountError:false, lesserAccountBalanceError: false})
                                                payload= {
                                                    walletNumber: accountNumber,
                                                    recipient: values.recipient,
                                                    network: values.network,
                                                    transactionType: 2,
                                                    amount:parseFloat(values.amount),
                                                    productId:this.state.productId
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
                                                    Buy data for any other person
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
                                                            placeholder=" "
                                                            maxLength="11"
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
                                                            defaultValue={{
                                                                label:existingCustomerInfo!==""? getNetworkProviderWithCode(existingCustomerInfo.network, providersList):null,
                                                                value: existingCustomerInfo!==""? existingCustomerInfo.network:null
                                                            }}
                                                            options={providersList}
                                                            styles={selectStyle}
                                                            onChange={(selected) => {
                                                                this.selectAProvider(selected.value)
                                                                setFieldValue('network', selected.value)
                                                            }}
                                                            onBlur={()=> setFieldTouched('network', true)}
                                                            className={errors.network && touched.network ? "is-invalid" : null}
                                                            name="network"
                                                        />
                                                        {errors.network && touched.network ? (
                                                            <span className="invalid-feedback">{errors.network}</span>
                                                        ) : null}

                                                    </Form.Group>
                                                 
                                                    {values.network!=="" &&
                                                        <Form.Group className="poppedinput withselect">
                                                            <Form.Label className="block-level">Select Bouquet</Form.Label>
                                                            <Select
                                                                defaultValue={{
                                                                    label:existingCustomerInfo!==""? getDataPlanNameCode(existingCustomerInfo.lastAmount||existingCustomerInfo.amount, existingCustomerInfo.network, dataPlansInfo):null,
                                                                    value: existingCustomerInfo!==""? existingCustomerInfo.lastAmount ||existingCustomerInfo.amount :null
                                                                }}
                                                                options={selectedProviderDataPlans}
                                                                onChange={(selected) => {
                                                                    this.setState({productId:selected.productId})
                                                                    setFieldValue('amount', selected.value)
                                                                }}
                                                                onBlur={()=> setFieldTouched('amount', true)}
                                                                className={errors.amount && touched.amount ? "is-invalid" : null}
                                                                styles={selectStyle}
                                                                name="amount"
                                                            />
                                                            {errors.amount && touched.amount ? (
                                                                <span className="invalid-feedback">{errors.amount}</span>
                                                            ) : null}

                                                        </Form.Group>
                                                    }

                                                    {lesserAccountBalanceError &&
                                                        <Alert variant="danger mt-20">Insufficient account balance</Alert>
                                                    }

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
                                            {AddDataTopUpBeneficiaryRequest.request_status ===paymentsConstants.SAVE_DATATOPUP_BENEFICIARY_FAILURE && 
                                                        
                                                    <ErrorMessage errorMessage={AddDataTopUpBeneficiaryRequest.request_data.error} canRetry={false} retryFunc={()=>this.proceedWithDetails("beneficiary", payload)} />
                                                
                                                
                                            }

                                            <div className="app-panel inpage">
                                                <div className="footer-with-cta toleft m-0 ">
                                                {values.saveBeneficiary===true &&
                                                        <Button variant="secondary"
                                                            type="submit"
                                                            className="ml-0 onboarding-btn grayed"
                                                            disabled={AddDataTopUpBeneficiaryRequest.is_request_processing}
                                                            onClick={()=>this.setState({submitType: "saved"})}
                                                        > 
                                                     {AddDataTopUpBeneficiaryRequest.is_request_processing?'Please wait...' :'Save'}
                                                    </Button>
                                                    }
                                                    {values.saveBeneficiary===false &&
                                                        <Button variant="secondary"
                                                            type="submit"
                                                            className="ml-0 onboarding-btn light"
                                                            onClick={()=>history.push("/app/buy-data/others/choose")}
                                                        > Back
                                                     
                                                    </Button>
                                                    }
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
                    <title>9PSB - Data Top-Up for others</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Data Top-Up for others</h3>
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
        GetDataTopUpPlansReducer: state.paymentsReducers.GetDataTopUpPlansReducer,
        saveDataTopUpRecipientDataReducer : state.paymentsReducers.saveDataTopUpRecipientDataReducer,
        AddDataTopUpBeneficiaryReducer : state.paymentsReducers.AddDataTopUpBeneficiaryReducer,
    };
}

export default connect(mapStateToProps)(BuyDataOthers);