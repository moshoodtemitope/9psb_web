import * as React from 'react';

import { connect } from 'react-redux';
import {Fragment} from "react";

import { Helmet } from 'react-helmet';
import {history} from '../../../_helpers/history'

import  InAppContainer from '../../../shared/templates/inapp-container'
import  DownloadApp from '../../../shared/elements/downloadapp-box'
import RightCaret from '../../../assets/images/right-caret.svg';
import Search from '../../../assets/images/search.svg';
import PageLoader from '../../../shared/elements/pageloader'
import ErrorMessage from '../../../shared/elements/errormessage'
import { paymentActions } from '../../../redux/actions/payments/payments';
import { paymentsConstants } from '../../../redux/actiontypes/payments/payments.constants';
import "./styles.scss"; 
class PayBills extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            user:"",
        }
            
    }

    componentDidMount(){
        this.getAllCategories();
    }


    getAllCategories = () => {
        const { dispatch } = this.props;
        dispatch(paymentActions.makeCustomerPaymentForBill("CLEAR"));
        dispatch(paymentActions.GetBillsCategories());
    }

    renderCategories = ()=>{
        let GetBillsCategoriesRequest = this.props.GetBillsCategoriesReducer,
            allCategories = GetBillsCategoriesRequest.request_data.response,
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
                                    allCategories.map((eachCat, index) => {
                                        return(
                                            <div key={index} className="blocked-bar-link" onClick={() => history.push(`/app/paybills/choose-biller/${eachCat.categoryId}`)}>
                                                <div>
                                                    <div className="main-text">{eachCat.categoryName}</div>
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
            </div>
        )
    }

    renderPageContent = ()=>{
        let GetBillsCategoriesRequest = this.props.GetBillsCategoriesReducer;
        return (
            <div className="each-section mt-80 res-mt-45">
                <div className="twosided nomargin">
                    <div>
                        <div className="page-section-mainheading app-panel">
                            <div className="border-lines"><span></span><span></span><span></span></div>
                            <h3>Wide range of utility payments</h3>
                        </div>

                        {GetBillsCategoriesRequest.request_status === paymentsConstants.GET_BILLS_CATEGORIES_SUCCESS &&
                            this.renderCategories()
                        }
                        {GetBillsCategoriesRequest.request_status !== paymentsConstants.GET_BILLS_CATEGORIES_SUCCESS && 
                            <div className="dashboard-section">
                                <div className="app-panel inpage">
                                    {this.renderPreload()}
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
        let GetBillsCategoriesRequest = this.props.GetBillsCategoriesReducer;
        

        if (GetBillsCategoriesRequest.request_status === paymentsConstants.GET_BILLS_CATEGORIES_PENDING) {
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
    };
}

export default connect(mapStateToProps)(PayBills);