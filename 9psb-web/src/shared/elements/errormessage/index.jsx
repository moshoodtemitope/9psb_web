import * as React from 'react';
import { Link} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";






// import ErrorIcon from '../../../assets/images/erroricon.svg';
import ErrorIcon from '../../../assets/images/cancel.svg';
import CloseIcon from '../../../assets/images/close.svg';


import "./styles.scss"; 
class ErrorMessage extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            user:"",
            screenWidthSize: window.innerWidth,
            
        }
   
       
    }

    componentDidMount(){

    }
   

   hideError = (errorToRemove)=>{

    document.getElementById(errorToRemove).remove();
   }

    

    renderItem = (
        errorMessage=this.props.errorMessage,
        canRetry= this.props.canRetry,
        showIcon=this.props.showIcon,
        retryFunc= this.props.retryFunc,
        retryText= this.props.retryText,
    ) =>{
        console.log("dsddsds", canRetry);
        return(
            <div className="app-panel error" >
                <div className="closeicon" onClick={(e)=>{
                    e.target.parentNode.parentNode.remove();
                }} ><img src={CloseIcon} alt=""/></div>
                <div className="itemwrap mt-10">
                    {
                        ((showIcon === undefined || showIcon === null) && showIcon !== false) &&
                        <img src={ErrorIcon} alt="" />
                    }

                    <div className="errormessage">
                        <h4>Error</h4>
                        <div className="error-msg">
                            {errorMessage || "Something went wrong"}
                        </div>
                        {canRetry === true &&
                            <span className="retrybtn" onClick={() => retryFunc()}>
                                {(retryText !== undefined && retryText !== null && retryText !== "") ? `${retryText}` : "Retry"}
                            </span>
                        }
                    </div>

                </div>
            </div>
        )
    }

    
   



    

  
    


    render() {
        
        
        return (
            this.renderItem()
        );
    }
}



function mapStateToProps(state) {
    return {
        
    };
}

export default connect(mapStateToProps)(ErrorMessage);