import * as React from 'react';
import { Route, Switch } from "react-router-dom";
import { Redirect, Router } from "react-router";
import {history} from "../_helpers/history";
import { connect } from 'react-redux';
import { Fragment } from "react";

import {onboardingActions} from '../redux/actions/onboarding/onboarding';
import {onboardingConstants} from '../redux/actiontypes/onboarding/onboarding.constants';

import AppLogin from './onboarding/login/login.jsx'
import AppSignUp from './onboarding/signup'
import GetCustomerDetails from './onboarding/signup/provide-details'
import ValidateSignUpOtp from './onboarding/signup/validate-otp'
import ConfirmDetailsFromOtp from './onboarding/signup/confirm-details'
import SuccessReg from './onboarding/signup/success'
import SignUpCreatePin from './onboarding/signup/create-pin'
import SignUpCreatePinSuccess from './onboarding/signup/create-pin-success'

import ForgotPassword from './onboarding/reset-password'
import ResetPwValidateOtp from './onboarding/reset-password/validate-otp'
import SetNewPassword from './onboarding/reset-password/new-password'
import SuccessNewPw from './onboarding/reset-password/success'

import Dashboard from './inapp/dashboard'
import TransactionHistory from './inapp/transaction-history'
import CashDeposit from './inapp/cash-deposit'
import ConfirmCashDeposit from './inapp/cash-deposit/confirm-deposit'
import CashDepositLocations from './inapp/cash-deposit/depositlocations'

import LocateAgents from './inapp/locate-agents'
import AgentsLocations from './inapp/locate-agents/agentslocations'

import FundWallet from './inapp/fund-wallet';
import ConfirmCardDetails from './inapp/fund-wallet/confirm-details';
import SuccessFulFundWallet from './inapp/fund-wallet/success';

import CashWithdrawal from './inapp/cash-withdrawal'
import ConfirmCashWithdrawal from './inapp/cash-withdrawal/confirm-withdrawal'
import ConfirmCashWithdrawalSuccess from './inapp/cash-withdrawal/confirm-withdrawal-success'

import AgentWithdrawal from './inapp/cash-withdrawal/agent-withdrawal/agent-withdrawal'
import ConfirmAgentWithdrawalSuccess from './inapp/cash-withdrawal/agent-withdrawal/confirm-withdrawal-success'
import ConfirmAgentCashWithdrawal from './inapp/cash-withdrawal/agent-withdrawal/confirm-withdrawal'
import FindAnAgent from './inapp/cash-withdrawal/agent-withdrawal/findagent'
import CashWithdrawalLocations from './inapp/cash-withdrawal/agent-withdrawal/withdrawallocations'

import MoneyTransfer from './inapp/money-transfer'
import MoneyTransferDetails from './inapp/money-transfer/provide-details'
import ConfirmTransferToPhone from './inapp/money-transfer/confirm-transfer'
import TransferToPhoneSuccess from './inapp/money-transfer/transfer-success'

import BankTransfer from './inapp/money-transfer/bank-transfer'
import TransferToBankBeneficiaryDetails from './inapp/money-transfer/bank-transfer/to-beneficiary'
import ConfirmBankTransfer from './inapp/money-transfer/bank-transfer/confirm-transfer'
import TransferToBankSuccess from './inapp/money-transfer/bank-transfer/transfer-success'
import BankTransferDetails from './inapp/money-transfer/bank-transfer/provide-details'
import ConfirmNewTransferToBank from './inapp/money-transfer/bank-transfer/confirm-new-transfer'

import BuyAirtime from './inapp/airtime/'
import ConfirmAirtimeTopUp from './inapp/airtime/confirm-airtime'
import BuyAirtimeOthers from './inapp/airtime/others'
import ChooseTopUpOption from './inapp/airtime/others/choose'
import ConfirmAirtimeOthersTopUp from './inapp/airtime/others/confirm-airtime'
import AirtimePurchaseSuccess from './inapp/airtime/success'

