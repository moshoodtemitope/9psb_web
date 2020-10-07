import { ApiService } from "../../../services/apiService";
import { routes } from "../../../services/urls";
import { history } from '../../../_helpers/history';
import {paymentsConstants} from '../../actiontypes/payments/payments.constants'
import { handleRequestErrors, saveRouteForRedirect, removeRouteForRedirect } from "../../../shared/utils";

export const paymentActions = {
    TranferToPhoneStep1,
    TranferToPhoneNumber,
    GetTransferBeneficiaries,
    GetBanks,
    confirmBeneficiary,
    TranferToBankAccount,
    saveRecipientData,


    GetAirtimeBeneficiaries,
    AddAirtimeBeneficiary,
    DeleteAirtimeBeneficiary,
    saveAirtimeRecipientData,
    AirtimeTopUp,


    GetDataTopUpPlans,
    GetDataTopUpBeneficiaries,
    AddDataTopUpBeneficiary,
    DeleteDataTopUpBeneficiary,
    saveDataTopUpRecipientData,
    DataTopUpTopUp,


    GetBillsCategories,
    GetBillersByCategory,
    GetAllBillerPaymentItem,
    validateCustomerForBillPayment,
    makeCustomerPaymentForBill,


    CardlessWithdrawalStep1,
    CardlessWithdrawalStep2,

    AgentWithdrawalStep1,
    AgentWithdrawalStep2,

    GetAgents

}

//FUNDS TRANSFER
function TranferToPhoneStep1   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            let payload={
                mobileNumber: requestPayload.toMobileNumber
            }
            let consume = ApiService.request(`${routes.CONFIRM_ACCOUNT_WITH_PHONE}`, "POST", payload);
            dispatch(request(consume));
            return consume
                .then(response =>{
                    
                    dispatch(success({
                        ...requestPayload,
                        ...response.data
                        }));

                    history.push("/app/transfer/confirm")
                    
                }).catch(error =>{
                    dispatch(failure(handleRequestErrors(error)));
                    
                });
            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }
    function request(user) { return { type: paymentsConstants.TRANSFER_TO_PHONE_STEP1_PENDING, user } }
    function success(response) { return { type: paymentsConstants.TRANSFER_TO_PHONE_STEP1_SUCCESS, response } }
    function failure(error) { return { type: paymentsConstants.TRANSFER_TO_PHONE_STEP1_FAILURE, error } }
    function clear() { return { type: paymentsConstants.TRANSFER_TO_PHONE_STEP1_RESET, clear_data:""} }
}

function TranferToPhoneNumber   (requestPayload, saveBeneficiary){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            if(saveBeneficiary===false){
                let consume = ApiService.request(`${routes.TRANSFER_TO_PHONE_NUMBER}`, "POST", requestPayload.transferInfo);
                dispatch(request(consume));
                return consume
                    .then(response =>{
                       
                        dispatch(success(requestPayload.transferInfo));
                        history.push("/app/transfer/success");
                    
                        
                    }).catch(error =>{
                        dispatch(failure(handleRequestErrors(error),"transfer"));
                        
                    });
            }

            // if(saveBeneficiary===true){
            //     let consume = ApiService.request(`${routes.SAVE_TRANSFER_BENEFICIARY}`, "POST", requestPayload.beneficiaryInfo);
            //     dispatch(request(consume));
            //     return consume
            //         .then(response =>{
                        
            //             // dispatch(success(response.data));
            //             let consume2 = ApiService.request(`${routes.TRANSFER_TO_PHONE_NUMBER}`, "POST", requestPayload.transferInfo);
            //             dispatch(request(consume2));
            //             return consume2
            //                 .then(response =>{
            //                     history.push("/app/transfer/success");
            //                     dispatch(success(requestPayload.transferInfo));
                            
                                
            //                 }).catch(error =>{
            //                     dispatch(failure(handleRequestErrors(error), "transfer"));
                                
            //                 });
                    
                        
            //         }).catch(error =>{
            //             dispatch(failure(handleRequestErrors(error)), "savebeneficiary");
                        
            //         });
            // }

            if(saveBeneficiary===true){
                let consume = ApiService.request(`${routes.TRANSFER_TO_PHONE_NUMBER}`, "POST", requestPayload.transferInfo);
                dispatch(request(consume));
                return consume
                    .then(response =>{
                        
                       
                        let consume2 = ApiService.request(`${routes.SAVE_TRANSFER_BENEFICIARY}`, "POST", requestPayload.beneficiaryInfo);
                        dispatch(request(consume2));
                        return consume2
                            .then(response =>{
                                dispatch(success(requestPayload.transferInfo));
                                history.push("/app/transfer/success");
                                
                            
                                
                            }).catch(error =>{
                                dispatch(success(requestPayload.transferInfo));
                                history.push("/app/transfer/success");
                                
                                // dispatch(failure(handleRequestErrors(error), "savebeneficiary"));
                                
                            });
                    
                        
                    }).catch(error =>{
                        dispatch(failure(handleRequestErrors(error)), "transfer");
                        
                    });
            }
            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: paymentsConstants.TRANSFER_TO_PHONE_NUMBER_PENDING, user } }
    function success(response) { return { type: paymentsConstants.TRANSFER_TO_PHONE_NUMBER_SUCCESS, response } }
    function failure(error, failedRequest) { return { type: paymentsConstants.TRANSFER_TO_PHONE_NUMBER_FAILURE, error, failedRequest } }
    function clear() { return { type: paymentsConstants.TRANSFER_TO_PHONE_NUMBER_RESET, clear_data:""} }
}

