import { ApiService } from "../../../services/apiService";
import { routes } from "../../../services/urls";
import { history } from './../../../_helpers/history';
import {dashboardConstants} from '../../actiontypes/dashboard/dashboard.constants'
import { handleRequestErrors, saveRouteForRedirect, removeRouteForRedirect } from "../../../shared/utils";

export const accountActions = {
    GetCustomerAccounts,
    GetTransactionHistory,
    GetCustomerDashboardData,
    DepositCashWithAgent,
    ChargeACard,
    ValidateACard,
    LocateAnAgent,
    QueryCardValidationState
}

function GetCustomerDashboardData   (){
    // if(requestPayload!=="CLEAR"){
        let psbAuth = JSON.parse(localStorage.getItem("psb-auth"));
        if(localStorage.getItem("psb-onboard")){
            localStorage.removeItem('psb-onboard');
        }
        return dispatch =>{
            let consume = ApiService.request(routes.GET_ACCOUNTS, "GET", null);
            dispatch(request(consume));
            return consume
                .then(response =>{
                    if(response.status===200 && response.headers['content-type'].indexOf('application/json')>-1){
                       

                            
                            if(response.data.accounts.length>=1){
                                
                                
    
                                psbAuth.allAccounts = response.data.accounts;
                                psbAuth.kycLevel = response.data.kycLevel;
                                psbAuth.savings = response.data.savings;
    
                                // localStorage.setItem('psb-auth', JSON.stringify(psbAuth));
                                
                                
                            }else{
                                dispatch(failure(handleRequestErrors("An error occured. Please try again")));
                            }

                  

                            
                        let consume5 = ApiService.request(`${routes.TRANSACTION_HISTORY}`, "GET", null);
                        // let consume5 = ApiService.request(`${routes.WALLET_HISTORY}?${historyQueryString}`, "GET", null);
                        dispatch(request(consume5));
                        return consume5
                            .then(response5 =>{
                                let allData,
                                    allAccounts = [...response.data.accounts];

                                    if(response.data.savings!==null && response.data.savings !==undefined){
                                        allAccounts.push(response.data.savings)
                                    }
                                 allData = {
                                    accounts:allAccounts,
                                    historydata:response5.data
                                }
                                // dispatch(success(allData));
                                // GET Customer Profile
                                let consume6 = ApiService.request(routes.GET_CUSTOMER_PROFILE, "GET", null);
                                dispatch(request(consume6));
                                return consume6
                                .then(response6 =>{
                                     allData.profileData = response6.data
                                     psbAuth.profileData = response6.data;

                                     localStorage.setItem('psb-auth', JSON.stringify(psbAuth));
                                     dispatch(success(allData));
                                })
                                .catch(error =>{
                                    dispatch(success(allData));
                                })
                            })
                            .catch(error =>{
                                dispatch(failure(handleRequestErrors(error)));
                            })
                    }else{
                        dispatch(success({accounts:response.data.accounts}))
                    }
                    
                    // dispatch(success({accounts:response.data}));
                    
                   
                    
                }).catch(error =>{
                    dispatch(failure(handleRequestErrors(error)));
                    // if(isFromLogin){
                    //     history.push("/app/dashboard");
                    // }
                    
                    
                });
            
        }
        
   

    function request(user) { return { type: dashboardConstants.GET_CUSTOMER_DASHBOARDDATA_PENDING, user } }
    function success(response) { return { type: dashboardConstants.GET_CUSTOMER_DASHBOARDDATA_SUCCESS, response } }
    function failure(error) { return { type: dashboardConstants.GET_CUSTOMER_DASHBOARDDATA_FAILURE, error } }
    
}

function GetCustomerAccounts   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            let consume = ApiService.request(routes.GET_ACCOUNTS, "GET", null);
            dispatch(request(consume));
            return consume
                .then(response =>{
                    if(response.status===200 && response.headers['content-type'].indexOf('application/json')>-1){
                        if(response.data.accounts.length>=1){
                            let psbAuth = JSON.parse(localStorage.getItem("psb-auth"));

                            psbAuth.allAccounts = response.data.accounts;
                            psbAuth.kycLevel = response.data.kycLevel;
                            localStorage.setItem('psb-auth', JSON.stringify(psbAuth));
                        }
                        dispatch(success(response.data.accounts));
                    }else{
                        dispatch(failure(handleRequestErrors("An error occured. Please try again")));
                    }
                   
                    
                }).catch(error =>{
                    dispatch(failure(handleRequestErrors(error)));
                    
                });
            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: dashboardConstants.GET_CUSTOMER_ACCOUNTS_PENDING, user } }
    function success(response) { return { type: dashboardConstants.GET_CUSTOMER_ACCOUNTS_SUCCESS, response } }
    function failure(error) { return { type: dashboardConstants.GET_CUSTOMER_ACCOUNTS_FAILURE, error } }
    function clear() { return { type: dashboardConstants.GET_CUSTOMER_ACCOUNTS_RESET, clear_data:""} }
}

