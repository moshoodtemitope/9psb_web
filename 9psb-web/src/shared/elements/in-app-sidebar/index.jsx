import * as React from 'react';
import { Link, NavLink} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";
import "./in-app-sidebar.scss"; 


import Home from '../../../assets/images/home.svg';
import History from '../../../assets/images/history.svg';
import Money from '../../../assets/images/money.svg';
import Wallet from '../../../assets/images/wallet.svg';
import SendMoney from '../../../assets/images/sending.svg';
import Phone from '../../../assets/images/phone.svg';
import BuyData from '../../../assets/images/data.svg';
import Bills from '../../../assets/images/bills.svg';
import Cards from '../../../assets/images/cards.svg';
import Logout from '../../../assets/images/logout2.svg';
import Settings from '../../../assets/images/settings-1.svg';
import Support from '../../../assets/images/chat-5.svg';

import {onboardingActions} from '../../../redux/actions/onboarding/onboarding';
import {dashboardConstants} from '../../../redux/actiontypes/dashboard/dashboard.constants';
import "../../../assets/scss/shared/hamburgers.css"; 
class InAppSideBar extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            psbuser:JSON.parse(localStorage.getItem('psb-auth')),
            screenWidthSize: window.innerWidth,
            showSiderBar: window.innerWidth>=1024?true:false,
            isToggleActive: false,
            
        }
   
        window.addEventListener("resize", ()=>
                this.setState({screenWidthSize: window.innerWidth,
                                showSiderBar: window.innerWidth>=1024?true:false
                }));
    }

    componentDidMount(){
        document.addEventListener("mousedown",this.handleBodyClick, false);
    }

    componentWillUnmount(){
        document.removeEventListener("mousedown",this.handleBodyClick, false);
    }

    setWrapperRef =(node)=> {
        this.wrapperRef = node;
    }

    setWrapperRef2 =(node)=> {
        this.wrapperRef2 = node;
    }

    handleBodyClick=(event) =>{
        
        if ((this.wrapperRef && !this.wrapperRef.contains(event.target))
            && this.wrapperRef2 && !this.wrapperRef2.contains(event.target)) {
            this.setState({showSiderBar: false, isToggleActive:false})
        }
    }

    logoutCustomer = ()=>{
        const {dispatch} = this.props;
        // if(this.props.CreateAccountStep1Reducer.request_status === onboardingConstants.CREATE_USER_ACCOUNT_FAILURE){
        //     dispatch(onboardingActions.CreateAccountStep1("CLEAR"));
        // }
        dispatch(onboardingActions.Logout());
    }
    

    renderSideBarNav = ()=>{
        let {screenWidthSize, psbuser} = this.state;
        let GetCustomerDashboardDataRequest = this.props.GetCustomerDashboardDataReducer;
        let previewStyles= (JSON.parse(localStorage.getItem('psb-auth')).profilePix !=="no file" && JSON.parse(localStorage.getItem('psb-auth')).profilePix !=="")? 
                            {
                                background: `url(data:image/png;base64,${JSON.parse(localStorage.getItem('psb-auth')).profilePix})`,
                                // height:'60px',
                                backgroundSize: `100% 100%`,
                                backgroundPosition: `center center`,
                                backgroundRepeat: `no-repeat`
                            } :
                                {};
        // let preViewStyle = {
        //     background: `url(${psbuser.profilePix})`,
        //     // height:'60px',
        //     backgroundSize: `100% 100%`,
        //     backgroundPosition: `center center`,
        //     backgroundRepeat: `no-repeat`
        // };
        
        return(
            <div className="siderbar-wrapper" ref={this.setWrapperRef}>
                
                <div className="account-wrap">
                    <div className="customer-photo">
                        {/* <img src="" alt=""/> */}
                        <div className="">
                            <div  className="dp-placeholder" style={previewStyles}></div>
                            
                        </div>
                        
                    </div>
                    <div className="customer-info">
                        <h4>{psbuser.customerName}</h4>
                        {/* {(GetCustomerDashboardDataRequest.request_status=== dashboardConstants.GET_CUSTOMER_DASHBOARDDATA_SUCCESS && 
                             GetCustomerDashboardDataRequest.request_data.response.profileData!==undefined &&
                             GetCustomerDashboardDataRequest.request_data.response.profileData!==null &&
                             GetCustomerDashboardDataRequest.request_data.response.profileData!=="") &&
                            <div className="other-info">BVN-{GetCustomerDashboardDataRequest.request_data.response.profileData.bvn}</div>
                        } */}
                    </div>
                </div>
                <div className="all-navs">
                    <NavLink exact to="/app/dashboard">
                        <img src={Home} alt=""/>
                        <span>Dashboard</span>
                        
                    </NavLink>
                    <NavLink  to="/app/transaction-history">
                        <img src={History} alt=""/>
                        <span>Transaction history</span>
                    </NavLink>
                    {/* <NavLink  to="/app/fund-wallet">
                        <img src={Money} alt=""/>
                        <span>Fund Wallet</span>
                    </NavLink> */}
                    <NavLink  to="/app/cash-deposit">
                        <img src={Money} alt=""/>
                        <span>Cash Deposit</span>
                    </NavLink>
                    <NavLink  to="/app/cash-withdrawal">
                        <img src={Wallet} alt=""/>
                        <span>Cash Withdrawal</span>
                    </NavLink>
                    <NavLink  to="/app/transfer">
                        <img src={SendMoney} alt=""/>
                        <span>Transfer Money</span>
                    </NavLink>
                    {/* {(psbuser.savings!==undefined && psbuser.savings!==null && psbuser.savings!=="") &&  */}
                        <NavLink to="/app/savings">
                            <img src={SendMoney} alt="" />
                            <span>Savings</span>
                        </NavLink>
                    {/* } */}
                    <NavLink  to="/app/buy-airtime">
                        <img src={Phone} alt=""/>
                        <span>Buy Airtime</span>
                    </NavLink>
                    <NavLink  to="/app/buy-data">
                        <img src={BuyData} alt=""/>
                        <span>Buy Data</span>
                    </NavLink>
                    <NavLink  to="/app/pay-bills">
                        <img src={Bills} alt=""/>
                        <span>Pay Bill</span>
                    </NavLink>
                    {/* <NavLink  to="/app/cards">
                        <img src={Cards} alt=""/>
                        <span>Request/manage card</span>
                    </NavLink> */}
                    <NavLink  to="/app/account-settings">
                        <img src={Settings} alt=""/>
                        <span>Account setting</span>
                    </NavLink>
                    {/* <NavLink  to="/app/dashboard">
                        <img src={Support} alt=""/>
                        <span>Help and  support</span>
                    </NavLink> */}
                    <div className="logout-cta" onClick={this.logoutCustomer}>
                        <img src={Logout} alt=""/>
                        <span>Log Out</span>
                    </div>
                    
                </div>
            </div>
        )
    }

    renderSideBarToggle = ()=>{
        const {isToggleActive, showSiderBar} = this.state;
        return(
            <div className="mobilenav">
                <button ref={this.setWrapperRef2}  className={isToggleActive===false? "hamburger hamburger--arrow"  : "hamburger hamburger--arrow is-active" } 
                        type="button" onClick={()=>{
                            this.setState({isToggleActive: !isToggleActive, showSiderBar: !showSiderBar})
                        }}>
                    <span className="hamburger-box">
                        <span className="hamburger-inner"></span>
                    </span>
                </button>
            </div>
        )
    }
    


    render() {
        const{screenWidthSize, showSiderBar} = this.state
        
        return (
            <Fragment>
                {screenWidthSize <1024 && this.renderSideBarToggle()}
                {/* {screenWidthSize < 990 && 
                    <div className="menuhamburger"></div>
                } */}
                {showSiderBar && this.renderSideBarNav()}
                {showSiderBar && <div className="sidebar-underlay"></div>}
                
            </Fragment>
        );
    }
}


function mapStateToProps(state) {
    return {
        GetCustomerDashboardDataReducer : state.accountsReducers.GetCustomerDashboardDataReducer,
    };
}

export default connect(mapStateToProps)(InAppSideBar);