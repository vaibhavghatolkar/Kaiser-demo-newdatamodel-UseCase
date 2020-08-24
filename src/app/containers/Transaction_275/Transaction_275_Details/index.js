import React from 'react'
import '../../Claims/Dashboard/styles.css'
import '../../Claim_276_RealTime/Real_Time_276/style.css'
import '../../color.css'
import '../../Files/files-styles.css';
import moment from 'moment';
import Urls from '../../../../helpers/Urls';
import Strings from '../../../../helpers/Strings';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { Filters } from '../../../components/Filters';
import { ServersideGrid } from '../../../components/ServersideGrid';

var val = ''
const $ = window.$;
export class Transaction_275_Details extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // page: 1,
            fileDetails: [],
            type: props.location.state && props.location.state.data[0] && props.location.state.data[0].type ? props.location.state.data[0].type : "",
            selectedTradingPartner: props.location.state && props.location.state.data[0] && props.location.state.data[0].selectedTradingPartner != 'n' ? props.location.state.data[0].selectedTradingPartner : '',
            startDate: props.location.state && props.location.state.data[0] && props.location.state.data[0].startDate != 'n' ? props.location.state.data[0].startDate : '',
            endDate: props.location.state && props.location.state.data[0] && props.location.state.data[0].endDate != 'n' ? props.location.state.data[0].endDate : '',
            incoming_fileId: props.location.state && props.location.state.data[0] && props.location.state.data[0].incoming_fileId ? props.location.state.data[0].incoming_fileId : '',
            subtitle: props.location.state && props.location.state.data[0] && props.location.state.data[0].subtitle ? props.location.state.data[0].subtitle : '',
            State: props.location.state && props.location.state.data[0] && props.location.state.data[0].State != 'n' ? props.location.state.data[0].State : '',
            clickStatus: props.location.state && props.location.state.data[0] && props.location.state.data[0].clickStatus && props.location.state.data[0].clickStatus != 'n' ? props.location.state.data[0].clickStatus : '',
             Firstgridpage: 1,
          
             domLayout: 'autoHeight',
            paginationPageSize: 5,
            selectedFileId: '',
            defaultColDef: {
                cellClass: 'cell-wrap-text',
                autoHeight: true,
                sortable: true,
                resizable: true,
                filter: true,

            },
        } 
    }
    componentDidMount() {     
    }
    showDetails() {
        this.setState({
            showDetails: true,
            orderby: ''
        })
    }

 
    // errorDialog = () => {
    //     return (
    //         <div className="modal" id="payment_error_modal" role="dialog" aria-labelledby="myModalLabel2" data-backdrop="static" data-keyboard="false">
    //             <div className="modal-dialog-error">
    //                 <div className="error-dialog">
    //                     <div className="error-header">Error Description</div>
    //                     <div className="scroll-div">
    //                         {this.state.clickedError}
    //                     </div>
    //                     <br />
    //                     <div className="btnDesign close-button clickable"
    //                         onClick={() => {
    //                             $('#payment_error_modal').modal('hide')
    //                         }}>
    //                         Close
    //                     </div>
    //                     <br />
    //                 </div>
    //             </div>
    //         </div>
    //     )
    // }

    clickNavigationClaims = (event) => {
        if (event.colDef.headerName == 'Claim Id') {
            this.setState({

                // showerror: true,
                // Error_data: [],
                // Aggrid_ClaimLineData: [],
                // Aggrid_Claim_Info_data: [],
                // Aggrid_Service_Line_Info: [],

            })
            // this.getDetails(event.data.ClaimID, event.data.FileID, event.data.RefID, "", 1)
        }
    }

    _renderClaims = () => {
        let columnDefs = [
            { headerName: "Claim Id", field: "ClaimID", width: 300, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Patient Name", field: "Patient_name", width: 70, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
           { headerName: "Attachment Control Number", field: "AttachmentControlNumber", width: 120 },
            { headerName: "Attachment Type", field: "Attachment_Type", width: 120 },
            // { headerName: "LX", field: "LX", width: 120 },
            // { headerName: "TRN01", field: "TRN01", width: 120 },
                // { headerName: "OOI03", field: "OOI03", width: 120 },
                // { headerName: "BDS02", field: "BDS02", width: 120 },
            { headerName: "Attachment Information", field: "Attachment_Information", width: 120 },
        
            
        ]
        let filter = this.state.filterArray && this.state.filterArray.length > 0 ? JSON.stringify(this.state.filterArray).replace(/"([^"]*)":/g, '$1:') : '[]'
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        
        let query = `{
            AttachmentDetail275(
                sorting: [{colId:"${this.state.fieldType}", sort:"${this.state.sortType}"}], 
                startRow: ${this.state.startRow}, endRow: ${this.state.endRow},Filter: ${filter},                    
                Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",
               StartDt:"` + startDate + `",EndDt:"` + endDate + `",FileID:"${this.state.selectedFileId}"
              
        ) {
            RecCount
            FileID
            CreateDateTime
            FileName
            State
            ClaimID
            ProviderName
            AttachmentControlNumber
            Attachment_Type
            LX
            TRN01
            OOI03
            Attachment_Information
            BDS02
            Patient_name
          }
              }`
              if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        return (
            <div style={{ padding: '0', marginTop: '24px' }}>
                <h6 className="font-size">Attachment Details For <label style={{ color: 'var(--main-bg-color)' }}>(File Name:-{this.state.Ag_grid_FileName} , File Date:-{this.state.Ag_grid_fileDate})</label></h6>
                <ServersideGrid
                    columnDefs={columnDefs}
                    query={query}
                    paginationPageSize={5}
                    url={Urls.transaction275}
                    fieldType={'CreateDateTime'}
                    index={'AttachmentDetail275'}
                    State={this.state.State}
                    selectedTradingPartner={this.state.selectedTradingPartner}
                    startDate={startDate}
                    selectedFileId={this.state.selectedFileId}
                    endDate={endDate}
                    updateFields={this.updateFields}
                    onClick={this.clickNavigationClaims}
                />
            </div>
        )
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
    clickNavigation = (event) => {
        if (event.colDef.headerName == 'File Name') {
            this.setState({
                showClaims: true,
                showerror: false,
                claims_rowData: [],
                Ag_grid_FileName: event.data.FileName,
                Ag_grid_fileDate: event.data.CreateDateTime,
                selectedFileId: event.data.FileID,
            })
        } else if (event.colDef.headerName == "Error Description" && event.data.ErrorDescription) {
            this.setState({
                clickedError: event.data.ErrorDescription
            }, () => {
                $('#payment_error_modal').modal('show')
            })

        }
    }

    postData = (data) => {
     console.log(data)
        this.setState({
            showClaims: true,
            Ag_grid_FileName: data && data.length > 0 ? data[0].FileName : '',
            Ag_grid_fileDate: data && data.length > 0 ? data[0].CreateDateTime : '',
            selectedFileId: data && data.length > 0 ? data[0].FileID : ''
        })
    }
    _renderList = () => {
        let columnDefs = [
            
            { headerName: "File Name", field: "FileName", cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' }},
            { headerName: "State", field: "State",},
            { headerName: "Process Id", field: "ProcessID", },
            { headerName: "File Date", field: "CreateDateTime",},                
            // { headerName: "Patient Name", field: "Patient_name",},
            { headerName: "Provider Name", field: "ProviderName",  },
            { headerName: "File Status", field: "FileStatus",  },
            { headerName: "Total Attachment", field: "total_attachment",  },
                // { headerName: "File Serve Verified", field: "", width: 150 },
                // { headerName: "Attachment Control Number", field: "AttachmentControlNumber", width: 120 },
                // { headerName: "Attachment Information", field: "AttachmentInformation", width: 120 },

        ]

        // controller.abort()
        // controller = new AbortController()
        let filter = this.state.filterArray && this.state.filterArray.length > 0 ? JSON.stringify(this.state.filterArray).replace(/"([^"]*)":/g, '$1:') : '[]'
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        let query = `{
            DashboardFileDetails275(
                sorting: [{colId:"${this.state.fieldType}", sort:"${this.state.sortType}"}], 
                startRow: ${this.state.startRow}, endRow: ${this.state.endRow},Filter: ${filter},                    
                Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",
               StartDt:"` + startDate + `",EndDt:"` + endDate + `" ,FileID:"${this.state.incoming_fileId}",
               Request:"${this.state.clickStatus}"
                
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
          }
          `

          if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        return (
            <div style={{ padding: '0', marginTop: '24px' }}>
                <ServersideGrid
                    columnDefs={columnDefs}
                    query={query}
                    url={Urls.transaction275}
                    paginationPageSize={5}
                    fieldType={'CreateDateTime'}
                    index={'DashboardFileDetails275'}
                    State={this.state.State}
                    selectedTradingPartner={this.state.selectedTradingPartner}
                    startDate={startDate}
                    postData={this.postData}
                    endDate={endDate}
                    type={this.state.type}
                    updateFields={this.updateFields}
                    onClick={this.clickNavigation}
                />
            </div>
        )
    }
    _refreshScreen = () => {
       
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
                State={this.state.State}
                removeGrid={true}
                changeDefault={true}
             
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
                <h5 className="headerText">Patient Information Details {this.state.subtitle ? <label style={{ fontSize: "14px" }}>({this.state.subtitle})</label> : ""}</h5>
                {this._renderTopbar()}
                        <div>
                            {this._renderList()}
                            {this.state.showClaims && this.state.selectedFileId ? this._renderClaims() : null}
                            {this.state.showerror ? this._ClaimView_Info_Table() : null}
                            {this.state.showerror ? this._ClaimServiceLineInfo() : null}

                        </div>
                       
                {/* {this.errorDialog()} */}
            </div>
        );
    }
}