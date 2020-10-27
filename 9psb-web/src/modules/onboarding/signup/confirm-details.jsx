import * as React from 'react';
import { Link} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";
import equal from 'fast-deep-equal'

import { Formik } from 'formik';
import * as Yup from 'yup';
import { Helmet } from 'react-helmet';
import Form from 'react-bootstrap/Form';
import DatePicker from '../../../_helpers/datepickerfield'
import "react-datepicker/dist/react-datepicker.css";
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'
import {history} from '../../../_helpers/history'
import  OnboardingContainer from '../../../shared/templates/onboarding-container'
import SignupImg from '../../../assets/images/signup2.svg';
import Select from 'react-select';
import Alert from 'react-bootstrap/Alert';

import {getDateFromISO } from "../../../shared/utils";
import {getImagePreview} from '../../../shared/shared-utils/index';

import {onboardingActions} from '../../../redux/actions/onboarding/onboarding';
import {onboardingConstants} from '../../../redux/actiontypes/onboarding/onboarding.constants';

import "./signup.scss"; 
class ConfirmDetailsFromOtp extends React.Component{
    constructor(props) {
        super(props);

        let getExistingInfo = this.props.ValidateRegOtpReducer;
        let loginInfo = this.props.LoginReducer;
        this.state={
            psbuser:JSON.parse(localStorage.getItem('psb-auth')),
            existingCustomerInfo: (Object.keys(getExistingInfo).length>=1 
                                        && getExistingInfo.request_status === onboardingConstants.VALIDATE_OTP_SUCCESS)
                                    ? getExistingInfo.request_data.response: '' ,
            loggedData: (Object.keys(loginInfo).length>=1 
                && loginInfo.request_status === onboardingConstants.LOGIN_USER_SUCCESS)
            ? loginInfo.request_data.response: '',
            customerInfo:"",
            docuploaded:'',
            isDocAdded: null,
            invalidImageUpload:false,
            previewStyles:{}
        }

        this.listOfStates =[];
        // this.bounceBackToStep();
    
    }

    componentDidMount(){
        this.clearRecords();
        this.bounceBackToStep();
    }

    clearRecords = ()=>{
        const {dispatch} = this.props;
        dispatch(onboardingActions.UploadAFile("CLEAR"));
        dispatch(onboardingActions.UpdateCustomerDetails("CLEAR"));
        dispatch(onboardingActions.GetLgas("CLEAR"));
    }

