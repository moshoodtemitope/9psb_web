import * as React from 'react';
import { Link} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";

import { Formik } from 'formik';
import * as Yup from 'yup';
import { Helmet } from 'react-helmet';
import Form from 'react-bootstrap/Form';
import {history} from '../../../_helpers/history'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import Alert from 'react-bootstrap/Alert';
import  OnboardingContainer from '../../../shared/templates/onboarding-container'
import ForgotPwImg from '../../../assets/images/forgot1.svg';

import {onboardingActions} from '../../../redux/actions/onboarding/onboarding';
import {onboardingConstants} from '../../../redux/actiontypes/onboarding/onboarding.constants';

import "./signup.scss"; 
class ForgotPassword extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            user:""
        }
   
    
    }

    componentDidMount(){
       this.clearRecords();
    }

    clearRecords = ()=>{
        const {dispatch} = this.props;
        dispatch(onboardingActions.InititatePasswordReset("CLEAR"));
        dispatch(onboardingActions.ValidateRegOtp("CLEAR"));
        dispatch(onboardingActions.CompletePasswordReset("CLEAR"));
    }

    updateCustomerDetails = async(payload) =>{
        const {dispatch} = this.props;

        await dispatch(onboardingActions.InititatePasswordReset(payload));
    }


    renderForgotPw = ()=>{
        let InititatePasswordResetRequest = this.props.InititatePasswordResetReducer;
        const {user} = this.state;
        let forgotPwValidationSchema = Yup.object().shape({
            phoneNumber: Yup.string()
                .required('Required')
                .min(10,'Valid phone numbers only')
                .max(13,'Valid phone numbers only')
          });
          
        return(
            <div className="onboardingcontent-wrap">
                <div className="eachsection imgsection">
                    <img src={ForgotPwImg} alt=""/>
                </div>
                <div className="eachsection">
                    <div className="onboarding-info">
                        <div className="cardpanel">
                            <div className="card-heading mb-10">Forgot password</div>
                            <div className="card-text">
                                Provide your phone number.
                            </div>
                            <Formik
                                initialValues={{
                                    phoneNumber: '',
                                }}

                                validationSchema={forgotPwValidationSchema}
                                onSubmit={(values, { resetForm }) => {
                                    let phoneNum = values.phoneNumber;
                                    if(values.phoneNumber.length===10){
                                        phoneNum = `0${values.phoneNumber}`
                                    }
                                    let payload = {
                                        // phoneNumber: values.phoneNumber,
                                        reference: phoneNum,
                                        resetOption: 0,
                                        customerType: 1
                                    }


                                    this.updateCustomerDetails(payload)

                                    
                                    // history.push("/app/reset-password/otp");
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
                                                        value={values.phoneNumber}
                                                        onBlur={()=>this.setState({activatePhone: false})}
                                                        onFocus={()=>this.setState({activatePhone: true})}
                                                        className={errors.phoneNumber && touched.phoneNumber ? "is-invalid" : null}
                                                        required />
                                                </InputGroup>

                                            </Form.Group>


                                            <div className="footer-with-cta centered ">
                                                <Button variant="secondary"
                                                    type="submit"
                                                    disabled={InititatePasswordResetRequest.is_request_processing}
                                                    className="ml-0 onboarding-btn"
                                                > {InititatePasswordResetRequest.is_request_processing ?"Please wait..." : "Continue"}
                                               
                                                </Button>

                                            </div>

                                            {InititatePasswordResetRequest.request_status === onboardingConstants.INITIATE_PASSWORD_RESET_FAILURE &&
                                                <Alert variant="danger mt-20">
                                                    {InititatePasswordResetRequest.request_data.error !== undefined ? InititatePasswordResetRequest.request_data.error : "An error occured please try again"}


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
                    <title>9PSB - Reset password</title>
                </Helmet>
                <OnboardingContainer>
                <div className="onboarding-page">
                   {this.renderForgotPw()}
                </div>
                </OnboardingContainer>
            </Fragment>
        );
    }
}


function mapStateToProps(state) {
    return {
        InititatePasswordResetReducer : state.onboardingReducers.InititatePasswordResetReducer
    };
}

export default connect(mapStateToProps)(ForgotPassword);