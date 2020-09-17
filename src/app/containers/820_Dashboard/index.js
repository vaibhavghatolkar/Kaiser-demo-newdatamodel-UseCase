import React from 'react';
import '../RealTime_837_Claim/RealTimeDashboard/styles.css';
import '../color.css'
import { Pie, Bar } from 'react-chartjs-2';
import moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";
import Urls from '../../../helpers/Urls';
import Strings from '../../../helpers/Strings';
import ReactPaginate from 'react-paginate';
import { Tiles } from '../../components/Tiles';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { PieChart } from '../../components/PieChart';
import { TableTiles } from '../../components/TableTiles';
import { Filters } from '../../components/Filters';




let val = ''
export class PremiumPaymentLoad extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            claimsList: [],
            summaryList: [],
            summaryCount: [],
            totalFiles: [],
            second_data: {},
            pie_data: {},
            complaince_data: {},
            availitySent: '',
            progress_exception: 0,
            TotalException: 0,
            type: "",
            apiflag: this.props.apiflag,
            tradingpartner: [],
            pielabels: [],
            pievalues: [],
            startDate: moment().subtract(180, 'd').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
            providerName: '',
            chartType: 'Monthwise',
            selectedTradingPartner: '',
            incoming_fileId: '',
            State: '',
            Months: 0,
            accepted: 0,
            rejected: 0,
            inProgress: 0,
            Accepted_per: 0,
            rejected_per: 0,
            ClaimBarChart: [],
            claimLabels: [],
            complience: [],
            //////////----------table----
            Organization: '',
            Service_startDate: '',
            Service_endDate: '',
            Sender: '',
            page: 1,
            count: 1,
            orderby: '',
            providerChartLabel: ['Provider Name 1', 'Provider Name 2', 'Provider Name 3', 'Provider Name 4', 'Provider Name 5'],
            providerChartData: [4, 5, 1, 2, 3],
            ErrorChartLabel: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
            ErrorChartData: [9, 5, 1, 3, 4, 8, 7, 11, 2, 6, 10, 12],
            EFTData: 0,
            CheckData: 0,
            Rejected: 0,
            Accepted: 0,
            QNXT_Generated: 0,
            Hipaas_Received: 0,
            TotalCountQnxt: 0,
            progress_Validated: 0,
            progress_Error: 0,
            AvailitySent: 0,
            TotalError: 0,
            totalAmount: 0,
            gridType: 1,
            paginationPageSize: 10,
            domLayout: 'autoHeight',

            autoGroupColumnDef: {
                headerName: 'Group',
                minWidth: 170,
                field: 'athlete',
                valueGetter: function (params) {
                    if (params.node.group) {
                        return params.node.key;
                    } else {
                        return params.data[params.colDef.field];
                    }
                },
                headerCheckboxSelection: true,
                cellRenderer: 'agGroupCellRenderer',
                cellRendererParams: { checkbox: true },
            },
            defaultColDef: {
                editable: false,
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                sortable: true,
                resizable: true,
                filter: true,
            },
            rowSelection: 'never',
            rowGroupPanelShow: 'never',
            pivotPanelShow: 'never',
            rowData: [],
          
        }


        this.handleStartChange = this.handleStartChange.bind(this);
        this.handleEndChange = this.handleEndChange.bind(this);

        this.showFile = this.showFile.bind(this)
    }

    componentWillReceiveProps() {
        this.setState({
            apiflag: this.props.apiflag
        })
        setTimeout(() => {

        }, 50);
    }

    componentDidMount() {
        this.getListData()
        this._getCounts()
        this._getPieChartData()
        this._getClaimCounts()
    }



    getListData = () => {

        let count = 1
        let Service_startDate = this.state.Service_startDate ? moment(this.state.Service_startDate).format('YYYY-MM-DD') : ""
        let ServiceEndDate = this.state.ServiceEndDate ? moment(this.state.ServiceEndDate).format('YYYY-MM-DD') : ""
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        let providerName = this.state.providerName
        if (!providerName) {
            providerName = ''
        }

        let query = `{            

            Payment820FileDetails(State:"${this.state.State ? this.state.State : ''}",StartDt:"${startDate}",EndDt:"${endDate}",FileID:"",RecType:"Inbound",EFTCHK:"") {
                RecCount
                Sender
                Receiver_Name
                Payer_Name
                InvoiceNo
                MasterAccountNo
                FileID
                FileName
                CheckEFTNo
                FileDate
                AccountNo
                CHECKEFTFlag
                CheckEFTDt
                Receiver
                State
                ProcessID
                TotalClaim
                FileDateTime
                RemittanceAmount
                CompareFile
              }
        }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._Payment820, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                if (res && res.data && res.data.Payment820FileDetails) {

                    this.setState({
                        claimsList: res.data.Payment820FileDetails,
                        rowData: this.state.gridType == 1 ? res.data.Payment820FileDetails : [],
                        count: 0
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }


    showFile(name) {
        this.setState({
            showFile: true,
            flag: name
        })
    }

    getoptions() {
        let row = []
        this.state.tradingpartner.forEach(element => {
            if (!element) {
                return
            }
            row.push(<option value="">{element.Trading_Partner_Name}</option>)
        })
        return row
    }

    handleStartChange(date) {
        this.setState({
            startDate: date
        });
        setTimeout(() => {

            this._getClaimCounts()
            this.getListData()
        }, 50);
    };

    handleEndChange(date) {
        this.setState({
            endDate: date
        });
        setTimeout(() => {

            this._getClaimCounts()
            this.getListData()
        }, 50);
    }


    MonthsEvent(event, key) {
        this.setState({
            [key]: event.target.options[event.target.selectedIndex].value
        })
        setTimeout(() => {

        }, 50);
    }
    _handleStateChange = (event) => {
        this.setState({
            State: event.target.options[event.target.selectedIndex].text
        }, () => {
            this._getClaimCounts()
            this.getListData()
        })
    }



    onHandleChange(e) {
        clearTimeout(val)
        let providerName = e.target.value
        val = setTimeout(() => {
            this.setState({
                providerName: providerName
            }, () => {

            })
        }, 300);
    }

    setData = (startDate, endDate, selected_val) => {
        this.setState({
            startDate,
            endDate,
            selected_val
        })
    }


    handlePageClick = (data) => {
        let page = data.selected + 1
        this.setState({
            page: page
        }, () => {
            this.getListData()
        })
    }


    renderList() {
        let row = []
        const data = this.state.claimsList;

        data.forEach((d) => {
            row.push(
                <tr>
                    <td style={{ color: "var(--light-blue)", wordBreak: 'break-all' }}>
                        <a style={{ color: "#6AA2B8", cursor: "pointer" }}
                            onClick={() => {
                                this.setState({
                                    incoming_fileId: d.FileID
                                }, () => {
                                    this.gotoClaimDetails()
                                })
                            }}>
                            {d.FileID}
                        </a>
                    </td>
                    <td className="list-item-style">{moment(d.FileDate).format('MM/DD/YYYY ')}<br />{moment(d.FileDate).format('hh:mm a')}</td>
                    <td className="list-item-style">{d.State}</td>
                    <td className="list-item-style">{d.TotalClaim}</td>
                    <td className="list-item-style">{d.Rejected}</td>
                    <td className="list-item-style">{d.RemittanceFileName}</td>
                    <td className="list-item-style">{moment(d.RemittanceSentDate).format('MM/DD/YYYY ')}<br />{moment(d.RemittanceSentDate).format('hh:mm a')}</td>
                    {/* <td className="list-item-style"></td> */}
                    <td className="list-item-style"></td>
                    {/* <td style={{ wordBreak: 'break-all' }} className="list-item-style">{d.Receiver}</td> */}
                </tr>
            )
        });

        return (
            <div>
                <table className="table table-bordered claim-list" style={{ tableLayout: 'fixed' }}>
                    {this.state.claimsList && this.state.claimsList.length > 0 ? this.renderTableHeader() : null}
                    <tbody>
                        {row}
                    </tbody>
                </table>
                <ReactPaginate
                    previousLabel={'previous'}
                    nextLabel={'next'}
                    breakLabel={'...'}
                    breakClassName={'page-link'}
                    initialPage={0}
                    pageCount={this.state.count}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={(page) => { this.handlePageClick(page) }}
                    containerClassName={'pagination'}
                    pageClassName={'page-item'}
                    previousClassName={'page-link'}
                    nextClassName={'page-link'}
                    pageLinkClassName={'page-link'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'}
                />
            </div>
        );
    }

    _getCounts = async () => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''
        let query = `{
            Payment820DashboardCount(State: "${this.state.State}", StartDt: "${startDate}", EndDt: "${endDate}", RecType: "Inbound") {
                TotalCount
                Rejected
                Accepted
                AvailitySent
                Exception
                EFT
                CHK
              }
              
        }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._Payment820, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                let summary = []
                let data = res.data.Payment820DashboardCount[0]
                let amount = this.state.totalAmount
                try {
                    amount = Number.parseFloat(this.state.totalAmount).toFixed(2)
                } catch (error) {
                    
                }

                summary = [
                    { name: 'Total Files', value: data.TotalCount },
                    { name: 'Total Remittance Amount', value: amount, isAmount: true },
                    // { name: 'EFT', value: data.EFT },
                    // { name: 'CHK', value: data.CHK },
                    // { name: 'Exception', value: data.Exception },
                    // { name: 'Total Sent To Availity', value: data.AvailitySent },
                    // { name: '999 Received', value: res.data.Total999Response835[0].Total999 },
                ]
                process.env.NODE_ENV == 'development' && console.log(summary)
                this.setState({
                    summaryCount: summary,
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })
    }

    _renderSummaryDetails = () => {
        let row = []
        let array = this.state.summaryCount
        let apiflag = this.state.apiflag
        let url = Strings.ElilgibilityDetails270 + '/' + apiflag
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : 'n'
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : 'n'
        let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'
        let State = this.state.State ? this.state.State : 'n'
        let type = this.state.type ? this.state.type : ''
        array.forEach(item => {
            let addon = ''
            let claimStatus = ''
            let subtitle = ''
            let availitySent = ''
            let loadStatus = ''
            let EFTCHK = ''
            let url = ''
            let data = []

            if (item.name == 'EFT') {
                EFTCHK = 'ACH'
            } else if (item.name == 'CHK') {
                EFTCHK = 'CHK'
            } else if (item.name == 'Total Files') {
                EFTCHK = ''
            }
            data = [
                {
                    flag: addon,
                    State: State,
                    selectedTradingPartner: selectedTradingPartner,
                    startDate: startDate,
                    endDate: endDate,
                    transactionId: 'n',
                    status: claimStatus,
                    type: type,
                    subtitle: subtitle,
                    availitySent: availitySent,
                    EFTCHK: EFTCHK
                },
            ]

            if (item.name == '999 Received') {
                data = [{ flag999: '0' }]
                url = Strings.Inbound_response_999
            }
            row.push(
                <Tiles
                    isClickable={
                        item.name != 'Error Resolved'
                    }
                    _data={data}
                    header_text={item.name}
                    value={item.value}
                    isAmount={item.isAmount}
                    second_val={item.second_val}
                    url={url ? url : Strings.PremiumPaymentLoadDetails}
                />

            )
        });

        return (
            <div className="row col-6 padding-left">
                {row}
            </div>
        )
    }

    _renderClaimTables = (array) => {
        let row = []
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : 'n'
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : 'n'
        let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'
        let State = this.state.State ? this.state.State : 'n'
        let type = this.state.type ? this.state.type : ''

        array.forEach(item => {
            let addon = ''
            let claimStatus = ''
            let subtitle = ''
            let availitySent = ''
            let color = "var(--red)"
            let EFTCHK = ''

            if (item.name == 'EFT') {
                EFTCHK = 'ACH'
                color = "var(--green)"
            } else if (item.name == 'CHK') {
                EFTCHK = 'CHK'
                color = "var(--orange)"
            }


            let sendData = [
                {
                    flag: addon,
                    State: State,
                    selectedTradingPartner: selectedTradingPartner,
                    startDate: startDate,
                    endDate: endDate,
                    transactionId: 'n',
                    status: claimStatus,
                    type: type,
                    subtitle: subtitle,
                    availitySent: availitySent,
                    EFTCHK: EFTCHK
                },
            ]

            row.push(
                <TableTiles
                    item={item}
                    url={Strings.PremiumPaymentLoadDetails}
                    data={sendData}
                    color={color}
                />
            )
        })

        return (
            <div className="col chart-container" style={{ paddingTop: "12px", paddingBottom: '12px' }}>
                {row}
            </div>
        )
    }
    _getClaimCounts = async () => {

        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''

        let query = `{
            Payment820DashboardCountPaymentStatus(State: "${this.state.State}", StartDt: "${startDate}", EndDt: "${endDate}", RecType: "Inbound") {
                X12Count
                HiPaaSCount
                MCGLoadCount
                TotalAmount
              }
              Payment820DashboardTable(State: "${this.state.State}", StartDt: "${startDate}", EndDt: "${endDate}", RecType: "Inbound") {
                Accepted
                Rejected
                FileReject
                Check
                EFT
                AvailitySent
                TotalError
                TotalException
              }
              
        }`

        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._Payment820, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                if (res.data) {
                    let _data = res.data.Payment820DashboardCountPaymentStatus[0]
                    let data2 = res.data.Payment820DashboardTable[0]
                    // let _data = res.data.Claim837RTDashboardTable[0]

                    this.setState({
                        CheckData: data2 ? data2.Check : 0,
                        EFTData: data2 ? data2.EFT : 0,
                        // Rejected999: data2 ? data2.Rejected : 0,
                        // Accepted999: data2 ? data2.Accepted : 0,
                        QNXT_Generated: _data ? _data.X12Count : 0,
                        Hipaas_Received: _data ? _data.HiPaaSCount : 0,
                        totalAmount: _data ? _data.TotalAmount : 0,
                        // AvailitySent: data2 ? data2.AvailitySent : 0,
                        // TotalError: data2 ? data2.TotalError : 0,
                        // TotalException: data2 ? data2.TotalException : 0,
                        // TotalCountQnxt: data ? data.TotalCount: 0
                    }, () => {
                        this._getCounts()
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    renderClaimDetails = () => {

        let stage_1 = [
            { 'header': 'HiPaaS Received Status' },
            { 'name': 'X12 Count', 'value': this.state.QNXT_Generated },
            { 'name': 'HiPaaS Count ', 'value': this.state.Hipaas_Received },


        ]
        let stage_2 = [
            { 'header': 'HiPaaS Payment Status' },
            { 'name': 'EFT', 'value': this.state.EFTData, 'isClick': true },
            { 'name': 'CHK', 'value': this.state.CheckData, 'isClick': true },
            // { 'name': 'Total Amount', 'value': '$' + this.state.totalAmount, },
            // { 'name': 'Total Number of Errors', 'value': this.state.TotalError, 'isClick': true },
            // { 'name': 'Total Number of Exceptions', 'value': this.state.TotalException, 'isClick': true },
            // { 'name': 'Number of Acknowledged 835', 'value': 7 },
        ]
        let stage_3 = [
            { 'header': 'Availity Status' },
            { 'name': 'Sent to Availity', 'value': this.state.AvailitySent, 'isClick': true },
            { 'name': 'Availity Accepted', 'value': this.state.Accepted999 },
            { 'name': 'Availity Rejected', 'value': this.state.Rejected999 },
            // { 'name': '% ERA Out of Total', 'value': '100%' },
            // { 'name': 'Rejected %', 'value': '15%' }
        ]


        return (
            <div className="row col-4" style={{ marginBottom: '12px', padding: '0' }}>
                {this._renderClaimTables(stage_1)}
                {/* {this._renderClaimTables(stage_2)} */}
                {/* {this._renderClaimTables(stage_3)} */}
                {/* {this._renderClaimTables(stage_4)} */}
            </div>
        )
    }


    getPieChartData = (pieChart) => {
        let pieLabel = []
        let pieData = []
        pieChart.forEach((d) => {
            pieLabel.push(d.X_axis)
            pieData.push(d.Y_axis)
        })

        let second_data = {
            labels: pieLabel,
            datasets: [{
                data: pieData,
                backgroundColor: [
                    '#139DC9',
                    '#83D2B4',
                    '#9DC913',
                    '#EC6236',
                    '#C9139D',
                    'blue',
                    '#5369e7',
                    '#b7bf11',
                    '#448dce',
                    '#cb662c',
                ],
                hoverBackgroundColor: [
                    '#139DC9',
                    '#83D2B4',
                    '#9DC913',
                    '#EC6236',
                    '#C9139D',
                    'blue',
                    '#5369e7',
                    '#b7bf11',
                    '#448dce',
                    '#cb662c',
                ]
            }]
        }



        return second_data
    }

    _getPieChartData = async () => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''
        let chartType = this.state.chartType
        if (!chartType) {
            chartType = "Monthwise"
        }
        let query = `{
            file_piechart:Dashboard835PieChart(State:"${this.state.State}", StartDt :"` + this.state.startDate + `", EndDt : "` + this.state.endDate + `", ChartType: "FileErrorwise", RecType: "Outbound") {
                X_axis
                Y_axis
            }
            piechart:Dashboard835PieChart(State:"${this.state.State}", StartDt :"` + this.state.startDate + `", EndDt : "` + this.state.endDate + `", ChartType: "Errorwise", RecType: "Outbound") {
                X_axis
                Y_axis
            }
            CompliancePieChart835(State:"${this.state.State}",StartDt:"${startDate}",EndDt:"${endDate}",RecType:"") {
                Type
                TotalCount
              }
        }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls.transaction835, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                console.log(res)
                let array = []
                // let ClaimBarChart = res.data.barchart
                let claimLabels = []
                let second_data = res.data.file_piechart && res.data.file_piechart.length > 0 ? this.getPieChartData(res.data.file_piechart) : ''
                let pie_data = res.data.piechart && res.data.piechart.length > 0 ? this.getPieChartData(res.data.piechart) : ''
                // let second_data = ""
                // let pie_data = ""
                let complience = res.data.CompliancePieChart835 ? res.data.CompliancePieChart835 : []
                let complaince_data = res.data.CompliancePieChart835 ? this.getComplianceChartData(res.data.CompliancePieChart835) : {}
                let count = 0
                // ClaimBarChart.forEach((d) => {
                //     count++;
                //     array.push(
                //         d.Y_axis ? parseFloat(d.Y_axis) : 0
                //     )
                //     if (chartType == 'Weekwise') {
                //         claimLabels.push('week' + count)
                //     } else {
                //         claimLabels.push(d.X_axis)
                //     }
                // })

                this.setState({
                    ClaimBarChart: array,
                    claimLabels: claimLabels,
                    second_data: second_data,
                    pie_data: pie_data,
                    complience: complience,
                    complaince_data: complaince_data
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })

    }

    getComplianceChartData = (pieChart) => {
        let pieLabel = []
        let pieData = []
        pieChart.forEach((d) => {
            pieLabel.push(d.Type)
            pieData.push(d.TotalCount)
        })
        let data = {
            labels: pieLabel,
            datasets: [{
                data: pieData,
                backgroundColor: [
                    '#139DC9',
                    '#daea00',
                ],
                hoverBackgroundColor: [
                    '#139DC9',
                    '#daea00',
                ]
            }],
            flag: ''
        }

        return data
    }

    renderChart(piechart_data) {
        return (
            <Pie data={piechart_data}
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
                width={20}
                height={19} />
        )
    }

    renderValues(piechart_data) {
        let row = []
        let data = piechart_data.labels
        let colors = piechart_data.datasets[0].backgroundColor
        let count = 0
        data.forEach(item => {
            row.push(
                <div className="row" style={{ paddingLeft: '12px', fontSize: '11px', marginTop: '4px', color: '#8598aa', alignItems: 'center' }}>
                    <div style={{ height: '10px', width: '20px', backgroundColor: colors[count], marginRight: '6px' }}></div><div>{item.length > 40 ? (item.substr(0, 40) + '...') : item}</div>
                </div>
            )
            count++
        })
        return (
            <div style={{ marginTop: '16px' }}>
                {row}
            </div>
        )
    }

    renderPieChart = (header, piechart_data) => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : 'n'
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : 'n'
        let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'
        let State = this.state.State ? this.state.State : 'n'
        let type = this.state.type ? this.state.type : ''

        let addon = ''
        let claimStatus = ''
        let loadStatus = ''
        let generalStatus = ''
        let subtitle = ''
        if (header == 'Top 10 File Level Errors') {
            claimStatus = 'Error'
            subtitle = "Files in Error"
        } else if (header == 'Top 10 Claim Level Errors') {
            addon = '/reject'
            generalStatus = 'Rejected'
        }

        let sendData = [
            {
                flag: addon,
                State: State,
                selectedTradingPartner: selectedTradingPartner,
                startDate: startDate,
                endDate: endDate,
                transactionId: 'n',
                status: claimStatus,
                type: type,
                subtitle: subtitle
            },
        ]

        return (
            <PieChart
                header={header}
                piechart_data={piechart_data}
                data={sendData}
                onClick={header == 'Top 10 File Level Errors' ? this.gotoClaimDetails : ''}
            />
        )
    }

    renderAllPieCharts() {
        return (
            <div className="chart-div">
                <div className="row">
                    <div className="col-6" style={{ padding: '6px' }}>
                        {this.renderPieChart('Top 10 File Level Errors', this.state.second_data)}
                    </div>
                    {this.renderCompliance()}
                    {/* <div className="col-6" style={{ padding: '8px' }}>
                        {this.renderPieChart('Top 10 Payment Level Errors', this.state.pie_data)}
                    </div> */}
                </div>
            </div>
        )
    }

    renderCompliance = () => {
        return (
            <div className="col-6" style={{ padding: '6px' }}>
                {this.renderPieChart('Compliance Ratio', this.state.complaince_data)}
            </div>
        )
    }

    _renderList = () => {
        let columnDefs = [
            { headerName: "File Name", field: "FileName", flex: 1, cellStyle: { color: '#139DC9', cursor: 'pointer' } },
            { headerName: "File Date", field: "FileDate", width: 100, },
            { headerName: "State", field: "State", width: 80 },
            // { headerName: "Remittance No.", field: "RemittanceFileName",flex:1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            // { headerName: "Remittance Date", field: "RemittanceSentDate",flex:1, },
            { headerName: "Remittance Amount", field: "RemittanceAmount", flex: 1, },
            { headerName: "Invoice No.", field: "InvoiceNo", flex: 1, },
            { headerName: "Premium Receiver's Name", field: "Receiver_Name", flex: 1, },
            { headerName: "Premium Payer's Name", field: "Payer_Name", flex: 1, },
            { headerName: "Payment Method", field: "CHECKEFTFlag", flex: 1, },
            { headerName: "Total", field: "TotalClaim", width: 80, },
            { headerName: "", field: "CompareFile", flex: 1, cellStyle: { color: '#139DC9', cursor: 'pointer' } },

        ]

        return (
            <div>

                <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
                    <AgGridReact
                        modules={this.state.modules}
                        columnDefs={columnDefs}
                        autoGroupColumnDef={this.state.autoGroupColumnDef}
                        defaultColDef={this.state.defaultColDef}
                        suppressRowClickSelection={true}
                        groupSelectsChildren={true}
                        debug={true}
                        rowSelection={this.state.rowSelection}
                        rowGroupPanelShow={this.state.rowGroupPanelShow}
                        pivotPanelShow={this.state.pivotPanelShow}
                        enableRangeSelection={true}
                        paginationAutoPageSize={false}
                        pagination={true}
                        domLayout={this.state.domLayout}
                        paginationPageSize={this.state.paginationPageSize}
                        onGridReady={this.onGridReady}
                        rowData={this.state.rowData}
                        icons={this.state.icons}
                        enableCellTextSelection={true}
                        onCellClicked={(event) => {
                            if (event.colDef.headerName == 'File Name') {
                                this.setState({
                                    incoming_fileId: event.data.FileID
                                }, () => {
                                    this.gotoClaimDetails()
                                })
                            } else if (event.colDef.headerName == '') {
                                this.props.history.push('/' + Strings.PremiumPaymentFileCompare)
                            }
                        }}
                    >
                    </AgGridReact>
                </div>
            </div>
        )
    }

    gotoClaimDetails = (data) => {

        let sendData = []
        if (data && data.length > 0) {
            sendData = data
        } else {
            let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : 'n'
            let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : 'n'
            let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'
            let State = this.state.State ? this.state.State : 'n'
            let type = this.state.type ? this.state.type : ''

            sendData = [
                {
                    flag: '',
                    State: State,
                    selectedTradingPartner: selectedTradingPartner,
                    startDate: startDate,
                    endDate: endDate,
                    status: "",
                    type: type,
                    incoming_fileId: this.state.incoming_fileId,
                },
            ]
        }

        this.props.history.push('/' + Strings.PremiumPaymentLoadDetails, {
            data: sendData
        })
    }
    progressBar() {

        let Validated = this.state.progress_Validated + "%"
        let Error = this.state.progress_Error + "%"
        let exception = this.state.progress_exception + "%"
        return (
            <div class="progress">
                {/* <div class="progress-bar" role="progressbar" style={{ width: k }}>Total Sent To Availity ({k})</div> */}
                <div class="progress-bar bg-success" role="progressbar" style={{ width: Validated }}>Vaildated ({Validated})</div>
                <div class="progress-bar bg-danger" role="progressbar" style={{ width: Error }}>Files in Error ({Error})</div>
                <div class="progress-bar bg-warning" role="progressbar" style={{ width: exception }}>Exception ({exception})</div>
            </div>
        )
    }

    _refreshScreen() {
        this.getListData()
        this._getCounts()
        this._getPieChartData()
        this._getClaimCounts()
    }


    setData = (startDate, endDate, selected_val, chartType) => {
        this.setState({
            startDate,
            endDate,
            selected_val,
            chartType
        }, () => {
            this._refreshScreen()
        })
    }

    update = (key, value) => {
        this.setState({
            [key]: value
        }, () => {
            this._refreshScreen()
        })
    }

    _renderTopbar = () => {
        return (
            <Filters
                isTimeRange={true}
                removeSubmitter={true}
                removeGrid={true}
                setData={this.setData}
                changeDefault={true}
                onGridChange={this.onGridChange}
                update={this.update}
                State={'CA'}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
            />
        )
    }


    render() {

        return (
            <div>
                <h5 className="headerText">X12 Premium Payment File Load</h5>

                <div className="row">
                    <div className="col-12">
                        {this._renderTopbar()}
                        {/* {this.progressBar()} */}
                        <div className="general-header" style={{ marginBottom: "10px", marginTop: '12px' }}>File Level</div>
                        {this._renderSummaryDetails()}
                        <div className="general-header">Premium Payment Level</div>
                        {this.renderClaimDetails()}
                        {/* {this.renderAllPieCharts()} */}

                    </div>


                </div>
                <div className="row">
                    <div className="col-12">
                        {this.state.claimsList && this.state.claimsList.length > 0 && this.state.gridType ? this._renderList() : null}
                        {/* {this.state.claimsList && this.state.claimsList.length > 0 && !this.state.gridType ? this.renderList() : null} */}
                        {/* {this.state.claimsList && this.state.claimsList.length > 0 ? this.renderList() : null}     */}
                    </div>
                </div>


                {/* <div className="row">
                <div className="col-9">
                {this.renderGraphs()}
                </div>
                <div className="col-3 nopadding">
            
                {this.renderGooglePieChart('Top Denial Reason codes',lables2,data2)}
              
                </div>
                </div> */}

            </div>
        );
    }
}
