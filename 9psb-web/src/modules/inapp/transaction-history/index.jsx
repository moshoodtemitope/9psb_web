import * as React from 'react';

import { connect } from 'react-redux';
import {Fragment} from "react";


import {history} from '../../../_helpers/history'
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
// import DatePicker from '../../../_helpers/datepickerfield'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Helmet } from 'react-helmet';
import  InAppContainer from '../../../shared/templates/inapp-container'
import  DownloadApp from '../../../shared/elements/downloadapp-box'
import DebitIcon from '../../../assets/images/debit-txt.svg';
import CreditIcon from '../../../assets/images/credit-txt.svg';
import { numberWithCommas, getDateFromISO} from '../../../shared/utils';
import  ErrorMessage from '../../../shared/elements/errormessage'
import  PageLoader from '../../../shared/elements/pageloader'
import  SelectAnAccount from '../../../shared/elements/select-account'
import "./styles.scss"; 
import EmptyIcon from '../../../assets/images/empty.svg';
import {accountActions} from '../../../redux/actions/dashboard/dashboard';
import {dashboardConstants} from '../../../redux/actiontypes/dashboard/dashboard.constants';
class TransactionHistory extends React.Component{
    constructor(props) {
        super(props);
        
        this.state={
            user:"",
            screenWidthSize: window.innerWidth,
            showSiderBar: window.innerWidth>=1024?true:false,
            isRangePickerVisible: false,
            rangeSelection: [{
                startDate: new Date(),
                endDate: new Date(),
                key: 'selection'
            }],
            accountNumber:"",
            isAccountSelected:null,
            txtDetails: "",
            showFullDetails: false,
            endDate: "",
            startDate: "",
            invalidInterval:false
        }
   
        
    }

    componentDidMount(){
        const {dispatch} = this.props;
        dispatch(accountActions.GetTransactionHistory("CLEAR"));
    }

    handleRangeSelected =(ranges)=>{
        
        // {
        //   selection: {
        //     startDate: [native Date Object],
        //     endDate: [native Date Object],
        //   }
        // }
        this.setState({rangeSelection: [ranges]  })
    }

    setAccountChosen = (selected)=>{
    
        this.setState({accountNumber: selected.value, isAccountSelected:true}, 
            ()=>{
                // if(this.state.endDate!=="" && this.state.startDate!==""){
                    this.getHistory();
                // }
            })
    }

    getHistory =()=>{
        this.setState({isRangePickerVisible: false});
        let {accountNumber, rangeSelection,startDate, endDate} = this.state;
        let datePreviews = rangeSelection[0];
        const {dispatch} = this.props;
        if(accountNumber!==""){
            if(endDate!=="" && startDate!==""){
                if (Date.parse(startDate) > Date.parse(endDate)) {
                    this.setState({ invalidInterval: true });
                    return false;
                }else{
                    this.setState({invalidInterval:false})
                    let historyQueryString = `WalletNumber=${accountNumber}&StartDate=${startDate.toISOString()}&EndDate=${endDate.toISOString()}&Channel=3&PageSize=30&CurrentPage=1`;
                    // let historyQueryString = `WalletNumber=${accountNumber}&StartDate=${datePreviews.startDate.toISOString()}&EndDate=${datePreviews.endDate.toISOString()}&Channel=3&PageSize=20&CurrentPage=1`;
                        dispatch(accountActions.GetTransactionHistory(historyQueryString));
                }
            }else{

                let endDate= new Date(),
                    // startDate= new Date(endDate.getFullYear(), endDate.getMonth(), 1),
                    today = new Date(),
                    startDate = new Date (new Date().setDate(today.getDate()-30));

                let historyQueryString = `WalletNumber=${accountNumber}&StartDate=${startDate.toISOString()}&EndDate=${endDate.toISOString()}&Channel=3&PageSize=30&CurrentPage=1`;
                    
                        dispatch(accountActions.GetTransactionHistory(historyQueryString));
            }
        }else{
            this.setState({isAccountSelected:false})
        }
    }

    handleStartDatePicker = (startDate) => {
        startDate.setHours(startDate.getHours() + 1);
        
        this.setState({ startDate }, ()=>{
            if(this.state.endDate!==""){
                this.getHistory();
            }
        });
    }

    handleEndDatePicker = (endDate) => {
        endDate.setHours(endDate.getHours() + 1);
       
        this.setState({ endDate }, ()=>{
                if(this.state.startDate!==""){
                    this.getHistory();
                }
        });
    }
   

