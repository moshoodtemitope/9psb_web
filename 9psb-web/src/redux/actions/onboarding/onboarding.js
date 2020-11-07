import { ApiService } from "../../../services/apiService";
import { routes } from "../../../services/urls";
import { history } from './../../../_helpers/history';
import {onboardingConstants} from '../../actiontypes/onboarding/onboarding.constants'
import { handleRequestErrors, saveRouteForRedirect, removeRouteForRedirect } from "../../../shared/utils";
import {verifyCustomerState} from "../../../shared/shared-utils";
import {accountActions} from '../../actions/dashboard/dashboard'

export const onboardingActions = {
    Login,
    Logout,
    CheckIfCustomerExists,
    CreateAccountStep1,
    ValidateRegOtp,
    ResendRegOtp,
    UpdateCustomerDetails,
    initStore,
    ResfreshToken,
    UploadAFile,

    InititatePasswordReset,
    CompletePasswordReset,
    ChangePassword,

    CreateTransactionPin,
    ChangePin,
    InitiatePinReset,
    CompletePinReset,
    
    GetSecurityQuestions,
    GetLgas,
    GetStates,

    UpgradeFetchDetails,
    UpgradeSendDetails,
    UpgradeValidateOtp,
    UpgradeCompletion
}

function Login   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            // let payload = {
            //     "password": "",
            //     "mobileNumber":""
            // }
            let consume = ApiService.request(routes.LOGIN_URL, "POST", requestPayload);
            // let consume = ApiService.request(routes.LOGIN_URL, "POST", requestPayload);
            dispatch(request(consume));
            return consume
                .then(response =>{
                   
                    
                    let userInfoData = {...response.data};
                        userInfoData.lastLogForAuth = Date.now();
                    
                    
                    
                    localStorage.setItem('psb-auth', JSON.stringify(userInfoData));
                    if(userInfoData.isPinSet===true && userInfoData.isProfileSet===true){
                        let psbAuth = JSON.parse(localStorage.getItem("psb-auth"));
                        let consume6 = ApiService.request(routes.GET_ACCOUNTS, "GET", null);
                        dispatch(request(consume6));
                        return consume6
                            .then(response6 => {
                                psbAuth.savings = response6.data.savings;
                                let consume2 = ApiService.request(routes.GET_PROFILE_PIX, "GET", null);
                                dispatch(request(consume2));
                                return consume2
                                    .then(response2 => {
                                        let profilePix = response2.data.base64String
                                        

                                        psbAuth.profilePix = profilePix;
                                        
                                        localStorage.setItem('psb-auth', JSON.stringify(psbAuth));
                                        // dispatch(accountActions.GetCustomerDashboardData());
                                        dispatch(success(response.data))
                                        history.push("/app/dashboard");
                                    })
                                    .catch(error => {
                                        let profilePix = "no file";
                                        // let psbAuth = JSON.parse(localStorage.getItem("psb-auth"));

                                        psbAuth.profilePix = profilePix;

                                        localStorage.setItem('psb-auth', JSON.stringify(psbAuth));
                                        // dispatch(accountActions.GetCustomerDashboardData());
                                        dispatch(success(response.data))
                                        history.push("/app/dashboard");
                                    });
                            })
                            .catch(error6 => {
                                let consume2 = ApiService.request(routes.GET_PROFILE_PIX, "GET", null);
                                dispatch(request(consume2));
                                return consume2
                                    .then(response2 => {
                                        let profilePix = response2.data.base64String
                                        let psbAuth = JSON.parse(localStorage.getItem("psb-auth"));

                                        psbAuth.profilePix = profilePix;

                                        localStorage.setItem('psb-auth', JSON.stringify(psbAuth));
                                        // dispatch(accountActions.GetCustomerDashboardData());
                                        dispatch(success(response.data))
                                        history.push("/app/dashboard");
                                    })
                                    .catch(error => {
                                        let profilePix = "no file";
                                        let psbAuth = JSON.parse(localStorage.getItem("psb-auth"));

                                        psbAuth.profilePix = profilePix;

                                        localStorage.setItem('psb-auth', JSON.stringify(psbAuth));
                                        // dispatch(accountActions.GetCustomerDashboardData());
                                        dispatch(success(response.data))
                                        history.push("/app/dashboard");
                                    });
                            });

                        

                        

                        // let consume5 = ApiService.request(routes.GET_ACCOUNTS, "GET", null);
                        // dispatch(request(consume5));
                        // return consume5
                        //     .then(response5 =>{
                                            
                        //         let allData = {
                        //             ...response.data,
                        //             accounts:response5.data
                        //         }
                        //         dispatch(success(allData));
                        //         localStorage.setItem('psb-auth', JSON.stringify(allData));
                        //         history.push("/app/dashboard");
                        //     })
                        //     .catch(error =>{
                        //         // localStorage.clear();
                        //         localStorage.removeItem('psb-auth');
                        //         dispatch(failure(handleRequestErrors(error)));
                                
                                
                        //     });

                    }else{
                        if(userInfoData.isProfileSet===false){
                            let consume2 = ApiService.request(routes.GET_CUSTOMER_PROFILE, "GET", null);
                            dispatch(request(consume2));
                            return consume2
                                .then(response2 =>{
                                    // dispatch(success(response2.data));
                                    // history.push("/app/confirm-details");
                                    // localStorage.setItem('psb-auth', JSON.stringify(response.data));
                                    let consume3 = ApiService.request(routes.GET_STATES, "GET", null);
                                    dispatch(request(consume3));
                                    return consume3
                                        .then(response3 =>{
                                           
                                            let allData = {
                                                ...response2.data,
                                                states:response3.data
                                            }
                                            dispatch(success(allData));
                                            
                                            history.push("/app/confirm-details");
                                        })
                                        .catch(error =>{
                                            dispatch(success(response2.data));
                                            history.push("/app/confirm-details");
                                            
                                            // dispatch(failure(handleRequestErrors(error)));
                                            // dispatch(CheckIfCustomerExists("CLEAR"));
                                            
                                        });

                                })
                                .catch(error =>{
                                    // history.push("/app/confirm-details");
                                    
                                    dispatch(failure(handleRequestErrors(error)));
                                    // dispatch(CheckIfCustomerExists("CLEAR"));
                                    
                                });
                        }else{
                            if(userInfoData.isPinSet===false){
                                dispatch(success(response.data));
                                history.push("/app/create-pin");     
                            }
                        }
                    }
                    
                   
                    
                }).catch(error =>{
                    // let clearNumberSaved =  {type: onboardingConstants.CHECK_EXISTING_USER_RESET, clear_data:""};
                    
                    dispatch(failure(handleRequestErrors(error)));
                    // dispatch(CheckIfCustomerExists("CLEAR"));
                    
                });
            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: onboardingConstants.LOGIN_USER_PENDING, user } }
    function success(response) { return { type: onboardingConstants.LOGIN_USER_SUCCESS, response } }
    function failure(error) { return { type: onboardingConstants.LOGIN_USER_FAILURE, error } }
    function clear() { return { type: onboardingConstants.LOGIN_USER_RESET, clear_data:""} }
}