function GetTransactionHistory   (historyQueryString){
    if(historyQueryString!=="CLEAR"){
        return dispatch =>{
            let consume = ApiService.request(`${routes.WALLET_HISTORY}?${historyQueryString}`, "GET", null);
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

    function request(user) { return { type: dashboardConstants.GET_TRANSACTION_HISTORY_PENDING, user } }
    function success(response) { return { type: dashboardConstants.GET_TRANSACTION_HISTORY_SUCCESS, response } }
    function failure(error) { return { type: dashboardConstants.GET_TRANSACTION_HISTORY_FAILURE, error } }
    function clear() { return { type: dashboardConstants.GET_TRANSACTION_HISTORY_RESET, clear_data:""} }
}


function DepositCashWithAgent   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            if(requestPayload.stateCode!==""){
                let getAgentsPayload=`?StateId=${requestPayload.stateCode}&LocalGovernmentId=${requestPayload.lgaCode}`
                
                let consume = ApiService.request(`${routes.GET_AGENTS}${getAgentsPayload}`, "GET", null);
                
                dispatch(request(consume));
                return consume
                    .then(response =>{
                        
                        // dispatch(success(response.data));
                    
                        // history.push("/app/create-pin-success");

                            let depositPayload = {
                                transactionPin: null,
                                // transactionPin: requestPayload.transactionPin,
                                walletNumber: requestPayload.walletNumber,
                                depositAmount: requestPayload.depositAmount
                            }
                    
                            let consume2 = ApiService.request(routes.DEPOSIT_CASH_USING_AGENT, "POST", depositPayload);
                            dispatch(request(consume2));
                            return consume2
                                .then(response2 =>{
                                    let resultResponse = {
                                        agents: response.data,
                                        ...response2.data
                                    }
                                    dispatch(success(resultResponse));
                                    history.push("/app/cash-deposit/locations");
                                    // history.push("/app/create-pin-success");
                                })
                                .catch(error =>{
                                    dispatch(failure(handleRequestErrors(error)));
                                });
                        
                        
                    }).catch(error =>{
                        
                        dispatch(failure(handleRequestErrors(error)));
                    });
            }else{
                let depositPayload = {
                    transactionPin: null,
                    // transactionPin: requestPayload.transactionPin,
                    walletNumber: requestPayload.walletNumber,
                    depositAmount: requestPayload.depositAmount
                }
        
                let consume2 = ApiService.request(routes.DEPOSIT_CASH_USING_AGENT, "POST", depositPayload);
                dispatch(request(consume2));
                return consume2
                    .then(response2 =>{
                        let resultResponse = {
                            agents: [],
                            ...response2.data
                        }
                        dispatch(success(resultResponse));
                        history.push("/app/cash-deposit/locations");
                        // history.push("/app/create-pin-success");
                    })
                    .catch(error =>{
                        dispatch(failure(handleRequestErrors(error)));
                    });
            }
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: dashboardConstants.DEPOSIT_USING_AGENT_PENDING, user } }
    function success(response) { return { type: dashboardConstants.DEPOSIT_USING_AGENT_SUCCESS, response } }
    function failure(error) { return { type: dashboardConstants.DEPOSIT_USING_AGENT_FAILURE, error } }
    function clear() { return { type: dashboardConstants.DEPOSIT_USING_AGENT_RESET, clear_data:""} }
}

function LocateAnAgent   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            
                let getAgentsPayload=`?StateId=${requestPayload.stateCode}&LocalGovernmentId=${requestPayload.lgaCode}`
                
                let consume = ApiService.request(`${routes.GET_AGENTS}${getAgentsPayload}`, "GET", null);
                
                dispatch(request(consume));
                return consume
                    .then(response =>{
                        
                        dispatch(success(response.data));
                        history.push("/app/locate-agents/locations");

                        
                        
                    }).catch(error =>{
                        
                        dispatch(failure(handleRequestErrors(error)));
                    });
            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: dashboardConstants.LOCATE_AGENTS_PENDING, user } }
    function success(response) { return { type: dashboardConstants.LOCATE_AGENTS_SUCCESS, response } }
    function failure(error) { return { type: dashboardConstants.LOCATE_AGENTS_FAILURE, error } }
    function clear() { return { type: dashboardConstants.LOCATE_AGENTS_RESET, clear_data:""} }
}


