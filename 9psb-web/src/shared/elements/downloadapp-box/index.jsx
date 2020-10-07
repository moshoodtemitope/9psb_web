import * as React from 'react';
import { Link} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";

import "../../../assets/scss/shared/slick.min.css"; 
import "../../../assets/scss/shared/slick-theme.min.css"; 
// import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";



import AppStore from '../../../assets/images/appstore.svg';
import PlayStore from '../../../assets/images/playstore.svg';
import AppImg from '../../../assets/images/app.svg';


import "./downloadapp-box.scss"; 
class DownloadApp extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            user:"",
            screenWidthSize: window.innerWidth,
            showSiderBar: window.innerWidth>=1024?true:false,
        }
   
        
    }

    componentDidMount(){

    }
   

   

    

    renderDownloadApp = () =>{

        return(
                    
                <div className="ads-panel">
                    <div className="ad-wrap">
                        <div className="ad-details">
                            <div className="ad-content">
                                <h3>Download the <span>app</span></h3>
                                <div className="ad-text">
                                    To help make sure your are getting the best experience 
                                    download the mobile app and transact on the go!!!
                                </div>
                                <div className="download-app">
                                    <img src={PlayStore} alt=""/>
                                    <img src={AppStore} alt=""/>
                                </div>
                            </div>
                            <div className="app-img">
                                <img src={AppImg} alt=""/>
                            </div>
                        </div>
                        <div className="border-lines">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
        )
    }

    
   



    

  
    


    render() {
        
        
        return (
            this.renderDownloadApp()
        );
    }
}



function mapStateToProps(state) {
    return {
        
    };
}

export default connect(mapStateToProps)(DownloadApp);