    bounceBackToStep = ()=>{
        
        let {existingCustomerInfo, loggedData, psbuser}= this.state;
        
        if(!psbuser || (existingCustomerInfo==="" && loggedData==="")){
                history.push("/")
        }else{
            if(existingCustomerInfo!==""){
                
                this.setState({
                    customerInfo: existingCustomerInfo.userProfile
                })
            }else{
                if(loggedData!==""){
                    this.setState({
                        customerInfo: loggedData
                    })
                    
                }
            }
            
        }
    }
    isFileImage=(file)=> {
        const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
     
        return file && acceptedImageTypes.includes(file['type'])
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

    
    
    

    updateCustomerDetails = async(payload) =>{
        const {dispatch} = this.props;

        await dispatch(onboardingActions.UpdateCustomerDetails(payload));
    }

    updateCustomerDp = async(payload) =>{
        const {dispatch} = this.props;

        await dispatch(onboardingActions.UploadAFile(payload));
    }

    getLgasInState = async(stateCode) =>{
        const {dispatch} = this.props;
        await dispatch(onboardingActions.GetLgas(stateCode));
    }

    loadLgas = (stateCode)=>{
        this.getLgasInState(stateCode)
            .then(()=>{
                let GetLgasRequest      = this.props.GetLgasReducer,
                    lgaList =[];
                if(GetLgasRequest.request_status ===onboardingConstants.GET_LGAS_SUCCESS){
                    
                    let lgaData = GetLgasRequest.request_data.response;
                    lgaData.map((eachLga, id)=>{
                        lgaList.push({value:eachLga.lgaId, label: eachLga.lgaName})
                    })


                    lgaList.sort(function(a, b) {
                        var lgaA = a.label.toUpperCase();
                        var lgaB = b.label.toUpperCase();
                        return (lgaA < lgaB) ? -1 : (lgaA > lgaB) ? 1 : 0;
                    });
        
                    

                    this.setState({lgaList})
                    
                    // customerInfo.states.map((eachState, index)=>{
                    //     stateLists.push({value:eachState.code, label: eachState.stateName})
                    // })
                }
            })
    }

    titleCase = (str) => {
        str = str.toLowerCase().split(' ');
        for (var i = 0; i < str.length; i++) {
            str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
        }
        return str.join(' ');
    }



    renderSignUpStep3=()=>{
        let updateCustomerDetailsRequest = this.props.UpdateCustomerDetailsReducer,
            uploadAFileRequest =  this.props.UploadAFileReducer,
            GetLgasRequest      = this.props.GetLgasReducer;

        const {customerInfo,existingCustomerInfo, docuploaded, previewStyles, lgaList, psbuser, invalidImageUpload} = this.state;
        
        let loginValidationSchema = Yup.object().shape({
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
                homeAddress: Yup.string()
                    .required('Required'),
                homeAddress2: Yup.string()
                    .required('Required'),
                dateOfBirth: Yup.string()
                    .required('Required'),
                gender: Yup.string()
                    .required('Required'),
                stateChosen: Yup.string()
                    .required('Required'),
                lgaChosen: Yup.string()
                    .required('Required'),
                    
          });

          
          let stateLists = [];

          
          
          if(customerInfo.states!==null && customerInfo.states!==undefined){
            customerInfo.states.map((eachState, index)=>{
                stateLists.push({value:eachState.code, label: this.titleCase(eachState.stateName)})
            })

            
            
            // this.listOfStates = stateLists;
          }else{
            if(psbuser!==undefined && psbuser.states!==null && psbuser.states!==undefined){
                psbuser.states.map((eachState, index) => {
                    stateLists.push({ value: eachState.code, label: eachState.stateName })
                })
            }
            
          }

          this.listOfStates = stateLists;
          
        //   this.setState({listofStates:stateLists})

        

        
          
        return(
            <div className="onboardingcontent-wrap">
                <div className="eachsection imgsection full-length pt-100">
                    <img src={SignupImg} alt=""/>
                </div>
                
                <div className="eachsection full-length pt-200">
                    <div className="onboarding-info">
                        <div className="cardpanel">
                            <div className="indicator three-of-3"></div>
                            <div className="indicator-text">
                                <div className="back-nav">
                                    <Link to="/app/signup/otp">&lt;Go Back</Link>
                                </div>
                                <div className="current-stage">
                                    3 of 3
                                </div>
                            </div>
                            <div className="card-heading mb-10">Please confirm your details</div>
                            <div className="card-text">
                                We checked you out but need a little bit more about you. Please provide
                            </div>

                            <div className="card-text text-center">
                                    <div className="" 
                                            className={uploadAFileRequest.is_request_processing?"photo-upload disabled-item" :"photo-upload"} >
                                        <label htmlFor="photo-upload" className="upload-photo" style={previewStyles}></label>
                                        <input type="file" accept="image/*" name="" id="photo-upload"  onChange={this.HandleFileUpLoad}/>
                                    </div>
                                Upload a picture of yourself
                            </div>
                            {invalidImageUpload &&
                                <Alert variant="danger">
                                    Please upload a valid image
                                </Alert>
                            }
                            {uploadAFileRequest.request_status === onboardingConstants.UPLOAD_A_FILE_FAILURE &&
                                <Alert variant="danger">
                                    {uploadAFileRequest.request_data.error !== undefined ? uploadAFileRequest.request_data.error : null}
                                </Alert>
                            }
                            {uploadAFileRequest.request_status === onboardingConstants.UPLOAD_A_FILE_SUCCESS &&
                                <Alert variant="success">
                                    Profile picture was successfully updated
                                </Alert>
                            }
                            <Formik
                                initialValues={{
                                    // firstName: (customerInfo!=="" && customerInfo.cif!==null && customerInfo.cif!==undefined)? customerInfo.cif:"",
                                    firstName: (customerInfo!=="" && customerInfo.firstName!==null && customerInfo.firstName!==undefined)? customerInfo.firstName:"",
                                    middleName: (customerInfo!=="" && customerInfo.middleName!==null && customerInfo.middleName!==undefined)? customerInfo.middleName:"",
                                    lastName:(customerInfo!=="" && customerInfo.lastName!==null && customerInfo.lastName!==undefined)? customerInfo.lastName:"",
                                    homeAddress: (customerInfo!=="" && customerInfo.homeAddress!==null && customerInfo.homeAddress!==undefined)? customerInfo.homeAddress: "",
                                    homeAddress2: (customerInfo!=="" && customerInfo.nearestBusStop!==null && customerInfo.nearestBusStop!==undefined)? customerInfo.nearestBusStop: "",
                                    dateOfBirth: (customerInfo!=="" && customerInfo.dateofBirth!==null && customerInfo.dateofBirth!==undefined)? getDateFromISO(customerInfo.dateofBirth):"",
                                    stateChosen: "",
                                    lgaChosen: "",
                                    gender: (customerInfo!=="" && customerInfo.gender!==null && customerInfo.gender!==undefined)? customerInfo.gender:"",

                                    // isFirstNameReturned: (customerInfo!=="" && customerInfo.cif!==null && customerInfo.cif!==undefined)?true:false,
                                    isFirstNameReturned: (customerInfo!=="" && customerInfo.firstName!==null && customerInfo.firstName!==undefined)?true:false,
                                    isMiddleNameReturned: (customerInfo!=="" && customerInfo.middleName!==null && customerInfo.middleName!==undefined)?true:false,
                                    isLastNameReturned: (customerInfo!=="" && customerInfo.lastName!==null && customerInfo.lastName!==undefined)?true:false,
                                    isHomeAddressReturned: (customerInfo!=="" && customerInfo.homeAddress!==null && customerInfo.homeAddress!==undefined)?true:false,
                                    isHomeAddress2Returned: (customerInfo!=="" && customerInfo.nearestBusStop!==null && customerInfo.nearestBusStop!==undefined)?true:false,
                                    isDateOfBirthReturned: (customerInfo!=="" && customerInfo.dateofBirth!==null && customerInfo.dateofBirth!==undefined)?true:false,
                                    isGenderReturned: (customerInfo!=="" && customerInfo.gender!==null && customerInfo.gender!==undefined)?true:false
                                }}
                                enableReinitialize={true}

                                validationSchema={loginValidationSchema}
                                onSubmit={(values, { resetForm }) => {

                                    let payload = {
                                            cif:            (customerInfo!=="" && customerInfo.cif!==null && customerInfo.cif!==undefined)                          ? customerInfo.cif : 
                                                                                                                                                                                            (psbuser.cif!==null && psbuser.cif!==undefined)?psbuser.cif:"",
                                            firstName:      (customerInfo!=="" && customerInfo.firstName!==null && customerInfo.firstName!==undefined)              ? customerInfo.firstName:values.firstName,
                                            middleName:     (customerInfo!=="" && customerInfo.middleName!==null && customerInfo.middleName!==undefined)            ? customerInfo.middleName:`${values.middleName!==""? values.middleName : null}`,
                                            lastName:       (customerInfo!=="" && customerInfo.lastName!==null && customerInfo.lastName!==undefined)                ? customerInfo.lastName:values.lastName,
                                            dateofBirth:    (customerInfo!=="" && customerInfo.dateofBirth!==null && customerInfo.dateofBirth!==undefined)          ? customerInfo.dateofBirth:values.dateOfBirth.toISOString(),
                                            homeAddress:    (customerInfo!=="" && customerInfo.homeAddress!==null && customerInfo.homeAddress!==undefined)          ? customerInfo.homeAddress: values.homeAddress,
                                            nearestBusStop: (customerInfo!=="" && customerInfo.homeAddress2!==null && customerInfo.homeAddress2!==undefined)        ? customerInfo.homeAddress2: values.homeAddress2,
                                            gender:         (customerInfo!=="" && customerInfo.gender!==null && customerInfo.gender!==undefined)                    ? customerInfo.gender:values.gender,
                                            lga:            this.state.lgaText,
                                            lgaCode:        values.lgaChosen,
                                            state:          this.state.stateText,
                                            stateCode:      values.stateChosen,
                                            gender:         (customerInfo!=="" && customerInfo.gender!==null && customerInfo.gender!==undefined)                    ? customerInfo.gender:values.gender,
                                    }

                                    if(docuploaded!==''){
                                        const   dpFormData = new FormData();
                                                dpFormData.append('File', this.state.docuploaded);
                                                dpFormData.append('DocumentType', 2);
                                        
                                            this.updateCustomerDp(dpFormData);
                                    }

                                    this.updateCustomerDetails(payload);
                                    
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



                                            <Form.Group className="onboardinginput">

                                                <Form.Label className="block-level">First Name</Form.Label>
                                                <Form.Control type="text"
                                                    name="firstName"
                                                    onChange={handleChange}
                                                    placeholder=""
                                                    value={values.firstName}
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
                                                    onChange={handleChange}
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
                                                    <Form.Group controlId="debitLocation" className={errors.dateOfBirth && touched.dateOfBirth ? "has-invaliderror fullwidthdate" : "fullwidthdate"}>
                                                        
                                                        <DatePicker placeholderText="Choose  date"

                                                            // onChange={this.handleDatePicker}
                                                            // onChangeRaw={(e) => this.handleDateChange(e)}
                                                            dateFormat="d MMMM, yyyy"
                                                            className="form-control form-control-sm"
                                                            peekNextMonth
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            dropdownMode="select"
                                                            name="dateOfBirth"
                                                            disabled={values.isDateOfBirthReturned}
                                                            value={values.dateOfBirth}
                                                            onChange={setFieldValue}
                                                            maxDate={new Date()}
                                                            className={errors.dateOfBirth && touched.dateOfBirth ? "is-invalid form-control form-control-sm h-38px" : "form-control form-control-sm h-38px"}

                                                        />
                                                        {errors.dateOfBirth && touched.dateOfBirth ? (
                                                            <span className="invalid-feedback">{errors.dateOfBirth}</span>
                                                        ) : null}
                                                    </Form.Group>
                                                </Col>
                                                <Col>
                                                    <select id="gender"
                                                        onChange={handleChange}
                                                        name="gender"
                                                        disabled={values.isGenderReturned}
                                                        value={values.gender}
                                                        className={errors.gender && touched.gender ? "is-invalid form-control form-control-sm h-38px" : "form-control form-control-sm h-38px"}
                                                    >
                                                        <option>Sex</option>
                                                        <option value="Female">Female</option>
                                                        <option value="Male">Male</option>
                                                    </select>
                                                    {errors.gender && touched.gender ? (
                                                        <span className="invalid-feedback">{errors.gender}</span>
                                                    ) : null}
                                                </Col>
                                            </Form.Row>

                                            <div className="bvn-info textleft">
                                                Home Address
                                            </div>

                                            <Form.Group className="onboardinginput">

                                                <Form.Label className="block-level">Address Line 1</Form.Label>
                                                <Form.Control type="text"
                                                    name="homeAddress"
                                                    onChange={handleChange}
                                                    placeholder="Street address"
                                                    disabled={values.isHomeAddressReturned}
                                                    value={values.homeAddress}
                                                    className={errors.homeAddress && touched.homeAddress ? "is-invalid" : null}
                                                    required />
                                                {errors.homeAddress && touched.homeAddress ? (
                                                    <span className="invalid-feedback">{errors.homeAddress}</span>
                                                ) : null}

                                            </Form.Group>

                                            <Form.Group className="onboardinginput">

                                                <Form.Label className="block-level">Address Line 2</Form.Label>
                                                <Form.Control type="text"
                                                    name="homeAddress2"
                                                    onChange={handleChange}
                                                    placeholder="Apartment or suite, building, floor e.t.c"
                                                    disabled={values.isHomeAddress2Returned}
                                                    value={values.homeAddress2}
                                                    className={errors.homeAddress2 && touched.homeAddress2 ? "is-invalid" : null}
                                                    required />
                                                {errors.homeAddress2 && touched.homeAddress2 ? (
                                                    <span className="invalid-feedback">{errors.homeAddress2}</span>
                                                ) : null}

                                            </Form.Group>

                                            <Form.Group className="">
                                                <Select
                                                    options={this.listOfStates}
                                                    placeholder="State"
                                                    name="stateChosen"
                                                    onChange={(selected) => {
                                                        setFieldValue('stateChosen', selected.value)
                                                        this.loadLgas(selected.value)
                                                        this.setState({ 
                                                            // stateChosen: selected.value,
                                                            stateText:selected.label
                                                        })
                                                    }}
                                                    className={errors.stateChosen && touched.stateChosen ? "is-invalid" : null}
                                                    onBlur={()=> setFieldTouched('stateChosen', true)}
                                                />
                                                {GetLgasRequest.request_status ===onboardingConstants.GET_LGAS_PENDING && 
                                                    <small>Loading local government areas...</small>
                                                }
                                                {errors.stateChosen && touched.stateChosen ? (
                                                    <span className="invalid-feedback">{errors.stateChosen}</span>
                                                ) : null}

                                            </Form.Group>

                                            {GetLgasRequest.request_status ===onboardingConstants.GET_LGAS_SUCCESS &&

                                                <Form.Group className="">
                                                    <Select
                                                        options={lgaList}
                                                        onChange={this.setAccountChosen}
                                                        onChange={(selected) => {
                                                            setFieldValue('lgaChosen', selected.value)
                                                            this.setState({ 
                                                                // stateChosen: selected.value,
                                                                lgaText:selected.label
                                                            })
                                                            // this.setState({ typeDesc: selected.desc})
                                                        }}
                                                        placeholder="Local Government"
                                                        onBlur={()=> setFieldTouched('lgaChosen', true)}
                                                        className={errors.lgaChosen && touched.lgaChosen ? "is-invalid" : null}
                                                        name="lgaChosen"
                                                    />
                                                    {errors.lgaChosen && touched.lgaChosen ? (
                                                        <span className="invalid-feedback">{errors.lgaChosen}</span>
                                                    ) : null}

                                                </Form.Group>
                                            }

                                           
                                            
                                            
                                            

                                            <div className="footer-with-cta centered ">
                                                <Button variant="secondary"
                                                    type="submit"
                                                    disabled={updateCustomerDetailsRequest.is_request_processing}
                                                    className="ml-0 onboarding-btn"
                                                >  {updateCustomerDetailsRequest.is_request_processing ?"Please wait..." : "Continue"}
                                                </Button>

                                            </div>

                                            {updateCustomerDetailsRequest.request_status === onboardingConstants.UPDATE_PROFILE_FAILURE &&
                                                <Alert variant="danger mt-20">
                                                    
                                                    {updateCustomerDetailsRequest.request_data.error !== undefined ? updateCustomerDetailsRequest.request_data.error : "An error occured please try again"}

                                                </Alert>
                                            }

                                        </Form>
                                    )}
                            </Formik>
                        </div>
                        <div className="signup-info">
                           Already have an account? <Link to='/'>Sign In</Link> 
                        </div>
                    </div>
                </div>
            </div>
        )
    }

  
    


    render() {
        
        
        return (
            <Fragment>
                <Helmet>
                    <title>9PSB - Create account | details</title>
                </Helmet>
                <OnboardingContainer>
                <div className="onboarding-page">
                   {this.renderSignUpStep3()}
                </div>
                </OnboardingContainer>
            </Fragment>
        );
    }
}


function mapStateToProps(state) {
    return {
        ValidateRegOtpReducer : state.onboardingReducers.ValidateRegOtpReducer,
        LoginReducer : state.onboardingReducers.LoginReducer,
        UpdateCustomerDetailsReducer : state.onboardingReducers.UpdateCustomerDetailsReducer,
        UploadAFileReducer : state.onboardingReducers.UploadAFileReducer,
        CreateTransactionPinReducer : state.onboardingReducers.CreateTransactionPinReducer,
        GetLgasReducer : state.onboardingReducers.GetLgasReducer
    };
}

export default connect(mapStateToProps)(ConfirmDetailsFromOtp);