import * as React from 'react';

import { connect } from 'react-redux';
import {Fragment} from "react";



import {history} from '../../../../_helpers/history'
import { Helmet } from 'react-helmet';
import Button from 'react-bootstrap/Button'

import { Formik } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import  InAppContainer from '../../../../shared/templates/inapp-container'
import  DownloadApp from '../../../../shared/elements/downloadapp-box'

import { numberWithCommas,
    allowNumbersOnly} from '../../../../shared/utils';
import "../styles.scss"; 
class ConfirmCardRequest extends React.Component{
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
                            <h3>Delivery address confirmation</h3>
                        </div>
                        
                        <div className="dashboard-section">
                            <Formik
                                initialValues={{

                                }}

                                // validationSchema={loginValidationSchema}
                                onSubmit={(values, { resetForm }) => {

                                    let payload = {

                                    }
                                    history.push("/app/cards/success");
                                    
                                    // return;
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
                                                
                                                <div className="panel-helptext mt-20 centered m-auto">
                                                    Hi Seyi
                                                </div>
                                                <div className="panel-helptext mt-20 centered m-auto pt-20">
                                                    Your debit card will be delivered to the address below: 
                                                </div>
                                                <div className="panel-helptext mt-20 centered m-auto pt-20">
                                                    2, Foreshore Avenue,
                                                    Oriental Hotel Complex,
                                                    Victoria Island,
                                                    Lagos
                                                    Nigeria
                                                </div>
                                                <div className="panel-helptext mt-20 centered m-auto pt-20">
                                                    Please confirm or go back to edit
                                                </div>
                                                <div className="form-wrap w-70 mt-40 m-auto pt-20">
                                                   

                                                    <Form.Group className="poppedinput">
                                                        <Form.Label className="block-level">Enter Security PIN</Form.Label>
                                                        <Form.Control type="password"
                                                            name="amountToSend"
                                                            onChange={handleChange}
                                                            value={allowNumbersOnly(values.txtPin,4)}
                                                            className={errors.txtPin && touched.txtPin ? "is-invalid" : null}
                                                            required />
                                                            
                                                        {errors.txtPin && touched.txtPin ? (
                                                            <span className="invalid-feedback">{errors.txtPin}</span>
                                                        ) : null}

                                                    </Form.Group>
                                                </div>
                                            </div>

                                            <div className="app-panel inpage">
                                                <div className="footer-with-cta toleft m-0 ">
                                                    <Button variant="secondary"
                                                        type="button"
                                                        // disabled={CreateAccountStep1Request.is_request_processing}
                                                        className="ml-0 onboarding-btn light"
                                                        onClick={()=>history.push("/app/cards/request-card")}
                                                    > Back
                                                     {/* {CreateAccountStep1Request.is_request_processing?'Please wait...' :'Continue'} */}
                                                    </Button>
                                                    <Button variant="secondary"
                                                        type="submit"
                                                        // disabled={CreateAccountStep1Request.is_request_processing}
                                                        className=" onboarding-btn"
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
                <Helmet>
                    <title>9PSB - Card request | confirm</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Card request</h3>
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

export default connect(mapStateToProps)(ConfirmCardRequest);