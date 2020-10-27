import * as React from 'react';
import { Link} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";



import  ErrorMessage from '../errormessage'
import Select from 'react-select';
import {accountActions} from '../../../redux/actions/dashboard/dashboard';
import {dashboardConstants} from '../../../redux/actiontypes/dashboard/dashboard.constants';
import { numberWithCommas, getDateFromISO} from '../../../shared/utils';


import "./styles.scss"; 
class SelectAnAccount extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            user:"",
            screenWidthSize: window.innerWidth,
            debitAccount:"",
            psbAuth: JSON.parse(localStorage.getItem("psb-auth"))
        }
        window.addEventListener("resize", ()=>
        this.setState({screenWidthSize: window.innerWidth,
                        showSiderBar: window.innerWidth>=1024?true:false
        }));
        props.dispatch(accountActions.GetCustomerAccounts("CLEAR"))
       
    }

    componentDidMount(){
        this.getCustomerAccounts()
    }
    

    getCustomerAccounts = ()=>{
        const {dispatch} = this.props;
        // dispatch(accountActions.GetCustomerAccounts("CLEAR"));
        dispatch(accountActions.GetCustomerAccounts());
    }

    handleSelectAccount = (e) => {
        
        this.props.onChange(e);
        
       
        this.setState({ debitAccount: e })
    }

    

    customerAccounts = (
        onBlur= this.props.onBlur,
        accountNumber=this.props.accountNumber,
        isAccountError= this.props.isAccountError,
        label= this.props.label
    ) =>{
        let GetCustomerAccountsRequest = this.props.GetCustomerAccountsReducer,
            customerAccounts = GetCustomerAccountsRequest.request_data.response,
            accounstList =[],
            {screenWidthSize}= this.state;
            // walletCurrency

            if(screenWidthSize >= 425){
                customerAccounts.map((eachAcount, index)=>{
                    accounstList.push({
                        label:`${eachAcount.productName} 
                                (${eachAcount.walletNumber})  ${eachAcount.walletCurrency==="NGN"?'₦':eachAcount.walletCurrency}${numberWithCommas(eachAcount.walletBalance, true)}`,
                        // label: eachAcount.accountName+'<br/>'+eachAcount.walletNumber,
                        value:eachAcount.walletNumber,
                        walletBalance: eachAcount.walletBalance
                    })
                })
            } 
            if(screenWidthSize < 425){
                customerAccounts.map((eachAcount, index)=>{
                    accounstList.push({
                        label:`${eachAcount.productName} 
                                                (${eachAcount.walletNumber})  ${eachAcount.walletCurrency==="NGN"?'₦':eachAcount.walletCurrency}${numberWithCommas(eachAcount.walletBalance, true)}`,
                        // label:`${eachAcount.walletNumber}`,
                        value:eachAcount.walletNumber,
                        walletBalance: eachAcount.walletBalance
                    })
                })
            }   

            const selectStyle = {
                control: base => ({
                    ...base,
                    // border: 0,
                    // This line disable the blue border
                    boxShadow: "none"
                })
            };
            
        return(
                    
            <div className="selectaccountwrap">
                <div className="poppedinput withselect">
                        {(label!==undefined && label!==null && label!=="") && 
                            <label htmlFor="" className="block-level">{label}</label>
                        }
                        {(label===undefined || label===null || label==="") && 
                            <label htmlFor="" className="block-level">Select Account</label>
                        }
                    
                    <Select
                        // defaultValue={{ label: `${accounstList[0].label}`, value: `${accounstList[0].value}` }}
                        options={accounstList}
                        styles={selectStyle}
                        onChange={this.handleSelectAccount}
                        // onChange={onChange}
                        // onBlur={onBlur}
                        // value={accountNumber}
                        // value={{label: this.state.debitAccount.value, value: this.state.debitAccount.value}}
                        noOptionsMessage={() => `No account found`}
                        placeholder="choose account"
                        className={isAccountError ? "is-invalid" : null}
                    />
                    <div className="acount-details">
                        <span></span>
                    </div>
                    {isAccountError?  (
                        <span className="invalid-feedback">Choose an account</span>
                    ) : null}
                </div>
            </div>
        )
    }

    defaultCustomerAccounts = (
        onBlur= this.props.onBlur,
        accountNumber=this.props.accountNumber,
        isAccountError= this.props.isAccountError,
        label= this.props.label
    ) =>{
        let {psbAuth} = this.state,
            customerAccounts = psbAuth.allAccounts,
            accounstList =[],
            {screenWidthSize}= this.state;
            // walletCurrency
            // console.log("dsdsdsdsd", customerAccounts);
            if(screenWidthSize >= 425){
                customerAccounts.map((eachAcount, index)=>{
                    accounstList.push({
                        label:`${eachAcount.productName} 
                                (${eachAcount.walletNumber})  ${eachAcount.walletCurrency==="NGN"?'₦':eachAcount.walletCurrency}${numberWithCommas(eachAcount.walletBalance, true)}`,
                        // label: eachAcount.accountName+'<br/>'+eachAcount.walletNumber,
                        value:eachAcount.walletNumber,
                        walletBalance: eachAcount.walletBalance
                    })
                })
            } 
            if(screenWidthSize < 425){
                customerAccounts.map((eachAcount, index)=>{
                    accounstList.push({
                        label:`${eachAcount.productName} 
                                                (${eachAcount.walletNumber})  ${eachAcount.walletCurrency==="NGN"?'₦':eachAcount.walletCurrency}${numberWithCommas(eachAcount.walletBalance, true)}`,
                        // label:`${eachAcount.walletNumber}`,
                        value:eachAcount.walletNumber,
                        walletBalance: eachAcount.walletBalance
                    })
                })
            }   

            const selectStyle = {
                control: base => ({
                    ...base,
                    // border: 0,
                    // This line disable the blue border
                    boxShadow: "none"
                })
            };
            
        return(
                    
            <div className="selectaccountwrap">
                <div className="poppedinput withselect">
                        {(label!==undefined && label!==null && label!=="") && 
                            <label htmlFor="" className="block-level">{label}</label>
                        }
                        {(label===undefined || label===null || label==="") && 
                            <label htmlFor="" className="block-level">Select Account</label>
                        }
                    
                    <Select
                        // defaultValue={{ label: `${accounstList[0].label}`, value: `${accounstList[0].value}` }}
                        options={accounstList}
                        styles={selectStyle}
                        onChange={this.handleSelectAccount}
                        // onChange={onChange}
                        // onBlur={onBlur}
                        // value={accountNumber}
                        // value={{label: this.state.debitAccount.value, value: this.state.debitAccount.value}}
                        noOptionsMessage={() => `No account found`}
                        placeholder="choose account"
                        className={isAccountError ? "is-invalid" : null}
                    />
                    <div className="acount-details">
                        <span></span>
                    </div>
                    {isAccountError?  (
                        <span className="invalid-feedback">Choose an account</span>
                    ) : null}
                </div>
            </div>
        )
    }

    renderAccountsWrap =(
        label= this.props.label)=>{
        let GetCustomerAccountsRequest = this.props.GetCustomerAccountsReducer;
        let {psbAuth} = this.state;
        const selectStyle = {
            control: base => ({
                ...base,
                // border: 0,
                // This line disable the blue border
                boxShadow: "none"
            })
        };

        if(GetCustomerAccountsRequest.request_status=== dashboardConstants.GET_CUSTOMER_ACCOUNTS_SUCCESS){
            let GetCustomerAccountsRequest = this.props.GetCustomerAccountsReducer,
                customerAccounts = GetCustomerAccountsRequest.request_data.response;
            if(customerAccounts.length>=1){
                return (
                    this.customerAccounts()
                )
            }else{
                if(psbAuth.allAccounts!==undefined){
                    return (
                        this.defaultCustomerAccounts()
                    )
                }
            }
        }

        if(GetCustomerAccountsRequest.request_status=== dashboardConstants.GET_CUSTOMER_ACCOUNTS_PENDING){
           if(psbAuth.allAccounts!==undefined){
            return (
                this.defaultCustomerAccounts()
            )
           }else{
                return (
                    <div className="loading-account">
                            <div className="poppedinput withselect">
                            {(label!==undefined && label!==null && label!=="") && 
                                <label htmlFor="" className="block-level">{label}</label>
                            }
                            {(label===undefined || label===null || label==="") && 
                                <label htmlFor="" className="block-level">Select Account</label>
                            }
                            <Select 
                                styles={selectStyle}
                                placeholder="Loading accounts..."
                                noOptionsMessage={() => `Loading accounts...`}
                                disabled={true}
                            />
                        </div>
                    </div>
                )
            }
        }

        if(GetCustomerAccountsRequest.request_status=== dashboardConstants.GET_CUSTOMER_ACCOUNTS_FAILURE){
            if(psbAuth.allAccounts!==undefined){
                return (
                    this.defaultCustomerAccounts()
                )
            }else{
                return(
                    <div className="loading-account">
                            <div className="poppedinput withselect unset">
                                <label htmlFor="" className="block-level">Unable to load accounts</label>
                                <Select 
                                    styles={selectStyle}
                                    placeholder="Unable to load accounts"
                                    // placeholder={GetCustomerAccountsRequest.request_data.error||"Unable to load accounts"}
                                    noOptionsMessage={() => `Unable to load accounts`}
                                    // noOptionsMessage={() => `${GetCustomerAccountsRequest.request_data.error||"Unable to load accounts"}`}
                                    className="is-invalid"
                                    disabled={true}
                                />
                                <span className="invalid-feedback" onClick={this.getCustomerAccounts} >Retry</span>
                            {/* <ErrorMessage showIcon={false} errorMessage={GetCustomerAccountsRequest.request_data.error} canRetry={true} retryFunc={this.getCustomerAccounts} /> */}
                        </div>
                    </div>
                    
                )
            }
        }
    }



    

  
    


    render() {
        
        return (
            <Fragment>
                {this.renderAccountsWrap()}
            </Fragment>
        );
    }
}



function mapStateToProps(state) {
    return {
        GetCustomerAccountsReducer : state.accountsReducers.GetCustomerAccountsReducer,
    };
}

export default connect(mapStateToProps)(SelectAnAccount);