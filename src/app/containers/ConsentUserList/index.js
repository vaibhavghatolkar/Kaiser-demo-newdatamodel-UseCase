import React from 'react'
import { CommonTable } from '../../components/CommonTable';
import Strings from '../../../helpers/Strings';
import moment from 'moment';

const $ = window.$;
export class ConsentUserList extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            files_list : [],
            page: 1,
            count: 0,
        }
    }

    componentDidMount(){
        this.getData()
    }

    getData() {
        let query = `{
            NewPortalRegisterdUserList(page: `+this.state.page+`) {
              RecCount
              UserID
              PatientID
              FirstName
              LastName
              DOB
              Gender
              Verify
            }
        }`
        console.log(query)

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
                if (res.data && res.data.FHIRPatients && res.data.FHIRPatients.length > 0) {
                    let data = res.data.FHIRPatients
                    let count = Math.floor(data[0].RecCount / 10)
                    if (data[0].RecCount % 10 > 0) {
                        count = count + 1
                    }

                    this.setState({
                        files_list: data,
                        count : count 
                    })
                }
            })
            .catch(err => {
                console.log(err)
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
                // this.setState(initialState);
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
    }

    update = (patient) => {
        // this.setState({
        //     firstName : patient.firstName,
        //     lastName : patient.lastName,
        //     gender : patient.gender,
        //     State : patient.State,
        //     postal_Code : patient.postal_Code,
        //     Address : patient.Address,
        //     city : patient.city,
        //     middleName : patient.middleName,
        //     externalId : patient.externalId,
        //     SS : patient.SS,
        //     licenceId : patient.licenceId,
        //     Marital_Status : patient.Marital_Status,
        //     email : patient.email,
        //     dob: patient.dob
        // })
    }

    renderTransactionsNew(){
        const data = this.state.files_list ? this.state.files_list : []
        let headerArray = []
        let rowArray = []

        headerArray.push(
            {value : 'Identifier'},
            {value : 'First Name'},
            {value : 'Last Name'},
            {value : 'DOB', isDate: 1},
            {value : 'Gender'},
            {value : 'Verify'},
        )

        rowArray.push(
            { value : 'PatientID'},
            { value : 'FirstName'},
            { value : 'LastName'},
            { value : 'DOB',isDate : 1},
            { value : 'Gender'},
            { value : 'Verify', isClick: 1, onClick: this.update, key_argument : ''}
        )

        return(
            <CommonTable
                headerArray={headerArray}
                rowArray={rowArray}
                data={data}
                count={this.state.count}
                handlePageClick={this.handlePageClick}
                onClickKey={'UserID'}
                onClickSecondKey={'PatientID'}
                onClick={this.onClick}
                bigFont={true}
            />
        )
    }

    onClick = (value, secondValue) => {
        console.log('Sent', secondValue)
        // this.props.history.push('/' + Strings.PatientDetails, {
        this.props.history.push('/' + Strings.PatientDashboard, {
            patientId: value,
            patientId_id: secondValue,
        })
    }

    handlePageClick = (data) => {
        let page = data.selected + 1
        this.setState({
            page: page
        }, () => {
            this.getData()
        })
    }

    render() {
        return (
            <div className="container" style={{height : $(window).height()}}>
                <h5 className="headerText">User List</h5>
                {this.renderTransactionsNew()}
            </div>
        );
    }
}