




import{
    LoginReducer,
    CheckIfCustomerExistsReducer,
    CreateAccountStep1Reducer,
    ValidateRegOtpReducer,
    ResendRegOtpReducer,
    UpdateCustomerDetailsReducer,
    UploadAFileReducer,
    InititatePasswordResetReducer,
    CompletePasswordResetReducer,
    ChangePasswordReducer,
    GetSecurityQuestionsReducer,
    CreateTransactionPinReducer,
    ChangeTransactionPinReducer,
    InitiatePinResetReducer,
    CompletePinResetReducer,
    GetAllStatesReducer,
    GetLgasReducer,
    UpgradeFetchDetailsReducer,
    UpgradeSendDetailsReducer,
    UpgradeValidateOtpReducer,
    UpgradeCompletionReducer
} from './onboarding/onboarding.reducer'


import{
    GetCustomerAccountsReducer,
    GetTransactionHistoryReducer,
    GetCustomerDashboardDataReducer,
    LocateAnAgentReducer,
    DepositCashWithAgentReducer,
    ChargeACardReducer,
    ValidateACardReducer,
    QueryCardValidationStateReducer
} from './dashboard/dashboard.reducer'

import{
    TransferMoneyToPhoneNumberReducer,
    TransferMoneyToPhoneSTEP1Reducer,
    GetTransferBeneficiariesReducer,
    GetBanksReducer,
    confirmBeneficiaryReducer,
    saveRecipientInfoReducer,
    TranferToBankAccountReducer,

    AgentWithdrawalStep2Reducer,
    AgentWithdrawalStep1Reducer,

    CardlessWithdrawalStep2Reducer,
    CardlessWithdrawalStep1Reducer,

    GetAgentsReducer,

    GetAirtimeBeneficiariesReducer,
    AddAirtimeBeneficiaryReducer,
    DeleteAirtimeBeneficiaryReducer,
    AirtimeTopUpReducer,
    saveAirtimeRecipientDataReducer,

    GetDataTopUpPlansReducer,
    GetDataTopUpBeneficiariesReducer,
    AddDataTopUpBeneficiaryReducer,
    DeleteDataTopUpBeneficiaryReducer,
    DataTopUpTopUpReducer,
    saveDataTopUpRecipientDataReducer,


    GetBillsCategoriesReducer,
    GetBillersByCategoryReducer,
    GetAllBillerPaymentItemReducer,
    validateCustomerForBillPaymentReducer,
    makeCustomerPaymentForBillReducer,

    GetSavingsInterestReducer,
    CreateSavingsReducer,
    GetSavingsReducer,
    CashoutSavingsReducer,
    CheckSavingsCashoutReducer
} from './payments/payments.reducer'





export const onboarding = {
    LoginReducer,
    CheckIfCustomerExistsReducer,
    CreateAccountStep1Reducer,
    ValidateRegOtpReducer,
    ResendRegOtpReducer,
    UpdateCustomerDetailsReducer,
    UploadAFileReducer,
    InititatePasswordResetReducer,
    CompletePasswordResetReducer,
    ChangePasswordReducer,
    GetSecurityQuestionsReducer,
    CreateTransactionPinReducer,
    ChangeTransactionPinReducer,
    InitiatePinResetReducer,
    CompletePinResetReducer,
    GetAllStatesReducer,
    GetLgasReducer,
    UpgradeFetchDetailsReducer,
    UpgradeSendDetailsReducer,
    UpgradeValidateOtpReducer,
    UpgradeCompletionReducer
    // ValidateBusinessNameReducer,
    // RegBusinessReducer,
    // forgotPasswordReducer,
    // setNewPasswordReducer
}



export const accounts ={
    GetCustomerAccountsReducer,
    GetTransactionHistoryReducer,
    GetCustomerDashboardDataReducer,
    LocateAnAgentReducer,
    DepositCashWithAgentReducer,
    ChargeACardReducer,
    ValidateACardReducer,
    QueryCardValidationStateReducer
}

export const payments ={
    TransferMoneyToPhoneNumberReducer,
    TransferMoneyToPhoneSTEP1Reducer,
    GetTransferBeneficiariesReducer,
    GetBanksReducer,
    confirmBeneficiaryReducer,
    saveRecipientInfoReducer,
    TranferToBankAccountReducer,

    AgentWithdrawalStep2Reducer,
    AgentWithdrawalStep1Reducer,

    CardlessWithdrawalStep2Reducer,
    CardlessWithdrawalStep1Reducer,

    GetAgentsReducer,

    GetAirtimeBeneficiariesReducer,
    AddAirtimeBeneficiaryReducer,
    DeleteAirtimeBeneficiaryReducer,
    AirtimeTopUpReducer,
    saveAirtimeRecipientDataReducer,

    GetDataTopUpPlansReducer,
    GetDataTopUpBeneficiariesReducer,
    AddDataTopUpBeneficiaryReducer,
    DeleteDataTopUpBeneficiaryReducer,
    DataTopUpTopUpReducer,
    saveDataTopUpRecipientDataReducer,


    GetBillsCategoriesReducer,
    GetBillersByCategoryReducer,
    GetAllBillerPaymentItemReducer,
    validateCustomerForBillPaymentReducer,
    makeCustomerPaymentForBillReducer,

    GetSavingsInterestReducer,
    CreateSavingsReducer,
    GetSavingsReducer,
    CashoutSavingsReducer,
    CheckSavingsCashoutReducer
}
