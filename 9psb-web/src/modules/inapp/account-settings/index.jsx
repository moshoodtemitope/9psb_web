import * as React from 'react';
import { Link, NavLink} from 'react-router-dom';
import { connect } from 'react-redux';
import {Fragment} from "react";



import {history} from '../../../_helpers/history'
import { Helmet } from 'react-helmet';
import  InAppContainer from '../../../shared/templates/inapp-container'
import  DownloadApp from '../../../shared/elements/downloadapp-box'
import RightCaret from '../../../assets/images/right-caret.svg';

import Alert from 'react-bootstrap/Alert';
import ErrorMessage from '../../../shared/elements/errormessage'

import {dashboardConstants} from '../../../redux/actiontypes/dashboard/dashboard.constants';
import {onboardingActions} from '../../../redux/actions/onboarding/onboarding';
import "./styles.scss"; 
class AccountSettings extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            psbuser:JSON.parse(localStorage.getItem('psb-auth')),
            previewStyles: (JSON.parse(localStorage.getItem('psb-auth')).profilePix !=="no file" && JSON.parse(localStorage.getItem('psb-auth')).profilePix !=="")? 
                            {
                                background: `url(data:image/png;base64,${JSON.parse(localStorage.getItem('psb-auth')).profilePix})`,
                                // height:'60px',
                                backgroundSize: `100% 100%`,
                                backgroundPosition: `center center`,
                                backgroundRepeat: `no-repeat`
                            } :
                             {},
            docuploaded:'',
            invalidImageUpload:false,
            isDocAdded: null,
        }

        // this.setState({
           
        //     previewStyles: (this.state.psbuser.profilePix !=="no file" && this.state.psbuser.profilePix !=="")? 
        //                     {
        //                         background: `url(data:image/png;base64,${this.state.psbuser.profilePix})`,
        //                         // height:'60px',
        //                         backgroundSize: `100% 100%`,
        //                         backgroundPosition: `center center`,
        //                         backgroundRepeat: `no-repeat`
        //                     } :
        //                      {},
           
        // })
            
    }

    componentDidMount(){
        
    }

    updateCustomerDp = async(payload) =>{
        const {dispatch} = this.props;

        await dispatch(onboardingActions.UploadAFile(payload));
    }

    isFileImage=(file)=> {
        const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
     
        return file && acceptedImageTypes.includes(file['type'])
    }

    HandleFileUpLoad = (event) => {
        const file = document.getElementById('photo-upload').files[0];
        if(this.isFileImage(file)){
            this.setState({docuploaded: event.target.files[0], 
                        isDocAdded:true}, ()=>{
                            
                            if(this.state.docuploaded!==''){
                                const   dpFormData = new FormData();
                                        dpFormData.append('File', this.state.docuploaded);
                                        dpFormData.append('DocumentType', 2);
                                
                                    this.updateCustomerDp(dpFormData);
                            }
                        });
        
        
        
            this.setState({invalidImageUpload:false})
            const reader = new FileReader();
            
            let preViewStyle;
            reader.addEventListener("load",  ()=> {
                

                preViewStyle = {
                    background: `url(${reader.result})`,
                    // height:'60px',
                    backgroundSize: `100% 100%`,
                    backgroundPosition: `center center`,
                    backgroundRepeat: `no-repeat`
                }
                
                this.setState({previewStyles:preViewStyle})
            }, false);

            
            if (file) {
                reader.readAsDataURL(file);
            }
        }else{
            this.setState({invalidImageUpload:true})
        }
        
    }
    

    renderPageContent = ()=>{
       let {psbuser, previewStyles, invalidImageUpload} = this.state;
       let GetCustomerDashboardDataRequest = this.props.GetCustomerDashboardDataReducer;
       
    //    let dpPreViewStyle = {
    //         background: `url(${psbuser.profilePix})`,
    //         // height:'60px',
    //         backgroundSize: `100% 100%`,
    //         backgroundPosition: `center center`,
    //         backgroundRepeat: `no-repeat`
    //     };
        return (
            <div className="each-section mt-80 res-mt-45">
                <div className="twosided nomargin">
                    <div>
                        <div className="page-section-mainheading app-panel">
                            <div className="border-lines"><span></span><span></span><span></span></div>
                            <h3>Manage your Profile</h3>
                        </div>

                        <div className="dashboard-section">
                            <div className="app-panel inpage">
                                <div className="w-80 m-100 m-auto ">
                                    <div className="customer-photo">
                                        {/* {
                                            psbuser.profilePix ==="no file" && */}
                                            <div className="">
                                                <label htmlFor="photo-upload" className="dp-placeholder" style={previewStyles}></label>
                                                <input type="file" name="" accept="image/*" id="photo-upload"  onChange={this.HandleFileUpLoad}/>
                                            </div>
                                        {/* } */}

                                        {/* {
                                            (psbuser.profilePix !=="no file" && psbuser.profilePix !=="") &&
                                            <div className="">
                                                <label htmlFor="photo-upload" className="dp-placeholder" style={previewStyles}></label>
                                                <input type="file" name="" id="photo-upload"  onChange={this.HandleFileUpLoad}/>
                                            </div>
                                        } */}
                                        <div className="helptext">Update photo</div>

                                    </div>
                                    {invalidImageUpload &&
                                        <Alert variant="danger">
                                            Please upload a valid image
                                        </Alert>
                                    }
                                    <div className="customer-name-text">{psbuser.customerName.toLowerCase()}</div>
                                    <div className="customer-data-summary">
                                        <div className="each-info">
                                            <div className="info-title">Email address</div>
                                            <div className="info-data">{(psbuser.emailAddress!==null && psbuser.emailAddress!=="")?psbuser.emailAddress:"N/A"}</div>
                                        </div>
                                        <div className="each-info">
                                            <div className="info-title">Phone number</div>
                                            <div className="info-data">{psbuser.mobileNumber}</div>
                                        </div>
                                        {GetCustomerDashboardDataRequest.request_status=== dashboardConstants.GET_CUSTOMER_DASHBOARDDATA_SUCCESS &&
                                            <div className="each-info">
                                            
                                                <div className="info-title">BVN</div>
                                                
                                                {(
                                                    GetCustomerDashboardDataRequest.request_data.response !==undefined &&
                                                    GetCustomerDashboardDataRequest.request_data.response.profileData!==undefined &&
                                                    GetCustomerDashboardDataRequest.request_data.response.profileData!==null &&
                                                    GetCustomerDashboardDataRequest.request_data.response.profileData!=="" &&
                                                    GetCustomerDashboardDataRequest.request_data.response.profileData.bvn) &&

                                                    <div className="info-data">
                                                        {GetCustomerDashboardDataRequest.request_data.response !==undefined &&
                                                            <span>{GetCustomerDashboardDataRequest.request_data.response.profileData.bvn}</span>
                                                        }
                                                    </div>
                                                }
                                                
                                                
                                                {/* {((GetCustomerDashboardDataRequest.request_status=== dashboardConstants.GET_CUSTOMER_DASHBOARDDATA_SUCCESS
                                                    || GetCustomerDashboardDataRequest.request_status!== dashboardConstants.GET_CUSTOMER_DASHBOARDDATA_SUCCESS) && 
                                                        (   
                                                            GetCustomerDashboardDataRequest.request_data.response !==undefined &&
                                                            GetCustomerDashboardDataRequest.request_data.response.profileData===undefined ||
                                                            GetCustomerDashboardDataRequest.request_data.response.profileData===null ||
                                                            GetCustomerDashboardDataRequest.request_data.response.profileData.bvn===null ||
                                                            GetCustomerDashboardDataRequest.request_data.response.profileData.bvn===undefined
                                                        )
                                                    ) &&
                                                    <div className="info-data"> <span>N/A</span> </div>
                                                } */}

                                                {(    
                                                            GetCustomerDashboardDataRequest.request_data.response ===undefined ||
                                                            GetCustomerDashboardDataRequest.request_data.response.profileData===undefined ||
                                                            GetCustomerDashboardDataRequest.request_data.response.profileData===null ||
                                                            GetCustomerDashboardDataRequest.request_data.response.profileData.bvn===null ||
                                                            GetCustomerDashboardDataRequest.request_data.response.profileData.bvn===undefined &&
                                                            GetCustomerDashboardDataRequest.request_data.response.profileData.bvn===""
                                                        
                                                    ) &&
                                                    <div className="info-data"> <span>N/A</span> </div>
                                                }
                                            </div>
                                        }
                                    </div>
                                    <div className="blocked-list">
                                        <div className="all-blocked-list">
                                            <div  className="blocked-bar-link" onClick={() => history.push(`/app/account-settings/change-password`)}>
                                                <div>
                                                    <div className="main-text">Change Password</div>
                                                    <div className="sub-text">Change your password</div>
                                                </div>
                                                <img src={RightCaret} alt="" />
                                            </div>
                                            <div  className="blocked-bar-link" onClick={() => history.push(`/app/account-settings/change-pin`)}>
                                                <div>
                                                    <div className="main-text">Change PIN</div>
                                                    <div className="sub-text">Can remember but want to change my PIN</div>
                                                </div>
                                                <img src={RightCaret} alt="" />
                                            </div>
                                            <div  className="blocked-bar-link" onClick={() => history.push(`/app/account-settings/reset-pin`)}>
                                                <div>
                                                    <div className="main-text">Reset/Unblock PIN</div>
                                                    <div className="sub-text">PIN is blocked or cannot remember PIN</div>
                                                </div>
                                                <img src={RightCaret} alt="" />
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <DownloadApp />

                </div>
            </div>
        )
    }

    

    
    



    

  
    


    render() {
        
        
        return (
            <Fragment>
                <Helmet>
                    <title>9PSB - Account settings</title>
                </Helmet>
                <InAppContainer>
                <div className="inapp-page">
                    <div className="page-heading">
                        <h3>Account settings</h3>
                    </div>
                   {this.renderPageContent()}
                </div>
                </InAppContainer>
            </Fragment>
        );
    }
}



function mapStateToProps(state) {
    return {
        
        GetCustomerDashboardDataReducer : state.accountsReducers.GetCustomerDashboardDataReducer,
    };
}

export default connect(mapStateToProps)(AccountSettings);