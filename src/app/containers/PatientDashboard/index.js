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


export class PatientDashboard extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(){
        this.getData()
    }

    getData = () => {
        getDetails(){
            let identifier = this.state.patientId_id
            let query = `{
                MedicationList(PatientID: "${identifier}") {
                    PatientID
                    MedicationCodeDisplay
                    AuthoredOn
                    ReasonCodeDisplay
                    NoteTimeDatTime
                    Status
                }
                ObservationList (PatientID:"${identifier}") {
                    PatientID
                    ObservationCodeDisplay
                    EffectiveDate
                    Value
                    CategoryCodeDisplay
                    InterpretationCodeDisplay
                }
                FHIRClaimList(PatientID: "${identifier}") {
                    PatientID
                    ClaimID
                    ClaimDate
                    ClaimAmount
                    ICDCode
                    ServiceDate
                    ServiceLineCount
                }
                FHIREligibilityList (PatientID:"${identifier}") {
                    PatientID
                    InsuranceId
                    GroupNo
                    Coverage
                    Effective
                    Status
                    AllowedMoney
                }
            }`
    
            console.log(query);
            fetch('http://10.0.1.248:30514/FHIRpatients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ query: query })
            })
                .then(res => res.json())
                .then(res => {
                    if (res && res.data) {
                        this.setState({
                            medicationList: res.data.MedicationList,
                            observationList: res.data.ObservationList,
                            claimList : res.data.FHIRClaimList,
                            eligibilityList : res.data.FHIREligibilityList
                        })
    
                        console.log('Claim list ',res.data.FHIRClaimList)
                    }
                })
    
                .catch(err => {
                    console.log(err)
                })
        }
    }

    renderHL7 = () => {
        return(
            <img src={require('../../components/Images/hl7.png')} alt="logo" className="hl7_image_style" align="center" />
        )
    }

    render() {
        return (
            <div style={{height : $(window).height()}}>
                {this.renderHL7()}
            </div>
        )
    }
}