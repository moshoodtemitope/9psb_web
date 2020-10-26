import * as React from 'react';
import { Link} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";


import Form from 'react-bootstrap/Form';
import  ErrorMessage from '../errormessage'
import Select from 'react-select';
import {onboardingActions} from '../../../redux/actions/onboarding/onboarding';
import {onboardingConstants} from '../../../redux/actiontypes/onboarding/onboarding.constants';


import "./styles.scss"; 
class SelectStateAndLga extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            user:"",
            screenWidthSize: window.innerWidth,
            stateChosen:""
        }
        window.addEventListener("resize", ()=>
        this.setState({screenWidthSize: window.innerWidth,
                        showSiderBar: window.innerWidth>=1024?true:false
        }));
        props.dispatch(onboardingActions.GetLgas("CLEAR"))
       
    }

    componentDidMount(){
        this.getAllStates();
    }
    

    

    handleSelectState = (e) => {
        
        this.props.onStateChange(e);
        
        this.setState({ stateChosen: e.value }, ()=>this.getLgasInState())
        
    }

    handleSelectLGA = (e) => {
        
        this.props.onLGAChange(e.value, e);
        
        this.setState({ lgaChosen: e })
    }

    


    getLgasInState = async() =>{
        const {dispatch} = this.props;
        let {stateChosen} = this.state;
        
        await dispatch(onboardingActions.GetLgas(stateChosen));
    }

    getAllStates = async() =>{
        const {dispatch} = this.props;
        await dispatch(onboardingActions.GetStates());
    }

    titleCase=(str)=> {
        str = str.toLowerCase().split(' ');
        for (var i = 0; i < str.length; i++) {
          str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
        }
        return str.join(' ');
      }

    renderStates = (
        stateLabel= this.props.stateLabel,
        lgaLabel= this.props.lgaLabel,
        isStateError=this.props.isStateError
    )=>{
        let GetAllStatesRequest = this.props.GetAllStatesReducer,
            GetLgasRequest      = this.props.GetLgasReducer,
            allStates = GetAllStatesRequest.request_data.response,
            allStatesList =[];

            allStates.map((eachState, index)=>{
                allStatesList.push({value:eachState.code, 
                                    label: this.titleCase(eachState.stateName),
                                    stateId: eachState.stateId,
                                })
            })
        
        const selectStyle = {
            control: base => ({
                ...base,
                // border: 0,
                // This line disable the blue border
                boxShadow: "none"
            })
        };

        // const selectStyle = {
        //     control: base => ({
        //         ...base,
        //         // border: 0,
        //         // This line disable the blue border
        //         boxShadow: "none"
        //     })
        // };

        return(
            <Fragment>
                <div className="selectaccountwrap">
                    <Form.Group className="poppedinput withselect">
                            {(stateLabel!==undefined && stateLabel!==null && stateLabel!=="") && 
                                <Form.Label className="block-level">{stateLabel}</Form.Label>
                            }
                            {(stateLabel===undefined || stateLabel===null || stateLabel==="") && 
                                <Form.Label className="block-level">Select state</Form.Label>
                            }
                        
                        <Select
                            // defaultValue={{ label: `${accounstList[0].label}`, value: `${accounstList[0].value}` }}
                            options={allStatesList}
                            styles={selectStyle}
                            onChange={this.handleSelectState}
                            // onChange={onChange}
                            // onBlur={onBlur}
                            // value={accountNumber}
                            // value={{label: this.state.debitAccount.value, value: this.state.debitAccount.value}}
                            noOptionsMessage={() => `No states found`}
                            placeholder="choose state"
                            className={isStateError ? "is-invalid" : null}
                        />
                        {isStateError?  (
                            <span className="invalid-feedback">State is required</span>
                        ) : null}
                    </Form.Group>
                </div>

                {this.renderLGAs()}

                {(GetLgasRequest.request_status=== onboardingConstants.GET_LGAS_PENDING) && 
                    
                    
                        <div className="loading-lgas">
                                <Form.Group className="poppedinput withselect">
                                {(lgaLabel!==undefined && lgaLabel!==null && lgaLabel!=="") &&
                                    <Form.Label className="block-level">{lgaLabel}</Form.Label> 
                                    
                                }
                                {(lgaLabel===undefined || lgaLabel===null || lgaLabel==="") && 
                                    <Form.Label className="block-level">Select LGA</Form.Label> 
                                }
                                <Select 
                                    styles={selectStyle}
                                    placeholder="Loading LGAs..."
                                    noOptionsMessage={() => `Loading LGAs...`}
                                    disabled={true}
                                />
                            </Form.Group>
                        </div>
                    
                }

                {(GetLgasRequest.request_status=== onboardingConstants.GET_LGAS_FAILURE) &&
                    <div className="loading-account">
                            <div className="poppedinput withselect unset">
                                <label htmlFor="" className="block-level">Unable to load LGAs</label>
                                <Select 
                                    styles={selectStyle}
                                    placeholder={GetLgasRequest.request_data.error||"Unable to load LGAs"}
                                    noOptionsMessage={() => `${GetLgasRequest.request_data.error||"Unable to load LGAs"}`}
                                    disabled={true}
                                />
                                <small onClick={this.getLgasInState} >Retry</small>
                            {/* <ErrorMessage showIcon={false} errorMessage={GetCustomerAccountsRequest.request_data.error} canRetry={true} retryFunc={this.getCustomerAccounts} /> */}
                        </div>
                    </div>
                    // <ErrorMessage showIcon={false} errorMessage={GetLgasRequest.request_data.error} canRetry={true} retryFunc={this.getLgasInState} />
                    
                }
            </Fragment>
        )

    }

    renderLGAs = (
        lgaLabel= this.props.lgaLabel,
        isLGaError=this.props.isLGaError
    )=>{
        
        // this.getLgasInState(stateCode)
        //     .then(()=>{
                let GetLgasRequest      = this.props.GetLgasReducer,
                    lgaList =[];
                // if(GetLgasRequest.request_status ===onboardingConstants.GET_LGAS_SUCCESS){
            if(GetLgasRequest.request_status=== onboardingConstants.GET_LGAS_SUCCESS){
                    let lgaData = GetLgasRequest.request_data.response;
                    lgaData.map((eachLga, id)=>{
                        lgaList.push({value:eachLga.lgaId, label: eachLga.lgaName})
                    })


                    lgaList.sort(function(a, b) {
                        var lgaA = a.label.toUpperCase();
                        var lgaB = b.label.toUpperCase();
                        return (lgaA < lgaB) ? -1 : (lgaA > lgaB) ? 1 : 0;
                    });
        
                    

                    // this.setState({lgaList})
                    
                    // customerInfo.states.map((eachState, index)=>{
                    //     stateLists.push({value:eachState.code, label: eachState.stateName})
                    // })
                // }
            // })
                    
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
                        <Form.Group className="poppedinput withselect">
                                {(lgaLabel!==undefined && lgaLabel!==null && lgaLabel!=="") && 
                                    <Form.Label className="block-level">{lgaLabel}</Form.Label>
                                }
                                {(lgaLabel===undefined || lgaLabel===null || lgaLabel==="") && 
                                    <Form.Label className="block-level">Select LGA</Form.Label>
                                }
                            
                            <Select
                                
                                options={lgaList}
                                styles={selectStyle}
                                onChange={this.handleSelectLGA}
                                
                                noOptionsMessage={() => `No LGAs found`}
                                placeholder="choose LGA"
                                className={isLGaError ? "is-invalid" : null}
                            />
                            {isLGaError?  (
                                <span className="invalid-feedback">LGA is required</span>
                            ) : null}
                        </Form.Group>
                    </div>
                )
            }else{
                return "";
            }
    }


    renderContainer = (
        stateLabel= this.props.stateLabel,
        lgaLabel= this.props.lgaLabel,
    )=>{
        let GetAllStatesRequest = this.props.GetAllStatesReducer,
            GetLgasRequest      = this.props.GetLgasReducer;

            const selectStyle = {
                control: base => ({
                    ...base,
                    // border: 0,
                    // This line disable the blue border
                    boxShadow: "none"
                })
            };
            
            if(GetAllStatesRequest.request_status=== onboardingConstants.GET_STATES_PENDING){
                
                return (
                    <div className="loading-state">
                        <Form.Group className="poppedinput withselect">
                            {(stateLabel!==undefined && stateLabel!==null && stateLabel!=="") && 
                                <Form.Label className="block-level">{stateLabel}</Form.Label>
                            }
                            {(stateLabel===undefined || stateLabel===null || stateLabel==="") && 
                                <Form.Label className="block-level">Select State</Form.Label>
                            }
                            <Select 
                                styles={selectStyle}
                                placeholder="Loading states..."
                                noOptionsMessage={() => `Loading states...`}
                                disabled={true}
                            />
                        </Form.Group>
                    </div>
                )
            }

            if(GetAllStatesRequest.request_status=== onboardingConstants.GET_STATES_SUCCESS){
                return (
                    this.renderStates()
                )
            }

            if(GetAllStatesRequest.request_status=== onboardingConstants.GET_STATES_FAILURE){
                return (
                    <div className="loading-state">
                            <div className="poppedinput withselect unset">
                                <label htmlFor="" className="block-level">Unable to load states</label>
                                <Select 
                                    styles={selectStyle}
                                    placeholder={GetAllStatesRequest.request_data.error||"Unable to load states"}
                                    noOptionsMessage={() => `${GetAllStatesRequest.request_data.error||"Unable to load states"}`}
                                    disabled={true}
                                />
                                <small onClick={this.getAllStates} >Retry</small>
                            {/* <ErrorMessage showIcon={false} errorMessage={GetCustomerAccountsRequest.request_data.error} canRetry={true} retryFunc={this.getCustomerAccounts} /> */}
                        </div>
                    </div>
                    // <ErrorMessage showIcon={false} errorMessage={GetAllStatesRequest.request_data.error} canRetry={true} retryFunc={this.getAllStates} />
                )
            }

            

            // if(GetLgasRequest.request_status=== onboardingConstants.GET_LGAS_SUCCESS){
            //     return (
                    // this.renderLGAs()
            //     )
            // }

            
    }



    

  
    


    render() {
        
        return (
            <Fragment>
                {this.renderContainer()}
            </Fragment>
        );
    }
}



function mapStateToProps(state) {
    return {
        GetCustomerAccountsReducer : state.accountsReducers.GetCustomerAccountsReducer,
        GetLgasReducer : state.onboardingReducers.GetLgasReducer,
        GetAllStatesReducer : state.onboardingReducers.GetAllStatesReducer
    };
}

export default connect(mapStateToProps)(SelectStateAndLga);