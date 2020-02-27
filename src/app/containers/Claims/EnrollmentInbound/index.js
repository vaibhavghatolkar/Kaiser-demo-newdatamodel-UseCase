import React from 'react';
import './style.css';
import { Pie, Bar } from 'react-chartjs-2';
import moment from 'moment';
import { Files_834 } from '../../Files_834';
import { Topbar } from '../../../components/Topbar';
import Urls from '../../../../helpers/Urls';
import Strings from '../../../../helpers/Strings';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'

const data = {
    labels: [
        'Additions (55%)',
        'Terminations (15%)',
        'Changes (30%)',
    ],
    datasets: [{
        data: [160, 60, 140],
        backgroundColor: [
            '#139DC9',
            '#9dc913',
            '#83D2B4',

        ],
        hoverBackgroundColor: [
            '#139DC9',
            '#9dc913',
            '#83D2B4',
        ]
    }],
    flag: ''
};

const bardata = {
    labels: ['TP1', 'TP2', 'TP3', 'TP4', 'TP5'],
    showFile: false,
    datasets: [
        {
            label: 'Total Enrollments',
            backgroundColor: '#139DC9',
            borderColor: '#139DC9',
            borderWidth: 1,
            hoverBackgroundColor: '#139DC9',
            hoverBorderColor: '#139DC9',
            data: [9, 20, 10, 15, 27]
        }
    ],
    legend: {
        display: false
    }
};

const pieErrorData = {
    labels: [
        'Missing subscriber demographic details(40%)',
        'Matching SSN not found(10%)',
        'Missing member Policy Number(20%)',
        'Missing employee begin/hiring date(15%)',
        'Dependent original benefit effective date(15%)',
    ],
    datasets: [{
        data: [140, 40, 80, 50, 50],
        backgroundColor: [
            '#139DC9',
            '#1342c9',
            '#83D2B4',
            '#9dc913',
            '#c9139d',
        ],
        hoverBackgroundColor: [
            '#139DC9',
            '#1342c9',
            '#83D2B4',
            '#9dc913',
            '#c9139d',
        ]
    }],
    flag: ''
}

