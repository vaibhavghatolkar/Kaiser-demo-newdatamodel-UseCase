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