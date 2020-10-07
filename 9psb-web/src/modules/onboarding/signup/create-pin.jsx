import * as React from 'react';
import { Link} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";

import { Formik } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import {history} from '../../../_helpers/history'
import Button from 'react-bootstrap/Button'
import  OnboardingContainer from '../../../shared/templates/onboarding-container'
import PinImg from '../../../assets/images/lock.svg';
import Select from 'react-select';
import { Helmet } from 'react-helmet';
import {getDateFromISO, allowNumbersOnly } from "../../../shared/utils";
import {encryptAnItem} from '../../../shared/shared-utils/index';
import Alert from 'react-bootstrap/Alert';
import {onboardingActions} from '../../../redux/actions/onboarding/onboarding';
import {onboardingConstants} from '../../../redux/actiontypes/onboarding/onboarding.constants';

import "./signup.scss"; 
class SignUpCreatePin extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            psbuser:JSON.parse(localStorage.getItem('psb-auth')),
        }
   
    
    }

    componentDidMount(){
        this.clearRecords();
       this.bounceBackToStep()
    }
    bounceBackToStep = ()=>{
        let {psbuser} = this.state;

        
        if(!psbuser){
            history.push("/")
        }else{
            this.getSecurityQuestions();
        }
    }

    clearRecords = ()=>{
        const {dispatch} = this.props;
        dispatch(onboardingActions.CreateTransactionPin("CLEAR"));
    }

    getSecurityQuestions = () =>{
        const {dispatch} = this.props;

         dispatch(onboardingActions.GetSecurityQuestions());
    }

    createTxtnPin = async(payload) =>{
        const {dispatch} = this.props;

        await dispatch(onboardingActions.CreateTransactionPin(payload));
    }

    renderCreatePinForm = ()=>{
        let getSecurityQuestionsRequest = this.props.GetSecurityQuestionsReducer;
        let createTransactionPinRequest = this.props.CreateTransactionPinReducer;


        let allQuestions=[],
            questionsList= getSecurityQuestionsRequest.request_data.response;

            questionsList.map((eachQuestion, id)=>{
                allQuestions.push({label: eachQuestion.question, value:eachQuestion.code});
            })

            
        
        let loginValidationSchema = Yup.object().shape({
            securityQuestion: Yup.string()
                .required('Required'),
            securityanswer: Yup.string()
                .required('Required'),
            txtPin: Yup.string()
                .length(4, '4 Digits required')
                .required('Required'),
            confirmPin: Yup.string()
                .length(4, '4 Digits required')
                .required('Required')
                .oneOf([Yup.ref('txtPin'), null], 'Pins must match'),
          });

          return(
              <div>
                  <div className="card-text">First, Set a Security Question</div>
                  <Formik
                      initialValues={{
                          securityQuestion: '',
                          securityanswer: '',
                          txtPin: '',
                          confirmPin: '',
                      }}

                      validationSchema={loginValidationSchema}
                      onSubmit={(values, { resetForm }) => {

                          let payload = {
                            pin: encryptAnItem(values.txtPin),
                            securityQuestionModel: {
                              code: values.securityQuestion,
                              answer: values.securityanswer
                            }
                          }

                          
                          this.createTxtnPin(payload)
                        //   history.push("/app/create-pin-success");

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



                                  <Form.Group className="onboardinginput withselect">
                                      <Form.Label className="block-level">Security question</Form.Label>
                                      <Select
                                          options={allQuestions}
                                          onChange={(selected) => setFieldValue('securityQuestion', selected.value)}
                                          onBlur={() => setFieldTouched('securityQuestion', true)}
                                          className={errors.securityQuestion && touched.securityQuestion ? "is-invalid" : null}
                                          name="securityQuestion"
                                      />
                                      {errors.securityQuestion && touched.securityQuestion ? (
                                          <span className="invalid-feedback">{errors.securityQuestion}</span>
                                      ) : null}
                                  </Form.Group>

                                  <Form.Group className="inputfield">
                                      <Form.Control type="password"
                                          name="securityanswer"
                                          onChange={handleChange}
                                          placeholder="Answer"
                                          value={values.securityanswer}
                                          className={errors.securityanswer && touched.securityanswer ? "is-invalid" : null}
                                          required />
                                      {errors.securityanswer && touched.securityanswer ? (
                                          <span className="invalid-feedback">{errors.securityanswer}</span>
                                      ) : null}

                                  </Form.Group>

                                  <div className="bvn-info">
                                      Now, Set your 9PSB transaction PIN
                                            </div>

                                  <Form.Group className="inputfield onboardinginput">
                                      <Form.Control
                                          type="password"
                                          name="txtPin"
                                          onChange={handleChange}
                                          placeholder="Enter your 4-digit PIN"
                                          maxLength="4"
                                          value={allowNumbersOnly(values.txtPin, 4)}
                                          className={errors.txtPin && touched.txtPin ? "is-invalid" : null}
                                          required />
                                      {errors.txtPin && touched.txtPin ? (
                                          <span className="invalid-feedback">{errors.txtPin}</span>
                                      ) : null}

                                  </Form.Group>

                                  <Form.Group className="onboardinginput">
                                    <Form.Label className="block-level">Confirm 4 Digit Pin</Form.Label>
                                      <Form.Control type="password"
                                          name="confirmPin"
                                          placeholder=""
                                          maxLength="4"
                                          onChange={handleChange}
                                          value={allowNumbersOnly(values.confirmPin, 4)}
                                          className={errors.confirmPin && touched.confirmPin ? "is-invalid" : null}
                                          required />

                                      {errors.confirmPin && touched.confirmPin ? (
                                          <span className="invalid-feedback">{errors.confirmPin}</span>
                                      ) : null}

                                  </Form.Group>




                                  <div className="footer-with-cta centered ">
                                      <Button variant="secondary"
                                          type="submit"
                                          disabled={createTransactionPinRequest.is_request_processing}
                                          className="ml-0 onboarding-btn"
                                      > {createTransactionPinRequest.is_request_processing?'Please wait...' :'Continue'}
                                                </Button>

                                  </div>

                                    {createTransactionPinRequest.request_status === onboardingConstants.CREATE_PIN_FAILURE &&
                                        <Alert variant="danger">
                                            {createTransactionPinRequest.request_data.error !== undefined ? createTransactionPinRequest.request_data.error : "An error occured please try again"}
                                        </Alert>
                                    }

                              </Form>
                          )}
                  </Formik>
              </div>
          )
    }

    renderCreatePin=()=>{
        // let adminGetCustomerTypesRequest = this.props.adminGetCustomerTypes;
        const {user} = this.state;
        
        let getSecurityQuestionsRequest = this.props.GetSecurityQuestionsReducer;

        
          
        return(
            <div className="onboardingcontent-wrap">
                <div className="eachsection imgsection full-length pt-100">
                    <img src={PinImg} alt=""/>
                </div>
                <div className="eachsection full-length pb-30">
                    <div className="onboarding-info">
                        <div className="cardpanel">
                            <div className="card-heading mb-10">Set your transaction PIN</div>
                            
                            {getSecurityQuestionsRequest.request_status === onboardingConstants.GET_SECURITY_QUESTIONS_PENDING &&
                                <div className="loading-content">
                                    <div className="loading-text">Please wait...</div>
                                </div>
                            }
                            {getSecurityQuestionsRequest.request_status === onboardingConstants.GET_SECURITY_QUESTIONS_SUCCESS &&
                                this.renderCreatePinForm()
                            }
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
                    <title>9PSB - Create account | Pin</title>
                </Helmet>
                <OnboardingContainer>
                <div className="onboarding-page">
                   {this.renderCreatePin()}
                </div>
                </OnboardingContainer>
            </Fragment>
        );
    }
}


function mapStateToProps(state) {
    return {
        GetSecurityQuestionsReducer : state.onboardingReducers.GetSecurityQuestionsReducer,
        CreateTransactionPinReducer : state.onboardingReducers.CreateTransactionPinReducer
    };
}

export default connect(mapStateToProps)(SignUpCreatePin);