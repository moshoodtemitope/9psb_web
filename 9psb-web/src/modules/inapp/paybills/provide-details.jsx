import * as React from 'react';

import { connect } from 'react-redux';
import {Fragment} from "react";


import { Helmet } from 'react-helmet';
import {history} from '../../../_helpers/history'
import Alert from 'react-bootstrap/Alert';
import Select from 'react-select';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Formik } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import LeftCaret from '../../../assets/images/left-caret.svg';
import  InAppContainer from '../../../shared/templates/inapp-container'
import  DownloadApp from '../../../shared/elements/downloadapp-box'
import PageLoader from '../../../shared/elements/pageloader'
import ErrorMessage from '../../../shared/elements/errormessage'
import  SelectAnAccount from '../../../shared/elements/select-account'
import { paymentActions } from '../../../redux/actions/payments/payments';
import { paymentsConstants } from '../../../redux/actiontypes/payments/payments.constants';

import { numberWithCommas} from '../../../shared/utils';
import "./styles.scss"; 
class BillDetails extends React.Component{
    constructor(props) {
        super(props);
        let billsCatsInfo = this.props.GetBillsCategoriesReducer,
            billersInCatInfo = this.props.GetBillersByCategoryReducer;
        this.state={
            user:"",
            billCategories: ((Object.keys(billsCatsInfo).length >= 1) && billsCatsInfo.request_status === paymentsConstants.GET_BILLS_CATEGORIES_SUCCESS)
                ? billsCatsInfo.request_data.response : '',
            billersInCatData: ((Object.keys(billersInCatInfo).length >= 1) && billersInCatInfo.request_status === paymentsConstants.GET_BILLERS_BY_CATEGORY_SUCCESS)
                ? billersInCatInfo.request_data.response : '',

            isAccountError: false,
            accountNumber: "",
            selectedAccount:"",
            lesserAccountBalanceError:false,
            isAmountFixed:"true",
            amountToPay:"",
            
        }
        
        if(this.state.billCategories==="" || this.state.billersInCatData===""
            || this.props.location.state===undefined){
            history.push("/app/paybills")
        }
        {
            this.billCategory = this.props.match.params.billCategory;
            this.billlerId  = this.props.location.state.billId;

            this.billerName = this.state.billersInCatData.filter(eachBiller=>eachBiller.billerId===this.billlerId)[0].billerName;
            this.billerInfo = this.state.billersInCatData.filter(eachBiller=>eachBiller.billerId===this.billlerId)[0].categoryDescription;
            this.customFieldItem = this.state.billersInCatData.filter(eachBiller=>eachBiller.billerId===this.billlerId)[0].customerField1;
        
        }
        
        
    }

    componentDidMount(){
        this.getAllBillPaymentItems()
    }

    setAccountChosen = (selected, e)=>{
        let {amountToPay} = this.state;
        this.setState({accountNumber: selected.value,
                        isAccountError:false,
                        selectedAccount: selected,
                        isAccountSelected:true})

        if (amountToPay !== "") {
            if (parseFloat(selected.walletBalance) >= amountToPay) {
                this.setState({ lesserAccountBalanceError: false })
            } else {
                this.setState({ lesserAccountBalanceError: true })
            }
        }
    }

    getAllBillPaymentItems = () => {
        const { dispatch } = this.props;
        dispatch(paymentActions.validateCustomerForBillPayment("CLEAR"));
        dispatch(paymentActions.makeCustomerPaymentForBill("CLEAR"));
        let requestQuery =`?BillerId=${this.billlerId}&CategoryId=${this.billCategory}`;
        dispatch(paymentActions.GetAllBillerPaymentItem(requestQuery));
    }

    proceedWithDetails = (payload)=>{
        const{dispatch} = this.props;
        
       
        dispatch(paymentActions.validateCustomerForBillPayment(payload))
        
    }


