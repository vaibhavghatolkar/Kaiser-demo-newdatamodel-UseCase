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
export class LockBoxFlatFileDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            FileNameData:''
        }
    }
    componentWillMount() {
    }
    _renderClaims = () => {            
        let   columnDefs = [
            { headerName: "File Name", field: "FileName", width: 150, },
            { headerName: "File Date", field: "FileDate", width: 140, },
            { headerName: "Instance ID", field: "Instance_ID", width: 140, },
            { headerName: "HBorPB", field: "HBorPB", width: 140, },
            { headerName: "Invoice Number", field: "Invoice_Number", width: 140, },
            { headerName: "First Letter", field: "First_Letter", width: 140, },
         
        ]    
        let filter = this.state.filterArray && this.state.filterArray.length > 0 ? JSON.stringify(this.state.filterArray).replace(/"([^"]*)":/g, '$1:') : '[]'
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        let recType = isOutbound ? 'Outbound' : 'Inbound'
        let   query = `{
            LockBoxFlatFileDetails(                                     
                    sorting: [{colId:"${this.state.fieldType}", sort:"${this.state.sortType}"}],
                       startRow: ${this.state.startRow}, endRow:  ${this.state.endRow},Filter: ${filter}
                       FileName:"${this.state.FileNameData}", StartDt:"${startDate}" EndDt:"${endDate}"
                ) {
                    RecCount
                    FileName
                    FileDate
                    Instance_ID
                    HBorPB
                    Invoice_Number
                    First_Letter
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
                    index={'LockBoxFlatFileDetails'}
                    State={this.state.State}
                    selectedTradingPartner={this.state.selectedTradingPartner}
                    startDate={startDate}
                    selectedFileId={this.state.FileNameData}
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
                FileNameLockBox={true}
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
                <h5 className="headerText">Lockbox Flat Files Details </h5>
                {this._renderTopbar()}
                <div>
                    {this._renderClaims()}
                </div>
            </div>
        );
    }
}