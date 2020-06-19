import React from 'react'
import '../Claims/Dashboard/styles.css'
import moment from 'moment';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { Filters } from '../../components/Filters';
import Urls from '../../../helpers/Urls';

let val = ''
export class CrosswalkTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            claimsAudit: [],
            tradingpartne837: [],
            providers: [],
            summaryList: [],
            SubTotal: 0,
            VeriTotal: 0,
            InBizstockTotal: 0,
            acceptedFiles: 0,
            HiPaaSCount: 0,
            loaded: 0,
            gridType: 1,
            selectedTradingPartner: '',
            type: '',
            providerName: '',
            orderby: "",
            transType: "",
            State: "UT",
            PenTotal: 0,
            RejTotal: 0,
            errTotal: 0,
            startDate: moment().subtract(365, 'd').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
            TotalClaims: '',
            Accepted: '',
            Rejected: '',
            InProgress: '',
            Total999: '',
            Total277CA: '',
            TotalSentToQNXT: '',
            Paid: '',
            denied: '',
            WIP: '',
            Pending: '',
            page: 1,
            count: 1,
            total_999: 0,
            nameRotation: 180,
            statusRotation: 180,
            stateRotation: 180,
            processIdRotation: 180,
            totalCount: '',
            accepted_Files: '',
            acceptedwithErrors: '',
            rejected_Files: '',
            paginationPageSize: 10,
            domLayout: 'autoHeight',
            NotSent999: props.location.state && props.location.state.data && props.location.state.data[0] && props.location.state.data[0].notSent ? props.location.state.data[0].notSent : '',
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
            
        }
    }

    componentDidMount() {
        this._refreshScreen()
    }

    getData = async () => {
        let query = `{Transaction834(transtype:"${this.state.transType}") {
            Description
            effdate
            termdate
            transtypeid
            xternid
            ediclientid
            qcsiid
            createid
            createdate
            updateid
            lastupdate
        }}`
        process.env.NODE_ENV == 'development' && console.log(query)
        fetch(Urls._transaction834, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                var data = res.data.Transaction834
                this.setState({
                    rowData: data
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    _renderTransactions() {
        let columnDefs= [
            { headerName: "Transaction Type Id", field: "transtypeid", width: 160 },
            { headerName: "Edi Client Id", field: "ediclientid", width: 120},
            { headerName: "QCSI Id", field: "qcsiid", width: 100 },
            { headerName: "External Id", field: "xternid", width: 120},
            { headerName: "Effective Date", field: "effdate", width: 150 },
            { headerName: "Term Date", field: "termdate", width: 150 },
            { headerName: "Description", field: "Description", flex:1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
           
            // { headerName: "Create Id", field: "createid", flex: 1 },
            // { headerName: "Create Date", field: "createdate", flex: 1 },
            // { headerName: "Update Id", field: "updateid", flex: 1 },
            // { headerName: "Last Update", field: "lastupdate", width: 120 },
           
        ]
        return (
            <div style={{ width: '100%', height: '100%' }}>
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
                        enableCellTextSelection={true}
                    >

                    </AgGridReact>

                </div>


            </div>
        )
    }

    _refreshScreen = () => {
        this.getData()
    }

    update = (key, value) => {
        if (key == 'State') {
            let data = this.state.rowData
            this.setState({
                [key]: value,
                rowData: []
            })

            setTimeout(() => {
                this.setState({
                    rowData: data
                })
            }, 500);
        } else {
            this.setState({
                [key]: value
            }, () => {
                this._refreshScreen()
            })
        }
    }

    _renderTopbar = () => {
        return (
            <Filters
                isTimeRange={false}
                setData={this.setData}
                State={this.state.State}
                onGridChange={this.onGridChange}
                update={this.update}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                removeSubmitter={true}
                isTransType={true}
                removeGrid={true}
            />
        )
    }

    render() {
        return (
            <div>
                <h5 className="headerText">Crosswalk Table</h5>
                {this._renderTopbar()}
                <div className="col-12" style={{ padding: "0px" }}>
                    {this._renderTransactions()}
                </div>
            </div>
        );
    }
}