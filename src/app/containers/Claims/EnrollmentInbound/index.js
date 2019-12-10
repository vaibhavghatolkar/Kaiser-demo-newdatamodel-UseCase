import React from 'react';
import './style.css';
import { Pie, Bar } from 'react-chartjs-2';
import moment from 'moment';
import {Files_834} from '../../Files_834';
import { Topbar } from '../../../components/Topbar';
import Urls from '../../../../helpers/Urls';
import { Link } from 'react-router-dom'
import Strings from '../../../../helpers/Strings';

const data = {
    labels: [
        'Accepted Claims',
        'Rejected Claims'
    ],
    datasets: [{
        data: [180, 50],
        backgroundColor: [
            '#139DC9',
            '#83D2B4'
        ],
        hoverBackgroundColor: [
            '#139DC9',
            '#83D2B4'
        ]
    }],
    flag: ''
};

const bardata = {
    labels: ['January', 'February', 'March', 'April'],
    showFile: false,
    datasets: [
        {
            label: 'My First dataset',
            backgroundColor: '#139DC9',
            borderColor: '#139DC9',
            borderWidth: 1,
            hoverBackgroundColor: '#139DC9',
            hoverBorderColor: '#139DC9',
            data: [65, 59, 80, 81]
        },
        {
            label: 'My second dataset',
            backgroundColor: '#83D2B4',
            borderColor: '#83D2B4',
            borderWidth: 1,
            hoverBackgroundColor: '#83D2B4',
            hoverBorderColor: '#83D2B4',
            data: [25, 56, 55, 40]
        }
    ],
    legend: {
        display: false
    }
};

export class EnrollmentInbound extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            claimsList: [],
            summaryList: []
        }

        this.showFile = this.showFile.bind(this)
        this.renderSummary = this.renderSummary.bind(this)
    }

    componentWillReceiveProps() {
        setTimeout(() => {
            this.getData()
        }, 50);
    }

    componentDidMount() {
        this.getData()
    }

    getData() {
        let query = `{
            SP_Daily834headerData {
              FileName
              FileID
              sender
              receiver
              total
              FileStatus
              CreateDateTime
            }
            SP_834DailyDashboardCount {
                total_file
                Total_enrollment
                addition
                Change
                term
                Auditcount
                Error
            }
        }`

        fetch(Urls.base_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                let array = []
                let summary = []
                let data = res.data
                let iterator = data.SP_Daily834headerData

                iterator.forEach(item => {
                    array.push({
                        name: item.FileName,
                        date: item.CreateDateTime,
                        status: item.FileStatus,
                        submitter: item.sender,
                        receiver: item.receiver
                    })
                })

                let counts = data.SP_834DailyDashboardCount && data.SP_834DailyDashboardCount.length > 0 ? data.SP_834DailyDashboardCount[0] : 0

                summary = [
                    { name: 'Total Files', value: counts.total_file },
                    { name: 'Total Enrollment', value: counts.Total_enrollment },
                    { name: 'Additional', value: counts.addition },
                    { name: 'Change', value: counts.Change },
                    { name: 'Term', value: counts.term },
                    { name: 'Error', value: counts.Error }
                ]

                this.setState({
                    claimsList: array,
                    summaryList: summary
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    renderSearchBar() {
        return (
            <div className="row">
                <input type="text" name="name" className="input-style" placeholder="Search Claim" />
            </div>
        )
    }

    renderTableHeader() {
        return (
            <tr className="table-head">
                <td className="table-head-text">File Name</td>
                <td className="table-head-text list-item-style">File Date</td>
                <td className="table-head-text list-item-style">Sender</td>
                <td className="table-head-text list-item-style">Receiver</td>
                <td className="table-head-text list-item-style">Status</td>
            </tr>
        )
    }

    renderCharts() {
        return (
            <div className="row chart">
                <div className="col-6">
                    <span>Total</span>
                    <Pie data={data}
                        options={{
                            elements: {
                                arc: {
                                    borderWidth: 0
                                }
                            },
                            legend: {
                                display: false,
                            }
                        }}
                        width={100}
                        height={60} />
                </div>
                <div className="col-6">
                    <span>Response Time</span>
                    <Bar
                        data={bardata}
                        width={100}
                        height={60}
                        options={{
                            legend: {
                                display: false,
                            }
                        }} />
                </div>
            </div>
        )
    }

    renderList() {
        let row = []
        const data = this.state.claimsList;
        data.forEach((d) => {
            row.push(
                <tr>
                    <td className="bold-text">{d.name}</td>
                    <td className="list-item-style bold-text">{moment(d.date).format('MM/DD/YYYY')}<br />{moment(d.date).format('h:m a')}</td>
                    <td className="list-item-style bold-text">{d.submitter}</td>
                    <td className="list-item-style bold-text">{d.receiver}</td>
                    <td className={"list-item-style bold-text " + (d.status == 'Errors' || d.status == 'File Error' ? 'red ' : (d.status == 'Verified' ? 'green ' : ''))}>{d.status}</td>
                </tr>
            )
        });

        return (
            <table className="table table-bordered claim-list">
                {this.renderTableHeader()}
                <tbody>
                    {row}
                </tbody>
            </table>
        );
    }

    showFile(name) {
        let input = ''
        if(name == 'Additional'){
            input = 'add'
        } else if(name == 'Total Files'){
            input = 'total'
        } else if(name == 'Change'){
            input = 'change'
        } else if(name == 'Term'){
            input = 'term'
        } else if(name == 'Error'){
            input = 'error'
        }

        this.setState({
            showFile: true,
            flag: input
        })
    }

    renderSummary() {
        let row = []
        const data = this.state.summaryList;

        data.forEach((d) => {
            let input = ''
            let name = d.name
            if(name == 'Additional'){
                input = 'add'
            } else if(name == 'Total Files'){
                input = 'total'
            } else if(name == 'Change'){
                input = 'change'
            } else if(name == 'Term'){
                input = 'term'
            } else if(name == 'Error'){
                input = 'error'
            }
            row.push(
                <tr>
                    <td className="bold-text">{d.name}</td>
                    {
                        d.name == 'Total Enrollment' ? 
                        <td className="blue bold-text summary-values">{d.value}</td> :
                        <td>
                            <a href="#" 
                                onClick={() => { 
                                    // this.showFile(d.name) 
                                }} 
                                className={
                                    (d.name == 'Total Enrollment' || d.name == 'Additional' || d.name == 'Total Files') ? 'blue bold-text summary-values' :
                                    (d.name == 'Change' || d.name == 'Term') ? 'purple bold-text summary-values' :
                                    (d.name == 'Error') ? 'red bold-text summary-values' : ''
                                }>
                                <Link to={'/' + Strings.files_834 + '/' + input}>{d.value}</Link>
                            </a>
                        </td>
                    }
                </tr>
            )
        });

        return (
            <table className="table table-bordered claim-list summary-list">
                <tbody>
                    {row}
                </tbody>
            </table>
        );
    }

    render() {
        return (
            <div>
                {this.renderSearchBar()}
                <Topbar/>
                {
                    this.state.showFile
                        ?
                        <Files_834
                            flag={this.state.flag}
                        />
                        :
                        <div className="row">
                            <div className="col-9">
                                {this.renderCharts()}
                                {this.renderList()}
                            </div>
                            <div className="col-3">
                                {this.renderSummary()}
                            </div>
                        </div>
                }
            </div >
        );
    }
}