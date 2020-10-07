import * as React from 'react';
import { Link} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";
import "./app-footer.scss"; 

class AppFooter extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            user:""
        }
   
    
    }

    componentDidMount(){
       
    }



    renderFooterWrap(){
        return(
            <footer className="footer-wrap">
                <span>Copyright &copy; 2020 </span>
                <span>9 Payment Service Bank (9PSB)</span>
                <span>All Rights Reserved </span>
            </footer>
        )
    }

  
    


    render() {
        
        
        return (
            <Fragment>
                
               {this.renderFooterWrap()}
            </Fragment>
        );
    }
}


function mapStateToProps(state) {
    return {
        
    };
}

export default connect(mapStateToProps)(AppFooter);