function GetTransferBeneficiaries   (){
    
    return dispatch =>{
        let consume = ApiService.request(routes.GET_TRANSFER_BENEFICIARIES, "GET", null);
        dispatch(request(consume));
        return consume
            .then(response =>{
                
                dispatch(success(response.data));
                
                
            }).catch(error =>{
                dispatch(failure(handleRequestErrors(error)));
                
            });
        
    }
        
    

   

    function request(user) { return { type: paymentsConstants.GET_TRANSFER_BENEFICIARIES_PENDING, user } }
    function success(response) { return { type: paymentsConstants.GET_TRANSFER_BENEFICIARIES_SUCCESS, response } }
    function failure(error) { return { type: paymentsConstants.GET_TRANSFER_BENEFICIARIES_FAILURE, error } }
    
}

function GetBanks   (){
    
    return dispatch =>{
        let consume = ApiService.request(routes.GET_BANKS, "GET", null);
        dispatch(request(consume));
        return consume
            .then(response =>{
                
                dispatch(success(response.data));
                
                
            }).catch(error =>{
                dispatch(failure(handleRequestErrors(error)));
                
            });
        
    }
        
    

   

    function request(user) { return { type: paymentsConstants.GET_BANKS_PENDING, user } }
    function success(response) { return { type: paymentsConstants.GET_BANKS_SUCCESS, response } }
    function failure(error) { return { type: paymentsConstants.GET_BANKS_FAILURE, error } }
    
}

function confirmBeneficiary   (BeneficiaryData, source){
    if(BeneficiaryData!=="CLEAR"){
        return dispatch =>{
            let accountInfo = {
                accountNumber: BeneficiaryData.accountNumber,
                bankCode: BeneficiaryData.bankCode
            };
            let consume = ApiService.request(`${routes.CONFIRM_ACCOUNT}`, "POST", accountInfo);
                dispatch(request(consume));
                return consume
                    .then(response =>{
                        
                        if(source==="saved"){
                            // if(BeneficiaryData.accountName ===response.data.displayName){
                                dispatch(saveData({...BeneficiaryData, ...response.data}));
                                history.push("/app/transfer/to-bank/sendTobeneficiary");
                                
                            // }
                            // else{
                            //     dispatch(clear());
                            //     history.push("/app/transfer/to-bank/provide-details")
                            
                            // }
                        }
                        if(source==="new"){
                            dispatch(saveData({...BeneficiaryData, ...response.data}));
                            history.push("/app/transfer/to-bank/confirm-new");
                        }
                    
                        
                    }).catch(error =>{
                        dispatch(failure(handleRequestErrors(error)));
                        
                    });
            
            // dispatch(saveData(BeneficiaryData));
            
        }
    }
    

    return dispatch =>{
        
        dispatch(clear());
        
    }
    

   
    function request(user) { return { type: paymentsConstants.CONFIRM_ACCOUNT_PENDING, user } }
    function saveData(customerData) { return { type: paymentsConstants.STORE_BENEFICIARY_DATA, customerData } }
    function failure(error) { return { type: paymentsConstants.CONFIRM_ACCOUNT_FAILURE, error } }
    function clear() { return { type: paymentsConstants.CLEAR_STORED_BENEFICIARY_DATA, clear_data:""} }
}

