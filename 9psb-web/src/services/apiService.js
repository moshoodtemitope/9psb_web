import { dispatch } from "rxjs/internal/observable/pairs";
import { onboardingActions } from "../redux/actions/onboarding/onboarding";
import {history} from "../_helpers/history";
import { routes } from "../services/urls";
// import {saveRouteForRedirect} from "../shared/utils";
import {createTransactionSigner} from '../shared/shared-utils/index';
import { numberWithCommas} from '../shared/utils';




const axios = require('axios');

export class ApiService {

    state = {
        redirect: false
    };


    static setTokenAuthorization = (url)=>{
        let urlsWithoutAuthentication = [
                "login",
                "App/checkifuserexists",
                "App/createaccount",
                "App/validateotp",
                "App/resendotp",
                // "App/updateuserprofile",
            ],
            
            binaryUploadUrls =[
                "FileUpload/uploadfile",
            ],

            skipTokenRefreshForUrls =[
                "Identity/refreshtoken",
            ];

        axios.defaults.headers.common['CS'] = 2;

        if(localStorage.getItem("psb-auth") === null){
            // if(localStorage.getItem("psb-auth") === null && axios.defaults.headers.common["Token"]){
            
            delete axios.defaults.headers.common.Authorization;
        }
        // if (binaryUploadUrls.indexOf(serviceToTest) === -1) {
            axios.defaults.headers.common['Content-Type'] = 'application/json';
        // }
        
        
       if(localStorage.getItem("psb-auth") !==null){
           
           let user = JSON.parse(localStorage.getItem("psb-auth")),
                serviceToTest = url.split("api/")[1];
              
            //Exclude urlsWithoutAuthentication urls from Authenticated requests with Token
           if (urlsWithoutAuthentication.indexOf(serviceToTest) === -1) {
            //    axios.defaults.headers.common['Token'] = user.token;
            //    axios.defaults.headers.common['Authorization'] = `Bearer ddsdsdiysdij`;
               axios.defaults.headers.common['Authorization'] = `Bearer ${user.accessToken}`;
            
                
                
                
               
           }

           if (binaryUploadUrls.indexOf(serviceToTest) === -1) {
           
               axios.defaults.headers.common['Content-Type'] = 'application/json';
           }
           if (binaryUploadUrls.indexOf(serviceToTest) > -1) {
           
               axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';
           }

           
           
            
            
            axios.defaults.headers.common['Accept'] = 'application/json';

            
       }
    }