function Logout() {
    
    localStorage.clear();
    
    
    

    history.push('/');
    return (dispatch) => {
        dispatch(logout());
    }
    
    
    function logout() { 
        return { type: onboardingConstants.LOGOUT } 
    }
}

function CheckIfCustomerExists   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            let MobileNumber = requestPayload;
            if(requestPayload.length===10){
                MobileNumber = `234${requestPayload}`;
            }
            let consume = ApiService.request(`${routes.CHECK_EXISTING_USER}?MobileNumber=${MobileNumber}`, "GET", null);
            dispatch(request(consume));
            return consume
                .then(response =>{
                    if(response.data.exists===false){
                        dispatch(success(response.data, requestPayload));
                        history.push("/app/signup/provide-details")
                    }
                    if(response.data.exists===true){
                        history.push("/")
                        // dispatch(failure("You already have an account. Please log in"));
                    }
                    
                }).catch(error =>{
                    dispatch(failure(handleRequestErrors(error)));
                });
            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: onboardingConstants.CHECK_EXISTING_USER_PENDING, user } }
    function success(response, phoneNumber) { return { type: onboardingConstants.CHECK_EXISTING_USER_SUCCESS, response, phoneNumber } }
    function failure(error) { return { type: onboardingConstants.CHECK_EXISTING_USER_FAILURE, error } }
    function clear() { return { type: onboardingConstants.CHECK_EXISTING_USER_RESET, clear_data:""} }
}

