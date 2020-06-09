import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom'
import IdleTimer from 'react-idle-timer';
import { Route, BrowserRouter as Router } from 'react-router-dom'
import { TradingPartnerConfiguration } from './app/containers/TradingPartnerConfiguration';
import { RealTime276 } from './app/containers/Claim_276_RealTime/Real_Time_276';
import { EditConfiguration } from './app/containers/EditConfigurations';
import { ViewEdit } from './app/containers/ViewEdit';
import { CoveredICDCode } from './app/containers/Covered';
import { NonCovered } from './app/containers/NonCovered'
import { TransactionSetup } from './app/containers/TransactionSetup'
import { CompanionGuide } from './app/containers/CompanionGuide';
import { EligibilityDetails } from './app/containers/EligibilityDetails';
import { AuditSummary } from './app/containers/Claims/AuditSummary';
import Strings from './helpers/Strings';
import { Header } from './app/components/Header';
import { ViewCustomEdits } from './app/containers/View_customEdit';
import { UserList } from './app/containers/User_List';
import { MenuCreate } from './app/containers/Menu_Create';
import { Login } from './app/containers/login'
import { ClaimProcessingSummary } from './app/containers/RealTime_837_Claim/RealTime_ClaimProcessingSummary'
import { MenuManagement } from './app/containers/Menu_Management'
import { StatewiseTradingPartner } from './app/containers/StatewiseTradingPartner'

import { DynamicSidebar } from './app/components/DynamicSidebar'
import { ClaimPaymentDashboard } from './app/containers/ClaimPayment_835/ClaimsPaymentDashboard';
import { ClaimPaymentDetails } from './app/containers/ClaimPayment_835/ClaimsPaymentDetails';
import { Outbound_277CAReponse } from './app/containers/Outbound_277CAResponse';
import { Outbound_response_999 } from './app/containers/Outbound_999_response'

import { NPILook_Up } from './app/containers/NPILook_Up';
import {View_CustomEditsNew} from './app/containers/view_CustomEditNew'
import { Claim_Details_837_Grid } from './app/containers/RealTime_837_Claim/Claim_Details_837_Grid'
import { RealTimeDashboard_New } from './app/containers/RealTime_837_Claim/RealTimeDashboard_New';
import { Payment_details } from './app/containers/ClaimPayment_835/PaymentDetails';
import { Load_Exception } from './app/containers/RealTime_837_Claim/Load_Exception';
import {AuditSummary835} from './app/containers/ClaimPayment_835/AuditSummary835'
import { ClaimPayment_835_Exception } from './app/containers/ClaimPayment_835/ClaimPayment_835_Exception';
import { ClaimPayment_835_ProcessingSummary } from './app/containers/ClaimPayment_835/ClaimPayment_835_ProcessingSummary';
import {viewCustomEdit_New} from './app/containers/viewCustomEdit_new'



// import "ag-grid-enterprise/dist/styles/ag-grid.css";
// import "ag-grid-enterprise/dist/styles/ag-theme-balham.css";

// import {LicenseManager} from "ag-grid-enterprise";
// LicenseManager.setLicenseKey(Strings.license_key);

class PrivateRoute extends React.Component {
    constructor(props) {
        super(props);
        const token = sessionStorage.getItem("token");
        let loggedIn;

        if (token == null) {
            loggedIn = false;
        } else {
            loggedIn = true
        }

        this.state = {

            loggedIn,
            // timeout: 1200000,
             timeOut: 1000*600,
            isTimedOut: false
        };

        this.handleFlag = this.handleFlag.bind(this)
        this.idleTimer = null
        this.onAction = this.onAction.bind(this)
        this.onActive = this.onActive.bind(this)
        this.onIdle = this.onIdle.bind(this)

    }

    handleFlag(loggedIn) {
        this.setState({

            loggedIn: loggedIn
        })

    }

    onAction(e) {
        this.setState({ isTimedOut: false })
    }

    onActive(e) {
        this.setState({ isTimedOut: false })
    }

    onIdle(e) {
        const isTimedOut = this.state.isTimedOut

        if (isTimedOut) {
            localStorage.clear()
            sessionStorage.clear()
            window.location.reload()
        } else {
            this.setState({ showModal: true })
            this.idleTimer.reset();
            this.setState({ isTimedOut: true })
        }
    }