function ChargeACard   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            let consume2 = ApiService.request(routes.CHARGE_CARD, "POST", requestPayload);
                        dispatch(request(consume2));
                        return consume2
                            .then(response2 =>{
                                
                                dispatch(success(response2.data));
                                if(response2.data.isSuccessful===true 
                                    && response2.data.responseObject.responsecode==="success"){
                                    
                                    // dispatch(success(response2.data));
                                    history.push("/app/fund-wallet/success")
                                }
                                
                                if(response2.data.isSuccessful===true 
                                    && response2.data.responseObject.responsecode!=="success" && response2.data.responseObject.responsecode!==""
                                    && response2.data.statusCode==="02"
                                    && response2.data.responseObject.status==="02"){
                                        // dispatch(success(response2.data));
                                        history.push("/app/fund-wallet/confirm-details")
                                }
                                
                                // history.push("/app/fund-wallet/confirm-details");
                                // history.push("/app/fund-wallet/success");
                                // history.push("/app/create-pin-success");
                            })
                            .catch(error =>{
                                dispatch(failure(handleRequestErrors(error)));
                            });
            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: dashboardConstants.CHARGE_A_CARD_PENDING, user } }
    function success(response) { return { type: dashboardConstants.CHARGE_A_CARD_SUCCESS, response } }
    function failure(error) { return { type: dashboardConstants.CHARGE_A_CARD_FAILURE, error } }
    function clear() { return { type: dashboardConstants.CHARGE_A_CARD_RESET, clear_data:""} }
}

function ValidateACard   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            let consume2 = ApiService.request(routes.VALIDATE_CARD, "POST", requestPayload);
                        dispatch(request(consume2));
                        return consume2
                            .then(response2 =>{
                                
                                

                                if(response2.data.isSuccessful===true 
                                    && response2.data.responseObject.responsecode==="success"){
                                    
                                    dispatch(success(response2.data, "completed"));
                                    history.push("/app/fund-wallet/success")
                                }else{
                                    dispatch(success(response2.data, "uncompleted"));
                                }
                               
                               
                                
                                // history.push("/app/fund-wallet/confirm-details");
                                // history.push("/app/fund-wallet/success");
                                // history.push("/app/create-pin-success");
                            })
                            .catch(error =>{
                                dispatch(failure(handleRequestErrors(error)));
                            });
            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: dashboardConstants.VALIDATE_A_CARD_PENDING, user } }
    function success(response, requestType) { return { type: dashboardConstants.VALIDATE_A_CARD_SUCCESS, response, requestType } }
    function failure(error) { return { type: dashboardConstants.VALIDATE_A_CARD_FAILURE, error } }
    function clear() { return { type: dashboardConstants.VALIDATE_A_CARD_RESET, clear_data:""} }
}

function QueryCardValidationState   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            let consume2 = ApiService.request(routes.QUERY_CARDVALIDATION_STATUS, "POST", requestPayload);
                        dispatch(request(consume2));
                        return consume2
                            .then(response2 =>{
                               
                                

                                if(response2.data.isSuccessful===true 
                                    && response2.data.responseObject.responsecode==="success"){
                                    
                                    dispatch(success(response2.data, "completed"));
                                    // history.push("/app/fund-wallet/success")
                                }else{
                                    dispatch(success(response2.data, "uncompleted"));
                                }
                               
                               
                                
                                // history.push("/app/fund-wallet/confirm-details");
                                // history.push("/app/fund-wallet/success");
                                // history.push("/app/create-pin-success");
                            })
                            .catch(error =>{
                                dispatch(failure(handleRequestErrors(error)));
                            });
            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: dashboardConstants.QUERY_CARD_VALIDATIONSTATE_PENDING, user } }
    function success(response, requestType) { return { type: dashboardConstants.QUERY_CARD_VALIDATIONSTATE_SUCCESS, response, requestType } }
    function failure(error) { return { type: dashboardConstants.QUERY_CARD_VALIDATIONSTATE_FAILURE, error } }
    function clear() { return { type: dashboardConstants.QUERY_CARD_VALIDATIONSTATE_RESET, clear_data:""} }
}