function saveRecipientData   (BeneficiaryData){
    if(BeneficiaryData!=="CLEAR"){
        return dispatch =>{
            dispatch(saveData(BeneficiaryData));
            history.push("/app/transfer/to-bank/confirm");
            
        }
    }
    

    return dispatch =>{
        
        dispatch(clear());
        
    }
    

   
    
    function saveData(customerData) { return { type: paymentsConstants.STORE_RECIPIENT_DATA, customerData } }
    function clear() { return { type: paymentsConstants.CLEAR_STORED_RECIPIENT_DATA, clear_data:""} }
}

function TranferToBankAccount   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            
            let consume = ApiService.request(`${routes.TRANSFER_TO_ACCOUNT}`, "POST", requestPayload.main);
            dispatch(request(consume));
            return consume
                .then(response =>{
                    // dispatch(saveRecipientData("CLEAR"))
                    // dispatch(confirmBeneficiary("CLEAR"))
                    dispatch(success(requestPayload));
                    history.push("/app/transfer/to-bank/success");
                    
                
                    
                }).catch(error =>{
                    dispatch(failure(handleRequestErrors(error)));
                    
                });
            

            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: paymentsConstants.TRANSFER_TO_BANK_PENDING, user } }
    function success(response) { return { type: paymentsConstants.TRANSFER_TO_BANK_SUCCESS, response } }
    function failure(error) { return { type: paymentsConstants.TRANSFER_TO_BANK_FAILURE, error } }
    function clear() { return { type: paymentsConstants.TRANSFER_TO_BANK_RESET, clear_data:""} }
}



//CASH WITHDRAWAL
function CardlessWithdrawalStep1   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            
            let consume = ApiService.request(`${routes.ADD_DATA_TOPUP_BENEFICIARY}`, "POST", requestPayload);
            dispatch(request(consume));
            return consume
                .then(response =>{
                    
                    dispatch(success(response.data));
                    // dispatch(GetDataTopUpBeneficiaries("CLEAR"))
                    // history.push("/app/buy-data/others/choose");
                    
                }).catch(error =>{
                    dispatch(failure(handleRequestErrors(error)));
                    
                });
            

            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: paymentsConstants.CARDLESS_WITHDRAWAL_STEP1_PENDING, user } }
    function success(response) { return { type: paymentsConstants.CARDLESS_WITHDRAWAL_STEP1_SUCCESS, response } }
    function failure(error) { return { type: paymentsConstants.CARDLESS_WITHDRAWAL_STEP1_FAILURE, error } }
    function clear() { return { type: paymentsConstants.CARDLESS_WITHDRAWAL_STEP1_RESET, clear_data:""} }
}

function CardlessWithdrawalStep2   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            
            let consume = ApiService.request(`${routes.CARDLESS_WITHDRAWAL}`, "POST", requestPayload);
            dispatch(request(consume));
            return consume
                .then(response =>{
                    
                    dispatch(success(response.data));
                    history.push("/app/cash-withdrawal/success");
                    
                }).catch(error =>{
                    dispatch(failure(handleRequestErrors(error)));
                    
                });
            

            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: paymentsConstants.CARDLESS_WITHDRAWAL_STEP2_PENDING, user } }
    function success(response) { return { type: paymentsConstants.CARDLESS_WITHDRAWAL_STEP2_SUCCESS, response } }
    function failure(error) { return { type: paymentsConstants.CARDLESS_WITHDRAWAL_STEP2_FAILURE, error } }
    function clear() { return { type: paymentsConstants.CARDLESS_WITHDRAWAL_STEP2_RESET, clear_data:""} }
}


