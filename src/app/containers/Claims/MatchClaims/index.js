import React from 'react'
import '../../Claims/Dashboard/styles.css'
import moment from 'moment';
import { Topbar } from '../../../components/Topbar';
import Urls from '../../../../helpers/Urls';

export class MatchClaims extends React.Component{
    
    constructor(props){
        super(props);
        this.state={
            claimsError: [],
            array : [],
            SubTotal : 0,
            VeriTotal : 0,
            InBizstockTotal : 0,
            PenTotal : 0,
            RejTotal : 0,
            errTotal : 0
        }
    }

    componentDidMount(){
        this.getData()
    }

    getData(){
        let query = `{
            MatchClaim {
              Match_ID
              FileName
              SeqID
              Billing_Provider_ID
              Subscriber_ID
              Last
              FirstName
              amount
              StmtBegin
              StmtEnd
              ExtClaimID
              Status
            }
          }`

        fetch(Urls.match_claims, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({query: query})
        })
        .then(res => res.json())
        .then(res => {
            this.setState({
                array : res.data.MatchClaim
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

    renderSearchBar(){
        return(
            <div className="row">
                {/* <input type="text" name="name" className="input-style" placeholder="Search"/> */}
                <div style={{ width: '95%', height: '45px' , marginLeft:'20px' }}>
                    <br></br>
                <h5 style={{ color: '#139DC9',fontsize: "20px" }}>Claim Match & Resend</h5>
                        </div>
            </div>
        )
    }

    renderRows(){
        let row = []
        let array = this.state.array
        array.forEach(item => {
            row.push(
                <tr>
                    <td className="list-item-style">{item.Match_ID}</td>
                    <td className="list-item-style">{item.SeqID}</td>
                    <td className="list-item-style">{item.Billing_Provider_ID}</td>
                    <td className="list-item-style">{item.Subscriber_ID}</td>
                    <td className="list-item-style">{item.Last}</td>
                    <td className="list-item-style">{item.FirstName}</td>
                    <td className="list-item-style">{item.amount}</td>
                    <td className="list-item-style">{item.StmtBegin}</td>
                    <td className="list-item-style">{item.StmtEnd}</td>
                    <td className="list-item-style">{item.ExtClaimID}</td>
                    <td className="list-item-style">{item.Status}</td>
                    <td className="list-item-style"><button class="btnDesign" type="resend">Match</button></td>
                </tr>
            )
        });
        return row
    //     border: 1px solid transparent;
    // padding: .375rem .75rem;
    }

    renderClaimsError(){
        return(
            <div class="table-responsive">
                <table className="table table-bordered claim-list">
                        <tr className="table-head">
                            <td className="table-head-text list-item-style">Match ID <img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                            <td className="table-head-text list-item-style">Seq ID <img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                            <td className="table-head-text list-item-style">Provider ID <img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                            <td className="table-head-text list-item-style">Subscriber ID <img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                            <td className="table-head-text list-item-style">Last Name <img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                            <td className="table-head-text list-item-style">First Name <img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                            <td className="table-head-text list-item-style">Amount <img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                            <td className="table-head-text list-item-style">Stmt Begin <img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                            <td className="table-head-text list-item-style">Stmt End <img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                            <td className="table-head-text list-item-style">Ext Claim ID <img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                            <td className="table-head-text list-item-style">Status <img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                            <td className="table-head-text list-item-style">Mark Resend <img className="SearchBarImage" src={require('../../../components/Images/search_table.png')}></img></td>
                        </tr>
                    <tbody>
                        {this.renderRows()}
                    </tbody>
                </table>
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.renderSearchBar()}<br/>
                <Topbar/>
                {this.renderClaimsError()}
            </div>
        );
    }
}