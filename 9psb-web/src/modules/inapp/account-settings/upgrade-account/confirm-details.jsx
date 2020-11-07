import * as React from 'react';
import { Link, NavLink} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import DatePicker from 'react-datepicker'
// import DatePicker from '../../../../_helpers/datepickerfield'
import "react-datepicker/dist/react-datepicker.css";

import {history} from '../../../../_helpers/history'
import Alert from 'react-bootstrap/Alert';
import Select from 'react-select';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Helmet } from 'react-helmet';
import LeftCaret from '../../../../assets/images/left-caret.svg';
import Form from 'react-bootstrap/Form';
import  InAppContainer from '../../../../shared/templates/inapp-container'
import  DownloadApp from '../../../../shared/elements/downloadapp-box'
import  SelectAnAccount from '../../../../shared/elements/select-account'
import  ErrorMessage from '../../../../shared/elements/errormessage'

import { getDateFromISO} from '../../../../shared/utils';
import {encryptAnItem} from '../../../../shared/shared-utils/index';


import {onboardingConstants} from '../../../../redux/actiontypes/onboarding/onboarding.constants'
import {onboardingActions} from '../../../../redux/actions/onboarding/onboarding';
import "../styles.scss"; 
class ConfirmUpgradeDetails extends React.Component{
    constructor(props) {
        super(props);
        let getExistingInfo = this.props.UpgradeValidateOtpReducer,
            getExistingInfo2 = this.props.UpgradeFetchDetailsReducer;
        this.state={
            psbuser:JSON.parse(localStorage.getItem('psb-auth')),
            dateOfBirth:"",
            customerInfo: (Object.keys(getExistingInfo).length>=1 
                                        && getExistingInfo.request_status === onboardingConstants.UPGRADE_VALIDATE_OTP_SUCCESS)
                                    ? getExistingInfo.request_data.response: '' ,
            requestTrackingId: (Object.keys(getExistingInfo2).length >= 1
                && getExistingInfo2.request_status === onboardingConstants.UPGRADE_FETCH_DETAILS_SUCCESS)
                ? getExistingInfo2.request_data.response.requestTrackingId : '',
            docuploaded:'',
            isDocAdded: null,
            invalidImageUpload:false,
            previewStyles:{}
        }
   
      
    }

    componentDidMount(){
        this.clearRecords()
    }

    clearRecords = ()=>{
        const {dispatch} = this.props;
        dispatch(onboardingActions.UpgradeSendDetails("CLEAR"));
    }

    isFileImage=(file)=> {
        const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
     
        return file && acceptedImageTypes.includes(file['type'])
    }

    updateCustomerDetails = async(payload) =>{
        const {dispatch} = this.props;
        let {requestTrackingId} = this.state;

        await dispatch(onboardingActions.UpgradeSendDetails(payload, requestTrackingId));
    }

    HandleFileUpLoad = (event) => {
        const file = document.getElementById('photo-upload').files[0];
        if(this.isFileImage(file)){
            this.setState({docuploaded: event.target.files[0], 
                        isDocAdded:true});
        
        
       
            this.setState({invalidImageUpload:false})
            const reader = new FileReader();

            
            let preViewStyle;
            reader.addEventListener("load",  ()=> {
                

                preViewStyle = {
                    background: `url(${reader.result})`,
                    height:'60px',
                    backgroundSize: `100% 100%`,
                    backgroundPosition: `center center`,
                    backgroundRepeat: `no-repeat`
                }
                
                this.setState({previewStyles:preViewStyle})
            }, false);

            
            if (file) {
                reader.readAsDataURL(file);
            }
        }else{
            this.setState({invalidImageUpload:true})
        }
        
    }


    changeTxtPin = (payload)=>{
        const {dispatch} = this.props;
        dispatch(onboardingActions.ChangePin(payload));
    }

    handleDateChangeRaw = (e) => {
        e.preventDefault();
    }

    handleDOBPicker = (dateOfBirth) => {
        dateOfBirth.setHours(dateOfBirth.getHours() + 1);
        
        
        this.setState({ dateOfBirth: getDateFromISO(dateOfBirth.toISOString()) });
    }
   
    


