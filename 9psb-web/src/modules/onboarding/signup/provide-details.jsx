import * as React from 'react';
import { Link} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";
import equal from 'fast-deep-equal'

import {encryptAnItem} from '../../../shared/shared-utils/index';
import { Helmet } from 'react-helmet';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import {history} from '../../../_helpers/history'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import  OnboardingContainer from '../../../shared/templates/onboarding-container'
import SignupImg from '../../../assets/images/signup2.svg';
import Select from 'react-select';
import {onboardingActions} from '../../../redux/actions/onboarding/onboarding';
import {onboardingConstants} from '../../../redux/actiontypes/onboarding/onboarding.constants';
import { allowNumbersOnly } from "../../../shared/utils";
import "./signup.scss"; 
class GetCustomerDetails extends React.Component{
    constructor(props) {
        super(props);
        let getExistingInfo = this.props.CheckIfCustomerExistsReducer;
        this.state={
            user:"",
            password:"",
            passwordType: "password",
            existingCustomerCheck: (Object.keys(getExistingInfo).length>=1 && getExistingInfo.request_data.phoneNumber!==undefined && getExistingInfo.request_data.phoneNumber!==null)
                                    ? getExistingInfo.request_data.phoneNumber: '' 
        }
        
     
    
    }

    componentDidMount(){
        this.clearRecords();
        this.bounceBackToStep();
    }

    componentDidUpdate(prevProps) {
        if(!equal(this.props.CheckIfCustomerExistsReducer, prevProps.CheckIfCustomerExistsReducer)) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
        {
          this.bounceBackToStep();
        }
    } 

    clearRecords = ()=>{
        const {dispatch} = this.props;
        if(this.props.CreateAccountStep1Reducer.request_status === onboardingConstants.CREATE_USER_ACCOUNT_FAILURE){
            dispatch(onboardingActions.CreateAccountStep1("CLEAR"));
        }
    }

    bounceBackToStep = ()=>{
        let getExistingInfo = this.props.CheckIfCustomerExistsReducer;

        
        if((Object.keys(getExistingInfo).length>=1 && (getExistingInfo.request_data.phoneNumber===undefined 
            || getExistingInfo.request_data.phoneNumber===null)) ||
            (Object.keys(getExistingInfo).length<1)){
                history.push("/app/signup")
        }
    }

    registerStep2 = async(payload) =>{
        const {dispatch} = this.props;

        await dispatch(onboardingActions.CreateAccountStep1(payload));
    }

    showPassword = () => {
        let { passwordType } = this.state

        if (passwordType === "password") {
            this.setState({ passwordType: "text" })

        } else {
            this.setState({ passwordType: "password" })
        }
    }

    checkPwd =()=>{
        let str = this.state.password;
        var digitEx = new RegExp(/\d/);
        var lowerEx = new RegExp(/[a-z]/);
        var upperCase = new RegExp(/[A-Z]/);
        var spCharacter = new RegExp(/[^a-zA-Z0-9]/);
        var condition = true;
        var message = "";
        if (str.length < 8) {
            message = "Password must be up to 8 characters";
            condition = false;
        }else if (str.length > 16) {
            message = "Password cannot be more than 16 characters";
            condition = false;
        } else if (!digitEx.test(str)) {
            message = "Password must contain a digit";
            condition = false;
        }  else if (!upperCase.test(str)) {
            message = "Password must contain a upper case alphabet";
            condition = false;
        }
        else if (!spCharacter.test(str)) {
            message = "Password must contain atleast a special character";
            condition = false;
        }

        if (condition === false) {
            this.setState({ passwordValid: false, passwordInvalidMessage: message });
            return false;
        }
        else {
            this.setState({ passwordValid: true });
            return true;
        }
        
    }

    // checkIfNumExists = (payload)=>{
    //     this.registerStep2(payload)
    // }


