import * as React from 'react';
import { Link, NavLink} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";


import {history} from '../../../_helpers/history'

import Select from 'react-select';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Formik } from 'formik';
import { Helmet } from 'react-helmet';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import  InAppContainer from '../../../shared/templates/inapp-container'
import  DownloadApp from '../../../shared/elements/downloadapp-box'


import ErrorMessage from '../../../shared/elements/errormessage'
import PageLoader from '../../../shared/elements/pageloader'
import  SelectAnAccount from '../../../shared/elements/select-account'
import { paymentActions } from '../../../redux/actions/payments/payments';
import { paymentsConstants } from '../../../redux/actiontypes/payments/payments.constants';
import {numberWithoutDecimals, allowNumbersOnly, getNetworkProviderWithCode, getDataPlanNameCode} from '../../../shared/utils';
import "./styles.scss"; 
class BuyData extends React.Component{
    constructor(props) {
        super(props);
        let getDataPlans = this.props.GetDataTopUpPlansReducer;
        this.state={
            psbuser:JSON.parse(localStorage.getItem('psb-auth')),
            isAccountError: false,
            accountNumber: "",
            selectedAccount:"",
            lesserAccountBalanceError:false,
            dataPlansInfo: (Object.keys(getDataPlans).length >= 1
                    && getDataPlans.request_status === paymentsConstants.FETCH_DATATOPUP_PLANS_SUCCESS
                    ),
            selectedProviderDataPlans:[],
            
        }
   
        window.addEventListener("resize", ()=>
                this.setState({screenWidthSize: window.innerWidth,
                                showSiderBar: window.innerWidth>=1024?true:false
                }));
    }

