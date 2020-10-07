import {dashboardConstants} from '../../actiontypes/dashboard/dashboard.constants'

let user = JSON.parse(localStorage.getItem("psb-auth"));
const initialState = (user) ? { loggedIn: true, user } : {};

export function GetCustomerDashboardDataReducer(state=initialState, action) {
    
    switch (action.type) {
        case dashboardConstants.GET_CUSTOMER_DASHBOARDDATA_PENDING:
            return {
                request_status: dashboardConstants.GET_CUSTOMER_DASHBOARDDATA_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case dashboardConstants.GET_CUSTOMER_DASHBOARDDATA_SUCCESS:
            return {
                request_status: dashboardConstants.GET_CUSTOMER_DASHBOARDDATA_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case dashboardConstants.GET_CUSTOMER_DASHBOARDDATA_FAILURE:
            return {
                request_status: dashboardConstants.GET_CUSTOMER_DASHBOARDDATA_FAILURE,
                is_request_processing: false,
                request_data: action
            };

        default:
            return { ...state }
    }
}

export function GetCustomerAccountsReducer(state=initialState, action) {
    
    switch (action.type) {
        case dashboardConstants.GET_CUSTOMER_ACCOUNTS_PENDING:
            return {
                request_status: dashboardConstants.GET_CUSTOMER_ACCOUNTS_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case dashboardConstants.GET_CUSTOMER_ACCOUNTS_SUCCESS:
            return {
                request_status: dashboardConstants.GET_CUSTOMER_ACCOUNTS_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case dashboardConstants.GET_CUSTOMER_ACCOUNTS_FAILURE:
            return {
                request_status: dashboardConstants.GET_CUSTOMER_ACCOUNTS_FAILURE,
                is_request_processing: false,
                request_data: action
            };
        case dashboardConstants.GET_CUSTOMER_ACCOUNTS_RESET:
                return {
                    request_status: dashboardConstants.GET_CUSTOMER_ACCOUNTS_RESET,
                    is_request_processing: false,
                    request_data: {},
                };

        default:
            return { ...state }
    }
}

export function GetTransactionHistoryReducer(state=initialState, action) {
    
    switch (action.type) {
        case dashboardConstants.GET_TRANSACTION_HISTORY_PENDING:
            return {
                request_status: dashboardConstants.GET_TRANSACTION_HISTORY_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case dashboardConstants.GET_TRANSACTION_HISTORY_SUCCESS:
            return {
                request_status: dashboardConstants.GET_TRANSACTION_HISTORY_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case dashboardConstants.GET_TRANSACTION_HISTORY_FAILURE:
            return {
                request_status: dashboardConstants.GET_TRANSACTION_HISTORY_FAILURE,
                is_request_processing: false,
                request_data: action
            };

        case dashboardConstants.GET_TRANSACTION_HISTORY_RESET:
            return {
                request_status: dashboardConstants.GET_TRANSACTION_HISTORY_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function DepositCashWithAgentReducer(state=initialState, action) {
    
    switch (action.type) {
        case dashboardConstants.DEPOSIT_USING_AGENT_PENDING:
            return {
                request_status: dashboardConstants.DEPOSIT_USING_AGENT_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case dashboardConstants.DEPOSIT_USING_AGENT_SUCCESS:
            return {
                request_status: dashboardConstants.DEPOSIT_USING_AGENT_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case dashboardConstants.DEPOSIT_USING_AGENT_FAILURE:
            return {
                request_status: dashboardConstants.DEPOSIT_USING_AGENT_FAILURE,
                is_request_processing: false,
                request_data: action
            };

        case dashboardConstants.DEPOSIT_USING_AGENT_RESET:
            return {
                request_status: dashboardConstants.DEPOSIT_USING_AGENT_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function LocateAnAgentReducer(state=initialState, action) {
    
    switch (action.type) {
        case dashboardConstants.LOCATE_AGENTS_PENDING:
            return {
                request_status: dashboardConstants.LOCATE_AGENTS_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case dashboardConstants.LOCATE_AGENTS_SUCCESS:
            return {
                request_status: dashboardConstants.LOCATE_AGENTS_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case dashboardConstants.LOCATE_AGENTS_FAILURE:
            return {
                request_status: dashboardConstants.LOCATE_AGENTS_FAILURE,
                is_request_processing: false,
                request_data: action
            };

        case dashboardConstants.LOCATE_AGENTS_RESET:
            return {
                request_status: dashboardConstants.LOCATE_AGENTS_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function ChargeACardReducer(state=initialState, action) {
    
    switch (action.type) {
        case dashboardConstants.CHARGE_A_CARD_PENDING:
            return {
                request_status: dashboardConstants.CHARGE_A_CARD_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case dashboardConstants.CHARGE_A_CARD_SUCCESS:
            return {
                request_status: dashboardConstants.CHARGE_A_CARD_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case dashboardConstants.CHARGE_A_CARD_FAILURE:
            return {
                request_status: dashboardConstants.CHARGE_A_CARD_FAILURE,
                is_request_processing: false,
                request_data: action
            };

        case dashboardConstants.CHARGE_A_CARD_RESET:
            return {
                request_status: dashboardConstants.CHARGE_A_CARD_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function ValidateACardReducer(state=initialState, action) {
    
    switch (action.type) {
        case dashboardConstants.VALIDATE_A_CARD_PENDING:
            return {
                request_status: dashboardConstants.VALIDATE_A_CARD_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case dashboardConstants.VALIDATE_A_CARD_SUCCESS:
            return {
                request_status: dashboardConstants.VALIDATE_A_CARD_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case dashboardConstants.VALIDATE_A_CARD_FAILURE:
            return {
                request_status: dashboardConstants.VALIDATE_A_CARD_FAILURE,
                is_request_processing: false,
                request_data: action
            };

        case dashboardConstants.VALIDATE_A_CARD_RESET:
            return {
                request_status: dashboardConstants.VALIDATE_A_CARD_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function QueryCardValidationStateReducer(state=initialState, action) {
    
    switch (action.type) {
        case dashboardConstants.QUERY_CARD_VALIDATIONSTATE_PENDING:
            return {
                request_status: dashboardConstants.QUERY_CARD_VALIDATIONSTATE_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case dashboardConstants.QUERY_CARD_VALIDATIONSTATE_SUCCESS:
            return {
                request_status: dashboardConstants.QUERY_CARD_VALIDATIONSTATE_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case dashboardConstants.QUERY_CARD_VALIDATIONSTATE_FAILURE:
            return {
                request_status: dashboardConstants.QUERY_CARD_VALIDATIONSTATE_FAILURE,
                is_request_processing: false,
                request_data: action
            };

        case dashboardConstants.QUERY_CARD_VALIDATIONSTATE_RESET:
            return {
                request_status: dashboardConstants.QUERY_CARD_VALIDATIONSTATE_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}