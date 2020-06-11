import React from 'react'
import DatePicker from "react-datepicker";
import Urls from '../../../helpers/Urls';
// import './style.css'
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
const $ = window.$;
const initialState = {
    firstName: '',
    middleName: '',
    lastName: '',
    externalId: '',
    dob: '',
    gender: '',
    SS: '',
    licenceId: '',
    Marital_Status: '',
    email: '',
    Address: '',
    city: '',
    State: '',
    patientId: '',
    postal_Code: '',
    country: 'USA'
}


export class NewPatient extends React.Component {

    constructor(props) {
        super(props);
        this.state = initialState
        this.savePatient = this.savePatient.bind(this)
        this.handleStartChange = this.handleStartChange.bind(this)
    }

    PatientDetails() {
        return (
            <div className="container">
                <div className="row">
                    <div className="form-group col">
                        <label className="list-header1">Identifier</label>
                        <input type="text" className="form-control list-header1" value={this.state.patientId} onChange={(e) => this.onChangeName(e, 'patientId')} />
                    </div>
                    <div className="form-group col">
                        <label className="list-header1">First Name </label>
                        <input type="text" className="form-control list-header1" value={this.state.firstName} onChange={(e) => this.onChangeName(e, 'firstName')} />
                    </div>

                    <div className="form-group col">
                        <label className="list-header1">Middle Name </label>
                        <input type="text" className="form-control list-header1" value={this.state.middleName} onChange={(e) => this.onChangeName(e, 'middleName')} />
                    </div>

                    <div className="form-group col" style={{ marginRight: "27px" }}>
                        <label className="list-header1">Last Name </label>
                        <input type="text" className="form-control list-header1" value={this.state.lastName} onChange={(e) => this.onChangeName(e, 'lastName')} />
                    </div>

                </div>

                <div className="row">
                    <div className="form-group col">
                        <label className="list-header1">DOB </label>
                        <DatePicker
                            className="form-control list-header1"
                            selected={this.state.dob}
                            onChange={this.handleStartChange}
                        />
                    </div>

                    <div className="form-group col">
                        <label className="list-header1">Sex</label>
                        <select className="form-control list-header1" id="fao1" value={this.state.gender} onChange={(e) => this.ChangeVal(e, 'gender')}>
                            <option value="0">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    <div className="form-group col">
                        <label className="list-header1">External ID</label>
                        <input type="text" className="form-control list-header1" value={this.state.externalId} onChange={(e) => this.onChangeName(e, 'externalId')} />
                    </div>

                    <div className="form-group col" style={{ marginRight: "27px" }}>
                        <label className="list-header1">License/ID</label>
                        <input type="text" className="form-control list-header1" value={this.state.licenceId} onChange={(e) => this.onChangeName(e, 'licenceId')} />
                    </div>

                </div>

                <div className="row">
                    <div className="form-group col-sm-3">
                        <label className="list-header1">Marital Status</label>
                        <select className="form-control list-header1 textWidth" value={this.state.Marital_Status} id="fao1" onChange={(e) => this.ChangeVal(e, 'Marital_Status')}>
                            <option value="0">Select Marital Status</option>
                            <option value="Married">Married</option>
                            <option value="Single">Single</option>
                            <option value="Divorced">Divorced</option>
                            <option value="Widowed">Widowed</option>
                            <option value="Separated">Separated</option>
                            <option value="Domestic Partner">Domestic Partner</option>
                        </select>
                    </div>

                    <div className="form-group col-sm-3" style={{ marginLeft: '-5px' }}>
                        <label className="list-header1">Email</label>
                        <input type="Email" className="form-control list-header1 textWidth" value={this.state.email} onChange={(e) => this.onChangeName(e, 'email')} />
                    </div>

                </div>


            </div>
        )
    }

