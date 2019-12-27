import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App';
import  { Redirect } from 'react-router-dom'
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import { Claims } from './app/containers/Claims/Dashboard';
import { TradingPartnerConfiguration } from './app/containers/TradingPartnerConfiguration';
import { SubmitClaim } from './app/containers/SubmitClaim';
import { RealTime276 } from './app/containers/Claim_276_RealTime/Real_Time_276';
import { AuditSummary270 } from './app/containers/AuditSummary270';
import { Files_837 } from './app/containers/Files_837';


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

const $ = window.$;
{/* <Files_837 flag={this.state.errorflag} selectedTradingPartner='' startDate="" endDate=""/> */}
class PrivateRoute extends React.Component {
    constructor(props) {
        super(props);
        const token = localStorage.getItem("token");
        let loggedIn;

        if(token == null){
            loggedIn = false;
        }

        this.state = {

            loggedIn
        };
        
        this.handleFlag = this.handleFlag.bind(this)
      
    }

    handleFlag(loggedIn) {
        this.setState({

            loggedIn:  loggedIn
        })

    }


    render() {
        return (
    <Router>
        <Header/>
        <div className="container-fluid background">
        { this.state.loggedIn=== false ?
                        <Route exact path="/" render={(props) => <Login handleFlag={this.handleFlag} {...props} />}/> :
            <div className="row">
                <div className="col-2 nopadding white-background">
                    <Sidebar 
                    handleFlag={this.handleFlag}
                    />
                </div>
                <div className="col-10 container-fluid" style={{height : $(window).height()}}>
                    <Route exact path="/">
                    {this.state.loggedIn === true ? <Redirect to="/realTime_270/1" />:  <Redirect to="/" />}>
                    </Route> 
                    {/* <Route exact path="/" component={RealTime276} /> */}
                    <Route path={'/' + Strings.claimsDashboard} component={Claims} />
                    <Route path={'/'+ Strings.tradingPartnerConfiguration} component={TradingPartnerConfiguration} />
                    <Route path={'/'+ Strings.submitClaims} component={SubmitClaim} />
                    <Route path={'/'+ Strings.RealTime276 + '/:apiflag'} component={RealTime276}/>
                    <Route path={'/'+ Strings.RealTime270  + '/:apiflag'} component={RealTime276} />
                    <Route path={'/'+ Strings.AuditSummary270} component={AuditSummary270} />
                    <Route path={'/'+ Strings.claimDetails + '/:flag/:selectedTradingPartner/:startDate/:endDate'} component={Files_837} />
                    
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
                    <Route path={'/'+ Strings.ElilgibilityDetails270 + '/:apiflag/:State/:selectedTradingPartner/:startDate/:endDate/:transactionId/:status/:count'} component={EligibilityDetails} />
                    <Route path={'/'+ Strings.elilgibilityErrors270 + '/:apiflag/:State/:selectedTradingPartner/:startDate/:endDate/:transactionId/:status/:count'} component={EligibilityDetails} />
                    <Route path={'/'+ Strings.ElilgibilityDetails276 + '/:apiflag/:State/:selectedTradingPartner/:startDate/:endDate/:transactionId/:status/:count'} component={EligibilityDetails} />
                    <Route path={'/'+ Strings.elilgibilityErrors276 + '/:apiflag/:State/:selectedTradingPartner/:startDate/:endDate/:transactionId/:status/:count'} component={EligibilityDetails} />
                    <Route path={'/'+ Strings.UserList} component={UserList} />
                    <Route path={'/'+ Strings.MenuCreate} component={MenuCreate} />
                    <Route path={'/'+ Strings.ChangePassword} component={ChangePassword} />
                    
                    
                </div>
            </div>
    }
        </div>
    </Router>
)
}
}

ReactDOM.render(<PrivateRoute />, document.getElementById('app'));
// ReactDOM.render(<App />, document.getElementById('app'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
