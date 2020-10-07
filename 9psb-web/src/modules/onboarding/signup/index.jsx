import * as React from 'react';
import { Link} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";

import { Formik } from 'formik';
import * as Yup from 'yup';
import { Helmet } from 'react-helmet';
import Form from 'react-bootstrap/Form';
import {history} from '../../../_helpers/history'
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button'
import  OnboardingContainer from '../../../shared/templates/onboarding-container'
import SignupImg from '../../../assets/images/signup1.svg';

import {onboardingActions} from '../../../redux/actions/onboarding/onboarding';
import {onboardingConstants} from '../../../redux/actiontypes/onboarding/onboarding.constants';
import { allowNumbersOnly } from "../../../shared/utils";

import "./signup.scss"; 
class AppSignup extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            user:""
        }
   
    
    }

    componentDidMount(){
       this.clearRecords();
    }

    validatePhoneNum = async(payload) =>{
        const {dispatch} = this.props;

        await dispatch(onboardingActions.CheckIfCustomerExists(payload));
    }

    clearRecords = ()=>{
        const {dispatch} = this.props;
        dispatch(onboardingActions.CheckIfCustomerExists("CLEAR"));
        dispatch(onboardingActions.initStore());
        dispatch(onboardingActions.Login("CLEAR"));
    }
    checkIfNumExists = (payload)=>{
        this.validatePhoneNum(payload)
    }



    renderSignUpStep1 = ()=>{
        let CheckIfCustomerExistsRequest = this.props.CheckIfCustomerExistsReducer;
        const {user} = this.state;
        let loginValidationSchema = Yup.object().shape({
            phoneNumber: Yup.string()
                .required('Required')
                .min(10, 'Enter a valid phone number')
                .max(11, 'Enter a valid phone number')
          });
          
        return(
            <div className="onboardingcontent-wrap">
                <div className="eachsection imgsection">
                    <img src={SignupImg} alt=""/>
                </div>
                <div className="eachsection">
                    <div className="onboarding-info">
                        <div className="cardpanel">
                            <div className="card-heading mb-10">Sign Up</div>
                            <div className="card-text">
                                Provide your phone number to get started
                            </div>
                            
                            <Formik
                                initialValues={{
                                    phoneNumber: ' ',
                                }}

                                validationSchema={loginValidationSchema}
                                onSubmit={(values, { resetForm }) => {

                                    let payload = values.phoneNumber.trim();
                                    
                                    this.checkIfNumExists(payload)
                                    
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
                                                <Form.Control type="text"
                                                    name="phoneNumber"
                                                    onChange={handleChange}
                                                    autoComplete="new-off"
                                                    // placeholder="+234 "
                                                    onFocus={(event)=>{ if(event.target.autocomplete) event.target.autocomplete = "whatever";}}
                                                    value={allowNumbersOnly(values.phoneNumber, 11)}
                                                    className={errors.phoneNumber && touched.phoneNumber ? "is-invalid" : null}
                                                    required />
                                                {errors.phoneNumber && touched.phoneNumber ? (
                                                    <span className="invalid-feedback">{errors.phoneNumber}</span>
                                                ) : null}

                                            </Form.Group>


                                            <div className="footer-with-cta centered ">
                                                <Button variant="secondary"
                                                    type="submit"
                                                    disabled={CheckIfCustomerExistsRequest.is_request_processing}
                                                    className="ml-0 onboarding-btn"
                                                > {CheckIfCustomerExistsRequest.is_request_processing ? 'Checking...' : 'Continue'}
                                                </Button>

                                            </div>

                                            {CheckIfCustomerExistsRequest.request_status === onboardingConstants.CHECK_EXISTING_USER_FAILURE &&
                                                <Alert variant="danger mt-20">
                                                    {CheckIfCustomerExistsRequest.request_data.error !== undefined ? CheckIfCustomerExistsRequest.request_data.error : "An error occured please try again"}

                                                </Alert>
                                            }

                                        </Form>
                                    )}
                            </Formik>
                        </div>
                        <div className="signup-info">
                           Alrready have an account? <Link to='/'>Sign In</Link> 
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
                    <title>9PSB - Create account</title>
                </Helmet>
                <OnboardingContainer>
                <div className="onboarding-page">
                   {this.renderSignUpStep1()}
                </div>
                </OnboardingContainer>
            </Fragment>
        );
    }
}


function mapStateToProps(state) {
    return {
        CheckIfCustomerExistsReducer : state.onboardingReducers.CheckIfCustomerExistsReducer
    };
}

export default connect(mapStateToProps)(AppSignup);