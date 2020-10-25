import * as React from 'react';
import { Link, NavLink} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';

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

import { numberWithCommas} from '../../../../shared/utils';
import {encryptAnItem} from '../../../../shared/shared-utils/index';


import {onboardingConstants} from '../../../../redux/actiontypes/onboarding/onboarding.constants'
import {onboardingActions} from '../../../../redux/actions/onboarding/onboarding';
import "../styles.scss"; 
class ChangePin extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            user:"",
            
        }
   
      
    }

    componentDidMount(){
        this.clearRecords()
    }

    clearRecords = ()=>{
        const {dispatch} = this.props;
        dispatch(onboardingActions.ChangePin("CLEAR"));
    }


    changeTxtPin = (payload)=>{
        const {dispatch} = this.props;
        dispatch(onboardingActions.ChangePin(payload));
    }
   
    


    renderPageWrap = () =>{
        let {payload}= this.state;
       
        let validationChangeSchema = Yup.object().shape({
                oldPin: Yup.string()
                    .length(4, '4 Digits PIN')
                    .required('Required'),
                newPin: Yup.string()
                    .length(4, '4 Digits PIN')
                    .required('Required'),
                conmfirmNewPin: Yup.string()
                    .length(4, '4 digits PIN')
                    .required('Required')
                    .oneOf([Yup.ref('newPin'), null], 'new PIN must match'),
        });   

        let changeTransactionPinRequest = this.props.ChangeTransactionPinReducer;
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
                                <h3>Change PIN</h3>
                            </div>
                        </div>
                        
                        <div className="dashboard-section">
                            <Formik
                                initialValues={{
                                    oldPin:"",
                                    newPin:"",
                                    conmfirmNewPin:""
                                }}

                                validationSchema={validationChangeSchema}
                                onSubmit={(values, { resetForm }) => {

                                    let payload = {
                                        oldPin: values.oldPin!==""? encryptAnItem(values.oldPin): null,
                                        newPin: encryptAnItem(values.newPin)
                                      }
                                   
                                      this.setState({payload});

                                      this.changeTxtPin(payload);

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
                                                        <Form.Label className="block-level">Old PIN</Form.Label>
                                                        <Form.Control type="password"
                                                            name="oldPin"
                                                            onChange={(e)=> setFieldValue('oldPin', e.target.value)}
                                                            maxLength="4"
                                                            value={values.oldPin}
                                                            className={errors.oldPin && touched.oldPin ? "is-invalid" : null}
                                                            required />
                                                        {errors.oldPin && touched.oldPin ? (
                                                            <span className="invalid-feedback">{errors.oldPin}</span>
                                                        ) : null}

                                                    </Form.Group>
                                                    <Form.Group className="poppedinput">
                                                        <Form.Label className="block-level">New PIN</Form.Label>
                                                        <Form.Control type="password"
                                                            name="newPin"
                                                            onChange={(e)=> setFieldValue('newPin', e.target.value)}
                                                            value={values.newPin}
                                                            maxLength="4"
                                                            className={errors.newPin && touched.newPin ? "is-invalid" : null}
                                                            required />
                                                        {errors.newPin && touched.newPin ? (
                                                            <span className="invalid-feedback">{errors.newPin}</span>
                                                        ) : null}

                                                    </Form.Group>
                                                    <Form.Group className="poppedinput">
                                                        <Form.Label className="block-level">Retype New PIN</Form.Label>
                                                        <Form.Control type="password"
                                                            name="conmfirmNewPin"
                                                            onChange={(e)=> setFieldValue('conmfirmNewPin', e.target.value)}
                                                            maxLength="4"
                                                            value={values.conmfirmNewPin}
                                                            className={errors.conmfirmNewPin && touched.conmfirmNewPin ? "is-invalid" : null}
                                                            required />
                                                        {errors.conmfirmNewPin && touched.conmfirmNewPin ? (
                                                            <span className="invalid-feedback">{errors.conmfirmNewPin}</span>
                                                        ) : null}

                                                    </Form.Group>
                                                    
                                                 
                                                </div>
                                            </div>
                                            {changeTransactionPinRequest.request_status ===onboardingConstants.CHANGE_PIN_FAILURE && 
                                                
                                                <ErrorMessage errorMessage={changeTransactionPinRequest.request_data.error} canRetry={false} retryFunc={()=>this.changePin(payload)} />
                                            
                                            }

                                            <div className="app-panel inpage">
                                                <div className="footer-with-cta toleft m-0 ">
                                                    <Button variant="secondary"
                                                        type="button"
                                                        disabled={changeTransactionPinRequest.is_request_processing}
                                                        className="ml-0 onboarding-btn light"
                                                        onClick={()=>history.goBack()}
                                                    > Back
                                                     {/* {CreateAccountStep1Request.is_request_processing?'Please wait...' :'Continue'} */}
                                                    </Button>
                                                    <Button variant="secondary"
                                                        type="submit"
                                                        disabled={changeTransactionPinRequest.is_request_processing}
                                                        className="ml-10 onboarding-btn"
                                                    > 
                                                     {changeTransactionPinRequest.is_request_processing?'Please wait...' :'Update'}
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
                <title>9PSB - Change PIN</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Change PIN</h3>
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
    };
}

export default connect(mapStateToProps)(ChangePin);