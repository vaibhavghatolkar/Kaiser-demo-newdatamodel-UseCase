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
import { View_CustomEditsNew } from './app/containers/view_CustomEditNew'
import { Claim_Details_837_Grid } from './app/containers/RealTime_837_Claim/Claim_Details_837_Grid'
import { RealTimeDashboard_New } from './app/containers/RealTime_837_Claim/RealTimeDashboard_New';
import { Payment_details } from './app/containers/ClaimPayment_835/PaymentDetails';
import { Load_Exception } from './app/containers/RealTime_837_Claim/Load_Exception';
import { AuditSummary835 } from './app/containers/ClaimPayment_835/AuditSummary835'
import { ClaimPayment_835_Exception } from './app/containers/ClaimPayment_835/ClaimPayment_835_Exception';
import { ClaimPayment_835_ProcessingSummary } from './app/containers/ClaimPayment_835/ClaimPayment_835_ProcessingSummary';
import { viewCustomEdit_New } from './app/containers/viewCustomEdit_new'

import { HealthCare278 } from './app/containers/Health_care_278_dashboard'
import { ServiceDetails278 } from './app/containers/Service_details278'
import { PatientDetails } from './app/containers/PatientDetails';
import { ADT } from './app/containers/HL7/HL7_screen';
import { PatientDashboard } from './app/containers/PatientDashboard';
import { Patients } from './app/containers/Patients'
import { NewPatient } from './app/containers/New_Patient'
import { SubmitClaim } from './app/containers/SubmitClaim';
import { MatchClaims } from './app/containers/Claims/MatchClaims';
import { ResearchQueue } from './app/containers/ResearchQueue';
import { ChangePassword } from './app/containers/Change_Password';
import { Outbound_Encounter_updated_ProcessingSummary } from './app/containers/RealTime_Encounter/Outbound_Encounter_updated_ProcessingSummary';
import { Encounter_Load_Exception } from './app/containers/RealTime_Encounter/Encounter_Load_Exception';
import { Outbound_Encounter_response_999 } from './app/containers/Outbound_Encounter_999_response';
import { Outbound_Encounter_277CAReponse } from './app/containers/Outbound_Encounter_277CAResponse';
import { Outbound_Encounter_updated_Details_837_Grid } from './app/containers/RealTime_Encounter/Outbound_Encounter_updated_Details_837_Grid';
import { Outbound_Encounter_updated_Dashboard_New } from './app/containers/RealTime_Encounter/Outbound_Encounter_updated_Dashboard_New';
import { EncounterProcessingSummary } from './app/containers/RealTime_Encounter/EncounterProcessingSummary';
import { EncounterDetails_837_Grid } from './app/containers/RealTime_Encounter/EncounterDetails_837_Grid';
import { EncounterAuditSummary } from './app/containers/RealTime_Encounter/EncounterAuditSummary';
import { EncounterDashboard_New } from './app/containers/RealTime_Encounter/EncounterDashboard_New';
import { Outbound_Encounter_updated_AuditSummary } from './app/containers/RealTime_Encounter/Outbound_Encounter_updated_AuditSummary';