function AgentWithdrawalStep1   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            
            let consume = ApiService.request(`${routes.ADD_DATA_TOPUP_BENEFICIARY}`, "POST", requestPayload);
            dispatch(request(consume));
            return consume
                .then(response =>{
                    
                    dispatch(success(response.data));
                    // dispatch(GetDataTopUpBeneficiaries("CLEAR"))
                    // history.push("/app/buy-data/others/choose");
                    
                }).catch(error =>{
                    dispatch(failure(handleRequestErrors(error)));
                    
                });
            

            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: paymentsConstants.AGENT_WITHDRAWAL_STEP1_PENDING, user } }
    function success(response) { return { type: paymentsConstants.AGENT_WITHDRAWAL_STEP1_SUCCESS, response } }
    function failure(error) { return { type: paymentsConstants.AGENT_WITHDRAWAL_STEP1_FAILURE, error } }
    function clear() { return { type: paymentsConstants.AGENT_WITHDRAWAL_STEP1_RESET, clear_data:""} }
}

function AgentWithdrawalStep2   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            
            let consume = ApiService.request(`${routes.AGENT_WITHDRAWAL}`, "POST", requestPayload);
            dispatch(request(consume));
            return consume
                .then(response =>{
                    
                    dispatch(success(response.data));
                    // dispatch(GetDataTopUpBeneficiaries("CLEAR"))
                    // history.push("/app/buy-data/others/choose");
                    
                    
                }).catch(error =>{
                    dispatch(failure(handleRequestErrors(error)));
                    
                });
            

            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: paymentsConstants.AGENT_WITHDRAWAL_STEP2_PENDING, user } }
    function success(response) { return { type: paymentsConstants.AGENT_WITHDRAWAL_STEP2_SUCCESS, response } }
    function failure(error) { return { type: paymentsConstants.AGENT_WITHDRAWAL_STEP2_FAILURE, error } }
    function clear() { return { type: paymentsConstants.AGENT_WITHDRAWAL_STEP2_RESET, clear_data:""} }
}


//GET AGENTS
function GetAgents   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            
            let getAgentsPayload=`?StateId=${requestPayload.stateCode}&LocalGovernmentId=${requestPayload.lgaCode}`
            
            let consume = ApiService.request(`${routes.GET_AGENTS}${getAgentsPayload}`, "GET", null);
            dispatch(request(consume));
            return consume
                .then(response =>{
                    dispatch(success(response.data));
                    history.push("/app/cash-withdrawal/agents/locations");
                    
                }).catch(error =>{
                    dispatch(failure(handleRequestErrors(error)));
                    
                });
            

            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: paymentsConstants.GET_AGENTS_PENDING, user } }
    function success(response) { return { type: paymentsConstants.GET_AGENTS_SUCCESS, response } }
    function failure(error) { return { type: paymentsConstants.GET_AGENTS_FAILURE, error } }
    function clear() { return { type: paymentsConstants.GET_AGENTS_RESET, clear_data:""} }
}


///AIRTIME TOP UP

function GetAirtimeBeneficiaries   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            
            let consume = ApiService.request(`${routes.GET_AIRTIME_BENEFICIARIES}`, "GET", null);
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

    function request(user) { return { type: paymentsConstants.FETCH_AIRTIME_BENEFICIARIES_PENDING, user } }
    function success(response) { return { type: paymentsConstants.FETCH_AIRTIME_BENEFICIARIES_SUCCESS, response } }
    function failure(error) { return { type: paymentsConstants.FETCH_AIRTIME_BENEFICIARIES_FAILURE, error } }
    function clear() { return { type: paymentsConstants.FETCH_AIRTIME_BENEFICIARIES_RESET, clear_data:""} }
}

