import React from 'react'
import '../Claims/Dashboard/styles.css'
import '../Claim_276_RealTime/Real_Time_276/style.css'
import moment from 'moment';
import Urls from '../../../helpers/Urls';
import ReactPaginate from 'react-paginate';

export class EligibilityDetails extends React.Component{
    
    constructor(props){
        super(props);
        let count = 0
        try {
            count = props.match.params.count / 10
            if(props.match.params.count % 10 > 0){
                count = count + 1
            }
        } catch (error) {
            
        }

        this.state={
            claimsList : [],
            summaryList : [],
            showDetails: false,
            files_list : [],
            tradingpartner: [],

            State: props.match.params.State != 'n' ? props.match.params.State : '',
            status: props.match.params.status != 'n' ? props.match.params.status : '',
            startDate: props.match.params.startDate != 'n' ? props.match.params.startDate : '',
            endDate: props.match.params.endDate != 'n' ? props.match.params.endDate : '',
            transactionId: props.match.params.transactionId != 'n' ? props.match.params.transactionId : '',
            count: count,
            errorcode: '',
            
            selectedTradingPartner: '',
            page: 1,
            apiflag: props.match.params.apiflag
        }

        this.getData = this.getData.bind(this)
    }

    componentWillReceiveProps(){
        setTimeout(() => {
            this.getData()
            this.getTransactions()
        }, 50);
    }

    componentDidMount(){
        this.getData()
        this.getTransactions()
    }

