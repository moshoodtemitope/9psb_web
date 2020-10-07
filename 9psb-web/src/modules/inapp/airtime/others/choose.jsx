import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { Fragment } from "react";




import { history } from '../../../../_helpers/history'

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { Helmet } from 'react-helmet';
import Form from 'react-bootstrap/Form';
import InAppContainer from '../../../../shared/templates/inapp-container'
import DownloadApp from '../../../../shared/elements/downloadapp-box'
import PageLoader from '../../../../shared/elements/pageloader'
import ErrorMessage from '../../../../shared/elements/errormessage'
import RightCaret from '../../../../assets/images/right-caret.svg';
import DeleteIcon from '../../../../assets/images/delete.svg';
import Search from '../../../../assets/images/search.svg';
import NoBeneficiary from '../../../../assets/images/no-bene.svg';
import { paymentActions } from '../../../../redux/actions/payments/payments';
import { paymentsConstants } from '../../../../redux/actiontypes/payments/payments.constants';
import { numberWithCommas, getNetworkProviderWithCode } from '../../../../shared/utils';
import "../styles.scss";
class ChooseTopUpOption extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: "",
            showDelete: false
        }

        
    }

    componentDidMount() {
        this.clearRecords();
        this.getBeneficiaries();

    }

    clearRecords = () => {
        const { dispatch } = this.props;
        dispatch(paymentActions.saveAirtimeRecipientData("CLEAR"));


    }

    getBeneficiaries = () => {
        const { dispatch } = this.props;
        dispatch(paymentActions.GetAirtimeBeneficiaries());
    }



    proceedWithBeneficiary = (BeneficiaryData) => {
        const { dispatch } = this.props;

        dispatch(paymentActions.saveAirtimeRecipientData(BeneficiaryData, "landing", "others"))
    }

    deleteBeneficiary = (BeneficiaryData) => {
        const { dispatch } = this.props;

        dispatch(paymentActions.DeleteAirtimeBeneficiary(BeneficiaryData))
    }

    handleCloseDelete = () => {
        this.setState({ showDelete: false })
        const { dispatch } = this.props;

        dispatch(paymentActions.DeleteAirtimeBeneficiary("CLEAR"))
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

    renderDeleteBeneficiary = () => {
        const { showDelete,
            selectedBeneficiaryToDeleteLabel,
            selectedBeneficiaryToDeleteId } = this.state;

        let DeleteAirtimeBeneficiaryRequest = this.props.DeleteAirtimeBeneficiaryReducer;
        return (
            <Modal show={showDelete} onHide={this.handleCloseDelete} size="lg" centered="true" dialogClassName="modal-40w withcentered-heading" animation={false}>
                <Modal.Header>
                    <Modal.Title>Delete airtime beneficiary</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {(DeleteAirtimeBeneficiaryRequest.request_status !== paymentsConstants.DELETE_AIRTIME_BENEFICIARY_SUCCESS) && 
                        <div className="centered">Would you like to delete <span className="bolden">{selectedBeneficiaryToDeleteLabel}</span></div>
                    }
                    {(DeleteAirtimeBeneficiaryRequest.request_status === paymentsConstants.DELETE_AIRTIME_BENEFICIARY_SUCCESS) && 
                        <div className="centered">You have deleted <span className="bolden">{selectedBeneficiaryToDeleteLabel}</span></div>
                    }
                    {(DeleteAirtimeBeneficiaryRequest.request_status === paymentsConstants.DELETE_AIRTIME_BENEFICIARY_FAILURE) &&

                        <ErrorMessage errorMessage={DeleteAirtimeBeneficiaryRequest.request_data.error} canRetry={false} retryFunc={() => this.deleteBeneficiary({ beneficiaryId: selectedBeneficiaryToDeleteId })} />

                    }
                </Modal.Body>
                <Modal.Footer>

                    <Button
                        disabled={DeleteAirtimeBeneficiaryRequest.is_request_processing}
                        className="grayed-out" onClick={this.handleCloseDelete}>
                            {DeleteAirtimeBeneficiaryRequest.completed === true ? "Done" : "Cancel"}
                    </Button>
                    {(DeleteAirtimeBeneficiaryRequest.completed === undefined) &&
                        <Button
                            type="submit"
                            disabled={DeleteAirtimeBeneficiaryRequest.is_request_processing}
                            onClick={() => this.deleteBeneficiary({ beneficiaryId: selectedBeneficiaryToDeleteId })}
                        >
                            {DeleteAirtimeBeneficiaryRequest.is_request_processing ? "Deleting..." : "Confirm"}
                        </Button>
                    }

                </Modal.Footer>
            </Modal>
        )
    }

    renderBeneficiaries = () => {
        let GetAirtimeBeneficiariesRequest = this.props.GetAirtimeBeneficiariesReducer;

        let { BeneficiaryData } = this.state;

        let providersList = [
            { label: "Airtel", value: 1 },
            { label: "9Mobile", value: 2 },
            { label: "Globacom", value: 3 },
            { label: "Mtn", value: 4 }];
        
        if (GetAirtimeBeneficiariesRequest.request_status === paymentsConstants.FETCH_AIRTIME_BENEFICIARIES_PENDING) {
            return (
                <div>
                    <PageLoader />
                </div>

            )
        }

        if (GetAirtimeBeneficiariesRequest.request_status === paymentsConstants.FETCH_AIRTIME_BENEFICIARIES_FAILURE) {
            return (
                <ErrorMessage errorMessage={GetAirtimeBeneficiariesRequest.request_data.error} canRetry={true} retryFunc={() => this.getBeneficiaries()} />
            )
        }

        if (GetAirtimeBeneficiariesRequest.request_status === paymentsConstants.FETCH_AIRTIME_BENEFICIARIES_SUCCESS) {

            let allBeneficiaries = GetAirtimeBeneficiariesRequest.request_data.response;
            return (
                <div>
                    {allBeneficiaries.length >=1 &&
                        <div className="blocked-list">
                            <h3>Saved Beneficiaries</h3>
                            <div className="inputsearch">
                                <input type="text" onChange={this.searchBeneficiaries} name="" className="searchable w-100" placeholder="Search for beneficiaries" id="" />
                                <img src={Search} alt="" />
                            </div>

                            {
                                allBeneficiaries.map((eachBeneficiary, index) => {
                                    return (
                                        <div key={index} className="wrap-block-item">
                                            <div 
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

    renderPageWrap = () => {
        // let GetBanksRequest = this.props.GetBanksReducer;
        let { showDelete } = this.state;
        return (
            <div className="each-section mt-80 res-mt-45">
                {showDelete && this.renderDeleteBeneficiary()}
                <div className="twosided nomargin">
                    <div>
                        <div className="page-section-mainheading app-panel">
                            <div className="border-lines"><span></span><span></span><span></span></div>
                            <h3>Airtime top up for any network</h3>
                        </div>

                        <div className="dashboard-section">
                            {/* {GetBanksRequest.request_status ===paymentsConstants.GET_BANKS_SUCCESS && */}
                            <div className="app-panel inpage">
                                <div className="action-options">
                                    <NavLink exact to="/app/buy-airtime" className="each-option">
                                        Yourself
                                        </NavLink>
                                    <NavLink exact to="/app/buy-airtime/others/choose" className="each-option">
                                        Others
                                        </NavLink>
                                </div>
                                <div className="panel-helptext mt-20  m-auto">
                                    Buy airtime for others on your account
                                    </div>
                                <div className="w-80 m-100 m-auto pt-20">
                                    <div className="blocked-bar-link" onClick={() => {
                                        const { dispatch } = this.props;

                                        dispatch(paymentActions.saveAirtimeRecipientData("CLEAR"));

                                        history.push("/app/buy-airtime/others")
                                    }}>
                                        <span>New Beneficiary</span>
                                        <img src={RightCaret} alt="" />
                                    </div>
                                    {this.renderBeneficiaries()}
                                </div>
                            </div>
                            {/* } */}

                            
                        </div>
                    </div>
                    <DownloadApp />

                </div>
            </div>
        )
    }












    render() {


        return (
            <Fragment>
                <Helmet>
                <title>9PSB - Airtime for others </title>
                </Helmet>
                <InAppContainer>
                    <div className="inapp-page">
                        <div className="page-heading">
                            <h3>Airtime Top Up</h3>
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
        GetAirtimeBeneficiariesReducer: state.paymentsReducers.GetAirtimeBeneficiariesReducer,
        DeleteAirtimeBeneficiaryReducer: state.paymentsReducers.DeleteAirtimeBeneficiaryReducer,
    };
}

export default connect(mapStateToProps)(ChooseTopUpOption);