import React from 'react'
import '../../Claims/Dashboard/styles.css'
import '../../Claim_276_RealTime/Real_Time_276/style.css'
import '../../color.css'
import '../../Files/files-styles.css';
import moment from 'moment';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { ServersideGrid } from '../../../components/ServersideGrid';
import Urls from '../../../../helpers/Urls';
import { Filters } from '../../../components/Filters';
import Strings from '../../../../helpers/Strings';
let isOutbound;
export class TreasuryFileDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            FileNameData:'',
            CompanyDesc:'HCCLAIMPMT',
            showdetails:false,
            FileNameData1:''
        }
    }
    componentWillMount() {
     
    }
   
    _renderClaims = () => {            

        let   columnDefs = [
            { headerName: "File Name 835", field: "FileName835", flex: 1, cellStyle: { color: '#139DC9', cursor: 'pointer' } },
            // { headerName: "File ID 835", field: "FileID835", flex: 1,  },
            // { headerName: "STID", field: "STID", flex: 1,  },
            { headerName: "Trace Number", field: "Trace_Number", flex: 1,  },
            { headerName: "File Name", field: "FileName", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal',  } },
            { headerName: "File Date", field: "FileDate", width: 140, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Company Description", field: "Company_Description", flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Transaction Description", field: "Tran_Descr", width: 200, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Ext Ref ID", field: "Ext_Ref_ID", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Bank Date", field: "Bank_Date", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Memo Details", field: "Memo_Details", width: 130, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Kaiser Reference", field: "Kaiser_Reference", flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Transaction Code", field: "Tran_Code", flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Bank Account Number", field: "Bank_Account_Number", flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Transaction Amount", field: "Tran_Amt", flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Company Name", field: "Company_Name", flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Receiver Name", field: "Receiver_Name", flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Receiver Account Number", field: "Receiver_Account_Number", flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
         
            { headerName: "Individual ID", field: "Individual_ID", flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Transaction Amount", field: "Tran_Amt", flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Federal Tax", field: "Federal_Tax", flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },

               
        ]    
        let filter = this.state.filterArray && this.state.filterArray.length > 0 ? JSON.stringify(this.state.filterArray).replace(/"([^"]*)":/g, '$1:') : '[]'
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        let recType = isOutbound ? 'Outbound' : 'Inbound'
      
      
        let   query = `{
            TreasuryFileDetails(                                     
                    sorting: [{colId:"${this.state.fieldType}", sort:"${this.state.sortType}"}],
                       startRow: ${this.state.startRow}, endRow:  ${this.state.endRow},Filter: ${filter} , CompanyDescription:"${this.state.CompanyDesc}",
                       FileName:"${this.state.FileNameData1}", StartDt:"${startDate}" EndDt:"${endDate}"
                ) {
          
                    RecCount
                    FileName
                    FileDate
                    Tran_Descr
                    Ext_Ref_ID
                    Bank_Date
                    Memo_Details
                    Kaiser_Reference
                    Tran_Code
                    Tran_Amt
                    Company_Description
                    Bank_Account_Number
                    Company_Name
                    Receiver_Account_Number
                    Trace_Number
                    Federal_Tax
                    Individual_ID
                    Receiver_Name
                    FileName835
                    FileID835
                    STID
                    
  
                    }
                  }`
        
        
       
        return (
            <div style={{ padding: '0', marginTop: '24px' }}>
                <ServersideGrid
                    columnDefs={columnDefs}
                    query={query}
                    paginationPageSize={10}
                    url={Urls._transaction835Kaiser}
                    fieldType={'FileDate'}
                    index={'TreasuryFileDetails'}
                    State={this.state.State}
                    selectedTradingPartner={this.state.selectedTradingPartner}
                    startDate={startDate}
                    selectedFileId={this.state.FileNameData1}
                    filterClaim={this.state.CompanyDesc}
                    endDate={endDate}
                    updateFields={this.updateFields}
                     handleColWidth = {140}
                     onClick={this.clickNavigation1}
                />
            </div>
        )
    }
    _render_List = () => {            

        let   columnDefs = [
            { headerName: "File Name", field: "FileName", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
            { headerName: "File Date", field: "FileDate", width: 140, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Ext Ref ID", field: "Ext_Ref_ID", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Kaiser Reference", field: "Kaiser_Reference", flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Transaction Code", field: "Tran_Code", flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Transaction Description", field: "Tran_Descr", width: 200, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Company Name", field: "Company_Name", flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },

        ]    
        let filter = this.state.filterArray && this.state.filterArray.length > 0 ? JSON.stringify(this.state.filterArray).replace(/"([^"]*)":/g, '$1:') : '[]'
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        let recType = isOutbound ? 'Outbound' : 'Inbound'
      
      
        let   query = `{
            TreasuryFileLevelDetails(                                     
                    sorting: [{colId:"${this.state.fieldType}", sort:"${this.state.sortType}"}],
                       startRow: ${this.state.startRow}, endRow:  ${this.state.endRow},Filter: ${filter} , CompanyDescription:"${this.state.CompanyDesc}",
                       FileName:"${this.state.FileNameData}", StartDt:"${startDate}" EndDt:"${endDate}"
                ) {
          
                    RecCount
                    FileName
                    FileDate
                    Tran_Descr
                    Ext_Ref_ID
                    Kaiser_Reference
                    Tran_Code
                    Company_Name
                    Trace_Number
                    FileName835
                    FileID835
                    STID
                  
                    }
                  }`
        
        
       
        return (
            <div style={{ padding: '0', marginTop: '24px' }}>
                <ServersideGrid
                    columnDefs={columnDefs}
                    query={query}
                    paginationPageSize={10}
                    url={Urls._transaction835Kaiser}
                    fieldType={'FileName835'}
                    index={'TreasuryFileLevelDetails'}
                    State={this.state.State}
                    selectedTradingPartner={this.state.selectedTradingPartner}
                    startDate={startDate}
                  
                    filterClaim={this.state.CompanyDesc}
                    endDate={endDate}
                    updateFields={this.updateFields}
                    onClick={this.clickNavigation}
                    handleColWidth = {140}
                    sorting={true}

                />
            </div>
        )
    }

    
    clickNavigation = (event) => {
        if (event.colDef.headerName == 'File Name') {
        
            this.setState({
                FileNameData1:event.data.FileName,
                showdetails: true,
              

            })
      
        }
       
    }
    clickNavigation1 = (event) => {
        if (event.colDef.headerName == "File Name 835" && event.data.FileName835) {
            let data = [
               {
                status:'n',
                State:'',
                CheckEFTNo: event.data.Trace_Number
               }
           ]
           this.props.history.push('/' + Strings.InboundPaymentDetails, {
               data: data
           })

           window.location.reload()

       }
       
    }

    _renderTopbar = () => {
        return (
            <Filters
                isTimeRange={false}
                removeSubmitter={true}
                removeGrid={true}
                setData={this.setData}
                changeDefault={true}
                onGridChange={this.onGridChange}
                update={this.update}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                removeState={true}
                FileNameKaiser={true}
                CompanyDescKaiser={true}
            />
        )
    }

    update = (key, value) => {
        this.setState({
            [key]: value,
        }, () => {
            // this._refreshScreen()
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
    
  

    render() {

        return (
            <div>
                <h5 className="headerText">Treasury File Details </h5>
                {this._renderTopbar()}
                <div>
                {this._render_List()}
                    {this.state.showdetails ? this._renderClaims (): null}
                   

                </div>

               
            </div>
        );
    }
}