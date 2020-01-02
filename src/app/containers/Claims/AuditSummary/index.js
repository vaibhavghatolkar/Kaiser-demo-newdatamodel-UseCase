import React from 'react'
import '../../Claims/Dashboard/styles.css'
import moment from 'moment';
import { Topbar } from '../../../components/Topbar';
import Strings from '../../../../helpers/Strings';
import Urls from '../../../../helpers/Urls';
import { Link } from 'react-router-dom'

export class AuditSummary extends React.Component{
    
    constructor(props){
        super(props);
        this.state={
            claimsAudit: [],
            tradingpartner: [],
            SubTotal : 0,
            VeriTotal : 0,
            InBizstockTotal : 0,
            selectedTradingPartner: '',
            PenTotal : 0,
            RejTotal : 0,
            errTotal : 0
        }

        this.getData = this.getData.bind(this)
        this.onSelect = this.onSelect.bind(this)
    }

    componentDidMount(){
        this.getData()
    }

    getData(){
        let query = `{
            ClaimsDailyAudit(submitter:"`+this.state.selectedTradingPartner+`",fromDt:"",ToDt:""){
              FileID
              filename
              Submitted
              Rejected
              Pending
              Verified
              Error
              InBizstock
            }
            ClaimsDailyAuditCount(submitter:"`+this.state.selectedTradingPartner+`",fromDt:"",ToDt:""){
                SubTotal
                VeriTotal
                InBizstockTotal
                PenTotal
                RejTotal
                errTotal
            }
            FileInCount(submitter:"`+this.state.selectedTradingPartner+`",fromDt:"",ToDt:""){
                totalFile
            }
            Trading_PartnerList(Transaction:"Claim837") { 
               
                Trading_Partner_Name 
                
            }
        }`

        fetch(Urls.base_url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({query: query})
        })
        .then(res => res.json())
        .then(res => {
            console.log(res)
            if(res.data){
                let totalFile = 0
                try {
                    totalFile = res.data.FileInCount[0].totalFile
                } catch (error) {
                    
                }

                this.setState({
                    claimsAudit: res.data.ClaimsDailyAudit,
                    SubTotal : res.data.ClaimsDailyAuditCount[0].SubTotal,
                    VeriTotal : res.data.ClaimsDailyAuditCount[0].VeriTotal,
                    InBizstockTotal : res.data.ClaimsDailyAuditCount[0].InBizstockTotal,
                    PenTotal : res.data.ClaimsDailyAuditCount[0].PenTotal,
                    RejTotal : res.data.ClaimsDailyAuditCount[0].RejTotal,
                    errTotal : res.data.ClaimsDailyAuditCount[0].errTotal,
                    tradingpartner: res.data.Trading_PartnerList,
                    totalFile : totalFile
                })
            }
        })
        .catch(err => {
            console.log(err)
        });
    }

    renderSearchBar(){
        return(
            <div className="row">
                <input type="text" name="name" className="input-style" placeholder="Search"/>
            </div>
        )
    }

    renderTransactions(){
        let row = []
        const data = this.state.claimsAudit;
        console.log(data)

        data.forEach((d) => {
            row.push(
                <tr>
                    <td style={{color:"#6AA2B8"}}>{d.filename}</td>
                    <td>{d.Submitted}</td>
                    <td>{d.InBizstock}</td>
                    <td>{d.Rejected}</td>
                    <td>{d.Error}</td>
                    <td>{d.Pending}</td>
                    <td>{d.Verified}</td>
                </tr>
            )
        });
        return(
            <table className="table table-bordered claim-list summary-list">
                <thead>
                    <tr className="table-head">
                        <td className="table-head-text">File Name</td>
                        <td className="table-head-text list-item-style">Submitted</td>
                        <td className="table-head-text list-item-style">InBiztalk</td>
                        <td className="table-head-text list-item-style">Rejected PreProcess</td>
                        <td className="table-head-text list-item-style">Error in PreProcess</td>
                        <td className="table-head-text list-item-style">Pending in Preprocess</td>
                        <td className="table-head-text list-item-style">In Facets</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Totals</td>
                        <td>{this.state.SubTotal}</td>
                        <td>{this.state.VeriTotal}</td>
                        <td>{this.state.InBizstockTotal}</td>
                        <td>{this.state.PenTotal}</td>
                        <td>{this.state.RejTotal}</td>
                        <td>{this.state.errTotal}</td>
                    </tr>
                    {row}
                </tbody>
            </table>
        )
    }

    onSelect(event, key){
        if(event.target.options[event.target.selectedIndex].text == 'Select Provider Name' || event.target.options[event.target.selectedIndex].text == 'Select Trading Partner'){
            this.setState({
                [key] : ''
            })
        } else {
            this.setState({
                [key] : event.target.options[event.target.selectedIndex].text
            })
        }

        setTimeout(() => {
            this.getData()
        }, 50);
    }

    renderStats(){
        return (
            <div className="row">
                <div className="col-2">
                    <div className="center-align">Total Files</div>
                    <div className="center-align"><a href="#" className="blue bold-text summary-values" 
                        // onClick={() => {this.props.handleFlag(Strings.claimDetails)}}
                    ><Link to={'/' + Strings.claimDetails + '/n/n/n/n'}>{this.state.totalFile}</Link></a></div>
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
                {/* {this.renderSearchBar()} */}
                <br></br>
                            <h5 style={{ color: '#139DC9',fontsize: "20px" }}>Claims Audit</h5><br></br>
                <Topbar 
                    tradingpartner={this.state.tradingpartner} 
                    onSelect={this.onSelect}
                    />
                {this.renderStats()}
                {this.state.claimsAudit && this.state.claimsAudit.length > 0 ? this.renderTransactions() : null}
            </div>
        );
    }
}