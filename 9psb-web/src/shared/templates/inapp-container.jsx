import * as React from 'react';
import InAppHeader from "../elements/in-app-header/in-app-header";
import InAppSideBar from "../elements/in-app-sidebar";
import {history} from '../../_helpers/history'
import AppFooter from "../elements/app-footer/app-footer";
import FreshChat from 'react-freshchat'
import "./inapp.scss"; 
class InAppContainer extends React.Component{
    constructor(props) {
        super(props);
        // if(localStorage.getItem('psb-auth')===null || localStorage.getItem('psb-auth')===undefined){
        //     history.push("/")
        // }
        this.psbuser=JSON.parse(localStorage.getItem('psb-auth'))
    }
    
    render() {
        

        // console.log("user is", user.BranchId)
        // if(user.BranchId)
        return (
            
                <div className="page-wrap">
                    <InAppHeader  />
                    <div className="inapp-wrapper">
                        <InAppSideBar />
                        {this.props.children}
                    </div>
                    <AppFooter  />
                    <FreshChat
                        token="fa343056-9afd-46c3-a63e-f53266998091"
                        
                        first_name= {this.psbuser.firstName}
                        onInit={widget => {
                        /* Use `widget` instead of `window.fcWidget`*/
                            widget.user.setProperties({
                            email: this.psbuser.emailAddress,
                            first_name: this.psbuser.firstName,
                            last_name: this.psbuser.lastName,
                            phone: this.psbuser.mobileNumber,
                            })
                        
                        }}
                    />
                </div>
        );
    }
}

export default InAppContainer;