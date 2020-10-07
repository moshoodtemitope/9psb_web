import * as React from 'react';
import { NavLink} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";

import {history} from '../../../_helpers/history'
import { Helmet } from 'react-helmet';
import Form from 'react-bootstrap/Form';
import  InAppContainer from '../../../shared/templates/inapp-container'
import  DownloadApp from '../../../shared/elements/downloadapp-box'
import RightCaret from '../../../assets/images/right-caret.svg';
import Search from '../../../assets/images/search.svg';
import {paymentActions} from '../../../redux/actions/payments/payments';

import "./styles.scss"; 
class MoneyTransfer extends React.Component{
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
        this.clearRecords()
    }

    clearRecords = ()=>{
        const {dispatch} = this.props;
        dispatch(paymentActions.TranferToPhoneStep1("CLEAR"));
        dispatch(paymentActions.TranferToPhoneNumber("CLEAR"));
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
                            <h3>Select a transfer option</h3>
                        </div>
                        
                        <div className="dashboard-section">
                            <div className="app-panel inpage">
                                <div className="action-options">
                                    <NavLink exact to="/app/transfer" className="each-option">
                                        To Phone number
                                    </NavLink>
                                    <NavLink exact to="/app/transfer/to-bank" className="each-option">
                                        To bank account
                                    </NavLink>
                                </div>
                                <div className="panel-helptext mt-20  m-auto">
                                    Tranfer fund to your wallet or that of another customer
                                </div>
                                <div className="w-80 m-100 m-auto pt-20">
                                    <div className="blocked-bar-link" onClick={()=>history.push("/app/transfer/provide-details")}>
                                        <span>Provide details</span>
                                        <img src={RightCaret} alt=""/>
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
                    <title>9PSB - Transfer Money</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Transfer Money</h3>
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

export default connect(mapStateToProps)(MoneyTransfer);