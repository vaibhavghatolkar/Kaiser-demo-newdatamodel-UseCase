import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App';
import { Redirect } from 'react-router-dom'
import IdleTimer from 'react-idle-timer';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import { Claims } from './app/containers/Claims/Dashboard';
import { TradingPartnerConfiguration } from './app/containers/TradingPartnerConfiguration';
import { SubmitClaim } from './app/containers/SubmitClaim';
import { RealTime276 } from './app/containers/Claim_276_RealTime/Real_Time_276';
import { AuditSummary270 } from './app/containers/AuditSummary270';
import { ClaimsError } from './app/containers/Claims/ClaimsError';
import { MatchClaims } from './app/containers/Claims/MatchClaims';
import { ResearchQueue } from './app/containers/ResearchQueue';
// import { EnrollmentInbound } from './app/containers/Claims/EnrollmentInbound';
import { AssignedDetails } from './app/containers/Claims/AssignedDetails';
import { EditConfiguration } from './app/containers/EditConfigurations';
import { ViewEdit } from './app/containers/ViewEdit';
import { CoveredICDCode } from './app/containers/Covered';
import { NonCovered } from './app/containers/NonCovered'
import { TransactionSetup } from './app/containers/TransactionSetup'
import { CompanionGuide } from './app/containers/CompanionGuide';
import { EligibilityDetails } from './app/containers/EligibilityDetails';
import { Sidebar } from './app/components/Sidebar';
import { AuditSummary } from './app/containers/Claims/AuditSummary';
import Strings from './helpers/Strings';
import { Header } from './app/components/Header';
import { Files_834 } from './app/containers/Files_834';
import { ViewCustomEdits } from './app/containers/View_customEdit';
import { UserList } from './app/containers/User_List';
import { MenuCreate } from './app/containers/Menu_Create';
import { ChangePassword } from './app/containers/Change_Password';
import { Login } from './app/containers/login'
// import { EnrollmentErrors } from './app/containers/Enrollment_errors';
import { Outbound_dashboard } from './app/containers/Outbound_dashboard';
// import { CustomDBDetails } from './app/containers/CustomDB_Details'
// import { EnrollmentDetails } from './app/containers/Enrollment_details';
import { OutboundDetails } from './app/containers/Outbound_details'
import { ClaimDetails837 } from './app/containers/RealTime_837_Claim/Claim_Details_837'
import { RealTimeDashboard } from './app/containers/RealTime_837_Claim/RealTimeDashboard'
import { ClaimProcessingSummary } from './app/containers/RealTime_837_Claim/RealTime_ClaimProcessingSummary'
import { Files_837 } from './app/containers/Files_837'
import { MenuManagement } from './app/containers/Menu_Management'
import { StatewiseTradingPartner } from './app/containers/StatewiseTradingPartner'
// import { EncounterDashboard } from './app/containers/Encounter/EncounterDashboard'
// import { EncounterDetails } from './app/containers/Encounter/EncounterDetails'
import styles from './app/containers/Files/files-styles.css'

import { DynamicSidebar } from './app/components/DynamicSidebar'
import { ServiceDetails278 } from './app/containers/Service_details278'
import { ClaimPaymentDashboard } from './app/containers/ClaimPayment_835/ClaimsPaymentDashboard';
import { ClaimPaymentDetails } from './app/containers/ClaimPayment_835/ClaimsPaymentDetails';
import { _277CAReponse } from './app/containers/_277CAResponse';
import { response_999 } from './app/containers/999_response';
import { Outbound_ClaimProcessingSummary } from './app/containers/Outbound_RealTime_837_Claim/Outbound_RealTime_ClaimProcessingSummary'
import { Outbound_RealTimeDashboard } from './app/containers/Outbound_RealTime_837_Claim/Outbound_RealTimeDashboard'
import { Outbound_ClaimDetails837 } from './app/containers/Outbound_RealTime_837_Claim/Outbound_Claim_Details_837'
import { Outbound_AuditSummary } from './app/containers/Outbound_RealTime_837_Claim/Outbound_AuditSummery'
import { Outbound_277CAReponse } from './app/containers/Outbound_277CAResponse';
import { Outbound_ClaimsError } from './app/containers/Outbound_RealTime_837_Claim/Outbound_ClaimError'
import { Outbound_response_999 } from './app/containers/Outbound_999_response'
// import { Inbound_Encounter_RealTimeDashboard } from './app/containers/InboundEncounter/Inbound_Encounter_RealTimeDashboard';
// import { Inbound_Encounter_ClaimProcessingSummary } from './app/containers/InboundEncounter/Inbound_Encounter_RealTime_ClaimProcessingSummary';
// import { Outbound_Encounter_RealTimeDashboard } from './app/containers/InboundEncounter/Outbound_Encounter_RealTimeDashboard'

