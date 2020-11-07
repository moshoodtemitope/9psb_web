import * as React from 'react';
import { Link} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";

import "../../../assets/scss/shared/slick.min.css"; 
import "../../../assets/scss/shared/slick-theme.min.css"; 
// import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";


import { Helmet } from 'react-helmet';
import Form from 'react-bootstrap/Form';
import {history} from '../../../_helpers/history'
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert';
import Select from 'react-select';
import Button from 'react-bootstrap/Button'
import  InAppContainer from '../../../shared/templates/inapp-container'
import  PageLoader from '../../../shared/elements/pageloader'
import  ErrorMessage from '../../../shared/elements/errormessage'
import  DownloadApp from '../../../shared/elements/downloadapp-box'
import CopyImg from '../../../assets/images/copy.svg';
import TransferIcon from '../../../assets/images/ac-transfer.svg';
import BillsIcon from '../../../assets/images/ac-bills.svg';
import CardsIcon from '../../../assets/images/ac-cards.svg';
import AirtimeIcon from '../../../assets/images/ac-airtime.svg';
import DataIcon from '../../../assets/images/ac-data.svg';
import DebitIcon from '../../../assets/images/debit-txt.svg';
import CreditIcon from '../../../assets/images/credit-txt.svg';
import EmptyIcon from '../../../assets/images/empty.svg';
import LoadingIcon from '../../../assets/images/loading.gif';
import { Formik } from 'formik';
import * as Yup from 'yup';

import {accountActions} from '../../../redux/actions/dashboard/dashboard';
import {dashboardConstants} from '../../../redux/actiontypes/dashboard/dashboard.constants';


import {onboardingConstants} from '../../../redux/actiontypes/onboarding/onboarding.constants'
import {onboardingActions} from '../../../redux/actions/onboarding/onboarding';

