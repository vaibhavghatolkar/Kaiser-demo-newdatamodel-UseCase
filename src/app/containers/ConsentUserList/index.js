import React from 'react';
import '../color.css'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

export class ConsentUserList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            firstName: '',
            lastName: '',
            email: '',
            ChangeText: '',
            phoneNo: '',
            userRole: '',
            userRoleList: [],
            userListDisplay: [],
            disabled: false,
            UserStatus: 'Create User',
            id: 0,
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
        }
    }

    _renderList() {
        let rowData = [
            {"Name": "hello", "Email" : '', 'Verify' : 'Verify'}
        ]

        let columnDefs = [
            { headerName: "Name", field: "Name", flex: 1, },
            { headerName: "Email", field: "Email", flex: 1, },
            {
                headerName: "Verify", field: "Verify", flex: 1, cellStyle: { cursor: 'pointer', color: '#139DC9' }
            },

        ]

        return (
            <div style={{ width: '70%', height: '100%' }}>
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
                <h5 className="headerText">User List</h5>
                {this._renderList()}
            </div>
        );
    }
}