    componentDidMount(){
        this.getDataPlans();
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
            dispatch(paymentActions.saveDataTopUpRecipientData(payload, null, "self"))
        }
    }

    selectAProvider = (networkId)=>{
        let {dataPlansInfo} = this.state;
        let formattedPlans =[]
        let providerDataPlans = dataPlansInfo.filter(eachPlan=>eachPlan.networkId==networkId);

        providerDataPlans.map(eachPlan=>{
            formattedPlans.push({
                label:`${eachPlan.network}- ${eachPlan.description}`,
                value:eachPlan.amount
            })
        })

        this.setState({selectedProviderDataPlans: formattedPlans});
    }

    // getDataPlans = () => {
    //     const { dispatch } = this.props;
    //     dispatch(paymentActions.GetDataTopUpPlans());
        
    // }

    getDataPlans = () => {
        const { dispatch } = this.props;
        dispatch(paymentActions.GetDataTopUpPlans());
        this.fetchAllDataPlans().then(()=>{
            let getDataPlans = this.props.GetDataTopUpPlansReducer;
            

                if((Object.keys(getDataPlans).length >= 1 
                    && getDataPlans.request_status === paymentsConstants.FETCH_DATATOPUP_PLANS_SUCCESS)){
                        this.setState({dataPlansInfo: getDataPlans.request_data.response})
                }
        })
    }

    fetchAllDataPlans = async () =>{
        const { dispatch } = this.props;
        await dispatch(paymentActions.GetDataTopUpPlans());
    }

    renderPageWrap = () =>{
           
        return(
            <div className="each-section mt-80 res-mt-45">
                <div className="twosided nomargin">
                    <div>
                        <div className="page-section-mainheading app-panel">
                            <div className="border-lines"><span></span><span></span><span></span></div>
                            <h3>Data top up for any network</h3>
                        </div>
                        
                        
                        <div className="dashboard-section">
                            {this.renderPageContent()}
                        </div>
                    </div>
                    <DownloadApp/>
                    
                </div>
            </div>
        )
    }

    
    
    renderPageContent = ()=>{
        let 
          {isAccountError,
            accountNumber,
            selectedAccount,
            lesserAccountBalanceError,
            submitType,
            dataPlansInfo,
            psbuser,
            existingCustomerInfo,
            selectedProviderDataPlans,
            payload} = this.state;

            let GetDataTopUpPlansRequest = this.props.GetDataTopUpPlansReducer;
            let providersList = [
                { label: "Airtel", value: 1 },
                { label: "9Mobile", value: 2 },
                { label: "Globacom", value: 3 },
                { label: "Mtn", value: 4 }];

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
                  selectedPlan: Yup.string()
                      // .required('Required'), 
              }); 
        return (
            <Formik
                initialValues={{
                    amount: "",
                    network: "",
                    recipient: psbuser.mobileNumber,
                    saveBeneficiary: false,
                    beneficiaryAlias: "",
                    selectedPlan: ""
                }}

                validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => {

                    if (submitType === "topup") {
                        if (accountNumber !== "") {

                            let amount = parseFloat(values.amount);
                            if (parseFloat(selectedAccount.walletBalance) >= amount) {
                                this.setState({ isAccountError: false, lesserAccountBalanceError: false })
                                payload = {
                                    walletNumber: accountNumber,
                                    recipient: values.recipient,
                                    network: values.network,
                                    transactionType: 1,
                                    amount: parseFloat(values.amount)
                                }
                                this.setState(({ payload }));


                                this.proceedWithDetails("topup", payload)
                            } else {
                                this.setState({ lesserAccountBalanceError: true })
                            }
                        } else {
                            this.setState({ isAccountError: true })
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
                                    <NavLink exact to="/app/buy-data" className="each-option">
                                        Yourself
                                                    </NavLink>
                                    <NavLink exact to="/app/buy-data/others/choose" className="each-option">
                                        Others
                                                    </NavLink>
                                </div>
                                <div className="panel-helptext mt-20 centered  m-auto m-100">
                                    Buy data for yourself on the number on your account
                                </div>

                                {
                                    GetDataTopUpPlansRequest.request_status === paymentsConstants.FETCH_DATATOPUP_PLANS_PENDING &&
                                    <PageLoader />
                                }

                                {
                                    GetDataTopUpPlansRequest.request_status === paymentsConstants.FETCH_DATATOPUP_PLANS_FAILURE &&
                                    <ErrorMessage errorMessage={GetDataTopUpPlansRequest.request_data.error} canRetry={true} retryFunc={() => this.getDataPlans()} />
                                }

                                {(GetDataTopUpPlansRequest.request_status === paymentsConstants.FETCH_DATATOPUP_PLANS_SUCCESS) &&
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
                                            Enter bouquet details
                                                        </div>

                                        <Form.Group className="poppedinput">
                                            <Form.Label className="block-level">Phone Number</Form.Label>
                                            <Form.Control type="text"
                                                name="recipient"
                                                onChange={handleChange}
                                                placeholder=""
                                                maxLength="13"
                                                value={values.recipient}
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
                                                onChange={(selected) => {
                                                    this.selectAProvider(selected.value)
                                                    setFieldValue('network', selected.value)
                                                }}
                                                onBlur={() => setFieldTouched('network', true)}
                                                className={errors.network && touched.network ? "is-invalid" : null}
                                                name="network"
                                            />
                                            {errors.network && touched.network ? (
                                                <span className="invalid-feedback">{errors.network}</span>
                                            ) : null}

                                        </Form.Group>

                                        {values.network !== "" &&
                                            <Form.Group className="poppedinput withselect">
                                                <Form.Label className="block-level">Select Bouquet</Form.Label>
                                                <Select

                                                    options={selectedProviderDataPlans}
                                                    onChange={(selected) => {
                                                        
                                                        setFieldValue('amount', selected.value)
                                                    }}
                                                    onBlur={() => setFieldTouched('amount', true)}
                                                    className={errors.amount && touched.amount ? "is-invalid" : null}
                                                    styles={selectStyle}
                                                    name="amount"
                                                />
                                                {errors.amount && touched.amount ? (
                                                    <span className="invalid-feedback">{errors.amount}</span>
                                                ) : null}

                                            </Form.Group>
                                        }
                                    </div>
                                }
                            </div>

                            {(GetDataTopUpPlansRequest.request_status === paymentsConstants.FETCH_DATATOPUP_PLANS_SUCCESS) &&
                                <div className="app-panel inpage">
                                    <div className="footer-with-cta toleft m-0 ">

                                        <Button variant="secondary"
                                            type="submit"
                                            // disabled={CreateAccountStep1Request.is_request_processing}
                                            className=" onboarding-btn"
                                            onClick={() => this.setState({ submitType: "topup" })}
                                        > Continue
                                                        {/* {CreateAccountStep1Request.is_request_processing?'Please wait...' :'Continue'} */}
                                        </Button>

                                    </div>
                                </div>
                            }
                        </Form>
                    )}
            </Formik>
        )
    }



    

  
    


    render() {
        
        
        return (
            <Fragment>
                <Helmet>
                    <title>9PSB - Data Top Up</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Data Top Up</h3>
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
    };
}

export default connect(mapStateToProps)(BuyData);