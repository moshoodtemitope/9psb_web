import * as React from 'react';
import { Link} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";

import { Helmet } from 'react-helmet';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import Alert from 'react-bootstrap/Alert';
import {encryptAnItem} from '../../../shared/shared-utils/index';

import  OnboardingContainer from '../../../shared/templates/onboarding-container'
import LoginImg from '../../../assets/images/login.svg';
import {onboardingActions} from '../../../redux/actions/onboarding/onboarding';
import {onboardingConstants} from '../../../redux/actiontypes/onboarding/onboarding.constants';
import { allowNumbersOnly } from "../../../shared/utils";
import "./login.scss"; 
class AppLogin extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            user:"",
            passwordType: "password",
        }
   
    
    }

    componentDidMount(){
        this.clearRecords();

        const { dispatch } = this.props;
       
        
          dispatch(onboardingActions.initStore());
    }

    handleLogin = async(payload) =>{
        const {dispatch} = this.props;

        await dispatch(onboardingActions.Login(payload));
    }

    clearRecords = ()=>{
        const {dispatch} = this.props;
        dispatch(onboardingActions.Login("CLEAR"));
    }

    showPassword = () => {
        let { passwordType } = this.state

        if (passwordType === "password") {
            this.setState({ passwordType: "text" })

        } else {
            this.setState({ passwordType: "password" })
        }
    }



    renderLogin=()=>{
        let loginRequest = this.props.LoginReducer;
        let {passwordType} = this.state;
        let loginValidationSchema = Yup.object().shape({
            phoneNumber: Yup.string()
                .required('Required')
                .min(10, 'Enter a valid phone number')
                .max(11, 'Enter a valid phone number'),
                // .length(11, 'Enter a valid phone number'),
            password:  Yup.string()
                .required('Required'),
          });
          
        return(
            <div className="onboardingcontent-wrap">
                <div className="eachsection imgsection">
                    <img src={LoginImg} alt=""/>
                </div>
                <div className="eachsection">
                    <div className="onboarding-info">
                        <div className="cardpanel">
                            <div className="card-heading mb-10">Login to your account</div>
                            <div className="card-text">
                                Enter your phone number and password to login to your 9PSB account
                            </div>
                            <Formik
                                initialValues={{
                                    phoneNumber: '',
                                    password: '',
                                }}

                                validationSchema={loginValidationSchema}
                                onSubmit={(values, { resetForm }) => {

                                    let payload = {
                                        password: encryptAnItem(values.password),
                                        mobileNumber: values.phoneNumber.length===11 ? values.phoneNumber : `234${values.phoneNumber}`
                                    }

                                    this.handleLogin(payload);
                                    // history.push("/store/dashboard")
                                }}
                            >
                                {({ handleSubmit,
                                    handleChange,
                                    handleBlur,
                                    resetForm,
                                    values,
                                    touched,
                                    isValid,
                                    errors, }) => (
                                        <Form
                                            noValidate
                                            onSubmit={handleSubmit}
                                            className="form-content">



                                            <Form.Group className="onboardinginput">

                                                <Form.Label className="block-level">Phone Number</Form.Label>
                                                <InputGroup>
                                                    <InputGroup.Prepend
                                                        className={errors.phoneNumber && touched.phoneNumber ? "is-invalid" : null}
                                                    >
                                                        <InputGroup.Text id="inputGroupPrepend" 
                                                        
                                                        className={this.state.activatePhone?"active":""}>
                                                            +234
                                                    </InputGroup.Text>
                                                    </InputGroup.Prepend>
                                                    <Form.Control type="text"
                                                        name="phoneNumber"
                                                        onChange={handleChange}
                                                        placeholder=""
                                                        value={allowNumbersOnly(values.phoneNumber, 11)}
                                                        onBlur={()=>{
                                                            if(errors.phoneNumber && touched.phoneNumber){
                                                                this.setState({activatePhone: false})
                                                            }else{
                                                                this.setState({activatePhone: false})
                                                            }
                                                        }}
                                                        onFocus={()=>{
                                                            if(errors.phoneNumber && touched.phoneNumber){
                                                                this.setState({activatePhone: false})
                                                            }else{
                                                                this.setState({activatePhone: true})
                                                            }
                                                        }}
                                                        className={errors.phoneNumber && touched.phoneNumber ? "is-invalid" : null}
                                                        required />
                                                </InputGroup>
                                                {errors.phoneNumber && touched.phoneNumber ? (
                                                    <span className="invalid-feedback">{errors.phoneNumber}</span>
                                                ) : null}

                                            </Form.Group>

                                            <Form.Group className="onboardinginput">

                                                <Form.Label className="block-level">Password</Form.Label>
                                                <Form.Control type={passwordType}
                                                    name="password"
                                                    onChange={handleChange}
                                                    value={values.password}
                                                    className={errors.password && touched.password ? "is-invalid" : null}
                                                    required />
                                                
                                                {errors.password && touched.password ? (
                                                    <span className="invalid-feedback">{errors.password}</span>
                                                ) : null}

                                            </Form.Group>
                                            <label htmlFor="showPassword" className="show-pw">Show Password</label>
                                            <input type="checkbox" id="showPassword" onChange={this.showPassword} />
                                            <div className="login-extras">
                                                {/* <div className="remember-me">
                                                    <input type="checkbox" name="" id="remember-me"/>
                                                    <Form.Label htmlFor="remember-me" className="block-level">Remember me</Form.Label>
                                                </div> */}
                                                <div className="forgot-pw">
                                                    <Link to='/app/reset-password'>Forgot Password?</Link>
                                                </div>
                                            </div>

                                            <div className="footer-with-cta centered ">
                                                <Button variant="secondary"
                                                    type="submit"
                                                    disabled={loginRequest.is_request_processing}
                                                    className="ml-0 onboarding-btn"
                                                > {loginRequest.is_request_processing?'Please wait...' :'Continue'}
                                                </Button>

                                            </div>

                                            {loginRequest.request_status === onboardingConstants.LOGIN_USER_FAILURE &&
                                                <Alert variant="danger mt-20">
                                                    {(loginRequest.request_data && loginRequest.request_data.error !== undefined) ? loginRequest.request_data.error : "An error occured please try again"}
                                                </Alert>
                                            }

                                        </Form>
                                    )}
                            </Formik>
                        </div>
                        <div className="signup-info">
                            Don't have an account? <Link to='/app/signup'>Sign Up</Link> 
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
                    <title>9PSB - Login</title>
                </Helmet>
                <OnboardingContainer>
                <div className="onboarding-page">
                   {this.renderLogin()}
                </div>
                </OnboardingContainer>
            </Fragment>
        );
    }
}


function mapStateToProps(state) {
    return {
        LoginReducer : state.onboardingReducers.LoginReducer,
    };
}

export default connect(mapStateToProps)(AppLogin);