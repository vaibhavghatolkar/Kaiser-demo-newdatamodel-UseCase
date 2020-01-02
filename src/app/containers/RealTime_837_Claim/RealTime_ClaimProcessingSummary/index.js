import React from 'react'
import '../../Claims/Dashboard/styles.css'
import moment from 'moment';
import { Topbar } from '../../../components/Topbar';
import Strings from '../../../../helpers/Strings';
import Urls from '../../../../helpers/Urls';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom'

export class ClaimProcessingSummary extends React.Component{
    
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
    handlePageClick(data, fileId){
        let page = data.selected + 1
        this.setState({
            page : page
        })

        setTimeout(() => {
            this.onClick()
        }, 50);
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
                    
                </tr>
            )
        });
        return(
            <div>
            <table className="table table-bordered claim-list summary-list">
                <thead>
                    <tr className="table-head">
                        <td className="table-head-text">Claim Id</td>
                        <td className="table-head-text list-item-style">Claim Date</td>
                        <td className="table-head-text list-item-style">Claim Amount</td>
                        <td className="table-head-text list-item-style">Claim Status</td>
                        <td className="table-head-text list-item-style">Subscriber Name</td>
                        <td className="table-head-text list-item-style">Provider Name</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
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
            {/* <ReactPaginate
            previousLabel={'previous'}
            nextLabel={'next'}
            breakLabel={'...'}
            breakClassName={'page-link'}
            initialPage={0}
            pageCount={count}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={(page) => {this.handlePageClick(page, keys)}}
            containerClassName={'pagination'}
            pageClassName={'page-item'}
            previousClassName={'page-link'}
            nextClassName={'page-link'}
            pageLinkClassName={'page-link'}
            subContainerClassName={'pages pagination'}
            activeClassName={'active'}
            /> */}
            </div>
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
                {/* <div className="col-2">
                    <div className="center-align">Total Files</div>
                    <div className="center-align"><a href="#" className="blue bold-text summary-values" 
                    ><Link to={'/' + Strings.claimDetails + '/n/n/n/n'}>{this.state.totalFile}</Link></a></div>
                </div> */}
                <div className="col-2">
                    <div className="center-align">Total Accepted</div>
                    <div className="blue bold-text summary-values center-align">-</div>
                </div>
                <div className="col-2">
                    <div className="center-align">Rejected</div>
                    <div className="blue bold-text summary-values center-align">-</div>
                </div>
                <div className="col-2">
                    <div className="center-align">Sent to QNXT</div>
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
                <br />
                <h5 style={{ color: '#139DC9',fontsize: "20px" }}>Claim Processing Summary</h5> <br/>
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