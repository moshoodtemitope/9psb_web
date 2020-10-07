import * as React from 'react';

import { connect } from 'react-redux';
import {Fragment} from "react";


import {history} from '../../../_helpers/history'
import Button from 'react-bootstrap/Button'
import { Helmet } from 'react-helmet';
import  InAppContainer from '../../../shared/templates/inapp-container'
import  DownloadApp from '../../../shared/elements/downloadapp-box'

import Done from '../../../assets/images/done.svg';
import { getDateFromISO} from '../../../shared/utils';
import {accountActions} from '../../../redux/actions/dashboard/dashboard';
import {dashboardConstants} from '../../../redux/actiontypes/dashboard/dashboard.constants';
import "./styles.scss"; 
class AgentsLocations extends React.Component{
    constructor(props) {
        super(props);
        let getExistingInfo = this.props.LocateAnAgentReducer;
        this.state={
            user:"",
            screenWidthSize: window.innerWidth,
            existingCustomerInfo: (Object.keys(getExistingInfo).length>=1 
                                        && getExistingInfo.request_status === dashboardConstants.LOCATE_AGENTS_SUCCESS)
                                    ? getExistingInfo.request_data.response: '' ,
            
        }

        if(this.state.existingCustomerInfo===""){
            history.push("/app/locate-agents")
        }
   
        
    }

    componentDidMount(){
        this.bounceBackToStep();
    }
    clearRecords = ()=>{
        const {dispatch} = this.props;
        dispatch(accountActions.LocateAnAgent("CLEAR"));
    }


    
    bounceBackToStep = ()=>{
        
        let {existingCustomerInfo}= this.state;
        
        if(existingCustomerInfo===""){
                history.push("/app/locate-agents")
        }
    }

    

    

    renderPageWrap = () =>{
        let 
          {existingCustomerInfo} = this.state;
        return(
            <div className="each-section mt-80 res-mt-45">
                <div className="twosided nomargin">
                    <div>
                        <div className="page-section-mainheading app-panel">
                            <div className="border-lines"><span></span><span></span><span></span></div>
                            
                            <h3 className="centered">Find a 9PSB agent near you</h3>
                        </div>
                        
                        
                        <div className="dashboard-section">
                            <div className="app-panel inpage centered">
                                <img className="done-icon" src={Done} alt=""/>
                            
                                
                                { Object.keys(existingCustomerInfo).length>=1 && 
                                    <div className="panel-helptext mt-20 mh-auto">
                                        These are our agents locations around your chosen location
                                    
                                    </div>
                                }
                            </div>
                            { Object.keys(existingCustomerInfo).length>=1 && 
                                <div className="app-panel inpage nopadding">
                                    <h4 className="result-heading">Our Locations near you</h4>
                                    <div className="all-locations pb-30">
                                        {
                                            existingCustomerInfo.map((eachAgent, index)=>{
                                                return(
                                                    <div key={index} className="eachresult">
                                                        {eachAgent.agentName}, {eachAgent.agentAddress}
                                                    </div>
                                                )
                                            })
                                        }
                                        {/* <div className="eachresult">
                                            2 Foreshore Avenue, Victoria Island, 090894565456
                                        </div>
                                        <div className="eachresult">
                                            2 Foreshore Avenue, Victoria Island, 090894565456
                                        </div>
                                        <div className="eachresult">
                                            2 Foreshore Avenue, Victoria Island, 090894565456
                                        </div>
                                        <div className="eachresult">
                                            2 Foreshore Avenue, Victoria Island, 090894565456
                                        </div> */}
                                    </div>
                                </div>
                            }

                            {existingCustomerInfo.length===0 &&
                                <div className="app-panel inpage nopadding">
                                    <h4 className="result-heading">These are our agents around your chosen location</h4>
                                    <div className="all-locations pb-30">
                                        <div className="eachresult">
                                            No agents found
                                    </div>

                                    </div>
                                </div>
                            }

                            
                            <div className="app-panel inpage">
                                <div className="footer-with-cta toleft m-0 ">
                                    <Button variant="secondary"
                                        type="submit"
                                       
                                        className=" onboarding-btn"
                                        onClick={()=>{
                                            this.clearRecords()
                                            history.push("/app/dashboard")
                                        }}
                                    > Done
                                        
                                    </Button>

                                </div>
                            </div>
                        </div>
                    </div>
                    <DownloadApp/>
                    
                </div>
            </div>
        )
    }

    
    



    

  
    


    render() {
        let {existingCustomerInfo} = this.state
        
        return (
            <Fragment>
                <Helmet>
                    <title>9PSB - Locate Agents</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Agent Locations</h3>
                    </div>
                    {existingCustomerInfo!=="" &&
                        this.renderPageWrap()
                    }
                </div>
                </InAppContainer>
            </Fragment>
        );
    }
}



function mapStateToProps(state) {
    return {
        LocateAnAgentReducer : state.accountsReducers.LocateAnAgentReducer,
    };
}

export default connect(mapStateToProps)(AgentsLocations);