function CreateAccountStep1   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            let consume = ApiService.request(routes.CREATE_ACCOUNT, "POST", requestPayload);
            dispatch(request(consume));
            return consume
                .then(response =>{
                    
                    dispatch(success(response.data));
                    // dispatch(CheckIfCustomerExists("CLEAR"));
                    history.push("/app/signup/otp");
                        // history.push("/app/signup/provide-details")
                   
                    
                }).catch(error =>{
                    // let clearNumberSaved =  {type: onboardingConstants.CHECK_EXISTING_USER_RESET, clear_data:""};
                    dispatch(failure(handleRequestErrors(error)));
                    // dispatch(CheckIfCustomerExists("CLEAR"));
                    
                });
            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: onboardingConstants.CREATE_USER_ACCOUNT_PENDING, user } }
    function success(response) { return { type: onboardingConstants.CREATE_USER_ACCOUNT_SUCCESS, response } }
    function failure(error) { return { type: onboardingConstants.CREATE_USER_ACCOUNT_FAILURE, error } }
    function clear() { return { type: onboardingConstants.CREATE_USER_ACCOUNT_RESET, clear_data:""} }
}

function ValidateRegOtp   (requestPayload, type){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            let consume = ApiService.request(routes.VALIDATE_OTP, "POST", requestPayload);
            dispatch(request(consume));
            return consume
                .then(response =>{
                    localStorage.setItem('psb-auth', JSON.stringify(response.data));
                    // dispatch(success(response.data));
                    dispatch(CheckIfCustomerExists("CLEAR"));
                    dispatch(CreateAccountStep1("CLEAR"));
                    if(type==="newreg"){
                        


                       
                        let consume3 = ApiService.request(routes.GET_STATES, "GET", null);
                        dispatch(request(consume3));
                        return consume3
                            .then(response3 => {
                                let allData = {
                                    ...response.data,
                                    states: response3.data
                                }
                                localStorage.setItem('psb-auth', JSON.stringify(allData));
                                dispatch(success(allData));
                                history.push("/app/confirm-details");
                            })
                            .catch(error => {
                                localStorage.setItem('psb-auth', JSON.stringify(response.data));
                                dispatch(success(response.data));
                                history.push("/");

                                // dispatch(failure(handleRequestErrors(error)));
                                // dispatch(CheckIfCustomerExists("CLEAR"));

                            });
                    }
                    if(type==="isPasswordReset"){
                        dispatch(success(response.data));
                        history.push("/app/reset-password/new-password");
                    }
                    
                        // history.push("/app/signup/provide-details")
                   
                    
                }).catch(error =>{
                    // let clearNumberSaved =  {type: onboardingConstants.CHECK_EXISTING_USER_RESET, clear_data:""};
                    dispatch(failure(handleRequestErrors(error)));
                    // dispatch(CheckIfCustomerExists("CLEAR"));
                    
                });
            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: onboardingConstants.VALIDATE_OTP_PENDING, user } }
    function success(response) { return { type: onboardingConstants.VALIDATE_OTP_SUCCESS, response } }
    function failure(error) { return { type: onboardingConstants.VALIDATE_OTP_FAILURE, error } }
    function clear() { return { type: onboardingConstants.VALIDATE_OTP_RESET, clear_data:""} }
}

function ResendRegOtp   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
           dispatch(ValidateRegOtp("CLEAR"));
            let consume = ApiService.request(routes.RESEND_OTP, "POST", requestPayload);
            dispatch(request(consume));
            return consume
                .then(response =>{
                    
                    dispatch(success(response.data));
                   
                    
                }).catch(error =>{
                    dispatch(failure(handleRequestErrors(error)));
                });
            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: onboardingConstants.RESEND_REG_OTP_PENDING, user } }
    function success(response) { return { type: onboardingConstants.RESEND_REG_OTP_SUCCESS, response } }
    function failure(error) { return { type: onboardingConstants.RESEND_REG_OTP_FAILURE, error } }
    function clear() { return { type: onboardingConstants.RESEND_REG_OTP_RESET, clear_data:""} }
}

