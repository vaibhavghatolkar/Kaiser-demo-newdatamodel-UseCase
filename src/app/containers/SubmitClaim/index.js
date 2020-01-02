import React from 'react';
import './style.css';
import Urls from '../../../helpers/Urls';

export class SubmitClaim extends React.Component {

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state = {
            files: [],
        };
    }

    onChange(e) {
        var files = e.target.files;
        console.log(files);
        var filesArr = Array.prototype.slice.call(files);
        console.log(filesArr);
        this.setState({ files: [...this.state.files, ...filesArr] });
    }

    displayFile() {
        this.setState({ files: this.state.files });
    }

    render() {
        return (
            <div>
                {
                    <div>
                        <div style={{borderBottom: "1.5px solid #139DC9"}}>
                            {/* <img src="/home/amol/hipaas/hipass-edival/client/src/app/components/Images/Search.png" style={{width:"14px", height:"14px"}} /> */}
                            {/* <input type="text" name="name" style={{padding:"10px", width:"100%" , border:"none" , lineHeight: "25px"}} placeholder="Search"/> */}
                        </div>
                        <div>
                        <br></br>
                            <h5 style={{ color: '#139DC9',fontsize: "20px" }}>Submit Claim</h5><br></br>
                        </div>
                        <div className="row">

                            <div className="form-group col-sm-3">
                                <label className="list-header">Select State</label>
                                <select className="form-control list-header" id="state">
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
                                <label className="list-header">Select Trading Partner</label>
                                <select className="form-control list-header" id="tradingPartner">
                                    <option value="">Select Trading Partner</option>
                                    <option selected="selected" value="1">Trading Partner 1</option>
                                    <option value="2">Trading Partner 2</option>
                                </select>
                            </div>
                            <div className="form-group col-sm-3">
                                <label className="list-header">Select Provider Name</label>
                                <select className="form-control list-header" id="providerName">
                                    <option value="">Select Provider Name</option>
                                    <option selected="selected" value="1">Provider Name 1</option>
                                    <option value="2">Provider Name 2</option>
                                </select>
                            </div>
                            <div className="form-group col-sm-3">
                                <button type="submit" className="btn light_blue">Submit Claim</button>
                            </div>
                        </div>


                        <div  style={{marginleft: "20px"}}>
                            <div className="panel-group">
                                <div className="panel panel-default">
                                    <div className="panel-heading collapsible" data-toggle="collapse" href="#SubmitterInfo">
                                        <span className="panel-title">
                                            Submitter Info
                                        </span>
                                    </div>
                                    <div id="SubmitterInfo" className="panel-collapse content collapse">
                                        <div className="panel-body">
                                            <div className="row">
                                                <div className="form-group col list-header">
                                                    <label>
                                                        Submitter Name
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>

                                                <div className="form-group col-sm-3 list-header" style={{ marginRight: "500px" }}>
                                                    <label>
                                                        Submitter Identifier
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="panel-heading collapsible" data-toggle="collapse" href="#RecieverInfo">
                                        <span className="panel-title">
                                            Reciever Info
                                        </span>
                                    </div>
                                    <div id="RecieverInfo" className="panel-collapse content collapse">
                                        <div className="panel-body">
                                            <div className="row">
                                                <div className="form-group col list-header">
                                                    <label>
                                                        Reciever Name
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>

                                                <div className="form-group col-sm-3 list-header" style={{ marginRight: "500px" }}>
                                                    <label>
                                                        Primary Identifier
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="panel-heading collapsible" data-toggle="collapse" href="#BillingProvider_Info">
                                        <span className="panel-title">
                                            Billing Provider Info
                                        </span>
                                    </div>
                                    <div id="BillingProvider_Info" className="panel-collapse content collapse">
                                        <div className="panel-body">
                                            <div className="row">
                                                <div className="form-group col list-header">
                                                    <label>
                                                        Name
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>

                                                <div className="form-group list-header col">
                                                    <label>
                                                        Address
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>

                                                <div className="form-group list-header col">
                                                    <label>
                                                        City
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>

                                                <div className="form-group list-header col" style={{ marginRight: '10px' }}>
                                                    <label>
                                                        State
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group list-header col-sm-3">
                                                    <label>
                                                        Zip
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>

                                                <div className="form-group list-header col-sm-3">
                                                    <label>
                                                        Tax Id
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="panel-heading collapsible" data-toggle="collapse" href="#PayToAddress_Info">
                                        <span className="panel-title">
                                            Pay To Address Info
                                        </span>
                                    </div>
                                    <div id="PayToAddress_Info" className="panel-collapse content collapse">
                                        <div className="panel-body">
                                            <div className="row">
                                                <div className="form-group col list-header">
                                                    <label>
                                                        Name
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>

                                                <div className="form-group list-header col">
                                                    <label>
                                                        Address
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>

                                                <div className="form-group list-header col">
                                                    <label>
                                                        City
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>

                                                <div className="form-group list-header col" style={{ marginRight: '10px' }}>
                                                    <label>
                                                        State
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group list-header col-sm-3">
                                                    <label>
                                                        Zip
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="panel-heading collapsible" data-toggle="collapse" href="#SubscriberInfo">
                                        <span className="panel-title">
                                            Subscriber Info
                                        </span>
                                    </div>
                                    <div id="SubscriberInfo" className="panel-collapse content collapse">
                                        <div className="panel-body">
                                            <div className="row">
                                                <div className="form-group col-sm-3 list-header">
                                                    <label>
                                                        First Name
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>

                                                <div className="form-group list-header col-sm-3">
                                                    <label>
                                                        Last Name
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>

                                                <div className="form-group list-header col-sm-3">
                                                    <label>
                                                        Subscriber Identifier
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="panel-heading collapsible" data-toggle="collapse" href="#PayerInfo">
                                        <span className="panel-title">
                                            Payer Info
                                        </span>
                                    </div>
                                    <div id="PayerInfo" className="panel-collapse content collapse">
                                        <div className="panel-body">
                                            <div className="row">
                                                <div className="form-group col-sm-3 list-header">
                                                    <label>
                                                        First Name
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>

                                                <div className="form-group list-header col-sm-3">
                                                    <label>
                                                        Payer Identifier
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="panel-heading collapsible" data-toggle="collapse" href="#PatientInfo">
                                        <span className="panel-title">
                                            Patient Info
                                        </span>
                                    </div>
                                    <div id="PatientInfo" className="panel-collapse content collapse">
                                        <div className="panel-body">
                                            <div className="row">
                                                <div className="form-group col list-header">
                                                    <label>
                                                        First Name
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>

                                                <div className="form-group list-header col">
                                                    <label>
                                                        Last Name
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>

                                                <div className="form-group list-header col">
                                                    <label>
                                                        DOB
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>

                                                <div className="form-group list-header col" style={{ marginRight: '10px' }}>
                                                    <label>
                                                        Gender
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group list-header col">
                                                    <label>
                                                        Address
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                                <div className="form-group list-header col">
                                                    <label>
                                                        City
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                                <div className="form-group list-header col">
                                                    <label>
                                                        State
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                                <div className="form-group list-header col" style={{ marginRight: '10px' }}>
                                                    <label>
                                                        Zip
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="panel-heading collapsible" data-toggle="collapse" href="#ClaimInfo">
                                        <span className="panel-title">
                                            Claim Info
                                        </span>
                                    </div>
                                    <div id="ClaimInfo" className="panel-collapse content collapse">
                                        <div className="panel-body">
                                            <div className="row">
                                                <div className="form-group col list-header">
                                                    <label>
                                                        Patient Control Number
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>

                                                <div className="form-group list-header col">
                                                    <label>
                                                        Total Charge Amount
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>

                                                <div className="form-group list-header col">
                                                    <label>
                                                        Facility Type Code
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>

                                                <div className="form-group list-header col" style={{ marginRight: '10px' }}>
                                                    <label>
                                                        Claim Frequency Code
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group list-header col-sm-3">
                                                    <label>
                                                        Assignment Status
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                                <div className="form-group list-header col-sm-3">
                                                    <label>
                                                        Benefit Assignement Indicator
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                                <div className="form-group list-header col-sm-3">
                                                    <label>
                                                        Release Information Code
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="panel-heading collapsible" data-toggle="collapse" href="#ServiceLine_Info">
                                        <span className="panel-title">
                                            Service Line Info
                                        </span>
                                    </div>
                                    <div id="ServiceLine_Info" className="panel-collapse content collapse">
                                        <div className="panel-body">
                                            <div className="row">
                                                <div className="form-group col list-header">
                                                    <label>
                                                        Identification Code
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>

                                                <div className="form-group list-header col">
                                                    <label>
                                                        Paid Amount
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>

                                                <div className="form-group list-header col">
                                                    <label>
                                                        Product Id Qualifier
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>

                                                <div className="form-group list-header col" style={{ marginRight: '10px' }}>
                                                    <label>
                                                        Qty
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group list-header col-sm-3">
                                                    <label>
                                                        Service Date
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="panel-heading collapsible" data-toggle="collapse" href="#ClaimServiceLevelInfo">
                                        <span className="panel-title">
                                            Claim Service Level Info
                                        </span>
                                    </div>
                                    <div id="ClaimServiceLevelInfo" className="panel-collapse content collapse">
                                        <div className="panel-body">
                                            <div className="row">
                                                <div className="form-group col list-header">
                                                    <label>
                                                        Adjustment Group Code
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>

                                                <div className="form-group list-header col">
                                                    <label>
                                                        Adjustment Reason Code
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>

                                                <div className="form-group list-header col">
                                                    <label>
                                                        Adjustment Amount
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>

                                                <div className="form-group list-header col" style={{ marginRight: '10px' }}>
                                                    <label>
                                                        Remittance Date
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="form-group list-header col-sm-3">
                                                    <label>
                                                        Amount Owed
                                                    </label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}