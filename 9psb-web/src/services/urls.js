
// const URL = 'http://52.170.209.118';
const URL = 'http://40.76.69.211/';
// const URL = 'http://102.164.38.19';

const BASEURL = URL;  

export const routes = {
    BASEURL: BASEURL,
    // Identity endpoints
    LOGIN_URL: BASEURL + 'Onboarding/api/Identity/login',
    // LOGIN_URL: 'http://102.164.38.19/Onboarding/api/Identity/login',
    
    REFRESH_TOKEN: BASEURL + 'Onboarding/api/Identity/refreshtoken',

    UPDATE_CUSTOMER_PROFILE: BASEURL + 'Onboarding/api/Identity/updateuserprofile',
    GET_CUSTOMER_PROFILE: BASEURL + 'Onboarding/api/Identity/profile',
    UPLOAD_PROFILE_PIX: BASEURL + 'Onboarding/api/FileUpload/uploadfile',
    GET_PROFILE_PIX: BASEURL + 'Onboarding/api/FileUpload/profilepicture',
    
    //Cards
    CHARGE_CARD: BASEURL + 'Loans/api/Card/chargecard',
    VALIDATE_CARD: BASEURL + 'Loans/api/Card/validatecard',
    QUERY_CARDVALIDATION_STATUS: BASEURL + 'Loans/api/Card/updatecardvbv',

    //File Uploads
    UPLOAD_CUSTOMER_PROFILE_IMG: BASEURL + 'Onboarding/api/FileUpload/uploadfile',
    // Onboarding endpoints
    CHECK_EXISTING_USER: BASEURL + 'Onboarding/api/App/checkifuserexists',
    CREATE_ACCOUNT: BASEURL + 'Onboarding/api/App/createaccount',
    VALIDATE_OTP: BASEURL + 'Onboarding/api/App/validateotp',
    RESEND_OTP: BASEURL + 'Onboarding/api/App/resendotp',

    //Password Reset
    INITIATE_PASSWORD_RESET: BASEURL + 'Onboarding/api/Identity/initiatePasswordReset',
    COMPLETE_PASSWORD_RESET: BASEURL + 'Onboarding/api/App/completepasswordreset',
    CHANGE_PASSWORD: BASEURL + 'Onboarding/api/Identity/changepassword',

    //Security Question
    GET_SECURITY_QUESTIONS: BASEURL + 'WalletManager/api/Customer/questions',
    GET_PROFILE_SECURITY_QUESTION: BASEURL + 'WalletManager/api/Customer/profilequestion',

    //Set Pin
    CREATE_TRANSACTION_PIN: BASEURL + 'WalletManager/api/Customer/createpin',
    INITIATE_RESET_TRANSACTION_PIN: BASEURL + 'WalletManager/api/Customer/initiatePinReset',
    COMPLETE_RESET_TRANSACTION_PIN: BASEURL + 'WalletManager/api/Customer/completepinreset',
    CHANGE_PIN: BASEURL + 'WalletManager/api/Customer/changepin',

    //Agents
    GET_STATES: BASEURL + 'AgentManager/api/Main/states',
    GET_LGAS: BASEURL + 'AgentManager/api/Main/localgovernments',
    GET_AGENTS: BASEURL + 'AgentManager/api/Main/agents',


    //Customer Apis,

    GET_ACCOUNTS: BASEURL + 'WalletManager/api/Customer/accounts',
    TRANSACTION_HISTORY: BASEURL + 'WalletManager/api/Customer/transactionhistory',
    WALLET_HISTORY: BASEURL + 'WalletManager/api/Customer/wallethistory',

    //Transfers Apis
    DEPOSIT_CASH_USING_AGENT: BASEURL + 'Transfers/api/Customer/depositusingagent',
    TRANSFER_TO_PHONE_NUMBER: BASEURL + 'Transfers/api/Customer/transfertophonenumber',
    CONFIRM_ACCOUNT_WITH_PHONE: BASEURL + 'Transfers/api/Customer/confirmaccountwithphone',
    SAVE_TRANSFER_BENEFICIARY: BASEURL + 'Transfers/api/Customer/addbeneficiary',
    GET_TRANSFER_BENEFICIARIES: BASEURL + 'Transfers/api/Customer/beneficiaries',
    GET_BANKS: BASEURL + 'Transfers/api/Customer/banks',
    CONFIRM_ACCOUNT: BASEURL + 'Transfers/api/Customer/confirmaccount',
    TRANSFER_TO_ACCOUNT: BASEURL + 'Transfers/api/Customer/transfertoaccount',

    //Withdrawals

    CARDLESS_WITHDRAWAL: BASEURL + 'Transfers/api/Customer/transfertoatm',
    AGENT_WITHDRAWAL: BASEURL + 'Transfers/api/Customer/transfertoagent',

    //Airtime
    AIRTIME_RECHARGE: BASEURL + 'AirtimeRecharge/api/Customer/recharge',
    ADD_AIRTIME_BENEFICIARY: BASEURL + 'AirtimeRecharge/api/Customer/addbeneficiary',
    DELETE_AIRTIME_BENEFICIARY: BASEURL + 'AirtimeRecharge/api/Customer/deletebeneficiary',
    GET_AIRTIME_BENEFICIARIES: BASEURL + 'AirtimeRecharge/api/Customer/beneficiaries',

    //DATA
    DATA_TOPUP: BASEURL + 'DataRecharge/api/Customer/recharge',
    ADD_DATA_TOPUP_BENEFICIARY: BASEURL + 'DataRecharge/api/Customer/addbeneficiary',
    DELETE_DATA_TOPUP_BENEFICIARY: BASEURL + 'DataRecharge/api/Customer/deletebeneficiary',
    GET_DATA_TOPUP_BENEFICIARIES: BASEURL + 'DataRecharge/api/Customer/beneficiaries',
    GET_DATA_TOPUP_PLANS: BASEURL + 'DataRecharge/api/Customer/plans',

    //BILLS
    GET_BILLS_CATEGORIES: BASEURL + 'BillsPayment/api/App/getbillcategories',
    GET_BILLER_BY_CATEGORY: BASEURL + 'BillsPayment/api/App/getbillersbycategory',
    GET_BILLER_PAYMENT_ITEM: BASEURL + 'BillsPayment/api/App/getallbillerpaymentitem',
    VALIDATE_CUSTOMER: BASEURL + 'BillsPayment/api/App/validatecustomer',
    PAY_FOR_BILL: BASEURL + 'BillsPayment/api/App/paybill',
}