import BuyData from './inapp/buydata/'
import ConfirmDataTopUp from './inapp/buydata/confirm'
import BuyDataOthers from './inapp/buydata/others'
import ChooseDataTopUpOption from './inapp/buydata/others/choose'
import BuyDataOthersConfirm from './inapp/buydata/others/confirm'
import DataTopUpSuccess from './inapp/buydata/success'

import PayBills from './inapp/paybills'
import chooseBiller from './inapp/paybills/choose-biller'
import BillDetails from './inapp/paybills/provide-details'
import ConfirmBillPayment from './inapp/paybills/confirm-bill'
import BillPaymentSuccess from './inapp/paybills/success'

import ManageCards from './inapp/cards'
import CardRequestDetails from './inapp/cards/request/provide-details'
import ConfirmCardRequest from './inapp/cards/request/confirm'
import CardRequestSuccess from './inapp/cards/request/success'
import ActivateCard from './inapp/cards/activate/activate'

import CreateSavings from './inapp/savings/create-savings'
import CreateSavingsSuccess from './inapp/savings/create-savings-success'
import GetAllSavings from './inapp/savings'



import AccountSettings from './inapp/account-settings'
import ChangePin from './inapp/account-settings/change-pin'
import PinChangeSuccess from './inapp/account-settings/change-pin/success'
import InitateResetTxtPin from './inapp/account-settings/reset-pin'
import NewTxtPin from './inapp/account-settings/reset-pin/newpin'
import PinResetSuccess from './inapp/account-settings/reset-pin/success'
// import PinChangeSuccess from './inapp/account-settings/change-pin/success'

import ChangePassword from './inapp/account-settings/change-password'
import PassChangeSuccess from './inapp/account-settings/change-password/success'

import ConfirmUpgradeDetails from './inapp/account-settings/upgrade-account/confirm-details'
import ValidateAccountUpgradeOtp from './inapp/account-settings/upgrade-account/validate-otp'
import AccountUpgradeSuccess from './inapp/account-settings/upgrade-account/success'


// import {authActions} from '../redux/actions/auth/auth.action';




function PrivateRoute({ component: Component, authed, ...rest }) {
    var psbuser = JSON.parse(localStorage.getItem("psb-auth"));

    // let isLoggedIn = authed.request_status === onboardingConstants.LOGIN_USER_SUCCESS && psbuser;
    let isLoggedIn = authed.request_status === onboardingConstants.LOGIN_USER_SUCCESS || psbuser;

    // console.log("is logged",psbuser);
     /**To be uncommented */

    if(isLoggedIn){
        let psbuser =  JSON.parse(localStorage.getItem("psb-auth"));

            if(psbuser.isProfileSet===false){
                return(
                    <Route
                        {...rest}
                        render={(props) =>  <Redirect to={{ pathname: '/app/confirm-details', state: { from: props.location } }} />}
                    />
                )
            }else{
                if(psbuser.isPinSet===false){
                    return(
                        <Route
                            {...rest}
                            render={(props) =>  <Redirect to={{ pathname: '/app/create-pin', state: { from: props.location } }} />}
                        />
                    )
                }
            }

            

            

            
            if(psbuser.isProfileSet===true && psbuser.isPinSet===true){
                return (
                    <Route
                        {...rest}
                        render={(props) =>  <Component  {...rest} {...props} />}
                    />
                )
            }
    }else{
        return(
            <Route
                {...rest}
                render={(props) =>  <Redirect to={{ pathname: '/', state: { from: props.location } }} />}
            />
        )
    }

    /**To be uncommented ends */
    
    return (
        <Route
            {...rest}
            render={(props) => authed && isLoggedIn ? <Component  {...rest} {...props} />
                : <Redirect to={{ pathname: '', state: { from: props.location } }} />}
        />
    )
}