function AddAirtimeBeneficiary   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            
            let consume = ApiService.request(`${routes.ADD_AIRTIME_BENEFICIARY}`, "POST", requestPayload);
            dispatch(request(consume));
            return consume
                .then(response =>{
                    
                    dispatch(success(response.data));
                    dispatch(GetAirtimeBeneficiaries("CLEAR"))
                    history.push("/app/buy-airtime/others/choose");
                    
                }).catch(error =>{
                    dispatch(failure(handleRequestErrors(error)));
                    
                });
            

            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: paymentsConstants.SAVE_AIRTIME_BENEFICIARY_PENDING, user } }
    function success(response) { return { type: paymentsConstants.SAVE_AIRTIME_BENEFICIARY_SUCCESS, response } }
    function failure(error) { return { type: paymentsConstants.SAVE_AIRTIME_BENEFICIARY_FAILURE, error } }
    function clear() { return { type: paymentsConstants.SAVE_AIRTIME_BENEFICIARY_RESET, clear_data:""} }
}


function DeleteAirtimeBeneficiary   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            
            let consume = ApiService.request(`${routes.DELETE_AIRTIME_BENEFICIARY}`, "POST", requestPayload);
            dispatch(request(consume));
            return consume
                .then(response =>{
                    
                    dispatch(success(response.data));
                    dispatch(GetAirtimeBeneficiaries())
                    
                    
                }).catch(error =>{
                    dispatch(failure(handleRequestErrors(error)));
                    
                });
            

            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: paymentsConstants.DELETE_AIRTIME_BENEFICIARY_PENDING, user } }
    function success(response) { return { type: paymentsConstants.DELETE_AIRTIME_BENEFICIARY_SUCCESS, response } }
    function failure(error) { return { type: paymentsConstants.DELETE_AIRTIME_BENEFICIARY_FAILURE, error } }
    function clear() { return { type: paymentsConstants.DELETE_AIRTIME_BENEFICIARY_RESET, clear_data:""} }
}

function saveAirtimeRecipientData   (BeneficiaryData, source, txtType){
    if(BeneficiaryData!=="CLEAR"){
        return dispatch =>{
            dispatch(saveData(BeneficiaryData, source));
            if(txtType==="others"){
                if(source===null || source===undefined){
                    history.push("/app/buy-airtime/others/confirm");
                }

                if(source==="landing"){
                    history.push("/app/buy-airtime/others");
                }
            }

            if(txtType==="self"){
                history.push("/app/buy-airtime/confirm");
                
            }
            
        }
    }
    

    return dispatch =>{
        
        dispatch(clear());
        
    }
    

   
    
    function saveData(customerData) { return { type: paymentsConstants.STORE_AIRTIME_RECIPIENT_DATA, customerData, source, txtType } }
    function clear() { return { type: paymentsConstants.CLEAR_STORED_AIRTIME_RECIPIENT_DATA, clear_data:""} }
}

function AirtimeTopUp   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            
            let consume = ApiService.request(`${routes.AIRTIME_RECHARGE}`, "POST", requestPayload);
            dispatch(request(consume));
            return consume
                .then(response =>{
                    
                    dispatch(success(response.data));
                    history.push("/app/buy-airtime/success");
                    
                }).catch(error =>{
                    dispatch(failure(handleRequestErrors(error)));
                    
                });
            

            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: paymentsConstants.BUY_AIRTIME_PENDING, user } }
    function success(response) { return { type: paymentsConstants.BUY_AIRTIME_SUCCESS, response } }
    function failure(error) { return { type: paymentsConstants.BUY_AIRTIME_FAILURE, error } }
    function clear() { return { type: paymentsConstants.BUY_AIRTIME_RESET, clear_data:""} }
}

//DATA TOPUP PAYMENT

function GetDataTopUpPlans   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            
            let consume = ApiService.request(`${routes.GET_DATA_TOPUP_PLANS}`, "GET", null);
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

    function request(user) { return { type: paymentsConstants.FETCH_DATATOPUP_PLANS_PENDING, user } }
    function success(response) { return { type: paymentsConstants.FETCH_DATATOPUP_PLANS_SUCCESS, response } }
    function failure(error) { return { type: paymentsConstants.FETCH_DATATOPUP_PLANS_FAILURE, error } }
    function clear() { return { type: paymentsConstants.FETCH_DATATOPUP_PLANS_RESET, clear_data:""} }
}