    getData(){
        let query = `{
            Trading_PartnerList { 
                ID 
                Trading_Partner_Name 
            }
        }`

        if(this.state.apiflag == 1){
            query = `{
                Trading_PartnerList { 
                    ID 
                    Trading_Partner_Name 
                }
            }`
        }

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
            if(res.data){
                this.setState({
                    tradingpartner: res.data.Trading_PartnerList ? res.data.Trading_PartnerList : []
                })
            }
        })
        .catch(err => {
            console.log(err)
        });
    }

    getTransactions(){
        let query = ''
        let typeId = "276"
        if(this.state.apiflag == 1){
            typeId = this.state.status
        }

        query = `{
            EligibilityAllDtlTypewise(TypeID:"`+typeId+`" page:`+this.state.page+` State:"`+this.state.State+`" Sender:"`+this.state.selectedTradingPartner+`" StartDt:"`+this.state.startDate+`" EndDt:"`+this.state.endDate+`" TransactionID:"`+this.state.transactionId+`" ErrorCode:"`+this.state.errorcode+`") {
                HiPaaSUniqueID
                Date
                Trans_type
                Submiter
                Trans_ID
                Error_Code
                ErrorDescription
            }
        }`

        console.log('query ', query)

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
            if(res.data){
                this.setState({
                    files_list : res.data.EligibilityAllDtlTypewise,
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
                <input type="text" name="name" className="input-style" placeholder="Search Claim"/>
            </div>
        )
    }

    showDetails(){
        this.setState({
            showDetails: true
        })
    }

    handlePageClick(data){
        let page = data.selected + 1
        this.setState({
            page : page
        })

        setTimeout(() => {
            this.getTransactions()
        }, 50);
    }

    getDetails(uuid){
        let query = `{
            Eligibilty270Request(HiPaaSUniqueID:"`+uuid+`") {
              Message
            }
            Eligibilty271Response(HiPaaSUniqueID:"`+uuid+`") {
                Message
            }
        }`

        console.log('query ', query)

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
            if(res.data){
                this.setState({
                    showDetails: true,
                    message_270 : res.data.Eligibilty270Request[0].Message,
                    message_271 : res.data.Eligibilty271Response[0].Message,
                })
            }
        })
        .catch(err => {
            console.log(err)
        });
    } 

    renderTransactions(){
        let row = []
        const data = this.state.files_list ? this.state.files_list : []

        data.forEach((d) => {
            row.push(
                <tr>
                    <td><a href="#" onClick={() => {this.getDetails(d.HiPaaSUniqueID)}} style={{ color: "#6AA2B8" }}>{d.Trans_ID}</a></td>
                    <td>{moment.unix(d.Date/1000).format("MM/DD/YYYY")}</td>
                    <td>{d.Trans_type}</td>
                    <td>{d.Submiter}</td>
                    <td>{d.Error_Code}</td>
                    {this.state.status != 'Pass' ? <td>{d.ErrorDescription}</td> : null}
                </tr>
            )
        });
        return(
            <div>
                <table className="table table-bordered claim-list">
                    <thead>
                        <tr className="table-head" style={{fontSize:"9px"}}>
                            <td className="table-head-text">Transaction Id</td>
                            <td className="table-head-text list-item-style">Transaction Date</td>
                            <td className="table-head-text list-item-style">Trans Type</td>
                            <td className="table-head-text list-item-style">Submitter</td>
                            <td className="table-head-text list-item-style">Error Type</td>
                            {this.state.status != 'Pass' ? <td className="table-head-text list-item-style">Error Description</td> : null}
                        </tr>
                    </thead>
                    <tbody>
                        {row}
                    </tbody>
                </table>
                <ReactPaginate
                    previousLabel={'previous'}
                    nextLabel={'next'}
                    breakLabel={'...'}
                    breakClassName={'page-link'}
                    initialPage={0}
                    pageCount={this.state.count}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={(page) => {this.handlePageClick(page)}}
                    containerClassName={'pagination'}
                    pageClassName={'page-item'}
                    previousClassName={'page-link'}
                    nextClassName={'page-link'}
                    pageLinkClassName={'page-link'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'}
                    />
            </div>
        )
    }

    renderDetails(flag){
        return(
            <div>
                <div className="top-padding"><a href={'#' + 'hello' + flag} data-toggle="collapse">Transaction Request</a></div>
                <div className="border-view collapse" id={'hello' + flag}>{flag ? this.state.message_271 : this.state.message_270}</div>
            </div>
        )
    }

    getoptions() {
        let row = []
        this.state.tradingpartner.forEach(element => {
            row.push(<option value="">{element.Trading_Partner_Name}</option>)
        })
        return row
    }
    renderTopbar() {
        return (
            <div className="row header">
                <div className="form-group col-3">
                    <div className="list-dashboard">Select State</div>
                    <select className="form-control list-dashboard" id="state">
                        <option value="">Select State</option>
                        <option selected="selected" value="1">California</option>
                        <option value="2">Michigan</option>
                        <option value="3">Florida</option>
                        <option value="4">New York</option>
                        <option value="5">Idaho</option>
                        <option value="6">Ohio</option>
                        <option value="7">Illinois</option>
                        <option value="8">Texas</option>
                        <option value="9">Mississippi</option>
                        <option value="10">South Carolina</option>
                        <option value="11">New Mexico</option>
                        <option value="12">Puerto Rico</option>
                        <option value="13">Washington</option>
                        <option value="14">Utah</option>
                        <option value="15">Wisconsin</option>
                    </select>
                </div>

                <div className="form-group col-3">
                    <div className="list-dashboard">Select Trading Partner </div>
                    <select className="form-control list-dashboard" id="TradingPartner" >
                        <option value="select">Select Trading Partner</option>
                        {this.getoptions()}
                    </select>
                </div>
                <div className="form-group col-3">
                    <div className="list-dashboard">Select Provider Name</div>
                    <select className="form-control list-dashboard" id="option" 
                        
                    >
                        <option value="">Select Provider Name</option>
                        <option selected="selected" value="1">Provider Name 1</option>
                        <option value="2">Provider Name 2</option>
                    </select>
                </div>
               
            </div>
        )
    }

    renderDetailsheader(){
        return(
            <div className="row header2">
                <div className="form-group col-sm-3">
                    <label className="list-header">Transaction Id</label>
                    <input className="form-control list-header" id="state">
                    </input>
                </div>
                <div className="form-group col-sm-3">
                    <label className="list-header">Date</label>
                    <input className="form-control list-header" id="state">
                    </input>
                </div>
                <div className="form-group col-sm-3">
                    <label className="list-header">Submiter</label>
                    <input className="form-control list-header" id="state">
                    </input>
                </div>
                {
                    this.state.status != 'Pass'
                    ?
                    <div className="form-group col-sm-3">
                        <label className="list-header">Error Code</label>
                        <input className="form-control list-header" id="state">
                        </input>
                    </div>
                    : null
                }
            </div>
            
        )
    }

    render() {
        return (
            <div>
                {this.renderSearchBar()}
                <div>
                    <label style={{color:"#139DC9" , fontWeight:"bold" , marginTop:"10px"}}>Transaction Details</label>
                    {this.renderTopbar()}
                    {this.renderDetailsheader()}
                    <div className="col-6" style={{float:"left"}}>
                        {this.renderTransactions()}
                    </div>
                    <div className="col-6" style={{float:"right"}}>
                        {this.state.showDetails ? this.renderDetails() : null}
                        {this.state.showDetails ? this.renderDetails(1) : null}
                    </div>
                </div>
            </div>
        );
    }
}