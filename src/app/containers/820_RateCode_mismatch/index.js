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
export class RateCode820Mismatch extends React.Component {

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
            FileName: [],
            statusArray: [
                { 'SubscriberNo': '906026031', 'FirstName': 'NYAH', 'LastName': 'BIRD', 'dob': '02-05-2002', 'Gender': 'F', 'invoiceNo': '4423161', 'invoiceAmt': '20000', 'reportDate': '20200501-20280531', '820RateCode': 'C YY', 'QnxtRateCode': 'H NY' },
                { 'SubscriberNo': '900268750', 'FirstName': 'WILMA', 'LastName': 'BROOKS', 'dob': '12-02-1958', 'Gender': 'F', 'invoiceNo': '3324531', 'invoiceAmt': '25000', 'reportDate': '20200501-20280531', '820RateCode': 'H NY', 'QnxtRateCode': 'D NN' },
                { 'SubscriberNo': '800361257', 'FirstName': 'SUSAN', 'LastName': 'DAVIS', 'dob': '02-17-1955', 'Gender': 'F', 'invoiceNo': '3241765', 'invoiceAmt': '21900', 'reportDate': '20200501-20280531', '820RateCode': 'C YY', 'QnxtRateCode': 'G NN' },
                { 'SubscriberNo': '405450291', 'FirstName': 'DAVID', 'LastName': 'DICKAMORE', 'dob': '10-01-1960', 'Gender': 'M', 'invoiceNo': '2345543', 'invoiceAmt': '39000', 'reportDate': '20200501-20280531', '820RateCode': 'D NN', 'QnxtRateCode': 'C NN' },
                { 'SubscriberNo': '806065714', 'FirstName': 'KASON', 'LastName': 'HAMMER', 'dob': '04-23-1993', 'Gender': 'F', 'invoiceNo': '2346422', 'invoiceAmt': '27000', 'reportDate': '20200501-20280531', '820RateCode': 'A NN', 'QnxtRateCode': 'H NY' },
                {
                    "SubscriberNo": "710680779",
                    "FirstName": "AALIYAH                            ",
                    "LastName": "LOPEZ                                             ",
                    "dob": "07-10-2011",
                    "Gender": "F",
                    "StreetAddress": "APT 2                                                       ",
                    "zip": "843213279",
                    "City": "LOGAN                         ",
                    "ratecode": "I NN                          ",
                    "planname": "THPA0028       ",
                    "Qeffdate": "09-01-2017",
                    "QnxtStatus1": "Active",
                    "Qendate": "12-31-2078", 'invoiceNo': '25346422', 'invoiceAmt': '257000', 'reportDate': '20200503-20280531','820RateCode': 'D NN', 'QnxtRateCode': 'H NY' 
                },
                {
                    "SubscriberNo": "608213015",
                    "FirstName": "KRISTA                             ",
                    "LastName": "LUSK                                              ",
                    "dob": "02-28-1985",
                    "Gender": "F",
                    "StreetAddress": "2285 W 6200 N                                               ",
                    "zip": "843359614",
                    "City": "SMITHFIELD                    ",
                    "ratecode": "T YY                          ",
                    "planname": "THPA0028       ",
                    "Qeffdate": "04-01-2020",
                    "QnxtStatus1": "Active",
                    "Qendate": "12-31-2078", 'invoiceNo': '26346422', 'invoiceAmt': '267000', 'reportDate': '20200503-20280531','820RateCode': 'G NN', 'QnxtRateCode': 'W YY' 
                },
                {
                    "SubscriberNo": "602184455",
                    "FirstName": "DANIEL                             ",
                    "LastName": "MACHIN                                            ",
                    "dob": "11-08-1955",
                    "Gender": "M",
                    "StreetAddress": "380 E 240 N                                                 ",
                    "zip": "840574889",
                    "City": "OREM                          ",
                    "ratecode": "G YY                          ",
                    "planname": "THPA0028       ",
                    "Qeffdate": "04-01-2020",
                    "QnxtStatus1": "Active",
                    "Qendate": "12-31-2078", 'invoiceNo': '27346422', 'invoiceAmt': '277000', 'reportDate': '20200503-20280531','820RateCode': 'T YY', 'QnxtRateCode': 'G YY' 
                },
                {
                    "SubscriberNo": "405450291",
                    "FirstName": "KAMBREE                            ",
                    "LastName": "DICKAMORE                                         ",
                    "dob": "03-24-2001",
                    "Gender": "F",
                    "StreetAddress": "2491 N HIGHWAY 89                                           ",
                    "zip": "844042685",
                    "City": "PLEASANT VIEW                 ",
                    "ratecode": "D NN                          ",
                    "planname": "THPA0028       ",
                    "Qeffdate": "04-01-2020",
                    "QnxtStatus1": "Active",
                    "Qendate": "12-31-2078", 'invoiceNo': '42346422', 'invoiceAmt': '47000', 'reportDate': '20200503-20280531','820RateCode': 'E YY', 'QnxtRateCode': 'L NN' 
                },
                {
                    "SubscriberNo": "806065714",
                    "FirstName": "VIVIANA                            ",
                    "LastName": "GARCIA QUINTANA                                   ",
                    "dob": "03-04-2002",
                    "Gender": "F",
                    "StreetAddress": "143 GUENEVERE ST                                            ",
                    "zip": "840542237",
                    "City": "NORTH SALT LAKE               ",
                    "ratecode": "C YY                          ",
                    "planname": "THPA0028       ",
                    "Qeffdate": "04-01-2020",
                    "QnxtStatus1": "Active",
                    "Qendate": "12-31-2078", 'invoiceNo': '52346422', 'invoiceAmt': '57000', 'reportDate': '20200503-20280531','820RateCode': 'D NN', 'QnxtRateCode': 'G NN' 
                },
                // {'SubscriberNo':'605231411','FirstName':'NYAH', 'LastName':'BIRD','dob':'02-05-2002','Gender':'F','invoiceNo': '4423161', 'invoiceAmt':'20000','reportDate':'20200501-20280531','820RateCode':'C YY', 'QnxtRateCode':'D NY' },
                // {'SubscriberNo':'602735699','FirstName':'NYAH', 'LastName':'BIRD','dob':'02-05-2002','Gender':'F','invoiceNo': '4423161', 'invoiceAmt':'20000','reportDate':'20200501-20280531','820RateCode':'B NN', 'QnxtRateCode':'H NY' }
            ]

        }
    }

    componentDidMount() {
        // this.getData()
        // this.getFilename()
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
            Compare834FileDetailsMismatch(FileName:"${this.state.selected_FileID}",Mismatch:"ratecodemismatch") {
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
              x12RateCode
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

            { headerName: "Subscriber No", field: "SubscriberNo", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' }, pinned: 'left' },
            { headerName: "First Name", field: "FirstName", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Last Name", field: "LastName", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Dob", field: "dob", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Gender", field: "Gender", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Invoice No.", field: "invoiceNo", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Invoice Amount", field: "invoiceAmt", width: 110, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Report Date", field: "reportDate", width: 120, },
            { headerName: "820 Rate Code", field: "820RateCode", width: 130, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "QNXT Rate Code", field: "QnxtRateCode", width: 140, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },

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
                        rowData={this.state.statusArray}
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
                        <option value="select"></option>
                        <option selected={this.state.selected_FileID == '834_UT_Audit.da' ? "selected" : ''} value="834_UT_Audit.da">834_UT_Audit.da</option>
                        <option selected={this.state.selected_FileID == '834_UT_Daily.da' ? "selected" : ''} value="834_UT_Daily.da">834_UT_Daily.da</option>
                    </select>
                </div>
                <div className="col">
                    <button type="submit" className="btn btn-ApplyBtn" >Apply To QNXT</button>
                </div></div>
        )
    }

    render() {
        return (
            <div>
                <h5 className="headerText">Rate Code Mismatch</h5>
                <div className="col-12" style={{ padding: "0px" }}><br />
                    {/* {this.renderFilter()} */}
                    {this._renderTransactions()}
                </div>
            </div>
        );
    }
}