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
import Alert from 'react-bootstrap/Alert';
import Select from 'react-select';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Formik } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import  InAppContainer from '../../../../shared/templates/inapp-container'
import  DownloadApp from '../../../../shared/elements/downloadapp-box'

import { numberWithCommas} from '../../../../shared/utils';
import "../styles.scss"; 
class ActivateCard extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            user:"",
            screenWidthSize: window.innerWidth,
            showSiderBar: window.innerWidth>=1024?true:false,
            
        }
   
        window.addEventListener("resize", ()=>
                this.setState({screenWidthSize: window.innerWidth,
                                showSiderBar: window.innerWidth>=1024?true:false
                }));
    }

    componentDidMount(){

    }


    setAccountChosen = (selected)=>{
        
    }
    

    renderDeposit = ()=>{

        return(
            <div className="form-wrap">

            </div>
        )
    }

    renderPageWrap = () =>{
        let IdOptions =[
        ];
        const selectionRange = {
            // startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
          },
          {isRangePickerVisible} = this.state;
        return(
            <div className="each-section mt-80 res-mt-45">
                <div className="twosided nomargin">
                    <div>
                        <div className="page-section-mainheading app-panel">
                            <div className="border-lines"><span></span><span></span><span></span></div>
                            <h3>Request debit card</h3>
                        </div>
                        
                        <div className="dashboard-section">
                            <Formik
                                initialValues={{

                                }}

                                // validationSchema={loginValidationSchema}
                                onSubmit={(values, { resetForm }) => {

                                    let payload = {

                                    }
                                    history.push("/app/cards/confirm");
                                    
                                    this.registerStep2(payload)
                                        .then(() => {

                                        })


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
                                                
                                                <div className="form-wrap w-70 mt-40 m-auto  m-100">
                                                    <div className="panel-helptext mt-20   m-100">
                                                        Select debit card type
                                                    </div>
                                                    <Form.Group className="poppedinput withselect">
                                                        <Form.Label className="block-level">Card Type</Form.Label>
                                                        <Select
                                                            options={IdOptions}
                                                            onChange={this.setAccountChosen}
                                                            
                                                            name="accountChosen"
                                                        />
                                                        {errors.accountChosen && touched.accountChosen ? (
                                                            <span className="invalid-feedback">{errors.accountChosen}</span>
                                                        ) : null}

                                                    </Form.Group>
                                                    <div className="panel-helptext mt-20   m-100">
                                                        Enter delivery address
                                                    </div>
                                                 
                                                    <Form.Group className="">
                                                        <Form.Control type="text"
                                                            name="houseNo"
                                                            placeholder="House or Office number"
                                                            onChange={handleChange}
                                                            value={values.houseNo}
                                                            className={errors.houseNo && touched.houseNo ? "is-invalid" : null}
                                                            required />
                                                        {errors.houseNo && touched.houseNo ? (
                                                            <span className="invalid-feedback">{errors.houseNo}</span>
                                                        ) : null}

                                                    </Form.Group>

                                                    <Form.Row>
                                                        <Col md={6} sm={6} xs={12}  className="m-100">
                                                            <Form.Group className="">
                                                                <Form.Control type="text"
                                                                    name="streetName"
                                                                    placeholder="Street"
                                                                    onChange={handleChange}
                                                                    value={values.streetName}
                                                                    className={errors.streetName && touched.streetName ? "is-invalid" : null}
                                                                    required />
                                                                {errors.streetName && touched.streetName ? (
                                                                    <span className="invalid-feedback">{errors.streetName}</span>
                                                                ) : null}

                                                            </Form.Group>
                                                        </Col>
                                                        <Col md={6} sm={6} xs={12} className="m-100">
                                                            <Form.Group className="">
                                                                <Form.Control type="text"
                                                                    name="landmark"
                                                                    placeholder="Landmark (optional)"
                                                                    onChange={handleChange}
                                                                    value={values.landmark}
                                                                    className={errors.landmark && touched.landmark ? "is-invalid" : null}
                                                                    required />
                                                                {errors.landmark && touched.landmark ? (
                                                                    <span className="invalid-feedback">{errors.landmark}</span>
                                                                ) : null}

                                                            </Form.Group>
                                                        </Col>
                                                    </Form.Row>
                                                    <Form.Group className="poppedinput withselect">
                                                        <Form.Label className="block-level">Select City</Form.Label>
                                                        <Select
                                                            options={IdOptions}
                                                            onChange={this.setAccountChosen}
                                                            
                                                            name="cityChosen"
                                                        />
                                                        {errors.cityChosen && touched.cityChosen ? (
                                                            <span className="invalid-feedback">{errors.cityChosen}</span>
                                                        ) : null}

                                                    </Form.Group>
                                                    <Form.Group className="poppedinput withselect">
                                                        <Form.Label className="block-level">Select State</Form.Label>
                                                        <Select
                                                            options={IdOptions}
                                                            onChange={this.setAccountChosen}
                                                            
                                                            name="stateChosen"
                                                        />
                                                        {errors.stateChosen && touched.stateChosen ? (
                                                            <span className="invalid-feedback">{errors.stateChosen}</span>
                                                        ) : null}

                                                    </Form.Group>

                                                    {/* <Form.Group className="poppedinput">
                                                        <Form.Label className="block-level">Set 6-digit Withdrawal PIN</Form.Label>
                                                        <Form.Control type="text"
                                                            name="amountToSend"
                                                            onChange={handleChange}
                                                            value={values.amountToSend}
                                                            className={errors.amountToSend && touched.amountToSend ? "is-invalid" : null}
                                                            required />
                                                            <div className="forminput-helptext">This Pin will be required at the ATM</div>
                                                        {errors.amountToSend && touched.amountToSend ? (
                                                            <span className="invalid-feedback">{errors.amountToSend}</span>
                                                        ) : null}

                                                    </Form.Group> */}
                                                </div>
                                            </div>

                                            <div className="app-panel inpage">
                                                <div className="footer-with-cta toleft m-0 ">
                                                    <Button variant="secondary"
                                                        type="button"
                                                        // disabled={CreateAccountStep1Request.is_request_processing}
                                                        className="ml-0 onboarding-btn light"
                                                        onClick={()=>history.push("/app/cards")}
                                                    > Back
                                                     {/* {CreateAccountStep1Request.is_request_processing?'Please wait...' :'Continue'} */}
                                                    </Button>
                                                    <Button variant="secondary"
                                                        type="submit"
                                                        // disabled={CreateAccountStep1Request.is_request_processing}
                                                        className="ml-20 onboarding-btn"
                                                    > Continue
                                                     {/* {CreateAccountStep1Request.is_request_processing?'Please wait...' :'Continue'} */}
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
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Request Card</h3>
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
        
    };
}

export default connect(mapStateToProps)(ActivateCard);