    renderTxtnHistory = () =>{
        
        const selectionRange = {
            startDate: null,
            endDate: new Date(),
            key: 'selection',
          }
        let {isRangePickerVisible,
            isAccountSelected,
             accountNumber,
             endDate,
             startDate,
             invalidInterval,
             rangeSelection} = this.state;
          let GetTransactionHistoryRequest = this.props.GetTransactionHistoryReducer,
                accountHistory;

            if(GetTransactionHistoryRequest.request_status ===dashboardConstants.GET_TRANSACTION_HISTORY_SUCCESS){
                accountHistory = GetTransactionHistoryRequest.request_data.response;
                
            }

        
        const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        let datePreviews = rangeSelection[0];

        const CustomInput = (props) => {
            return (
                <input
                    // className={[classes.TransparentInput, "uk-input"].join(" ")}
                    onClick={props.onClick}
                    value={props.value}
                    type="text"
                    readOnly={true}
                />
            )
        }
          
        return(
            <div className="each-section mt-80 res-mt-45">
                <div className="twosided nomargin">
                    <div>
                        <div className="page-section-mainheading app-panel">
                            <div className="border-lines"><span></span><span></span><span></span></div>
                            <h3>All transactions</h3>
                        </div>
                        <div className="subpage-heading app-panel">
                            <Row>
                                <Col xs={12} md={5} sm={5}>
                                    <div className={isAccountSelected===false? "error-wrap" : null }>
                                        <SelectAnAccount 
                                            onChange={(selected)=>{
                                                this.setAccountChosen(selected, selected)
                                            }}
                                            accountNumber={accountNumber} 
                                        />
                                        {isAccountSelected===false && <small className="error-msg">Account number required</small>}
                                    </div>
                                </Col>
                                <Col xs={12} md={7} sm={7} className="wrap-item">

                                    {/* <div className="chooserange"
                                        onClick={()=>this.setState({isRangePickerVisible: !isRangePickerVisible})}
                                    >Choose date range</div> */}
                                    <div className="range-picker">
                                        <div className="date-previews">
                                            <div className="alldates">
                                                <div className="each-date">
                                                    <label className="blocked-label" htmlFor="">Start date</label>
                                                    <DatePicker
                                                        onChangeRaw={this.handleDateChangeRaw}
                                                        onChange={this.handleStartDatePicker}
                                                        selected={startDate}
                                                        dateFormat="d MMMM, yyyy"
                                                        peekNextMonth
                                                        showMonthDropdown
                                                        showYearDropdown
                                                        dropdownMode="select"
                                                        placeholderText="Choose start date"
                                                        maxDate={new Date()}
                                                        // className="form-control form-control-sm h-38px"
                                                        className="form-control form-control-sm "

                                                    />
                                                </div>
                                                <div className="each-date">
                                                    <label htmlFor="" className="blocked-label">End date</label>
                                                    <DatePicker placeholderText="Choose end  date"
                                                        onChangeRaw={this.handleDateChangeRaw}
                                                        onChange={this.handleEndDatePicker}
                                                        selected={endDate}
                                                        dateFormat="d MMMM, yyyy"
                                                        peekNextMonth
                                                        showMonthDropdown
                                                        showYearDropdown
                                                        dropdownMode="select"
                                                        maxDate={new Date()}
                                                        // className="form-control form-control-sm h-38px"
                                                        className="form-control form-control-sm"

                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                       
                            {invalidInterval && 
                                
                                <Alert variant="danger mt-20">Start date cannot be later than End date</Alert>
                               
                            }
                       
                        {/* {isRangePickerVisible===true && */}
                            {/* <div className="range-picker"> */}
                                
                                {/* <div className="date-previews">
                                    <div className="alldates">
                                        <div className="each-date">
                                            <span className="date-itm">Start Date : </span>
                                            <span className="date-itm">{datePreviews.startDate.toLocaleDateString(undefined, dateOptions)}</span>
                                        </div>
                                        <div className="each-date">
                                            <span className="date-itm">End Date : </span>
                                            <span className="date-itm"> {datePreviews.endDate.toLocaleDateString(undefined, dateOptions)}</span>
                                        </div>
                                    </div>
                                    <Button variant="secondary"
                                        type="buttton"
                                        onClick={this.getHistory}
                                        className="ml-20 onboarding-btn"
                                    > Get history
                                    </Button>
                                </div> */}
                                {/* <DateRangePicker
                                    editableDateInputs={true}
                                    moveRangeOnFirstSelection={false}
                                    ranges={rangeSelection}
                                    onChange={(item)=>this.handleRangeSelected(item.selection)}
                                    maxDate={new Date()}
                                    monthHeight="100"
                                    fixedHeight={true}
                                    startDatePlaceholder="Choose Start Date"
                                    direction="vertical"
                                    scroll={{ enabled: true }}
                                /> */}
                            {/* </div> */}
                        
                        <div className="dashboard-section">
                            

                            {GetTransactionHistoryRequest.request_status ===dashboardConstants.GET_TRANSACTION_HISTORY_PENDING && 
                                <div className="all-transactions app-panel">
                                    <PageLoader/>
                                </div>
                            }
                            {GetTransactionHistoryRequest.request_status ===dashboardConstants.GET_TRANSACTION_HISTORY_FAILURE && 
                                
                                    <ErrorMessage errorMessage={GetTransactionHistoryRequest.request_data.error} canRetry={true} retryFunc={this.getHistory} />
                                
                            }

                            {GetTransactionHistoryRequest.request_status ===dashboardConstants.GET_TRANSACTION_HISTORY_SUCCESS &&
                                <div>
                                    {accountHistory.length >= 1 &&
                                        <div className="all-transactions app-panel">
                                            {
                                                accountHistory.map((eachTransaction, index) => {
                                                    return (
                                                        <div key={index} className="each-transaction each-listitem" onClick={()=>this.setState({txtDetails:eachTransaction, showFullDetails: true })}>
                                                            <div className="transaction-info">
                                                                <div className="txtn-icon">
                                                                    {
                                                                        eachTransaction.entryType === -1 &&
                                                                        <img src={DebitIcon} alt="" />
                                                                    }
                                                                    {
                                                                        eachTransaction.entryType === 1 &&
                                                                        <img src={CreditIcon} alt="" />
                                                                    }

                                                                </div>
                                                                <div className="txt-details">
                                                                    <h4>{eachTransaction.description}</h4>
                                                                    <h6>{getDateFromISO(eachTransaction.transactionDate, true)}</h6>
                                                                </div>
                                                            </div>
                                                            <div className="transaction-amount">
                                                                &#8358;{numberWithCommas(eachTransaction.amount, true)}
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                            
                                        </div>
                                    }
                                    {accountHistory.length ===0 &&
                                        <div className="nohistory app-panel">
                                            <div className="no-data-fetched">
                                                <img src={EmptyIcon} alt=""/>
                                                <h3>No transactions here yet.</h3>
                                            </div>
                                            
                                    </div>
                                    }


                                </div>
                            }

                        </div>
                    </div>
                    <DownloadApp/>
                    {/* <div className="ads-panel">
                        <div className="ad-wrap">
                            <div className="ad-details">
                                <div className="ad-content">
                                    <h3>Download the <span>app</span></h3>
                                    <div className="ad-text">
                                        To help make sure your are getting the best experience 
                                        download the mobile app and transact on the go!!!
                                    </div>
                                    <div className="download-app">
                                        <img src={PlayStore} alt=""/>
                                        <img src={AppStore} alt=""/>
                                    </div>
                                </div>
                                <div className="app-img">
                                    <img src={AppImg} alt=""/>
                                </div>
                            </div>
                            <div className="border-lines">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        )
    }

    handleDateChangeRaw = (e) => {
        e.preventDefault();
    }

    handleCloseDetails = () => {
        this.setState({ showFullDetails: false })
    };

    renderTxtFullDetails = (txtDetails) => {
       let {showFullDetails} = this.state;
        return (
            <Modal show={showFullDetails} onHide={this.handleCloseDetails} size="lg" centered="true" dialogClassName="modal-40w" animation={false}>
                <Modal.Header className="txt-header">
                    <Modal.Title>Transaction Details</Modal.Title>
                    <div className="closeicon" onClick={this.handleCloseDetails}>X</div>
                </Modal.Header>

                <Modal.Body>
                    <div className="each-transaction each-listitem each-transaction-details">
                        <div className="transaction-info">
                            <div className="txtn-icon">
                                {
                                    txtDetails.entryType===-1 &&
                                    <img src={DebitIcon} alt="" />
                                }
                                {
                                    txtDetails.entryType===1 &&
                                    <img src={CreditIcon} alt=""/>
                                }
                                
                            </div>
                            <div className="txt-details">
                                <h4>{txtDetails.description}</h4>
                                <div className="transaction-amount">
                                    &#8358;{numberWithCommas(txtDetails.amount, true)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="each-info">
                        <div className="item-title">Payment date</div>
                        <div className="item-txt">{getDateFromISO(txtDetails.transactionDate, true)}</div>
                    </div>
                    <div className="each-info">
                        <div className="item-title">Payment type</div>
                        <div className="item-txt">{txtDetails.entryTypeDesc}</div>
                    </div>
                    <div className="each-info">
                        <div className="item-title">Payment description</div>
                        <div className="item-txt">{txtDetails.description}</div>
                    </div>
                </Modal.Body>
                
            </Modal>
        )
    }



    

  
    


    render() {
        let {showFullDetails, txtDetails} = this.state;
        
        return (
            <Fragment>
                <Helmet>
                <title>9PSB - Transaction History</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Transactions</h3>
                    </div>
                   {this.renderTxtnHistory()}
                   {showFullDetails===true && this.renderTxtFullDetails(txtDetails)}
                </div>
                </InAppContainer>
            </Fragment>
        );
    }
}



function mapStateToProps(state) {
    return {
        GetTransactionHistoryReducer : state.accountsReducers.GetTransactionHistoryReducer,
    };
}

export default connect(mapStateToProps)(TransactionHistory);