function UpdateCustomerDetails   (requestPayload, uploadedDpData){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            let consume = ApiService.request(routes.UPDATE_CUSTOMER_PROFILE, "POST", requestPayload);
            dispatch(request(consume));
            return consume
                .then(response =>{
                    // localStorage.setItem('psb-auth', JSON.stringify(response.data));
                    // dispatch(success(response.data));
                    let psbuser = JSON.parse(localStorage.getItem('psb-auth'));
                    
                    dispatch(success(response.data));
                    if(psbuser.isPinSet===false){
                        history.push("/app/create-pin");     
                    }else{
                        dispatch(Logout());
                        history.push("/");
                    }
                    // if(uploadedDpData!==undefined && uploadedDpData!==null){
                    //     let consume2 = ApiService.request(routes.UPLOAD_PROFILE_PIX, "POST", requestPayload);
                    //     dispatch(request(consume2));
                    //     return consume2
                    //         .then(response2 =>{
                    //             dispatch(success(response2.data));
                    //         }).catch(error =>{
                    //             dispatch(success(response.data));
                    //             setTimeout(() => {
                    //                 dispatch(failure(handleRequestErrors(error)));
                    //             }, 4000);
                                
                                
                    //         });
                    // }else{
                    //     dispatch(success(response.data));
                    // }
                    
                }).catch(error =>{
                    dispatch(failure(handleRequestErrors(error)));
                });
            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: onboardingConstants.UPDATE_PROFILE_PENDING, user } }
    function success(response) { return { type: onboardingConstants.UPDATE_PROFILE_SUCCESS, response } }
    function failure(error) { return { type: onboardingConstants.UPDATE_PROFILE_FAILURE, error } }
    function clear() { return { type: onboardingConstants.UPDATE_PROFILE_RESET, clear_data:""} }
}

function UploadAFile   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            let consume = ApiService.request(routes.UPLOAD_PROFILE_PIX, "POST", requestPayload);
            dispatch(request(consume));
            return consume
                .then(response =>{
                    
                    
                    let consume2 = ApiService.request(routes.GET_PROFILE_PIX, "GET", null);
                        dispatch(request(consume2));
                        return consume2
                            .then(response2 =>{
                                let profilePix = response2.data.base64String
                                let psbAuth = JSON.parse(localStorage.getItem("psb-auth"));

                                psbAuth.profilePix = profilePix;

                                localStorage.setItem('psb-auth', JSON.stringify(psbAuth));
                                // dispatch(accountActions.GetCustomerDashboardData());
                                dispatch(success(response.data))
                            })
                            .catch(error =>{
                                let profilePix = "no file";
                                let psbAuth = JSON.parse(localStorage.getItem("psb-auth"));

                                psbAuth.profilePix = profilePix;

                                localStorage.setItem('psb-auth', JSON.stringify(psbAuth));
                                // dispatch(accountActions.GetCustomerDashboardData());
                                dispatch(success(response.data))
                            });
                   
                    
                }).catch(error =>{
                    dispatch(failure(handleRequestErrors(error)));
                });
            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: onboardingConstants.UPLOAD_A_FILE_PENDING, user } }
    function success(response) { return { type: onboardingConstants.UPLOAD_A_FILE_SUCCESS, response } }
    function failure(error) { return { type: onboardingConstants.UPLOAD_A_FILE_FAILURE, error } }
    function clear() { return { type: onboardingConstants.UPLOAD_A_FILE_RESET, clear_data:""} }
}



function InititatePasswordReset   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            let consume = ApiService.request(routes.INITIATE_PASSWORD_RESET, "POST", requestPayload);
            dispatch(request(consume));
            return consume
                .then(response =>{
                    
                    dispatch(success(response.data));
                    history.push("/app/reset-password/otp");
                    
                }).catch(error =>{
                    dispatch(failure(handleRequestErrors(error)));
                });
            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: onboardingConstants.INITIATE_PASSWORD_RESET_PENDING, user } }
    function success(response) { return { type: onboardingConstants.INITIATE_PASSWORD_RESET_SUCCESS, response } }
    function failure(error) { return { type: onboardingConstants.INITIATE_PASSWORD_RESET_FAILURE, error } }
    function clear() { return { type: onboardingConstants.INITIATE_PASSWORD_RESET_RESET, clear_data:""} }
}

