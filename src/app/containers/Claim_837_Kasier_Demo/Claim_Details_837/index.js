import React from 'react'
import '../../Claims/Dashboard/styles.css'
import '../../Claim_276_RealTime/Real_Time_276/style.css'
import '../../color.css'
import '../../Files/files-styles.css';
import moment from 'moment';
import Urls from '../../../../helpers/Urls';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import Strings from '../../../../helpers/Strings';
import { Filters } from '../../../components/Filters';
import { ServersideGrid } from '../../../components/ServersideGrid';
const $ = window.$;
export class Claim_Details_837 extends React.Component {
    constructor(props) {
        super(props);
        let flag = props.location.state && props.location.state.data[0] ? props.location.state.data[0].flag : ''
        if (flag == 'accept') {
            flag = 'Accepted Claims'
        } else if (flag == 'reject') {
            flag = 'Rejected Claims'
        } else {
            flag = 'Other'
        }
        this.state = {
            intakeClaims: [],
            page: 1,
            initialPage: 0,
            lineCount: 0,
            HL20: 0,
            HL22: 0,
            HL23: 0,
            showClaims: false,
            lineData: [],
            file: [],
            fileDetails: [],
            claimStageDetails: [],
            memberInfo: {},
            subscriberNo: '',
            molina_claimId: '',
            selectedFileId: '',
            type: props.location.state && props.location.state.data[0] && props.location.state.data[0].type ? props.location.state.data[0].type : "",
            selectedTradingPartner: props.location.state && props.location.state.data[0] && props.location.state.data[0].selectedTradingPartner != 'n' ? props.location.state.data[0].selectedTradingPartner : '',
            enrollment_type: '',
            plan_code: '',
            startDate: props.location.state && props.location.state.data[0] && props.location.state.data[0].startDate != 'n' ? props.location.state.data[0].startDate : '',
            endDate: props.location.state && props.location.state.data[0] && props.location.state.data[0].endDate != 'n' ? props.location.state.data[0].endDate : '',
            gridflag: props.location.state && props.location.state.data[0] && props.location.state.data[0].gridflag ? props.location.state.data[0].gridflag : '',
            fileStatus: props.location.state && props.location.state.data[0] && props.location.state.data[0].fileStatus != '' && props.location.state.data[0].fileStatus != undefined ? props.location.state.data[0].fileStatus : '',
            generalStatus: props.location.state && props.location.state.data[0] && props.location.state.data[0].generalStatus ? props.location.state.data[0].generalStatus : '',
            mcgStatus: props.location.state && props.location.state.data[0] && props.location.state.data[0].mcgStatus ? props.location.state.data[0].mcgStatus : '',
            incoming_fileId: props.location.state && props.location.state.data[0] && props.location.state.data[0].incoming_fileId ? props.location.state.data[0].incoming_fileId : '',
            subtitle: props.location.state && props.location.state.data[0] && props.location.state.data[0].subtitle ? props.location.state.data[0].subtitle : '',
            status277CA: props.location.state && props.location.state.data[0] && props.location.state.data[0].status277CA ? props.location.state.data[0].status277CA : '',
            Filter_ClaimId: props.location.state && props.location.state.data[0] && props.location.state.data[0].Filter_ClaimId ? props.location.state.data[0].Filter_ClaimId : '',
            flag: flag,
            coverage_data: [],
            tradingpartner: [],
            claimsList: [],
            summaryList: [],
            showDetails: false,
            files_list: [],
            errorList: [],
            eventLog: [],
            claimDetails: [],
            claimLineDetails: [],
            Transaction_Compliance: '',
            providerName: '',
            State: props.location.state && props.location.state.data[0].State != 'n' ? props.location.state.data[0].State : '',
            status: props.location.state && props.location.state.data[0].status != 'n' ? props.location.state.data[0].status : '',
            transactionId: props.location.state && props.location.state.data[0].transactionId != 'n' ? props.location.state.data[0].transactionId : '',
            claimStatus: props.location.state && props.location.state.data[0].status != 'n' ? props.location.state.data[0].status : '',
            errorcode: '',
            count: 0,
            recount: 0,
            Firstgridpage: 1,
            apiflag: props.location.state && props.location.state.data[0] ? props.location.state.data[0].apiflag : '',
            pieArray: [],
            labelArray: [],
            orderby: '',
            inner_orderby: '',
            Icdcode: [],
            fileid: '',
            selectedICdCode: '',
            claimid: '',
            Icdcodepresent: '',
            Accidentdate: '',
            nameRotation: 180,
            dateRotation: 180,
            statusRotation: 180,
            submitterRotation: 180,
            claimIdRotation: 180,
            claimStatusRotation: 180,
            subsciberRotation: 180,
            claimAmountRotation: 180,
            errorRotation: 180,
            stateRotation: 180,
            processIdRotation: 180,
            seqID: '',
            fileDataDetails: '',
            page1: 1,
            gridType: 1,
            paginationPageSize: 5,
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
            showerror: '',
            Aggrid_ClaimLineData: ''
        }
    }
    componentDidMount() {
    }
    get_Error = (ClaimID, seqid, fileID) => {
        let query = `{            
            ClaimErrorStages  (ClaimID:"` + ClaimID + `",SeqID:` + seqid + `,FileID:"` + fileID + `") {
            FileID
            ClaimID
            Stage
            StageFileID
            ErrorDesc
            FileName
            FileDate
            MolinaClaimID
            }
        }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls.base_url, {
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
                var data = res.data.ClaimErrorStages

                if (this.state.gridType) {
                    this.setState({
                        Error_data: data

                    })
                } else {
                    this.sortData(fileID, data)
                }

            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }
    getDetails(claimId, fileId, ClaimRefId, fileData, page) {
        let url = Urls.base_url
        let query = `{
            Claim837RTDetails(ClaimID:"`+ claimId + `", FileID: "` + fileId + `", SeqID: ${ClaimRefId}) {
              ClaimID
              ClaimDate
              ClaimTMTrackingID
              Subscriber_ID
              Claim_Amount
              ClaimStatus
              ProviderLastName
              ProviderFirstName
              SubscriberLastName
              SubscriberFirstName
              adjudication_status
              ClaimLevelErrors
              AdmissionDate
              BillingProviderAddress
              BillingProviderCity_State_Zip
              ICDCode
              AccidentDate
              FileID
              FieldToUpdate
              MolinaClaimID
              LXCount
              FileName
              FileDate
              HL20Count
              HL22Count
              HL23Count
              Receiver
              ClaimDateTime
            }
            Claim837RTLineDetails(ClaimID:"`+ claimId + `", FileID: "` + fileId + `", page: ${page} , GridType:${this.state.gridType}) {
                ClaimID
                ServiceLineCount
                ProviderPaidAmount
                ServiceDate
                ProcedureDate
                PaidServiceUnitCount
                RecCount
                MolinaClaimID
                Procedure
                PaidAmount
                ChargeAmt
            }
          }
          `
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(url, {
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
                let _data = res.data
                let count = 1
                if (_data && _data.Claim837RTLineDetails.length > 0) {
                    count = Math.floor(_data.Claim837RTLineDetails[0].RecCount / 10)
                    if (_data.Claim837RTLineDetails[0].RecCount % 10 > 0) {
                        count = count + 1
                    }
                }
                if (_data && res.data.Claim837RTDetails && res.data.Claim837RTDetails.length > 0) {
                    let data = res.data.Claim837RTDetails[0]
                    let claimDetails =
                        [
                            { field_name: 'X12 Claim Id', value: data.ClaimID },
                            { field_name: 'Claim Date', value: data.ClaimDate },
                            { field_name: 'Subscriber First Name', value: data.SubscriberFirstName },
                            { field_name: 'Subscriber Last Name', value: data.SubscriberLastName },
                            { field_name: 'Admission Date', value: data.AdmissionDate },
                            { field_name: 'Claim Amount', value: data.Claim_Amount },
                            { field_name: 'Provider Address', value: data.BillingProviderAddress },
                            { field_name: 'Claim Status', value: data.ClaimStatus },
                            { field_name: 'ICD Code', value: data.Claim_Icdcode },
                            { field_name: 'Accident Date', value: data.AccidentDate },
                            { field_name: '', },
                            { field_name: '', },
                        ]
                    this.setState({
                        showDetails: true,
                        claimDetails: claimDetails,
                        claimLineDetails: res.data.Claim837RTLineDetails,
                        fileid: data.FileID,
                        claimid: data.ClaimID,
                        Icdcodepresent: data.FieldToUpdate,
                        count: count,
                        seqID: ClaimRefId,
                        fileDataDetails: fileData,
                        Aggrid_ClaimLineData: res.data.Claim837RTLineDetails,
                        Aggrid_Claim_Info_data: res.data.Claim837RTDetails
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    getClaimStages(claimId, fileId, seqId) {
        let url = Urls.base_url
        let query = `{
            ClaimStagesInbound(FileID:"${fileId}", ClaimID: "${claimId}", SeqID: ${seqId}) {
              Stage
              Createdatetime
            }
          }
          `
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(url, {
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
                if (res && res.data && res.data.ClaimStagesInbound) {
                    this.setState({
                        claimStageDetails: res.data.ClaimStagesInbound,
                        Aggrid_ClaimStage: res.data.ClaimStagesInbound,
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }



    clickNavigation = (event) => {
        if (event.colDef.headerName == 'File Name') {
            this.setState({
                showClaims: true,
                showerror: false,
                claims_rowData: [],
                Ag_grid_FileName: event.data.FileName,
                Ag_grid_fileDate: moment(event.data.FileDateTime).format('YYYY-MM-DD') != 'Invalid date' ? moment(event.data.FileDateTime).format('YYYY-MM-DD') : '',
                selectedFileId: event.data.STID
            })
        } else if (event.colDef.headerName == "Error Description" && event.data.FileLevelError) {
            this.setState({
                clickedError: event.data.FileLevelError
            }, () => {
                $('#error_modal').modal('show')
            })

        }
    }

    updateFields = (fieldType, sortType, startRow, endRow, filterArray) => {
        this.setState({
            fieldType: fieldType,
            sortType: sortType,
            startRow: startRow,
            endRow: endRow,
            filterArray: filterArray,
        })
    }

    postData = (data) => {
        this.setState({
            showClaims: true,
            Ag_grid_FileName: data && data.length > 0 ? data[0].FileName : '',
            Ag_grid_fileDate: (data && data.length > 0 && moment(data[0].FileDateTime).format('YYYY-MM-DD') != 'Invalid date') ? moment(data[0].FileDateTime).format('YYYY-MM-DD') : '',
            selectedFileId: data && data.length > 0 ? data[0].STID : ''
        })
    }

    _renderList = () => {
        let columnDefs = this.state.generalStatus == "File Rejected" || this.state.claimStatus == "Rejected" ? [
            { headerName: "File Name", field: "FileName", width: 150, cellStyle: { color: '#139DC9', cursor: 'pointer'  } },
            // { headerName: "File Date", field: "FileDate", width: 100 },
            { headerName: "Submitter Name", field: "Submitter_Name", width: 100 },
            { headerName: "Receiver Name", field: "Receiver_Name", width: 100 },
            { headerName: "GSID", field: "GSID", width: 100 },
            { headerName: "STID", field: "STID", width: 100 },
            { headerName: "Rejected Claims", field: "RejectedClaims", width: 150 },
            { headerName: "Total Claim", field: "total_claim", width: 150 },
            { headerName: "Submitter Identification Code", field: "Submitter_Identification_Code", width: 200 },
            { headerName: "Receiver Identification Code", field: "Receiver_Identification_Code", flex:1 },
          
        ] : [
            { headerName: "File Name", field: "FileName", width: 150, cellStyle: { color: '#139DC9', cursor: 'pointer'  } },
            // { headerName: "File Date", field: "FileDate", width: 100 },
            { headerName: "Submitter Name", field: "Submitter_Name", width: 100 },
            { headerName: "Receiver Name", field: "Receiver_Name", width: 100 },
            { headerName: "GSID", field: "GSID", width: 100 },
            { headerName: "STID", field: "STID", width: 100 },
            { headerName: "Rejected Claims", field: "RejectedClaims", width: 150 },
            { headerName: "Total Claim", field: "total_claim", width: 150 },
            { headerName: "Submitter Identification Code", field: "Submitter_Identification_Code", width: 200 },
            { headerName: "Receiver Identification Code", field: "Receiver_Identification_Code", flex:1 },
          
            ]
        let filter = this.state.filterArray && this.state.filterArray.length > 0 ? JSON.stringify(this.state.filterArray).replace(/"([^"]*)":/g, '$1:') : '[]'
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
 
            // ClaimID:"${this.state.Filter_ClaimId}"

        let query = `{
            Dashboard837TransactionSetHeaderDetails(
                        sorting: [{colId:"${this.state.fieldType}", sort:"${this.state.sortType}"}], 
                        startRow: ${this.state.startRow}, endRow: ${this.state.endRow},Filter: ${filter},
                        
                        Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State ? this.state.State : ''}",
                        Provider:"${this.state.providerName}",StartDt:"${startDate}",EndDt:"${endDate}",
                        Claimstatus:"${this.state.claimStatus ? this.state.claimStatus : ''}", Type : "` + this.state.type + `" , 
                         RecType: "Inbound",
                        LoadStatus:"${this.state.gridflag}", Status:"${this.state.generalStatus}", 
                        MCGStatus:"${this.state.mcgStatus}", FileID: "${this.state.incoming_fileId}", 
                        Status277CA:"${this.state.status277CA}",
                ) {
                    RecCount
                FileID
                FileName
                GSID
                STID
                Submitter_Name
                Receiver_Name
                total_claim
                RejectedClaims
                Submitter_Identification_Code
                Receiver_Identification_Code
                  }
                }`
        return (
            <div style={{ padding: '0', marginTop: '24px' }}>
                <ServersideGrid
                    columnDefs={columnDefs}
                    query={query}
                    url={Urls._transaction837}
                    paginationPageSize={5}
                    index={'Dashboard837TransactionSetHeaderDetails'}
                    State={this.state.State}
                    fieldType={'FileID'}
                    postData={this.postData}
                    selectedTradingPartner={this.state.selectedTradingPartner}
                    startDate={startDate}
                    endDate={endDate}
                    type={this.state.type}
                    filterClaim={this.state.Filter_ClaimId}
                    updateFields={this.updateFields}
                    onClick={this.clickNavigation}
                />
            </div>
        )
    }

    errorDialog = () => {
        return (
            <div className="modal" id="error_modal" role="dialog" aria-labelledby="myModalLabel2" data-backdrop="static" data-keyboard="false">
                <div className="modal-dialog-error">
                    <div className="error-dialog">
                        <div className="error-header">Error Description</div>
                        <div className="scroll-div">
                            {this.state.clickedError}
                        </div>
                        <br />
                        <div className="btnDesign close-button clickable"
                            onClick={() => {
                                $('#error_modal').modal('hide')
                            }}>
                            Close
                        </div>
                        <br />
                    </div>
                </div>
            </div>
        )
    }

    clickNavigationClaims = (event) => {
        if (event.colDef.headerName == 'Molina Claim Id') {
            this.setState({
                showerror: true,
                claimError_Status: event.data.ClaimStatus,
                Error_data: [],
                Aggrid_ClaimLineData: [],
                Aggrid_Claim_Info_data: [],
                Aggrid_ClaimStage: [],
            })
            this.get_Error(event.data.ClaimID, event.data.ClaimRefId, event.data.FileID)
            this.getDetails(event.data.ClaimID, event.data.FileID, event.data.ClaimRefId, "", 1)
            this.getClaimStages(event.data.ClaimID, event.data.FileID, event.data.ClaimRefId)
        } else if (event.colDef.headerName == "835 Process Id" && event.data.ProcessID835) {
            sessionStorage.setItem('isOutbound', true)

            let data = [
                {
                    apiflag: '0',
                    State: 'n',
                    selectedTradingPartner: 'n',
                    startDate: 'n',
                    endDate: 'n',
                    transactionId: 'n',
                    status: 'n',
                    count: 'n',
                    incoming_fileId: event.data.ProcessID835
                }
            ]
            this.props.history.push('/' + Strings.claimPayment_835_details, {
                data: data
            })

            window.location.reload()

        }
    }

    _renderClaims() {
        let columnDefs= [
            { headerName: "File Name", field: "FileName", cellStyle: {  color: '#139DC9', cursor: 'pointer' } },
            { headerName: "ClaimID", field: "ClaimID", width: 100 },
            { headerName: "Subscriber Name", field: "SubscriberName", width: 100 },
            { headerName: "Provider Name", field: "ProviderName", width: 100 },
            { headerName: "Provider Address", field: "ProviderAddress", width: 100 },
            { headerName: "Claim Charge Amount", field: "ClaimChargeAmt", width: 100 },
            { headerName: "DRG Code", field: "DRGCode", width: 100 },
           
        ]
        let filter = this.state.filterArray && this.state.filterArray.length > 0 ? JSON.stringify(this.state.filterArray).replace(/"([^"]*)":/g, '$1:') : '[]'
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        
        let query = `{
            Claim837RTProcessingSummaryNew(
                    sorting: [{colId:"${this.state.fieldType}", sort:"${this.state.sortType}"}], 
                    startRow: ${this.state.startRow}, endRow: ${this.state.endRow},Filter: ${filter},
                    
                   Sender:"${this.state.selectedTradingPartner}", State:"${this.state.State ? this.state.State : ''}",Provider:"${this.state.providerName}",
                    StartDt:"",EndDt:"",Claimstatus:"${this.state.generalStatus}", FileID : "` + this.state.selectedFileId + `", 
                    Type : "` + this.state.type + `" ,  RecType: "Inbound",
                    FileStatus : "${this.state.claimStatus ? this.state.claimStatus : ''}", 
                    LoadStatus:"${this.state.gridflag}", MCGStatus: "${this.state.mcgStatus}", 
                    Status277CA:"${this.state.status277CA}" ,ClaimID:"${this.state.Filter_ClaimId}"
            ) {
                RecCount
                FileID
                FileName
                GSID
                STID
                ProviderName
                ProviderAddress
                SubscriberName
                ClaimID
                ClaimChargeAmt
                DRGCode
            }
          }`
        return (
            <div style={{ padding: '0', marginTop: '24px' }}>
                <h6 className="font-size">Claim  Information For <label style={{ color: 'var(--main-bg-color)' }}>(File Name: {this.state.Ag_grid_FileName}, File Date: {this.state.Ag_grid_fileDate})</label></h6>
                <ServersideGrid
                    columnDefs={columnDefs}
                    query={query}
                    url={Urls._transaction837}
                    index={'Claim837RTProcessingSummaryNew'}
                    State={this.state.State}
                    fieldType={'FileID'}
                    paginationPageSize={5}
                    selectedTradingPartner={this.state.selectedTradingPartner}
                    startDate={startDate}
                    endDate={endDate}
                    selectedFileId={this.state.selectedFileId}
                    filterClaim={this.state.Filter_ClaimId}
                    updateFields={this.updateFields}
                    onClick={this.clickNavigationClaims}
                />
            </div>
        )
    }

    _renderError() {
        if (this.state.Error_data == undefined) { this.state.Error_data = [] }
        process.env.NODE_ENV == 'development' && console.log("_renderError", this.state.Error_data);

        let columnDefs = this.state.status277CA == "Rejected" ?
            [

                { headerName: "Stage", field: "Stage", width: 100 },
                { headerName: "Molina Claim ID", field: "MolinaClaimID", width: 170 },
                { headerName: "X12 Claim ID", field: "ClaimID", width: 170 },
                { headerName: "277CA Error", field: "Error_277CA", flex: 1, cellStyle: { color: '#139DC9', cursor: 'pointer' } },

            ] : [

                { headerName: "Stage", field: "Stage", width: 100 },
                { headerName: "Molina Claim ID", field: "MolinaClaimID", width: 170 },
                { headerName: "X12 Claim ID", field: "ClaimID", width: 170 },
                { headerName: "Error Description", field: "ErrorDesc", flex: 1, cellStyle: { color: '#139DC9', cursor: 'pointer' } },

            ]

        return (
            <div>
                <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
                    {/* <h6 className="font-size">Claim Error Description</h6> */}
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
                        rowData={this.state.Error_data}
                        enableCellTextSelection={true}
                        onCellClicked={(event) => {
                            if (event.colDef.headerName == "Error Description" && event.data.ErrorDesc) {
                                this.setState({
                                    clickedError: event.data.ErrorDesc
                                }, () => {
                                    $('#error_modal').modal('show')
                                })

                            }
                        }}

                    >
                    </AgGridReact>
                </div>
            </div>
        )
    }
    _ClaimLineTable() {
        if (this.state.Aggrid_ClaimLineData == undefined) { this.state.Aggrid_ClaimLineData = [] }
        let columnDefs = [
            { headerName: "Molina Claim ID", field: "MolinaClaimID" },
            { headerName: "X12 Claim ID", field: "ClaimID" },

            { headerName: "Service Line No.", field: "ServiceLineCount" },
            // { headerName: " Service Date", field: "ServiceDate" },
            // { headerName: "Procedure Code", field: "ProcedureDate" },
            // { headerName: "Unit", field: "PaidServiceUnitCount", flex: 1 },
            { headerName: "Procedure", field: "Procedure" },
            { headerName: "Total Charge Amount", field: "ChargeAmt" },
            { headerName: "Total Paid Amount", field: "PaidAmount", },

        ]

        return (
            <div>
                <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
                    <h6 className="font-size">Claim Line Data</h6>
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
                        rowData={this.state.Aggrid_ClaimLineData}
                        enableCellTextSelection={true}

                    >
                    </AgGridReact>
                </div>
            </div>
        )
    }
    _ClaimView_Info_Table() {
        if (this.state.Aggrid_Claim_Info_data == undefined) { this.state.Aggrid_Claim_Info_data = [] }
        let columnDefs = [
            { headerName: " File Name", field: "FileName", cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Receiver", field: "Receiver", width: 100 },
            { headerName: " HL20 Count", field: "HL20Count", width: 80 },
            { headerName: "HL22 Count", field: "HL22Count", width: 80 },
            { headerName: "HL23 Count", field: "HL23Count", width: 80 },
            { headerName: "Molina Claim Id", field: "MolinaClaimID", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "X12 Claim Id", field: "ClaimID", width: 100 },
            { headerName: "Claim Date", field: "ClaimDateTime", width: 100 },
            { headerName: "Subscriber First Name", field: "SubscriberFirstName", width: 100 },
            { headerName: "Subscriber Last Name", field: "SubscriberLastName", width: 100 },
            { headerName: "Admission Date", field: "AdmissionDate", width: 100 },
            { headerName: "Claim Amount", field: "Claim_Amount", width: 100 },
            { headerName: "Provider Address", field: "BillingProviderAddress", width: 140, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Claim Status", field: "ClaimStatus", width: 100 },
            { headerName: "ICD Code", field: "ICDCode", width: 100 },
            { headerName: "Accident Date", field: "AccidentDate", width: 120 },
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
                        rowData={this.state.Aggrid_Claim_Info_data}
                        enableCellTextSelection={true}                    >
                    </AgGridReact>
                </div>
            </div>
        )
    }

    _ClaimStage() {
        if (this.state.Aggrid_ClaimStage == undefined) { this.state.Aggrid_ClaimStage = [] }
        let columnDefs = [
            { headerName: "Stage", field: "Stage" },
            { headerName: "Date", field: "Createdatetime" },
        ]

        return (
            <div>
                <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
                    <h6 className="font-size">Claim Stage</h6>
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
                        rowData={this.state.Aggrid_ClaimStage}



                    >
                    </AgGridReact>
                </div>
            </div>
        )
    }

    _refreshScreen = () => {

    }

    onGridChange = (event) => {
        this.setState({
            page: 1,
            rowData: [],
            claimsAudit: [],
            showerror: false,
            showClaims: false,
            showDetails: false,
            gridType: event.target.options[event.target.selectedIndex].text == 'Default' ? 0 : 1
        }, () => {
            // this.getData()
        })
    }

    update = (key, value) => {
        this.setState({
            [key]: value,
            showDetails: false,
            showerror: false,
            showClaims: false
        }, () => {
            this._refreshScreen()
        })
    }

    _renderTopbar = () => {
        return (
            <Filters
                isTimeRange={false}
                setData={this.setData}
                State={this.state.State}
                selectedTradingPartner={this.state.selectedTradingPartner}
                onGridChange={this.onGridChange}
                update={this.update}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                Filter_ClaimId={this.state.Filter_ClaimId}
                showclaimId={true}
                isMolina={true}
                removeGrid={true}
            />
        )
    }

    render() {
        return (
            <div>
                <h5 className="headerText">Claims Details {this.state.subtitle ? <label style={{ fontSize: "14px" }}>({this.state.subtitle})</label> : ""}  </h5>
                {this._renderTopbar()}
                <div>
                    {this._renderList()}
                    {this.state.showClaims && this.state.selectedFileId ? this._renderClaims() : null}
                    {this.state.showerror && (this.state.claimError_Status == "Rejected" || this.state.status277CA == "Rejected") ? this._renderError() : null}
                    {this.state.showerror ? this._ClaimView_Info_Table() : null}
                    {this.state.showerror ? this._ClaimLineTable() : null}
                    {/* {this.state.showerror ? this._ClaimStage() : null} */}
                </div>
                {this.errorDialog()}
            </div>
        );
    }
}