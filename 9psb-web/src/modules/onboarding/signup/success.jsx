import * as React from 'react';
import { Link} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";


import { Helmet } from 'react-helmet';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import {history} from '../../../_helpers/history'
import Button from 'react-bootstrap/Button'
import  OnboardingContainer from '../../../shared/templates/onboarding-container'
import SignupImg from '../../../assets/images/signup2.svg';
import SuccessImg from '../../../assets/images/done.svg';
import Select from 'react-select';

import "./signup.scss"; 
class SuccessReg extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            user:""
        }
   
    
    }

    componentDidMount(){
       
    }



    renderSignUpStep2 = ()=>{
        // let adminGetCustomerTypesRequest = this.props.adminGetCustomerTypes;
        const {user} = this.state;
        let loginValidationSchema = Yup.object().shape({
            phoneNumber: Yup.string()
                .required('Required'),
                password:  Yup.string()
                .required('Required'),
          });

        let IdOptions =[
            {value: 1, label: 'Bvn Number'},
            {value: 2, label: 'Drivers Licence'},
            {value: 3, label: 'International Passport'},
            {value: 4, label: 'Permanent Voters Card'},
            {value: 0, label: 'None'},
        ];

        
          
        return(
            <div className="onboardingcontent-wrap">
                <div className="eachsection imgsection">
                    <img src={SignupImg} alt=""/>
                </div>
                <div className="eachsection ">
                    <div className="onboarding-info">
                        <div className="cardpanel">
                            <div className="card-heading mb-10 text-center">Registeration Completed</div>
                            <div className="success-icon">
                                <img src={SuccessImg} alt=""/>
                            </div>
                            <div className="card-text success-txt">
                                Thank you Seyi. Welcome to 9 Payment Service Bank.
                            </div>
                            <div className="card-text success-txt">
                            *Please create your transaction PIN to secure your transactions.
                            </div>
                            <div className="footer-with-cta centered blocked-style mt-60">
                                                
                                <Button variant="secondary"
                                    type="submit"
                                    // disabled={loginRequest.is_request_processing}
                                    className="ml-0 onboarding-btn"
                                    onClick={()=>{
                                        history.push("/app/create-pin");
                                    }}
                                > Create Pin
                                </Button>

                            </div>
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
                    <title>9PSB - Create account success</title>
                </Helmet>
                <OnboardingContainer>
                <div className="onboarding-page">
                   {this.renderSignUpStep2()}
                </div>
                </OnboardingContainer>
            </Fragment>
        );
    }
}


function mapStateToProps(state) {
    return {
        
    };
}

export default connect(mapStateToProps)(SuccessReg);