// import { Inbound_Encounter_Audit } from './app/containers/InboundEncounter/Inbound_Encounter_AuditSummary';
// import { Outbound_Encounter_Audit } from './app/containers/InboundEncounter/Outbound_Encounter_AuditSummary';
// import { Outbound_Encounter_ClaimProcessingSummary } from './app/containers/InboundEncounter/Outbound_Encounter_RealTime_ClaimProcessingSummary';
import { Outbound_TradingPartnerConfiguration } from './app/containers/OutboundAdmin/Outbound_TradingPartnerConfiguration';

import { Outbound_StatewiseTradingPartner } from './app/containers/OutboundAdmin/Outbound_StatewiseTradingPartner';
import { Outbound_TransactionSetup } from './app/containers/Outbound_TransactionSetup';
import { Outbound_EditConfigurations } from './app/containers/Outbound_EditConfigurations';
import { Outbound_View_customEdit } from './app/containers/Outbound_View_customEdit';
import { Outbound_Covered } from './app/containers/Outbound_Covered';
import { Outbound_NonCovered } from './app/containers/Outbound_NonCovered';
import { Outbound_CompanionGuide } from './app/containers/Outbound_CompanionGuide';
import { NPILook_Up } from './app/containers/NPILook_Up';
import { Outbound_NPILook_Up } from './app/containers/OutboundAdmin/Outbound_NPILook_Up';
import {Outbound_View_customEditNew} from './app/containers/Outbound_ViewCustomEditNew'
import {View_CustomEditsNew} from './app/containers/view_CustomEditNew'
// import { Outbound_Encounter_ClaimDetails837 } from './app/containers/InboundEncounter/Outbound_Encounter_Claim_Details_837'
import { OutboundMatchClaims } from './app/containers/Claims/OutboundMatchClaims';
import { Outbound_BatchDetails837 } from './app/containers/Outbound_RealTime_837_Claim/Outbound_Batch_Details_837';
// import { Outbound_Encounter_BatchDetails837 } from './app/containers/InboundEncounter/Outbound_Encounter_Batch_Details_837';
import { Remittance_Viewer } from './app/containers/Remittance_Viewer';
import { Claim_Details_837_Grid } from './app/containers/RealTime_837_Claim/Claim_Details_837_Grid'
import { RealTimeDashboard_New } from './app/containers/RealTime_837_Claim/RealTimeDashboard_New';
import { Payment_details } from './app/containers/ClaimPayment_835/PaymentDetails';
import { Load_Exception } from './app/containers/RealTime_837_Claim/Load_Exception';
import {AuditSummary835} from './app/containers/ClaimPayment_835/AuditSummary835'
import { ClaimPayment_835_Exception } from './app/containers/ClaimPayment_835/ClaimPayment_835_Exception';
import { ClaimPayment_835_ProcessingSummary } from './app/containers/ClaimPayment_835/ClaimPayment_835_ProcessingSummary';



// import "ag-grid-enterprise/dist/styles/ag-grid.css";
// import "ag-grid-enterprise/dist/styles/ag-theme-balham.css";

// import {LicenseManager} from "ag-grid-enterprise";
// LicenseManager.setLicenseKey(Strings.license_key);

