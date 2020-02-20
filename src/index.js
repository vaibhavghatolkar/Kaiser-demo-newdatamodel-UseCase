import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App';
import  { Redirect } from 'react-router-dom'
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
import { EnrollmentInbound } from './app/containers/Claims/EnrollmentInbound';
import { AssignedDetails } from './app/containers/Claims/AssignedDetails';
import { EditConfiguration } from './app/containers/EditConfigurations';
import { ViewEdit } from './app/containers/ViewEdit';
import { FullFileCompare } from './app/containers/FullFileCompare';
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
import { EnrollmentErrors } from './app/containers/Enrollment_errors';
import { Outbound_dashboard } from './app/containers/Outbound_dashboard';
import { Eligibility_Reconcile_Search } from './app/containers/Eligibility_Reconcile_Search';
import { Eligibility_Errors } from './app/containers/Eligibility_Errors';
import {CustomDBDetails} from './app/containers/CustomDB_Details'
import { EligibilityErrorsDelta } from './app/containers/Eligibility_error_delta';
import { HistoryEligibilityErrorsDelta } from './app/containers/History_eligibility_error'
import {RateCodeDelta} from './app/containers/RateCode_delta'
import {PlanIntegrationEligibilityErrors} from './app/containers/PlanIntegration_eligibility_errors'
import {HistoryRateCodeDelta} from './app/containers/History_Ratecode_Delta'
import {MedicalMonthly_Metrics} from './app/containers/MedicalMonthly_Metrics'
import { EnrollmentDetails } from './app/containers/Enrollment_details';
import {EligibilityErrorsDuplicate} from './app/containers/Duplicate_Eligibility_Error'
import {OutboundDetails} from './app/containers/Outbound_details'
import {FullComparsion_dashboard} from './app/containers/Full_file_comparison_dashboard'
import {ClaimDetails837} from './app/containers/RealTime_837_Claim/Claim_Details_837'
import {RealTimeDashboard} from './app/containers/RealTime_837_Claim/RealTimeDashboard'
import {ClaimProcessingSummary} from './app/containers/RealTime_837_Claim/RealTime_ClaimProcessingSummary'
import { Files_837 } from './app/containers/Files_837'
import { MenuManagement } from './app/containers/Menu_Management'
import { DynamicSidebar } from './app/components/DynamicSidebar';
import { ClaimPaymentDashboard } from './app/containers/ClaimPayment_835/ClaimsPaymentDashboard';
const $ = window.$;
{/* <Files_837 flag={this.state.errorflag} selectedTradingPartner='' startDate="" endDate=""/> */}
class PrivateRoute extends React.Component {
    constructor(props) {
        super(props);
        const token = localStorage.getItem("token");
        let loggedIn;

        if(token == null){
            loggedIn = false;
        }else{
            loggedIn = true
        }

        this.state = {

            loggedIn,
            timeout:900000,
            //  timeOut: 10000,
            isTimedOut: false
            // timeOut,
        };
        
        this.handleFlag = this.handleFlag.bind(this)
        this.idleTimer = null
        this.onAction = this.onAction.bind(this)
        this.onActive = this.onActive.bind(this)
        this.onIdle = this.onIdle.bind(this)
      
    }

    // componentDidMount(){
    //     setTimeout(() => {
    //         localStorage.clear()
    //         this.setState({timeOut:true});
    //       },600000000);
      
    // }

    handleFlag(loggedIn) {
        this.setState({

            loggedIn:  loggedIn
        })

    }

    onAction(e) {
        // console.log('user did something', e)
        this.setState({isTimedOut: false})
      }
     
      onActive(e) {
        // console.log('user is active', e)
        this.setState({isTimedOut: false})
      }
     
      onIdle(e) {
        // console.log('user is idle', e)
        const isTimedOut = this.state.isTimedOut

        if (isTimedOut) {
            localStorage.clear()
            window.location.reload()
        } else {
          this.setState({showModal: true})
          this.idleTimer.reset();
          this.setState({isTimedOut: true})
        }
    }