import { EnrollmentDashboard } from './app/containers/Enrollment/EnrollmentDashboard'
import { Files_834 } from './app/containers/Files_834'
import { PremiumPaymentLoad } from './app/containers/820_Dashboard'
import { PremiumPaymentLoadDetails } from './app/containers/PremiumPaymentLoadDetails'
import { MMRFileLoad } from './app/containers/MmrFileLoad'
import { MMRFileLoadDetails } from './app/containers/MMRFileLoadDetails'
import { PremiumPaymentFileCompare } from './app/containers/PremiumPaymentFileCompare'
import { RateCode820Mismatch } from './app/containers/820_RateCode_mismatch'
import { ActiveQnxt820 } from './app/containers/ActiveQnxt820'
import { TermQnxt820 } from './app/containers/TermQnxt820'
import { OutboundActive } from './app/containers/OutboundActive'
import { OutboundTerm } from './app/containers/OutboundTerm'
import { Outbound_Encounter_BatchDetails837 } from './app/containers/RealTime_Encounter/Outbound_Encounter_Batch_Details_837';
import { Outbound_Encounter_updated_FileDashboard } from './app/containers/RealTime_Encounter/Outbound_Encounter_updated_FileDashboard';
import { consent_management } from './app/containers/consent_management';
import { RDE } from './app/containers/HL7/Medications'
import { ORU } from './app/containers/HL7/ORU'
import { DFT } from './app/containers/HL7/DFT'
import { FHiR_API_management } from './app/containers/FHiR_API_management'
import { Outbound_Encounter_StatewiseTradingPartner } from './app/containers/RealTime_Encounter/Outbound_Encounter_StatewiseTradingPartner'
import { TransactionSetup_New } from './app/containers/TransactionSetup_New'
import { Encounter_view_CustomEditNew } from './app/containers/RealTime_Encounter/Encounter_view_CustomEditNew'
import { CrosswalkTable } from './app/containers/CrosswalkTable'
import{Enrollment_Outbound} from './app/containers/Enrollment/Enrollment_Outbound'
import{Enrollment_Details_Outbound} from './app/containers/Enrollment/Enrollment_Details_Outbound'

// import { RDE } from './app/containers/HL7/Medications'
// import { ORU } from './app/containers/HL7/ORU'
// import { DFT } from './app/containers/HL7/DFT'
// import { FHiR_API_management } from './app/containers/FHiR_API_management'
import { EthnicityMismatch } from './app/containers/EthnicityMismatch';
import { RateCode } from './app/containers/RateCode';
import { SameGenderTwin } from './app/containers/SameGenderTwin';
import { Duplicate } from './app/containers/Duplicate';
import { AddressMismatch } from './app/containers/Address';
import { DobMismatch } from './app/containers/DOB_Mismatch';
import { GenderMismatch } from './app/containers/Gender_mismatch';
import { Effective_date_Mismatch } from './app/containers/Effective_date_Mismatch';
import { LoadtoQNXT } from './app/containers/LoadtoQNXT';
import { EnrollmentLoadException } from './app/containers/EnrollmentLoadException';
import { DualCodeMismatch } from './app/containers/DualCode_Mismatch';

// import "ag-grid-enterprise/dist/styles/ag-grid.css";
// import "ag-grid-enterprise/dist/styles/ag-theme-balham.css";

import { LicenseManager } from "ag-grid-enterprise";
import { Enrollment_FullFileCompare } from './app/containers/Enrollment/Enrollment_FullFileCompare';
import { Enrollment_eligibiltyDetails } from './app/containers/Enrollment/Enrollment_eligibiltyDetails';
import { House_Head_Mismatch } from './app/containers/House_Head_Mismatch';
import { CustomService } from './app/containers/CustomService';
import { Enrollment_FullFileCompare_Dashboard } from './app/containers/Enrollment/Enrollment_FullFileComparison_Dashboard';
import { OutboundEnrollmentDashboard } from './app/containers/OutboundEnrollmentDashboard';
import { OutboundIdGenerated } from './app/containers/OutboundIdGenerated';
import {Enrollment_Outbound_JobList} from './app/containers/Enrollment/Enrollment_Outbound_JobList';
import {Prediction} from './app/containers/Prediction';
// import {Enrollment_Outbound_JobList} from './app/containers/Enrollment/Enrollment_Outbound_JobList'
import {Sepsis_Dashboard} from './app/containers/HL7/Sepsis_Dashboard'
import {ProviderDirectory} from './app/containers/Provider_DIrectory'

