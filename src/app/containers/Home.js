import React from 'react'
import { Sidebar } from '../components/Sidebar';
import {Claims} from './Claims/Dashboard';
import {RealTime} from './Eligibility/RealTime';
import '../components/Sidebar/styles.css'
import Strings from '../../helpers/Strings'
import { TradingPartnerConfiguration } from './TradingPartnerConfiguration';
import { SubmitClaim } from './SubmitClaim';
import { Files } from './Files';
import { AuditSummary } from './Claims/AuditSummary';
import { ClaimsError } from './Claims/ClaimsError';
import { MatchClaims } from './Claims/MatchClaims';
import { ResearchQueue } from './ResearchQueue';
import { EnrollmentInbound } from './Claims/EnrollmentInbound';
import { AssignedDetails } from './Claims/AssignedDetails';
import { EditConfiguration } from './EditConfigurations';
import { ViewEdit } from './ViewEdit';
import { FullFileCompare } from './FullFileCompare';
import { Files_837 } from './Files_837';
import { CoveredICDCode } from './Covered';
import { NonCovered } from './NonCovered'
import { TransactionSetup } from './TransactionSetup'
import { CompanionGuide } from './CompanionGuide';
import { RealTime276 } from './Claim_276_RealTime/Real_Time_276'
import { EligibilityDetails } from './EligibilityDetails';
import { AuditSummary270 } from './AuditSummary270';
import { ViewCustomEdits } from './View_customEdit'

const $ = window.$;

export class Home extends React.Component{
    constructor(props){
        super(props);
        this.state={
            flag: Strings.CLAIMS,
            errorflag: 'Total Files'
        }
    
        this.handleFlag = this.handleFlag.bind(this)
    }

    handleFlag(key, errorflag){
        console.log('handle : '+ key)
        this.setState({
            flag : key,
            errorflag: errorflag ? 'Rejected Claims' : 'Total Files'
        })

        setTimeout(() => {
            this.setState({
                flag : key 
            })
        }, 50);
    }

    render() {
        return (
            <div className="container-fluid background">
                <div className="row">
                    <div className="col-2 nopadding white-background">
                        <Sidebar
                            handleFlag={this.handleFlag}
                        />
                    </div>
                    <div className="col-10" style={{height : $(window).height(), backgroundColor : '#F4F5F4' }}>
                        {/* {
                            this.state.flag == Strings.tradingPartnerConfiguration ? <TradingPartnerConfiguration/> : 
                            this.state.flag == Strings.submitClaims ? <SubmitClaim/> :
                            this.state.flag == Strings.RealTime276 ? <RealTime276 /> :
                            this.state.flag == Strings.RealTime270 ? <RealTime276 apiflag={1} /> :
                            this.state.flag == Strings.AuditSummary270 ? <AuditSummary270 handleFlag={this.handleFlag}/> :
                            this.state.flag == Strings.claimDetails ? <Files_837 flag={this.state.errorflag} selectedTradingPartner='' startDate="" endDate=""/> :
                            this.state.flag == Strings.claimsAudit ? <AuditSummary handleFlag={this.handleFlag}/> :
                            this.state.flag == Strings.claimsError ? <ClaimsError handleFlag={this.handleFlag}/> :
                            this.state.flag == Strings.matchClaims ? <MatchClaims/> :
                            this.state.flag == Strings.researchQueue ? <ResearchQueue/> :
                            this.state.flag == Strings.claimsDashboard_834 ? <EnrollmentInbound /> :
                            this.state.flag == Strings.editConfiguration ? <EditConfiguration /> :
                            this.state.flag == Strings.viewEdit ? <ViewEdit /> :
                            this.state.flag == Strings.fullFile834 ? <FullFileCompare/> :
                            this.state.flag == Strings.transactionSetup ? <TransactionSetup /> :
                            this.state.flag == Strings.companionGuide ? <CompanionGuide /> :
                            this.state.flag == Strings.covered ? <CoveredICDCode /> :
                            this.state.flag == Strings.noncovered ? <NonCovered /> :
                            this.state.flag == Strings.ElilgibilityDetails270 ? <EligibilityDetails apiflag={1}/> :
                            this.state.flag == Strings.ElilgibilityDetails276 ? <EligibilityDetails /> :
                            this.state.flag == Strings.ViewCustomEdits ? <ViewCustomEdits /> :
                            <Claims
                                apiflag={this.state.flag == Strings.claimsDashboard_835 ? 1 : 0}
                            />
                            
                            
                        } */}
                    </div>
                </div>
            </div>
        );
    }
}