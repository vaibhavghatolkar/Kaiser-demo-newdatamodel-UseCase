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
                    <td>{item.Match_ID}</td>
                    <td>{item.SeqID}</td>
                    <td>{item.Billing_Provider_ID}</td>
                    <td>{item.Subscriber_ID}</td>
                    <td>{item.Last}</td>
                    <td>{item.FirstName}</td>
                    <td>{item.amount}</td>
                    <td>{item.StmtBegin}</td>
                    <td>{item.StmtEnd}</td>
                    <td>{item.ExtClaimID}</td>
                    <td>{item.Status}</td>
                    <td><button class="btn btn-sm btn-primary btn-block" type="resend">Match</button></td>
                </tr>
            )
        });
        return row
    }

    renderClaimsError(){
        return(
            <div class="table-responsive">
                <table className="table table-bordered claim-list">
                    <thead>
                        <tr className="table-head">
                            <td className="table-head-text">Match ID</td>
                            <td className="table-head-text">Seq ID</td>
                            <td className="table-head-text">Provider ID</td>
                            <td className="table-head-text">Subscriber ID</td>
                            <td className="table-head-text">Last Name</td>
                            <td className="table-head-text">First Name</td>
                            <td className="table-head-text">Amount</td>
                            <td className="table-head-text">Stmt Begin</td>
                            <td className="table-head-text">Stmt End</td>
                            <td className="table-head-text">Ext Claim ID</td>
                            <td className="table-head-text">Status</td>
                            <td className="table-head-text">Mark Resend</td>
                        </tr>
                    </thead>
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
                {this.renderSearchBar()}
                <Topbar/>
                {this.renderClaimsError()}
            </div>
        );
    }
}