    contactDetails() {
        return (
            <div>
                <br />
                <h5 style={{ color: '#139DC9', fontSize: "20px", paddingLeft: '30px' }}>Contact Details</h5>
                <br/>
                <div className="container">
                    <div className="row">
                        <div className="form-group col">
                            <label className="list-header1">Address</label>
                            <input type="text" className="form-control list-header1" value={this.state.Address} onChange={(e) => this.onChangeName(e, 'Address')} />
                        </div>

                        <div className="form-group col">
                            <label className="list-header1">City</label>
                            <input type="text" className="form-control list-header1" value={this.state.city} onChange={(e) => this.onChangeName(e, 'city')} />
                        </div>

                        <div className="form-group col">
                            <label className="list-header1">State</label>
                            <select className="form-control list-header1" id="fao1" value={this.state.State} onChange={(e) => this.ChangeVal(e, 'State')}>
                                <option value="Select State">Select State</option>
                                <option value="California">California</option>
                                <option value="Michigan">Michigan</option>
                                <option value="Florida">Florida</option>
                                <option value="New York">New York</option>
                                <option value="Idaho">Idaho</option>
                                <option value="Ohio">Ohio</option>
                                <option value="Illinois">Illinois</option>
                                <option value="Texas">Texas</option>
                                <option value="Mississippi">Mississippi</option>
                                <option value="South Carolina">South Carolina</option>
                                <option value="New Mexico">New Mexico</option>
                                <option value="Puerto Rico">Puerto Rico</option>
                                <option value="Washington">Washington</option>
                                <option value="Utah">Utah</option>
                                <option value="Wisconsin">Wisconsin</option>
                            </select>
                        </div>

                        <div className="form-group col" style={{ marginRight: "27px" }}>
                            <label className="list-header1">Postal Code</label>
                            <input type="text" className="form-control list-header1" value={this.state.postal_Code} onChange={(e) => this.onChangeName(e, 'postal_Code')} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="form-group col-sm-3">
                            <label className="list-header1">Country</label>
                            <input type="text" className="form-control list-header1 textWidth" value="USA" disabled />
                        </div>
                    </div>
                    <div className="text-right">
                        <button className="btn btn-display">Cancel</button>
                        <button className="btn btn-display" onClick={this.savePatient}>Save</button>
                    </div>
                </div>
            </div>
        )

    }

    handleStartChange(date) {
        this.setState({
            dob: date,
        });
    }


    ChangeVal(event, key) {
        this.setState({
            [key]: event.target.options[event.target.selectedIndex].text,
        })
    }

    onChangeName(event, key) {
        this.setState({
            [key]: event.target.value
        });
    }

    savePatient() {
        let dateOfBirth = this.state.dob ? moment(this.state.dob).format('YYYY-MM-DD') : ''
        let query = `mutation {
        SP_SaveFHIRPatient(UserId: 0, Patient_Id: "${this.state.patientId}",
        FirstName: "${this.state.firstName}",
        LastName: "${this.state.lastName}",
        DOB: "${dateOfBirth}",
        Gender: "${this.state.gender}", 
        State: "${this.state.State}", 
        PostalCode: "${this.state.postal_Code}", 
        Address: "${this.state.Address}", 
        City: "${this.state.city}", 
        MiddleName: "${this.state.middleName}", 
        ExternalID: "${this.state.externalId}", 
        SS: "${this.state.SS}", 
        LicenseID: "${this.state.licenceId}", 
        MaritalStatus: "${this.state.Marital_Status}", 
        Email: "${this.state.email}", 
        Country: "USA")
      }`
      console.log(query)
        fetch('http://10.0.1.248:30514/graphQl', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                alert(res.data.SP_SaveFHIRPatient);
                this.setState(initialState);
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
    }

    render() {
        return (
            <div style={{height : $(window).height()}}><br />
                <h5 style={{ color: '#139DC9', fontSize: "20px", paddingLeft: '30px' }}>Patient Details</h5>
                <br/>
                {this.PatientDetails()}
                <br/>
                {this.contactDetails()}
            </div>
        )
    }
}