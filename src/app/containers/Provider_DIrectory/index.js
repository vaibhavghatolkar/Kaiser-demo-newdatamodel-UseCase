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
            {"Provider":"Athena Health", "Specialty":"", "Provider_type":"", "Phone":"", "Address":"", "Language":"", "Medicaid":"", "National_provider":"", "Bookmark":""},
            {"Provider":"K", "Specialty":"", "Provider_type":"", "Phone":"", "Address":"", "Language":"", "Medicaid":"", "National_provider":"", "Bookmark":""},
            {"Provider":"Kaiser Oakland", "Specialty":"", "Provider_type":"", "Phone":"", "Address":"", "Language":"", "Medicaid":"", "National_provider":"", "Bookmark":""},
            {"Provider":"M", "Specialty":"", "Provider_type":"", "Phone":"", "Address":"", "Language":"", "Medicaid":"", "National_provider":"", "Bookmark":""}
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
            { headerName: "Bookmark", field: "Bookmark", flex: 1, },

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