function CompletePasswordReset   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            let consume = ApiService.request(routes.COMPLETE_PASSWORD_RESET, "POST", requestPayload);
            dispatch(request(consume));
            return consume
                .then(response =>{
                    
                    dispatch(success(response.data));
                    
                    history.push("/app/reset-password/success");
                    
                }).catch(error =>{
                    dispatch(failure(handleRequestErrors(error)));
                    
                    if(error.response.data.message!==undefined &&
                        error.response.data.message!==null
                        && error.response.data.message==="The one time password used has expired."){
                            setTimeout(() => {
                                dispatch(clear());
                                history.push("/app/reset-password")
                            }, 3000);
                        }
                    
                });
            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: onboardingConstants.COMPLETE_PASSWORD_RESET_PENDING, user } }
    function success(response) { return { type: onboardingConstants.COMPLETE_PASSWORD_RESET_SUCCESS, response } }
    function failure(error) { return { type: onboardingConstants.COMPLETE_PASSWORD_RESET_FAILURE, error } }
    function clear() { return { type: onboardingConstants.COMPLETE_PASSWORD_RESET_RESET, clear_data:""} }
}

function ChangePassword   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
           dispatch(ValidateRegOtp("CLEAR"));
            let consume = ApiService.request(routes.CHANGE_PASSWORD, "POST", requestPayload);
            dispatch(request(consume));
            return consume
                .then(response =>{
                    
                    dispatch(success(response.data));
                   history.push('/app/account-settings/change-password/success');
                    
                }).catch(error =>{
                    dispatch(failure(handleRequestErrors(error)));
                });
            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: onboardingConstants.CHANGE_PASSWORD_PENDING, user } }
    function success(response) { return { type: onboardingConstants.CHANGE_PASSWORD_SUCCESS, response } }
    function failure(error) { return { type: onboardingConstants.CHANGE_PASSWORD_FAILURE, error } }
    function clear() { return { type: onboardingConstants.CHANGE_PASSWORD_RESET, clear_data:""} }
}

function UpgradeFetchDetails   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            let consume = ApiService.request(routes.GET_BVN_INFO, "POST", requestPayload);
            dispatch(request(consume));
            return consume
                .then(response =>{
                    
                    dispatch(success(response.data));
                   history.push('/app/account-settings/account-upgrade/otp');
                    
                }).catch(error =>{
                    dispatch(failure(handleRequestErrors(error)));
                });
            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: onboardingConstants.UPGRADE_FETCH_DETAILS_PENDING, user } }
    function success(response) { return { type: onboardingConstants.UPGRADE_FETCH_DETAILS_SUCCESS, response } }
    function failure(error) { return { type: onboardingConstants.UPGRADE_FETCH_DETAILS_FAILURE, error } }
    function clear() { return { type: onboardingConstants.UPGRADE_FETCH_DETAILS_RESET, clear_data:""} }
}

function UpgradeSendDetails   (requestPayload, requestTrackingId){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
        //    dispatch(ValidateRegOtp("CLEAR"));
            let consume;
                if(requestTrackingId===""){
                    consume = ApiService.request(routes.UPGRADE_SEND_DETAILS, "POST", requestPayload);
                }else{
                    let payload = {
                        hash:requestTrackingId
                    }
                    consume = ApiService.request(routes.UPGRADE_COMPLETION, "POST", payload);
                }
            dispatch(request(consume));
            return consume
                .then(response =>{
                    dispatch(UpgradeFetchDetails("CLEAR"))
                    dispatch(UpgradeValidateOtp("CLEAR"))
                    
                    if(requestTrackingId===""){
                        dispatch(success({...response.data}));
                        history.push('/app/account-settings/account-upgrade/otp');
                    }else{
                        dispatch(success({...response.data, requestTrackingId}));
                        history.push('/app/account-settings/account-upgrade/success');
                    }
                    
                }).catch(error =>{
                    console.log("papapa", error.response)
                    dispatch(failure(handleRequestErrors(error)));
                });
            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: onboardingConstants.UPGRADE_SEND_DETAILS_PENDING, user } }
    function success(response) { return { type: onboardingConstants.UPGRADE_SEND_DETAILS_SUCCESS, response } }
    function failure(error) { return { type: onboardingConstants.UPGRADE_SEND_DETAILS_FAILURE, error } }
    function clear() { return { type: onboardingConstants.UPGRADE_SEND_DETAILS_RESET, clear_data:""} }
}

