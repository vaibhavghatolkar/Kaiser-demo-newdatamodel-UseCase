import React from 'react';
import '../color.css'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

export class PharmacyFormulation extends React.Component {

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
            { "Drug_Name": 'Bacitracin 500 unit/gm Eye Ointment', "Drug_Tier_Description": 'Generic', "30_Day_Preferred_Pharm": '$10.00', "90_Day_Mail_Order": '$10.00', "Drug_Usage_Mgmt": 'None', },
            { "Drug_Name": 'BACITRACIN/POLYMYXIN B OINT 500UNT/10000UNT', "Drug_Tier_Description": 'Specialty Tier', "30_Day_Preferred_Pharm": '$10.00', "90_Day_Mail_Order": '$10.00', "Drug_Usage_Mgmt": 'None', },
            { "Drug_Name": 'BACLOFEN 20 MG TABLET [Lioresal]', "Drug_Tier_Description": 'Generic', "30_Day_Preferred_Pharm": '$10.00', "90_Day_Mail_Order": '$10.00', "Drug_Usage_Mgmt": 'None', },
            { "Drug_Name": 'BALSALAZIDE DISODIUM 750 MG CAPSULE [Colazal]', "Drug_Tier_Description": 'Generic', "30_Day_Preferred_Pharm": '$10.00', "90_Day_Mail_Order": '$10.00', "Drug_Usage_Mgmt": 'None', },
            { "Drug_Name": 'GABAPENTIN 100 MG CAPSULE [Neurontin]', "Drug_Tier_Description": 'Generic', "30_Day_Preferred_Pharm": '$45.00', "90_Day_Mail_Order": '$10.00', "Drug_Usage_Mgmt": 'None', },
            { "Drug_Name": 'GABAPENTIN 600 MG TABLET', "Drug_Tier_Description": 'Generic', "30_Day_Preferred_Pharm": '$45.00', "90_Day_Mail_Order": '$10.00', "Drug_Usage_Mgmt": 'None', },
            { "Drug_Name": 'ECONAZOLE NITRATE 1% CREAM (g) [Spectazole] ', "Drug_Tier_Description": 'Non-Preferred Drug', "30_Day_Preferred_Pharm": '$12.00', "90_Day_Mail_Order": '$10.00', "Drug_Usage_Mgmt": 'None', },
        ]
        let columnDefs = [
            { headerName: "Drug Name", field: "Drug_Name", flex: 1, },
            { headerName: "Drug Tier Description", field: "Drug_Tier_Description", flex: 1, },
            { headerName: "30-Day Preferred Pharm	", field: "30_Day_Preferred_Pharm", flex: 1, },
            { headerName: "90-Day Mail Order", field: "90_Day_Mail_Order", flex: 1, },
            { headerName: "Drug Usage Mgmt", field: "Drug_Usage_Mgmt", flex: 1, },
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
                <h5 className="headerText">Pharmacy Formulation Information</h5>
                {this._renderList()}
            </div>
        );
    }
}