const $ = window.$;
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
                                {/* <Route exact path="/" component={RealTime276} /> */}
                                {/* <Route path={'/' + Strings.claimsDashboard} component={Claims} /> */}
                                <Route path={'/' + Strings.submitClaims} component={SubmitClaim} />
                                {/* <Route path={'/'+ Strings.RealTime276 + '/:apiflag'} component={RealTime276}/>
                    <Route path={'/'+ Strings.RealTime270  + '/:apiflag'} component={RealTime276} /> */}

                                <Route path={'/' + Strings.RealTime276} component={RealTime276} />
                                <Route path={'/' + Strings.RealTime270} component={RealTime276} />
                                <Route path={'/' + Strings.AuditSummary270} component={AuditSummary270} />
                                <Route path={'/' + Strings.claimsAudit} component={AuditSummary} />
                                <Route path={'/' + Strings.claimsError} component={ClaimsError} />
                                <Route path={'/' + Strings.matchClaims} component={MatchClaims} />
                                <Route path={'/' + Strings.outbound_matchClaims} component={OutboundMatchClaims} />
                                <Route path={'/' + Strings.researchQueue} component={ResearchQueue} />
                                {/* <Route path={'/' + Strings.claimsDashboard_834} component={EnrollmentInbound} /> */}
                                <Route path={'/' + Strings.editConfiguration} component={EditConfiguration} />
                                <Route path={'/'+ Strings.tradingPartnerDetails} component={StatewiseTradingPartner} />
                                <Route path={'/' + Strings.viewEdit} component={ViewEdit} />
                                <Route path={'/' + Strings.transactionSetup} component={TransactionSetup} />
                                <Route path={'/' + Strings.companionGuide} component={CompanionGuide} />
                                <Route path={'/' + Strings.covered} component={CoveredICDCode} />
                                <Route path={'/' + Strings.noncovered} component={NonCovered} />
                                <Route path={'/' + Strings.validation} component={Claims} />
                                <Route path={'/'+ Strings.tradingPartnerConfiguration} component={TradingPartnerConfiguration} />
                                <Route path={'/' + Strings.ViewCustomEdits} component={ViewCustomEdits} />
                                <Route path={'/' + Strings.files_834 + '/:flag'} component={Files_834} />
                                {/* <Route path={'/'+ Strings.ElilgibilityDetails270 + '/:apiflag/:State/:selectedTradingPartner/:startDate/:endDate/:transactionId/:status/:count'} component={EligibilityDetails} />
                    <Route path={'/'+ Strings.elilgibilityErrors270 + '/:apiflag/:State/:selectedTradingPartner/:startDate/:endDate/:transactionId/:status/:count'} component={EligibilityDetails} />
                    <Route path={'/'+ Strings.ElilgibilityDetails276 + '/:apiflag/:State/:selectedTradingPartner/:startDate/:endDate/:transactionId/:status/:count'} component={EligibilityDetails} />
                    <Route path={'/'+ Strings.elilgibilityErrors276 + '/:apiflag/:State/:selectedTradingPartner/:startDate/:endDate/:transactionId/:status/:count'} component={EligibilityDetails} /> */}
                                <Route path={'/' + Strings.ElilgibilityDetails270} component={EligibilityDetails} />
                                <Route path={'/' + Strings.elilgibilityErrors270} component={EligibilityDetails} />
                                <Route path={'/' + Strings.ElilgibilityDetails276} component={EligibilityDetails} />
                                <Route path={'/' + Strings.elilgibilityErrors276} component={EligibilityDetails} />

                                <Route path={'/' + Strings.UserList} component={UserList} />
                                <Route path={'/' + Strings.MenuCreate} component={MenuCreate} />
                                <Route path={'/' + Strings.ChangePassword} component={ChangePassword} />
                                <Route path={'/' + Strings.claimsDashboard_834_details } component={Files_834} />
                                <Route path={'/' + Strings.EnrollmentError} component={Files_834} />
                                {/* <Route path={'/' + Strings.EnrollmentErrors} component={EnrollmentErrors} /> */}

                                {/* <Route path={'/' + Strings.EnrollmentDetails} component={EnrollmentDetails} /> */}
                                <Route path={'/' + Strings.Outbound_dashboard} component={Outbound_dashboard} />

                                <Route path={'/' + Strings.OutboundDetails} component={OutboundDetails} />
                                {/* <Route path={'/'+ Strings.ClaimDetails837 + '/:flag/:selectedTradingPartner/:startDate/:endDate'} component={ClaimDetails837} /> */}
                                <Route path={'/' + Strings.ClaimDetails837} component={ClaimDetails837} />
                                {/* <Route path={'/' + Strings.RealTimeDashboard} component={RealTimeDashboard} /> */}
                                <Route path={'/' + Strings.RealTimeDashboard} component={RealTimeDashboard_New} />
                                <Route path={'/'+ Strings.ClaimProcessingSummary} component={ClaimProcessingSummary} />
                                <Route path={'/' + Strings.Files_837} component={Files_837} />
                                <Route path={'/' + Strings.MenuManagement} component={MenuManagement} />
                                {/* <Route path={'/' + Strings.EncounterDashboard} component={EncounterDashboard} />
                                <Route path={'/' + Strings.EncounterDetails} component={EncounterDetails} /> */}
                                
                                {/* <Route path={'/' + Strings.Inbound_EncounterDashboard} component={Inbound_Encounter_RealTimeDashboard} /> */}
                                {/* <Route path={'/' + Strings.Inbound_EncounterDetails} component={Inbound_Encounter_ClaimDetails837} /> */}
                                {/* <Route path={'/' + Strings.Inbound_Encounter_ClaimProcessingSummary} component={Inbound_Encounter_ClaimProcessingSummary} /> */}

                                <Route path={'/' + Strings.claimPayment_835} component={ClaimPaymentDashboard} />
                                <Route path={'/' + Strings.claimPayment_835_details} component={ClaimPaymentDetails} />
                                <Route path={'/' + Strings.serviceDetails278} component={ServiceDetails278} />
                                <Route path={'/' + Strings._277CAResponse} component={_277CAReponse} />
                                <Route path={'/' + Strings.Outbound_277CAResponse} component={Outbound_277CAReponse} />
                                <Route path={'/' + Strings.response_999} component={response_999} />
                                <Route path={'/' + Strings.Outbound_ClaimProcessingSummary} component={Outbound_ClaimProcessingSummary} />
                                <Route path={'/' + Strings.Outbound_RealTimeDashboard} component={Outbound_RealTimeDashboard} />
                                <Route path={'/' + Strings.Outbound_ClaimDetails837} component={Outbound_ClaimDetails837} />
                                <Route path={'/' + Strings.Outbound_ClaimsError} component={Outbound_ClaimsError} />
                                {/* <Route path={'/' + Strings.Inbound_Encounter_Audit} component={Inbound_Encounter_Audit} /> */}
                                <Route path={'/' + Strings.Outbound_AuditSummary} component={Outbound_AuditSummary} />
                                <Route path={'/' + Strings.Outbound_response_999} component={Outbound_response_999} />
                                {/* <Route path={'/' + Strings.Outbound_Encounter_RealTimeDashboard} component={Outbound_Encounter_RealTimeDashboard} />
                                <Route path={'/' + Strings.Outbound_Encounter_Audit} component={Outbound_Encounter_Audit} />
                                <Route path={'/' + Strings.Outbound_Encounter_ClaimProcessingSummary} component={Outbound_Encounter_ClaimProcessingSummary} /> */}
                              
                                <Route path={'/' + Strings.Outbound_TradingPartnerConfiguration} component={Outbound_TradingPartnerConfiguration} />
                                <Route path={'/' + Strings.Outbound_StatewiseTradingPartner} component={Outbound_StatewiseTradingPartner} />
                                <Route path={'/' + Strings.Outbound_TransactionSetup} component={Outbound_TransactionSetup} />
                                <Route path={'/' + Strings.Outbound_EditConfigurations} component={Outbound_EditConfigurations} />
                                <Route path={'/' + Strings.Outbound_View_customEdit} component={Outbound_View_customEdit} />
                                <Route path={'/' + Strings.Outbound_Covered} component={Outbound_Covered} />
                                <Route path={'/' + Strings.Outbound_NonCovered} component={Outbound_NonCovered} />
                                <Route path={'/' + Strings.Outbound_CompanionGuide} component={Outbound_CompanionGuide} />
                                {/* <Route path={'/' + Strings.Outbound_Encounter_ClaimDetails837} component={Outbound_Encounter_ClaimDetails837} /> */}
                                <Route path={'/' + Strings.NPILook_Up} component={NPILook_Up} />
                                <Route path={'/' + Strings.Outbound_NPILook_Up} component={Outbound_NPILook_Up} />
                                <Route path={'/' + Strings.Outbound_View_customEditNew} component={Outbound_View_customEditNew} />
                                <Route path={'/' + Strings.View_CustomEditsNew} component={View_CustomEditsNew} />
                                <Route path={'/' + Strings.Outbound_BatchDetails837} component={Outbound_BatchDetails837} />
                                {/* <Route path={'/' + Strings.Outbound_Encounter_BatchDetails837} component={Outbound_Encounter_BatchDetails837} /> */}
                                <Route path={'/' + Strings.Remittance_Viewer} component={Remittance_Viewer} />
                                <Route path={'/' + Strings.Claim_Details_837_Grid} component={Claim_Details_837_Grid} />
                                <Route path={'/' + Strings.Payment_details} component={Payment_details} />
                                <Route path={'/' + Strings.Load_Exception} component={Load_Exception} />
                                <Route path={'/' + Strings.AuditSummary835} component={AuditSummary835} />
                                    
                                <Route path={'/' + Strings.ClaimPayment_835_Exception} component={ClaimPayment_835_Exception} />
                                <Route path={'/' + Strings.ClaimPayment_835_ProcessingSummary} component={ClaimPayment_835_ProcessingSummary} />
                                <Route path={'/' + Strings.Inbound_response_999} component={Outbound_response_999} />
                                {/* <Route path={'/'+ Strings.Files_837 + '/:flag/:selectedTradingPartner/:startDate/:endDate'}  component={Files_837} /> */}

                                

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