function GetDataTopUpBeneficiaries   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            
            let consume = ApiService.request(`${routes.GET_DATA_TOPUP_BENEFICIARIES}`, "GET", null);
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

    function request(user) { return { type: paymentsConstants.FETCH_DATATOPUP_BENEFICIARIES_PENDING, user } }
    function success(response) { return { type: paymentsConstants.FETCH_DATATOPUP_BENEFICIARIES_SUCCESS, response } }
    function failure(error) { return { type: paymentsConstants.FETCH_DATATOPUP_BENEFICIARIES_FAILURE, error } }
    function clear() { return { type: paymentsConstants.FETCH_DATATOPUP_BENEFICIARIES_RESET, clear_data:""} }
}

function AddDataTopUpBeneficiary   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            
            let consume = ApiService.request(`${routes.ADD_DATA_TOPUP_BENEFICIARY}`, "POST", requestPayload);
            dispatch(request(consume));
            return consume
                .then(response =>{
                    
                    dispatch(success(response.data));
                    dispatch(GetDataTopUpBeneficiaries("CLEAR"))
                    history.push("/app/buy-data/others/choose");
                    
                }).catch(error =>{
                    dispatch(failure(handleRequestErrors(error)));
                    
                });
            

            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: paymentsConstants.SAVE_DATATOPUP_BENEFICIARY_PENDING, user } }
    function success(response) { return { type: paymentsConstants.SAVE_DATATOPUP_BENEFICIARY_SUCCESS, response } }
    function failure(error) { return { type: paymentsConstants.SAVE_DATATOPUP_BENEFICIARY_FAILURE, error } }
    function clear() { return { type: paymentsConstants.SAVE_DATATOPUP_BENEFICIARY_RESET, clear_data:""} }
}

function DeleteDataTopUpBeneficiary   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            
            let consume = ApiService.request(`${routes.DELETE_DATA_TOPUP_BENEFICIARY}`, "POST", requestPayload);
            dispatch(request(consume));
            return consume
                .then(response =>{
                    
                    dispatch(success(response.data));
                    dispatch(GetDataTopUpBeneficiaries());
                    
                }).catch(error =>{
                    dispatch(failure(handleRequestErrors(error)));
                    
                });
            

            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: paymentsConstants.DELETE_DATATOPUP_BENEFICIARY_PENDING, user } }
    function success(response) { return { type: paymentsConstants.DELETE_DATATOPUP_BENEFICIARY_SUCCESS, response } }
    function failure(error) { return { type: paymentsConstants.DELETE_DATATOPUP_BENEFICIARY_FAILURE, error } }
    function clear() { return { type: paymentsConstants.DELETE_DATATOPUP_BENEFICIARY_RESET, clear_data:""} }
}

function saveDataTopUpRecipientData   (BeneficiaryData, source, txtType){
    if(BeneficiaryData!=="CLEAR"){
        return dispatch =>{
            dispatch(saveData(BeneficiaryData, source));
            if(txtType==="others"){
                if(source===null || source===undefined){
                    history.push("/app/buy-data/others/confirm");
                }

                if(source==="landing"){
                    history.push("/app/buy-data/others");
                }
            }

            if(txtType==="self"){
                history.push("/app/buy-data/confirm");
                
            }
            
        }
    }
    

    return dispatch =>{
        
        dispatch(clear());
        
    }
    

   
    
    function saveData(customerData) { return { type: paymentsConstants.STORE_DATATOPUP_RECIPIENT_DATA, customerData, source, txtType } }
    function clear() { return { type: paymentsConstants.CLEAR_STORED_DATATOPUP_RECIPIENT_DATA, clear_data:""} }
}

function DataTopUpTopUp   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            
            let consume = ApiService.request(`${routes.DATA_TOPUP}`, "POST", requestPayload);
            dispatch(request(consume));
            return consume
                .then(response =>{
                    
                    dispatch(success(response.data));
                    history.push("/app/buy-data/success");
                    
                }).catch(error =>{
                    dispatch(failure(handleRequestErrors(error)));
                    
                });
            

            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: paymentsConstants.BUY_DATATOPUP_PENDING, user } }
    function success(response) { return { type: paymentsConstants.BUY_DATATOPUP_SUCCESS, response } }
    function failure(error) { return { type: paymentsConstants.BUY_DATATOPUP_FAILURE, error } }
    function clear() { return { type: paymentsConstants.BUY_DATATOPUP_RESET, clear_data:""} }
}