class AuthenticatedRoutes extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            user:''
        }
        
    }
    



    render() {
        
        return (
               
                <Fragment>
                    <Router history={history}>
                    <Switch>
                        <Route exact path='/' render={(props) => <AppLogin  />} /> 
                        <Route exact path='/app/signup' render={(props) => <AppSignUp  />} /> 
                        <Route exact path='/app/signup/provide-details' render={(props) => <GetCustomerDetails  />} /> 
                        <Route exact path='/app/signup/provide-details' render={(props) => <GetCustomerDetails  />} /> 
                        <Route exact path='/app/signup/otp' render={(props) => <ValidateSignUpOtp  />} /> 
                        <Route exact path='/app/confirm-details' render={(props) => <ConfirmDetailsFromOtp  />} /> 
                        <Route exact path='/app/signup/success' render={(props) => <SuccessReg  />} /> 
                        <Route exact path='/app/create-pin' render={(props) => <SignUpCreatePin  />} /> 
                        <Route exact path='/app/create-pin-success' render={(props) => <SignUpCreatePinSuccess  />} />

                        <Route exact path='/app/reset-password' render={(props) => <ForgotPassword  />} /> 
                        <Route exact path='/app/reset-password/otp' render={(props) => <ResetPwValidateOtp  />} /> 
                        <Route exact path='/app/reset-password/new-password' render={(props) => <SetNewPassword  />} /> 
                        <Route exact path='/app/reset-password/success' render={(props) => <SuccessNewPw  />} /> 
                        
                        <PrivateRoute exact path='/app/dashboard' {...this.props} authed={this.props.psbuser} component={Dashboard} />  
                        <PrivateRoute exact path='/app/transaction-history' {...this.props} authed={this.props.psbuser} component={TransactionHistory} />  
                        <PrivateRoute exact path='/app/cash-deposit' {...this.props} authed={this.props.psbuser} component={CashDeposit} />  
                        <PrivateRoute exact path='/app/cash-deposit/locations' {...this.props} authed={this.props.psbuser} component={CashDepositLocations} />  
                        <PrivateRoute exact path='/app/cash-deposit/confirm' {...this.props} authed={this.props.psbuser} component={ConfirmCashDeposit} />  
                        
                        <PrivateRoute exact path='/app/locate-agents' {...this.props} authed={this.props.psbuser} component={LocateAgents} />  
                        <PrivateRoute exact path='/app/locate-agents/locations' {...this.props} authed={this.props.psbuser} component={AgentsLocations} />  

                        {/* <PrivateRoute exact path='/app/fund-wallet' {...this.props} authed={this.props.psbuser} component={FundWallet} />  
                        <PrivateRoute exact path='/app/fund-wallet/confirm-details' {...this.props} authed={this.props.psbuser} component={ConfirmCardDetails} />  
                        <PrivateRoute exact path='/app/fund-wallet/success' {...this.props} authed={this.props.psbuser} component={SuccessFulFundWallet} />   */}

                        <PrivateRoute exact path='/app/cash-withdrawal' {...this.props} authed={this.props.psbuser} component={CashWithdrawal} />  
                        <PrivateRoute exact path='/app/cash-withdrawal/confirm' {...this.props} authed={this.props.psbuser} component={ConfirmCashWithdrawal} />  
                        <PrivateRoute exact path='/app/cash-withdrawal/success' {...this.props} authed={this.props.psbuser} component={ConfirmCashWithdrawalSuccess} />  

                        <PrivateRoute exact path='/app/cash-withdrawal/agents' {...this.props} authed={this.props.psbuser} component={AgentWithdrawal} />  
                        <PrivateRoute exact path='/app/cash-withdrawal/agents/code' {...this.props} authed={this.props.psbuser} component={ConfirmAgentWithdrawalSuccess} />  
                        <PrivateRoute exact path='/app/cash-withdrawal/agents/confirm' {...this.props} authed={this.props.psbuser} component={ConfirmAgentCashWithdrawal} />  
                        <PrivateRoute exact path='/app/cash-withdrawal/agents/findagent' {...this.props} authed={this.props.psbuser} component={FindAnAgent} />  
                        <PrivateRoute exact path='/app/cash-withdrawal/agents/locations' {...this.props} authed={this.props.psbuser} component={CashWithdrawalLocations} />  

                        <PrivateRoute exact path='/app/transfer' {...this.props} authed={this.props.psbuser} component={MoneyTransfer} />  
                        <PrivateRoute exact path='/app/transfer/provide-details' {...this.props} authed={this.props.psbuser} component={MoneyTransferDetails} />  
                        <PrivateRoute exact path='/app/transfer/confirm' {...this.props} authed={this.props.psbuser} component={ConfirmTransferToPhone} />  
                        <PrivateRoute exact path='/app/transfer/success' {...this.props} authed={this.props.psbuser} component={TransferToPhoneSuccess} />  
                        
                        <PrivateRoute exact path='/app/transfer/to-bank' {...this.props} authed={this.props.psbuser} component={BankTransfer} />  
                        <PrivateRoute exact path='/app/transfer/to-bank/sendTobeneficiary' {...this.props} authed={this.props.psbuser} component={TransferToBankBeneficiaryDetails} />  
                        <PrivateRoute exact path='/app/transfer/to-bank/confirm' {...this.props} authed={this.props.psbuser} component={ConfirmBankTransfer} />  
                        <PrivateRoute exact path='/app/transfer/to-bank/success' {...this.props} authed={this.props.psbuser} component={TransferToBankSuccess} />  
                        <PrivateRoute exact path='/app/transfer/to-bank/provide-details' {...this.props} authed={this.props.psbuser} component={BankTransferDetails} />  
                        <PrivateRoute exact path='/app/transfer/to-bank/confirm-new' {...this.props} authed={this.props.psbuser} component={ConfirmNewTransferToBank} />  
                        
                        <PrivateRoute exact path='/app/buy-airtime' {...this.props} authed={this.props.psbuser} component={BuyAirtime} />  
                        <PrivateRoute exact path='/app/buy-airtime/confirm' {...this.props} authed={this.props.psbuser} component={ConfirmAirtimeTopUp} />  
                        <PrivateRoute exact path='/app/buy-airtime/others' {...this.props} authed={this.props.psbuser} component={BuyAirtimeOthers} />  
                        <PrivateRoute exact path='/app/buy-airtime/others' {...this.props} authed={this.props.psbuser} component={BuyAirtimeOthers} />  
                        <PrivateRoute exact path='/app/buy-airtime/others/choose' {...this.props} authed={this.props.psbuser} component={ChooseTopUpOption} />  
                        <PrivateRoute exact path='/app/buy-airtime/others/confirm' {...this.props} authed={this.props.psbuser} component={ConfirmAirtimeOthersTopUp} />  
                        <PrivateRoute exact path='/app/buy-airtime/success' {...this.props} authed={this.props.psbuser} component={AirtimePurchaseSuccess} />  

                        
                        <PrivateRoute exact path='/app/buy-data' {...this.props} authed={this.props.psbuser} component={BuyData} />  
                        <PrivateRoute exact path='/app/buy-data/confirm' {...this.props} authed={this.props.psbuser} component={ConfirmDataTopUp} />  
                        <PrivateRoute exact path='/app/buy-data/others' {...this.props} authed={this.props.psbuser} component={BuyDataOthers} />  
                        <PrivateRoute exact path='/app/buy-data/others/choose' {...this.props} authed={this.props.psbuser} component={ChooseDataTopUpOption} />  
                        <PrivateRoute exact path='/app/buy-data/others/confirm' {...this.props} authed={this.props.psbuser} component={BuyDataOthersConfirm} />  
                        <PrivateRoute exact path='/app/buy-data/success' {...this.props} authed={this.props.psbuser} component={DataTopUpSuccess} />  

                        <PrivateRoute exact path='/app/pay-bills' {...this.props} authed={this.props.psbuser} component={PayBills} />  
                        <PrivateRoute exact path='/app/paybills/choose-biller/:billCategory' {...this.props} authed={this.props.psbuser} component={chooseBiller} />  
                        <PrivateRoute exact path='/app/pay-bills/:billCategory/provide-details' {...this.props} authed={this.props.psbuser} component={BillDetails} />  
                        <PrivateRoute exact path='/app/pay-bills/confirm' {...this.props} authed={this.props.psbuser} component={ConfirmBillPayment} />  
                        <PrivateRoute exact path='/app/pay-bills/success' {...this.props} authed={this.props.psbuser} component={BillPaymentSuccess} />  

                        <PrivateRoute exact path='/app/savings' {...this.props} authed={this.props.psbuser} component={GetAllSavings} />  
                        <PrivateRoute exact path='/app/savings/create' {...this.props} authed={this.props.psbuser} component={CreateSavings} />  
                        <PrivateRoute exact path='/app/savings/create/success' {...this.props} authed={this.props.psbuser} component={CreateSavingsSuccess} />  

                        <PrivateRoute exact path='/app/cards' {...this.props} authed={this.props.psbuser} component={ManageCards} />  
                        <PrivateRoute exact path='/app/cards/request-card' {...this.props} authed={this.props.psbuser} component={CardRequestDetails} />  
                        <PrivateRoute exact path='/app/cards/confirm' {...this.props} authed={this.props.psbuser} component={ConfirmCardRequest} />  
                        <PrivateRoute exact path='/app/cards/success' {...this.props} authed={this.props.psbuser} component={CardRequestSuccess} />  
                        
                        <PrivateRoute exact path='/app/account-settings' {...this.props} authed={this.props.psbuser} component={AccountSettings} />  
                        <PrivateRoute exact path='/app/account-settings/change-pin' {...this.props} authed={this.props.psbuser} component={ChangePin} />  
                        <PrivateRoute exact path='/app/account-settings/change-pin/success' {...this.props} authed={this.props.psbuser} component={PinChangeSuccess} />  

                        <PrivateRoute exact path='/app/account-settings/account-upgrade' {...this.props} authed={this.props.psbuser} component={ConfirmUpgradeDetails} />  
                        <PrivateRoute exact path='/app/account-settings/account-upgrade/otp' {...this.props} authed={this.props.psbuser} component={ValidateAccountUpgradeOtp} />  
                        <PrivateRoute exact path='/app/account-settings/account-upgrade/success' {...this.props} authed={this.props.psbuser} component={AccountUpgradeSuccess} />  
                        
                        <PrivateRoute exact path='/app/account-settings/reset-pin' {...this.props} authed={this.props.psbuser} component={InitateResetTxtPin} />  
                        <PrivateRoute exact path='/app/account-settings/reset-pin/newpin' {...this.props} authed={this.props.psbuser} component={NewTxtPin} />  
                        <PrivateRoute exact path='/app/account-settings/reset-pin/success' {...this.props} authed={this.props.psbuser} component={PinResetSuccess} />  
                        
                        <PrivateRoute exact path='/app/account-settings/change-password' {...this.props} authed={this.props.psbuser} component={ChangePassword} />  
                        <PrivateRoute exact path='/app/account-settings/change-password/success' {...this.props} authed={this.props.psbuser} component={PassChangeSuccess} />  
                        {/* <Route exact path='/app/dashboard' render={(props) => <Dashboard  />} />  */}
                    </Switch>
                   
                    </Router>
                </Fragment>

        )
    }
}
function mapStateToProps(state) {
    return {
        psbuser : state.onboardingReducers.LoginReducer
    };
}
const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(onboardingActions.Logout()),
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(AuthenticatedRoutes);
