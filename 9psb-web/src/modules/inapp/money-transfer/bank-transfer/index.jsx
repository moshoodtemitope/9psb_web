import * as React from 'react';
import { Link, NavLink} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';

import { Helmet } from 'react-helmet';
import {history} from '../../../../_helpers/history'

import  InAppContainer from '../../../../shared/templates/inapp-container'
import  DownloadApp from '../../../../shared/elements/downloadapp-box'
import  PageLoader from '../../../../shared/elements/pageloader'
import  ErrorMessage from '../../../../shared/elements/errormessage'
import RightCaret from '../../../../assets/images/right-caret.svg';
import NoBeneficiary from '../../../../assets/images/no-bene.svg';
import Search from '../../../../assets/images/search.svg';
import {paymentActions} from '../../../../redux/actions/payments/payments';
import {paymentsConstants} from '../../../../redux/actiontypes/payments/payments.constants';
import { numberWithCommas, getBankNameWithCode} from '../../../../shared/utils';
import "../styles.scss"; 
class BankTransfer extends React.Component{
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
        this.clearRecords();
        this.getBeneficiariesAndBanks();
    }

    clearRecords = ()=>{
        const {dispatch} = this.props;
        dispatch(paymentActions.TranferToPhoneStep1("CLEAR"));
        dispatch(paymentActions.TranferToPhoneNumber("CLEAR"));
        dispatch(paymentActions.confirmBeneficiary("CLEAR"));
       
    }

    getBeneficiariesAndBanks = ()=>{
        const {dispatch} = this.props;
        let GetTransferBeneficiariesRequest = this.props.GetTransferBeneficiariesReducer,
            GetBanksRequest = this.props.GetBanksReducer;
        // if(GetTransferBeneficiariesRequest.request_status !==paymentsConstants.GET_TRANSFER_BENEFICIARIES_SUCCESS){
            dispatch(paymentActions.GetTransferBeneficiaries());
        // }

        if(GetBanksRequest.request_status !==paymentsConstants.GET_BANKS_SUCCESS){
            dispatch(paymentActions.GetBanks());
        }
    }


    
    

    searchBeneficiaries = (searchText)=>{
        let allBeneficiaries = document.querySelectorAll('.blocked-bar-link');
        let searchTerm = searchText.target.value.trim();
        allBeneficiaries.forEach(eachBeneficiary=>{
            
            if(eachBeneficiary.querySelector('.main-text') &&  eachBeneficiary.querySelector('.sub-text')){
                if(eachBeneficiary.querySelector('.main-text').textContent.toLowerCase().indexOf(searchTerm.toLowerCase())>-1 
                    || eachBeneficiary.querySelector('.sub-text').textContent.toLowerCase().indexOf(searchTerm.toLowerCase())>-1){
                        if(eachBeneficiary.classList.contains("hide")){
                            eachBeneficiary.classList.remove("hide");
                        }
                }else{
                    eachBeneficiary.classList.add("hide");
                }
            }
        })
    }

    proceedWithBeneficiary = (BeneficiaryData, source)=>{
        const {dispatch} = this.props;
        
        this.setState({BeneficiaryData})
        dispatch(paymentActions.confirmBeneficiary(BeneficiaryData, source));
        // history.push("/app/transfer/to-bank/sendTobeneficiary")
    }   

    renderBeneficiaries = ()=>{
        let GetTransferBeneficiariesRequest = this.props.GetTransferBeneficiariesReducer,
            GetBanksRequest = this.props.GetBanksReducer,
            confirmBeneficiaryRequest = this.props.confirmBeneficiaryReducer,
            allBanks        = GetBanksRequest.request_data.response;

        let {BeneficiaryData}= this.state;
        if(GetTransferBeneficiariesRequest.request_status ===paymentsConstants.GET_TRANSFER_BENEFICIARIES_SUCCESS){
            
            let allBeneficiaries = GetTransferBeneficiariesRequest.request_data.response;
            return (
                <div>
                    {allBeneficiaries.length >=1 &&
                        <div className="blocked-list">
                            <h3>Saved Beneficiaries</h3>
                            <div className="inputsearch">
                                <input type="text" name="" onChange={this.searchBeneficiaries} className="searchable w-100" placeholder="Search for beneficiaries" id="" />
                                <img src={Search} alt="" />
                            </div>
                            {confirmBeneficiaryRequest.request_status ===paymentsConstants.CONFIRM_ACCOUNT_FAILURE && 
                                <div className="">
                                    <ErrorMessage errorMessage={confirmBeneficiaryRequest.request_data.error} canRetry={false} retryFunc={()=>this.proceedWithBeneficiary(BeneficiaryData, "saved")} />
                                </div>
                                
                            }

                            {
                                allBeneficiaries.map((eachBeneficiary, index)=>{
                                    return(
                                        <div key={index} 
                                            className="blocked-bar-link" onClick={() => {
                                                if(confirmBeneficiaryRequest.is_request_processing!==true){
                                                    this.proceedWithBeneficiary(eachBeneficiary, "saved")}
                                                }
                                            }
                                            >
                                            <div>
                                                
                                                <div className="main-text">{
                                                    `${(eachBeneficiary.displayName!==null &&  eachBeneficiary.displayName!==undefined &&  eachBeneficiary.displayName!=="")
                                                        ? `${eachBeneficiary.displayName}`: `${eachBeneficiary.accountName}`
                                                    }`
                                                }</div>
                                                <div className="sub-text">{getBankNameWithCode(eachBeneficiary.bankCode, allBanks)} - {eachBeneficiary.accountNumber}</div>
                                            </div>
                                            <img src={RightCaret} alt="" />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    }
                    {allBeneficiaries.length ===0 && 
                        <div className="no-data-fetched">
                            <img src={NoBeneficiary} alt=""/>
                            <h3>No saved beneficiary</h3>
                        </div>
                    }
                </div>
            )
        }
        if(GetTransferBeneficiariesRequest.request_status ===paymentsConstants.GET_TRANSFER_BENEFICIARIES_PENDING){
            return(
                <div>
                    <PageLoader/>
                    {/* <div>Loading beneficiaries...</div> */}
                </div>
                
            )
        }

        if(GetTransferBeneficiariesRequest.request_status ===paymentsConstants.GET_TRANSFER_BENEFICIARIES_FAILURE){
            return(
                <ErrorMessage errorMessage={GetTransferBeneficiariesRequest.request_data.error} canRetry={true} retryFunc={()=>this.getBeneficiariesAndBanks()} />
            )
        }

        
       
    }

    renderPageWrap = () =>{
        let GetBanksRequest = this.props.GetBanksReducer;
        
        return(
            <div className="each-section mt-80 res-mt-45">
                <div className="twosided nomargin">
                    <div>
                        <div className="page-section-mainheading app-panel">
                            <div className="border-lines"><span></span><span></span><span></span></div>
                            <h3>Select a transfer option</h3>
                        </div>
                        
                        <div className="dashboard-section">
                            

                            {GetBanksRequest.request_status ===paymentsConstants.GET_BANKS_PENDING &&
                                <div className="app-panel inpage">
                                     <PageLoader/>
                                </div>
                            }

                            {GetBanksRequest.request_status ===paymentsConstants.GET_BANKS_FAILURE &&
                                
                                     <ErrorMessage errorMessage={GetBanksRequest.request_data.error} canRetry={true} retryFunc={()=>this.getBeneficiariesAndBanks()} />
                                
                            }

                            {GetBanksRequest.request_status ===paymentsConstants.GET_BANKS_SUCCESS &&
                                <div className="app-panel inpage">
                                    <div className="action-options">
                                        <NavLink exact to="/app/transfer" className="each-option">
                                            To Phone number
                                        </NavLink>
                                        <NavLink exact to="/app/transfer/to-bank" className="each-option">
                                            To bank account
                                        </NavLink>
                                    </div>
                                    <div className="panel-helptext mt-20  m-auto">
                                    Transfer to other banks using NUBAN
                                    </div>
                                    <div className="w-80 m-100 m-auto pt-20">
                                        <div className="blocked-bar-link" onClick={()=>history.push("/app/transfer/to-bank/provide-details")}>
                                            <span>New Beneficiary</span>
                                            <img src={RightCaret} alt=""/>
                                        </div>
                                        {this.renderBeneficiaries()}
                                    </div>
                                </div>
                            }
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
                    <title>9PSB - Transfer to bank account</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Transfer to bank account</h3>
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
        GetTransferBeneficiariesReducer : state.paymentsReducers.GetTransferBeneficiariesReducer,
        GetBanksReducer : state.paymentsReducers.GetBanksReducer,
        confirmBeneficiaryReducer : state.paymentsReducers.confirmBeneficiaryReducer,
    };
}

export default connect(mapStateToProps)(BankTransfer);