    render() {
        let data = []
        data = [
            { apiflag: '1' },
        ]
        return (
            <Router>

                <IdleTimer
                    ref={ref => { this.idleTimer = ref }}
                    element={document}
                    onActive={this.onActive}
                    onIdle={this.onIdle}
                    onAction={this.onAction}
                    debounce={250}
                    timeout={this.state.timeOut} />

                {this.state.loggedIn === false ?
                    <div> <Route exact path="/" render={(props) => <Login handleFlag={this.handleFlag} {...props} />} />
                        <Route render={() => <Redirect to={{ pathname: "/" }} />} />
                    </div> :
                    <div className="container-fluid white-background">
                        <Header /> <br /><br /><br /><br /><br />
                        <div className="row">
                            <div className="sidebar-width nopadding white-background col-2">
                                <DynamicSidebar
                                    handleFlag={this.handleFlag}
                                />
                            </div>
                            <div id="Col-12" className="col-10" style={{ minHeight: '100vh' }}>
                                {/* <div className="row border-bottom" style={{marginTop: '-5px', marginBottom: '12px'}}>
                                    <div className="padding-view">
                                        <img src={require('./app/components/Images/search.png')} style={{width: '14px', margin : '8px', marginTop: '12px'}}></img>
                                    </div>
                                    <div className="col-11 padding-view">
                                        <input type="text" name="name" className="search-input-style col-12" placeholder="Search" />
                                    </div>
                                </div> */}
                                <Route exact path="/">
                                    {this.state.loggedIn == true ?

                                        <Redirect to={{
                                            pathname: '/' + Strings.RealTimeDashboard, state: { data }
                                        }} /> : <Redirect to="/" />}
                                </Route>
                                <Route path={'/' + Strings.RealTime276} component={RealTime276} />
                                <Route path={'/' + Strings.RealTime270} component={RealTime276} />
                                <Route path={'/' + Strings.claimsAudit} component={AuditSummary} />
                                <Route path={'/' + Strings.editConfiguration} component={EditConfiguration} />
                                <Route path={'/'+ Strings.tradingPartnerDetails} component={StatewiseTradingPartner} />
                                <Route path={'/' + Strings.viewEdit} component={ViewEdit} />
                                <Route path={'/' + Strings.transactionSetup} component={TransactionSetup} />
                                <Route path={'/' + Strings.companionGuide} component={CompanionGuide} />
                                <Route path={'/' + Strings.covered} component={CoveredICDCode} />
                                <Route path={'/' + Strings.noncovered} component={NonCovered} />
                                <Route path={'/'+ Strings.tradingPartnerConfiguration} component={TradingPartnerConfiguration} />
                                <Route path={'/' + Strings.ViewCustomEdits} component={ViewCustomEdits} />
                                <Route path={'/' + Strings.ElilgibilityDetails270} component={EligibilityDetails} />
                                <Route path={'/' + Strings.elilgibilityErrors270} component={EligibilityDetails} />
                                <Route path={'/' + Strings.ElilgibilityDetails276} component={EligibilityDetails} />
                                <Route path={'/' + Strings.elilgibilityErrors276} component={EligibilityDetails} />

                                <Route path={'/' + Strings.UserList} component={UserList} />
                                <Route path={'/' + Strings.MenuCreate} component={MenuCreate} />

                                <Route path={'/' + Strings.RealTimeDashboard} component={RealTimeDashboard_New} />
                                <Route path={'/'+ Strings.ClaimProcessingSummary} component={ClaimProcessingSummary} />
                                <Route path={'/'+ Strings._ClaimProcessingSummary} component={ClaimProcessingSummary} />
                                <Route path={'/' + Strings.MenuManagement} component={MenuManagement} />

                                <Route path={'/' + Strings.claimPayment_835} component={ClaimPaymentDashboard} />
                                <Route path={'/' + Strings.claimPayment_835_details} component={ClaimPaymentDetails} />
                                <Route path={'/' + Strings.Outbound_277CAResponse} component={Outbound_277CAReponse} />
                                <Route path={'/' + Strings.Outbound_response_999} component={Outbound_response_999} />
                              
                                
                                <Route path={'/' + Strings.NPILook_Up} component={NPILook_Up} />
                                <Route path={'/' + Strings.View_CustomEditsNew} component={View_CustomEditsNew} />
                                <Route path={'/' + Strings.Claim_Details_837_Grid} component={Claim_Details_837_Grid} />
                                <Route path={'/' + Strings.Payment_details} component={Payment_details} />
                                <Route path={'/' + Strings.Load_Exception} component={Load_Exception} />
                                <Route path={'/' + Strings.AuditSummary835} component={AuditSummary835} />
                                    
                                <Route path={'/' + Strings.ClaimPayment_835_Exception} component={ClaimPayment_835_Exception} />
                                <Route path={'/' + Strings.ClaimPayment_835_ProcessingSummary} component={ClaimPayment_835_ProcessingSummary} />
                                <Route path={'/' + Strings._ClaimPayment_835_ProcessingSummary} component={ClaimPayment_835_ProcessingSummary} />
                                <Route path={'/' + Strings.Inbound_response_999} component={Outbound_response_999} />
                                <Route path={'/' + Strings._ElilgibilityDetails270} component={EligibilityDetails} />
                                <Route path={'/' + Strings._ElilgibilityDetails276} component={EligibilityDetails} />
                                <Route path={'/' + Strings._Claim_Details_837_Grid} component={Claim_Details_837_Grid} />
                                <Route path={'/' + Strings._Outbound_response_999} component={Outbound_response_999} />
                                <Route path={'/' + Strings._Outbound_277CAResponse} component={Outbound_277CAReponse} />
                                <Route path={'/' + Strings._claimPayment_835_details} component={ClaimPaymentDetails} />
                                <Route path={'/' + Strings._Inbound_response_999} component={Outbound_response_999} />
                                <Route path={'/' + Strings._Load_Exception} component={Load_Exception} />
                                <Route path={'/' + Strings.viewCustomEdit_New} component={viewCustomEdit_New} />
                                
                                
                            </div>
                        </div>
                    </div>
                }

            </Router>
        )
    }
}

ReactDOM.render(<PrivateRoute />, document.getElementById('app'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
