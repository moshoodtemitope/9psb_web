import * as React from 'react';
import { Link, NavLink} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";




import {history} from '../../../../_helpers/history'
import { Helmet } from 'react-helmet';
import  InAppContainer from '../../../../shared/templates/inapp-container'
import  DownloadApp from '../../../../shared/elements/downloadapp-box'
import PageLoader from '../../../../shared/elements/pageloader'
import ErrorMessage from '../../../../shared/elements/errormessage'
import RightCaret from '../../../../assets/images/right-caret.svg';
import DeleteIcon from '../../../../assets/images/delete.svg';
import Search from '../../../../assets/images/search.svg';
import NoBeneficiary from '../../../../assets/images/no-bene.svg';
import { paymentActions } from '../../../../redux/actions/payments/payments';
import { paymentsConstants } from '../../../../redux/actiontypes/payments/payments.constants';
import { numberWithCommas, getNetworkProviderWithCode, getDataPlanNameCode } from '../../../../shared/utils';
import "../styles.scss"; 
class ChooseDataTopUpOption extends React.Component{
    constructor(props) {
        super(props);
        
        this.state={
            user:"",
            showDelete: false,
            
        }

    }

    componentDidMount() {
        this.clearRecords();
        this.getBeneficiaries();
        this.getDataPlans();

    }

    clearRecords = () => {
        const { dispatch } = this.props;
        dispatch(paymentActions.saveDataTopUpRecipientData("CLEAR"));


    }

    getBeneficiaries = () => {
        const { dispatch } = this.props;
        dispatch(paymentActions.GetDataTopUpBeneficiaries());
    }

    getDataPlans = () => {
        const { dispatch } = this.props;
        dispatch(paymentActions.GetDataTopUpPlans());
        // this.fetchAllDataPlans().then(()=>{
        //     let getDataPlans = this.props.GetDataTopUpPlansReducer;
            

        //         if((Object.keys(getDataPlans).length >= 1 
        //             && getDataPlans.request_status === paymentsConstants.FETCH_DATATOPUP_PLANS_SUCCESS)){
        //                 this.setState({dataPlansInfo: getDataPlans.request_data.response})
        //         }
        // })
    }

    fetchAllDataPlans = async () =>{
        const { dispatch } = this.props;
        await dispatch(paymentActions.GetDataTopUpPlans());
    }

    proceedWithBeneficiary = (BeneficiaryData) => {
        const { dispatch } = this.props;

        dispatch(paymentActions.saveDataTopUpRecipientData(BeneficiaryData, "landing", "others"))
    }

    deleteBeneficiary = (BeneficiaryData) => {
        const { dispatch } = this.props;

        dispatch(paymentActions.DeleteDataTopUpBeneficiary(BeneficiaryData))
    }

    handleCloseDelete = () => {
        this.setState({ showDelete: false })
        const { dispatch } = this.props;

        dispatch(paymentActions.DeleteDataTopUpBeneficiary("CLEAR"))
    };

    handleShowDelete = (selectedBeneficiaryToDeleteId, selectedBeneficiaryToDeleteLabel) => this.setState({ showDelete: true, selectedBeneficiaryToDeleteId, selectedBeneficiaryToDeleteLabel });
    

