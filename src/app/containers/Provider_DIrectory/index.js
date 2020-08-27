import React from 'react';
import '../Files/files-styles.css';
import '../color.css'
import moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

export class ProviderDirectory extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            startDate: moment().subtract(365, 'd').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
            selectedTradingPartner: '',
            State: '',
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
            rowData: []
        }

    }



    

    _renderList() {
        let rowData = [
            {"Provider":"A", "Specialty":"", "Provider_type":"", "Phone":"", "Address":"", "Language":"", "Medicaid":"", "National_provider":"", "Bookmark":""},
            {"Provider":"Ali Jones", "Specialty":"All", "Provider_type":"PCP", "Phone":"408-125-1230", "Address":"120 Health", "Language":"English", "Medicaid":"Yes", "National_provider":"1139280183", "Bookmark":""},
            {"Provider":"Anthony Olivia", "Specialty":"All", "Provider_type":"PCP", "Phone":"408-187-1650", "Address":"241 Health", "Language":"English", "Medicaid":"NO", "National_provider":"5524244243", "Bookmark":""},
            {"Provider":"B", "Specialty":"", "Provider_type":"", "Phone":"", "Address":"", "Language":"", "Medicaid":"", "National_provider":"", "Bookmark":""},
            {"Provider":"Blain Smith", "Specialty":"Dermatology", "Provider_type":"PCP", "Phone":"221-245-1230", "Address":"", "Language":"English, Spanish", "Medicaid":"Yes", "National_provider":"1239280183", "Bookmark":""},
            {"Provider":"C", "Specialty":"", "Provider_type":"", "Phone":"", "Address":"", "Language":"", "Medicaid":"", "National_provider":"", "Bookmark":""},
            {"Provider":"CBA Health", "Specialty":"Family Practice", "Provider_type":"Medical Group", "Phone":"408-345-1230", "Address":"", "Language":"English, Spanish", "Medicaid":"Yes", "National_provider":"1339280183", "Bookmark":""},
            {"Provider":"D", "Specialty":"", "Provider_type":"", "Phone":"", "Address":"", "Language":"", "Medicaid":"", "National_provider":"", "Bookmark":""},
            {"Provider":"Daniel Anthony", "Specialty":"Family Practice", "Provider_type":"Medical Group", "Phone":"", "Address":"250 Avenue", "Language":"English, Spanish", "Medicaid":"Yes", "National_provider":"1339280557", "Bookmark":""},
            {"Provider":"David Alexander", "Specialty":"All", "Provider_type":"Medical Group", "Phone":"408-345-6640", "Address":"250 Hartford Avenue", "Language":"English, Spanish", "Medicaid":"Yes", "National_provider":"5549280183", "Bookmark":""},
            {"Provider":"Daniel Jacob", "Specialty":"Family Practice", "Provider_type":"Medical Group", "Phone":"408-345-7630", "Address":"777 Brockton Avenue", "Language":"English", "Medicaid":"NO", "National_provider":"9809280183", "Bookmark":""},
            {"Provider":"E", "Specialty":"", "Provider_type":"", "Phone":"", "Address":"", "Language":"", "Medicaid":"", "National_provider":"", "Bookmark":""},
            {"Provider":"Ethan Joshua", "Specialty":"All", "Provider_type":"Medical Group", "Phone":"408-554-5430", "Address":"700 Oak Street", "Language":"English, Spanish", "Medicaid":"Yes", "National_provider":"5252626183", "Bookmark":""},
            {"Provider":"G", "Specialty":"", "Provider_type":"", "Phone":"", "Address":"", "Language":"", "Medicaid":"", "National_provider":"", "Bookmark":""},
            {"Provider":"Gavin Brayden", "Specialty":"All", "Provider_type":"Medical Group", "Phone":"408-658-8879", "Address":"55 Brooksby Village", "Language":"English, Spanish", "Medicaid":"Yes", "National_provider":"6651426183", "Bookmark":""},
            {"Provider":"J", "Specialty":"", "Provider_type":"", "Phone":"", "Address":"", "Language":"", "Medicaid":"", "National_provider":"", "Bookmark":""},
            {"Provider":"James Mason", "Specialty":"All", "Provider_type":"Medical Group", "Phone":"408-878-1379", "Address":"Brooksby Village", "Language":"English, Spanish", "Medicaid":"Yes", "National_provider":"8875926183", "Bookmark":""},
            {"Provider":"Jose Carter", "Specialty":"All", "Provider_type":"Medical Group", "Phone":"408-768-9879", "Address":"59 Brooksby Village", "Language":"English", "Medicaid":"Yes", "National_provider":"1793446183", "Bookmark":""},
            {"Provider":"R", "Specialty":"", "Provider_type":"", "Phone":"", "Address":"", "Language":"", "Medicaid":"", "National_provider":"", "Bookmark":""},
            {"Provider":"Ryan Joseph", "Specialty":"Family Practice", "Provider_type":"Medical Group", "Phone":"408-768-7764", "Address":"42 Fairhaven Commons Way", "Language":"English", "Medicaid":"Yes", "National_provider":"6755454544", "Bookmark":""},
        ]

        let columnDefs = [
            { headerName: "Provider", field: "Provider", width: 110, },
            { headerName: "Specialty", field: "Specialty", width: 110, },
            { headerName: "Provider Type", field: "Provider_type", width: 130, },
            { headerName: "Phone Number", field: "Phone", width: 130, },
            { headerName: "Address", field: "Address", width: 130, },
            { headerName: "Languages Spoken", field: "Language", width: 160, },
            { headerName: "Medicaid", field: "Medicaid", width: 130, },
            { headerName: "National Provider Identifier", field: "National_provider", width: 160, },
            {
                headerName: "Bookmark", field: "pencil", width : 130, cellRenderer: (data) => {
                    return '<i class="fa fa-cog"></i>'
                }, cellStyle: { cursor: 'pointer', marginLeft:  '24px' }
            },


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
                        rowData={rowData}
                        enableCellTextSelection={true}
                    >

                    </AgGridReact>

                </div>


            </div>
        )
    }


    render() {
        return (
            <div>
                <h5 className="headerText">Provider Directory</h5>
                
                {this._renderList()}
            </div>
        );
    }
}