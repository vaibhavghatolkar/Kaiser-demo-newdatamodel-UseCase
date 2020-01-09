import React from 'react';
import './style.css';
import { AssignedDetails } from '../Claims/AssignedDetails';
import Urls from '../../../helpers/Urls';

export class ResearchQueue extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            flag: ''
        }
    }

    gotoAssigned(){
        this.setState({
            flag: 'assignedFlag'
        })
    }

    render() {
        return (
            <div>
                {
                    this.state.flag == 'assignedFlag'
                    ?
                    <AssignedDetails/>
                    :
                    <div>
                        <div>
                        <br></br>
                            <h5 style={{ color: '#139DC9',fontsize: "20px" }}>Assigned Claim's Summary - John Smith</h5><br></br>
                        </div>
                        <div className="row">
                            <div className="form-group col-sm-3">
                                <label className="list-header">State</label>
                                <select className="form-control list-header" id="selState">
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
                            <div className="form-group col-sm-3">
                                <label className="list-header">Trading partner</label>
                                <select className="form-control list-header" id="selTradingPartner">
                                    <option value="">Trading partner</option>
                                    <option selected="selected" value="1">Trading Partner 1</option>
                                    <option value="2">Trading Partner 2</option>
                                </select>
                            </div>
                            <div className="form-group col-sm-3">
                                <label className="list-header">Provider Name </label>
                                <select className="form-control list-header" id="selProviderName">
                                    <option value="">Provider Name</option>
                                    <option selected="selected" value="1">Provider Name 1</option>
                                    <option value="2">Provider Name 2</option>
                                </select>
                            </div>
                        </div>
                        <div className="table-responsive list-header">
                            <table className="table table-striped">
                                <thead>
                                    <tr style={{ background: "#139DC9", color: "white" }}>
                                        <th>Assign</th>
                                        <th>Claim Status</th>
                                        <th>Days Old</th>
                                        <th>Pateint ID</th>
                                        <th>Payer</th>
                                        <th>Seq ID</th>
                                        <th>Claim Amt</th>
                                        <th>Batch ID</th>
                                        <th>Batch Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td> John Smith</td>
                                        <td><a href="#" onClick={() => {this.gotoAssigned()}} style={{color:"#6AA2B8"}}>Rejected</a></td>
                                        <td>5</td>
                                        <td>P0005915</td>
                                        <td>CPSI</td>
                                        <td>10001</td>
                                        <td>$147.00</td>
                                        <td>1734112</td>
                                        <td>4/24/2014 1:16:18 PM</td>
                                        <td>TP Notified </td>
                                    </tr>
                                    <tr>
                                        <td> John Smith</td>
                                        <td><a href="#" onClick={() => {this.gotoAssigned()}} style={{color: "#6AA2B8"}}>Rejected</a></td>
                                        <td>10</td>
                                        <td>P0003568</td>
                                        <td>BCBS</td>
                                        <td>10002</td>
                                        <td>$6,431.00</td>
                                        <td>1734113</td>
                                        <td>4/24/2014 1:16:18 PM</td>
                                        <td>Assigned</td>
                                    </tr>
                                    <tr>
                                        <td> John Smith</td>
                                        <td><a href="#" onClick={() => {this.gotoAssigned()}} style={{color: "#6AA2B8"}}>Denied</a></td>
                                        <td>12</td>
                                        <td>P0006309</td>
                                        <td>HEALTH CO</td>
                                        <td>10003</td>
                                        <td>$411.00</td>
                                        <td>1734089</td>
                                        <td>4/24/2014 1:15:20 PM</td>
                                        <td>TP Notified</td>
                                    </tr>
                                    <tr>
                                        <td> John Smith</td>
                                        <td><a href="#" onClick={() => {this.gotoAssigned()}} style={{color: "#6AA2B8"}}>Denied</a></td>
                                        <td>12</td>
                                        <td>P0006309</td>
                                        <td>HEALTH CO</td>
                                        <td>10004</td>
                                        <td>$3,042.05</td>
                                        <td>1734089</td>
                                        <td>4/24/2014 1:15:20 PM</td>
                                        <td>Waiting Approval</td>
                                    </tr>
                                    <tr>
                                        <td> John Smith</td>
                                        <td><a href="#" onClick={() => {this.gotoAssigned()}} style={{color: "#6AA2B8"}}>A/R Past 60</a></td>
                                        <td>62</td>
                                        <td>P0006309</td>
                                        <td>HEALTH CO</td>
                                        <td>10005</td>
                                        <td>$349.63</td>
                                        <td>1734089</td>
                                        <td>4/24/2014 1:15:20 PM</td>
                                        <td>Waiting Approval</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                }
            </div>
        );
    }

}