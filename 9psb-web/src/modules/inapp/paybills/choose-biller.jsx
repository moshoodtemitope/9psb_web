import * as React from 'react';

import { connect } from 'react-redux';
import {Fragment} from "react";


import {history} from '../../../_helpers/history'
import { Helmet } from 'react-helmet';
import Select from 'react-select';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Formik } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import LeftCaret from '../../../assets/images/left-caret.svg';
import  InAppContainer from '../../../shared/templates/inapp-container'
import  DownloadApp from '../../../shared/elements/downloadapp-box'
import RightCaret from '../../../assets/images/right-caret.svg';
import Search from '../../../assets/images/search.svg';
import PageLoader from '../../../shared/elements/pageloader'
import ErrorMessage from '../../../shared/elements/errormessage'
import { paymentActions } from '../../../redux/actions/payments/payments';
import { paymentsConstants } from '../../../redux/actiontypes/payments/payments.constants';
import "./styles.scss"; 
class chooseBiller extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            user:"",
        }
        this.billsCat = this.props.match.params.billCategory;
            if(this.billsCat===undefined ||this.billsCat===null){
                history.push("app/pay-bills");
            }
    }

    componentDidMount(){
        this.getAllCategories();
        this.getAllBillersInACat();
    }


    getAllCategories = () => {
        const { dispatch } = this.props;
        dispatch(paymentActions.makeCustomerPaymentForBill("CLEAR"));
        dispatch(paymentActions.GetBillsCategories());
    }

    getAllBillersInACat = () => {
        const { dispatch } = this.props;
        dispatch(paymentActions.GetBillersByCategory(this.billsCat));
    }

    renderAllBillers = ()=>{
        let GetBillsCategoriesRequest = this.props.GetBillsCategoriesReducer,
            GetBillersByCategoryRequest = this.props.GetBillersByCategoryReducer,
            allBillers = GetBillersByCategoryRequest.request_data.response,
            categoriesList = [];

            
        
        return (
            <div className="dashboard-section">
                <div className="app-panel inpage">
                    <div className="w-80 m-100 m-auto ">
                        <div className="blocked-list">
                            <div className="inputsearch">
                                <input type="text" name="" className="searchable w-100" placeholder="Search for Providers" id="" />
                                <img src={Search} alt="" />
                            </div>
                            <div className="twos-blocked-list">
                                {
                                    allBillers.map((eachBiller, index) => {
                                        return(
                                            <div key={index} className="blocked-bar-link" onClick={() => history.push(`/app/pay-bills/${eachBiller.categoryId}/provide-details`, {billId:eachBiller.billerId})}>
                                                <div>
                                                    <div className="main-text">{eachBiller.billerName}</div>
                                                </div>
                                                <img src={RightCaret} alt="" />
                                            </div>
                                        )
                                    })
                                }
                                
                            </div>

                        </div>
                    </div>
                </div>
                <div className="app-panel inpage">
                    <div className="footer-with-cta toleft m-0 ">
                        <Button variant="secondary"
                            type="button"
                            className="ml-0 onboarding-btn light"
                            onClick={() => history.goBack()}
                        > Back
                                        
                        </Button>
                        

                    </div>
                </div>
            </div>
        )
    }

    renderPageContent = ()=>{
        let GetBillsCategoriesRequest = this.props.GetBillsCategoriesReducer,
            GetBillersByCategoryRequest = this.props.GetBillersByCategoryReducer;
        return (
            <div className="each-section mt-80 res-mt-45">
                <div className="twosided nomargin">
                    <div>
                        
                            {GetBillsCategoriesRequest.request_status === paymentsConstants.GET_BILLS_CATEGORIES_SUCCESS &&
                                <div className="page-section-mainheading app-panel">
                                    <div className="border-lines"><span></span><span></span><span></span></div>
                                    <div className="subheading-title">
                                        <div className="backnav" onClick={()=>{
                                            history.goBack()
                                        }}>
                                            <img src={LeftCaret} alt=""/>
                                            <span>Back</span>
                                        </div>
                                        <h3>{GetBillsCategoriesRequest.request_data.response.filter(eachCat => eachCat.categoryId === this.billsCat)[0].categoryName}</h3>
                                    </div>
                                    
                                </div>
                            }
                        

                        {(GetBillsCategoriesRequest.request_status === paymentsConstants.GET_BILLS_CATEGORIES_SUCCESS
                            && GetBillersByCategoryRequest.request_status === paymentsConstants.GET_BILLERS_BY_CATEGORY_SUCCESS ) &&
                            this.renderAllBillers()
                        }
                        {(GetBillsCategoriesRequest.request_status !== paymentsConstants.GET_BILLS_CATEGORIES_SUCCESS &&
                            GetBillersByCategoryRequest.request_status !== paymentsConstants.GET_BILLERS_BY_CATEGORY_SUCCESS 
                            )&&
                            <div className="dashboard-section">
                                <div className="app-panel inpage">
                                    {this.renderPreload()}
                                </div>
                                <div className="app-panel inpage">
                                    <div className="footer-with-cta toleft m-0 ">
                                        <Button variant="secondary"
                                            type="button"
                                            className="ml-0 onboarding-btn light"
                                            onClick={() => history.goBack()}
                                        > Back
                                                     
                                        </Button>
                                        

                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                    <DownloadApp />

                </div>
            </div>
        )
    }

    renderPreload = () =>{
        let GetBillsCategoriesRequest = this.props.GetBillsCategoriesReducer,
            GetBillersByCategoryRequest = this.props.GetBillersByCategoryReducer;

        if (GetBillsCategoriesRequest.request_status === paymentsConstants.GET_BILLS_CATEGORIES_PENDING ||
            GetBillersByCategoryRequest.request_status !== paymentsConstants.GET_BILLERS_BY_CATEGORY_PENDING) {
            return (
                <div>
                    <PageLoader />
                </div>

            )
        }

        if (GetBillsCategoriesRequest.request_status === paymentsConstants.GET_BILLS_CATEGORIES_FAILURE) {
            return (
                <ErrorMessage errorMessage={GetBillsCategoriesRequest.request_data.error} canRetry={true} retryFunc={() => this.getAllCategories()} />
            )
        }

        if (GetBillersByCategoryRequest.request_status !== paymentsConstants.GET_BILLERS_BY_CATEGORY_FAILURE) {
            return (
                <ErrorMessage errorMessage={GetBillersByCategoryRequest.request_data.error} canRetry={true} retryFunc={() => this.getAllBillersInACat()} />
            )
        }
    }

    
    



    

  
    


    render() {
        
        
        return (
            <Fragment>
                <Helmet>
                    <title>9PSB - Pay bills</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Pay bills</h3>
                    </div>
                   {this.renderPageContent()}
                </div>
                </InAppContainer>
            </Fragment>
        );
    }
}



function mapStateToProps(state) {
    return {
        GetBillsCategoriesReducer: state.paymentsReducers.GetBillsCategoriesReducer,
        GetBillersByCategoryReducer: state.paymentsReducers.GetBillersByCategoryReducer,
    };
}

export default connect(mapStateToProps)(chooseBiller);