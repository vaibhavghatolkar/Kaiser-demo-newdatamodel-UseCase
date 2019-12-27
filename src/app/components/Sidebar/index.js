import React from 'react'
import './styles.css'
import Strings from '../../../helpers/Strings';
import { Link } from 'react-router-dom'


export class Sidebar extends React.Component{
    
    constructor(props){
        super(props);
        this.state={
            claimsArray : [
                {value: 'Claims Dashboard - 837', key: 'claimsDashboard'},
                {value: 'Claims Audit Summary', key: 'claimsAudit'},
                {value: 'Claim Details', key: 'claimDetails'},
                {value: 'Claims Error', key: 'claimsError'},
                {value: 'Match Claims', key: 'matchClaims'},
                {value: 'Submit Claims', key: 'submitClaims'},
                {value: 'Research Queue', key: 'researchQueue'}
            ],
            enrollmentArray: [
                {value: '834 Enrollment Dashboard', key: 'claimsDashboard_834'},
                {value: 'Enrollment Details', key: 'claimsDashboard_834_details'},
                {value: 'Enrollment Error', key: 'Enrollment_Error'},
              
            ],
            pageArray : [
                {value: 'Page 1'},
                {value: 'Page 2'},
                {value: 'Page 3'},
            ],
            transactionArray: [
                {value: 'Validation', key : 'validation'},
            ],
            tradingPartner: [
                {value: 'Trading Partner', key: 'tradingPartnerConfiguration'},
                {value: 'Transaction Setup', key: 'transactionSetup'},
                {value: 'Configure Custom Edit', key: 'editConfiguration'},
                {value: 'View Custom Edits', key: 'ViewCustomEdits'},
                {value: 'Covered', key: 'covered'},
                {value: 'Non Covered', key: 'noncovered'},
                {value: 'TP Agreements'},
                {value: 'Companion Guide', key: 'companionGuide'},
                {value: 'Manage Rule Set'},
            ],
            RealTime270: [
                {value: 'Real Time Dashboard', key: 'realTime_270'},
                // {value: 'Audit Summary - 270', key: 'AuditSummary270'},
                {value: 'Elilgibility Details', key: 'elilgibilityDetails270'},
                // {value: 'Elilgibility Errors', key: 'elilgibilityErrors270'},
                
            ],
            RealTime276: [
                {value: 'Real Time Dashboard', key: 'realTime_276'},
                {value: 'Claim Status Details', key: 'elilgibilityDetails276'},
                // {value: 'Claim Status Errors', key: 'elilgibilityErrors276'},
                
            ],
            UserManagement: [
                {value: 'HiPaaS User List', key: 'UserList'},
                {value: 'User Role Management', key: 'MenuCreate'},
                {value: 'Change Password', key: 'ChangePassword'},
              
             // {value: 'Claim Status Errors', key: 'elilgibilityErrors276'},
                
            ],
            fullfile: [
                {value: '834 Full File Compare', key: 'fullFile834'},
            ]
        }

        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(key){
        console.log('this is the key : ' + key)
        this.props.handleFlag(key)
    }

    renderItems(key, value, array){
        let row = []
        array.forEach(element => {
            let addon = ''
            if(element.key == Strings.RealTime276){
                addon = '/0' 
            } else if(element.key == Strings.RealTime270){
                addon = '/1' 
            } else if(element.key == Strings.ElilgibilityDetails270 || element.key == Strings.elilgibilityErrors270){
                let key = 'n'
                if(element.key == Strings.elilgibilityErrors270){
                    key = 'Fail'
                }
                addon = '/1/n/n/n/n/n/'+key+'/n'
            } else if(element.key == Strings.ElilgibilityDetails276 || element.key == Strings.elilgibilityErrors276){
                let key = 'n'
                if(element.key == Strings.elilgibilityErrors276){
                    key = 'Fail'
                }
                addon = '/0/n/n/n/n/n/'+key+'/n'
            } else if(element.key == Strings.claimDetails){
                addon = '/n/n/n/n'
            }
           else if(element.key == Strings.claimsDashboard_834_details)
           {
            addon = '/total' 
           }
           else if(element.key == Strings.EnrollmentError)
           {
            addon = '/error' 
           }
            else {
                addon = ''
           
           
           
            }
            

            row.push(
                <li>
                    {
                        // <a href="#" onClick={() => {this.handleClick(1)}}>{element.value}</a>
                        <Link to={'/' + element.key + addon}>{element.value}</Link>
                    }
                </li>
            )
        });
        return(
            <li className="active padding">
                <a href={'#' + key} data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">{value}</a>
                <ul className="collapse list-unstyled" id={key}>
                    {row}
                </ul>
            </li>
        )
    }

    renderSidebarItems(){
        return(
            <div>
               
                {this.renderItems(Strings.REALTIME270, 'Eligibility Real-time', this.state.RealTime270)}
                {this.renderItems(Strings.REALTIME276, 'Claim Status Real-time', this.state.RealTime276)}
                {this.renderItems(Strings.UserManagement, 'User Management', this.state.UserManagement)}
                {this.renderItems(Strings.CLAIMS, 'Claims Management', this.state.claimsArray)}
                {/* {this.renderItems(Strings.EDIT_CLAIM, 'Edit / Resubmit Claim', this.state.pageArray)} */}
                {/* ** {this.renderItems(Strings.TRAN_MANAGMENT, 'Transaction Management', this.state.transactionArray)} */}
                {/* {this.renderItems(Strings.FULL_FILE, 'Full File Compare', this.state.fullfile)} */}
                {/* ** {this.renderItems(Strings.TRAD_MANAGEMENT, 'Admin', this.state.tradingPartner)} */}
                {/* {this.renderItems(Strings.ENR_MANAGEMENT, 'Enrollment Management', this.state.enrollmentArray)} */}
                {/* {this.renderItems(Strings.PROC_MANAGEMENT, 'Process Management', this.state.pageArray)} */}
                {/* {this.renderItems(Strings.REP_MANAGEMENT, 'Report Generation', this.state.pageArray)} */}
                {/* {this.renderItems(Strings.ACK_MANAGEMENT, 'Acknowledgment Generation', this.state.pageArray)} */}
            </div>
        )
    }

    renderTabs(){
        return(
            <div id="tabs">
                <div className="row p">
                    <div className="col-6 p nopadding">
                        <p className="p smaller-font">Inbound</p>
                        <hr className="underline p"/>
                    </div>

                    <div className="col-6 p nopadding">
                        <p className="p smaller-font">Outbound</p>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <nav id="sidebar">
                <ul className="list-unstyled components">
                    {/* {this.renderTabs()} */}
                    {this.renderSidebarItems()}
                </ul>
            </nav>
        );
    }
}