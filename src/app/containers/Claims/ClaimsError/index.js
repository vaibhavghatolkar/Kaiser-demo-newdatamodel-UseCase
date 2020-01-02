import React from 'react'
import '../../Claims/Dashboard/styles.css'
import moment from 'moment';
import { Topbar } from '../../../components/Topbar';
import Strings from '../../../../helpers/Strings';
import Urls from '../../../../helpers/Urls';
import { Link } from 'react-router-dom'

export class ClaimsError extends React.Component{
    
    constructor(props){
        super(props);
        this.state={
            claimsError: [],
            SubTotal : 0,
            VeriTotal : 0,
            InBizstockTotal : 0,
            selectedTradingPartner: '',
            tradingpartner: [],
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
        
        let query = '{ SP_GetRejectedClaims(Date:"") { Reason BillingProviderLastName FileName FileDate Member_Account_Number SubscriberLastName SubscriberFirstName } ClaimRejCount (submitter:"'+this.state.selectedTradingPartner+'",fromDt:"",ToDt:""){ RejCount } Trading_PartnerList(Transaction:"Claim837") { Trading_Partner_Name }}'

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
                    claimsError: res.data.SP_GetRejectedClaims,
                    rejectedCount : res.data.ClaimRejCount[0].RejCount,
                    tradingpartner: res.data.Trading_PartnerList
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

    renderClaimsError(){
        let row = []
        const data = this.state.claimsError;
console.log(data);
        data.forEach((d) => {
            row.push(
                <tr>
                    <td>{d.Reason}</td>
                    <td>{d.BillingProviderLastName}</td>
                    <td>{d.FileName}</td>
                    <td>{d.Member_Account_Number}</td>
                    <td>{d.SubscriberLastName}</td>
                    <td>{d.SubscriberFirstName}</td>
                    <td>
                        <select id="sel1">
                            <option value="0">Select</option>
                            <option value="1">John Wilson</option>
                            <option value="2">John Smith</option>
                            <option value="3">Sarah Thompson</option>
                            <option value="3">Andrew parker</option>
                        </select>
                    </td>
                </tr>
            )
        });
        return(
            <table className="table table-bordered claim-list summary-list">
                <thead>
                    <tr className="table-head">
                        <td className="table-head-text">Reason</td>
                        <td className="table-head-text list-item-style">BillingProLastName</td>
                        <td className="table-head-text list-item-style">FileName</td>
                        <td className="table-head-text list-item-style">Member_Acc_No</td>
                        <td className="table-head-text list-item-style">SubscriberLName</td>
                        <td className="table-head-text list-item-style">Subscriber FName</td>
                        <td className="table-head-text list-item-style">Assign</td>
                    </tr>
                </thead>
                <tbody>
                    {row}
                </tbody>
            </table>
        )
    }

    renderTopSubBar(){
        return(
            <div className="row">
                <div className="form-group col-sm-3">
                    <input class="form-control list-header" id="fileName-filter" name="fileName-filter" placeholder="FileName" search-index="1" type="text" value=""/>
                </div>
                <div className="form-group col-sm-3">
                    <input class="form-control list-header" id="fileName-filter" name="fileName-filter" placeholder="Member_Acc_No" search-index="1" type="text" value=""/>
                </div>
                <div className="form-group col-sm-3">
                    <input class="form-control list-header" id="fileName-filter" name="fileName-filter" placeholder="SubscriberLName" search-index="1" type="text" value=""/>
                </div>

            </div>
        )
        
    }


    renderStatus(){
        return (
            <div class="dashfrm-LR1 row">
                <div className="col-2">
                    <div className="small-text">Total Rejection</div>
                    <div className="red bold-text summary-values center-align"><a href="#" 
                        onClick={() => {
                            // this.props.handleFlag(Strings.claimDetails, 1)
                            // '/'+ Strings.claimDetails + '/:flag/:selectedTradingPartner/:startDate/:endDate'
                        }}>
                        <Link to={'/' + Strings.claimDetails + '/reject/n/n/n'}>{this.state.rejectedCount}</Link>
                        </a></div>
                </div>
                <div className="col-4 div-inner"><span style={{padding:"10px"}}>Misdirected Claims</span></div>
                <div className="col-3 small-div"><span style={{padding:"10px"}}>Member Not Found</span></div>
                <div className="col-2 third-div"><span style={{padding:"10px"}}>ICD Code not Found</span></div>
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

    render() {
        return (
            <div>
                {/* {this.renderSearchBar()} */}
                <br></br>
                            <h5 style={{ color: '#139DC9',fontsize: "20px" }}>Claims Error</h5><br></br>
                <Topbar 
                    tradingpartner={this.state.tradingpartner} 
                    onSelect={this.onSelect}
                />
                
                {this.renderTopSubBar()}
                {this.renderStatus()}
                {this.renderClaimsError()}
            </div>
        );
    }
}