export class EnrollmentInbound extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            claimsList: [],
            summaryList: [],
            errorCount: []
        }

        this.showFile = this.showFile.bind(this)
        this.renderSummary = this.renderSummary.bind(this)
    }

    componentWillReceiveProps() {
        setTimeout(() => {
            this.getData()
            setTimeout(() => {
                this.getErrorCount()
            }, 50);
        }, 50);
    }

    componentDidMount() {
        this.getData()
      
        setTimeout(() => {
            this.getErrorCount()
        }, 50);
    }

    getErrorCount() {
        let query = '{ CompareFileError834 { dbdesc error_desc RCount } }'
        fetch(Urls.enrollment, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(r => {
                let data = []
                data = r.data.CompareFileError834
                this.setState({
                    errorCount: data
                })
            })
            .then(data => console.log('data returned:', data));
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
                Resubmit
            }
        }`

        fetch(Urls.enrollment, {
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
                    // { name: 'Total Enrollment', value: counts.Total_enrollment },
                    // { name: 'Additions', value: counts.addition },
                    // { name: 'Changes', value: counts.Change },
                    // { name: 'Termination', value: counts.term },
                    { name: 'Total Errors', value: counts.Error },
                    { name: 'Resubmit', value: counts.Resubmit }
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

                <input type="text" name="name" className="input-style" placeholder="Search" />
            </div>
        )
    }

    renderTableHeader() {
        return (
            <tr className="table-head">
                <td className="table-head-text"></td>
                <td className="table-head-text">File Name <img src={require('../../../components/Images/search_table.png')} style={{ height: '14px', marginTop : '3px', float: 'right', marginRight: '4px' }}></img> </td>
                <td className="table-head-text list-item-style">File Date <img src={require('../../../components/Images/search_table.png')} style={{ height: '14px', marginTop : '3px', float: 'right', marginRight: '4px' }}></img></td>
                <td className="table-head-text list-item-style">Submitter <img src={require('../../../components/Images/search_table.png')} style={{ height: '14px', marginTop : '3px', float: 'right', marginRight: '4px' }}></img></td>
                <td className="table-head-text list-item-style">Enrollments | Errors <img src={require('../../../components/Images/search_table.png')} style={{ height: '14px', marginTop : '3px', float: 'right', marginRight: '4px' }}></img></td>
                <td className="table-head-text list-item-style">File Status <img src={require('../../../components/Images/search_table.png')} style={{ height: '14px', marginTop : '3px', float: 'right', marginRight: '4px' }}></img></td>
            </tr>
        )
    }

    renderCharts() {
        return (
            <div className="row chart">
                <div className="col-6 barchartcss">
                    <Pie data={data}
                        options={{
                            elements: {
                                arc: {
                                    borderWidth: 0
                                }
                            },
                            tooltips: {
                                enabled: false
                            },
                            pieceLabel: {
                                render: 'label',
                                position: 'outside'
                            },
                            responsive: true,
                            legend: {
                                position: 'bottom',
                                display: 'false'
                            },
                            animation: {
                                animateScale: true,
                                animateRotate: true
                            }
                        }}
                        width={100}
                        height={70} />
                </div>
                <div className="col-5 barchartcss">
                    <Bar
                        data={bardata}
                        width={100}
                        height={90}
                        options={{
                            legend: {
                                position: 'bottom',
                            },
                            pieceLabel: {
                                render: 'label',
                                position: 'outside'
                            },
                        }} />
                </div>
            </div>
        )
    }

    renderPieChart() {
        return (
            <div className="row chart">
                <div className="col-12">
                    <Pie data={pieErrorData}
                        options={{
                            elements: {
                                arc: {
                                    borderWidth: 0
                                }
                            },
                            tooltips: {
                                enabled: false
                            },
                            pieceLabel: {
                                render: 'label',
                                position: 'outside'
                            },
                           
                            responsive: true,
                            legend: {
                                position: 'bottom',
                                display: 'false'
                            },
                            animation: {
                                animateScale: true,
                                animateRotate: true
                            },
                            label: {
                                display: false
                            },
                        }}
                        width={100}
                        height={90} />
                </div>
            </div>
        )
    }
    renderValues() {
        let row = []
        let data = pieErrorData.labels
        let colors = pieErrorData.datasets[0].backgroundColor
        
        let count = 0
        data.forEach(item => {
            row.push(
                <div className="row" style={{ textAlign: 'center', fontSize: '12px', marginTop: '4px', color: 'slategrey', alignItems: 'center' }}>
                    <div style={{ height: '10px', width: '20px', backgroundColor: colors[count], marginRight: '12px' }}></div>{item}
                </div>
            )
            count++
        })
        return (
            <div style={{ marginTop: '20px', marginLeft: '24%' }}>
                {row}
            </div>
        )
    }
    
    renderList() {
        let row = []
        const data = this.state.claimsList;
        data.forEach((d) => {
            row.push(
                <tr>
                    <td><input type="checkbox" /></td>
                    <td className="bold-text" >{d.name} </td>
                    <td className="list-item-style bold-text">{moment(d.date).format('YYYY/MM/DD')}</td>
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
        if (name == 'Additions') {
            input = 'add'
        } else if (name == 'Total Files') {
            input = 'total'
        } else if (name == 'Changes') {
            input = 'change'
        } else if (name == 'Termination') {
            input = 'term'
        } else if (name == 'Total Errors') {
            input = 'error'
        }
        else if (name == 'Resubmit') {
            input = 'Resubmit'
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
            let url = ''
            let data = []
            if(d.name == 'Total Files'){
                url = Strings.claimsDashboard_834_details
                data = [
                    { Total: 'total' },
                ]

            } else if(d.name == 'Total Errors'){
                url = Strings.EnrollmentError
                data = [
                    { Total: 'error' },
                ]
            } else if(d.name == 'Resubmit'){
                url = Strings.claimsDashboard_834_details
                data = [
                    { Total: 'Resubmit' },
                ]
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
                                }} className={
                                (d.name == 'Total Enrollment' || d.name == 'Additions' || d.name == 'Total Files') ? 'blue bold-text summary-values' :
                                (d.name == 'Changes' || d.name == 'Termination') ? 'purple bold-text summary-values' :
                                (d.name == 'Total Errors' || d.name == 'Resubmit') ? 'red bold-text summary-values' : ''
                                
                            }>  <Link to={{ pathname: '/'+url +'', state: { data } }}>{d.value}</Link></a>
                                
                               
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

    renderCountTable() {
        let row = []
        let data = this.state.errorCount
        data.forEach(element => {
            row.push(
                <tr>
                    <td className="padding">{element.error_desc}</td>
                    <td className="padding" style={{ paddingLeft: "30px", padding: "5px", textAlign: "right" }}>
                        {element.RCount}
                    </td>
                </tr>
            )
        });

        return (row)
    }
   

    getOptions() {
        let row = []
       
        this.state.tradingpartner.forEach(element => {
            row.push(<option value="">{element.Trading_Partner_Name}</option>)
        })
        return row
    }

    render() {
        return (
            <div>
                {                            
                        <div>    
                             <h5 style={{ color: "var(--main-bg-color)", fontWeight: "700", marginTop: "10px", fontSize: '18px' }}>834 Enrollment Dashboard</h5>       
                            <Topbar flag={2} />
                            <div className="row">
                                <div className="col-8">
                                    {this.renderCharts()}
                                    {this.renderList()}
                                </div>
                                <div className="col-4">
                                    {this.renderSummary()}
                                    {this.renderPieChart()}
                                    {this.renderValues()}
                                </div>
                            </div>
                        </div>
                }
            </div >
        );
    }
}