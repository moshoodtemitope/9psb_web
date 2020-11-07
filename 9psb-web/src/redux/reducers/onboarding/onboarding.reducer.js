import {onboardingConstants} from '../../actiontypes/onboarding/onboarding.constants'



let user = JSON.parse(localStorage.getItem("psb-auth"));

const initialState = (user) ? { loggedIn: true, user } : {};

export function LoginReducer(state=initialState, action) {
    
    switch (action.type) {
        case onboardingConstants.LOGIN_USER_PENDING:
            return {
                request_status: onboardingConstants.LOGIN_USER_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case onboardingConstants.LOGIN_USER_SUCCESS:
            return {
                request_status: onboardingConstants.LOGIN_USER_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.LOGIN_USER_FAILURE:
            return {
                request_status: onboardingConstants.LOGIN_USER_FAILURE,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.LOGIN_USER_RESET:
            return {
                request_status: onboardingConstants.LOGIN_USER_RESET,
                is_request_processing: false,
                request_data: {},
            };
        case onboardingConstants.LOGOUT:
            return {
                // test:"dsdsds",
                // request_data: action,
                ...state
              };
            
        case onboardingConstants.LOGOUT_USER_SUCCESS:
                return {
                  ...state
                };

        default:
            return { ...state }
    }
}

export function CheckIfCustomerExistsReducer(state=initialState, action) {
    
    switch (action.type) {
        case onboardingConstants.CHECK_EXISTING_USER_PENDING:
            return {
                request_status: onboardingConstants.CHECK_EXISTING_USER_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case onboardingConstants.CHECK_EXISTING_USER_SUCCESS:
            return {
                request_status: onboardingConstants.CHECK_EXISTING_USER_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.CHECK_EXISTING_USER_FAILURE:
            return {
                request_status: onboardingConstants.CHECK_EXISTING_USER_FAILURE,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.CHECK_EXISTING_USER_RESET:
            return {
                request_status: onboardingConstants.CHECK_EXISTING_USER_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function CreateAccountStep1Reducer(state=initialState, action) {
    
    switch (action.type) {
        case onboardingConstants.CREATE_USER_ACCOUNT_PENDING:
            return {
                request_status: onboardingConstants.CREATE_USER_ACCOUNT_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case onboardingConstants.CREATE_USER_ACCOUNT_SUCCESS:
            return {
                request_status: onboardingConstants.CREATE_USER_ACCOUNT_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.CREATE_USER_ACCOUNT_FAILURE:
            return {
                request_status: onboardingConstants.CREATE_USER_ACCOUNT_FAILURE,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.CREATE_USER_ACCOUNT_RESET:
            return {
                request_status: onboardingConstants.CREATE_USER_ACCOUNT_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function ValidateRegOtpReducer(state=initialState, action) {
    
    switch (action.type) {
        case onboardingConstants.VALIDATE_OTP_PENDING:
            return {
                request_status: onboardingConstants.VALIDATE_OTP_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case onboardingConstants.VALIDATE_OTP_SUCCESS:
            return {
                request_status: onboardingConstants.VALIDATE_OTP_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.VALIDATE_OTP_FAILURE:
            return {
                request_status: onboardingConstants.VALIDATE_OTP_FAILURE,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.VALIDATE_OTP_RESET:
            return {
                request_status: onboardingConstants.VALIDATE_OTP_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function ResendRegOtpReducer(state=initialState, action) {
    
    switch (action.type) {
        case onboardingConstants.RESEND_REG_OTP_PENDING:
            return {
                request_status: onboardingConstants.RESEND_REG_OTP_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case onboardingConstants.RESEND_REG_OTP_SUCCESS:
            return {
                request_status: onboardingConstants.RESEND_REG_OTP_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.RESEND_REG_OTP_FAILURE:
            return {
                request_status: onboardingConstants.RESEND_REG_OTP_FAILURE,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.RESEND_REG_OTP_RESET:
            return {
                request_status: onboardingConstants.RESEND_REG_OTP_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function UpdateCustomerDetailsReducer(state=initialState, action) {
    
    switch (action.type) {
        case onboardingConstants.UPDATE_PROFILE_PENDING:
            return {
                request_status: onboardingConstants.UPDATE_PROFILE_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case onboardingConstants.UPDATE_PROFILE_SUCCESS:
            return {
                request_status: onboardingConstants.UPDATE_PROFILE_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.UPDATE_PROFILE_FAILURE:
            return {
                request_status: onboardingConstants.UPDATE_PROFILE_FAILURE,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.UPDATE_PROFILE_RESET:
            return {
                request_status: onboardingConstants.UPDATE_PROFILE_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function UpgradeFetchDetailsReducer(state=initialState, action) {
    
    switch (action.type) {
        case onboardingConstants.UPGRADE_FETCH_DETAILS_PENDING:
            return {
                request_status: onboardingConstants.UPGRADE_FETCH_DETAILS_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case onboardingConstants.UPGRADE_FETCH_DETAILS_SUCCESS:
            return {
                request_status: onboardingConstants.UPGRADE_FETCH_DETAILS_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.UPGRADE_FETCH_DETAILS_FAILURE:
            return {
                request_status: onboardingConstants.UPGRADE_FETCH_DETAILS_FAILURE,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.UPGRADE_FETCH_DETAILS_RESET:
            return {
                request_status: onboardingConstants.UPGRADE_FETCH_DETAILS_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function UpgradeSendDetailsReducer(state=initialState, action) {
    
    switch (action.type) {
        case onboardingConstants.UPGRADE_SEND_DETAILS_PENDING:
            return {
                request_status: onboardingConstants.UPGRADE_SEND_DETAILS_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case onboardingConstants.UPGRADE_SEND_DETAILS_SUCCESS:
            return {
                request_status: onboardingConstants.UPGRADE_SEND_DETAILS_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.UPGRADE_SEND_DETAILS_FAILURE:
            return {
                request_status: onboardingConstants.UPGRADE_SEND_DETAILS_FAILURE,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.UPGRADE_SEND_DETAILS_RESET:
            return {
                request_status: onboardingConstants.UPGRADE_SEND_DETAILS_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function UpgradeValidateOtpReducer(state=initialState, action) {
    
    switch (action.type) {
        case onboardingConstants.UPGRADE_VALIDATE_OTP_PENDING:
            return {
                request_status: onboardingConstants.UPGRADE_VALIDATE_OTP_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case onboardingConstants.UPGRADE_VALIDATE_OTP_SUCCESS:
            return {
                request_status: onboardingConstants.UPGRADE_VALIDATE_OTP_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.UPGRADE_VALIDATE_OTP_FAILURE:
            return {
                request_status: onboardingConstants.UPGRADE_VALIDATE_OTP_FAILURE,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.UPGRADE_VALIDATE_OTP_RESET:
            return {
                request_status: onboardingConstants.UPGRADE_VALIDATE_OTP_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function UpgradeCompletionReducer(state=initialState, action) {
    
    switch (action.type) {
        case onboardingConstants.UPGRADE_COMPLETION_PENDING:
            return {
                request_status: onboardingConstants.UPGRADE_COMPLETION_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case onboardingConstants.UPGRADE_COMPLETION_SUCCESS:
            return {
                request_status: onboardingConstants.UPGRADE_COMPLETION_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.UPGRADE_COMPLETION_FAILURE:
            return {
                request_status: onboardingConstants.UPGRADE_COMPLETION_FAILURE,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.UPGRADE_COMPLETION_RESET:
            return {
                request_status: onboardingConstants.UPGRADE_COMPLETION_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function UploadAFileReducer(state=initialState, action) {
    
    switch (action.type) {
        case onboardingConstants.UPLOAD_A_FILE_PENDING:
            return {
                request_status: onboardingConstants.UPLOAD_A_FILE_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case onboardingConstants.UPLOAD_A_FILE_SUCCESS:
            return {
                request_status: onboardingConstants.UPLOAD_A_FILE_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.UPLOAD_A_FILE_FAILURE:
            return {
                request_status: onboardingConstants.UPLOAD_A_FILE_FAILURE,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.UPLOAD_A_FILE_RESET:
            return {
                request_status: onboardingConstants.UPLOAD_A_FILE_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function InititatePasswordResetReducer(state=initialState, action) {
    
    switch (action.type) {
        case onboardingConstants.INITIATE_PASSWORD_RESET_PENDING:
            return {
                request_status: onboardingConstants.INITIATE_PASSWORD_RESET_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case onboardingConstants.INITIATE_PASSWORD_RESET_SUCCESS:
            return {
                request_status: onboardingConstants.INITIATE_PASSWORD_RESET_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.INITIATE_PASSWORD_RESET_FAILURE:
            return {
                request_status: onboardingConstants.INITIATE_PASSWORD_RESET_FAILURE,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.INITIATE_PASSWORD_RESET_RESET:
            return {
                request_status: onboardingConstants.INITIATE_PASSWORD_RESET_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function CompletePasswordResetReducer(state=initialState, action) {
    
    switch (action.type) {
        case onboardingConstants.COMPLETE_PASSWORD_RESET_PENDING:
            return {
                request_status: onboardingConstants.COMPLETE_PASSWORD_RESET_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case onboardingConstants.COMPLETE_PASSWORD_RESET_SUCCESS:
            return {
                request_status: onboardingConstants.COMPLETE_PASSWORD_RESET_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.COMPLETE_PASSWORD_RESET_FAILURE:
            return {
                request_status: onboardingConstants.COMPLETE_PASSWORD_RESET_FAILURE,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.COMPLETE_PASSWORD_RESET_RESET:
            return {
                request_status: onboardingConstants.COMPLETE_PASSWORD_RESET_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function ChangePasswordReducer(state=initialState, action) {
    
    switch (action.type) {
        case onboardingConstants.CHANGE_PASSWORD_PENDING:
            return {
                request_status: onboardingConstants.CHANGE_PASSWORD_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case onboardingConstants.CHANGE_PASSWORD_SUCCESS:
            return {
                request_status: onboardingConstants.CHANGE_PASSWORD_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.CHANGE_PASSWORD_FAILURE:
            return {
                request_status: onboardingConstants.CHANGE_PASSWORD_FAILURE,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.CHANGE_PASSWORD_RESET:
            return {
                request_status: onboardingConstants.CHANGE_PASSWORD_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function GetSecurityQuestionsReducer(state=initialState, action) {
    
    switch (action.type) {
        case onboardingConstants.GET_SECURITY_QUESTIONS_PENDING:
            return {
                request_status: onboardingConstants.GET_SECURITY_QUESTIONS_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case onboardingConstants.GET_SECURITY_QUESTIONS_SUCCESS:
            return {
                request_status: onboardingConstants.GET_SECURITY_QUESTIONS_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.GET_SECURITY_QUESTIONS_FAILURE:
            return {
                request_status: onboardingConstants.GET_SECURITY_QUESTIONS_FAILURE,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.GET_SECURITY_QUESTIONS_RESET:
            return {
                request_status: onboardingConstants.GET_SECURITY_QUESTIONS_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function CreateTransactionPinReducer(state=initialState, action) {
    
    switch (action.type) {
        case onboardingConstants.CREATE_PIN_PENDING:
            return {
                request_status: onboardingConstants.CREATE_PIN_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case onboardingConstants.CREATE_PIN_SUCCESS:
            return {
                request_status: onboardingConstants.CREATE_PIN_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.CREATE_PIN_FAILURE:
            return {
                request_status: onboardingConstants.CREATE_PIN_FAILURE,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.CREATE_PIN_RESET:
            return {
                request_status: onboardingConstants.CREATE_PIN_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function ChangeTransactionPinReducer(state=initialState, action) {
    
    switch (action.type) {
        case onboardingConstants.CHANGE_PIN_PENDING:
            return {
                request_status: onboardingConstants.CHANGE_PIN_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case onboardingConstants.CHANGE_PIN_SUCCESS:
            return {
                request_status: onboardingConstants.CHANGE_PIN_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.CHANGE_PIN_FAILURE:
            return {
                request_status: onboardingConstants.CHANGE_PIN_FAILURE,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.CHANGE_PIN_RESET:
            return {
                request_status: onboardingConstants.CHANGE_PIN_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function InitiatePinResetReducer(state=initialState, action) {
    
    switch (action.type) {
        case onboardingConstants.INITIATE_PIN_RESET_PENDING:
            return {
                request_status: onboardingConstants.INITIATE_PIN_RESET_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case onboardingConstants.INITIATE_PIN_RESET_SUCCESS:
            return {
                request_status: onboardingConstants.INITIATE_PIN_RESET_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.INITIATE_PIN_RESET_FAILURE:
            return {
                request_status: onboardingConstants.INITIATE_PIN_RESET_FAILURE,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.INITIATE_PIN_RESET_RESET:
            return {
                request_status: onboardingConstants.INITIATE_PIN_RESET_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function CompletePinResetReducer(state=initialState, action) {
    
    switch (action.type) {
        case onboardingConstants.COMPLETE_PIN_RESET_PENDING:
            return {
                request_status: onboardingConstants.COMPLETE_PIN_RESET_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case onboardingConstants.COMPLETE_PIN_RESET_SUCCESS:
            return {
                request_status: onboardingConstants.COMPLETE_PIN_RESET_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.COMPLETE_PIN_RESET_FAILURE:
            return {
                request_status: onboardingConstants.COMPLETE_PIN_RESET_FAILURE,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.COMPLETE_PIN_RESET_RESET:
            return {
                request_status: onboardingConstants.COMPLETE_PIN_RESET_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function GetAllStatesReducer(state=initialState, action) {
    
    switch (action.type) {
        case onboardingConstants.GET_STATES_PENDING:
            return {
                request_status: onboardingConstants.GET_STATES_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case onboardingConstants.GET_STATES_SUCCESS:
            return {
                request_status: onboardingConstants.GET_STATES_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.GET_STATES_FAILURE:
            return {
                request_status: onboardingConstants.GET_STATES_FAILURE,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.GET_STATES_RESET:
            return {
                request_status: onboardingConstants.GET_STATES_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}

export function GetLgasReducer(state=initialState, action) {
    
    switch (action.type) {
        case onboardingConstants.GET_LGAS_PENDING:
            return {
                request_status: onboardingConstants.GET_LGAS_PENDING,
                is_request_processing: true,
                request_data: action
            };
        case onboardingConstants.GET_LGAS_SUCCESS:
            return {
                request_status: onboardingConstants.GET_LGAS_SUCCESS,
                loggedIn: true,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.GET_LGAS_FAILURE:
            return {
                request_status: onboardingConstants.GET_LGAS_FAILURE,
                is_request_processing: false,
                request_data: action
            };
        case onboardingConstants.GET_LGAS_RESET:
            return {
                request_status: onboardingConstants.GET_LGAS_RESET,
                is_request_processing: false,
                request_data: {},
            };

        default:
            return { ...state }
    }
}