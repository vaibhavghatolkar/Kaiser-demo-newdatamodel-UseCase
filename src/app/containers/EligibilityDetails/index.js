import React from 'react'
import '../Claims/Dashboard/styles.css'
import '../Claim_276_RealTime/Real_Time_276/style.css'
import moment from 'moment';
import Urls from '../../../helpers/Urls';

export class EligibilityDetails extends React.Component{
    
    constructor(props){
        super(props);
        this.state={
            claimsList : [],
            summaryList : [],
            showDetails: false,
            files_list : [],
            tradingpartner: [],
            // key : props.match.params.key,
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
                    tradingpartner: res.data.Trading_PartnerList
                })
            }
        })
        .catch(err => {
            console.log(err)
        });
    }

    getTransactions(key){
        let query = ''
        let typeId = "276"
        if(this.state.apiflag == 1){
            typeId = "270"
        }

        query = "{ EligibilityErrorDtlTypewise (TypeID:\""+typeId+"\"){ Trans_CountID TypeOfTransaction AvgResTime TotalNumOfReq Success Error Date Trans_type Submiter Trans_ID Error_Code } }"
        // if(this.state.key == 'Total Number Of Requests'){
        //     query = "{ EligibilityAllDtlTypewise (TypeID:\""+typeId+"\"){ Trans_CountID TypeOfTransaction AvgResTime TotalNumOfReq Success Error Date Trans_type Submiter Trans_ID Error_Code } }"
        // } else {
        // }

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
                    files_list : key == 'Total Number Of Requests' ? res.data.EligibilityAllDtlTypewise : res.data.EligibilityErrorDtlTypewise,
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

    renderTransactions(){
        let row = []
        const data = this.state.files_list;

        data.forEach((d) => {
            row.push(
                <tr>
                    <td>{d.Trans_ID}</td>
                    <td>{moment.unix(d.Date/1000).format("MM/DD/YYYY")}</td>
                    <td>{d.Trans_type}</td>
                    <td>{d.Submiter}</td>
                    <td>{d.Error_Code}</td>
                    <td><a href="#" onClick={() => {this.showDetails()}} className="btn-background">View</a></td>
                </tr>
            )
        });
        return(
            <table className="table table-bordered claim-list">
               <thead>
                   <tr className="table-head" style={{fontSize:"9px"}}>
                       <td className="table-head-text">Transaction Id</td>
                       <td className="table-head-text list-item-style">Transaction Date</td>
                       <td className="table-head-text list-item-style">Trans Type</td>
                       <td className="table-head-text list-item-style">Submitter</td>
                       <td className="table-head-text list-item-style">Error Code</td>
                       <td className="table-head-text list-item-style">View</td>
                   </tr>
               </thead>
               <tbody>
                   {row}
               </tbody>
           </table>
        )
    }

    renderDetails(){
        return(
            <div>
                <div className="top-padding">Transaction Request</div>
                <div className="border-view">ISA*00* *00* *ZZ*SUBMITTERID *ZZ*CMS *160127*0734*^*00501*000005014*1*P*|~ GS*HS*SUBMITTERID*CMS*20160127*073411*5014*X*005010X279A1~ ST*270*000000001*005010X279A1~ BHT*0022*13*TRANSA*20160127*073411~ HL*1**20*1~ NM1*PR*2*CMS*****PI*CMS~ HL*2*1*21*1~ NM1*1P*2*IRNAME*****XX*1234567893~ HL*3*2*22*0~..............</div>
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
                <div className="form-group col-sm-3">
                    <label className="list-header">Error Code</label>
                    <input className="form-control list-header" id="state">
                    </input>
                </div>
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
                        {this.state.showDetails ? this.renderDetails() : null}
                    </div>
                </div>
            </div>
        );
    }
}