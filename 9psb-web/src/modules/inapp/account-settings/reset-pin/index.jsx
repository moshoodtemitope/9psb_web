import * as React from 'react';

import { connect } from 'react-redux';
import {Fragment} from "react";

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import {history} from '../../../../_helpers/history'
import Alert from 'react-bootstrap/Alert';

import Button from 'react-bootstrap/Button'
import { Helmet } from 'react-helmet';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import  InAppContainer from '../../../../shared/templates/inapp-container'
import  DownloadApp from '../../../../shared/elements/downloadapp-box'
import LeftCaret from '../../../../assets/images/left-caret.svg';
import  ErrorMessage from '../../../../shared/elements/errormessage'
import PageLoader from '../../../../shared/elements/pageloader'

import {encryptAnItem} from '../../../../shared/shared-utils/index';


import {onboardingConstants} from '../../../../redux/actiontypes/onboarding/onboarding.constants'
import {onboardingActions} from '../../../../redux/actions/onboarding/onboarding';
import "../styles.scss"; 
class InitateResetTxtPin extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            user:"",
            
        }
   
      
    }

    componentDidMount(){
        this.clearRecords();
        this.getSecurityQuestions();
    }

    clearRecords = ()=>{
        const {dispatch} = this.props;
        dispatch(onboardingActions.InitiatePinReset("CLEAR"));
        dispatch(onboardingActions.GetSecurityQuestions("CLEAR"));
    }

    getSecurityQuestions = () =>{
        const {dispatch} = this.props;

         dispatch(onboardingActions.GetSecurityQuestions(null, "profile"));
    }


    submitSecurityQuestion = (payload)=>{
        const {dispatch} = this.props;
        dispatch(onboardingActions.InitiatePinReset(payload));
    }
   
    


    renderPageWrap = () =>{
        let {payload}= this.state;
       
        let validationChangeSchema = Yup.object().shape({
                answer: Yup.string()
                    .required('Required'),
        });   

        let initiatePinResetRequest = this.props.InitiatePinResetReducer;
        let getSecurityQuestionsRequest = this.props.GetSecurityQuestionsReducer;
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
                                <h3>Reset your PIN</h3>
                            </div>
                        </div>
                        
                        <div className="dashboard-section">
                            <Formik
                                initialValues={{
                                    answer:"",
                                }}

                                validationSchema={validationChangeSchema}
                                onSubmit={(values, { resetForm }) => {

                                    let payload = {
                                        answer: values.answer,
                                      }
                                   
                                      this.setState({payload});

                                      this.submitSecurityQuestion(payload);

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
                                                
                                                {getSecurityQuestionsRequest.request_status === onboardingConstants.GET_SECURITY_QUESTIONS_PENDING &&
                                                    <PageLoader/>
                                                }

                                                {getSecurityQuestionsRequest.request_status ===onboardingConstants.GET_SECURITY_QUESTIONS_FAILURE && 
                                                    <div className="all-transactions app-panel">
                                                        <ErrorMessage errorMessage={getSecurityQuestionsRequest.request_data.error} canRetry={true} retryFunc={()=>this.getSecurityQuestions()} />
                                                    </div>
                                                }

                                                {getSecurityQuestionsRequest.request_status === onboardingConstants.GET_SECURITY_QUESTIONS_SUCCESS &&
                                                    <div className="form-wrap w-70 mt-40 m-auto pt-20 m-100">
                                                        
                                                            
                                                        <div className="card-text">
                                                            Answer a security question to continue
                                                        </div>
                                                        <Form.Group className="">
                                                            <Form.Label className="block-level bold-label">{getSecurityQuestionsRequest.request_data.response.message}</Form.Label>
                                                            <Form.Control type="password"
                                                                name="answer"
                                                                onChange={(e)=> setFieldValue('answer', e.target.value)}
                                                                
                                                                value={values.answer}
                                                                className={errors.answer && touched.answer ? "is-invalid" : null}
                                                                required />
                                                            {errors.answer && touched.answer ? (
                                                                <span className="invalid-feedback">{errors.answer}</span>
                                                            ) : null}

                                                        </Form.Group>
                                                        
                                                    </div>
                                                }
                                            </div>
                                            {initiatePinResetRequest.request_status ===onboardingConstants.INITIATE_PIN_RESET_FAILURE && 
                                                
                                                    <ErrorMessage errorMessage={initiatePinResetRequest.request_data.error} 
                                                            // canRetry={initiatePinResetRequest.request_data.error!=="Security Answer is Wrong!! please try again"?true:false} 
                                                            retryFunc={()=>this.submitSecurityQuestion(payload)} />
                                                
                                            }
                                            

                                            {getSecurityQuestionsRequest.request_status === onboardingConstants.GET_SECURITY_QUESTIONS_SUCCESS &&
                                                <div className="app-panel inpage">
                                                    <div className="footer-with-cta toleft m-0 ">
                                                        <Button variant="secondary"
                                                            type="button"
                                                            disabled={initiatePinResetRequest.is_request_processing}
                                                            className="ml-0 onboarding-btn light"
                                                            onClick={()=>history.goBack()}
                                                        > Back
                                                        {/* {CreateAccountStep1Request.is_request_processing?'Please wait...' :'Continue'} */}
                                                        </Button>
                                                        <Button variant="secondary"
                                                            type="submit"
                                                            disabled={initiatePinResetRequest.is_request_processing}
                                                            className="ml-10 onboarding-btn"
                                                        > 
                                                        {initiatePinResetRequest.is_request_processing?'Please wait...' :'Continue'}
                                                        </Button>

                                                    </div>
                                                </div>
                                            }

                                            
                                            
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
                    <title>9PSB - Reset PIN</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Reset PIN</h3>
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
        GetSecurityQuestionsReducer : state.onboardingReducers.GetSecurityQuestionsReducer,
        InitiatePinResetReducer : state.onboardingReducers.InitiatePinResetReducer,
    };
}

export default connect(mapStateToProps)(InitateResetTxtPin);