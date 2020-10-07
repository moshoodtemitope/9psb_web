import * as React from 'react';
import { Link, NavLink} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";

import { Helmet } from 'react-helmet';
import  InAppContainer from '../../../shared/templates/inapp-container'
import  DownloadApp from '../../../shared/elements/downloadapp-box'
import RightCaret from '../../../assets/images/right-caret.svg';
import Search from '../../../assets/images/search.svg';
import { numberWithCommas} from '../../../shared/utils';
import "./styles.scss"; 
class ManageCards extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            user:"",
            screenWidthSize: window.innerWidth,
            showSiderBar: window.innerWidth>=1024?true:false,
            
        }
   
        window.addEventListener("resize", ()=>
                this.setState({screenWidthSize: window.innerWidth,
                                showSiderBar: window.innerWidth>=1024?true:false
                }));
    }

    componentDidMount(){

    }


    setAccountChosen = (selected)=>{
        
    }
    

    renderDeposit = ()=>{

        return(
            <div className="form-wrap">

            </div>
        )
    }

    renderPageWrap = () =>{
        let IdOptions =[
        ];
        const selectionRange = {
            // startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
          },
          {isRangePickerVisible} = this.state;
        return(
            <div className="each-section mt-80 res-mt-45">
                <div className="twosided nomargin">
                    <div>
                        <div className="page-section-mainheading app-panel">
                            <div className="border-lines"><span></span><span></span><span></span></div>
                            <h3>Get a debit card or control an existing one</h3>
                        </div>
                        
                        <div className="dashboard-section">
                            <div className="app-panel inpage">
                                
                                <div className="w-80 m-100 m-auto">
                                    
                                    <div className="blocked-list">

                                        <div className="blocked-bar-link">
                                            <div>
                                                <div className="main-text">Request Debit Card</div>
                                                 <div className="sub-text">Relax. We’ll deliver it to you. </div>
                                            </div>
                                            <img src={RightCaret} alt=""/>
                                        </div>
                                        <div className="blocked-bar-link" >
                                            <div>
                                                <div className="main-text">Activate Card and Set Pin</div>
                                                 <div className="sub-text">Received your card, Set it up</div>
                                            </div>
                                            <img src={RightCaret} alt=""/>
                                        </div>
                                        <div className="blocked-bar-link" >
                                            <div>
                                                <div className="main-text">Change card PIN</div>
                                                 <div className="sub-text">Reset Card PIN</div>
                                            </div>
                                            <img src={RightCaret} alt=""/>
                                        </div>
                                        <div className="blocked-bar-link" >
                                            <div>
                                                <div className="main-text">Card Settings</div>
                                                 <div className="sub-text">Your card settings</div>
                                            </div>
                                            <img src={RightCaret} alt=""/>
                                        </div>
                                        
                                    </div>
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
        
        
        return (
            <Fragment>
                <Helmet>
                    <title>9PSB - Cards Management</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Card Management</h3>
                    </div>
                   {this.renderPageWrap()}
                </div>
                </InAppContainer>
            </Fragment>
        );
    }
}



function mapStateToProps(state) {
    return {
        
    };
}

export default connect(mapStateToProps)(ManageCards);