function UpgradeValidateOtp   (requestPayload, hashFromSentDetails){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
           dispatch(ValidateRegOtp("CLEAR"));
            let consume = ApiService.request(routes.UPGRADE_VALIDATE_OTP, "POST", requestPayload);
            dispatch(request(consume));
            return consume
                .then(response =>{
                    // 
                    
                    if(hashFromSentDetails===""){
                        dispatch(success({...response.data, hashFromSentDetails}));
                        history.push('/app/account-settings/account-upgrade');
                    }else{
                        let payload = {
                            hash:hashFromSentDetails
                        }
                        let consume2 = ApiService.request(routes.UPGRADE_COMPLETION, "POST", payload);
                        dispatch(request(consume2));
                        return consume2
                            .then(response2 => {

                                dispatch(success({...response2.data, hashFromSentDetails}));
                                dispatch(UpgradeFetchDetails("CLEAR"))
                                history.push('/app/account-settings/success');

                            }).catch(error => {
                                dispatch(failure(handleRequestErrors(error)));
                            });
                    }
                    
                }).catch(error =>{
                    dispatch(failure(handleRequestErrors(error)));
                });
            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: onboardingConstants.UPGRADE_VALIDATE_OTP_PENDING, user } }
    function success(response) { return { type: onboardingConstants.UPGRADE_VALIDATE_OTP_SUCCESS, response } }
    function failure(error) { return { type: onboardingConstants.UPGRADE_VALIDATE_OTP_FAILURE, error } }
    function clear() { return { type: onboardingConstants.UPGRADE_VALIDATE_OTP_RESET, clear_data:""} }
}

function UpgradeCompletion   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            let consume = ApiService.request(routes.UPGRADE_COMPLETION, "POST", requestPayload);
            dispatch(request(consume));
            return consume
                .then(response =>{
                    
                    dispatch(success(response.data));
                //    history.push('/app/account-settings/change-password/success');
                    
                }).catch(error =>{
                    dispatch(failure(handleRequestErrors(error)));
                });
            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: onboardingConstants.UPGRADE_COMPLETION_PENDING, user } }
    function success(response) { return { type: onboardingConstants.UPGRADE_COMPLETION_SUCCESS, response } }
    function failure(error) { return { type: onboardingConstants.UPGRADE_COMPLETION_FAILURE, error } }
    function clear() { return { type: onboardingConstants.UPGRADE_COMPLETION_RESET, clear_data:""} }
}

function CreateTransactionPin   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            let consume = ApiService.request(routes.CREATE_TRANSACTION_PIN, "POST", requestPayload);
            dispatch(request(consume));
            let psbuser =JSON.parse(localStorage.getItem('psb-auth'));
            return consume
                .then(response =>{
                    
                    dispatch(success(response.data));
                    // dispatch(Logout());
                    psbuser.isPinSet = true;
                    psbuser.isProfileSet = true;
                    localStorage.setItem('psb-auth', JSON.stringify(psbuser));
                    history.push("/app/create-pin-success");

                    // if(psbuser.isProfileSet===false){
                    //     let consume2 = ApiService.request(routes.GET_CUSTOMER_PROFILE, "GET", null);
                    //     dispatch(request(consume2));
                    //     return consume2
                    //         .then(response2 =>{
                    //             dispatch(success(response2.data));
                    //             history.push("/app/create-pin-success");
                    //         })
                    //         .catch(error =>{
                                
                    //             history.push("/app/create-pin-success");
                    //         });
                    // }else{
                    //     dispatch(success(response.data));
                    //     history.push("/app/create-pin-success");
                    // }
                    
                }).catch(error =>{
                    
                    dispatch(failure(handleRequestErrors(error)));
                });
            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: onboardingConstants.CREATE_PIN_PENDING, user } }
    function success(response) { return { type: onboardingConstants.CREATE_PIN_SUCCESS, response } }
    function failure(error) { return { type: onboardingConstants.CREATE_PIN_FAILURE, error } }
    function clear() { return { type: onboardingConstants.CREATE_PIN_RESET, clear_data:""} }
}

