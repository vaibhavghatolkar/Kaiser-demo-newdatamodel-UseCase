import React from 'react'
import './styles.css';
import { CommonTable } from '../../components/CommonTable';
import Urls from '../../../helpers/Urls';
import Strings from '../../../helpers/Strings';

const $ = window.$;
export class Patients extends React.Component {
    
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
            FHIRPatients(page: `+this.state.page+`) {
              RecCount
              UserID
              PatientID
              FirstName
              LastName
              DOB
              Gender
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
        )

        rowArray.push(
            { value : 'PatientID'},
            { value : 'FirstName'},
            { value : 'LastName'},
            { value : 'DOB',isDate : 1},
            { value : 'Gender'},
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
                <h5 className="headerText">Patients</h5>
                {this.renderTransactionsNew()}
            </div>
        );
    }
}