    render() {
        let data =[]
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
            // onAction={this.onAction}
            debounce={250}
            timeout={this.state.timeout} />
       
        { this.state.loggedIn=== false ?
                       <div> <Route exact path="/" render={(props) => <Login handleFlag={this.handleFlag} {...props} />}/> 
                       <Route render={() => <Redirect to={{pathname: "/"}} />} />
                       </div>:
                       <div className="container-fluid background">
                       <Header/> <br /><br /><br /><br />
                <div className="row">
                <div className="col-2 nopadding white-background">
                    <DynamicSidebar
                        handleFlag={this.handleFlag}
                        />
                </div>
                <div className="col-10 container-fluid" style={{ minHeight: '100vh'}}>
                    <Route exact path="/">
                    {this.state.loggedIn == true ? 
                    
                    <Redirect to={{
                        pathname: '/'+ Strings.RealTime270, state: { data } }} />:  <Redirect to="/" />}
                    </Route> 
                    {/* <Route exact path="/" component={RealTime276} /> */}
                    <Route path={'/' + Strings.claimsDashboard} component={Claims} />
                    <Route path={'/'+ Strings.tradingPartnerConfiguration} component={TradingPartnerConfiguration} />
                    <Route path={'/'+ Strings.submitClaims} component={SubmitClaim} />
                    {/* <Route path={'/'+ Strings.RealTime276 + '/:apiflag'} component={RealTime276}/>
                    <Route path={'/'+ Strings.RealTime270  + '/:apiflag'} component={RealTime276} /> */}

                    <Route path={'/'+ Strings.RealTime276 } component={RealTime276}/>
                    <Route path={'/'+ Strings.RealTime270} component={RealTime276} />
                    <Route path={'/'+ Strings.AuditSummary270} component={AuditSummary270} />                  
                    <Route path={'/'+ Strings.claimsAudit} component={AuditSummary} />
                    <Route path={'/'+ Strings.claimsError} component={ClaimsError} />
                    <Route path={'/'+ Strings.matchClaims} component={MatchClaims} />
                    <Route path={'/'+ Strings.researchQueue} component={ResearchQueue} />
                    <Route path={'/'+ Strings.claimsDashboard_834} component={EnrollmentInbound} />
                    <Route path={'/'+ Strings.editConfiguration} component={EditConfiguration} />
                    <Route path={'/'+ Strings.viewEdit} component={ViewEdit} />
                    <Route path={'/'+ Strings.fullFile834} component={FullFileCompare} />
                    <Route path={'/'+ Strings.transactionSetup} component={TransactionSetup} />
                    <Route path={'/'+ Strings.companionGuide} component={CompanionGuide} />
                    <Route path={'/'+ Strings.covered} component={CoveredICDCode} />
                    <Route path={'/'+ Strings.noncovered} component={NonCovered} />
                    <Route path={'/'+ Strings.validation} component={Claims} />
                    <Route path={'/'+ Strings.ViewCustomEdits} component={ViewCustomEdits} />
                    <Route path={'/'+ Strings.files_834 + '/:flag'} component={Files_834} />
                    {/* <Route path={'/'+ Strings.ElilgibilityDetails270 + '/:apiflag/:State/:selectedTradingPartner/:startDate/:endDate/:transactionId/:status/:count'} component={EligibilityDetails} />
                    <Route path={'/'+ Strings.elilgibilityErrors270 + '/:apiflag/:State/:selectedTradingPartner/:startDate/:endDate/:transactionId/:status/:count'} component={EligibilityDetails} />
                    <Route path={'/'+ Strings.ElilgibilityDetails276 + '/:apiflag/:State/:selectedTradingPartner/:startDate/:endDate/:transactionId/:status/:count'} component={EligibilityDetails} />
                    <Route path={'/'+ Strings.elilgibilityErrors276 + '/:apiflag/:State/:selectedTradingPartner/:startDate/:endDate/:transactionId/:status/:count'} component={EligibilityDetails} /> */}
                    <Route path={'/'+ Strings.ElilgibilityDetails270 } component={EligibilityDetails} />
                    <Route path={'/'+ Strings.elilgibilityErrors270  }component={EligibilityDetails} />
                    <Route path={'/'+ Strings.ElilgibilityDetails276 } component={EligibilityDetails} />
                    <Route path={'/'+ Strings.elilgibilityErrors276 } component={EligibilityDetails} />
                  
                    <Route path={'/'+ Strings.UserList} component={UserList} />
                    <Route path={'/'+ Strings.MenuCreate} component={MenuCreate} />
                    <Route path={'/'+ Strings.ChangePassword} component={ChangePassword} />
                    <Route path={'/'+ Strings.claimsDashboard_834_details + '/:new_path'} component={Files_834}/>
                    <Route path={'/'+ Strings.EnrollmentError  + '/:new_path'} component={Files_834} />
                    <Route path={'/'+ Strings.EnrollmentErrors} component={EnrollmentErrors} />

                    <Route path={'/'+ Strings.EnrollmentDetails} component={EnrollmentDetails} />
                    <Route path={'/'+ Strings.Outbound_dashboard} component={Outbound_dashboard} />
                    <Route path={'/'+ Strings.Eligibility_Reconcile_Search} component={Eligibility_Reconcile_Search} />
                    <Route path={'/'+ Strings.Eligibility_Errors} component={Eligibility_Errors} />
                    <Route path={'/'+ Strings.EligibilityErrorsDelta} component={EligibilityErrorsDelta} />
                    <Route path={'/'+ Strings.HistoryEligibilityErrorsDelta} component={HistoryEligibilityErrorsDelta} />
                    <Route path={'/'+ Strings.RateCodeDelta} component={RateCodeDelta} />
                    <Route path={'/'+ Strings.PlanIntegrationEligibilityErrors} component={PlanIntegrationEligibilityErrors} />
                    <Route path={'/'+ Strings.HistoryRateCodeDelta} component={HistoryRateCodeDelta} />
                    <Route path={'/'+ Strings.MedicalMonthly_Metrics} component={MedicalMonthly_Metrics} />

                    <Route path={'/'+ Strings.CustomDBDetails} component={CustomDBDetails} />
                    <Route path={'/'+ Strings.EligibilityErrorsDuplicate} component={EligibilityErrorsDuplicate} />
                    <Route path={'/'+ Strings.OutboundDetails} component={OutboundDetails} />
                    <Route path={'/'+ Strings.FullComparsion_dashboard} component={FullComparsion_dashboard} />
                    {/* <Route path={'/'+ Strings.ClaimDetails837 + '/:flag/:selectedTradingPartner/:startDate/:endDate'} component={ClaimDetails837} /> */}
                    <Route path={'/'+ Strings.ClaimDetails837} component={ClaimDetails837} />
                    <Route path={'/'+ Strings.RealTimeDashboard} component={RealTimeDashboard} />
                    <Route path={'/'+ Strings.ClaimProcessingSummary} component={ClaimProcessingSummary} />
                    <Route path={'/'+ Strings.Files_837} component={Files_837} />
                    <Route path={'/'+ Strings.MenuManagement} component={MenuManagement} />
                    
                    <Route path={'/'+ Strings.claimPayment_835} component={ClaimPaymentDashboard} />
                       
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
// ReactDOM.render(<App />, document.getElementById('app'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
