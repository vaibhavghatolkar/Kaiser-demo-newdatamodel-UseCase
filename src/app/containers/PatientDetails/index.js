import React from 'react';
import './style.css';
import Urls from '../../../helpers/Urls'
import Strings from '../../../helpers/Strings';
import person from '../../assets/Images/person.svg';
import moment from 'moment';

export class PatientDetails extends React.Component {

    constructor(props) {
        super(props);
        console.log('these are the props received', this.props)
        this.state = {
            files: [],
            tradingpartner: [],
            Trading_Partner_Name: '',
            FunctionalAcknowledgmentOptions: '',
            Element_Delimiter: '',
            Doc_Envelope_Option: '',
            Segment_Termination_Character: '',
            Filter_Functional_Acknowledgments: false,
            Reject_Duplicate_ISA: false,
            Validate_Outbound_Interchanges: false,
            Outbound_Validation_Option: '',
            Authorization_Info_Qualifier: '',
            Authorization_Info_ID: '',
            Security_Information_Qualifier: '',
            Security_Information_Id: '',
            Interchange_ID_Qualifier: '',
            Interchange_ID: '',
            Interchange_Standard_ID: '',
            Interchange_Version: '',
            ISA14: false,
            Test_Indicator: '',
            Component_Separator: '',
            Application_Code: '',
            Responsible_Agency_Code: '',
            GSVersion: '',
            Communication_Type: '',
            Use_Default_Settings: false,
            Host: '',
            Port: '',
            UserName: '',
            Password: '',
            userrole: [],
            patientId: props && props.location && props.location.state ? props.location.state.patientId : '',
            patientId_id: props && props.location && props.location.state ? props.location.state.patientId_id : '',
            FirstName: '',
            LastName: '',
            DOB: '',
            Gender: '',
            State: '',
            PostalCode: '',
            Address: '',
            City: '',
            MiddleName: '',
            ExternalID: '',
            SS: '',
            LicenseID: '',
            MaritalStatus: '',
            medicationList: [],
            observationList: [],
            claimList: [],
            eligibilityList: [],
        };
        this.onChange = this.onChange.bind(this);
        this.getoptions = this.getoptions.bind(this)
        this.getData = this.getData.bind(this)
        this.ChangeTradingPartner = this.ChangeTradingPartner.bind(this)
        this.changeCheckbox = this.changeCheckbox.bind(this)
        this.Save = this.Save.bind(this)
        this.getDetails = this.getDetails.bind(this)
    }