import { Transaction275Dashboard } from './app/containers/Transaction_275/Transaction275_Dashboard'
import { Transaction_275_Details } from './app/containers/Transaction_275/Transaction_275_Details'
import { ConsentManagement } from './app/containers/ConsentManagement';
import { ConsentUserList } from './app/containers/ConsentUserList';
import { PharmacyFormulation } from './app/containers/PharmacyFormulation';
import { Outbound_Encounter_updated_Payment } from './app/containers/RealTime_Encounter/Outbound_Encounter_updated_Payment';
import { EncounterCustomerService } from './app/containers/RealTime_Encounter/EncounterCustomerService';
import { Outbound_Complaince_Reporting } from './app/containers/RealTime_Encounter/Outbound_Compliance_Reporting';
import {Member_History} from './app/containers/Member_History'
import { Outbound_Claim_Batch_Details_837 } from './app/containers/RealTime_Encounter/Outbound_Claim_Batch_Details_837';
import { Outbound_Claim_updated_AuditSummary } from './app/containers/RealTime_Encounter/Outbound_Claim_updated_AuditSummary';
import { Outbound_Claim_updated_Dashboard_New } from './app/containers/RealTime_Encounter/Outbound_Claim_updated_Dashboard_New';
import { Outbound_Claim_updated_Details_837_Grid } from './app/containers/RealTime_Encounter/Outbound_Claim_updated_Details_837_Grid';
import { Outbound_Claim_updated_FileDashboard } from './app/containers/RealTime_Encounter/Outbound_Claim_updated_FileDashboard';
import { Outbound_Claim_updated_Payment } from './app/containers/RealTime_Encounter/Outbound_Claim_updated_Payment';
import { Outbound_Claim_updated_ProcessingSummary } from './app/containers/RealTime_Encounter/Outbound_Claim_updated_ProcessingSummary';
import {Outbound_Claim_277CAResponse} from './app/containers/Outbound_Claim_277CAResponse'
import {Outbound_Claim_999_response} from './app/containers/Outbound_Claim_999_response'
import { Outbound_Compliance_Reporting_Claims } from './app/containers/RealTime_Encounter/Outbound_Compliance_Reporting_Claims';
import { ClaimCustomerService } from './app/containers/RealTime_Encounter/ClaimCustomerService';
import { Outbound_Claim_Batch_Click_Details } from './app/containers/RealTime_Encounter/Outbound_Claim_Batch_Click_Details';
import Outbound_Encounter_StatewiseTradingPartner_Encounter from './app/containers/EncounterAdmin/Outbound_Encounter_StatewiseTradingPartner'
import TransactionSetup_Encounter from './app/containers/EncounterAdmin/TransactionSetup'
import Encounter_view_CustomEditNew_Encounter from './app/containers/EncounterAdmin/Encounter_view_CustomEditNew'
import CompanionGuide_Encounter from './app/containers/EncounterAdmin/CompanionGuide'
import {InboundClaimPaymentDashboard} from './app/containers/ClaimPayment_Inbound_835/Payment_Dashboard'



