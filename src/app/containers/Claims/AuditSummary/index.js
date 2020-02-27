import React from 'react'
import '../../Claims/Dashboard/styles.css'
import moment from 'moment';
import { Topbar } from '../../../components/Topbar';
import Strings from '../../../../helpers/Strings';
import Urls from '../../../../helpers/Urls';
import { Link } from 'react-router-dom'
import { getDetails } from '../../../../helpers/getDetails';

export class AuditSummary extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            claimsAudit: [],
            tradingpartner: [],
            SubTotal: 0,
            VeriTotal: 0,
            InBizstockTotal: 0,
            selectedTradingPartner: '',
            PenTotal: 0,
            RejTotal: 0,
            errTotal: 0
        }

        this.getData = this.getData.bind(this)
        this.onSelect = this.onSelect.bind(this)
    }

    componentDidMount() {
        this.getTradingPartnerDetails()
        this.getData()
    }

    getTradingPartnerDetails = async () => {
        getDetails("Claim837")
            .then((tradingpartner) => {
                if (tradingpartner && tradingpartner.length > 0) {
                    this.setState({
                        tradingpartner: tradingpartner
                    })
                }
            })
    }

    getData() {
        let query = `{
            ClaimsDailyAudit(submitter:"`+ this.state.selectedTradingPartner + `",fromDt:"",ToDt:""){
              FileID
              filename
              Submitted
              Rejected
              Pending
              Verified
              Error
              InBizstock
            }
            ClaimsDailyAuditCount(submitter:"`+ this.state.selectedTradingPartner + `",fromDt:"",ToDt:""){
                SubTotal
                VeriTotal
                InBizstockTotal
                PenTotal
                RejTotal
                errTotal
            }
            FileInCount(submitter:"`+ this.state.selectedTradingPartner + `",fromDt:"",ToDt:""){
                totalFile
            }
        }`

        fetch(Urls.claims_837, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                console.log(res)
                if (res.data) {
                    let totalFile = 0
                    try {
                        totalFile = res.data.FileInCount[0].totalFile
                    } catch (error) {

                    }

                    this.setState({
                        claimsAudit: res.data.ClaimsDailyAudit,
                        SubTotal: res.data.ClaimsDailyAuditCount[0].SubTotal,
                        VeriTotal: res.data.ClaimsDailyAuditCount[0].VeriTotal,
                        InBizstockTotal: res.data.ClaimsDailyAuditCount[0].InBizstockTotal,
                        PenTotal: res.data.ClaimsDailyAuditCount[0].PenTotal,
                        RejTotal: res.data.ClaimsDailyAuditCount[0].RejTotal,
                        errTotal: res.data.ClaimsDailyAuditCount[0].errTotal,
                        tradingpartner: res.data.Trading_PartnerList,
                        totalFile: totalFile
                    })
                }
            })
            .catch(err => {
                console.log(err)
            });
    }

    renderSearchBar() {
        return (
            <div className="row">
                <input type="text" name="name" className="input-style" placeholder="Search" />
            </div>
        )
    }

    renderTransactions() {
        let row = []
        const data = this.state.claimsAudit;
        console.log(data)

        data.forEach((d) => {
            row.push(
                <tr>
                    <td>{d.filename}</td>
                    <td className="list-item-style">{d.Submitted}</td>
                    <td colSpan={2} className="list-item-style">{d.InBizstock}</td>
                    <td className="list-item-style">{d.Rejected}</td>
                    <td className="list-item-style">0</td>
                    {/* <td className="list-item-style">{d.Pending}</td> */}
                    <td colSpan={2} className="list-item-style">{d.Verified}</td>
                </tr>
            )
        });
        return (
            <table className="table table-bordered claim-list">
                <tr className="table-head">
                    <td className="table-head-text list-item-style">File Name <img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                    <td className="table-head-text list-item-style">Submitted <img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                    <td colSpan={2} className="table-head-text list-item-style">In HiPaaS <img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                    <td className="table-head-text list-item-style">Rejected PreProcess <img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                    <td className="table-head-text list-item-style">Error in PreProcess <img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                    {/* <td className="table-head-text list-item-style">Accepted in Preprocess</td> */}
                    <td colSpan={2} className="table-head-text list-item-style">In Qnxt <img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                </tr>
                <tbody>
                    <tr>
                        <td>Totals</td>
                        <td className="list-item-style">{this.state.SubTotal}</td>
                        <td colSpan={2} className="list-item-style">{this.state.InBizstockTotal}</td>
                        <td className="list-item-style">{this.state.RejTotal}</td>
                        <td className="list-item-style">0</td>
                        <td colSpan={2} className="list-item-style">{this.state.VeriTotal}</td>
                        {/* <td className="list-item-style">{this.state.PenTotal}</td>
                        <td className="list-item-style">{this.state.errTotal}</td> */}
                    </tr>
                    {row}
                </tbody>
            </table>
        )
    }

    onSelect(event, key) {
        if (event.target.options[event.target.selectedIndex].text == 'Provider Name' || event.target.options[event.target.selectedIndex].text == 'Trading partner') {
            this.setState({
                [key]: ''
            })
        } else {
            this.setState({
                [key]: event.target.options[event.target.selectedIndex].text
            })
        }

        setTimeout(() => {
            this.getData()
        }, 50);
    }



    renderStats() {
        let data = []
        data = [
            { flag: 'n', selectedTradingPartner: 'n', startDate: 'n', endDate: 'n' },
        ]

        return (

            <div className="row">
                <div className="col-2">
                    <div className="center-align">Total Files</div>
                    <div className="center-align"><a href="#" className="blue bold-text summary-values"
                    // onClick={() => {this.props.handleFlag(Strings.claimDetails)}}

                    >
                        <Link to={{ pathname: '/Files_837', state: { data } }}> {this.state.totalFile} </Link>
                        {/* <Link to={'/' + Strings.claimDetails , '/n/n/n/n'}>{this.state.totalFile}</Link> */}

                    </a>
                    </div>
                </div>
                <div className="col-2">
                    <div className="center-align">Dup Files</div>
                    <div className="blue bold-text summary-values center-align">-</div>
                </div>
                <div className="col-2">
                    <div className="center-align">999</div>
                    <div className="green bold-text summary-values center-align">{this.state.totalFile}</div>
                </div>
                <div className="col-2">
                    <div className="center-align">277 CA</div>
                    <div className="red bold-text summary-values center-align">0</div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div>
                <h5 className="headerText">Claims Audit Summary</h5>
                <Topbar
                    tradingpartner={this.state.tradingpartner}
                    onSelect={this.onSelect}
                />
                {this.renderStats()}
                <div className="col-10">
                    {this.state.claimsAudit && this.state.claimsAudit.length > 0 ? this.renderTransactions() : null}
                </div>
            </div>
        );
    }
}