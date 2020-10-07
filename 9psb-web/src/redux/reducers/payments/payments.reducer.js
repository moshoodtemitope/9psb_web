import {paymentsConstants} from '../../actiontypes/payments/payments.constants'

let user = JSON.parse(localStorage.getItem("psb-auth"));
const initialState = (user) ? { loggedIn: true, user } : {};


//MONEY TRANSFER
export function TransferMoneyToPhoneSTEP1Reducer(state=initialState, action) {
    
    switch (action.type) {
        case paymentsConstants.TRANSFER_TO_PHONE_STEP1_PENDING:
            return {
                request_status: paymentsConstants.TRANSFER_TO_PHONE_STEP1_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case paymentsConstants.TRANSFER_TO_PHONE_STEP1_SUCCESS:
            return {
                request_status: paymentsConstants.TRANSFER_TO_PHONE_STEP1_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case paymentsConstants.TRANSFER_TO_PHONE_STEP1_FAILURE:
            return {
                request_status: paymentsConstants.TRANSFER_TO_PHONE_STEP1_FAILURE,
                is_request_processing: false,
                request_data: action
            };

        case paymentsConstants.TRANSFER_TO_PHONE_STEP1_RESET:
            return {
                request_status: paymentsConstants.TRANSFER_TO_PHONE_STEP1_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function TransferMoneyToPhoneNumberReducer(state=initialState, action) {
    
    switch (action.type) {
        case paymentsConstants.TRANSFER_TO_PHONE_NUMBER_PENDING:
            return {
                request_status: paymentsConstants.TRANSFER_TO_PHONE_NUMBER_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case paymentsConstants.TRANSFER_TO_PHONE_NUMBER_SUCCESS:
            return {
                request_status: paymentsConstants.TRANSFER_TO_PHONE_NUMBER_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case paymentsConstants.TRANSFER_TO_PHONE_NUMBER_FAILURE:
            return {
                request_status: paymentsConstants.TRANSFER_TO_PHONE_NUMBER_FAILURE,
                is_request_processing: false,
                request_data: action
            };

        case paymentsConstants.TRANSFER_TO_PHONE_NUMBER_RESET:
            return {
                request_status: paymentsConstants.TRANSFER_TO_PHONE_NUMBER_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function GetTransferBeneficiariesReducer(state=initialState, action) {
    
    switch (action.type) {
        case paymentsConstants.GET_TRANSFER_BENEFICIARIES_PENDING:
            return {
                request_status: paymentsConstants.GET_TRANSFER_BENEFICIARIES_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case paymentsConstants.GET_TRANSFER_BENEFICIARIES_SUCCESS:
            return {
                request_status: paymentsConstants.GET_TRANSFER_BENEFICIARIES_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case paymentsConstants.GET_TRANSFER_BENEFICIARIES_FAILURE:
            return {
                request_status: paymentsConstants.GET_TRANSFER_BENEFICIARIES_FAILURE,
                is_request_processing: false,
                request_data: action
            };

        

        default:
            return { ...state }
    }
}

export function GetBanksReducer(state=initialState, action) {
    
    switch (action.type) {
        case paymentsConstants.GET_BANKS_PENDING:
            return {
                request_status: paymentsConstants.GET_BANKS_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case paymentsConstants.GET_BANKS_SUCCESS:
            return {
                request_status: paymentsConstants.GET_BANKS_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case paymentsConstants.GET_BANKS_FAILURE:
            return {
                request_status: paymentsConstants.GET_BANKS_FAILURE,
                is_request_processing: false,
                request_data: action
            };

        

        default:
            return { ...state }
    }
}

export function confirmBeneficiaryReducer(state=initialState, action) {
    
    switch (action.type) {
        case paymentsConstants.STORE_BENEFICIARY_DATA:
            return {
                request_status: paymentsConstants.STORE_BENEFICIARY_DATA,
                is_request_processing: false,
                request_data: action
            };
        case paymentsConstants.CONFIRM_ACCOUNT_PENDING:
            return {
                request_status: paymentsConstants.CONFIRM_ACCOUNT_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case paymentsConstants.CONFIRM_ACCOUNT_FAILURE:
            return {
                request_status: paymentsConstants.CONFIRM_ACCOUNT_FAILURE,
                is_request_processing: false,
                request_data: action
            };
        case paymentsConstants.CLEAR_STORED_BENEFICIARY_DATA:
            return {
                request_status: paymentsConstants.CLEAR_STORED_BENEFICIARY_DATA,
                request_data: {},
            };

        

        default:
            return { ...state }
    }
}

export function TranferToBankAccountReducer(state=initialState, action) {
    
    switch (action.type) {
        case paymentsConstants.TRANSFER_TO_BANK_PENDING:
            return {
                request_status: paymentsConstants.TRANSFER_TO_BANK_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case paymentsConstants.TRANSFER_TO_BANK_SUCCESS:
            return {
                request_status: paymentsConstants.TRANSFER_TO_BANK_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case paymentsConstants.TRANSFER_TO_BANK_FAILURE:
            return {
                request_status: paymentsConstants.TRANSFER_TO_BANK_FAILURE,
                is_request_processing: false,
                request_data: action
            };

        case paymentsConstants.TRANSFER_TO_BANK_RESET:
            return {
                request_status: paymentsConstants.TRANSFER_TO_BANK_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function saveRecipientInfoReducer(state=initialState, action) {
    
    switch (action.type) {
        case paymentsConstants.STORE_RECIPIENT_DATA:
            return {
                request_status: paymentsConstants.STORE_RECIPIENT_DATA,
                is_request_processing: false,
                request_data: action
            };
       
        case paymentsConstants.CLEAR_STORED_RECIPIENT_DATA:
            return {
                request_status: paymentsConstants.CLEAR_STORED_RECIPIENT_DATA,
                request_data: {},
            };

        

        default:
            return { ...state }
    }
}


//CASH WITHDRAWAL
export function CardlessWithdrawalStep1Reducer(state=initialState, action) {
    
    switch (action.type) {
        case paymentsConstants.CARDLESS_WITHDRAWAL_STEP1_PENDING:
            return {
                request_status: paymentsConstants.CARDLESS_WITHDRAWAL_STEP1_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case paymentsConstants.CARDLESS_WITHDRAWAL_STEP1_SUCCESS:
            return {
                request_status: paymentsConstants.CARDLESS_WITHDRAWAL_STEP1_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case paymentsConstants.CARDLESS_WITHDRAWAL_STEP1_FAILURE:
            return {
                request_status: paymentsConstants.CARDLESS_WITHDRAWAL_STEP1_FAILURE,
                is_request_processing: false,
                request_data: action
            };

        case paymentsConstants.CARDLESS_WITHDRAWAL_STEP1_RESET:
            return {
                request_status: paymentsConstants.CARDLESS_WITHDRAWAL_STEP1_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function CardlessWithdrawalStep2Reducer(state=initialState, action) {
    
    switch (action.type) {
        case paymentsConstants.CARDLESS_WITHDRAWAL_STEP2_PENDING:
            return {
                request_status: paymentsConstants.CARDLESS_WITHDRAWAL_STEP2_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case paymentsConstants.CARDLESS_WITHDRAWAL_STEP2_SUCCESS:
            return {
                request_status: paymentsConstants.CARDLESS_WITHDRAWAL_STEP2_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case paymentsConstants.CARDLESS_WITHDRAWAL_STEP2_FAILURE:
            return {
                request_status: paymentsConstants.CARDLESS_WITHDRAWAL_STEP2_FAILURE,
                is_request_processing: false,
                request_data: action
            };

        case paymentsConstants.CARDLESS_WITHDRAWAL_STEP2_RESET:
            return {
                request_status: paymentsConstants.CARDLESS_WITHDRAWAL_STEP2_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function AgentWithdrawalStep1Reducer(state=initialState, action) {
    
    switch (action.type) {
        case paymentsConstants.AGENT_WITHDRAWAL_STEP1_PENDING:
            return {
                request_status: paymentsConstants.AGENT_WITHDRAWAL_STEP1_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case paymentsConstants.AGENT_WITHDRAWAL_STEP1_SUCCESS:
            return {
                request_status: paymentsConstants.AGENT_WITHDRAWAL_STEP1_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case paymentsConstants.AGENT_WITHDRAWAL_STEP1_FAILURE:
            return {
                request_status: paymentsConstants.AGENT_WITHDRAWAL_STEP1_FAILURE,
                is_request_processing: false,
                request_data: action
            };

        case paymentsConstants.AGENT_WITHDRAWAL_STEP1_RESET:
            return {
                request_status: paymentsConstants.AGENT_WITHDRAWAL_STEP1_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function AgentWithdrawalStep2Reducer(state=initialState, action) {
    
    switch (action.type) {
        case paymentsConstants.AGENT_WITHDRAWAL_STEP2_PENDING:
            return {
                request_status: paymentsConstants.AGENT_WITHDRAWAL_STEP2_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case paymentsConstants.AGENT_WITHDRAWAL_STEP2_SUCCESS:
            return {
                request_status: paymentsConstants.AGENT_WITHDRAWAL_STEP2_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case paymentsConstants.AGENT_WITHDRAWAL_STEP2_FAILURE:
            return {
                request_status: paymentsConstants.AGENT_WITHDRAWAL_STEP2_FAILURE,
                is_request_processing: false,
                request_data: action
            };

        case paymentsConstants.AGENT_WITHDRAWAL_STEP2_RESET:
            return {
                request_status: paymentsConstants.AGENT_WITHDRAWAL_STEP2_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function GetAgentsReducer(state=initialState, action) {
    
    switch (action.type) {
        case paymentsConstants.GET_AGENTS_PENDING:
            return {
                request_status: paymentsConstants.GET_AGENTS_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case paymentsConstants.GET_AGENTS_SUCCESS:
            return {
                request_status: paymentsConstants.GET_AGENTS_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case paymentsConstants.GET_AGENTS_FAILURE:
            return {
                request_status: paymentsConstants.GET_AGENTS_FAILURE,
                is_request_processing: false,
                request_data: action
            };

        case paymentsConstants.GET_AGENTS_RESET:
            return {
                request_status: paymentsConstants.GET_AGENTS_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}


//AIRTIME TOPUP
export function GetAirtimeBeneficiariesReducer(state=initialState, action) {
    
    switch (action.type) {
        case paymentsConstants.FETCH_AIRTIME_BENEFICIARIES_PENDING:
            return {
                request_status: paymentsConstants.FETCH_AIRTIME_BENEFICIARIES_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case paymentsConstants.FETCH_AIRTIME_BENEFICIARIES_SUCCESS:
            return {
                request_status: paymentsConstants.FETCH_AIRTIME_BENEFICIARIES_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case paymentsConstants.FETCH_AIRTIME_BENEFICIARIES_FAILURE:
            return {
                request_status: paymentsConstants.FETCH_AIRTIME_BENEFICIARIES_FAILURE,
                is_request_processing: false,
                request_data: action
            };

        case paymentsConstants.FETCH_AIRTIME_BENEFICIARIES_RESET:
            return {
                request_status: paymentsConstants.FETCH_AIRTIME_BENEFICIARIES_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function AddAirtimeBeneficiaryReducer(state=initialState, action) {
    
    switch (action.type) {
        case paymentsConstants.SAVE_AIRTIME_BENEFICIARY_PENDING:
            return {
                request_status: paymentsConstants.SAVE_AIRTIME_BENEFICIARY_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case paymentsConstants.SAVE_AIRTIME_BENEFICIARY_SUCCESS:
            return {
                request_status: paymentsConstants.SAVE_AIRTIME_BENEFICIARY_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case paymentsConstants.SAVE_AIRTIME_BENEFICIARY_FAILURE:
            return {
                request_status: paymentsConstants.SAVE_AIRTIME_BENEFICIARY_FAILURE,
                is_request_processing: false,
                request_data: action
            };

        case paymentsConstants.SAVE_AIRTIME_BENEFICIARY_RESET:
            return {
                request_status: paymentsConstants.SAVE_AIRTIME_BENEFICIARY_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function DeleteAirtimeBeneficiaryReducer(state=initialState, action) {
    
    switch (action.type) {
        case paymentsConstants.DELETE_AIRTIME_BENEFICIARY_PENDING:
            return {
                request_status: paymentsConstants.DELETE_AIRTIME_BENEFICIARY_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case paymentsConstants.DELETE_AIRTIME_BENEFICIARY_SUCCESS:
            return {
                request_status: paymentsConstants.DELETE_AIRTIME_BENEFICIARY_SUCCESS,
                completed: true,
                is_request_processing: false,
                request_data: action
            };
        case paymentsConstants.DELETE_AIRTIME_BENEFICIARY_FAILURE:
            return {
                request_status: paymentsConstants.DELETE_AIRTIME_BENEFICIARY_FAILURE,
                is_request_processing: false,
                request_data: action
            };

        case paymentsConstants.DELETE_AIRTIME_BENEFICIARY_RESET:
            return {
                request_status: paymentsConstants.DELETE_AIRTIME_BENEFICIARY_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function AirtimeTopUpReducer(state=initialState, action) {
    
    switch (action.type) {
        case paymentsConstants.BUY_AIRTIME_PENDING:
            return {
                request_status: paymentsConstants.BUY_AIRTIME_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case paymentsConstants.BUY_AIRTIME_SUCCESS:
            return {
                request_status: paymentsConstants.BUY_AIRTIME_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case paymentsConstants.BUY_AIRTIME_FAILURE:
            return {
                request_status: paymentsConstants.BUY_AIRTIME_FAILURE,
                is_request_processing: false,
                request_data: action
            };

        case paymentsConstants.BUY_AIRTIME_RESET:
            return {
                request_status: paymentsConstants.BUY_AIRTIME_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function saveAirtimeRecipientDataReducer(state=initialState, action) {
    
    switch (action.type) {
        case paymentsConstants.STORE_AIRTIME_RECIPIENT_DATA:
            return {
                request_status: paymentsConstants.STORE_AIRTIME_RECIPIENT_DATA,
                is_request_processing: false,
                request_data: action
            };
       
        case paymentsConstants.CLEAR_STORED_AIRTIME_RECIPIENT_DATA:
            return {
                request_status: paymentsConstants.CLEAR_STORED_AIRTIME_RECIPIENT_DATA,
                request_data: {},
            };

        

        default:
            return { ...state }
    }
}


//DATA TOPUP

export function GetDataTopUpPlansReducer(state=initialState, action) {
    
    switch (action.type) {
        case paymentsConstants.FETCH_DATATOPUP_PLANS_PENDING:
            return {
                request_status: paymentsConstants.FETCH_DATATOPUP_PLANS_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case paymentsConstants.FETCH_DATATOPUP_PLANS_SUCCESS:
            return {
                request_status: paymentsConstants.FETCH_DATATOPUP_PLANS_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case paymentsConstants.FETCH_DATATOPUP_PLANS_FAILURE:
            return {
                request_status: paymentsConstants.FETCH_DATATOPUP_PLANS_FAILURE,
                is_request_processing: false,
                request_data: action
            };

        case paymentsConstants.FETCH_DATATOPUP_PLANS_RESET:
            return {
                request_status: paymentsConstants.FETCH_DATATOPUP_PLANS_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function GetDataTopUpBeneficiariesReducer(state=initialState, action) {
    
    switch (action.type) {
        case paymentsConstants.FETCH_DATATOPUP_BENEFICIARIES_PENDING:
            return {
                request_status: paymentsConstants.FETCH_DATATOPUP_BENEFICIARIES_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case paymentsConstants.FETCH_DATATOPUP_BENEFICIARIES_SUCCESS:
            return {
                request_status: paymentsConstants.FETCH_DATATOPUP_BENEFICIARIES_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case paymentsConstants.FETCH_DATATOPUP_BENEFICIARIES_FAILURE:
            return {
                request_status: paymentsConstants.FETCH_DATATOPUP_BENEFICIARIES_FAILURE,
                is_request_processing: false,
                request_data: action
            };

        case paymentsConstants.FETCH_DATATOPUP_BENEFICIARIES_RESET:
            return {
                request_status: paymentsConstants.FETCH_DATATOPUP_BENEFICIARIES_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function AddDataTopUpBeneficiaryReducer(state=initialState, action) {
    
    switch (action.type) {
        case paymentsConstants.SAVE_DATATOPUP_BENEFICIARY_PENDING:
            return {
                request_status: paymentsConstants.SAVE_DATATOPUP_BENEFICIARY_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case paymentsConstants.SAVE_DATATOPUP_BENEFICIARY_SUCCESS:
            return {
                request_status: paymentsConstants.SAVE_DATATOPUP_BENEFICIARY_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case paymentsConstants.SAVE_DATATOPUP_BENEFICIARY_FAILURE:
            return {
                request_status: paymentsConstants.SAVE_DATATOPUP_BENEFICIARY_FAILURE,
                is_request_processing: false,
                request_data: action
            };

        case paymentsConstants.SAVE_DATATOPUP_BENEFICIARY_RESET:
            return {
                request_status: paymentsConstants.SAVE_DATATOPUP_BENEFICIARY_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function DeleteDataTopUpBeneficiaryReducer(state=initialState, action) {
    
    switch (action.type) {
        case paymentsConstants.DELETE_DATATOPUP_BENEFICIARY_PENDING:
            return {
                request_status: paymentsConstants.DELETE_DATATOPUP_BENEFICIARY_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case paymentsConstants.DELETE_DATATOPUP_BENEFICIARY_SUCCESS:
            return {
                request_status: paymentsConstants.DELETE_DATATOPUP_BENEFICIARY_SUCCESS,
                completed: true,
                is_request_processing: false,
                request_data: action
            };
        case paymentsConstants.DELETE_DATATOPUP_BENEFICIARY_FAILURE:
            return {
                request_status: paymentsConstants.DELETE_DATATOPUP_BENEFICIARY_FAILURE,
                is_request_processing: false,
                request_data: action
            };

        case paymentsConstants.DELETE_DATATOPUP_BENEFICIARY_RESET:
            return {
                request_status: paymentsConstants.DELETE_DATATOPUP_BENEFICIARY_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function DataTopUpTopUpReducer(state=initialState, action) {
    
    switch (action.type) {
        case paymentsConstants.BUY_DATATOPUP_PENDING:
            return {
                request_status: paymentsConstants.BUY_DATATOPUP_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case paymentsConstants.BUY_DATATOPUP_SUCCESS:
            return {
                request_status: paymentsConstants.BUY_DATATOPUP_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case paymentsConstants.BUY_DATATOPUP_FAILURE:
            return {
                request_status: paymentsConstants.BUY_DATATOPUP_FAILURE,
                is_request_processing: false,
                request_data: action
            };

        case paymentsConstants.BUY_DATATOPUP_RESET:
            return {
                request_status: paymentsConstants.BUY_DATATOPUP_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function saveDataTopUpRecipientDataReducer(state=initialState, action) {
    
    switch (action.type) {
        case paymentsConstants.STORE_DATATOPUP_RECIPIENT_DATA:
            return {
                request_status: paymentsConstants.STORE_DATATOPUP_RECIPIENT_DATA,
                is_request_processing: false,
                request_data: action
            };
       
        case paymentsConstants.CLEAR_STORED_DATATOPUP_RECIPIENT_DATA:
            return {
                request_status: paymentsConstants.CLEAR_STORED_DATATOPUP_RECIPIENT_DATA,
                request_data: {},
            };

        

        default:
            return { ...state }
    }
}


//BILLS PAYMENT
export function GetBillsCategoriesReducer(state=initialState, action) {
    
    switch (action.type) {
        case paymentsConstants.GET_BILLS_CATEGORIES_PENDING:
            return {
                request_status: paymentsConstants.GET_BILLS_CATEGORIES_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case paymentsConstants.GET_BILLS_CATEGORIES_SUCCESS:
            return {
                request_status: paymentsConstants.GET_BILLS_CATEGORIES_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case paymentsConstants.GET_BILLS_CATEGORIES_FAILURE:
            return {
                request_status: paymentsConstants.GET_BILLS_CATEGORIES_FAILURE,
                is_request_processing: false,
                request_data: action
            };

        case paymentsConstants.GET_BILLS_CATEGORIES_RESET:
            return {
                request_status: paymentsConstants.GET_BILLS_CATEGORIES_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function GetBillersByCategoryReducer(state=initialState, action) {
    
    switch (action.type) {
        case paymentsConstants.GET_BILLERS_BY_CATEGORY_PENDING:
            return {
                request_status: paymentsConstants.GET_BILLERS_BY_CATEGORY_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case paymentsConstants.GET_BILLERS_BY_CATEGORY_SUCCESS:
            return {
                request_status: paymentsConstants.GET_BILLERS_BY_CATEGORY_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case paymentsConstants.GET_BILLERS_BY_CATEGORY_FAILURE:
            return {
                request_status: paymentsConstants.GET_BILLERS_BY_CATEGORY_FAILURE,
                is_request_processing: false,
                request_data: action
            };

        case paymentsConstants.GET_BILLERS_BY_CATEGORY_RESET:
            return {
                request_status: paymentsConstants.GET_BILLERS_BY_CATEGORY_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function GetAllBillerPaymentItemReducer(state=initialState, action) {
    
    switch (action.type) {
        case paymentsConstants.GET_ALLBILLER_PAYMENT_ITEM_PENDING:
            return {
                request_status: paymentsConstants.GET_ALLBILLER_PAYMENT_ITEM_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case paymentsConstants.GET_ALLBILLER_PAYMENT_ITEM_SUCCESS:
            return {
                request_status: paymentsConstants.GET_ALLBILLER_PAYMENT_ITEM_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case paymentsConstants.GET_ALLBILLER_PAYMENT_ITEM_FAILURE:
            return {
                request_status: paymentsConstants.GET_ALLBILLER_PAYMENT_ITEM_FAILURE,
                is_request_processing: false,
                request_data: action
            };

        case paymentsConstants.GET_ALLBILLER_PAYMENT_ITEM_RESET:
            return {
                request_status: paymentsConstants.GET_ALLBILLER_PAYMENT_ITEM_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function validateCustomerForBillPaymentReducer(state=initialState, action) {
    
    switch (action.type) {
        case paymentsConstants.VALIDATE_CUSTOMER_FOR_BILL_PENDING:
            return {
                request_status: paymentsConstants.VALIDATE_CUSTOMER_FOR_BILL_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case paymentsConstants.VALIDATE_CUSTOMER_FOR_BILL_SUCCESS:
            return {
                request_status: paymentsConstants.VALIDATE_CUSTOMER_FOR_BILL_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case paymentsConstants.VALIDATE_CUSTOMER_FOR_BILL_FAILURE:
            return {
                request_status: paymentsConstants.VALIDATE_CUSTOMER_FOR_BILL_FAILURE,
                is_request_processing: false,
                request_data: action
            };

        case paymentsConstants.VALIDATE_CUSTOMER_FOR_BILL_RESET:
            return {
                request_status: paymentsConstants.VALIDATE_CUSTOMER_FOR_BILL_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function makeCustomerPaymentForBillReducer(state=initialState, action) {
    
    switch (action.type) {
        case paymentsConstants.PAY_FOR_BILL_PENDING:
            return {
                request_status: paymentsConstants.PAY_FOR_BILL_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case paymentsConstants.PAY_FOR_BILL_SUCCESS:
            return {
                request_status: paymentsConstants.PAY_FOR_BILL_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case paymentsConstants.PAY_FOR_BILL_FAILURE:
            return {
                request_status: paymentsConstants.PAY_FOR_BILL_FAILURE,
                is_request_processing: false,
                request_data: action
            };

        case paymentsConstants.PAY_FOR_BILL_RESET:
            return {
                request_status: paymentsConstants.PAY_FOR_BILL_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}