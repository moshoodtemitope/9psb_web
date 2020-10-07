import * as React from 'react';
import { Link, NavLink} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';

// import { Formik } from 'formik';
// import * as Yup from 'yup';
// import Form from 'react-bootstrap/Form';
import {history} from '../../../../_helpers/history'
import { Helmet } from 'react-helmet';
import Alert from 'react-bootstrap/Alert';
import Select from 'react-select';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Formik } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import LeftCaret from '../../../../assets/images/left-caret.svg';
import  InAppContainer from '../../../../shared/templates/inapp-container'
import  DownloadApp from '../../../../shared/elements/downloadapp-box'
import  SelectAnAccount from '../../../../shared/elements/select-account'
import  ErrorMessage from '../../../../shared/elements/errormessage'

import { numberWithCommas} from '../../../../shared/utils';
import {encryptAnItem} from '../../../../shared/shared-utils/index';


import {onboardingConstants} from '../../../../redux/actiontypes/onboarding/onboarding.constants'
import {onboardingActions} from '../../../../redux/actions/onboarding/onboarding';
import "../styles.scss"; 
class ChangePassword extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            user:"",
            password:"",
            
        }
   
      
    }

    componentDidMount(){
        this.clearRecords()
    }

    clearRecords = ()=>{
        const {dispatch} = this.props;
        dispatch(onboardingActions.ChangePassword("CLEAR"));
    }


    changePassword = (payload)=>{
        const {dispatch} = this.props;
        dispatch(onboardingActions.ChangePassword(payload));
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
   
    


    renderPageWrap = () =>{
        let {payload,
            passwordValid,
            password,
            passwordInvalidMessage}= this.state;
       
        let validationChangeSchema = Yup.object().shape({
                oldPassword: Yup.string()
                    .min(6, 'Minimum of 6 characters')
                    .required('Required'),
                newPassword: Yup.string()
                    .min(6, 'Minimum of 6 characters')
                    .required('Required'),
                conmfirmNewPassword: Yup.string()
                    .min(6, 'Minimum of 6 characters')
                    .required('Required')
                    .oneOf([Yup.ref('newPassword'), null], 'new password must match'),
        });   

        let changePasswordRequest = this.props.ChangePasswordReducer;
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
                                <h3>Change Password</h3>
                            </div>
                        </div>
                        
                        <div className="dashboard-section">
                            <Formik
                                initialValues={{
                                    oldPassword:"",
                                    newPassword:"",
                                    conmfirmNewPassword:""
                                }}

                                validationSchema={validationChangeSchema}
                                onSubmit={(values, { resetForm }) => {
                                    if(this.checkPwd()){
                                        let payload = {
                                            oldPassword: values.oldPassword!==""? encryptAnItem(values.oldPassword): null,
                                            newPassword: encryptAnItem(values.newPassword)
                                        }
                                    
                                        this.setState({payload});

                                        this.changePassword(payload);
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
                                                <div className="form-wrap w-70 mt-40 m-auto pt-20 m-100">
                                                    
                                                        
                                                 
                                                    <Form.Group className="poppedinput">
                                                        <Form.Label className="block-level">Old Password</Form.Label>
                                                        <Form.Control type="password"
                                                            name="oldPassword"
                                                            onChange={(e)=> setFieldValue('oldPassword', e.target.value)}
                                                            
                                                            value={values.oldPassword}
                                                            className={errors.oldPassword && touched.oldPassword ? "is-invalid" : null}
                                                            required />
                                                        {errors.oldPassword && touched.oldPassword ? (
                                                            <span className="invalid-feedback">{errors.oldPassword}</span>
                                                        ) : null}

                                                    </Form.Group>
                                                    <Form.Group className="poppedinput">
                                                        <Form.Label className="block-level">New Password</Form.Label>
                                                        <Form.Control type="password"
                                                            name="newPassword"
                                                            onChange={(e)=> {
                                                                // this.setState({password:e.target.value})
                                                                this.setState({password:e.target.value}, ()=>this.checkPwd())
                                                                // this.checkPwd()
                                                                setFieldValue('newPassword', e.target.value)
                                                            }}
                                                            value={values.newPassword}
                                                            
                                                            className={errors.newPassword && touched.newPassword ? "is-invalid" : null}
                                                            required />
                                                        {errors.newPassword && touched.newPassword ? (
                                                            <span className="invalid-feedback">{errors.newPassword}</span>
                                                        ) : null}

                                                        {(passwordValid || password==="") && <div className="pw-hint">Your password must contain an <b>upper-case letter</b>, a <b>number</b> and a <b>special character</b> and must be between 8 to 16 characters.</div>}
                                                        {(!passwordValid && password!=="") &&
                                                            <div className="text-danger error-txt">{passwordInvalidMessage}</div>
                                                        }

                                                    </Form.Group>
                                                    <Form.Group className="poppedinput">
                                                        <Form.Label className="block-level">Retype New Password</Form.Label>
                                                        <Form.Control type="password"
                                                            name="conmfirmNewPassword"
                                                            onChange={(e)=> setFieldValue('conmfirmNewPassword', e.target.value)}
                                                            
                                                            value={values.conmfirmNewPassword}
                                                            className={errors.conmfirmNewPassword && touched.conmfirmNewPassword ? "is-invalid" : null}
                                                            required />
                                                        {errors.conmfirmNewPassword && touched.conmfirmNewPassword ? (
                                                            <span className="invalid-feedback">{errors.conmfirmNewPassword}</span>
                                                        ) : null}

                                                    </Form.Group>
                                                    
                                                 
                                                </div>
                                            </div>
                                            

                                            <div className="app-panel inpage">
                                                <div className="footer-with-cta toleft m-0 ">
                                                    <Button variant="secondary"
                                                        type="button"
                                                        disabled={changePasswordRequest.is_request_processing}
                                                        className="ml-0 onboarding-btn light"
                                                        onClick={()=>history.goBack()}
                                                    > Back
                                                     {/* {CreateAccountStep1Request.is_request_processing?'Please wait...' :'Continue'} */}
                                                    </Button>
                                                    <Button variant="secondary"
                                                        type="submit"
                                                        disabled={changePasswordRequest.is_request_processing}
                                                        className="ml-10 onboarding-btn"
                                                    > 
                                                     {changePasswordRequest.is_request_processing?'Please wait...' :'Update'}
                                                    </Button>

                                                </div>
                                            </div>
                                            {changePasswordRequest.request_status ===onboardingConstants.CHANGE_PASSWORD_FAILURE && 
                                                
                                                <ErrorMessage errorMessage={changePasswordRequest.request_data.error} canRetry={false} retryFunc={()=>this.changePassword(payload)} />
                                            
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
                <title>9PSB - Change Password</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Change your password</h3>
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
        ChangePasswordReducer : state.onboardingReducers.ChangePasswordReducer,
    };
}

export default connect(mapStateToProps)(ChangePassword);