//BILLS PAYMENT
function GetBillsCategories   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            
            let consume = ApiService.request(`${routes.GET_BILLS_CATEGORIES}`, "GET", null);
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

    function request(user) { return { type: paymentsConstants.GET_BILLS_CATEGORIES_PENDING, user } }
    function success(response) { return { type: paymentsConstants.GET_BILLS_CATEGORIES_SUCCESS, response } }
    function failure(error) { return { type: paymentsConstants.GET_BILLS_CATEGORIES_FAILURE, error } }
    function clear() { return { type: paymentsConstants.GET_BILLS_CATEGORIES_RESET, clear_data:""} }
}

function GetBillersByCategory   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            
            let consume = ApiService.request(`${routes.GET_BILLER_BY_CATEGORY}?CategoryId=${requestPayload}`, "GET", null);
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

    function request(user) { return { type: paymentsConstants.GET_BILLERS_BY_CATEGORY_PENDING, user } }
    function success(response) { return { type: paymentsConstants.GET_BILLERS_BY_CATEGORY_SUCCESS, response } }
    function failure(error) { return { type: paymentsConstants.GET_BILLERS_BY_CATEGORY_FAILURE, error } }
    function clear() { return { type: paymentsConstants.GET_BILLERS_BY_CATEGORY_RESET, clear_data:""} }
}

function GetAllBillerPaymentItem   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            
            let consume = ApiService.request(`${routes.GET_BILLER_PAYMENT_ITEM}${requestPayload}`, "GET", null);
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

    function request(user) { return { type: paymentsConstants.GET_ALLBILLER_PAYMENT_ITEM_PENDING, user } }
    function success(response) { return { type: paymentsConstants.GET_ALLBILLER_PAYMENT_ITEM_SUCCESS, response } }
    function failure(error) { return { type: paymentsConstants.GET_ALLBILLER_PAYMENT_ITEM_FAILURE, error } }
    function clear() { return { type: paymentsConstants.GET_ALLBILLER_PAYMENT_ITEM_RESET, clear_data:""} }
}

function validateCustomerForBillPayment   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            
            let consume = ApiService.request(`${routes.VALIDATE_CUSTOMER}`, "POST", requestPayload.forRequest);
            dispatch(request(consume));
            return consume
                .then(response =>{
                    
                    dispatch(success({...response.data,
                                        requestPayload:{...requestPayload}
                                    }));
                    history.push("/app/pay-bills/confirm");
                    
                }).catch(error =>{
                    dispatch(failure(handleRequestErrors(error)));
                    
                });
            

            
        }
        
    }

    return dispatch =>{
        
        dispatch(clear());
        
    }

    function request(user) { return { type: paymentsConstants.VALIDATE_CUSTOMER_FOR_BILL_PENDING, user } }
    function success(response) { return { type: paymentsConstants.VALIDATE_CUSTOMER_FOR_BILL_SUCCESS, response } }
    function failure(error) { return { type: paymentsConstants.VALIDATE_CUSTOMER_FOR_BILL_FAILURE, error } }
    function clear() { return { type: paymentsConstants.VALIDATE_CUSTOMER_FOR_BILL_RESET, clear_data:""} }
}

function makeCustomerPaymentForBill   (requestPayload){
    if(requestPayload!=="CLEAR"){
        return dispatch =>{
            
            let consume = ApiService.request(`${routes.PAY_FOR_BILL}`, "POST", requestPayload);
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

    function request(user) { return { type: paymentsConstants.PAY_FOR_BILL_PENDING, user } }
    function success(response) { return { type: paymentsConstants.PAY_FOR_BILL_SUCCESS, response } }
    function failure(error) { return { type: paymentsConstants.PAY_FOR_BILL_FAILURE, error } }
    function clear() { return { type: paymentsConstants.PAY_FOR_BILL_RESET, clear_data:""} }
}


