import React from 'react'
import '../Claims/Dashboard/styles.css'
import moment from 'moment';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { Filters } from '../../components/Filters';
import Urls from '../../../helpers/Urls';
import Strings from '../../../helpers/Strings';

let val = ''
export class EthnicityMismatch extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selected_FileID: props.location.state == undefined ? '834_UT_Audit.da' : props.location.state.data[0] && props.location.state.data[0].incoming_fileId ? props.location.state.data[0].incoming_fileId : '834_UT_Audit.da',
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
            FileName: []
        }
    }

    componentDidMount() {
        this.getData()
        this.getFilename()
    }

    getFilename() {
        let query = `{
            GetFileName834(State:"", StartDt :"", EndDt : "") {
                FileID
                FileName
            }
        }`

        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
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
                if (res.data) {
                    this.setState({
                        FileName: res.data.GetFileName834 ? res.data.GetFileName834 : [],
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    FileName() {
        let row = []

        this.state.FileName.forEach(element => {
            if (!element) {
                return
            }
            row.push(<option value={element.FileName} selected={this.state.selected_FileID == element.FileName ? element.FileName : ''}>{element.FileName}</option>)
        })
        return row
    }

    getData = async () => {
        let query = `{
            Compare834FileDetailsMismatch(FileName:"${this.state.selected_FileID}",Mismatch:"ethinicity") {
              memid
              enrollid
              SubscriberNo
              FirstName
              LastName
              MiddleIntial
              dob
              Gender
              StreetAddress
              zip
              City
              State
              Telephone
              ethnicid
              ratecode
              primarylanguage
              planname
              Qeffdate
              QnxtStatus1
              QnxtStatus2
              Qendate
              deathdate
              x12StreetAddress
              enrolltype
              ssn
              telephoneMismatch
              x12Sex
              fileenddate
              segtype
              dhsloadmonth
              filestartdate
              x12Ethnicid
              planid
              MonthlyFileStatus
              x12City
              x12Dob
              x12Zip
              Qnxtloadmonth
              SeqID
              programid
              LoadMonth
              FullFile
              SFHPID
              LoadDateTime
              OtherID
              ReconcileRuntime
              x12Telephone
              inDHS
              inQnxt
              qcsiid
              x12State
            }
          }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
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
                this.setState({
                    rowData: res.data.Compare834FileDetailsMismatch,
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })
    }

    _renderTransactions() {
        let columnDefs = [
            { headerName: "Ignore", field: "",  width:90, checkboxSelection: true,pinned: 'left'},
            { headerName: "Monthly File Status", field: "MonthlyFileStatus", width: 130, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' }, pinned: 'left' },
            { headerName: "Member Id", field: "memid", width: 130, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' }, pinned: 'left' },
            { headerName: "Enrollment Id", field: "enrollid", width: 130, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' }, pinned: 'left' },
            { headerName: "Subscriber No", field: "SubscriberNo", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' }, pinned: 'left' },
            { headerName: "First Name", field: "FirstName", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Last Name", field: "LastName", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "QNXT Dob", field: "dob", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "X12 Dob", field: "x12Dob", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "QNXT Gender", field: "Gender", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "X12 Gender", field: "x12Sex", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "QNXT Ethnic Id", field: "ethnicid", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "X12 Ethnic Id", field: "x12Ethnicid", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "QNXT Street Address", field: "StreetAddress", width: 180 },
            { headerName: "X12 Street Address", field: "x12StreetAddress", width: 180, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "QNXT City", field: "City", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "X12 City", field: "x12City", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "QNXT State", field: "State", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "X12 State", field: "x12State", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "QNXT Zip", field: "zip", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "X12 Zip", field: "x12Zip", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
           
            { headerName: "QNXT Telephone", field: "Telephone", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "X12 Telephone", field: "x12Telephone", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
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

    onSelect(event, key) {
        console.log(event.target.options[event.target.selectedIndex].value)
        this.setState({
            [key]: event.target.options[event.target.selectedIndex].value,
        })
        setTimeout(() => {
            this.getData()
        }, 50);
    }

    renderFilter = () => {
        return (
            <div className="row">
            <div className="col-4" style={{ padding: "15px" }}>
                <div className="list-dashboard">File Name</div>
                <select className="form-control list-dashboard" id="FileName"
                    onChange={(event) => {
                        this.onSelect(event, 'selected_FileID')
                    }}>
                    <option  value="select"></option>
                    <option selected={this.state.selected_FileID == '834_UT_Audit.da' ? "selected" : ''} value="834_UT_Audit.da">834_UT_Audit.da</option>
                    <option selected={this.state.selected_FileID == '834_UT_Daily.da' ? "selected" : ''} value="834_UT_Daily.da">834_UT_Daily.da</option>
                </select>
            </div>
            <div className="col">
            <button type="submit" className="btn btn-ApplyBtn" >Apply To QNXT</button>
        </div>       </div>
        )
    }

    render() {
        return (
            <div>
                <h5 className="headerText">Ethinicity Mismatch</h5>
                <div className="col-12" style={{ padding: "0px" }}>
                    {this.renderFilter()}
                    {this._renderTransactions()}
                </div>
            </div>
        );
    }
}