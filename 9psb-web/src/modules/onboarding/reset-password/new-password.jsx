import * as React from 'react';
import { Link} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";

import { Formik } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import {history} from '../../../_helpers/history'
import  OnboardingContainer from '../../../shared/templates/onboarding-container'

import { Helmet } from 'react-helmet';
import {encryptAnItem} from '../../../shared/shared-utils/index';

import ForgotPwImg from '../../../assets/images/forgot1.svg';
import Select from 'react-select';
import Alert from 'react-bootstrap/Alert';
import {onboardingActions} from '../../../redux/actions/onboarding/onboarding';
import {onboardingConstants} from '../../../redux/actiontypes/onboarding/onboarding.constants';

import "./signup.scss"; 
class SetNewPassword extends React.Component{
    constructor(props) {
        super(props);
        let getExistingInfo = this.props.InititatePasswordResetReducer;
        this.state={
            user:"",
            password:"",
            requestTrackingId: (Object.keys(getExistingInfo).length>=1 
                && getExistingInfo.request_status === onboardingConstants.INITIATE_PASSWORD_RESET_SUCCESS)
            ? getExistingInfo.request_data.response.requestTrackingId: '' 
        }
   
    
    }

    componentDidMount(){
        this.clearRecords();
        this.bounceBackToStep();
    }


    clearRecords = ()=>{
        const {dispatch} = this.props;
        // if(this.props.CreateAccountStep1Reducer.request_status === onboardingConstants.CREATE_USER_ACCOUNT_FAILURE){
        //     dispatch(onboardingActions.CreateAccountStep1("CLEAR"));
        // }
        dispatch(onboardingActions.CompletePasswordReset("CLEAR"));
    }

    bounceBackToStep = ()=>{
        let getExistingInfo = this.props.InititatePasswordResetReducer;
        let ValidateRegOtpRequest = this.props.ValidateRegOtpReducer;

        
        if((Object.keys(getExistingInfo).length>=1 
            && (getExistingInfo.request_status !== onboardingConstants.INITIATE_PASSWORD_RESET_SUCCESS
                || ValidateRegOtpRequest.request_status !== onboardingConstants.VALIDATE_OTP_SUCCESS)) 
            ||
            (Object.keys(getExistingInfo).length<1)){
                history.push("/")
        }
    }


    completeSetNewPassword = async(payload) =>{
        const {dispatch} = this.props;

        await dispatch(onboardingActions.CompletePasswordReset(payload));
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

        if(condition === false)
       { this.setState({passwordValid : false, passwordInvalidMessage : message});
          return false;
         }
        else{ this.setState({ passwordValid : true });
        return true;
     }
        
    }



    renderCreateNewPassword =()=>{
        let completePasswordResetRequest = this.props.CompletePasswordResetReducer;
        const {requestTrackingId,
                passwordValid,
                password,
                passwordInvalidMessage} = this.state;
        let newPwValidationSchema = Yup.object().shape({
            newPw: Yup.string().trim()
                // .min(6, 'Minimum of 6 characters')
                .required('Required'),
            confirmNewPw: Yup.string().trim()
                .required('Required')
                .oneOf([Yup.ref('newPw'), null], 'Passwords must match'),
          });

        

        
          
        return(
            <div className="onboardingcontent-wrap">
                <div className="eachsection imgsection">
                    <img src={ForgotPwImg} alt=""/>
                </div>
                <div className="eachsection ">
                    <div className="onboarding-info">
                        <div className="cardpanel">
                            <div className="card-heading mb-10">Now, reset your password</div>
                            <div className="card-text">
                                Please reset your password now
                            </div>
                            <Formik
                                initialValues={{
                                    newPw: '',
                                    confirmNewPw: '',
                                }}

                                validationSchema={newPwValidationSchema}
                                onSubmit={(values, { resetForm }) => {


                                    if(this.checkPwd()){
                                        let payload = {
                                            hash: requestTrackingId,
                                            password: encryptAnItem(values.newPw)
                                        }

                                        this.completeSetNewPassword(payload)
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

                                                <Form.Label className="block-level">New Password</Form.Label>
                                                <Form.Control type="password"
                                                    name="newPw"
                                                    onChange={handleChange}
                                                    
                                                    value={values.newPw}
                                                    onChange={(e) => {
                                                        this.setState({password:e.target.value})
                                                        this.checkPwd()
                                                        setFieldValue('newPw', e.target.value)
                                                    }}
                                                    onBlur={()=> setFieldTouched('newPw', true)}
                                                    className={errors.newPw && touched.newPw ? "is-invalid" : null}
                                                    required />
                                                {errors.newPw && touched.newPw ? (
                                                    <span className="invalid-feedback">{errors.newPw}</span>
                                                ) : null}
                                                {(passwordValid || password==="") && <div className="pw-hint">Your password must contain an <b>upper-case letter</b>, a <b>number</b>, a <b>special character</b> and must be between 8 to 16 characters.</div>}
                                                {!passwordValid &&
                                                    <div className="text-danger error-txt">{passwordInvalidMessage}</div>
                                                    }

                                            </Form.Group>

                                            <Form.Group className="onboardinginput">

                                                <Form.Label className="block-level">Confirm Password</Form.Label>
                                                <Form.Control type="password"
                                                    name="confirmNewPw"
                                                    onChange={handleChange}
                                                    
                                                    value={values.confirmNewPw}
                                                    className={errors.confirmNewPw && touched.confirmNewPw ? "is-invalid" : null}
                                                    required />
                                                {errors.confirmNewPw && touched.confirmNewPw ? (
                                                    <span className="invalid-feedback">{errors.confirmNewPw}</span>
                                                ) : null}

                                            </Form.Group>

                                            


                                            <div className="footer-with-cta centered blocked-style mt-60">
                                               
                                                <Button variant="secondary"
                                                    type="submit"
                                                    disabled={completePasswordResetRequest.is_request_processing}
                                                    className="ml-0 onboarding-btn"
                                                > {completePasswordResetRequest.is_request_processing?'Please wait...' :'Continue'}
                                                
                                                </Button>

                                            </div>

                                            {completePasswordResetRequest.request_status === onboardingConstants.COMPLETE_PASSWORD_RESET_FAILURE &&
                                                <Alert variant="danger mt-20">
                                                    {completePasswordResetRequest.request_data.error !== undefined ? completePasswordResetRequest.request_data.error : "An error occured please try again"}


                                                </Alert>
                                            }

                                        </Form>
                                    )}
                            </Formik>
                        </div>
                        <div className="signup-info">
                            I remember my password? <Link to='/'>Sign In</Link> 
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
                    <title>9PSB - New Password</title>
                </Helmet>
                <OnboardingContainer>
                <div className="onboarding-page">
                   {this.renderCreateNewPassword()}
                </div>
                </OnboardingContainer>
            </Fragment>
        );
    }
}


function mapStateToProps(state) {
    return {
        InititatePasswordResetReducer : state.onboardingReducers.InititatePasswordResetReducer,
        ValidateRegOtpReducer : state.onboardingReducers.ValidateRegOtpReducer,
        CompletePasswordResetReducer : state.onboardingReducers.CompletePasswordResetReducer,
    };
}

export default connect(mapStateToProps)(SetNewPassword);