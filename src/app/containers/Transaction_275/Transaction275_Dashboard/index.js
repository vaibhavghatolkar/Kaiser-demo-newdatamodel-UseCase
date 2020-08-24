import React from 'react'
import '../../Claims/Dashboard/styles.css'
import '../../color.css'
import { Line, HorizontalBar } from 'react-chartjs-2';
import moment from 'moment';
import Urls from '../../../../helpers/Urls';
import { Filters } from '../../../components/Filters';
import { Tiles } from '../../../components/Tiles';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import Strings from '../../../../helpers/Strings';
import { ServersideGrid } from '../../../components/ServersideGrid';

export class Transaction275Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            summaryCount:[],
            State: '',
            selectedTradingPartner:'',
            transactionId:'',
            dateChartLabel:[],
            dateChartData:[],
            barchart275:[],
            startDate: moment().subtract(365, 'd').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),

            paginationPageSize: 10,
            domLayout: 'autoHeight',

            autoGroupColumnDef: {
                headerName: 'Group',
            
             
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
                cellClass: 'cell-wrap-text',
                autoHeight: true,
                sortable: true,
                resizable: true,
                filter: true,
            },
            rowSelection: 'never',
            rowGroupPanelShow: 'never',
            pivotPanelShow: 'never',
            rowData: [],        
                
            columnDefs: [
                { headerName: "File Name", field: "FileName", cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' }},
                { headerName: "State", field: "State",},
                { headerName: "Process Id", field: "ProcessID", },
                { headerName: "File Date", field: "CreateDateTime",},                
                // { headerName: "Patient Name", field: "Patient_name",},
                { headerName: "Provider Name", field: "ProviderName",  },
                { headerName: "File Status", field: "FileStatus",  },
                { headerName: "Total Attachment", field: "total_attachment",  },
                // { headerName: "Attachment Control Number", field: "AttachmentControlNumber", width: 120 },
                // { headerName: "Attachment Information", field: "AttachmentInformation", width: 120 },
                // { headerName: "Attachment Type", field: "Images", flex:1,
                // cellRenderer: (_data) => {
                //     return '<button type="button" style="background-color:#139DC9;color:white; font-size:11px" class="aggrid_button">IMAGES</button>'
                // } },
           
            ],
        }

    }



    componentDidMount() {
        this.getData()
        this.getCommonData()
        this.barChartStatewise()
    }


    _refreshScreen = () => {
        this.getData()
        this.getCommonData()
        this.barChartStatewise()
    }

    ServerSideDatasource = () => {
        return {
            getRows: (params) => {
                console.log('[Datasource] - rows requested by grid: ', params.request)
                let array = this.getFilters(params)
                this.gridApi.showLoadingOverlay();
                this.props.updateFields(
                    params.request.sortModel && params.request.sortModel.length > 0 ? params.request.sortModel[0].colId : (this.props.fieldType ? this.props.fieldType : ''),
                    params.request.sortModel && params.request.sortModel.length > 0 ? params.request.sortModel[0].sort : 'desc',
                    params.request.startRow,
                    params.request.endRow - 1,
                    array
                )

                setTimeout(() => {
                    this._apiCall()
                        .then((data) => {
                            this.gridApi.hideOverlay()
                            if (this.props.postData) {
                                this.props.postData(data)
                            }
                            params.successCallback(data, data && data.length > 0 ? data[0].RecCount : 0);
                        }).catch(error => {
                            this.gridApi.hideOverlay()
                            console.log(error)
                        })
                }, 200);
            },
        }
    }
    getCommonData = async (chartType) => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''
        chartType = this.state.chartType
        if (!this.state.chartType) {
            chartType = "Monthwise"
        }

        process.env.NODE_ENV == 'development' && console.log('I am here check me out ' + this.state.chartType)
        let query = `{
            datewise : DashboardBarChartData275(State:"${this.state.State}" Sender:"${this.state.selectedTradingPartner}" StartDt:"${startDate}" EndDt:"${endDate}" , ChartType: "${chartType}") {
                X_axis
                Y_axis
            }
        }`

        process.env.NODE_ENV == 'development' && console.log(query)

        fetch(Urls.transaction275, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'user-id' : sessionStorage.getItem('user-id'),
                'Cache-Control': 'no-cache, no-store',
                'Expires': 0,
                'Pragma': 'no-cache',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                if (res.data) {
                    this.performCommonOperations(res, chartType)
                }

            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    barChartStatewise = async () =>{
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''

        let query = `{
            DashboardChart275(State:"${this.state.State}" Sender:"${this.state.selectedTradingPartner}" StartDt:"${startDate}" EndDt:"${endDate}") {
                State
                Solicited_Requests
                UnSolicited_Requests
              }
        }`

        process.env.NODE_ENV == 'development' && console.log(query)

        fetch(Urls.transaction275, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'user-id' : sessionStorage.getItem('user-id'),
                'Cache-Control': 'no-cache, no-store',
                'Expires': 0,
                'Pragma': 'no-cache',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                if (res.data) {
                    let barchart275 = res.data.DashboardChart275
                    this.setState({
                        barchart275:barchart275
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    getData() {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''
        let query = `{
            DashboardCount275(Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}", StartDt :"` + startDate + `", EndDt : "` + endDate + `") {
                Solicited_Requests
                UnSolicited_Requests
                Total_Count
            }
        
        }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls.transaction275, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'user-id': sessionStorage.getItem('user-id'),
                'Cache-Control': 'no-cache, no-store',
                'Expires': 0,
                'Pragma': 'no-cache',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                let summary = []  
                let  data=res.data.DashboardCount275
                let Solicited_Requests=''
                let Un_Solicited_Requests=''
                if (data && data.length > 0) {
                    Solicited_Requests = data[0].Solicited_Requests                
                    Un_Solicited_Requests=data[0].UnSolicited_Requests
                    summary = [
                        { name: 'Total Requests', value: data[0].Total_Count},
                        { name: 'Solicited Requests', value: Solicited_Requests},
                        { name: 'Un-Solicited Requests', value: Un_Solicited_Requests },                
                        { name: 'Transactions Matched', value: 0},
                        { name: 'Transactions Not Matched', value: 0},
                        { name: '277 RFAI Requests', value: 0},
                        { name: '277 RFAI Response', value: 0},
                        { name: 'UnMatched Attachment', value: 0},
                    ]
                }
              
                this.setState({
                    summaryCount: summary,
                  
                })
            })
        }
            
        updateFields = (fieldType, sortType, startRow, endRow, filterArray) => {
            this.setState({
                fieldType: fieldType,
                sortType: sortType,
                startRow: startRow,
                endRow: endRow,
                filterArray: filterArray
            })
        }
 
    async performCommonOperations(res, flag) {
        // let tradingChartData = []
        // let tradingChartLabel = []
        let dateChartData = []
        let dateChartLabel = []

        if (res.data.tradingPartnerwise && res.data.tradingPartnerwise.length > 0) {
            res.data.tradingPartnerwise.forEach(item => {
                // tradingChartLabel.push(item.X_axis)
                // tradingChartData.push(item.Y_axis)
            })
        }

        if (res.data.datewise && res.data.datewise.length > 0) {
            let count = 1
            res.data.datewise.forEach(item => {
                try {
                    if (flag == 'Weekwise') {
                        dateChartLabel.push('week ' + count)
                    } else {
                        dateChartLabel.push(item.X_axis)
                    }
                    dateChartData.push(item.Y_axis)
                } catch (error) { }
                count++
            })
        }

        this.setState({
            dateChartLabel: dateChartLabel,
            dateChartData: dateChartData,
        })
    }


    getLineChart(labelArray, dataArray, color) {
        let _data = {
            labels: labelArray,
            datasets: [
                {
                    label: '',
                    fill: true,
                    cubicInterpolationMode: 'default',
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: color,
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'round',
                    pointBorderColor: color,
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: color,
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 3,
                    pointHitRadius: 1,
                    data: dataArray
                }
            ]
        }
        return _data
    }
   

    renderCharts() {
        return (
            <div className="row chart-div col-12">
                {
                    this.state.dateChartLabel && this.state.dateChartLabel.length > 0
                        ?
                        <div className="chart-container chart col-12">
                            <div className="chart-header">275 Volume Analysis</div>
                            <Line
                                data={this.getLineChart(this.state.dateChartLabel, this.state.dateChartData, '#139DC9')}
                                width={100}
                                height={50}
                                options={{
                                    legend: {
                                        display: false,
                                    },
                                }}
                            />
                        </div>
                        :
                        <div className="chart-container-full chart col-12" style={{ textAlign: 'center' }}>
                            No Data Present
                        </div>
                }
            </div>


        )
    }

    renderBarChart() {
        let barchart275 = this.state.barchart275
        let barLabel = []
        let barData1 = []
        let barData2 = []

        barchart275.forEach((d) => {
            barLabel.push(d.State)
            barData1.push(d.Solicited_Requests)
            barData2.push(d.UnSolicited_Requests)
        })
        const data = {
            labels: barLabel,
            datasets: [
              {
                barPercentage: 0.9,
                barThickness: 12,
                maxBarThickness: 10,
                minBarLength: 2,
                label: 'Solicited',
                backgroundColor: '#139DC9',
                borderColor: '#139DC9',
                borderWidth: 1,
                hoverBackgroundColor: '#139DC9',
                hoverBorderColor: '#139DC9',
                data: barData1,
           
              },
              {
                barPercentage: 0.9,
                barThickness: 12,
                maxBarThickness: 10,
                minBarLength: 2,
                label: 'Un-Solicited',
                backgroundColor: '#1a76d2',
                borderColor: '#1a76d2',
                borderWidth: 1,
                hoverBackgroundColor: '#1a76d2',
                hoverBorderColor: '#1a76d2',
                data: barData2
              }
            ]
          };
        return (
            <div className="row chart-div col-12">
                        <div className="chart-container chart col-12">
                            <div className="chart-header">Top States</div>
                            <HorizontalBar data={data}
                             width={100}
                             height={50}
                            options= {{
                                
                                scales: {
                                    xAxes: [{
      
                                        ticks: {
                                            beginAtZero:true,
                                           
                                        }
                                        
                                    }],
                                    yAxes:
                                    
                                    [{
                                        
                                       
                                        
                                     }]
                                }
                            }}
                            />
                        </div>
                        
            </div>


        )
    }
   
   
    _renderAllPieCharts() {
        return (
            <div className="chart-div">
                <div className="row">
                    <div className="col-6" style={{ padding: '6px' }}>
                   {this.renderBarChart()}
                    </div>
                    <div className="col-6" style={{ padding: '6px' }}>
                        {this.renderCharts()}
                    </div>
                </div>
            </div>
        )
    }


    _renderSummaryDetails = () => {
        let row = []
        let array = this.state.summaryCount
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : 'n'
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : 'n'
        let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'
        let State = this.state.State ? this.state.State : 'n'

        array.forEach(item => {
            let addon = ''
            let subtitle = ''
            let clickStatus = ''
            let data = []
            if (item.name == 'Total Requests') {
                clickStatus = ""
            } else if (item.name == 'Solicited Requests') {
                clickStatus = 'solicited'
                subtitle = "Solicited Requests"
            } else if (item.name == 'Un-Solicited Requests') {
                clickStatus = 'unsolicited'
                subtitle = "Un-Solicited Requests"
            } else {
                addon = '/other'
            }

            data = [
                {
                    flag: addon,
                    State: State,
                    selectedTradingPartner: selectedTradingPartner,
                    startDate: startDate,
                    endDate: endDate,
                    transactionId: 'n',
                    subtitle: subtitle,
                    clickStatus:clickStatus
                },
            ]

            row.push(
                <Tiles
                    isClickable={
                        item.name != 'Avg Response Time (sec)'
                    }
                    _data={data}
                    header_text={item.name}
                    value={item.value}
                    second_val={item.second_val}
                    url={Strings.Transaction_275_Details}
                />

            )
        });

        return (
            <div className="row padding-left">
                {row}
            </div>
        )
    }

    _renderList() {
        let filter = this.state.filterArray && this.state.filterArray.length > 0 ? JSON.stringify(this.state.filterArray).replace(/"([^"]*)":/g, '$1:') : '[]'
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        let query = `{
            DashboardFileDetails275(
                    sorting: [{colId:"${this.state.fieldType}", sort:"${this.state.sortType}"}], 
                    startRow: ${this.state.startRow}, endRow: ${this.state.endRow},Filter: ${filter},                    
                    Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",
                   StartDt:"${startDate}",EndDt:"${endDate}", FileID:"", Request:""
                  
            ) {
                RecCount
                FileID
                CreateDateTime
                FileName
                State
                Patient_name
                FileStatus
                ProviderName
                ProcessID
                total_attachment
              }
            }`
            if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        return (
            <div style={{ padding: '0', marginTop: '24px' }}>
                <ServersideGrid
                    columnDefs={this.state.columnDefs}
                    query={query}
                    url={Urls.transaction275}
                    fieldType={'CreateDateTime'}
                    index={'DashboardFileDetails275'}
                    State={this.state.State}
                    selectedTradingPartner={this.state.selectedTradingPartner}
                    startDate={startDate}
                    endDate={endDate}
                    type={this.state.type}
                    updateFields={this.updateFields}
                    onClick={this.clickNavigation}
                />
            </div>
        )
    }

    clickNavigation = (event) => {
        if (event.colDef.headerName == 'File Name') {
            this.setState({
                incoming_fileId: event.data.FileID
            }, () => {
                this.gotoClaimDetails()
            })
        }
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

        this.props.history.push('/' + Strings.Transaction_275_Details, {
            data: sendData
        })
    }

    // _renderList = () => {
    //     let data = [
    //         {
    //            Request:"CA_IU191823_19238 RT10239123", 
    //            Claim: "CLM_CA_92834983", 
    //            Patient: "Tom Cruise" , 
    //            Provider: "Blue Cross Blue Shield of CA Molina Healthcare CA" , 
    //            Received:"April 28, 2000 6:30 PM",
    //            Images:"IMAGES",
    //            File_Serve_Verified:"Accepted",
    //         },
    //         {
    //             Request:" CA_IU191823_02123 RT10239124", 
    //             Claim: "CLM_CA_92834983", 
    //             Patient: "Matt Damon" , 
    //             Provider: "Blue Cross Blue Shield of CA Molina Healthcare CA" , 
    //             Received:"April 28, 2000 8:00 PM",
    //             Images:"HL7 ADT",
    //             File_Serve_Verified:"Accepted",
    //          },
    //          {
    //             Request:" CA_IU191823_02123 RT10239125", 
    //             Claim: "CLM_CA_92834983", 
    //             Patient: "Robert Downey" , 
    //             Provider: "Blue Cross Blue Shield of CA Molina Healthcare CA" , 
    //             Received:"April 28, 2000 7:30 PM",
    //             Images:"IMAGES",
    //             File_Serve_Verified:"Accepted",
    //          },
    //     ]
    //     let columnDefs = [
    //         { headerName: "Request/Trace Number", field: "Request", cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
    //         {
    //             headerName: "File Serve Transfer", field: "", width: 100, cellRenderer: (_data) => {
    //                 return '<i class="fa fa-check"></i>'
    //             }
    //         }, 
    //             { headerName: "Claim", field: "Claim", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', }},
    //             { headerName: "Patient", field: "Patient", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', } },
    //             { headerName: "Provider/Payar", field: "Provider", width: 240, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', }},
    //             { headerName: "Received", field: "Received", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', }},
    //             { headerName: "File Serve Verified", field: "File_Serve_Verified", width: 120,cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', }},
    //             { headerName: "Attachment Type", field: "Images", width:120 ,
    //             cellRenderer: (_data) => {
    //                 return '<button type="button" style="background-color:#139DC9;color:white; font-size:11px" class="aggrid_button">IMAGES</button>'
    //             } },
    //     ]
    //     return (
    //         <div className="text-center">
    //             <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
    //                 <AgGridReact
    //                     modules={this.state.modules}
    //                     columnDefs={columnDefs}
    //                     defaultColDef={this.state.defaultColDef}
    //                     suppressRowClickSelection={true}
    //                     groupSelectsChildren={true}
    //                     debug={true}
    //                     rowSelection={this.state.rowSelection}
    //                     rowGroupPanelShow={this.state.rowGroupPanelShow}
    //                     pivotPanelShow={this.state.pivotPanelShow}
    //                     enableRangeSelection={true}
    //                     paginationAutoPageSize={false}
    //                     pagination={true}
    //                     domLayout={this.state.domLayout}
    //                     paginationPageSize={this.state.paginationPageSize}
    //                     onGridReady={this.onGridReady}
    //                     rowData={data}
    //                     icons={this.state.icons}
    //                     enableCellTextSelection={true}
    //                 >
    //                 </AgGridReact>
    //             </div>
    //         </div>
    //     )
    // }
  
   


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
                isSubmitter={true}
                removeGrid={true}
                setData={this.setData}
                update={this.update}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                submitter_key={"Transaction275"}
            />
        )
    }




    render() {
        return (
            <div>
                <h5 className="headerText">Patient Information Dashboard</h5>
                {this._renderTopbar()}
                {this._renderSummaryDetails()}
                {this._renderAllPieCharts()}
                {this. _renderList()}
            </div>
        );
    }
}