    renderSignUpStep2 =()=>{
        let CreateAccountStep1Request = this.props.CreateAccountStep1Reducer;
        const {existingCustomerCheck,
                passwordValid,
                password,
                passwordType,
                passwordInvalidMessage} = this.state;
        
        
        
        let checkValidationSchema = Yup.object().shape({
            phoneNumber: Yup.string()
                .min(10, 'Valid phone number only')
                .max(11, 'Valid phone number only')
                .required('Required'),
            meansOfId: Yup.string()
                .required('Required'),
            password: Yup.string().trim()
                // .min(6, 'Minimum of 6 characters')
                .required('Required'),
            confirmPassword: Yup.string()
                .required('Required')
                .oneOf([Yup.ref('password'), null], 'Passwords must match'),
            // idNumber: Yup.string()
            //     .required('Required'),
            idNumber:  Yup.string()
                .when('meansOfId',{
                    is:(value)=>value!=="0",
                    then: Yup.string()
                        .min(1, 'Valid response required')
                        .required('Required')
                }),
            emailAddress: Yup.string()
                .email('Valid email required'),
                
          });

        let IdOptions =[
            {value: 1, label: 'BVN'},
            // {value: 2, label: 'Drivers Licence'},
            // {value: 3, label: 'International Passport'},
            // {value: 4, label: 'Permanent Voters Card'},
            {value: 0, label: 'No means of Id'},
        ];

        
          
        return(
            <div className="onboardingcontent-wrap">
                <div className="eachsection imgsection full-length pt-100">
                    <img src={SignupImg} alt=""/>
                </div>
                <div className="eachsection full-length pt-200">
                    <div className="onboarding-info">
                        <div className="cardpanel">
                            <div className="indicator one-of-3"></div>
                            <div className="indicator-text">
                                <div className="back-nav">
                                    
                                </div>
                                <div className="current-stage">
                                    1 of 3
                                </div>
                            </div>
                            <div className="card-heading mb-10">Good to have you!</div>
                            <div className="card-text">
                                Now, let’s open your account. Please complete the form below. 
                            </div>
                            <Formik
                                initialValues={{
                                    phoneNumber: existingCustomerCheck,
                                    meansOfId: 0,
                                    idNumber:'',
                                    emailAddress:'',
                                    password:'',
                                    confirmPassword:'',
                                }}

                                validationSchema={checkValidationSchema}
                                onSubmit={(values, { resetForm }) => {

                                    let payload;
                                    if(this.checkPwd()){
                                        let mobileNumber = values.phoneNumber;
                                        if(values.phoneNumber.length===10){
                                            mobileNumber = `234${values.phoneNumber}`;
                                        } 
                                        if(values.meansOfId!==0){
                                            payload = {
                                                mobileNumber: mobileNumber,
                                                password: encryptAnItem(values.password),
                                                email: values.emailAddress!=''?values.emailAddress: null,
                                                meansOfId: parseInt(values.meansOfId),
                                                idNumber: parseInt(values.meansOfId)!==0? values.idNumber:"0",
                                            }
                                        }

                                        if(values.meansOfId===0){
                                            payload = {
                                                mobileNumber: mobileNumber,
                                                password: encryptAnItem(values.password),
                                                email: values.emailAddress!=''?values.emailAddress: null,
                                                meansOfId: parseInt(values.meansOfId),
                                                idNumber: "0",
                                            }
                                        }


                                    
                                        // return;
                                        this.registerStep2(payload)
                                                .then(()=>{
                                                    // if(CreateAccountStep1Request.request_status === onboardingConstants.CREATE_USER_ACCOUNT_FAILURE){
                                                    //     setTimeout(() => {
                                                    //         const {dispatch} = this.props;
                                                    //             dispatch(onboardingActions.CreateAccountStep1("CLEAR"));
                                                    //     }, 6000);
                                                    // }
                                                })

                                    }
                                    // history.push("/store/dashboard")
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

                                                <Form.Label className="block-level">Phone Number</Form.Label>
                                                <InputGroup>
                                                    <InputGroup.Prepend>
                                                        <InputGroup.Text id="inputGroupPrepend" 
                                                        className={this.state.activatePhone?"active":""}>+234</InputGroup.Text>
                                                    </InputGroup.Prepend>
                                                    <Form.Control type="text"
                                                        name="phoneNumber"
                                                        onChange={handleChange}
                                                        placeholder=""
                                                        value={allowNumbersOnly(values.phoneNumber, 11)}
                                                        onBlur={()=>this.setState({activatePhone: false})}
                                                        onFocus={()=>this.setState({activatePhone: true})}
                                                        className={errors.phoneNumber && touched.phoneNumber ? "is-invalid" : null}
                                                        required />
                                                </InputGroup>
                                                {errors.phoneNumber && touched.phoneNumber ? (
                                                    <span className="invalid-feedback">{errors.phoneNumber}</span>
                                                ) : null}

                                            </Form.Group>

                                            <Form.Group className="onboardinginput withselect">
                                                <Form.Label className="block-level">Means of ID</Form.Label>
                                                <Select
                                                    options={IdOptions}
                                                    onChange={(selected) => setFieldValue('meansOfId', selected.value)}
                                                    onBlur={()=> setFieldTouched('meansOfId', true)}
                                                    className={errors.meansOfId && touched.meansOfId ? "is-invalid" : null}
                                                    name="meansOfId"
                                                />
                                                {errors.meansOfId && touched.meansOfId ? (
                                                    <span className="invalid-feedback">{errors.meansOfId}</span>
                                                ) : null}
                                            </Form.Group>
                                            <div className="bvn-info">
                                                Dial *565*0# to get you BVN
                                            </div>

                                            {values.meansOfId!==0 &&
                                                <Form.Group className="inputfield">
                                                    <Form.Control type="text"
                                                        name="idNumber"
                                                        onChange={handleChange}
                                                        placeholder="ID Number"
                                                        value={values.idNumber}
                                                        className={errors.idNumber && touched.idNumber ? "is-invalid" : null}
                                                        required />
                                                    {errors.idNumber && touched.idNumber ? (
                                                        <span className="invalid-feedback">{errors.idNumber}</span>
                                                    ) : null}

                                                </Form.Group>
                                            }

                                            <Form.Group className="inputfield">
                                                <Form.Control type="text"
                                                    name="emailAddress"
                                                    onChange={handleChange}
                                                    placeholder="Email address"
                                                    value={values.emailAddress}
                                                    className={errors.emailAddress && touched.emailAddress ? "is-invalid" : null}
                                                    required />
                                                {errors.emailAddress && touched.emailAddress ? (
                                                    <span className="invalid-feedback">{errors.emailAddress}</span>
                                                ) : null}

                                            </Form.Group>

                                            <Form.Group className="inputfield">
                                                <Form.Control type={passwordType}
                                                    name="password"
                                                    placeholder="Set Password"
                                                    // onChange={handleChange}
                                                    onChange={(e) => {
                                                        this.setState({password:e.target.value}, ()=>this.checkPwd())
                                                        
                                                        setFieldValue('password', e.target.value)
                                                    }}
                                                    onBlur={()=> setFieldTouched('password', true)}
                                                    value={values.password}
                                                    maxLength="16"
                                                    className={errors.password && touched.password ? "is-invalid mb-0" : "mb-0"}
                                                    required />
                                                
                                                {errors.password && touched.password ? (
                                                    <span className="invalid-feedback">{errors.password}</span>
                                                ) : null}
                                                {(passwordValid || password==="") && <div className="pw-hint">Your password must contain an <b>upper-case letter</b>, a <b>number</b>, a <b>special character</b> and must be between 8 to 16 characters.</div>}
                                                {(!passwordValid && password!=="") &&
                                                    <div className="text-danger error-txt">{passwordInvalidMessage}</div>
                                                    }

                                            </Form.Group>
                                            <label htmlFor="showPassword" className="show-pw">Show Password</label>
                                            <input type="checkbox" id="showPassword" onChange={this.showPassword} />

                                            <Form.Group className="inputfield">
                                                <Form.Control 
                                                    type="password"
                                                    name="confirmPassword"
                                                    placeholder="Confirm Password"
                                                    onChange={handleChange}
                                                    value={values.confirmPassword}
                                                    className={errors.confirmPassword && touched.confirmPassword ? "is-invalid" : null}
                                                    required />
                                                
                                                {errors.confirmPassword && touched.confirmPassword ? (
                                                    <span className="invalid-feedback">{errors.confirmPassword}</span>
                                                ) : null}

                                            </Form.Group>


                                            <div className="footer-with-cta centered ">
                                                <Button variant="secondary"
                                                    type="submit"
                                                    disabled={CreateAccountStep1Request.is_request_processing}
                                                    className="ml-0 onboarding-btn"
                                                >  {CreateAccountStep1Request.is_request_processing?'Please wait...' :'Continue'}
                                                </Button>

                                            </div>
                                            {(CreateAccountStep1Request.request_status === onboardingConstants.CREATE_USER_ACCOUNT_FAILURE) &&
                                                <Alert variant="danger">
                                                    
                                                    {CreateAccountStep1Request.request_data.error !== undefined ? CreateAccountStep1Request.request_data.error : "An error occured please try again"}
                                                </Alert>
                                            }
                                            {/* {loginRequest.request_status === authConstants.LOGIN_USER_FAILURE &&
                                    <Alert variant="danger mt-20">
                                        {loginRequest.request_data.error !== undefined ? loginRequest.request_data.error : null}


                                    </Alert>
                                } */}

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
                    <title>9PSB - Create account  | details</title>
                </Helmet>
                <OnboardingContainer>
                <div className="onboarding-page">
                   {this.renderSignUpStep2()}
                </div>
                </OnboardingContainer>
            </Fragment>
        );
    }
}


function mapStateToProps(state) {
    return {
        CheckIfCustomerExistsReducer : state.onboardingReducers.CheckIfCustomerExistsReducer,
        CreateAccountStep1Reducer : state.onboardingReducers.CreateAccountStep1Reducer
    };
}

export default connect(mapStateToProps)(GetCustomerDetails);