    renderPageWrap = () =>{
        let {payload}= this.state;

        const {customerInfo, docuploaded,isDocAdded, previewStyles,dateOfBirth, invalidImageUpload} = this.state;

        // console.log("user data", customerInfo);
        let validationChangeSchema = Yup.object().shape({
            firstName: Yup.string()
                .required('Required')
                .test('alphabets', 'Please provide a valid name', (value) => {
                    return /^[A-Za-z]+$/.test(value);
                }),
            lastName: Yup.string()
                .required('Required')
                .test('alphabets', 'Please provide a valid name', (value) => {
                    return /^[A-Za-z]+$/.test(value);
                }),
            middleName: Yup.string()
                .required('Required')
                .test('alphabets', 'Please provide a valid name', (value) => {
                    return /^[A-Za-z]+$/.test(value);
                }),
            homeAddress: Yup.string()
                .required('Required'),
            dateOfBirth: Yup.string()
                .required('Required'),
            bvn: Yup.string()
                .required('Required'),
            MeansOfId:Yup.string()
                .required('Required'),
            gender: Yup.string()
                .required('Required'),
            placeOfBirth: Yup.string()
                .required('Required'),
            IdNumber: Yup.string()
                .when('MeansOfId',{
                    is:(value)=>value!=="",
                    then: Yup.string()
                        .required('Required')
                        
                }),
        });   

        let upgradeSendDetailsRequest = this.props.UpgradeSendDetailsReducer;
        const   dpFormData = new FormData();
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
                                <h3>Please confirm your details</h3>
                            </div>
                        </div>

                        
                        
                        <div className="dashboard-section">
                            <Formik
                                initialValues={{
                                    firstName: (customerInfo!=="" && customerInfo.firstName!==null && customerInfo.firstName!==undefined)? customerInfo.firstName:"",
                                    middleName: (customerInfo!=="" && customerInfo.middleName!==null && customerInfo.middleName!==undefined)? customerInfo.middleName:"",
                                    lastName:(customerInfo!=="" && customerInfo.lastName!==null && customerInfo.lastName!==undefined)? customerInfo.lastName:"",
                                    homeAddress: (customerInfo!=="" && customerInfo.homeAddress!==null && customerInfo.homeAddress!==undefined)? customerInfo.homeAddress: "",
                                    placeOfBirth: (customerInfo!=="" && customerInfo.placeOfBirth!==null && customerInfo.placeOfBirth!==undefined)? customerInfo.placeOfBirth: "",
                                    bvn: (customerInfo!=="" && customerInfo.idNumber!==null && customerInfo.idNumber!==undefined)? customerInfo.idNumber: "",
                                    dateOfBirth: (customerInfo!=="" && customerInfo.dateofBirth!==null && customerInfo.dateofBirth!==undefined)? getDateFromISO(customerInfo.dateofBirth):"",
                                    stateChosen: "",
                                    lgaChosen: "",
                                    MeansOfId:"",
                                    IdNumber:"",
                                    gender: (customerInfo!=="" && customerInfo.gender!==null && customerInfo.gender!==undefined)? customerInfo.gender:"",

                                    // isFirstNameReturned: (customerInfo!=="" && customerInfo.cif!==null && customerInfo.cif!==undefined)?true:false,
                                    isFirstNameReturned: (customerInfo!=="" && customerInfo.firstName!==null && customerInfo.firstName!==undefined)?true:false,
                                    isMiddleNameReturned: (customerInfo!=="" && customerInfo.middleName!==null && customerInfo.middleName!==undefined)?true:false,
                                    isLastNameReturned: (customerInfo!=="" && customerInfo.lastName!==null && customerInfo.lastName!==undefined)?true:false,
                                    isHomeAddressReturned: (customerInfo!=="" && customerInfo.homeAddress!==null && customerInfo.homeAddress!==undefined)?true:false,
                                    isplaceOfBirthReturned: (customerInfo!=="" && customerInfo.placeOfBirth!==null && customerInfo.placeOfBirth!==undefined)?true:false,
                                    isBVNReturned: (customerInfo!=="" && customerInfo.idNumber!==null && customerInfo.idNumber!==undefined)?true:false,
                                    isDateOfBirthReturned: (customerInfo!=="" && customerInfo.dateofBirth!==null && customerInfo.dateofBirth!==undefined)?true:false,
                                    isGenderReturned: (customerInfo!=="" && customerInfo.gender!==null && customerInfo.gender!==undefined)?true:false
                                }}

                                validationSchema={validationChangeSchema}
                                onSubmit={(values, { resetForm }) => {

                                    if(docuploaded===''){
                                        this.setState({isDocAdded:false})
                                    }else{
                                        
                                                dpFormData.append('BvnNumber', values.bvn);
                                                dpFormData.append('IdNumber', values.IdNumber);
                                                dpFormData.append('MeansOfId', parseInt(values.MeansOfId));
                                                dpFormData.append('Gender', values.gender);
                                                dpFormData.append('DateofBirth', values.isDateOfBirthReturned ? customerInfo.dateofBirth: values.dateOfBirth.toISOString());
                                                dpFormData.append('PlaceOfBirth', values.placeOfBirth);
                                                dpFormData.append('Address', values.homeAddress);
                                                dpFormData.append('PassportPhotogragh', this.state.docuploaded);

                                                this.updateCustomerDetails(dpFormData);
                                                // console.log("ooooolll",values.dateOfBirth);
                                                // for (var value of dpFormData.values()) {
                                                //     console.log("lslsl",value); 
                                                //  }
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
                                                <div className="panel-helptext w-70 mt-20  m-auto m-100">
                                                    {/* Change Password */}
                                                </div>
                                                <div className="card-text text-center mb-0">
                                                        <div className="" 
                                                                className={upgradeSendDetailsRequest.is_request_processing?"photo-upload disabled-item" :"photo-upload"} >
                                                            <label htmlFor="photo-upload" className="upload-photo" style={previewStyles}></label>
                                                            <input type="file" accept="image/*" name="" id="photo-upload"  onChange={this.HandleFileUpLoad}/>
                                                        </div>
                                                    Upload your passport
                                                </div>
                                                {invalidImageUpload &&
                                                    <Alert variant="danger" className="w-80 m-auto">
                                                        Please upload a valid image
                                                    </Alert>
                                                }
                                                
                                                <div className="form-wrap w-70 mt-40 m-auto pt-10 m-100">
                                                    
                                                        
                                                    <Form.Group className="poppedinput">
                                                        <Form.Label className="block-level">BVN</Form.Label>
                                                        <Form.Control type="text"
                                                            name="bvn"
                                                            onChange={values.isBVNReturned===false? handleChange : null}
                                                            placeholder=""
                                                            value={values.bvn}
                                                            disabled={values.isBVNReturned}
                                                            className={errors.bvn && touched.bvn ? "is-invalid" : null}
                                                            required />
                                                        {errors.bvn && touched.bvn ? (
                                                            <span className="invalid-feedback">{errors.bvn}</span>
                                                        ) : null}

                                                    </Form.Group>

                                                    <Form.Group className="poppedinput">
                                                        <Form.Label className="block-level">First Name</Form.Label>
                                                        <Form.Control type="text"
                                                            name="firstName"
                                                            onChange={values.isFirstNameReturned ===false? handleChange : null}
                                                            placeholder=""
                                                            value={values.firstName }
                                                            disabled={values.isFirstNameReturned}
                                                            className={errors.firstName && touched.firstName ? "is-invalid" : null}
                                                            required />
                                                        {errors.firstName && touched.firstName ? (
                                                            <span className="invalid-feedback">{errors.firstName}</span>
                                                        ) : null}

                                                    </Form.Group>
                                                    <Form.Group className="inputfield">
                                                        <Form.Control type="text"
                                                            name="middleName"
                                                            onChange={handleChange}
                                                            placeholder="Middle name"
                                                            disabled={values.isMiddleNameReturned}
                                                            value={values.middleName}
                                                            className={errors.middleName && touched.middleName ? "is-invalid" : null}
                                                            required />
                                                        {errors.middleName && touched.middleName ? (
                                                            <span className="invalid-feedback">{errors.middleName}</span>
                                                        ) : null}

                                                    </Form.Group>
                                                    <Form.Group className="inputfield">
                                                        <Form.Control type="text"
                                                            name="lastName"
                                                            onChange={values.isLastNameReturned ===false? handleChange : null}
                                                            placeholder="Last name"
                                                            disabled={values.isLastNameReturned}
                                                            value={values.lastName}
                                                            className={errors.lastName && touched.lastName ? "is-invalid" : null}
                                                            required />
                                                        {errors.lastName && touched.lastName ? (
                                                            <span className="invalid-feedback">{errors.lastName}</span>
                                                        ) : null}

                                                    </Form.Group>
                                                    <Form.Row>

                                                        <Col>
                                                            <select id="MeansOfId"
                                                                onChange={handleChange}
                                                                name="MeansOfId"
                                                                value={values.MeansOfId}
                                                                className={errors.MeansOfId && touched.MeansOfId ? "is-invalid form-control form-control-sm h-38px" : "form-control form-control-sm h-38px"}
                                                            >
                                                                <option>Means of Identification</option>
                                                                <option value="2">Drivers Licence</option>
                                                                <option value="3">International Passport</option>
                                                                <option value="4">Voters Card</option>
                                                                <option value="5">NIMC</option>
                                                            </select>
                                                            {errors.MeansOfId && touched.MeansOfId ? (
                                                                <span className="invalid-feedback">{errors.MeansOfId}</span>
                                                            ) : null}
                                                        </Col>
                                                    </Form.Row>
                                                    {values.MeansOfId !=="" &&
                                                    <Form.Group className="poppedinput">

                                                        <Form.Label className="block-level">ID Number</Form.Label>
                                                        <Form.Control type="text"
                                                            name="IdNumber"
                                                            onChange={handleChange}
                                                            placeholder="ID Number"
                                                            disabled={values.isHomeAddressReturned}
                                                            value={values.IdNumber}
                                                            className={errors.IdNumber && touched.IdNumber ? "is-invalid" : null}
                                                            required />
                                                        {errors.IdNumber && touched.IdNumber ? (
                                                            <span className="invalid-feedback">{errors.IdNumber}</span>
                                                        ) : null}

                                                    </Form.Group>
                                                    }

                                                    <Form.Group className="poppedinput">

                                                        <Form.Label className="block-level">Home Address</Form.Label>
                                                        <Form.Control type="text"
                                                            name="homeAddress"
                                                            onChange={values.isHomeAddressReturned===false ? handleChange : null}
                                                            placeholder="Street address"
                                                            disabled={values.isHomeAddressReturned}
                                                            value={values.homeAddress}
                                                            className={errors.homeAddress && touched.homeAddress ? "is-invalid" : null}
                                                            required />
                                                        {errors.homeAddress && touched.homeAddress ? (
                                                            <span className="invalid-feedback">{errors.homeAddress}</span>
                                                        ) : null}

                                                    </Form.Group>

                                                    <Form.Group className="poppedinput">

                                                        <Form.Label className="block-level">Place of Birth</Form.Label>
                                                        <Form.Control type="text"
                                                            name="placeOfBirth"
                                                            onChange={values.isplaceOfBirthReturned ===false ? handleChange : null}
                                                            placeholder=""
                                                            disabled={values.isplaceOfBirthReturned}
                                                            value={values.placeOfBirth}
                                                            className={errors.placeOfBirth && touched.placeOfBirth ? "is-invalid" : null}
                                                            required />
                                                        {errors.placeOfBirth && touched.placeOfBirth ? (
                                                            <span className="invalid-feedback">{errors.placeOfBirth}</span>
                                                        ) : null}

                                                    </Form.Group>

                                                    <Form.Row>
                                                        <Col>
                                                            <Form.Group controlId="debitLocation" className={errors.dateOfBirth && touched.dateOfBirth ? "has-invaliderror fullwidthdate " : "fullwidthdate "}>
                                                                
                                                                <DatePicker 
                                                                    dateFormat="d MMMM, yyyy"
                                                                    className="form-control form-control-sm"
                                                                    peekNextMonth
                                                                    showMonthDropdown
                                                                    showYearDropdown
                                                                    placeholderText="Choose Date of Birth"
                                                                    dropdownMode="select"
                                                                    name="dateOfBirth"
                                                                    disabled={values.isDateOfBirthReturned}
                                                                    value={dateOfBirth===""? values.dateOfBirth : this.state.dateOfBirth}
                                                                    // onChange={setFieldValue}
                                                                    maxDate={new Date()}
                                                                    onChangeRaw={values.isDateOfBirthReturned===false? this.handleDateChangeRaw: null}
                                                                    onChange={values.isDateOfBirthReturned===false?(e)=> {this.handleDOBPicker(e); setFieldValue('dateOfBirth', e) }:null}
                                                                    // selected={values.dateOfBirth}
                                                                    // selected={dateOfBirth===""? values.dateOfBirth : dateOfBirth}
                                                                    className={errors.dateOfBirth && touched.dateOfBirth ? "is-invalid form-control form-control-sm h-38px" : "form-control form-control-sm h-38px"}

                                                                />
                                                                {errors.dateOfBirth && touched.dateOfBirth ? (
                                                                    <span className="invalid-feedback">{errors.dateOfBirth}</span>
                                                                ) : null}
                                                            </Form.Group>
                                                        </Col>
                                                    </Form.Row>

                                                    <Form.Row>

                                                        <Col>
                                                            <select id="gender"
                                                                onChange={values.isGenderReturned ===false ? handleChange : null}
                                                                name="gender"
                                                                disabled={values.isGenderReturned}
                                                                value={values.gender}
                                                                className={errors.gender && touched.gender ? "is-invalid form-control form-control-sm h-38px" : "form-control form-control-sm h-38px"}
                                                            >
                                                                <option>Gender</option>
                                                                <option value="Female">Female</option>
                                                                <option value="Male">Male</option>
                                                            </select>
                                                            {errors.gender && touched.gender ? (
                                                                <span className="invalid-feedback">{errors.gender}</span>
                                                            ) : null}
                                                        </Col>
                                                    </Form.Row>
                                                    
                                                    {isDocAdded ===false &&
                                                        <Alert variant="danger" className="w-80 m-auto">
                                                            Please upload your passport
                                                        </Alert>
                                                    }
                                                </div>
                                            </div>
                                            {upgradeSendDetailsRequest.request_status ===onboardingConstants.UPGRADE_SEND_DETAILS_FAILURE && 
                                                
                                                <ErrorMessage errorMessage={upgradeSendDetailsRequest.request_data.error} canRetry={false} retryFunc={()=>this.updateCustomerDetails(dpFormData)} />
                                            
                                            }

                                            <div className="app-panel inpage">
                                                <div className="footer-with-cta toleft m-0 ">
                                                    <Button variant="secondary"
                                                        type="button"
                                                        disabled={upgradeSendDetailsRequest.is_request_processing}
                                                        className="ml-0 onboarding-btn light"
                                                        onClick={()=>history.push("/app/dashboard")}
                                                    > Skip
                                                     {/* {CreateAccountStep1Request.is_request_processing?'Please wait...' :'Continue'} */}
                                                    </Button>
                                                    <Button variant="secondary"
                                                        type="submit"
                                                        disabled={upgradeSendDetailsRequest.is_request_processing}
                                                        className="ml-10 onboarding-btn"
                                                    > 
                                                     {upgradeSendDetailsRequest.is_request_processing?'Please wait...' :'Continue'}
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
                <title>9PSB - Account Upgrade</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Account Upgrade</h3>
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
        ChangeTransactionPinReducer : state.onboardingReducers.ChangeTransactionPinReducer,
        UpgradeFetchDetailsReducer : state.onboardingReducers.UpgradeFetchDetailsReducer,
        UpgradeValidateOtpReducer : state.onboardingReducers.UpgradeValidateOtpReducer,
        UpgradeCompletionReducer : state.onboardingReducers.UpgradeCompletionReducer,
        UpgradeSendDetailsReducer : state.onboardingReducers.UpgradeSendDetailsReducer,
    };
}

export default connect(mapStateToProps)(ConfirmUpgradeDetails);