    static signTransaction = (url, payload)=>{

        let transferUrls=[
                "Customer/transfertophonenumber",
                "Customer/transfertoaccount",
            ],
            airtmeUrls=[
                "Customer/recharge",
            ],
            dataUrls=[
                "Customer/recharge",
            ],
            billsUrls=[
                "App/paybill",
            ],
            withdrawalUrls=[
                "Customer/transfertoagent",
            ],
            historyUrls=
                // [
                "Customer/wallethistory",
            // ],
            cashDepositUrls=[
                "Customer/depositusingagent",
            ],
            serviceToTest,
            transactionAuth;

            if(localStorage.getItem("psb-auth") === null){
                
                delete axios.defaults.headers.common.transactionAuth;
            }else{

                serviceToTest = url.split("api/")[1];
                let userData = JSON.parse(localStorage.getItem("psb-auth"));

                // console.log("ajajaja", serviceToTest);
                if(transferUrls.indexOf(serviceToTest)===-1
                    && airtmeUrls.indexOf(serviceToTest)===-1
                    && dataUrls.indexOf(serviceToTest)===-1
                    && billsUrls.indexOf(serviceToTest)===-1){

                        delete axios.defaults.headers.common.transactionAuth;
                }

                
                if(transferUrls.indexOf(serviceToTest)>-1){
                    let destination, amount;
                    if(payload.toMobileNumber!==undefined){
                        destination = payload.toMobileNumber
                    }
                    if(payload.accountNumber!==undefined){
                        destination = payload.accountNumber
                    }
                    amount = numberWithCommas(payload.amount, true).replace(/,/g, '')

                    transactionAuth  = createTransactionSigner(`${userData.cif}|${payload.sourceAccountNumber}|${destination}|${amount}`);
                    // axios.defaults.headers.common['transactionAuth'] = ;
                    // console.log("jkjkjk", createTransactionSigner(`${userData.cif}|${payload.sourceAccountNumber}|${destination}|${amount}`));

                    axios.defaults.headers.common['transactionAuth'] = createTransactionSigner(`${userData.cif}|${payload.sourceAccountNumber}|${destination}|${amount}`);
                }
                if(withdrawalUrls.indexOf(serviceToTest)>-1){
                    let withdrawalAmount, walletNumber;
                    if(payload.walletNumber!==undefined){
                        walletNumber = payload.walletNumber
                    }
                    if(payload.withdrawalAmount!==undefined){
                        withdrawalAmount = numberWithCommas(payload.withdrawalAmount, true).replace(/,/g, '')
                    }
                    transactionAuth  = createTransactionSigner(`${userData.cif}|${walletNumber}|${userData.mobileNumber}|${withdrawalAmount}`);
                    // axios.defaults.headers.common['transactionAuth'] = ;
                    axios.defaults.headers.common['transactionAuth'] = createTransactionSigner(`${userData.cif}|${walletNumber}|${userData.mobileNumber}|${withdrawalAmount}`);
                }

                // if(historyUrls.indexOf(serviceToTest)>-1){
                //     let withdrawalAmount, walletNumber;
                    
                //     if(payload.walletNumber!==undefined){
                //         walletNumber = payload.walletNumber
                //     }
                    
                //     transactionAuth  = createTransactionSigner(`${userData.cif}|${walletNumber}`);
                //     // axios.defaults.headers.common['transactionAuth'] = ;
                //     axios.defaults.headers.common['transactionAuth'] = createTransactionSigner(`${userData.cif}|${walletNumber}`);
                // }

                if(serviceToTest.indexOf(historyUrls)>-1){
                    let withdrawalAmount, walletNumber;
                    let urlParams = serviceToTest.split("?")[1],
                        walletObj = urlParams.split("&")[0];
                        walletNumber = walletObj.split("=")[1];

                    
                    // if(payload.walletNumber!==undefined){
                    //     walletNumber = payload.walletNumber
                    // }
                    // console.log("unsigned", `${userData.cif}|${walletNumber}`)
                    transactionAuth  = createTransactionSigner(`${userData.cif}|${walletNumber}`);
                    // axios.defaults.headers.common['transactionAuth'] = ;
                    axios.defaults.headers.common['transactionAuth'] = createTransactionSigner(`${userData.cif}|${walletNumber}`);
                }

                if(airtmeUrls.indexOf(serviceToTest)>-1){
                    let amount, walletNumber;
                    if(payload.walletNumber!==undefined){
                        walletNumber = payload.walletNumber
                    }
                    if(payload.amount!==undefined){
                        amount = numberWithCommas(payload.amount, true).replace(/,/g, '')
                    }
                    // console.log("unsigned is", `${userData.cif}|${walletNumber}|${payload.recipient}|${amount}`);
                    transactionAuth  = createTransactionSigner(`${userData.cif}|${walletNumber}|${payload.recipient}|${amount}`);
                    // axios.defaults.headers.common['transactionAuth'] = ;
                    axios.defaults.headers.common['transactionAuth'] = createTransactionSigner(`${userData.cif}|${walletNumber}|${payload.recipient}|${amount}`);
                }

                if(cashDepositUrls.indexOf(serviceToTest)>-1){
                    let depositAmount, walletNumber;
                    if(payload.walletNumber!==undefined){
                        walletNumber = payload.walletNumber
                    }
                    if(payload.depositAmount!==undefined){
                        depositAmount = numberWithCommas(payload.depositAmount, true).replace(/,/g, '')
                    }
                    // console.log("unsigned is", `${userData.cif}|${walletNumber}|${payload.recipient}|${amount}`);
                    transactionAuth  = createTransactionSigner(`${userData.cif}|${walletNumber}|${depositAmount}`);
                    // axios.defaults.headers.common['transactionAuth'] = ;
                    axios.defaults.headers.common['transactionAuth'] = createTransactionSigner(`${userData.cif}|${walletNumber}|${depositAmount}`);
                }

                if(dataUrls.indexOf(serviceToTest)>-1){
                    let amount, walletNumber;
                    if(payload.walletNumber!==undefined){
                        walletNumber = payload.walletNumber
                    }
                    if(payload.amount!==undefined){
                        amount = numberWithCommas(payload.amount, true).replace(/,/g, '')
                    }
                    transactionAuth  = createTransactionSigner(`${userData.cif}|${walletNumber}|${payload.recipient}|${amount}`);
                    // axios.defaults.headers.common['transactionAuth'] = ;
                    axios.defaults.headers.common['transactionAuth'] = createTransactionSigner(`${userData.cif}|${walletNumber}|${payload.recipient}|${amount}`);
                }

                if(billsUrls.indexOf(serviceToTest)>-1){
                    let amount, walletNumber;
                    if(payload.walletNumber!==undefined){
                        walletNumber = payload.walletNumber
                    }
                    if(payload.amount!==undefined){
                        amount = numberWithCommas(payload.amount, true).replace(/,/g, '')
                    }
                    transactionAuth  = createTransactionSigner(`${userData.cif}|${walletNumber}|${payload.customerUniqueReference}|${amount}`);
                    // axios.defaults.headers.common['transactionAuth'] = ;
                    axios.defaults.headers.common['transactionAuth'] = createTransactionSigner(`${userData.cif}|${walletNumber}|${payload.customerUniqueReference}|${amount}`);
                }

                

                // axios.defaults.headers.common['transactionAuth'] = transactionAuth;
            }



    }
    