    searchBeneficiaries = (searchText)=>{
        let allBeneficiaries = document.querySelectorAll('.wrap-block-item');
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

    renderBeneficiaries = () => {
        let GetDataTopUpBeneficiariesRequest = this.props.GetDataTopUpBeneficiariesReducer;

        let { existingCustomerInfo } = this.state;

        let getDataPlans = this.props.GetDataTopUpPlansReducer;
            // dataPlansInfo: 
            //     ? getDataPlans.request_data.response : '',

           
            let dataPlansInfo = getDataPlans.request_data.response;
                // if((Object.keys(getDataPlans).length >= 1 
                //     && getDataPlans.request_status === paymentsConstants.FETCH_DATATOPUP_PLANS_SUCCESS)){
                //         this.setState({dataPlansInfo: getDataPlans.request_data.response})
                // }

        let providersList = [
            { label: "Airtel", value: 1 },
            { label: "9Mobile", value: 2 },
            { label: "Globacom", value: 3 },
            { label: "Mtn", value: 4 }];
        
        if (GetDataTopUpBeneficiariesRequest.request_status === paymentsConstants.FETCH_DATATOPUP_BENEFICIARIES_PENDING) {
            return (
                <div>
                    <PageLoader />
                </div>

            )
        }

        if (GetDataTopUpBeneficiariesRequest.request_status === paymentsConstants.FETCH_DATATOPUP_BENEFICIARIES_FAILURE) {
            return (
                <ErrorMessage errorMessage={GetDataTopUpBeneficiariesRequest.request_data.error} canRetry={true} retryFunc={() => this.getBeneficiaries()} />
            )
        }

        if (GetDataTopUpBeneficiariesRequest.request_status === paymentsConstants.FETCH_DATATOPUP_BENEFICIARIES_SUCCESS) {

            let allBeneficiaries = GetDataTopUpBeneficiariesRequest.request_data.response;
            return (
                <div>
                    {allBeneficiaries.length >=1 &&
                        <div className="blocked-list">
                            <h3>Saved Beneficiaries</h3>
                            <div className="inputsearch">
                                <input type="text" name="" onChange={this.searchBeneficiaries} className="searchable w-100" placeholder="Search for beneficiaries" id="" />
                                <img src={Search} alt="" />
                            </div>

                            {
                                allBeneficiaries.map((eachBeneficiary, index) => {
                                    return (
                                        <div key={index} className="wrap-block-item">
                                            <div key={index}
                                                className="blocked-bar-link"
                                                onClick={() => {
                                                    this.proceedWithBeneficiary(eachBeneficiary)
                                                    }
                                                }
                                            >
                                                <div>

                                                    <div className="main-text">{
                                                        `${(eachBeneficiary.displayName !== null && eachBeneficiary.displayName !== undefined && eachBeneficiary.displayName !== "")
                                                            ? `${eachBeneficiary.displayName}` : ''
                                                        }`
                                                    }</div>
                                                    <div className="sub-text">{eachBeneficiary.mobileNumber} - {getNetworkProviderWithCode(eachBeneficiary.network, providersList)}</div>
                                                    <div className="sub-text">{getDataPlanNameCode(eachBeneficiary.lastAmount, eachBeneficiary.network, dataPlansInfo)}</div>
                                                </div>
                                                <img src={RightCaret} alt="" />
                                            </div>
                                            <div className="delete-icon" onClick={() => this.handleShowDelete(index, eachBeneficiary.displayName)}>
                                                <img src={DeleteIcon} alt="" />
                                            </div>
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



    }

    renderPageWrap = () =>{
        let { showDelete } = this.state;
        let GetDataTopUpPlansRequest = this.props.GetDataTopUpPlansReducer;

        
            return(
                <div className="each-section mt-80 res-mt-45">
                    {showDelete && this.renderDeleteBeneficiary()}
                    <div className="twosided nomargin">
                        <div>
                            <div className="page-section-mainheading app-panel">
                                <div className="border-lines"><span></span><span></span><span></span></div>
                                <h3>Data top up for any network</h3>
                            </div>
                            <div className="dashboard-section">

                                <div className="app-panel inpage">

                                    <div className="action-options">
                                        <NavLink exact to="/app/buy-data" className="each-option">
                                            Yourself
                                        </NavLink>
                                        <NavLink exact to="/app/buy-data/others/choose" className="each-option">
                                            Others
                                        </NavLink>
                                    </div>
                                    <div className="panel-helptext mt-20 centered  m-auto m-100">
                                        Buy data for any other person
                                    </div>
                                    

                                    {(GetDataTopUpPlansRequest.request_status === paymentsConstants.FETCH_DATATOPUP_PLANS_PENDING) &&
                                            
                                        <div>
                                            <PageLoader />
                                        </div>

                                            
                                    }

                                    {(GetDataTopUpPlansRequest.request_status === paymentsConstants.FETCH_DATATOPUP_PLANS_FAILURE) &&
                                        
                                        <ErrorMessage errorMessage={GetDataTopUpPlansRequest.request_data.error} canRetry={true} retryFunc={() => this.getDataPlans()} />
                                        
                                    }

                                    {(GetDataTopUpPlansRequest.request_status === paymentsConstants.FETCH_DATATOPUP_PLANS_SUCCESS) &&
                                        <div className="w-80 m-100 m-auto pt-20">
                                            <div className="blocked-bar-link" onClick={() => {
                                                const { dispatch } = this.props;

                                                dispatch(paymentActions.saveDataTopUpRecipientData("CLEAR"));

                                                history.push("/app/buy-data/others")
                                            }}>
                                                <span>Provide details</span>
                                                <img src={RightCaret} alt="" />
                                            </div>
                                            {this.renderBeneficiaries()}
                                        </div>
                                    }
                                </div>

                                

                            </div>
                            
                            <div className="dashboard-section">
                                
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
                    <title>9PSB - Data Top-up for others</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Data Top Up</h3>
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
        GetDataTopUpPlansReducer: state.paymentsReducers.GetDataTopUpPlansReducer,
        GetDataTopUpBeneficiariesReducer: state.paymentsReducers.GetDataTopUpBeneficiariesReducer,
        DeleteDataTopUpBeneficiaryReducer: state.paymentsReducers.DeleteDataTopUpBeneficiaryReducer,
    };
}

export default connect(mapStateToProps)(ChooseDataTopUpOption);