import { numberWithCommas, getDateFromISO, allowNumbersOnly} from '../../../shared/utils';
import "./dashboard.scss"; 
import confirmDeposit from '../cash-deposit/confirm-deposit';
class Dashboard extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            psbuser:JSON.parse(localStorage.getItem('psb-auth')),
            screenWidthSize: window.innerWidth,
            showSiderBar: window.innerWidth>=1024?true:false,
            selectedAccount: "",
            selectedAccountIndex:1,
            isAccountCopied:false,
            txtDetails: "",
            showFullDetails: false,
            showUpgradePrompt:false,
        }
   
        window.addEventListener("resize", ()=>
                this.setState({screenWidthSize: window.innerWidth,
                                showSiderBar: window.innerWidth>=1024?true:false
                }));
    }

    componentDidMount(){
        this.getCustomerDashboardInfo();
    }
    returnGreeting = ()=>{
        let today = new Date()
        let curHr = today.getHours()

        if (curHr < 12) {
            return 'Morning';
        } else if (curHr < 18) {
            return 'Afternoon';
        } else {
            return 'Evening';
        }
    }
    


    getCustomerAccounts = ()=>{
        const {dispatch} = this.props;
        dispatch(accountActions.GetCustomerAccounts());
    }

    getCustomerDashboardInfo = ()=>{
        const {dispatch} = this.props;
        dispatch(onboardingActions.UpgradeFetchDetails("CLEAR"));
        dispatch(onboardingActions.UpgradeValidateOtp("CLEAR"));
        dispatch(onboardingActions.UpgradeSendDetails("CLEAR"));
        dispatch(accountActions.GetTransactionHistory("CLEAR"));
        dispatch(accountActions.GetCustomerDashboardData());
        
        
    }

    loadHistoryForAWallet= (walletNumber)=>{
        const {dispatch} = this.props;
        let endDate= new Date(),
            // startDate= new Date(endDate.getFullYear(), endDate.getMonth(), 1),
            today = new Date(),
            startDate = new Date (new Date().setDate(today.getDate()-30)),
            historyQueryString = `WalletNumber=${walletNumber}&StartDate=${startDate.toISOString()}&EndDate=${endDate.toISOString()}&Channel=3&PageSize=5&CurrentPage=1`;
            dispatch(accountActions.GetTransactionHistory(historyQueryString));
    }

    getBVNDetails = (bvnDetailsPayload)=>{
        const {dispatch} = this.props;
        dispatch(onboardingActions.UpgradeFetchDetails(bvnDetailsPayload));
        
        
    }

    handleUpgradePrompt = ()=>{
        let {psbuser} = this.state;
        const {dispatch} = this.props;
        dispatch(onboardingActions.UpgradeFetchDetails("CLEAR"));

        
        if(psbuser.kycLevel===1){
            history.push("/app/account-settings/account-upgrade")
        }else{
            this.setState({showUpgradePrompt: true})
        }
    }

    goToNewSavings = ()=>{
        let {selectedAccount} = this.state;
       
        history.push("/app/savings/create", {walletNumber:selectedAccount.walletNumber})
        
    }

    copyAccountNumber = () =>{
        /* Get the text field */
        var copyText = document.querySelector(".account-to-copy");
        if (document.selection) { // IE
            var range = document.body.createTextRange();
            range.moveToElementText(copyText);
            range.select();
        } else if (window.getSelection) {
            var range = document.createRange();
            range.selectNode(copyText);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
        }
       
        // copyText.select();
        // copyText.setSelectionRange(0, 99999); 
      
        
        document.execCommand("copy");
      
        /* Alert the copied text */
        this.setState({isAccountCopied: true}, ()=>{
            setTimeout(() => {
                this.setState({isAccountCopied: false})
            }, 3000);
        });
       
      }

    renderAccountSummary= ()=>{
        const{screenWidthSize, 
                showSiderBar, 
                psbuser, 
                selectedAccount,
                isAccountCopied,
                selectedAccountIndex} = this.state
        let GetCustomerDashboardDataRequest = this.props.GetCustomerDashboardDataReducer,
        customerAccounts = GetCustomerDashboardDataRequest.request_data.response.accounts,
        defaultAccount= selectedAccount!==""?selectedAccount: customerAccounts[0];
        let accounstList =[
            
        ];

        const selectStyle = {
            control: base => ({
                ...base,
                border: 0,
                // This line disable the blue border
                boxShadow: "none"
            })
        };

        // console.log("dsdsdsds", customerAccounts);
        if(customerAccounts.length){
            customerAccounts.map((eachAcount, index)=>{
                accounstList.push({
                    label:`${eachAcount.walletNumber} - ${eachAcount.productName}`,
                    value:eachAcount.walletNumber,
                    accountIndex: index+1,
                    productName:eachAcount.productName,
                    walletBalance: eachAcount.walletBalance,
                    walletNumber: eachAcount.walletNumber,
                    accountType: eachAcount.accountType,
                })
            })


            return (
                <div className="account-summary-wrap">
                    {screenWidthSize >=1024 &&
                        <div className="account-summary">
                            <div className="wallet-balance">
                                <div className="each-summary-title">Your Wallet balance</div>
                                <div className="wallet-amount">&#x20A6;{numberWithCommas(`${defaultAccount.walletBalance}`, true)}</div>
                            </div>
                            <div className="accounts-list">
                                {accounstList.length>=2 &&
                                    <div className="each-summary-title">Account ({selectedAccountIndex} of {accounstList.length})</div>
                                }  

                                {accounstList.length<2 &&
                                    <div className="each-summary-title">Account</div> 
                                }
                                <Select
                                defaultValue={{label:`${defaultAccount.walletNumber} - ${defaultAccount.productName}`}}
                                    options={accounstList}
                                    styles={selectStyle}
                                    onChange={(selectedAccount)=>{
                                        this.setState({
                                            selectedAccount,
                                            selectedAccountIndex: selectedAccount.accountIndex
                                        })
                                        this.loadHistoryForAWallet(selectedAccount.value)
                                        
                                    }}
                                    noOptionsMessage ={()=>`No account found`}
                                    placeholder="choose account"
                                />
                            </div>
                            <div className="account-num-wrap">
                                <div>
                                    <div className="each-summary-title">Account Number</div>
                                    <div className="seleceted-account">
                                        <span className="account-to-copy">{defaultAccount.walletNumber}</span>
                                        
                                        {
                                            document.queryCommandSupported('copy') &&
                                            <span className="copy-icon" onClick={this.copyAccountNumber}>
                                                <img src={CopyImg} alt="" />
                                            </span>
                                        }
                                    </div>
                                {isAccountCopied && <small className="accountcopied-txt">Copied!</small>}
                                </div>
                            </div>
                            {(psbuser.kycLevel !==2 && (selectedAccount==="" || (selectedAccount!=="" && selectedAccount.accountType!=="002" ))) &&
                                <div className="fund-wallet-cta">
                                    <Button variant="primary"
                                        type="button"
                                        className="ml-0 mt-20 fundwallet-btn"
                                        onClick={()=>this.handleUpgradePrompt()}
                                    >  Upgrade Account
                                    </Button>
                                </div>
                            }
                            { (selectedAccount!=="" && selectedAccount.accountType==="002" ) &&
                                <div className="fund-wallet-cta">
                                    <Button variant="primary"
                                        type="button"
                                        className="ml-0 mt-20 fundwallet-btn"
                                        onClick={()=>this.goToNewSavings()}
                                    >  Add Savings
                                    </Button>
                                </div>
                            }
                        </div>
                    }

                    {screenWidthSize < 1024 &&
                        <div className="account-summary mobilesummary">
                            <div className="wallet-balance">
                                <div className="each-summary-title">Your Wallet balance</div>
                                <div className="wallet-amount">&#x20A6;{numberWithCommas(`${defaultAccount.walletBalance}`, true)}</div>
                            </div>
                            {(psbuser.kycLevel !==2 && (selectedAccount==="" || (selectedAccount!=="" && selectedAccount.accountType!=="002" ))) &&
                                <div className="fund-wallet-cta">
                                    <Button variant="primary"
                                        type="button"
                                        className="ml-0 fundwallet-btn"
                                        onClick={()=>this.handleUpgradePrompt()}
                                    >  Upgrade Account
                                    </Button>
                                </div>
                            }
                            { (selectedAccount!=="" && selectedAccount.accountType==="002" ) &&
                                <div className="fund-wallet-cta">
                                    <Button variant="primary"
                                        type="button"
                                        className="ml-0 mt-20 fundwallet-btn"
                                        onClick={()=>this.goToNewSavings()}
                                    >  Add Savings
                                    </Button>
                                </div>
                            }
                            <div className="account-num-wrap">
                                <div>
                                    <div className="each-summary-title">Account Number</div>
                                    <div className="seleceted-account">
                                        <span className="account-to-copy">{defaultAccount.walletNumber}</span>
                                        {
                                            document.queryCommandSupported('copy') &&
                                            <span className="copy-icon" onClick={this.copyAccountNumber}>
                                                <img src={CopyImg} alt="" />
                                            </span>
                                        }
                                        
                                    </div>
                                {isAccountCopied && <small className="accountcopied-txt">Copied!</small>}
                                </div>
                            </div>
                            <div className="accounts-list">
                                {accounstList.length>=2 &&
                                    <div className="each-summary-title">Account ({selectedAccountIndex} of {accounstList.length})</div>
                                }  

                                {accounstList.length<2 &&
                                    <div className="each-summary-title">Account</div> 
                                }
                                <Select 
                                    defaultValue={{label:`${defaultAccount.walletNumber} - ${defaultAccount.productName}`}}
                                    options={accounstList}
                                    styles={selectStyle}
                                    onChange={(selectedAccount)=>{
                                        this.setState({
                                            selectedAccount,
                                            selectedAccountIndex: selectedAccount.accountIndex
                                        })
                                        this.loadHistoryForAWallet(selectedAccount.value)
                                    }}
                                    noOptionsMessage ={()=>`No account found`}
                                    placeholder="choose account"
                                />
                            </div>
                        </div>
                    }

                </div>
            )
        }else{
            return ""
        }
    }

    renderDefaultAccountSummary= ()=>{
        const{screenWidthSize, 
                showSiderBar, 
                psbuser, 
                selectedAccount,
                isAccountCopied,
                selectedAccountIndex} = this.state;
        let 
            accounstList =[
                
            ],
        allAccounts = [...psbuser.allAccounts];

            if(psbuser.savings!==null && psbuser.savings !==undefined){
                allAccounts.push(psbuser.savings)
            }
        let customerAccounts = allAccounts,
            defaultAccount= selectedAccount!==""?selectedAccount: customerAccounts[0];

        const selectStyle = {
            control: base => ({
                ...base,
                border: 0,
                // This line disable the blue border
                boxShadow: "none"
            })
        };

        

        customerAccounts.map((eachAcount, index)=>{
            accounstList.push({
                label:`${eachAcount.walletNumber} - ${eachAcount.productName}`,
                value:eachAcount.walletNumber,
                productName:eachAcount.productName,
                accountIndex: index+1,
                walletBalance: eachAcount.walletBalance,
                walletNumber: eachAcount.walletNumber,
                accountType: eachAcount.accountType,
            })
        })


        return (
            <div className="account-summary-wrap">
                {screenWidthSize >=1024 &&
                    <div className="account-summary">
                        <div className="wallet-balance">
                            <div className="each-summary-title">Your Wallet balance</div>
                            <div className="wallet-amount">&#x20A6;{numberWithCommas(`${defaultAccount.walletBalance}`, true)}</div>
                        </div>
                        <div className="accounts-list">
                            {accounstList.length>=2 &&
                                <div className="each-summary-title">Account ({selectedAccountIndex} of {accounstList.length})</div>
                            }  

                            {accounstList.length<2 &&
                                <div className="each-summary-title">Account</div> 
                            }
                            <Select
                               defaultValue={{label:`${defaultAccount.walletNumber} - ${defaultAccount.productName}`}}
                                options={accounstList}
                                styles={selectStyle}
                                onChange={(selectedAccount)=>{
                                    this.setState({
                                        selectedAccount,
                                        selectedAccountIndex: selectedAccount.accountIndex
                                    })
                                    console.log("was here", selectedAccount)
                                    this.loadHistoryForAWallet(selectedAccount.value)
                                    
                                }}
                                noOptionsMessage ={()=>`No account found`}
                                placeholder="choose account"
                            />
                        </div>
                        <div className="account-num-wrap">
                            <div>
                                <div className="each-summary-title">Account Number</div>
                                <div className="seleceted-account">
                                    <span className="account-to-copy">{defaultAccount.walletNumber}</span>
                                    
                                    {
                                        document.queryCommandSupported('copy') &&
                                        <span className="copy-icon" onClick={this.copyAccountNumber}>
                                            <img src={CopyImg} alt="" />
                                        </span>
                                    }
                                </div>
                               {isAccountCopied && <small className="accountcopied-txt">Copied!</small>}
                            </div>
                        </div>
                        {(psbuser.kycLevel !==2 && (selectedAccount==="" || (selectedAccount!=="" && selectedAccount.accountType!=="002" ))) &&
                            <div className="fund-wallet-cta">
                                <Button variant="primary"
                                    type="button"
                                    className="ml-0 mt-20 fundwallet-btn"
                                    onClick={()=>this.handleUpgradePrompt()}
                                >  Upgrade Account
                                </Button>
                            </div>
                        }
                    {(selectedAccount !== "" && selectedAccount.accountType === "002") &&
                        <div className="fund-wallet-cta">
                            <Button variant="primary"
                                type="button"
                                className="ml-0 mt-20 fundwallet-btn"
                                onClick={() => this.goToNewSavings()}
                            >  Add Savings
                                    </Button>
                        </div>
                    }
                    </div>
                }

                {screenWidthSize < 1024 &&
                    <div className="account-summary mobilesummary">
                        <div className="wallet-balance">
                            <div className="each-summary-title">Your Wallet balance</div>
                            <div className="wallet-amount">&#x20A6;{numberWithCommas(`${defaultAccount.walletBalance}`, true)}</div>
                        </div>
                        {(psbuser.kycLevel !==2 && (selectedAccount==="" || (selectedAccount!=="" && selectedAccount.accountType!=="002" ))) &&
                            <div className="fund-wallet-cta">
                                <Button variant="primary"
                                    type="button"
                                    className="ml-0 fundwallet-btn"
                                    onClick={()=>this.handleUpgradePrompt()}
                                >  Upgrade Account
                                </Button>
                            </div>
                        }
                        { (selectedAccount!=="" && selectedAccount.accountType==="002" ) &&
                                <div className="fund-wallet-cta">
                                    <Button variant="primary"
                                        type="button"
                                        className="ml-0 mt-20 fundwallet-btn"
                                        onClick={()=>this.goToNewSavings()}
                                    >  Add Savings
                                    </Button>
                                </div>
                            }
                        <div className="account-num-wrap">
                            <div>
                                <div className="each-summary-title">Account Number</div>
                                <div className="seleceted-account">
                                    <span className="account-to-copy">{defaultAccount.walletNumber}</span>
                                    {
                                        document.queryCommandSupported('copy') &&
                                        <span className="copy-icon" onClick={this.copyAccountNumber}>
                                            <img src={CopyImg} alt="" />
                                        </span>
                                    }
                                    
                                </div>
                               {isAccountCopied && <small className="accountcopied-txt">Copied!</small>}
                            </div>
                        </div>
                        <div className="accounts-list">
                            {accounstList.length>=2 &&
                                <div className="each-summary-title">Account ({selectedAccountIndex} of {accounstList.length})</div>
                            }  

                            {accounstList.length<2 &&
                                <div className="each-summary-title">Account</div> 
                            }
                            <Select 
                                defaultValue={{label:`${defaultAccount.walletNumber} - ${defaultAccount.productName}`}}
                                options={accounstList}
                                styles={selectStyle}
                                onChange={(selectedAccount)=>{
                                    this.setState({
                                        selectedAccount,
                                        selectedAccountIndex: selectedAccount.accountIndex
                                    })
                                    this.loadHistoryForAWallet(selectedAccount.value)
                                }}
                                noOptionsMessage ={()=>`No account found`}
                                placeholder="choose account"
                            />
                        </div>
                    </div>
                }

            </div>
        )
    }

    searchQuickActions = (searchText)=>{
        let allActions = document.querySelectorAll('.slick-list .actions h4');
        let searchTerm = searchText.target.value.trim();

        allActions.forEach(eachAction=>{
            if(eachAction.textContent.toLowerCase().indexOf(searchTerm.toLowerCase())===-1){
                eachAction.parentNode.parentNode.parentNode.parentNode.classList.add("hide");
            }else{
                if(eachAction.parentNode.parentNode.parentNode.parentNode.classList.contains("hide")){
                    eachAction.parentNode.parentNode.parentNode.parentNode.classList.remove("hide");
                }
                
            }
        })
           

    }

    renderQuickActions = ()=>{
        const settings = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 4,
            initialSlide: 0,
            responsive: [
              {
                breakpoint: 1023,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 3,
                  infinite: true,
                  dots: true
                }
              },
              {
                breakpoint: 600,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 2,
                  initialSlide: 2,
                  dots: true
                }
              },
              {
                breakpoint: 480,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  dots: true,
                  arrows: true
                }
              }
            ]
          };
        return(
            <div className="each-section">
                <div className="dashboard-title-section">
                    <h3>Quick actions</h3>
                    <input type="text" name="" onChange={this.searchQuickActions} placeholder="Search for any banking services" id=""/>
                </div>
                <div className="dashboard-section">
                   
                    <Slider {...settings} className="quick-actions">
                        <div className="each-action">
                            <div className="actions" onClick={()=>history.push("/app/transfer")}>
                                <h4>Transfer Money</h4>
                                <img src={TransferIcon} alt="" />
                            </div>
                        </div>
                        <div className="each-action">
                            <div className="actions" onClick={()=>history.push("/app/pay-bills")}>
                                <h4>Pay utility Bills</h4>
                                <img src={BillsIcon} alt="" />
                            </div>
                        </div>
                        <div className="each-action">
                            <div className="actions" onClick={()=>history.push("/app/cash-withdrawal")}>
                                <h4>Cash Withdrawal</h4>
                                <img src={CardsIcon} alt="" />
                            </div>
                        </div>
                        <div className="each-action">
                            <div className="actions" onClick={()=>history.push("/app/cash-deposit")}>
                                <h4>Cash Deposit</h4>
                                <img src={CardsIcon} alt="" />
                            </div>
                        </div>
                        <div className="each-action">
                            <div className="actions" onClick={()=>history.push("/app/locate-agents")}>
                                <h4>Locate Agent</h4>
                                <img src={CardsIcon} alt="" />
                            </div>
                        </div>
                        <div className="each-action">
                            <div className="actions" onClick={()=>history.push("/app/buy-airtime")}>
                                <h4>Buy Airtime</h4>
                                <img src={AirtimeIcon} alt="" />
                            </div>
                        </div>
                        <div className="each-action">
                            <div className="actions" onClick={()=>history.push("/app/buy-data")}>
                                <h4>Buy Data</h4>
                                <img src={DataIcon} alt="" />
                            </div>
                        </div>
                    </Slider>
                </div>
            </div>
        )
    }

    handleCloseDetails = () => {
        this.setState({ showFullDetails: false })
    };

    handleCloseUpgradeOptions = () => {
        this.setState({ showUpgradePrompt: false })
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

    renderUpgradeOptions = () => {
        let { showUpgradePrompt, bvnDetailsPayload, psbuser } = this.state;

        let checkValidationSchema = Yup.object().shape({
            upgradeOption: Yup.string()
                .required('Required'),
            theBVN: Yup.string()
                .when('upgradeOption',{
                    is:(value)=>value==="1",
                    then: Yup.string()
                        .required('Required')
                        .min(10, 'Valid BVN only')
                        .max(11, 'Valid BVN only')
                        
                }),
            
                
          });

        let upgradeOptions,
            UpgradeFetchDetailsRequest =  this.props.UpgradeFetchDetailsReducer;

        if (psbuser.isBvnLinked === true) {
            upgradeOptions = [
                { value: "0", label: 'Provide your details instead' },
            ];
        }else{
            upgradeOptions = [
                { value: "1", label: 'BVN' },
                { value: "0", label: 'Provide your details instead' },
            ];
        }
            
        return (
            <Modal show={showUpgradePrompt} onHide={this.handleCloseUpgradeOptions} size="lg" centered="true" dialogClassName="modal-40w" animation={false}>
                <Modal.Header className="txt-header modal-bg modal-header">
                    <Modal.Title>
                        <div className="modal-bg">
                            <h2>Update your account</h2>
                            <div className="modal-helptxt">Increase your transaction limit</div>
                        </div>
                    </Modal.Title>
                    <div className="closeicon" onClick={this.handleCloseUpgradeOptions}>X</div>
                </Modal.Header>

                <Modal.Body>
                    <Formik
                        initialValues={{
                            upgradeOption: '',
                            theBVN: ''
                        }}

                        validationSchema={checkValidationSchema}
                        onSubmit={(values, { resetForm }) => {

                            // console.log("kalie ded", values.upgradeOption);
                            if (values.upgradeOption === "1" && values.theBVN!=="") {
                                let bvnDetails = {
                                    bvnNumber:   values.theBVN
                                };
                                this.setState({bvnDetailsPayload: bvnDetails})

                                
                                this.getBVNDetails(bvnDetails)
                                


                            }
                            if(values.upgradeOption === "0"){
                                history.push("/app/account-settings/account-upgrade")
                            }
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
                                    className="form-content mt-0 w-70">




                                    <div className="form-wrap">
                                        <Form.Group className="poppedinput withselect">
                                            {/* <Form.Group className="onboardinginput withselect"> */}
                                            <Form.Label className="block-level">Verification method</Form.Label>
                                            <Select
                                                options={upgradeOptions}
                                                onChange={(selected) => setFieldValue('upgradeOption', selected.value)}
                                                onBlur={() => setFieldTouched('upgradeOption', true)}
                                                className={errors.upgradeOption && touched.upgradeOption ? "is-invalid" : null}
                                                name="upgradeOption"
                                            />
                                            {errors.upgradeOption && touched.upgradeOption ? (
                                                <span className="invalid-feedback">{errors.upgradeOption}</span>
                                            ) : null}
                                        </Form.Group>


                                        {values.upgradeOption === "1" &&
                                            <Form.Group className="inputfield mb-0">
                                                <Form.Control type="text"
                                                        name="theBVN"
                                                        onChange={handleChange}
                                                        placeholder="Enter BVN number"
                                                        value={allowNumbersOnly(values.theBVN,11)}
                                                        className={errors.theBVN && touched.theBVN ? "is-invalid mb-0" : "mb-0"}
                                                    />
                                                {errors.theBVN && touched.theBVN ? (
                                                    <span className="invalid-feedback">{errors.theBVN}</span>
                                                ) : null}
                                                <div className="bvn-info text-left">
                                                    Dial *565*0# to get you BVN
                                            </div>

                                            </Form.Group>
                                        }
                                    </div>






                                    
                                    {(UpgradeFetchDetailsRequest.request_status === onboardingConstants.UPGRADE_FETCH_DETAILS_FAILURE) &&



                                        <ErrorMessage errorMessage={UpgradeFetchDetailsRequest.request_data.error} canRetry={UpgradeFetchDetailsRequest.request_data.error!=="Your account has already been linked to a BVN"?true:false} retryFunc={() => this.getBVNDetails(bvnDetailsPayload)} />

                                    }
                                    <div className="footer-with-cta toleft ">
                                        <Button variant="secondary"
                                            type="submit"
                                            disabled={UpgradeFetchDetailsRequest.is_request_processing}
                                            className="ml-0 onboarding-btn"
                                        >  {UpgradeFetchDetailsRequest.is_request_processing ? 'Please wait...' : 'Continue'}
                                        </Button>

                                    </div>
                                    {/* {loginRequest.request_status === authConstants.LOGIN_USER_FAILURE &&
                                    <Alert variant="danger mt-20">
                                        {loginRequest.request_data.error !== undefined ? loginRequest.request_data.error : null}


                                    </Alert>
                                } */}

                                </Form>
                            )}
                    </Formik>

                </Modal.Body>

            </Modal>
        )
    }


    renderTxtnHistory = () =>{
        let GetCustomerDashboardDataRequest = this.props.GetCustomerDashboardDataReducer,
            GetTransactionHistoryRequest = this.props.GetTransactionHistoryReducer,
        accountHistory;
        if(GetTransactionHistoryRequest.request_status ===dashboardConstants.GET_TRANSACTION_HISTORY_SUCCESS){
            accountHistory = GetTransactionHistoryRequest.request_data.response;
            
        }else{
            accountHistory = GetCustomerDashboardDataRequest.request_data.response.historydata;
            
        }
        
        return(
            <div className="each-section mt-60">
                <div className="twosided">
                    { accountHistory!==undefined &&
                     <div>
                        <div className="dashboard-title-section">
                            <h3>Last 5 transactions</h3>
                            <Link to="/app/transaction-history">View all</Link>
                        </div>
                        <div className="dashboard-section">
                            {GetTransactionHistoryRequest.request_status ===dashboardConstants.GET_TRANSACTION_HISTORY_PENDING && 
                                <div className="all-transactions app-panel">
                                    <PageLoader/>
                                </div>
                            }

                            {GetTransactionHistoryRequest.request_status ===dashboardConstants.GET_TRANSACTION_HISTORY_FAILURE && 
                                
                                    <ErrorMessage errorMessage={GetTransactionHistoryRequest.request_data.error} canRetry={true} retryFunc={()=>this.loadHistoryForAWallet(this.state.selectedAccount.value)} />
                                
                            }

                            {((GetTransactionHistoryRequest.request_status ===dashboardConstants.GET_TRANSACTION_HISTORY_SUCCESS ||
                                GetCustomerDashboardDataRequest.request_status=== dashboardConstants.GET_CUSTOMER_DASHBOARDDATA_SUCCESS)
                                && GetTransactionHistoryRequest.request_status !==dashboardConstants.GET_TRANSACTION_HISTORY_PENDING && accountHistory!==undefined) 
                                &&
                                <div>
                                    {accountHistory.length>=1 &&
                                        <div className="all-transactions app-panel">
                                            {
                                                accountHistory.map((eachTransaction, index)=>{
                                                    return (
                                                        <div key={index} className="each-transaction each-listitem" onClick={()=>this.setState({txtDetails:eachTransaction, showFullDetails: true })}>
                                                            <div className="transaction-info">
                                                                <div className="txtn-icon">
                                                                    {
                                                                        eachTransaction.entryType===-1 &&
                                                                        <img src={DebitIcon} alt="" />
                                                                    }
                                                                    {
                                                                        eachTransaction.entryType===1 &&
                                                                        <img src={CreditIcon} alt=""/>
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
                                            {/* <div className="each-transaction each-listitem">
                                                <div className="transaction-info">
                                                    <div className="txtn-icon">
                                                        <img src={DebitIcon} alt=""/>
                                                    </div>
                                                    <div className="txt-details">
                                                        <h4>Blenco Supermarket, Inward transfer, purchase of items</h4>
                                                        <h6>12/08/2019</h6>
                                                    </div>
                                                </div>
                                                <div className="transaction-amount">
                                                    &#8358;{numberWithCommas(200000000, true)}
                                                </div>
                                            </div>
                                            <div className="each-transaction each-listitem">
                                                <div className="transaction-info">
                                                    <div className="txtn-icon">
                                                        <img src={CreditIcon} alt=""/>
                                                    </div>
                                                    <div className="txt-details">
                                                        <h4>Wallet Top Up</h4>
                                                        <h6>12/08/2019</h6>
                                                    </div>
                                                </div>
                                                <div className="transaction-amount">
                                                    &#8358;{numberWithCommas(200000, true)}
                                                </div>
                                            </div>
                                            <div className="each-transaction each-listitem">
                                                <div className="transaction-info">
                                                    <div className="txtn-icon">
                                                        <img src={DebitIcon} alt=""/>
                                                    </div>
                                                    <div className="txt-details">
                                                        <h4>Total Petrol Station, POS payment</h4>
                                                        <h6>12/08/2019</h6>
                                                    </div>
                                                </div>
                                                <div className="transaction-amount">
                                                    &#8358;{numberWithCommas(200000, true)}
                                                </div>
                                            </div>
                                            <div className="each-transaction each-listitem">
                                                <div className="transaction-info">
                                                    <div className="txtn-icon">
                                                        <img src={DebitIcon} alt=""/>
                                                    </div>
                                                    <div className="txt-details">
                                                        <h4>KFC, Cash In, from …</h4>
                                                        <h6>12/08/2019</h6>
                                                    </div>
                                                </div>
                                                <div className="transaction-amount">
                                                    &#8358;{numberWithCommas(200000, true)}
                                                </div>
                                            </div>
                                            <div className="each-transaction each-listitem"> */}
                                                {/* <div className="transaction-info">
                                                    <div className="txtn-icon">
                                                        <img src={DebitIcon} alt=""/>
                                                    </div>
                                                    <div className="txt-details">
                                                        <h4>Bank Transfer</h4>
                                                        <h6>12/08/2019</h6>
                                                    </div>
                                                </div>
                                                <div className="transaction-amount">
                                                    &#8358;{numberWithCommas(200000, true)}
                                                </div>
                                            </div> */}
                                        </div>
                                    }
                                    {accountHistory.length===0 &&
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
                    }
                    { accountHistory!==undefined &&
                        <DownloadApp/>
                    }
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

    
    renderDashboardWrap = ()=>{
        let {psbuser, showFullDetails, txtDetails, showUpgradePrompt} = this.state;
        let GetCustomerDashboardDataRequest = this.props.GetCustomerDashboardDataReducer;
        return(
            <div className="">
                <div className="dashboard-heading">
                    <h3>Hello {psbuser.firstName},</h3>
                    <h5>Good {this.returnGreeting()}</h5>
                </div>

                
               

                {GetCustomerDashboardDataRequest.request_status=== dashboardConstants.GET_CUSTOMER_DASHBOARDDATA_PENDING && 
                    <div>
                        {
                            psbuser.allAccounts!==undefined && 
                            this.renderDefaultAccountSummary()
                        }
                        {
                            psbuser.allAccounts===undefined && 
                            <PageLoader/>
                        }
                        
                        {this.renderQuickActions()}
                        {showUpgradePrompt===true && this.renderUpgradeOptions()}
                    </div>
                }

                

                {GetCustomerDashboardDataRequest.request_status=== dashboardConstants.GET_CUSTOMER_DASHBOARDDATA_FAILURE && 
                    <div>
                        {
                            psbuser.allAccounts!==undefined && 
                            this.renderDefaultAccountSummary()
                        }
                        <ErrorMessage errorMessage={GetCustomerDashboardDataRequest.request_data.error} canRetry={true} retryFunc={this.getCustomerDashboardInfo} />
                        {this.renderQuickActions()}
                        {showUpgradePrompt===true && this.renderUpgradeOptions()}
                   </div>
                }

                {GetCustomerDashboardDataRequest.request_status=== dashboardConstants.GET_CUSTOMER_DASHBOARDDATA_SUCCESS && 
                    <div>
                        {this.renderAccountSummary()}
                        {this.renderQuickActions()}
                        {this.renderTxtnHistory()}
                        {showFullDetails===true && this.renderTxtFullDetails(txtDetails)}
                        {showUpgradePrompt===true && this.renderUpgradeOptions()}
                    </div>
                }
                
                

            </div>
        )
    }



    

  
    


    render() {
        
        
        return (
            <Fragment>
                <Helmet>
                    <title>9PSB - Dashboard</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                   {this.renderDashboardWrap()}
                </div>
                </InAppContainer>
            </Fragment>
        );
    }
}



function mapStateToProps(state) {
    return {
        GetCustomerDashboardDataReducer : state.accountsReducers.GetCustomerDashboardDataReducer,
        GetTransactionHistoryReducer : state.accountsReducers.GetTransactionHistoryReducer,
        UpgradeFetchDetailsReducer : state.onboardingReducers.UpgradeFetchDetailsReducer,
    };
}

export default connect(mapStateToProps)(Dashboard);