LicenseManager.setLicenseKey('CompanyName=HiPaaS Inc,LicensedApplication=HiPaaS,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=1,AssetReference=AG-007466,ExpiryDate=23_March_2021_[v2]_MTYxNjQ1NzYwMDAwMA==5449f6cc0f6b5dc99cfaad6a2982e250');

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
            timeOut: 1000 * 600,
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
                                {/* <Route exact path="/">
                                    {this.state.loggedIn == true ?

                                        <Redirect to={{
                                            pathname: '/' + Strings.RealTimeDashboard, state: { data }
                                        }} /> : <Redirect to="/" />}
                                </Route> */}
                                
                                <Route exact path="/">
                                    {
                                        this.state.loggedIn == true ?
                                            (
                                                sessionStorage.getItem("role_id") == 3936187
                                                    ?
                                                    <Redirect to={{
                                                        pathname: '/' + Strings.EnrollmentDashboard, state: { data }
                                                    }} />
                                                    :

                                                    sessionStorage.getItem("role_id") == 3936513
                                                    ?
                                                    <Redirect to={{
                                                        pathname: '/' + Strings.Inbound_EncounterDashboard, state: { data }
                                                    }} />
                                                    :

                                                    <Redirect to={{
                                                        pathname: '/' + Strings.RealTimeDashboard, state: { data }
                                                    }} />
                                            ) : <Redirect to="/" />
                                    }
                                </Route>
                                <Route path={'/' + Strings.RealTime276} component={RealTime276} />
                                <Route path={'/' + Strings.RealTime270} component={RealTime276} />
                                <Route path={'/' + Strings.claimsAudit} component={AuditSummary} />
                                <Route path={'/' + Strings.editConfiguration} component={EditConfiguration} />
                                <Route path={'/' + Strings.tradingPartnerDetails} component={StatewiseTradingPartner} />
                                <Route path={'/' + Strings.viewEdit} component={ViewEdit} />
                                <Route path={'/' + Strings.transactionSetup} component={TransactionSetup} />
                                <Route path={'/' + Strings.covered} component={CoveredICDCode} />
                                <Route path={'/' + Strings.noncovered} component={NonCovered} />
                                <Route path={'/' + Strings.tradingPartnerConfiguration} component={TradingPartnerConfiguration} />
                                <Route path={'/' + Strings.ViewCustomEdits} component={ViewCustomEdits} />
                                <Route path={'/' + Strings.ElilgibilityDetails270} component={EligibilityDetails} />
                                <Route path={'/' + Strings.elilgibilityErrors270} component={EligibilityDetails} />
                                <Route path={'/' + Strings.ElilgibilityDetails276} component={EligibilityDetails} />
                                <Route path={'/' + Strings.elilgibilityErrors276} component={EligibilityDetails} />

                                <Route path={'/' + Strings.UserList} component={UserList} />
                                <Route path={'/' + Strings.MenuCreate} component={MenuCreate} />

                                <Route path={'/' + Strings.RealTimeDashboard} component={RealTimeDashboard_New} />
                                <Route path={'/' + Strings.ClaimProcessingSummary} component={ClaimProcessingSummary} />
                                <Route path={'/' + Strings._ClaimProcessingSummary} component={ClaimProcessingSummary} />
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

                                <Route path={'/' + Strings.healthCare278} component={HealthCare278} />
                                <Route path={'/' + Strings.serviceDetails278} component={ServiceDetails278} />
                                <Route path={'/' + Strings.encounterLoadException} component={Encounter_Load_Exception} />
                                <Route path={'/' + Strings.Outbound_Encounter_response_999} component={Outbound_Encounter_response_999} />
                                <Route path={'/' + Strings.Inbound_Encounter_response_999} component={Outbound_Encounter_response_999} />
                                <Route path={'/' + Strings.Outbound_Encounter_277CAReponse} component={Outbound_Encounter_277CAReponse} />
                                <Route path={'/' + Strings.Outbound_Encounter_ClaimProcessingSummary} component={Outbound_Encounter_updated_ProcessingSummary} />
                                <Route path={'/' + Strings.Outbound_Encounter_Audit} component={Outbound_Encounter_updated_AuditSummary} />
                                <Route path={'/' + Strings.Outbound_Encounter_ClaimDetails837} component={Outbound_Encounter_updated_Details_837_Grid} />
                                <Route path={'/' + Strings.Outbound_Encounter_RealTimeDashboard} component={Outbound_Encounter_updated_Dashboard_New} />
                                <Route path={'/' + Strings.Inbound_Encounter_ClaimProcessingSummary} component={EncounterProcessingSummary} />
                                <Route path={'/' + Strings.Inbound_EncounterDetails} component={EncounterDetails_837_Grid} />
                                <Route path={'/' + Strings.Inbound_Encounter_Audit} component={EncounterAuditSummary} />
                                <Route path={'/' + Strings.Inbound_EncounterDashboard} component={EncounterDashboard_New} />

                                <Route path={'/' + Strings.EnrollmentDashboard} component={EnrollmentDashboard} />
                                <Route path={'/' + Strings.enrollmentLoadDetails} component={Files_834} />
                                <Route path={'/' + Strings.PremiumPaymentLoad} component={PremiumPaymentLoad} />
                                <Route path={'/' + Strings.PremiumPaymentLoadDetails} component={PremiumPaymentLoadDetails} />
                                <Route path={'/' + Strings.MMRFileLoad} component={MMRFileLoad} />
                                <Route path={'/' + Strings.MMRFileLoadDetails} component={MMRFileLoadDetails} />
                                <Route path={'/' + Strings.PremiumPaymentFileCompare} component={PremiumPaymentFileCompare} />
                                <Route path={'/' + Strings.RateCode820Mismatch} component={RateCode820Mismatch} />
                                <Route path={'/' + Strings.ActiveQnxt820} component={ActiveQnxt820} />
                                <Route path={'/' + Strings.TermQnxt820} component={TermQnxt820} />
                                <Route path={'/' + Strings.OutboundActive} component={OutboundActive} />
                                <Route path={'/' + Strings.OutboundTerm} component={OutboundTerm} />
                                <Route path={'/' + Strings.Outbound_Encounter_BatchDetails837} component={Outbound_Encounter_BatchDetails837} />
                                <Route path={'/' + Strings.Outbound_Encounter_updated_FileDashboard} component={Outbound_Encounter_updated_FileDashboard} />
                                <Route path={'/' + Strings.consent_management} component={ConsentManagement} />
                                <Route path={'/' + Strings.ADT} component={ADT} />
                                <Route path={'/' + Strings.PatientDashboard} component={PatientDashboard} />
                                <Route path={'/' + Strings.patientsList} component={Patients} />
                                <Route path={'/' + Strings.NewPatient} component={NewPatient} />
                                <Route path={'/' + Strings.PatientDetails} component={PatientDetails} />
                                <Route path={'/' + Strings.matchClaims} component={MatchClaims} />
                                <Route path={'/' + Strings.researchQueue} component={ResearchQueue} />
                                <Route path={'/' + Strings.submitClaims} component={SubmitClaim} />
                                <Route path={'/' + Strings.ChangePassword} component={ChangePassword} />
                                <Route path={'/' + Strings.RDE} component={RDE} />
                                <Route path={'/' + Strings.ORU} component={ORU} />
                                <Route path={'/' + Strings.DFT} component={DFT} />
                                <Route path={'/' + Strings.FHiR_API_management} component={FHiR_API_management} />
                                <Route path={'/' + Strings.Enrollment_Outbound} component={Enrollment_Outbound} />
                                <Route path={'/' + Strings.Enrollment_Details_Outbound} component={Enrollment_Details_Outbound} />
                                <Route path={'/' + Strings.Outbound_Encounter_updated_Payment} component={Outbound_Encounter_updated_Payment} />
                            
                                
                            
                                <Route path={'/' + Strings.CrosswalkTable} component={CrosswalkTable} />
                                <Route path={'/' + Strings.Enrollment_FullFileCompare} component={Enrollment_FullFileCompare} />
                                <Route path={'/' + Strings.Enrollment_eligibiltyDetails} component={Enrollment_eligibiltyDetails} />

                                <Route path={'/' + Strings.EthnicityMismatch} component={EthnicityMismatch} />
                                <Route path={'/' + Strings.RateCode} component={RateCode} />
                                <Route path={'/' + Strings.SameGenderTwin} component={SameGenderTwin} />
                                <Route path={'/' + Strings.Duplicate} component={Duplicate} />

                                <Route path={'/' + Strings.AddressMismatch} component={AddressMismatch} />
                                <Route path={'/' + Strings.DobMismatch} component={DobMismatch} />
                                <Route path={'/' + Strings.GenderMismatch} component={GenderMismatch} />
                                <Route path={'/' + Strings.Effective_date_Mismatch} component={Effective_date_Mismatch} />

                                <Route path={'/' + Strings.LoadtoQNXT} component={LoadtoQNXT} />
                                <Route path={'/' + Strings.EnrollmentLoadException} component={EnrollmentLoadException} />
                                <Route path={'/' + Strings.DualCodeMismatch} component={DualCodeMismatch} />

                                <Route path={'/' + Strings.House_Head_Mismatch} component={House_Head_Mismatch} />
                                <Route path={'/' + Strings.CustomService} component={CustomService} />
                                <Route path={'/' + Strings.Enrollment_FullFileCompare_Dashboard} component={Enrollment_FullFileCompare_Dashboard} />
                                <Route path={'/' + Strings.OutboundEnrollmentDashboard} component={ OutboundEnrollmentDashboard } />
                                <Route path={'/' + Strings.OutboundIdGenerated} component={ OutboundIdGenerated } />
                                <Route path={'/' + Strings.Enrollment_Outbound_JobList} component={ Enrollment_Outbound_JobList } />
                                <Route path={'/' + Strings.Prediction} component={ Prediction } />
                                
                                <Route path={'/' + Strings.Sepsis_Dashboard} component={ Sepsis_Dashboard } />
                                <Route path={'/' + Strings.ProviderDirectory} component={ ProviderDirectory } />
                                
                                <Route path={'/' + Strings.Transaction275Dashboard} component={Transaction275Dashboard} />
                                <Route path={'/' + Strings.Transaction_275_Details} component={Transaction_275_Details} />
                                <Route path={'/' + Strings._Transaction_275_Details} component={Transaction_275_Details} />
                                <Route path={'/' + Strings.ConsentManagement} component={ConsentManagement} />
                                <Route path={'/' + Strings.ConsentUserList} component={ConsentUserList} />
                                <Route path={'/' + Strings.PharmacyFormulation} component={PharmacyFormulation } />
                                <Route path={'/' + Strings.Member_History} component={Member_History} />
                                <Route path={'/' + Strings.EncounterCustomerService} component={ EncounterCustomerService } />
                                <Route path={'/' + Strings.Outbound_Complaince_Reporting} component={ Outbound_Complaince_Reporting } />
 {/*  Outbound claims */}
                                <Route path={'/' + Strings.Outbound_Claim_Batch_Details_837} component={Outbound_Claim_Batch_Details_837} />
                                <Route path={'/' + Strings.Outbound_Claim_updated_AuditSummary} component={Outbound_Claim_updated_AuditSummary} />
                                <Route path={'/' + Strings.Outbound_Claim_updated_Dashboard_New} component={Outbound_Claim_updated_Dashboard_New } />
                                <Route path={'/' + Strings.Outbound_Claim_updated_Details_837_Grid} component={Outbound_Claim_updated_Details_837_Grid} />
                                <Route path={'/' + Strings.Outbound_Claim_updated_FileDashboard} component={ Outbound_Claim_updated_FileDashboard } />
                                <Route path={'/' + Strings.Outbound_Claim_updated_Payment} component={ Outbound_Claim_updated_Payment } />
                                <Route path={'/' + Strings.Outbound_Claim_updated_ProcessingSummary} component={ Outbound_Claim_updated_ProcessingSummary } />
                                  <Route path={'/' + Strings.Outbound_Claim_277CAResponse} component={ Outbound_Claim_277CAResponse } />
                                <Route path={'/' + Strings.Inbound_Claim_999_response} component={ Outbound_Claim_999_response } /> 
                                <Route path={'/' + Strings.Outbound_Claim_999_response} component={ Outbound_Claim_999_response } /> 
                                <Route path={'/' + Strings.Outbound_Compliance_Reporting_Claims} component={ Outbound_Compliance_Reporting_Claims } />
                                <Route path={'/' + Strings.ClaimCustomerService} component={ ClaimCustomerService } /> 
                                <Route path={'/' + Strings.Outbound_Claim_Batch_Click_Details} component={Outbound_Claim_Batch_Click_Details} />
                                <Route path={'/' + Strings.InboundClaimPaymentDashboard} component={InboundClaimPaymentDashboard} />
                                
                               
                                {/*  for Sales demo 30545 */}
                                <Route path={'/' + Strings.Outbound_Encounter_StatewiseTradingPartner} component={Outbound_Encounter_StatewiseTradingPartner} />
                                <Route path={'/' + Strings.TransactionSetup_New} component={TransactionSetup_New} />
                                <Route path={'/' + Strings.Encounter_view_CustomEditNew} component={Encounter_view_CustomEditNew} />
                                <Route path={'/' + Strings.companionGuide} component={CompanionGuide} />

                                

                                
                                {/*  for Encounter demo 30561 */}
                                {/* <Route path={'/' + Strings.Outbound_Encounter_StatewiseTradingPartner} component={Outbound_Encounter_StatewiseTradingPartner_Encounter} />
                                <Route path={'/' + Strings.TransactionSetup_New} component={TransactionSetup_Encounter} />
                                <Route path={'/' + Strings.Encounter_view_CustomEditNew} component={Encounter_view_CustomEditNew_Encounter} />
                                <Route path={'/' + Strings.companionGuide} component={CompanionGuide_Encounter} /> */}
                               

                                
                                
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
