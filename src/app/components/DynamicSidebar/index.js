import React from 'react'
import '../Sidebar/styles.css'
import Strings from '../../../helpers/Strings';
import { Link } from 'react-router-dom'
import Urls from '../../../helpers/Urls';

let isOutbound = JSON.parse(sessionStorage.getItem('isOutbound'))
export class DynamicSidebar extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            menuList: [],
            menuOptions: {}
        }
    }

    componentDidMount() {
        this.getData()
    }

    getData() {
        let menuType = "I"
        try {
            if (isOutbound) {
                menuType = "O"
            }
        } catch (error) {

        }

        let role_id = JSON.parse(localStorage.getItem('role_id'))
        let query = `{
            UserwiseMenu(role_id:`+ role_id + ` menutype:"` + menuType + `" For:"S"){
              role_id
              menu_id
              menu_description
              sequence_id
              parent_node
              menuflag
              usermenuflag
              is_editor
              is_editable
              menutype
            }
        }`

        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }

        fetch(Urls.users, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(
                res => {
                    if (res.data) {
                        this.setState({
                            menuList: res.data.UserwiseMenu

                        }, () => {
                            this.sortData()
                        })
                    }
                })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    getkeys(index) {
        let name = ''
        if (index == 2) { name = Strings.EnrollmentDashboard }
        else if (index == 3) { name = Strings.enrollmentLoadDetails }
        else if (index == 4) { name = Strings.EnrollmentError }

        else if (index == 6) { name = Strings.FullComparsion_dashboard }
        else if (index == 7) { name = Strings.EnrollmentDetails }
        else if (index == 8) { name = Strings.EnrollmentErrors }
        else if (index == 9) { name = Strings.HistoryEligibilityErrorsDelta }
        else if (index == 10) { name = Strings.CustomDBDetails }
        else if (index == 11) { name = Strings.EligibilityErrorsDuplicate }
        else if (index == 12) { name = Strings.OutboundDetails }
        else if (index == 13) { name = Strings.RateCodeDelta }
        else if (index == 14) { name = Strings.Eligibility_Errors }
        else if (index == 15) { name = Strings.HistoryEligibilityErrorsDelta }
        else if (index == 16) { name = Strings.PlanIntegrationEligibilityErrors }
        else if (index == 17) { name = '' }
        else if (index == 18) { name = Strings.MedicalMonthly_Metrics }
        else if (index == 19) { name = Strings.Eligibility_Reconcile_Search }
        else if (index == 20) { name = Strings.Outbound_dashboard }

        else if (index == 22) { name = Strings.RealTime270 }
        else if (index == 23) { name = Strings._ElilgibilityDetails270 }
        else if (index == 24) { name = Strings.AuditSummary270 }

        else if (index == 26) { name = Strings.RealTime276 }
        else if (index == 27) { name = Strings._ElilgibilityDetails276 }

        else if (index == 29) { name = Strings.RealTimeDashboard }
        else if (index == 30) { name = Strings.claimsAudit }
        else if (index == 31) { name = Strings._Claim_Details_837_Grid }
        // else if (index == 31) { name = Strings._Load_Exception }

        // else if (index == 31) { name = Strings.ClaimDetails837 }
        else if (index == 32) { name = Strings.claimsError }
        else if (index == 33 || index == 98) { name = Strings.researchQueue }
        else if (index == 34) { name = Strings.matchClaims }
        else if (index == 99) { name = Strings.outbound_matchClaims }
        else if (index == 35 || index == 100) { name = Strings.submitClaims }

        else if (index == 37) { name = Strings.tradingPartnerConfiguration }
        else if (index == 38) { name = Strings.transactionSetup }
        else if (index == 39) { name = Strings.editConfiguration }
        else if (index == 40) { name = Strings.View_CustomEditsNew }
        else if (index == 41) { name = Strings.covered }
        else if (index == 42) { name = Strings.noncovered }
        else if (index == 43) { name = Strings.companionGuide }

        else if (index == 45) { name = Strings.UserList }
        else if (index == 46) { name = Strings.MenuCreate }
        else if (index == 47) { name = Strings.ChangePassword }
        else if (index == 48) { name = Strings.MenuManagement }
        // else if (index == 53) { name = Strings.EncounterDashboard }
        // else if (index == 54) { name = Strings.EncounterDetails }

        else if (index == 65) { name = Strings.Inbound_EncounterDashboard }
        else if (index == 66) { name = Strings.Inbound_EncounterDetails }

        else if (index == 50) { name = Strings.claimPayment_835 }
        else if (index == 51) { name = Strings._claimPayment_835_details }

        else if (index == 120) { name = Strings.tradingPartnerDetails }
        else if (index == 116) { name = Strings.healthCare278 }
        else if (index == 117) { name = Strings.serviceDetails278 }
        else if (index == 122) { name = Strings._ClaimProcessingSummary }
        else if (index == 124) { name = Strings._Inbound_response_999 }
        else if (index == 129) { name = Strings.Inbound_Encounter_ClaimProcessingSummary }
        else if (index == 123) { name = Strings.Outbound_ClaimProcessingSummary }
        else if (index == 94) { name = Strings.Outbound_RealTimeDashboard }
        else if (index == 96) { name = Strings.Outbound_ClaimDetails837 }
        else if (index == 126) { name = Strings._277CAResponse }
        else if (index == 97) { name = Strings.Outbound_ClaimsError }
        else if (index == 128) { name = Strings.Inbound_Encounter_Audit }
        else if (index == 95) { name = Strings.Outbound_AuditSummary }
        else if (index == 125) { name = Strings._Outbound_response_999 }
        else if (index == 130) { name = Strings.Outbound_Encounter_Audit }
        else if (index == 131) { name = Strings.Outbound_Encounter_ClaimProcessingSummary }
        else if (index == 127) { name = Strings._Outbound_277CAResponse }
        else if (index == 109) { name = Strings.Outbound_TradingPartnerConfiguration }
        else if (index == 110) { name = Strings.Outbound_TransactionSetup }
        else if (index == 111) { name = Strings.Outbound_EditConfigurations }
        else if (index == 112) { name = Strings.Outbound_View_customEditNew }
        else if (index == 113) { name = Strings.Outbound_Covered }
        else if (index == 114) { name = Strings.Outbound_NonCovered }
        else if (index == 115) { name = Strings.Outbound_CompanionGuide }
        else if (index == 121) { name = Strings.Outbound_StatewiseTradingPartner }
        else if (index == 54) { name = Strings.Outbound_Encounter_ClaimDetails837 }
        else if (index == 133) { name = Strings.NPILook_Up }
        else if (index == 134) { name = Strings.Outbound_NPILook_Up }
        else if (index == 135) { name = Strings.Outbound_BatchDetails837 }
        else if (index == 136) { name = Strings.Outbound_Encounter_BatchDetails837 }
        // else if(index ==137){name = Strings.Payment_details}
        else if (index == 138) { name = Strings._Outbound_response_999 }
        else if (index == 139) { name = Strings._Outbound_277CAResponse }
        else if (index == 140) { name = Strings._Load_Exception }
        else if (index == 141) { name = Strings.AuditSummary835 }
        else if (index == 142) { name = Strings._ClaimPayment_835_ProcessingSummary }
        else if (index == 143) { name = Strings._Inbound_response_999 }
        else if (index == 152) { name = Strings.ADT }
        else if (index == 157) { name = Strings.PatientDashboard }
        else if (index == 158) { name = Strings.patientsList }
        else if (index == 159) { name = Strings.NewPatient }
        else if (index == 153) { name = Strings.encounterLoadException }
        else if (index == 154) { name = Strings.Outbound_Encounter_response_999 }
        else if (index == 155) { name = Strings.Outbound_Encounter_277CAReponse }
        else if (index == 144) { name = Strings.PremiumPaymentLoad }
        else if (index == 145) { name = Strings.PremiumPaymentLoadDetails }
        else if (index == 146) { name = Strings.MMRFileLoad }
        else if (index == 147) { name = Strings.MMRFileLoadDetails }
        else if (index == 148) { name = Strings.PremiumPaymentFileCompare }
        else if (index == 149) { name = Strings.RateCode820Mismatch }
        else if (index == 150) { name = Strings.ActiveQnxt820 }
        else if (index == 151) { name = Strings.TermQnxt820 }
        else if (index == 136) { name = Strings.Outbound_Encounter_BatchDetails837 }
        else if (index == 160) { name = Strings.Outbound_Encounter_RealTimeDashboard }
        else if (index == 53) { name = Strings.Outbound_Encounter_updated_FileDashboard }
        else if (index == 166) { name = Strings.ORU }
        else if (index == 167) { name = Strings.RDE }
        else if (index == 168) { name = Strings.DFT }
        else if (index == 169) { name = Strings.consent_management }
        else if (index == 172) { name = Strings.FHiR_API_management }

        else if (index == 173) { name = Strings.Enrollment_FullFileCompare }
        else if (index == 174) { name = Strings.Enrollment_eligibiltyDetails }
        else if (index == 175) { name = Strings.EthnicityMismatch }
        else if (index == 176) { name = Strings.RateCode }
        else if (index == 177) { name = Strings.AddressMismatch }
        else if (index == 178) { name = Strings.DobMismatch }
        else if (index == 179) { name = Strings.GenderMismatch }
        else if (index == 180) { name = Strings.SameGenderTwin }
        else if (index == 181) { name = Strings.Duplicate }
        else if (index == 182) { name = Strings.LoadtoQNXT }
        else if (index == 183) { name = Strings.EnrollmentLoadException }
        else if (index == 184) { name = Strings.DualCodeMismatch }
        else if (index == 185) { name = Strings.Effective_date_Mismatch }
        else if (index == 188) { name = Strings.CustomService }
        return name
    }

    sortData() {
        let data = this.state.menuList
        let menuOptions = {}
        data.forEach(item => {
            if (item.parent_node == 0) {
                menuOptions['Sb' + item.menu_id] = {
                    'name': '',
                    'array': []
                }
                menuOptions['Sb' + item.menu_id].name = item.menu_description
            } else {
                item['key'] = this.getkeys(item.menu_id)
                menuOptions['Sb' + item.parent_node].array.push(item)
            }
        })

        this.setState({
            menuOptions: menuOptions
        })
    }

    renderItems(key, value, array) {
        let row = []
        let data = []
        array.forEach(element => {
            let addon = ''
            if (element.key == Strings.RealTime276) {
                data = [
                    { apiflag: '0' },
                ]
            } else if (element.key == Strings.RealTime270) {
                data = [
                    { apiflag: '1' },
                ]
            } else if (element.key == Strings._ElilgibilityDetails270 || element.key == Strings.elilgibilityErrors270) {
                let index_val = 'n'
                if (element.key == Strings.elilgibilityErrors270) {
                    index_val = 'Fail'
                }
                data = [
                    { apiflag: '1', State: 'n', selectedTradingPartner: 'n', startDate: 'n', endDate: 'n', transactionId: 'n', status: index_val, count: 'n' },
                ]
            } else if (element.key == Strings._ElilgibilityDetails276 || element.key == Strings.elilgibilityErrors276 || element.key == Strings._277CAResponse) {
                let index_val = 'n'
                if (element.key == Strings.elilgibilityErrors276) {
                    index_val = 'Fail'
                }
                data = [
                    { apiflag: '0', State: 'n', selectedTradingPartner: 'n', startDate: 'n', endDate: 'n', transactionId: 'n', status: index_val, count: 'n' },
                ]

            } else if (element.key == Strings.ClaimDetails837 || element.key == Strings._Claim_Details_837_Grid || element.key == Strings.Inbound_EncounterDetails || element.key == Strings._Load_Exception || element.key == Strings.ClaimPayment_835_Exception) {
                data = [
                    { apiflag: '0', State: 'n', selectedTradingPartner: 'n', startDate: 'n', endDate: 'n', transactionId: 'n', status: 'n', count: 'n', gridflag: '', subtitle: '' },
                ]
            } else if (element.key == Strings.Files_837) {
                data = [
                    { flag: 'n', selectedTradingPartner: 'n', startDate: 'n', endDate: 'n' },
                ]

            } else if (element.key == Strings.claimsDashboard_834_details) {
                data = [
                    { Total: 'total' },
                ]

            } else if (element.key == Strings.EnrollmentError) {
                data = [
                    { Total: 'error' },
                ]
            }
            else if (element.key == Strings.EncounterDetails) {
                data = [
                    { apiflag: '0', State: 'n', selectedTradingPartner: 'n', startDate: 'n', endDate: 'n', transactionId: 'n', status: 'n', count: 'n' },
                ]
            }
            else if (element.key == Strings.Outbound_Encounter_ClaimDetails837 || element.key == Strings.Outbound_Encounter_BatchDetails837) {
                data = [
                    { apiflag: '0', State: 'n', selectedTradingPartner: 'n', startDate: 'n', endDate: 'n', transactionId: 'n', status: 'n', count: 'n' },
                ]
            }
            else if (element.key == Strings.serviceDetails278) {
                data = [
                    { TransStatus: '', ErrorCode: '' },
                ]
            }
            else if (element.key == Strings.Outbound_ClaimDetails837 || element.key == Strings.Outbound_BatchDetails837) {
                data = [
                    { apiflag: '0', State: 'n', selectedTradingPartner: 'n', startDate: 'n', endDate: 'n', transactionId: 'n', status: 'n', count: 'n' },
                ]
            }
            else if (element.key === Strings._claimPayment_835_details || element.key === Strings.PremiumPaymentLoadDetails || element.key === Strings.MMRFileLoadDetails) {
                data = [
                    { apiflag: '0', State: 'n', selectedTradingPartner: 'n', startDate: 'n', endDate: 'n', transactionId: 'n', status: 'n', count: 'n' },
                ]
            } else if (element.key == Strings._Outbound_response_999) {
                data = [
                    { flag999: '1' },
                ]
            } else if (element.key == Strings._Inbound_response_999) {
                data = [
                    { flag999: '0' },
                ]
            } else if (element.key == Strings.enrollmentLoadDetails) {
                data = [
                    { apiflag: '0', State: 'n', selectedTradingPartner: 'n', startDate: 'n', endDate: 'n', transactionId: 'n', status: '', count: 'n' },
                ]

            }
            else if (element.key == Strings.Outbound_Encounter_response_999) {
                data = [
                    { flag999: '1' },
                ]
            } else if (element.key == Strings.Inbound_Encounter_response_999) {
                data = [
                    { flag999: '0' },
                ]
            } else if (element.key == Strings.Enrollment_FullFileCompare) {
                data = [
                    { incoming_fileId: "834_UT_Audit.da" },
                ]

            } else if (element.key == Strings.Enrollment_eligibiltyDetails) {
                data = [{
                    status: 'n',
                    claimStatus: 'n',
                    inDHS: 'Y',
                    Audit: 'n',
                    Add: 'n',
                    flag: 'Y',
                    inQnxt: 'n',
                    MonthlyStatus: 'n',
                    incoming_fileId: '834_UT_Audit.da'
                }]
            }

            else {
                addon = ''
            }

            row.push(
                <li>
                    <Link to={{ pathname: element.key ? ('/' + (element.key ? element.key : '') + addon) : "", state: { data } }}>{element.menu_description}</Link>
                </li>
            )
        });
        return (
            <li className="active">
                <a href={'#' + key} data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">{value}</a>
                <ul className="collapse list-unstyled" id={key}>
                    {row}
                </ul>
            </li>
        )
    }

    renderSidebarItems() {
        let menuOptions = this.state.menuOptions
        let row = []
        for (let keys in menuOptions) {
            row.push(this.renderItems(keys, menuOptions[keys].name, menuOptions[keys].array))
        }

        return (
            <div>
                {row}
            </div>
        )
    }

    renderTabs() {
        return (
            <div id="tabs">
                <div className="row p">
                    <div className="col-6 p nopadding">
                        <a className="clickable"
                            onClick={() => {
                                isOutbound = false
                                sessionStorage.setItem('isOutbound', false)
                                setTimeout(() => {
                                    window.location.reload()
                                }, 50);
                            }}
                        >
                            <p className="p smaller-font">Inbound</p>
                            {!isOutbound ? <hr className="underline p" /> : null}
                        </a>
                    </div>

                    <div className="col-6 p nopadding">
                        <a className="clickable"
                            onClick={() => {
                                isOutbound = true
                                sessionStorage.setItem('isOutbound', true)
                                setTimeout(() => {
                                    window.location.reload()
                                }, 50);
                            }}
                        >
                            <p className="p smaller-font">Outbound</p>
                            {isOutbound ? <hr className="underline p" /> : null}
                        </a>
                    </div>
                </div>
            </div>
        )
    }

    renderCopyright = () => {
        // fixed-bottom
        return (
            <div className="copyright"><br />
                © 2020 Powered by HiPaaS,<br /> All rights reserved.
            </div>
        )
    }

    render() {
        return (
            <nav id="sidebar" style={{ marginTop: '-17px' }}>
                <ul className="list-unstyled components">
                    {this.renderTabs()}
                    {this.renderSidebarItems()}
                    {this.renderCopyright()}
                </ul>
            </nav>
        );
    }
}