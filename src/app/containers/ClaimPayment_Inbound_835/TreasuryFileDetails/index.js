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

let isOutbound;
export class TreasuryFileDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            
        }
    }
    componentWillMount() {
     
    }
   
    _renderClaims = () => {            

        let   columnDefs = [
            { headerName: "File Name", field: "FileName", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
            { headerName: "File Date", field: "FileDate", width: 140, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Transaction Description", field: "Tran_Descr", width: 200, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Ext Ref ID", field: "Ext_Ref_ID", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Bank Date", field: "Bank_Date", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Memo Details", field: "Memo_Details", width: 130, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Kaiser Reference", field: "Kaiser_Reference", flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Transaction Code", field: "Tran_Code", flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Account Number", field: "Account_Number", flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Transaction Amount", field: "Tran_Amt", flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
        ]    
        let filter = this.state.filterArray && this.state.filterArray.length > 0 ? JSON.stringify(this.state.filterArray).replace(/"([^"]*)":/g, '$1:') : '[]'
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        let recType = isOutbound ? 'Outbound' : 'Inbound'
      
      
        let   query = `{
            TreasuryFileDetails(                                     
                    sorting: [{colId:"${this.state.fieldType}", sort:"${this.state.sortType}"}],
                       startRow: ${this.state.startRow}, endRow:  ${this.state.endRow},Filter: ${filter}
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
                    Account_Number
                    Tran_Amt
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
                    selectedFileId={this.state.selectedFileId}
                    endDate={endDate}
                    updateFields={this.updateFields}
                    onClick={this.clickNavigationClaims}
                    handleColWidth = {140}
                />
            </div>
        )
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
                    {this._renderClaims()}
                   

                </div>

               
            </div>
        );
    }
}