function ChangePin   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            let consume = ApiService.request(routes.CHANGE_PIN, "POST", requestPayload);
            dispatch(request(consume));
            return consume
                .then(response =>{
                    dispatch(success(response.data));
                    history.push("/app/account-settings/change-pin/success")
                   
                   
                    
                }).catch(error =>{
                    dispatch(failure(handleRequestErrors(error)));
                });
            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: onboardingConstants.CHANGE_PIN_PENDING, user } }
    function success(response) { return { type: onboardingConstants.CHANGE_PIN_SUCCESS, response } }
    function failure(error) { return { type: onboardingConstants.CHANGE_PIN_FAILURE, error } }
    function clear() { return { type: onboardingConstants.CHANGE_PIN_RESET, clear_data:""} }
}

function InitiatePinReset   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            let consume = ApiService.request(routes.INITIATE_RESET_TRANSACTION_PIN, "POST", requestPayload);
            dispatch(request(consume));
            return consume
                .then(response =>{
                    dispatch(success(response.data));
                    history.push("/app/account-settings/reset-pin/newpin", {requestTrackingId: response.data.requestTrackingId})
                    
                }).catch(error =>{
                    dispatch(failure(handleRequestErrors(error)));
                });
            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: onboardingConstants.INITIATE_PIN_RESET_PENDING, user } }
    function success(response) { return { type: onboardingConstants.INITIATE_PIN_RESET_SUCCESS, response } }
    function failure(error) { return { type: onboardingConstants.INITIATE_PIN_RESET_FAILURE, error } }
    function clear() { return { type: onboardingConstants.INITIATE_PIN_RESET_RESET, clear_data:""} }
}

function CompletePinReset   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            let consume = ApiService.request(routes.COMPLETE_RESET_TRANSACTION_PIN, "POST", requestPayload);
            dispatch(request(consume));
            return consume
                .then(response =>{
                    dispatch(success(response.data));
                    history.push("/app/account-settings/reset-pin/success")
                   
                   
                    
                }).catch(error =>{
                    dispatch(failure(handleRequestErrors(error)));
                });
            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: onboardingConstants.COMPLETE_PIN_RESET_PENDING, user } }
    function success(response) { return { type: onboardingConstants.COMPLETE_PIN_RESET_SUCCESS, response } }
    function failure(error) { return { type: onboardingConstants.COMPLETE_PIN_RESET_FAILURE, error } }
    function clear() { return { type: onboardingConstants.COMPLETE_PIN_RESET_RESET, clear_data:""} }
}

function GetSecurityQuestions   (requestPayload,type){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            let consume;
            if(type!=="profile"){
                 consume = ApiService.request(routes.GET_SECURITY_QUESTIONS, "GET", null);
            }
            if(type==="profile"){
                 consume = ApiService.request(routes.GET_PROFILE_SECURITY_QUESTION, "GET", null);
            }
            
            dispatch(request(consume));
            return consume
                .then(response =>{
                    if(type==="profile"){
                        if(response.data.message!==null && response.data.message!==""){
                            dispatch(success(response.data));
                        }else{
                            
                            dispatch(failure("Unable to load your security question"));
                        }
                    }else{
                        dispatch(success(response.data));
                    }
                    
                    
                }).catch(error =>{
                    dispatch(failure(handleRequestErrors(error)));
                });
            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: onboardingConstants.GET_SECURITY_QUESTIONS_PENDING, user } }
    function success(response) { return { type: onboardingConstants.GET_SECURITY_QUESTIONS_SUCCESS, response } }
    function failure(error) { return { type: onboardingConstants.GET_SECURITY_QUESTIONS_FAILURE, error } }
    function clear() { return { type: onboardingConstants.GET_SECURITY_QUESTIONS_RESET, clear_data:""} }
}

