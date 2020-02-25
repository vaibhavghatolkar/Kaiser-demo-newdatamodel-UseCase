import React from 'react';
// import './style.css';
import Urls from '../../../../helpers/Urls';

export class AssignedDetails extends React.Component {

    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div>
                {
                    <div>
                        <div style={{ width: '95%', height: '28px' }}>
                            <p>Assigned Claims Summary Details - John Smith</p>
                        </div>
                        <div class="table-responsive list-header">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Provider #</th>
                                        <th>Patient Act #</th>
                                        <th>Patient Last Name</th>
                                        <th>Patient First Name</th>
                                        <th>BC Contract Number</th>
                                        <th>Processing Date</th>
                                        <th>Claim Amt</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Providerid2</td>
                                        <td>02669143</td>
                                        <td>MATTIRE</td>
                                        <td>JOHN</td>
                                        <td>200711561</td>
                                        <td>04-24-14</td>
                                        <td>$328.00</td>
                                    </tr>

                                    <tr>
                                        <td colspan="1">Submitter #:</td>
                                        <td colspan="3">00099</td>
                                        <td colspan="1">Submitter Name:</td>
                                        <td colspan="4">NOVITAS SOLUTIONS</td>
                                    </tr>
                                    <tr>
                                        <td colspan="1">Error Desc:</td>
                                        <td colspan="3">EDITS:CONTDOBX , PATIENT DATE OF BIRTH IS INCORRECT XO ;</td>
                                        <td colspan="1">Error Data:</td>
                                        <td colspan="4">ERRORS: CONTDOBX ; Sub Number , 1 ; BAD DATA: PatDOB , 9/12/1929 ;</td>
                                    </tr>
                                    <tr>
                                        <td colspan="1">Change Status:</td>
                                        <td colspan="2">
                                            <select>
                                                <option value="Assigned">Assigned</option>
                                                <option value="Business Approval">Business Approval</option>
                                                <option value="Closed">Closed</option>
                                            </select>
                                        </td>
                                        <td colspan="2"></td>
                                        <td colspan="1">
                                            <button class="btn btn-sm btn-primary btn-block" type="notifytp">Notify TP/Provider</button>
                                        </td>
                                        <td colspan="1">
                                            <button type="button" class="btn btn-primary btn-sm btn-block" data-toggle="modal" data-target="#myModal">Resubmit</button>
                                        </td>

                                    </tr>
                                </tbody>

                            </table>
                        </div>
                        <div style={{ width: '95%', height: '28px' }}>
                            <p>Line Item Codes</p>
                        </div>
                        <div class="table-responsive list-header">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Rev Code</th>
                                        <th>HCPCS Code</th>
                                        <th>Place of Service</th>
                                        <th>Units</th>
                                        <th>Date Of Service</th>
                                        <th> Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>0300</td>
                                        <td>HC 36415</td>
                                        <th>11</th>
                                        <th>1</th>
                                        <td>04-24-14</td>
                                        <td>$ 53.25</td>
                                    </tr>
                                    <tr>
                                        <td>0301</td>
                                        <td>HC 80053 </td>
                                        <th>11</th>
                                        <th>12</th>
                                        <td>04-24-14</td>
                                        <td>$ 24.00</td>
                                    </tr>
                                    <tr>
                                        <td>0305</td>
                                        <td>HC 85025 </td>
                                        <th>11</th>
                                        <th>1</th>
                                        <td>04-24-14</td>
                                        <td>$ 689.00</td>
                                    </tr>
                                    <tr>

                                        <td>0308</td>
                                        <td>HC 81001  </td>
                                        <th>11</th>
                                        <th>4</th>
                                        <td>04-24-14</td>
                                        <td>$ 128.00</td>
                                    </tr>
                                    <tr>
                                        <td>0311</td>
                                        <td>HC 99283 25  </td>
                                        <th>11</th>
                                        <th>6</th>
                                        <td>04-24-14</td>
                                        <td>$ 776.00</td>
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