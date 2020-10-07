import * as React from 'react';
import { Link} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";






import LoadingIcon from '../../../assets/images/loading.gif';


import "./pageloader.scss"; 
class PageLoader extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            user:"",
            screenWidthSize: window.innerWidth,
            
        }
   
       
    }

    componentDidMount(){

    }
   

   

    

    renderPageloader = () =>{

        return(
                    
            <div className="pageloader">
                <img src={LoadingIcon} alt=""/>
            </div>
        )
    }

    
   



    

  
    


    render() {
        
        
        return (
            this.renderPageloader()
        );
    }
}



function mapStateToProps(state) {
    return {
        
    };
}

export default connect(mapStateToProps)(PageLoader);