function GetLgas   (stateCode){
    if(stateCode!=="CLEAR"){
        return dispatch =>{
            let consume = ApiService.request(`${routes.GET_LGAS}?Code=${stateCode}`, "GET", null);
            dispatch(request(consume));
            return consume
                .then(response =>{
                    
                    dispatch(success(response.data));
                    
                    
                }).catch(error =>{
                    dispatch(failure(handleRequestErrors(error)));
                });
            
        }
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }
     

    function request(user) { return { type: onboardingConstants.GET_LGAS_PENDING, user } }
    function success(response) { return { type: onboardingConstants.GET_LGAS_SUCCESS, response } }
    function failure(error) { return { type: onboardingConstants.GET_LGAS_FAILURE, error } }
    function clear() { return { type: onboardingConstants.GET_LGAS_RESET, clear_data:""} }
}

function GetStates   (){
   
        return dispatch =>{
            let consume = ApiService.request(routes.GET_STATES, "GET", null);
            dispatch(request(consume));
            return consume
                .then(response =>{
                    
                    dispatch(success(response.data));
                    
                    
                }).catch(error =>{
                    dispatch(failure(handleRequestErrors(error)));
                });
            
        }
        
   

    function request(user) { return { type: onboardingConstants.GET_STATES_PENDING, user } }
    function success(response) { return { type: onboardingConstants.GET_STATES_SUCCESS, response } }
    function failure(error) { return { type: onboardingConstants.GET_STATES_FAILURE, error } }
}


function ResfreshToken   (refreshTokenPayload){
    
    if(refreshTokenPayload!=="CLEAR"){
        
        let userData;
        return dispatch =>{
            let consume = ApiService.request(routes.REFRESH_TOKEN, "POST", refreshTokenPayload);
            dispatch(request(consume));
            
            return consume
                .then(response =>{
                   
                    if(response.status===200){
                        if(response.data.token!==undefined){
                            
                            userData = JSON.parse(localStorage.getItem("psb-auth"));;
                            userData.lastLogForAuth = Date.now();
                            userData.statusCode = response.status;
                            userData.token = response.data.token;
                            localStorage.setItem('psb-auth', JSON.stringify(userData));
                            // let consume2 = ApiService.request(routes.ADD_BRANCH+'/allowedbranches', "GET", null);
                            // dispatch(request(consume2));
                            dispatch(success(userData));
                            return {refreshStatus: "success"}
                            // return consume2
                            // .then(response2 =>{
                                
                            //     let user = JSON.parse(localStorage.getItem("user"));
                            //         user.AllowedBranches = response2.data;
                            //         user.BranchId = response2.data[0].id;
                            //         user.BranchName = response2.data[0].name;
                            //         localStorage.setItem('user', JSON.stringify(user));
                            

                                
                                
                                
                            // })
                            // .catch(error =>{
                                
                                
                            // });

                            
                        }
                    }else{
                        let userInfo = JSON.parse(localStorage.getItem("psb-auth"))
                        userInfo.lastLogForAuth = Date.now();
                        localStorage.setItem('psb-auth', JSON.stringify(userInfo));
                        return {refreshStatus: "failed"}
                    }
                    
                    
                }).catch(error =>{
                   this.Logout();
                });
            
        }
        
    }

    // return dispatch =>{
        
    //     dispatch(clear());
        
    // }

    function request(user) { return { type: onboardingConstants.REFRESH_TOKEN_PENDING, user } }
    function success(response) { return { type: onboardingConstants.REFRESH_TOKEN_SUCCESS, response } }
    function failure(error) { return { type: onboardingConstants.REFRESH_TOKEN_FAILURE, error } }
    function clear() { return { type: onboardingConstants.REFRESH_TOKEN_RESET, clear_data:""} }

}




function initStore() {
    localStorage.clear();
    return (dispatch) => {
        dispatch(logout());
    }
    function logout() { return { type: onboardingConstants.LOGOUT } }
}