    // static    refreshUserToken = async (requestToHalt)=>{
        
    //     let psbAuth = JSON.parse(localStorage.getItem("psb-auth"));
        
    //     if(psbAuth!==null && psbAuth!==undefined){
    //         let    lastRefreshTime = psbAuth.lastLogForAuth;

    //         let currenTimestamp = Date.now();
            
    //         if(((currenTimestamp -lastRefreshTime)/60000)>=3){
                
    //             let refreshTokenPayload = {
    //                 username:psbAuth.mobileNumber,
    //                 refreshToken:psbAuth.refreshToken
    //             }
                
                
    //             await dispatch(onboardingActions.ResfreshToken(refreshTokenPayload));
                
    //         }
    //     }

    // }


    static request(url, type, data, headers = undefined, noStringify=false){
        let bodyData;
        let service,
            lastRefreshTime,
            currenTimestamp;
        bodyData = noStringify ? JSON.stringify(data) : data;

        let urlsWithoutAuthentication = [
            "login",
            "App/checkifuserexists",
            "App/createaccount",
            "App/validateotp",
            "App/resendotp",
            "App/updateuserprofile",
        ],
        
        binaryUploadUrls =[
            "FileUpload/uploadfile",
        ],

        skipTokenRefreshForUrls =[
            "Identity/refreshtoken",
        ],

        serviceToTest = url.split("api/")[1];

        if(localStorage.getItem("psb-auth") === null){
            headers = undefined;
        }

        let psbAuth = JSON.parse(localStorage.getItem("psb-auth"));

        if (type.toLowerCase() === 'get') {
            if(headers === undefined){
                this.setTokenAuthorization(url);
                this.signTransaction(url, bodyData)
            }
           
            else if(headers !== undefined){
                for (let [key, value] of Object.entries(headers)) {
                    axios.defaults.headers.common[key] = value;
                }
            }
            let serviceResponse ="",
                serviceResponse2 ="";

            if(psbAuth!==null && psbAuth!==undefined && skipTokenRefreshForUrls.indexOf(serviceToTest) === -1){
                lastRefreshTime = psbAuth.lastLogForAuth;
                currenTimestamp = Date.now();

                

                if(parseInt(((currenTimestamp -lastRefreshTime)/60000))>=3){ // If Last Token refresh is more than 3 mins, Pause GET reqeust, refresh token, and resume the GET request
                    // let tempRequest = axios.get(url, bodyData);
                    let tempRequest = {
                        url,
                        bodyData,
                        tempHeaders: axios.defaults.headers.common
                    };
                    

                    let refreshpayload ={
                        mobileNumber: psbAuth.mobileNumber,
                        refreshToken: psbAuth.refreshToken
                      }
                  
                    
                    this.setTokenAuthorization(routes.REFRESH_TOKEN);

                    let tokenService = axios.post(routes.REFRESH_TOKEN, refreshpayload);

                    return tokenService.then(function (response) {
                        // console.log("was here")
                        if(response.status>=200 && response.status<210){
                            if(response.data.message!==undefined){
                                
                                let userData = JSON.parse(localStorage.getItem("psb-auth"));
                                    userData.lastLogForAuth = Date.now();
                                    userData.accessToken = response.data.message;
                                    localStorage.setItem('psb-auth', JSON.stringify(userData));

                                delete axios.defaults.headers.common;
                                axios.defaults.headers.common ={
                                    ...tempRequest.tempHeaders
                                }
                                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.message}`;

                                service = axios.get(tempRequest.url, tempRequest.bodyData);

                                
                                return service.then((response3)=>{

                                    // return service;
                                    if(response3.status>=200 && response3.status < 210){
                                        // console.log("success in token")
                                        // return service;
                                        if(response3.headers['content-type'].indexOf('application/json')>-1 || response3.headers['content-type'].indexOf('application/octet-stream')>-1){
                                            // return response3;
                                            return service;
                                            
                                        }else{
                                            // serviceResponse = "An error occured";
                                            serviceResponse = Promise.reject(response3);
                                            return serviceResponse;
                                        }
                                    }
                                })
                                .catch((error2)=>{
                                    return service;
                                })
                            }
                        }else{
                            // return service;
                            dispatch(onboardingActions.Logout())
                        }

                        
                        

                       
                    }).catch(function (error) {
                        // console.log("logs out now",service, routes.REFRESH_TOKEN)
                        // dispatch(onboardingActions.Logout())

                        let responseData= error.response;
                        if(responseData.config.url.indexOf("Identity/refreshtoken")>-1){
                            dispatch(onboardingActions.Logout())
                        }else{
                             return tokenService;
                        }
                        
                        
                        
                    });


                   
                }else{
                   
                    service = axios.get(url, bodyData);
                   
                }
            }else{
                
                service = axios.get(url, bodyData);
            }

            
            return service.then(function (response) {
                
                // return service;
                if(response.status>=200 && response.status < 210){
                    // console.log("success outside token")
                    // return service;
                    if(response.headers['content-type'].indexOf('application/json')>-1 || response.headers['content-type'].indexOf('application/octet-stream')>-1){
                        // return response;
                        return service;
                    }else{
                        // serviceResponse = "An error occured";
                        serviceResponse = Promise.reject(response);
                        return serviceResponse;
                    }
                }
            }).catch(function (error) {
                if (error.response) {
                    
                    if (error.response.status === 401) {
                        dispatch(onboardingActions.Logout())
                    } else {
                        
                        return service;
                    }
                      
                }
                
                return  service;
            });

        }  
        
        if (type.toLowerCase() === 'post'){
            //check for header
            if (binaryUploadUrls.indexOf(serviceToTest) === -1) {
               
                axios.defaults.headers.common['Content-Type'] = 'application/json';
            }
            if (binaryUploadUrls.indexOf(serviceToTest) > -1) {
                
                axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';
            }
            // axios.defaults.headers.common['Content-Type'] = 'application/json';
            if(headers === undefined){
                this.setTokenAuthorization(url);
                this.signTransaction(url, bodyData)
            }
            else if(headers !== undefined){
                for (let [key, value] of Object.entries(headers)) {
                    axios.defaults.headers.common[key] = value;
                }
            }


            if(psbAuth!==null && psbAuth!==undefined && skipTokenRefreshForUrls.indexOf(serviceToTest) === -1){
                lastRefreshTime = psbAuth.lastLogForAuth;
                currenTimestamp = Date.now();

                if(parseInt(((currenTimestamp -lastRefreshTime)/60000))>=3){ // If Last Token refresh is more than 3 mins, Pause GET reqeust, refresh token, and resume the GET request
                    // let tempRequest = axios.get(url, bodyData);
                    let tempRequest = {
                        url,
                        bodyData,
                        tempHeaders: axios.defaults.headers.common
                    };
                    

                    let refreshpayload ={
                        mobileNumber: psbAuth.mobileNumber,
                        refreshToken: psbAuth.refreshToken
                      }
                  
                    
                    this.setTokenAuthorization(routes.REFRESH_TOKEN);
                    this.signTransaction(routes.REFRESH_TOKEN);

                    let tokenService = axios.post(routes.REFRESH_TOKEN, refreshpayload);

                    return tokenService.then(function (response) {
                        
                        if(response.status===200){
                            if(response.data.message!==undefined){
                                
                                let userData = JSON.parse(localStorage.getItem("psb-auth"));
                                    userData.lastLogForAuth = Date.now();
                                    userData.accessToken = response.data.message;
                                    localStorage.setItem('psb-auth', JSON.stringify(userData));

                                delete axios.defaults.headers.common;
                                axios.defaults.headers.common ={
                                    ...tempRequest.tempHeaders
                                }
                                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.message}`;

                                service = axios.post(tempRequest.url, tempRequest.bodyData);

                                
                                return service.then((response3)=>{

                                    return service;
                                })
                                .catch((error2)=>{
                                    return service;
                                })
                            }
                        }else{
                            dispatch(onboardingActions.Logout())
                        }

                        
                        

                       
                    }).catch(function (error) {
                        if(url === routes.REFRESH_TOKEN){
                            dispatch(onboardingActions.Logout())
                        }else{
                            return service;
                        }
                        
                    });


                   
                }else{
                    service = axios.post(url, bodyData);
                }
            }else{
                service = axios.post(url, bodyData);
            }
            
            
            return service.then(function (response) {
                
                return service;
            }).catch(function (error) {
            
              if (error.response) {
                
                  if (error.response.status === 401 && serviceToTest !== "Login") {
                     
                      dispatch(onboardingActions.Logout());
                   
                  } else {
                        
                      return service;
                  }
            } 
            
                return  service;
            });
        }
    }


}