import {combineReducers} from "redux";
import { 
    onboarding,
    accounts,
    payments
    } from "./export";
    import { onboardingConstants } from "../actiontypes/onboarding/onboarding.constants";


const rootReducer = (state, action)=>{
   
    if(action.type === onboardingConstants.LOGOUT)
        { 
            state = undefined;   
        }
    return appReducer(state, action)

};





const onboardingReducers = combineReducers({
    LoginReducer: onboarding.LoginReducer, 
    CheckIfCustomerExistsReducer: onboarding.CheckIfCustomerExistsReducer, 
    CreateAccountStep1Reducer: onboarding.CreateAccountStep1Reducer, 
    ValidateRegOtpReducer: onboarding.ValidateRegOtpReducer, 
    ResendRegOtpReducer: onboarding.ResendRegOtpReducer, 
    UpdateCustomerDetailsReducer: onboarding.UpdateCustomerDetailsReducer, 
    UploadAFileReducer: onboarding.UploadAFileReducer, 
    InititatePasswordResetReducer: onboarding.InititatePasswordResetReducer, 
    CompletePasswordResetReducer: onboarding.CompletePasswordResetReducer, 
    ChangePasswordReducer: onboarding.ChangePasswordReducer, 
    GetSecurityQuestionsReducer: onboarding.GetSecurityQuestionsReducer, 
    CreateTransactionPinReducer: onboarding.CreateTransactionPinReducer, 
    ChangeTransactionPinReducer: onboarding.ChangeTransactionPinReducer, 
    InitiatePinResetReducer: onboarding.InitiatePinResetReducer, 
    CompletePinResetReducer: onboarding.CompletePinResetReducer, 
    GetAllStatesReducer: onboarding.GetAllStatesReducer, 
    GetLgasReducer: onboarding.GetLgasReducer, 
    // ValidateBusinessNameReducer: auth.ValidateBusinessNameReducer, 
    // RegBusinessReducer: auth.RegBusinessReducer, 
    // forgotPasswordReducer: auth.forgotPasswordReducer, 
    // setNewPasswordReducer: auth.setNewPasswordReducer, 
   
})


const accountsReducers = combineReducers({
    GetCustomerAccountsReducer: accounts.GetCustomerAccountsReducer, 
    GetTransactionHistoryReducer: accounts.GetTransactionHistoryReducer, 
    GetCustomerDashboardDataReducer: accounts.GetCustomerDashboardDataReducer, 
    DepositCashWithAgentReducer: accounts.DepositCashWithAgentReducer, 
    LocateAnAgentReducer: accounts.LocateAnAgentReducer, 
    ValidateACardReducer: accounts.ValidateACardReducer, 
    ChargeACardReducer: accounts.ChargeACardReducer, 
    QueryCardValidationStateReducer: accounts.QueryCardValidationStateReducer, 
   
})

const paymentsReducers = combineReducers({
    TransferMoneyToPhoneNumberReducer: payments.TransferMoneyToPhoneNumberReducer,
    TransferMoneyToPhoneSTEP1Reducer: payments.TransferMoneyToPhoneSTEP1Reducer,
    GetTransferBeneficiariesReducer: payments.GetTransferBeneficiariesReducer,
    GetBanksReducer: payments.GetBanksReducer,
    confirmBeneficiaryReducer: payments.confirmBeneficiaryReducer,
    saveRecipientInfoReducer: payments.saveRecipientInfoReducer,
    TranferToBankAccountReducer: payments.TranferToBankAccountReducer,


    CardlessWithdrawalStep1Reducer: payments.CardlessWithdrawalStep1Reducer,
    CardlessWithdrawalStep2Reducer: payments.CardlessWithdrawalStep2Reducer,

    AgentWithdrawalStep1Reducer: payments.AgentWithdrawalStep1Reducer,
    AgentWithdrawalStep2Reducer: payments.AgentWithdrawalStep2Reducer,

    GetAgentsReducer: payments.GetAgentsReducer,


    
    GetAirtimeBeneficiariesReducer: payments.GetAirtimeBeneficiariesReducer,
    AddAirtimeBeneficiaryReducer: payments.AddAirtimeBeneficiaryReducer,
    DeleteAirtimeBeneficiaryReducer: payments.DeleteAirtimeBeneficiaryReducer,
    AirtimeTopUpReducer: payments.AirtimeTopUpReducer,
    saveAirtimeRecipientDataReducer: payments.saveAirtimeRecipientDataReducer,



    GetDataTopUpBeneficiariesReducer: payments.GetDataTopUpBeneficiariesReducer,
    AddDataTopUpBeneficiaryReducer: payments.AddDataTopUpBeneficiaryReducer,
    DeleteDataTopUpBeneficiaryReducer: payments.DeleteDataTopUpBeneficiaryReducer,
    DataTopUpTopUpReducer: payments.DataTopUpTopUpReducer,
    saveDataTopUpRecipientDataReducer: payments.saveDataTopUpRecipientDataReducer,
    GetDataTopUpPlansReducer: payments.GetDataTopUpPlansReducer,
    
    
    
    GetBillsCategoriesReducer: payments.GetBillsCategoriesReducer,
    GetBillersByCategoryReducer: payments.GetBillersByCategoryReducer,
    GetAllBillerPaymentItemReducer: payments.GetAllBillerPaymentItemReducer,
    validateCustomerForBillPaymentReducer: payments.validateCustomerForBillPaymentReducer,
    makeCustomerPaymentForBillReducer: payments.makeCustomerPaymentForBillReducer,
   


})










const appReducer = combineReducers({
   
    onboardingReducers,
    accountsReducers,
    paymentsReducers
})



export default rootReducer;