    renderPageContent = ()=>{
        let 
          {isAccountError,
            accountNumber,
            selectedAccount,
            lesserAccountBalanceError,
            isAmountFixed,
            selectedBouquetName,
            payload} = this.state;

            
            let GetAllBillerPaymentItemRequest =  this.props.GetAllBillerPaymentItemReducer,
                validateCustomerForBillPaymentReducerRequest =  this.props.validateCustomerForBillPaymentReducer,
                allBouquet = GetAllBillerPaymentItemRequest.request_data.response,
                allBouquetList =[];

            let validationSchema = Yup.object().shape({
                    chosenBouquet: Yup.string()
                        .required('Required'),
                    amount: Yup.string()
                        .required('Required'),
                    customField: Yup.string()
                        .required('Required'),
                });  

                allBouquet.map(eachBouquet=>{
                    if(eachBouquet.currencyCode!==null && eachBouquet.itemFee!==null){
                        allBouquetList.push({
                            label:`${eachBouquet.paymentItemName} -${eachBouquet.currencyCode} ${eachBouquet.itemFee}`,
                            value: eachBouquet.paymentCode,
                            isAmountFixed:eachBouquet.isAmountFixed,
                            itemAmount: eachBouquet.amount
                        })
                    }

                    if(eachBouquet.currencyCode===null && eachBouquet.itemFee!==null){
                        allBouquetList.push({
                            label:`${eachBouquet.paymentItemName} - ${eachBouquet.itemFee}`,
                            value: eachBouquet.paymentCode,
                            isAmountFixed:eachBouquet.isAmountFixed,
                            itemAmount: eachBouquet.amount
                        })
                    }

                    if(eachBouquet.currencyCode!==null && eachBouquet.itemFee===null){
                        allBouquetList.push({
                            label:`${eachBouquet.paymentItemName} -${eachBouquet.currencyCode} ${eachBouquet.itemFee}`,
                            value: eachBouquet.paymentCode,
                            isAmountFixed:eachBouquet.isAmountFixed,
                            itemAmount: eachBouquet.amount
                        })
                    }
                    
                    // else{
                    //     allBouquetList.push({
                    //         label:`${eachBouquet.paymentItemName}`,
                    //         value: eachBouquet.paymentCode
                    //     })
                    // }
                })
            const selectStyle = {
                control: base => ({
                    ...base,
                    // border: 0,
                    // This line disable the blue border
                    boxShadow: "none"
                })
            };

        return (
            <div className="dashboard-section">
                <Formik
                    initialValues={{
                        chosenBouquet:"",
                        amount:"",
                        customField:""
                    }}

                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => {

                        let payload = {}
                        if(accountNumber!==""){
                            // this.setState({isAccountError:true})
                            let amount = parseFloat(values.amount.replace(/,/g, ''));
                            if( parseFloat(selectedAccount.walletBalance)>= amount){
                                this.setState({isAccountError:false, lesserAccountBalanceError: false})
                                payload= {
                                    forRequest:{
                                        paymentCode: values.chosenBouquet,
                                        subscriberId: values.customField,
                                        billerId: this.billlerId,
                                        categoryId: this.billCategory,
                                    },
                                    amount: amount,
                                    walletNumber:accountNumber,
                                    billerName:this.billerName,
                                    selectedBouquetName,
                                    billerInfo:this.billerInfo
                                   
                                }
                                this.setState(({payload}));

                                
                                this.proceedWithDetails(payload);
                            }else{
                                this.setState({lesserAccountBalanceError:true})
                            }
                        }else{
                            this.setState({isAccountError:true})
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
                                        {/* <Form.Group className="poppedinput withselect"> */}
                                            <SelectAnAccount
                                                label="Select Source"
                                                onChange={(selected) => {
                                                    this.setAccountChosen(selected, selected)

                                                }}
                                                isAccountError={isAccountError}
                                                accountNumber={accountNumber}
                                            />

                                        {/* </Form.Group> */}



                                        <Form.Group className="poppedinput withselect">
                                            <Form.Label className="block-level">Select Bouquet</Form.Label>
                                            <Select
                                                options={allBouquetList}
                                                onChange={handleChange}
                                                styles={selectStyle}
                                                name="chosenBouquet"
                                                onChange={(selected) => {
                                                        setFieldValue('chosenBouquet', selected.value);
                                                        setFieldValue('amount', selected.itemAmount);
                                                        
                                                        this.setState({isAmountFixed: selected.isAmountFixed, amountToPay:selected.itemAmount, selectedBouquetName:selected.label})
                                                    }
                                                }
                                                className={errors.chosenBouquet && touched.chosenBouquet ? "is-invalid" : null}
                                                onBlur={()=> setFieldTouched('chosenBouquet', true)}
                                            />
                                            {errors.chosenBouquet && touched.chosenBouquet ? (
                                                <span className="invalid-feedback">{errors.chosenBouquet}</span>
                                            ) : null}

                                        </Form.Group>
                                        {values.chosenBouquet!=="" &&
                                            <Form.Group className="poppedinput">
                                                <Form.Label className="block-level">Enter Amount</Form.Label>
                                                <Form.Control type="text"
                                                    name="amount"
                                                    onChange={(e) => {
                                                        let amount = parseFloat(e.target.value.replace(/,/g, ''));
                                                        this.setState({amountToPay: amount})

                                                        if (selectedAccount !== "") {
                                                            if (parseFloat(selectedAccount.walletBalance) >= amount) {
                                                                this.setState({ lesserAccountBalanceError: false })
                                                            } else {
                                                                this.setState({ lesserAccountBalanceError: true })
                                                            }
                                                        }

                                                        setFieldValue('amount', e.target.value)
                                                    }}
                                                    disabled={isAmountFixed.toLowerCase()==="true"?true:false}
                                                    onBlur={() => setFieldTouched('amount', true)}
                                                    value={numberWithCommas(values.amount)}
                                                    className={((errors.amount && touched.amount) || lesserAccountBalanceError) ? "is-invalid" : null}
                                                    required />
                                                {errors.amount && touched.amount ? (
                                                    <span className="invalid-feedback">{errors.amount}</span>
                                                ) : null}

                                                {lesserAccountBalanceError &&
                                                    <span className="invalid-feedback">Insufficient account balance</span>
                                                }

                                            </Form.Group>
                                        }
                                        {values.chosenBouquet!=="" &&
                                            <Form.Group className="poppedinput">
                                                <Form.Label className="block-level">{this.customFieldItem}</Form.Label>
                                                <Form.Control type="text"
                                                    name="customField"
                                                    onChange={handleChange}
                                                    placeholder={`Enter ${this.customFieldItem}`}
                                                    value={values.customField}
                                                    className={errors.customField && touched.customField ? "is-invalid" : null}
                                                    required />
                                                {errors.customField && touched.customField ? (
                                                    <span className="invalid-feedback">{errors.customField}</span>
                                                ) : null}

                                            </Form.Group>
                                        }


                                        {/* <Form.Group className="poppedinput">
                                                        <Form.Label className="block-level">Set 6-digit Withdrawal PIN</Form.Label>
                                                        <Form.Control type="text"
                                                            name="amountToSend"
                                                            onChange={handleChange}
                                                            value={values.amountToSend}
                                                            className={errors.amountToSend && touched.amountToSend ? "is-invalid" : null}
                                                            required />
                                                            <div className="forminput-helptext">This Pin will be required at the ATM</div>
                                                        {errors.amountToSend && touched.amountToSend ? (
                                                            <span className="invalid-feedback">{errors.amountToSend}</span>
                                                        ) : null}

                                                    </Form.Group> */}
                                    
                                    {validateCustomerForBillPaymentReducerRequest.request_status ===paymentsConstants.VALIDATE_CUSTOMER_FOR_BILL_FAILURE && 
                                        <div className="">
                                            <ErrorMessage errorMessage={validateCustomerForBillPaymentReducerRequest.request_data.error} canRetry={false} retryFunc={()=>this.proceedWithDetails(payload)} />
                                        </div>
                                        
                                    }
                                    </div>

                                </div>
                                

                                <div className="app-panel inpage">
                                    <div className="footer-with-cta toleft m-0 ">
                                        <Button variant="secondary"
                                            type="button"
                                            disabled={validateCustomerForBillPaymentReducerRequest.is_request_processing}
                                            className="ml-0 onboarding-btn light"
                                            onClick={() => history.goBack()}
                                        > Back
                                                     {/* {CreateAccountStep1Request.is_request_processing?'Please wait...' :'Continue'} */}
                                        </Button>
                                        <Button variant="secondary"
                                            type="submit"
                                            disabled={validateCustomerForBillPaymentReducerRequest.is_request_processing}
                                            className="ml-20 onboarding-btn"
                                        > 
                                                     {validateCustomerForBillPaymentReducerRequest.is_request_processing?'Please wait...' :'Continue'}
                                        </Button>

                                    </div>
                                </div>
                            </Form>
                        )}
                </Formik>
            </div>
        )
    }

