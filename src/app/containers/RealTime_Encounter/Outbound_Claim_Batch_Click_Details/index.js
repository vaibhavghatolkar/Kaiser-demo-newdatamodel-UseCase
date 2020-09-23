import React from 'react'
import '../../Claims/Dashboard/styles.css'
import '../../Claim_276_RealTime/Real_Time_276/style.css'
import '../../color.css'
import '../../Files/files-styles.css';
import moment from 'moment';
import Urls from '../../../../helpers/Urls';
import ReactPaginate from 'react-paginate';
import DatePicker from "react-datepicker";
import { Pie } from 'react-chartjs-2';
import { CommonNestedTable } from '../../../components/CommonNestedTable';
import { StateDropdown } from '../../../components/StateDropdown';
import { Filters } from '../../../components/Filters';
import { AgGridReact } from 'ag-grid-react';
import Strings from '../../../../helpers/Strings';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

let val = ''
export class Outbound_Claim_Batch_Click_Details extends React.Component {

    constructor(props) {
        super(props);
        console.log(props.location.state.data[0])
        this.state = {
            claimStatus:props.location.state && props.location.state.data[0] && props.location.state.data[0].claimStatus != '' ? props.location.state.data[0].claimStatus : '',
            status:props.location.state && props.location.state.data[0] && props.location.state.data[0].status != '' ? props.location.state.data[0].status : '',
            jobListData:[],
            State:'',
            startDate: moment().subtract(180, 'd').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
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
    _refreshScreen = () => {
        this.getListData()
    }

    getListData = () =>{
         
        let query = `{OutboundEncounterProcessingSummaryNew(FileID:"" F99Status:"" F277Status:""
        PaymentStatus:""  MolinaClaimID:"" Correction:"${this.state.status}")  {
            RefID
            FileID
            FileName_Outbound
            FileDate_Outbound
            FileStatus_Outbound
            ClaimID
            MolinaClaimID
            EncounterDate
            Encounter99_Status
            Encounter277CA_Status
            F999
            F277CA
            PaymentStatus
            BatchName
            BatchDate
            BatchClaimStatus
            BatchCreated
            FileName_Inbound
            FileCreated
            ReceivedDate835
            Subscriber_ID
            SubscriberLastName
            SubscriberFirstName
            ClaimStatus
            Error_Field
            Error_Description
            LXCount
            paymentcount
            ProcessID835
              ICD_Code
            Corrected_Patient_Name
             Corrected_Payer_Name
            Corrected_Dignosis_Code
            Payername
          }}`

        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._Encounter, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                console.log(res.data.OutboundEncounterProcessingSummaryNew)
                if (res.data) {
                    this.setState({
                        jobListData: res.data.OutboundEncounterProcessingSummaryNew ? res.data.OutboundEncounterProcessingSummaryNew : [],
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    _RenderList(){
       
          let columnDefs = this.state.claimStatus=="Corrected Patient/Insured Name" ? [            
            { headerName: "Claims Id", field: "MolinaClaimID", width: 150,  },
            // { headerName: "Payer Name", field: "jobName", flex: 1 },
            // { headerName: "ICD Code", field: "LOB", width:130 },
            { headerName: "Claims Date", field: "EncounterDate", width:200 },
           // { headerName: "835 Process ID", field: "ProcessID835", width:200 },
          //  { headerName: "Payment Status", field: "", width:200 },
        
          { headerName: "277 CA Claims Status ", field: "Encounter277CA_Status", width:200 },
          { headerName: "Payment Status ", field: "PaymentStatus", width:200 },
            { headerName: "837 Patient Name", field: "SubscriberFirstName", width:200,cellRenderer: (data) => {
                return   data.data.SubscriberFirstName + " " + data.data.SubscriberLastName                
            }
        
        },
            { headerName: "835 Patient Name", field: "Corrected_Patient_Name", flex:1, cellRenderer: (data) => {
                return   data.data.SubscriberFirstName + " " + data.data.Corrected_Patient_Name                
            }
        }
            
        ]:
         this.state.claimStatus=="Corrected Priority Payer Name" ? [
            { headerName: "Claims Id", field: "MolinaClaimID", width: 150,  },
            // { headerName: "Payer Name", field: "jobName", flex: 1 },
            // { headerName: "ICD Code", field: "LOB", width:130 },
            { headerName: "Claims Date", field: "EncounterDate", width:200 },
           
            { headerName: "277 CA Claims Status ", field: "Encounter277CA_Status", width:200 },
            { headerName: "Payment Status ", field: "PaymentStatus", width:200 },
          //  { headerName: "835 Process ID", field: "ProcessID835", width:200 },
           // { headerName: "Payment Status", field: "", width:200 },
            { headerName: "837 Payer Name", field: "Payername", width:200 },
            { headerName: "835 Payer Name", field: "Corrected_Payer_Name",flex:1,},
            
        ] : this.state.claimStatus=="Corrected ICD Code" ? [
            { headerName: "Claims Id", field: "MolinaClaimID", width: 150,  },
            // { headerName: "Payer Name", field: "jobName", flex: 1 },
            // { headerName: "ICD Code", field: "LOB", width:130 },
            { headerName: "Claims Date", field: "EncounterDate", width:200 },
           
            { headerName: "277 CA Claims Status ", field: "Encounter277CA_Status", width:200 },
            { headerName: "Payment Status ", field: "PaymentStatus", width:200 },
           // { headerName: "835 Process ID", field: "ProcessID835", width:200 },
           // { headerName: "Payment Status", field: "", width:200 },
            { headerName: "837 Icd Code", field: "ICD_Code", width:200 },
            { headerName: "835 Icd Code", field: "Corrected_Dignosis_Code",flex:1, },
            
        ]: [
            { headerName: "Claims Id", field: "MolinaClaimID", width: 150,  },
            // { headerName: "Payer Name", field: "jobName", flex: 1 },
            // { headerName: "ICD Code", field: "LOB", width:130 },
            { headerName: "Claims Date", field: "EncounterDate", width:200 },
           // { headerName: "835 Process ID", field: "ProcessID835", width:200 },
          //  { headerName: "Payment Status", field: "", width:200 },
        
          { headerName: "277 CA Claims Status ", field: "Encounter277CA_Status", width:200 },
          { headerName: "Payment Status ", field: "PaymentStatus", width:200 },
            { headerName: "837 Patient Name", field: "SubscriberFirstName", width:200,cellRenderer: (data) => {
                return   data.data.SubscriberFirstName + " " + data.data.SubscriberLastName                
            }
        
        },   { headerName: "835 Patient Name", field: "Corrected_Patient_Name",flex:1, cellRenderer: (data) => {
            return   data.data.SubscriberFirstName + " " + data.data.Corrected_Patient_Name                
        }
    }
            
            
        ]

        return (
            <div className="text-center">

                <div className="ag-theme-balham" style={{ padding: '0', marginTop: '10px' }}>
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
                        rowData={this.state.jobListData}
                        icons={this.state.icons}
                        enableCellTextSelection={true}
                        onCellClicked={(event) => {
                           
                        }}
                    >
                    </AgGridReact>
                </div>
            </div>
        )
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
                removeGrid={true}
                State={this.state.State}
                removeSubmitter={true} 
                setData={this.setData}
                onGridChange={this.onGridChange}
                update={this.update}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
            />
        )
    }
    setData = (startDate, endDate, selected_val) => {
        this.setState({
            startDate,
            endDate,
            selected_val
        })
    }
   
    render() {

        return (
            <div>
                <h5 className="headerText">{this.state.claimStatus} Details</h5>
                {this._renderTopbar()}
               {this._RenderList()}
            </div>
        );
    }
}
