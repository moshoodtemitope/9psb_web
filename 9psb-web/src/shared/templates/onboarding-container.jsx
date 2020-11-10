import * as React from 'react';
import OnboardingHeader from "../elements/onboarding-header/onboarding-header";
import OnboardingFooter from "../elements/onboarding-footer/onboarding-footer";
import AppFooter from "../elements/app-footer/app-footer";
import "./onboarding.scss"; 
import FreshChat from 'react-freshchat'
class OnboardingContainer extends React.Component{
    constructor(props) {
        super(props);
        // if(localStorage.getItem('psb-auth')===null || localStorage.getItem('psb-auth')===undefined){
        //     history.push("/")
        // }
        this.psbuser= (localStorage.getItem('psb-auth')!==undefined && localStorage.getItem('psb-auth')!==null)? JSON.parse(localStorage.getItem('psb-auth')): "";
    }

    render() {
        
        
        
        // if(user.BranchId)
        return (
            
                <div className="page-wrap">
                    <OnboardingHeader  />
                    {this.props.children}
                    <OnboardingFooter/>
                    <AppFooter  />
                    {
                        this.psbuser!=="" &&
                    
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
                    }
                    {
                        this.psbuser==="" &&
                    
                        <FreshChat
                            token="fa343056-9afd-46c3-a63e-f53266998091"
                            
                        />
                    }
                </div>
        );
    }
}

export default OnboardingContainer;