    renderPreload = () =>{
        let GetAllBillerPaymentItemRequest =  this.props.GetAllBillerPaymentItemReducer

        if (GetAllBillerPaymentItemRequest.request_status === paymentsConstants.GET_ALLBILLER_PAYMENT_ITEM_PENDING){
            return (
                <div>
                    <PageLoader />
                </div>

            )
        }

        if (GetAllBillerPaymentItemRequest.request_status === paymentsConstants.GET_ALLBILLER_PAYMENT_ITEM_FAILURE) {
            return (
                <ErrorMessage errorMessage={GetAllBillerPaymentItemRequest.request_data.error} canRetry={true} retryFunc={() => this.getAllBillPaymentItems()} />
            )
        }

        
    }

    renderPageWrap = () =>{
        let GetAllBillerPaymentItemRequest =  this.props.GetAllBillerPaymentItemReducer
        
        
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
                                <h3>{this.billerInfo}</h3>
                            </div>
                        </div>
                        

                        {GetAllBillerPaymentItemRequest.request_status === paymentsConstants.GET_ALLBILLER_PAYMENT_ITEM_SUCCESS &&
                            this.renderPageContent()
                        }

                        {GetAllBillerPaymentItemRequest.request_status !== paymentsConstants.GET_ALLBILLER_PAYMENT_ITEM_SUCCESS &&
                            <div className="dashboard-section">
                                <div className="app-panel inpage">
                                    {this.renderPreload()}
                                </div>
                            </div>
                        }
                    </div>
                    <DownloadApp/>
                    
                </div>
            </div>
        )
    }

    
    



    

  
    


    render() {
        let{billCategories, billersInCatData} = this.state;
        
        return (
            <Fragment>
                <Helmet>
                    <title>9PSB - Pay {this.billerName} bills</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Pay {this.billerName} bills</h3>
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
        GetBillsCategoriesReducer: state.paymentsReducers.GetBillsCategoriesReducer,
        GetBillersByCategoryReducer: state.paymentsReducers.GetBillersByCategoryReducer,
        GetAllBillerPaymentItemReducer: state.paymentsReducers.GetAllBillerPaymentItemReducer,
        validateCustomerForBillPaymentReducer: state.paymentsReducers.validateCustomerForBillPaymentReducer,
    };
}

export default connect(mapStateToProps)(BillDetails);