    componentDidMount() {

        this.getData()
        this.getDetails()
        // this.ChangeTradingPartner()
        this.getpatientdetails()

    }
    getpatientdetails() {
        var patientId = this.state.patientId;

        let query1 = '{FHIRPatientDetails(UserID:' + patientId + `) {
            RecCount
            UserID
            PatientID
            FirstName
            LastName
            DOB
            Gender
            State
            PostalCode
            Address
            City
            MiddleName
            ExternalID
            SS
            LicenseID
            MaritalStatus
          }}`


        fetch('http://10.0.1.248:30514/FHIRpatients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query1 })
        })
            .then(res => res.json())
            .then(r => {
                console.log(";fksdlfjsjfs", r.data.FHIRPatientDetails[0].FirstName)
                this.setState({
                    FirstName: r.data.FHIRPatientDetails[0].FirstName,
                    LastName: r.data.FHIRPatientDetails[0].LastName,
                    DOB: r.data.FHIRPatientDetails[0].DOB,
                    Gender: r.data.FHIRPatientDetails[0].Gender,
                    State: r.data.FHIRPatientDetails[0].State,
                    PostalCode: r.data.FHIRPatientDetails[0].PostalCode,
                    Address: r.data.FHIRPatientDetails[0].Address,
                    City: r.data.FHIRPatientDetails[0].City,
                    MiddleName: r.data.FHIRPatientDetails[0].MiddleName,
                    ExternalID: r.data.FHIRPatientDetails[0].ExternalID,
                    SS: r.data.FHIRPatientDetails[0].SS,
                    LicenseID: r.data.FHIRPatientDetails[0].LicenseID,
                    MaritalStatus: r.data.FHIRPatientDetails[0].MaritalStatus
                })

            })
            .catch(err => {
                console.log(err)
            })

    }
    handleEntailmentRequest(e) {

        window.location.reload();

    }

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

    getData() {
        var patientId = this.state.patientId;
        let query = '{EncounterList(UserID:' + patientId + `){
                 
        Patient_Id
        UserId
        Visit_Category
        Facility
        Billing_Facility
        Sensitivity
        Date_of_Service
        Hosp_Date
        Consultation_Brief_Description
        Issues
        type_of_order
        type_of_laborder
        type_of_Radiology
        Genomics_Tests
        type_of_Pharmacy
        drug
        dosage
        quantity
        units_in_mg
        dialysis_test
        Cr_Date
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
                this.setState({
                    userrole: res.data.EncounterList
                })
            })

            .catch(err => {
                console.log(err)
            })
    }

    getoptions() {
        let row = []
        this.state.tradingpartner.forEach(element => {
            row.push(<option>{element.Trading_Partner_Name}</option>)
        })
        return row
    }
    ChangeTradingPartner(event) {
        if (!event) {
            return
        }

        this.setState({
            Change_Trading_Partner: event.target.options[event.target.selectedIndex].text,
            Trading_Partner_id: event.target.options[event.target.selectedIndex].value,
        })
        let query1 = '{Trading_Partner(TPName:"' + event.target.options[event.target.selectedIndex].text + `") {
            ID
            Trading_Partner_Name
            Identifier
            Functional_Ack_Options
            Doc_Envelope_Option
            Element_Delimiter
            Segment_Termination_Character
            Filter_Functional_Acknowledgments
            Reject_Duplicate_ISA
            Validate_Outbound_Interchanges
            Outbound_Validation_Option
            Authorization_Info_Qualifier
            Authorization_Info_ID
            Security_Information_Qualifier
            Security_Information_Id
            Interchange_ID_Qualifier
            Interchange_ID
            Interchange_Standard_ID
            Interchange_Version
            ISA14
            Test_Indicator
            Component_Separator
            X12
            Application_Code
            Responsible_Agency_Code
            GSVersion
            Communication_Type
            Use_Default_Settings
            Host
            Port
            UserName
            Password
            Directory
            Create_Directory
            File_Naming_Options
          }}`


        fetch('http://10.0.1.248:30514/tradingPartner', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query1 })
        })
            .then(res => res.json())
            .then(r => {
                console.log(";fksdlfjsjfs", r.data)
                this.setState({
                    Trading_Partner_id: r.data.Trading_Partner[0].ID,

                    FunctionalAcknowledgmentOptions: r.data.Trading_Partner[0].Functional_Ack_Options,
                    Doc_Envelope_Option: r.data.Trading_Partner[0].Doc_Envelope_Option,
                    Element_Delimiter: r.data.Trading_Partner[0].Element_Delimiter,
                    Segment_Termination_Character: r.data.Trading_Partner[0].Segment_Termination_Character,
                    Filter_Functional_Acknowledgments: r.data.Trading_Partner[0].Filter_Functional_Acknowledgments,
                    Reject_Duplicate_ISA: r.data.Trading_Partner[0].Reject_Duplicate_ISA,
                    Validate_Outbound_Interchanges: r.data.Trading_Partner[0].Validate_Outbound_Interchanges,
                    Outbound_Validation_Option: r.data.Trading_Partner[0].Outbound_Validation_Option,
                    Authorization_Info_Qualifier: r.data.Trading_Partner[0].Authorization_Info_Qualifier,
                    Authorization_Info_ID: r.data.Trading_Partner[0].Authorization_Info_ID,
                    Security_Information_Qualifier: r.data.Trading_Partner[0].Security_Information_Qualifier,
                    Security_Information_Id: r.data.Trading_Partner[0].Security_Information_Id,
                    Interchange_ID_Qualifier: r.data.Trading_Partner[0].Interchange_ID_Qualifier,
                    Interchange_ID: r.data.Trading_Partner[0].Interchange_ID,
                    Interchange_Standard_ID: r.data.Trading_Partner[0].Interchange_Standard_ID,
                    Interchange_Version: r.data.Trading_Partner[0].Interchange_Version,
                    ISA14: r.data.Trading_Partner[0].ISA14,
                    Test_Indicator: r.data.Trading_Partner[0].Test_Indicator,
                    Component_Separator: r.data.Trading_Partner[0].Component_Separator,
                    Application_Code: r.data.Trading_Partner[0].Application_Code,
                    Responsible_Agency_Code: r.data.Trading_Partner[0].Responsible_Agency_Code,
                    GSVersion: r.data.Trading_Partner[0].GSVersion,
                    Communication_Type: r.data.Trading_Partner[0].Communication_Type,
                    Use_Default_Settings: r.data.Trading_Partner[0].Use_Default_Settings,
                    Host: r.data.Trading_Partner[0].Host,
                    Port: r.data.Trading_Partner[0].Port,
                    UserName: r.data.Trading_Partner[0].UserName,
                    Password: r.data.Trading_Partner[0].Password,
                })

            })
            .catch(err => {
                console.log(err)
            })
        // console.log(event.target.options[event.target.selectedIndex].text)
    }

    onChange(e) {
        var files = e.target.files;
        console.log(files);
        var filesArr = Array.prototype.slice.call(files);
        console.log(filesArr);
        this.setState({ files: [...this.state.files, ...filesArr] });
    }

    // displayFile() {
    //     this.setState({selectValue:e.target.value});
    // }

    Save() {

        if (this.state.Trading_Partner_id == undefined) {
            this.state.Trading_Partner_id = 0
        }
        if (this.state.Change_Trading_Partner != undefined && this.state.Change_Trading_Partner != "") {
            var query = 'mutation{' +
                'SP_Trading_Partner_Save(ID : ' + this.state.Trading_Partner_id +
                'Trading_Partner_Name : "' + this.state.Change_Trading_Partner + '"' +
                'Identifier : "" ' +
                'Functional_Ack_Options : "' + this.state.FunctionalAcknowledgmentOptions + '"' +
                'Doc_Envelope_Option : "' + this.state.Doc_Envelope_Option + '"' +
                'Element_Delimiter : "' + this.state.Element_Delimiter + '"' +
                'Segment_Termination_Character : "' + this.state.Segment_Termination_Character + '"' +
                'Filter_Functional_Acknowledgments : ' + this.state.Filter_Functional_Acknowledgments + ' ' +
                'Reject_Duplicate_ISA : ' + this.state.Reject_Duplicate_ISA + ' ' +
                'Validate_Outbound_Interchanges : ' + this.state.Validate_Outbound_Interchanges + ' ' +
                'Outbound_Validation_Option : "' + this.state.Outbound_Validation_Option + '"' +
                'Authorization_Info_Qualifier : "' + this.state.Authorization_Info_Qualifier + '"' +
                'Authorization_Info_ID : "' + this.state.Authorization_Info_ID + '"' +
                'Security_Information_Qualifier : "' + this.state.Security_Information_Qualifier + '"' +
                'Security_Information_Id : "' + this.state.Security_Information_Id + '"' +
                'Interchange_ID_Qualifier : "' + this.state.Interchange_ID_Qualifier + '"' +
                'Interchange_ID : "' + this.state.Interchange_ID + '"' +
                'Interchange_Standard_ID : "' + this.state.Interchange_Standard_ID + '"' +
                'Interchange_Version : "' + this.state.Interchange_Version + '"' +
                'ISA14 : ' + this.state.ISA14 + ' ' +
                'Test_Indicator : "' + this.state.Test_Indicator + '"' +
                'Component_Separator : "' + this.state.Component_Separator + '"' +
                'X12 : "AAA"' +
                'Application_Code : "' + this.state.Application_Code + '"' +
                'Responsible_Agency_Code : "' + this.state.Responsible_Agency_Code + '"' +
                'GSVersion : "' + this.state.GSVersion + '"' +
                'Communication_Type : "' + this.state.Communication_Type + '"' +
                'Use_Default_Settings : ' + this.state.Use_Default_Settings + ' ' +
                'Host : "' + this.state.Host + '"' +
                'Port : "' + this.state.Port + '"' +
                'UserName : "' + this.state.UserName + '"' +
                'Password : "' + this.state.Password + '"' +
                'Directory : "" ' +
                'Create_Directory : false' + ' ' +
                'File_Naming_Options : "")' +

                '}'

            fetch('http://10.0.1.248:30514/graphQl', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    query
                })
            })
                .then(r => r.json())
                .then(data => alert(data.data.SP_Trading_Partner_Save))

            setTimeout(() => {
                window.location.reload()
            }, 1000)
        }
        else {
            alert("Please Enter the Trading Partner Name");
        }

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

    changeCheckbox(event, key) {
        console.log(event.target.checked)
        this.setState({
            [key]: event.target.checked
        })
    }

    formatDate(date) {

        return moment(Number(date)).format("MM/DD/YYYY");

    }
    RenderList() {
        let row = []
        const data = this.state.userrole;
        console.log(data)
        data.forEach((d) => {
            row.push(
                <tr>
                    <td>{d.Date_of_Service}</td>
                    <td>{d.Issues}</td>
                    <td>{d.type_of_order}</td>
                </tr>
            )
        });
        return (
            <table className="table table-bordered" id="userList" style={{ fontSize: "11px" }}>
                <tr>
                    <th>Date of Service</th>
                    <th>Issues</th>
                    <th>type of order</th>
                </tr>
                <tbody>
                    {row}
                </tbody>
            </table>
        );


    }

    showObservationTable(){
        let data = this.state.observationList
        let row = []
        data.forEach(element => {
            row.push(
                <tr>
                    <td>{element.ObservationCodeDisplay}</td>
                    <td>{element.EffectiveDate}</td>
                    <td>{element.Value}</td>
                    <td>{element.CategoryCodeDisplay}</td>
                    <td>{element.InterpretationCodeDisplay}</td>
                </tr>
            )
        })

        return(
            <table class="table table-striped border">
                <thead>
                    <tr>
                        <th  className="color-style" scope="col">Observation Code Display</th>
                        <th  className="color-style" scope="col">Effective Date(s)</th>
                        <th  className="color-style" scope="col">Value</th>
                        <th  className="color-style" scope="col">Category Code Display</th>
                        <th  className="color-style" scope="col">Interpretation Code Display</th>
                    </tr>
                </thead>
                <tbody>
                    {row}
                </tbody>
            </table>
        )
    }

    showConditionTable() {
        return (
            <table class="table table-striped border">
                <thead>
                    <tr>
                        <th  className="color-style" scope="col">Condition Code Display</th>
                        <th  className="color-style" scope="col">Onset</th>
                        <th  className="color-style" scope="col">Asserted Date Time</th>
                        <th  className="color-style" scope="col">Category Code Display</th>
                        <th  className="color-style" scope="col">Severity Code Display</th>
                        <th  className="color-style" scope="col">Note Time DateTime</th>
                        <th  className="color-style" scope="col">Verification Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Thiopurine methyltransferase deficiency</td>
                        <td>2009-07-18 11:30</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>2017-12-26 23:22</td>
                        <td>confirmed</td>
                    </tr>
                    <tr>
                        <td>Needs influenza immunization</td>
                        <td>2008-08-08 11:30</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>2017-12-26 23:22</td>
                        <td>confirmed</td>
                    </tr><tr>
                        <td>Dementia associated with another disease</td>
                        <td>2008-08-08 11:30</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>confirmed</td>
                    </tr>
                </tbody>
            </table>
        )
    }

    showMedicationTable() {
        let data = this.state.medicationList
        let row = []
        data.forEach(element => {
            row.push(
                <tr>
                    <td>{element.MedicationCodeDisplay}</td>
                    <td>{element.AuthoredOn}</td>
                    <td>{element.ReasonCodeDisplay}</td>
                    <td>{element.NoteTimeDatTime}</td>
                    <td>{element.Status}</td>
                </tr>
            )
        })

        return (
            <table class="table table-striped border">
                <thead>
                    <tr>
                        <th  className="color-style" scope="col">Medication Code Display</th>
                        <th  className="color-style" scope="col">Authored On</th>
                        <th  className="color-style" scope="col">Reason Code Display</th>
                        <th  className="color-style" scope="col">Note Time DateTime</th>
                        <th  className="color-style" scope="col">Status</th>
                    </tr>
                </thead>

                <tbody>
                    {row}
                </tbody>
            </table>
        )
    }

    showMedicationDispenseTable() {
        return (
            <table class="table table-striped border">
                <thead>
                    <tr>
                        <th  className="color-style" scope="col">Medication Code Display</th>
                        <th  className="color-style" scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>potassium citrate 10 MEQ Extended Release Tablet</td>
                        <td>completed</td>
                    </tr>
                    <tr>
                        <td>Hydrochlorothiazide 50 MG Oral Tablet</td>
                        <td>completed</td>
                    </tr>
                    <tr>
                        <td>donepezil 10 MG Oral Tablet [Aricept]</td>
                        <td>completed</td>
                    </tr>
                </tbody>
            </table>
        )
    }
    showMedicationStatementTable() {
        return (
            <table class="table table-striped border">
                <thead>
                    <tr>
                        <th  className="color-style" scope="col">Medication Code Display</th>
                        <th  className="color-style" scope="col">Effective</th>
                        <th  className="color-style" scope="col">Taken</th>
                        <th  className="color-style" scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>potassium citrate 10 MEQ Extended Release Tablet</td>
                        <td></td>
                        <td>Y</td>
                        <td>Active</td>
                    </tr>
                    <tr>
                        <td>Hydrochlorothiazide 50 MG Oral Tablet</td>
                        <td></td>
                        <td>Y</td>
                        <td>Active</td>
                    </tr>
                </tbody>
            </table>
        )
    }

    showEncounterTable() {
        return (
            <table class="table table-striped border">
                <thead>
                    <tr>
                        <th  className="color-style" scope="col">Class Code</th>
                        <th  className="color-style" scope="col">Period Start DateTime</th>
                        <th  className="color-style" scope="col">Period End DateTime</th>
                        <th  className="color-style" scope="col">Reason Code Display</th>
                        <th  className="color-style" scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>AMB</td>
                        <td>2009-12-01 12:30</td>
                        <td>2009-12-01 12:30</td>
                        <td></td>
                        <td>finished</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>2009-12-12 12:30</td>
                        <td>2009-12-12 12:30</td>
                        <td></td>
                        <td>planned</td>
                    </tr><tr>
                        <td>AMB</td>
                        <td>2009-12-03 12:30</td>
                        <td>2009-12-03 12:30</td>
                        <td></td>
                        <td>finished</td>
                    </tr>
                </tbody>
            </table>
        )
    }

    showReferralRequestTable() {

        return (
            <table class="table table-striped border">
                <thead>
                    <tr>
                        <th  className="color-style" scope="col">Type Code</th>
                        <th  className="color-style" scope="col">Authored On</th>
                        <th  className="color-style" scope="col">Reason Code Display</th>
                        <th  className="color-style" scope="col">Intent</th>
                        <th  className="color-style" scope="col">Status</th>
                        <th  className="color-style" scope="col">Category</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>ret4421</td>
                        <td>2020-02-14</td>
                        <td>For consideration of Grommets</td>
                        <td>Original-order</td>
                        <td>Active</td>
                        <td>Patient referral to specialist</td>
                    </tr>
                </tbody>
            </table>
        )
    }

    showAllergyIntoleranceTable() {
        return (
            <table class="table table-striped border">
                <thead>
                    <tr>
                        <th  className="color-style" scope="col">Allergy/Intolerance Code Display</th>
                        <th  className="color-style" scope="col">Note Time Date Time</th>
                        <th  className="color-style" scope="col">Onset</th>
                        <th  className="color-style" scope="col">Asserted Date</th>
                        <th  className="color-style" scope="col">Criticality </th>
                        <th  className="color-style" scope="col">Category</th>
                        <th  className="color-style" scope="col">ClinicalStatus</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Allergy to bee venom</td>
                        <td></td>
                        <td></td>
                        <td>1974-01-16 00:20</td>
                        <td>low</td>
                        <td>["food"]</td>
                        <td>active</td>
                    </tr>
                    <tr>
                        <td>House dust mite allergy</td>
                        <td></td>
                        <td></td>
                        <td>1974-01-16 00:20</td>
                        <td>high</td>
                        <td>["food"]</td>
                        <td>active</td>
                    </tr>
                    <tr>
                        <td>Allergy to grass pollen</td>
                        <td></td>
                        <td></td>
                        <td>1974-01-16 00:20</td>
                        <td>high</td>
                        <td>["food"]"]</td>
                        <td>active</td>
                    </tr>
                </tbody>
            </table>
        )
    }

    showProcedureTable() {
        return (
            <table class="table table-striped border">
                <thead>
                    <tr>
                        <th  className="color-style" scope="col">Procedure Code Display</th>
                        <th  className="color-style" scope="col">Category Code Display</th>
                        <th  className="color-style" scope="col">Reason Code Code Display</th>
                        <th  className="color-style" scope="col">Notes Time DateTime</th>
                        <th  className="color-style" scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Documentation of current medications</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>completed</td>
                    </tr>
                </tbody>
            </table>
        )
    }

    showProcedureRequestTable() {
        return (
            <table class="table table-striped border">
                <thead>
                    <tr>
                        <th  className="color-style" scope="col">Procedure Request Code Display</th>
                        <th  className="color-style" scope="col">Occurrence Date Time</th>
                        <th  className="color-style" scope="col">Note Time DateTime</th>
                        <th  className="color-style" scope="col">Priority</th>
                        <th  className="color-style" scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    
                </tbody>
            </table>
        )
    }

    Immunization() {



        return (
            <table class="table table-striped border">
                <thead>
                    <tr>
                        <th  className="color-style" scope="col">Vaccine Code Code Display</th>
                        <th  className="color-style" scope="col">DateTime</th>
                        <th  className="color-style" scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Influenza, seasonal, injectable, preservative free</td>
                        <td>2017-06-20 02:53</td>
                        <td>completed</td>
                    </tr>
                    <tr>
                        <td>HPV, quadrivalent</td>
                        <td>2017-06-20 02:53</td>
                        <td>completed</td>
                    </tr>
                    <tr>
                        <td>MMR</td>
                        <td>2010-08-03 16:15</td>
                        <td>completed</td>
                    </tr>
                </tbody>
            </table>
        )
    }

    showDiagnosticReportTable() {
        return (
            <table class="table table-striped border">
                <thead>
                    <tr>
                        <th  className="color-style" scope="col">Diagnostic Report Code Display</th>
                        <th  className="color-style" scope="col">Category Code Display</th>
                        <th  className="color-style" scope="col">Effective Date</th>
                        <th  className="color-style" scope="col">Diagnosis Code Display</th>
                        <th  className="color-style" scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Basic Metabolic Panel</td>
                        <td></td>
                        <td>2017-03-15 13:39</td>
                        <td></td>
                        <td>final</td>
                    </tr>
                    <tr>
                        <td>Lipid Panel</td>
                        <td></td>
                        <td>2014-06-14 22:51</td>
                        <td></td>
                        <td>final</td>
                    </tr>
                </tbody>
            </table>
        )
    }


    CareTeam() {
        return (
            <table class="table table-striped border">
                <thead>
                    <tr>
                        <th  className="color-style" scope="col">Category Code Display</th>
                        <th  className="color-style" scope="col">Period Start DateTime</th>
                        <th  className="color-style" scope="col">Period End DateTime	</th>
                        <th  className="color-style" scope="col">Desc</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Self-Care</td>
                        <td></td>
                        <td>2017-12-21 03:31</td>
                        <td>2017-12-21 03:31</td>
                    </tr>
                </tbody>
            </table>
        )
    }


    CarePlan() {
        return (
            <table class="table table-striped border">
                <thead>
                    <tr>
                        <th  className="color-style" scope="col">Name</th>
                        <th  className="color-style" scope="col">Category Code Display</th>
                        <th  className="color-style" scope="col">Period Start DateTime</th>
                        <th  className="color-style" scope="col">Period End DateTime</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Respiratory therapy</td>
                        <td>2010-11-09</td>
                        <td>2011-11-05</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Asthma self management</td>
                        <td>1976-08-14</td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        )
    }


    Goal() {
        return (
            <table class="table table-striped border">
                <thead>
                    <tr>
                        <th  className="color-style" scope="col">Category Code Display	</th>
                        <th  className="color-style" scope="col">Status Date	</th>
                        <th  className="color-style" scope="col">Description Code Display	</th>
                        <th  className="color-style" scope="col">Start	</th>
                        <th  className="color-style" scope="col">Target Due Date	</th>
                        <th  className="color-style" scope="col">Note Time DateTime</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td>2017-12-22</td>
                        <td></td>
                        <td>2017-12-22 12:30</td>
                        <td>2017-12-22</td>
                        <td>2017-12-23 01:07</td>
                    </tr>
                </tbody>
            </table>
        )
    }


    DetectedIssue() {
        return (
            <table class="table table-striped border">
                <thead>
                    <tr>
                        <th  className="color-style" scope="col">Status Date	</th>
                        <th  className="color-style" scope="col">Status	</th>
                        <th  className="color-style" scope="col">Severity	</th>
                        <th  className="color-style" scope="col">Details	</th>
                        <th  className="color-style" scope="col">Category Code Display	</th>
                        <th  className="color-style" scope="col">Mitigation Action Code Display</th>
                    </tr>
                </thead>
                <tbody>
                    
                </tbody>
            </table>
        )
    }


    Eligibilty() {
        let data = this.state.eligibilityList
        let row = []
        data.forEach(element => {
            row.push(
                <tr>
                    <td>{element.InsuranceId}</td>
                    <td>{element.Coverage}</td>
                    <td>{element.Effective}</td>
                    <td>{element.AllowedMoney}</td>
                    <td>{element.Status}</td>
                </tr>
            )
        })
        return (
            <table class="table table-striped border">
                <thead>
                    <tr>
                        <th  className="color-style" scope="col">Insurance Id</th>
                        <th  className="color-style" scope="col">Coverage</th>
                        <th  className="color-style" scope="col">Effective From</th>
                        <th  className="color-style" scope="col">Allowed Money</th>
                        <th  className="color-style" scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {row}
                </tbody>
            </table>
        )
    }

    Claim() {
        let data = this.state.claimList
        let row = []
        data.forEach(element => {
            row.push(
                <tr>
                    <td>{element.ClaimID}</td>
                    <td>{element.ClaimDate}</td>
                    <td>{element.ServiceDate}</td>
                    <td>{element.ClaimAmount}</td>
                    <td>{element.ICDCode}</td>
                    <td>{element.ServiceLineCount}</td>
                </tr>
            )
        })
        return (
            <table class="table table-striped border">
                <thead>
                    <tr>
                        <th  className="color-style" scope="col">Claim Id</th>
                        <th  className="color-style" scope="col">Claim Date</th>
                        <th  className="color-style" scope="col">Service Date</th>
                        <th  className="color-style" scope="col">Amount</th>
                        <th  className="color-style" scope="col">Diagnosis Code</th>
                        <th  className="color-style" scope="col">Service Line Count</th>

                    </tr>
                </thead>
                <tbody>
                    {row}
                </tbody>
            </table>
        )
    }


    FamilyMemberHistory() {
        return (
            <table class="table table-striped border">
                <thead>
                    <tr>
                        <th  className="color-style" scope="col">Date	</th>
                        <th  className="color-style" scope="col">Name	</th>
                        <th  className="color-style" scope="col">Relationship Code Display</th>
                    </tr>
                </thead>
                <tbody>
                    
                </tbody>
            </table>
        )
    }


    DocumentReference() {
        return (
            <table class="table table-striped border">
                <thead>
                    <tr>
                        <th  className="color-style" scope="col">Type Code Display	</th>
                        <th  className="color-style" scope="col">Class Code Display	</th>
                        <th  className="color-style" scope="col">Status	</th>
                        <th  className="color-style" scope="col">DocStatus Code Display	</th>
                        <th  className="color-style" scope="col">Security Label Code Display</th>
                    </tr>
                </thead>
                <tbody>
                    
                </tbody>
            </table>
        )
    }


    render() {
        return (

            <div>
                <div>

                    <div style={{ color: "#4290F0" }}>
                        <br></br>
                        <img src={person} style={{ fontWeight: "500", marginTop: "10px", marginBottom: "5px", fontSize: '20px' }} alt="" width="40" height="40" title="person" />
                        <label style={{ color: "#139dc9", fontWeight: "500", fontSize: '20px' }}> {this.state.FirstName} {this.state.LastName}
                        </label>

                        <label style={{ color: "grey", marginLeft: "20px", fontWeight: "400", fontSize: '15px' }}>  Dob : {this.formatDate(this.state.DOB)}
                        </label>

                        <label style={{ color: "grey", marginLeft: "20px", fontWeight: "400", fontSize: '15px' }}>  Gender : {this.state.Gender}
                        </label>

                        <label style={{ color: "grey", marginLeft: "20px", fontWeight: "400", fontSize: '15px' }}>  Identifier : {this.state.patientId_id}
                        </label>
                        <hr></hr>
                    </div>



                    <div className="container">
                        <div className="panel-group" >
                            <div className="panel">


                                <div className="panel-heading  collapsableNew" data-toggle="collapse" href="#ISAIdentificationOptions">
                                    <span class="panel-title" data-toggle="collapse" data-parent="#accordion" href="#ISAIdentificationOptions" aria-controls="collapseOne">

                                        Observation +
                                      </span>

                                </div>

                                <div id="ISAIdentificationOptions" className="panel-collapse content collapse">
                                    <div className="panel-body">
                                        {this.showObservationTable()}
                                    </div>
                                </div>
                                <div className="panel-heading  collapsableNew" data-toggle="collapse" href="#ConditionOptions">
                                    <span class="panel-title" data-toggle="collapse" data-parent="#accordion" href="#ConditionOptions" aria-controls="collapseOne">Condition +</span>
                                </div>
                                <div id="ConditionOptions" className="panel-collapse content collapse">
                                    <div className="panel-body">
                                        {this.showConditionTable(this.state.conditionArray)}
                                    </div>
                                </div>


                                <div className="panel-heading  collapsableNew" data-toggle="collapse" href="#Encounter">
                                    <span class="panel-title" data-toggle="collapse" data-parent="#accordion" href="#Encounter" aria-controls="collapseOne">
                                        Encounter +
                                      </span>
                                </div>
                                <div id="Encounter" className="panel-collapse content collapse">
                                    <div className="panel-body">
                                        {this.showEncounterTable(this.state.conditionArray)}
                                    </div>
                                </div>



                                <div id="Messages" className="panel-collapse content collapse">
                                    <div className="panel-body">
                                        <br />
                                        <div style={{ marginLeft: "50px", fontWeight: "bold" }}>
                                            There are no notes on file for patient. To add notes, please click here.
                                             </div> </div>
                                </div>


                                <div className="panel-heading  collapsableNew" data-toggle="collapse" href="#MedicationRequest">
                                    <span class="panel-title" data-toggle="collapse" data-parent="#accordion" href="#MedicationRequest" aria-controls="collapseOne">
                                        MedicationRequest +
                                    </span>
                                </div>
                                <div id="MedicationRequest" className="panel-collapse content collapse">
                                    <div className="panel-body">
                                        {this.showMedicationTable()}
                                    </div>
                                </div>


                                <div id="Patient_Reminders" className="panel-collapse content collapse">
                                    <div className="panel-body">
                                        <br />
                                        <div style={{ marginLeft: "50px", fontWeight: "bold" }}>
                                            No active patient reminders.
                                             </div> </div>
                                </div>

                                <div className="panel-heading  collapsableNew" data-toggle="collapse" href="#MedicationDispense">
                                    <span class="panel-title" data-toggle="collapse" data-parent="#accordion" href="#MedicationDispense" aria-controls="collapseOne">
                                        MedicationDispense +
                                      </span>
                                </div>

                                <div id="MedicationDispense" className="panel-collapse content collapse">
                                    <div className="panel-body">
                                        {this.showMedicationDispenseTable()}
                                    </div>
                                </div>

                                <div id="Disclosures" className="panel-collapse content collapse">
                                    <div className="panel-body">

                                    </div>
                                </div>


                                <div className="panel-heading  collapsableNew" data-toggle="collapse" href="#MedicationStatement">
                                    <span class="panel-title" data-toggle="collapse" data-parent="#accordion" href="#MedicationStatement" aria-controls="collapseOne">
                                        MedicationStatement +
                                      </span>
                                </div>

                                <div id="MedicationStatement" className="panel-collapse content collapse">
                                    <div className="panel-body">
                                        {this.showMedicationStatementTable()}
                                    </div>
                                </div>

                                <div id="Amendments" className="panel-collapse content collapse">
                                    <div className="panel-body">
                                        <br />
                                        <div style={{ marginLeft: "50px", fontWeight: "bold" }}>
                                            No data.
                                             </div>
                                    </div>
                                </div>


                                <div className="panel-heading  collapsableNew" data-toggle="collapse" href="#ReferralRequest">
                                    <span class="panel-title" data-toggle="collapse" data-parent="#accordion" href="#ReferralRequest" aria-controls="collapseOne">
                                        ServiceRequest +
                                      </span>
                                </div>
                                <div id="ReferralRequest" className="panel-collapse content collapse">
                                    <div className="panel-body">
                                        {this.showReferralRequestTable(this.state.conditionArray)}
                                    </div>
                                </div>


                                <div id="Labs" className="panel-collapse content collapse">
                                    <div className="panel-body">
                                        <br />
                                        <div style={{ marginLeft: "50px", fontWeight: "bold" }}>
                                            No data.
                                             </div>
                                    </div>
                                </div>


                                <div className="panel-heading  collapsableNew" data-toggle="collapse" href="#AllergyIntolerance">
                                    <span class="panel-title" data-toggle="collapse" data-parent="#accordion" href="#AllergyIntolerance" aria-controls="collapseOne">
                                        AllergyIntolerance +
                                    </span>
                                </div>
                                <div id="AllergyIntolerance" className="panel-collapse content collapse">
                                    <div className="panel-body">
                                        {this.showAllergyIntoleranceTable(this.state.conditionArray)}
                                    </div>
                                </div>


                                <div id="Vitals" className="panel-collapse content collapse">
                                    <div className="panel-body">
                                        <br />
                                        <div style={{ marginLeft: "50px", fontWeight: "bold" }}>
                                            No data.
                                        </div>
                                    </div>
                                </div>


                                <div className="panel-heading  collapsableNew" data-toggle="collapse" href="#Procedure">
                                    <span class="panel-title" data-toggle="collapse" data-parent="#accordion" href="#Procedure" aria-controls="collapseOne">
                                        Procedure +
                                    </span>
                                </div>
                                <div id="Procedure" className="panel-collapse content collapse">
                                    <div className="panel-body">
                                        {this.showProcedureTable(this.state.conditionArray)}
                                    </div>
                                </div>


                                <div id="ClinicalReminders" className="panel-collapse content collapse">
                                    <div className="panel-body">
                                        <br />
                                    </div>
                                </div>



                                <div className="panel-heading  collapsableNew" data-toggle="collapse" href="#ProcedureRequest">
                                    <span class="panel-title" data-toggle="collapse" data-parent="#accordion" href="#ProcedureRequest" aria-controls="collapseOne">
                                        ProcedureRequest +
                                      </span>
                                </div>
                                <div id="ProcedureRequest" className="panel-collapse content collapse">
                                    <div className="panel-body">
                                        {this.showProcedureRequestTable(this.state.conditionArray)}
                                    </div>
                                </div>



                                <div id="Appointments_Details" className="panel-collapse content collapse">
                                    <div className="panel-body">
                                        <br />

                                        <div class="tab-content" id="nav-tabContent">
                                            <div class="tab-pane fade show active" id="nav-Appointments" role="tabpanel" aria-labelledby="nav-Appointments-tab">
                                                <div style={{ marginLeft: "50px", fontWeight: "bold" }}>

                                                    No records found

                                                    </div>
                                            </div>
                                            <div class="tab-pane fade" id="nav-Recurrent_Appointments" role="tabpanel" aria-labelledby="nav-Recurrent_Appointments-tab">
                                                <div style={{ marginLeft: "50px", fontWeight: "bold" }}>
                                                    No records found
                                                    </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>



                                <div className="panel-heading  collapsableNew" data-toggle="collapse" href="#DiagnosticReport">
                                    <span class="panel-title" data-toggle="collapse" data-parent="#accordion" href="#DiagnosticReport" aria-controls="collapseOne">
                                        DiagnosticReport +
                                      </span>
                                </div>


                                <div id="Medical_History" className="panel-collapse content collapse">
                                    <div className="panel-body">
                                        <br />

                                    </div>
                                </div>
                                <div id="DiagnosticReport" className="panel-collapse content collapse">
                                    <div className="panel-body">
                                        {this.showDiagnosticReportTable(this.state.conditionArray)}
                                    </div>
                                </div>

                                <div className="panel-heading  collapsableNew" data-toggle="collapse" href="#Immunization">
                                    <span class="panel-title" data-toggle="collapse" data-parent="#accordion" href="#Immunization" aria-controls="collapseOne">

                                        Immunization +
                                      </span>

                                </div>
                                <div id="Immunization" className="panel-collapse content collapse">
                                    <div className="panel-body">
                                        {this.Immunization(this.state.conditionArray)}
                                    </div>
                                </div>

                                <div id="Patient_Encounter" className="panel-collapse content collapse">
                                    <div className="panel-body">

                                    </div>
                                </div>



                                <div className="panel-heading  collapsableNew" data-toggle="collapse" href="#CarePlan">
                                    <span class="panel-title" data-toggle="collapse" data-parent="#accordion" href="#CarePlan" aria-controls="collapseOne">

                                        CarePlan +
                                  </span>

                                </div>
                                <div id="CarePlan" className="panel-collapse content collapse">
                                    <div className="panel-body">
                                        {this.CarePlan(this.state.conditionArray)}
                                    </div>
                                </div>

                                <div id="Referral" className="panel-collapse content collapse">
                                    <div className="panel-body">
                                        <button style={{ marginLeft: "10px", backgroundColor: "#4290F0", color: "white" }}>Add New Referral</button>
                                        <br />

                                        <div style={{ marginLeft: "50px", fontWeight: "bold" }}>
                                            No data.
                                             </div>
                                    </div>
                                </div>

                                <div className="panel-heading  collapsableNew" data-toggle="collapse" href="#CareTeam">
                                    <span class="panel-title" data-toggle="collapse" data-parent="#accordion" href="#CareTeam" aria-controls="collapseOne">

                                        CareTeam +
                                  </span>

                                </div>
                                <div id="CareTeam" className="panel-collapse content collapse">
                                    <div className="panel-body">
                                        {this.CareTeam(this.state.conditionArray)}
                                    </div>
                                </div>


                                <div id="Referral" className="panel-collapse content collapse">
                                    <div className="panel-body">
                                        <button style={{ marginLeft: "10px", backgroundColor: "#4290F0", color: "white" }}>Add New Referral</button>
                                        <br />

                                        <div style={{ marginLeft: "50px", fontWeight: "bold" }}>
                                            No data.
                                         </div>
                                    </div>
                                </div>

                                <div className="panel-heading  collapsableNew" data-toggle="collapse" href="#Goal">
                                    <span class="panel-title" data-toggle="collapse" data-parent="#accordion" href="#Goal" aria-controls="collapseOne">

                                        Goal +
                                  </span>

                                </div>
                                <div id="Goal" className="panel-collapse content collapse">
                                    <div className="panel-body">
                                        {this.Goal(this.state.conditionArray)}
                                    </div>
                                </div>

                                <div id="Referral" className="panel-collapse content collapse">
                                    <div className="panel-body">
                                        <button style={{ marginLeft: "10px", backgroundColor: "#4290F0", color: "white" }}>Add New Referral</button>
                                        <br />

                                        <div style={{ marginLeft: "50px", fontWeight: "bold" }}>
                                            No data.
                                         </div>
                                    </div>
                                </div>


                                <div className="panel-heading  collapsableNew" data-toggle="collapse" href="#DetectedIssue">
                                    <span class="panel-title" data-toggle="collapse" data-parent="#accordion" href="#DetectedIssue" aria-controls="collapseOne">

                                        DetectedIssue +
                                  </span>

                                </div>
                                <div id="DetectedIssue" className="panel-collapse content collapse">
                                    <div className="panel-body">
                                        {this.DetectedIssue(this.state.conditionArray)}
                                    </div>
                                </div>

                                <div id="Referral" className="panel-collapse content collapse">
                                    <div className="panel-body">
                                        <button style={{ marginLeft: "10px", backgroundColor: "#4290F0", color: "white" }}>Add New Referral</button>
                                        <br />

                                        <div style={{ marginLeft: "50px", fontWeight: "bold" }}>
                                            No data.
                                         </div>
                                    </div>
                                </div>


                                <div className="panel-heading  collapsableNew" data-toggle="collapse" href="#Eligibilty">
                                    <span class="panel-title" data-toggle="collapse" data-parent="#accordion" href="#Eligibilty" aria-controls="collapseOne">

                                        Eligibilty +
                                  </span>

                                </div>
                                <div id="Eligibilty" className="panel-collapse content collapse">
                                    <div className="panel-body">
                                        {this.Eligibilty(this.state.conditionArray)}
                                    </div>
                                </div>

                                <div className="panel-heading  collapsableNew" data-toggle="collapse" href="#Claim_History">
                                    <span class="panel-title" data-toggle="collapse" data-parent="#accordion" href="#Claim_History" aria-controls="collapseOne">

                                        Claim +
                                  </span>

                                </div>

                                <div id="Claim_History" className="panel-collapse content collapse">
                                    <div className="panel-body">

                                        {this.Claim()}


                                    </div>
                                </div>



                                <div className="panel-heading  collapsableNew" data-toggle="collapse" href="#FamilyMemberHistory">
                                    <span class="panel-title" data-toggle="collapse" data-parent="#accordion" href="#FamilyMemberHistory" aria-controls="collapseOne">

                                        FamilyMemberHistory +
                                  </span>

                                </div>
                                <div id="FamilyMemberHistory" className="panel-collapse content collapse">
                                    <div className="panel-body">
                                        {this.FamilyMemberHistory(this.state.conditionArray)}
                                    </div>
                                </div>



                                <div id="Referral" className="panel-collapse content collapse">
                                    <div className="panel-body">
                                        <button style={{ marginLeft: "10px", backgroundColor: "#4290F0", color: "white" }}>Add New Referral</button>
                                        <br />

                                        <div style={{ marginLeft: "50px", fontWeight: "bold" }}>
                                            No data.
                                         </div>
                                    </div>
                                </div>

                                <div className="panel-heading  collapsableNew" data-toggle="collapse" href="#DocumentReference">
                                    <span class="panel-title" data-toggle="collapse" data-parent="#accordion" href="#DocumentReference" aria-controls="collapseOne">

                                        DocumentReference +
                                      </span>

                                </div>
                                <div id="DocumentReference" className="panel-collapse content collapse">
                                    <div className="panel-body">
                                        {this.DocumentReference(this.state.conditionArray)}
                                    </div>
                                </div>


                                <div id="Referral" className="panel-collapse content collapse">
                                    <div className="panel-body">
                                        <button style={{ marginLeft: "10px", backgroundColor: "#4290F0", color: "white" }}>Add New Referral</button>
                                        <br />

                                        <div style={{ marginLeft: "50px", fontWeight: "bold" }}>
                                            No data.
                                         </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>

        );
    }
}