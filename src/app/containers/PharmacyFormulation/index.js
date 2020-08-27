import React from 'react';
import '../color.css'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import {StateDropdown} from '../../components/StateDropdown'
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
            { "Drug_Name": 'Bacitracin 500 unit/gm Eye Ointment', "Tier_No": 4, "Drug_Tier_Description": 'Generic', "30_Day_Preferred_Pharm": '$10.00', "90_Day_Mail_Order": '$10.00', "Drug_Usage_Mgmt": 'None', },
            { "Drug_Name": 'BACITRACIN/POLYMYXIN B OINT 500UNT/10000UNT', "Tier_No": 5, "Drug_Tier_Description": 'Specialty Tier', "30_Day_Preferred_Pharm": '$10.00', "90_Day_Mail_Order": '$10.00', "Drug_Usage_Mgmt": 'None', },
            { "Drug_Name": 'BACLOFEN 20 MG TABLET [Lioresal]', "Tier_No": 4, "Drug_Tier_Description": 'Generic', "30_Day_Preferred_Pharm": '$10.00', "90_Day_Mail_Order": '$10.00', "Drug_Usage_Mgmt": 'None', },
            { "Drug_Name": 'BALSALAZIDE DISODIUM 750 MG CAPSULE [Colazal]', "Tier_No": 5, "Drug_Tier_Description": 'Generic', "30_Day_Preferred_Pharm": '$10.00', "90_Day_Mail_Order": '$10.00', "Drug_Usage_Mgmt": 'None', },
            { "Drug_Name": 'GABAPENTIN 100 MG CAPSULE [Neurontin]', "Tier_No": 4, "Drug_Tier_Description": 'Generic', "30_Day_Preferred_Pharm": '$45.00', "90_Day_Mail_Order": '$10.00', "Drug_Usage_Mgmt": 'None', },
            { "Drug_Name": 'GABAPENTIN 600 MG TABLET', "Tier_No": 3, "Drug_Tier_Description": 'Generic', "30_Day_Preferred_Pharm": '$45.00', "90_Day_Mail_Order": '$10.00', "Drug_Usage_Mgmt": 'None', },
            { "Drug_Name": 'ECONAZOLE NITRATE 1% CREAM (g) [Spectazole] ', "Tier_No": 3, "Drug_Tier_Description": 'Non-Preferred Drug', "30_Day_Preferred_Pharm": '$12.00', "90_Day_Mail_Order": '$10.00', "Drug_Usage_Mgmt": 'None', },
        
            { "Drug_Name": 'ABACAVIR 20 MG/ML SOLUTION ', "Tier_No": 4, "Drug_Tier_Description": 'Non-Preferred Drug', "30_Day_Preferred_Pharm": '$12.00', "90_Day_Mail_Order": '$10.00', "Drug_Usage_Mgmt": 'None', },
            { "Drug_Name": 'ABACAVIR 300 MG TABLET ', "Tier_No": 2, "Drug_Tier_Description": 'Non-Preferred Drug', "30_Day_Preferred_Pharm": '$12.00', "90_Day_Mail_Order": '$10.00', "Drug_Usage_Mgmt": 'None', },
            { "Drug_Name": 'ABELCET INJECTION SUSPENSION 5MG/ML ', "Tier_No": 4, "Drug_Tier_Description": 'Non-Specialty Tier', "30_Day_Preferred_Pharm": '$15.00', "90_Day_Mail_Order": '$10.00', "Drug_Usage_Mgmt": 'None', },
            { "Drug_Name": 'HAILEY 24 FE 1 MG-20 MCG TABLET [Tarina Fe 1/20 ', "Tier_No": 2, "Drug_Tier_Description": 'Non-Preferred Drug', "30_Day_Preferred_Pharm": '$12.00', "90_Day_Mail_Order": '$10.00', "Drug_Usage_Mgmt": 'None', },
            { "Drug_Name": 'Halobetasol Propionate 0.5mg/g 1 TUBE per CARTON / 50 g in 1 TUBE ', "Tier_No": 4, "Drug_Tier_Description": 'Non-Preferred Drug', "30_Day_Preferred_Pharm": '$12.00', "90_Day_Mail_Order": '$10.00', "Drug_Usage_Mgmt": 'None', },
            { "Drug_Name": 'HALOPERIDOL 2MG TABLET (100 CT) ', "Tier_No": 4, "Drug_Tier_Description": 'Non-Preferred Drug', "30_Day_Preferred_Pharm": '$12.00', "90_Day_Mail_Order": '$10.00', "Drug_Usage_Mgmt": 'None', },
            { "Drug_Name": 'ZALEPLON 10 MG CAPSULE [Sonata] ', "Tier_No": 2, "Drug_Tier_Description": 'Preferred Brand', "30_Day_Preferred_Pharm": '$12.00', "90_Day_Mail_Order": '$10.00', "Drug_Usage_Mgmt": 'None', },
            { "Drug_Name": 'ZALEPLON 5 MG CAPSULE [Sonata] ', "Tier_No": 1, "Drug_Tier_Description": 'Preferred Brand', "30_Day_Preferred_Pharm": '$12.00', "90_Day_Mail_Order": '$10.00', "Drug_Usage_Mgmt": 'None', },
            { "Drug_Name": 'ZENPEP DR 10,000 UNIT CAPSULE DR ', "Tier_No": 2, "Drug_Tier_Description": 'Non-Preferred Drug', "30_Day_Preferred_Pharm": '$12.00', "90_Day_Mail_Order": '$10.00', "Drug_Usage_Mgmt": 'None', },
            { "Drug_Name": 'XARELTO STARTER PACK ', "Tier_No": 2, "Drug_Tier_Description": 'Preferred Brand', "30_Day_Preferred_Pharm": '$12.00', "90_Day_Mail_Order": '$10.00', "Drug_Usage_Mgmt": 'None', },
        ]
        let columnDefs = [
            { headerName: "Drug Name", field: "Drug_Name", flex: 1, },
            { headerName: "Tier Number", field: "Tier_No", flex: 1, },
            { headerName: "Drug Tier Description", field: "Drug_Tier_Description", flex: 1, },
            { headerName: "30-Day Preferred Pharm  ", field: "30_Day_Preferred_Pharm", flex: 1, },
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
    _handleStateChange = (event) => {
        this.setState({'State': event.target.options[event.target.selectedIndex].text})
    }
    renderTopbar = () => {
        return(
            <div className="form-style" id='filters'>
                <div className="form-row">
                    
                            <div className="form-group col-2">
                                <div className="list-dashboard">State</div>
                                <StateDropdown
                                selected_state={this.state.State}
                                    method={this._handleStateChange}
                                />
                            </div>
                            <div className="form-group col-2">
                                    <div className="list-dashboard">Plan</div>
                                    <select className="form-control list-dashboard" id="TradingPartner"
                                    >
                                         <option value="Not Selected">Please Select a Plan Family</option>
                                                <option selected="" value="AARP Plans">AARP Plans</option>
                                    <option value="ADVANTAGE Plans">ADVANTAGE Plans</option>
                                    <option value="Aetna Plans">Aetna Plans</option>
                                    <option value="Aetna-Advantra Plans">Aetna-Advantra Plans</option>
                                    <option value="Allwell Plans">Allwell Plans</option>
                                    <option value="Amerivantage Plans">Amerivantage Plans</option>
                                    <option value="Atrio Plans">Atrio Plans</option>
                                    <option value="BlueCross / BlueShield Plans">BlueCross / BlueShield Plans</option>
                                    <option value="Bright Advantage Plans">Bright Advantage Plans</option>
                                    <option value="CAREPLUS HEALTH Plans">CAREPLUS HEALTH Plans</option>
                                    <option value="CDPHP Plans">CDPHP Plans</option>
                                    <option value="Cigna-HealthSpring Plans">Cigna-HealthSpring Plans</option>
                                    <option value="ELDERPLAN Plans">ELDERPLAN Plans</option>
                                    <option value="EmblemHealth Plans">EmblemHealth Plans</option>
                                    <option value="EnvisionRx Plans">EnvisionRx Plans</option>
                                    <option value="Express Scripts Plans">Express Scripts Plans</option>
                                    <option value="Fallon Plans">Fallon Plans</option>
                                    <option value="Freedom Health Plans">Freedom Health Plans</option>
                                    <option value="Gateway Health Plans">Gateway Health Plans</option>
                                    <option value="Geisinger Plans">Geisinger Plans</option>
                                    <option value="HEALTH ALLIANCE Plans">HEALTH ALLIANCE Plans</option>
                                    <option value="HEALTH NET Plans">HEALTH NET Plans</option>
                                    <option value="Humana Plans">Humana Plans</option>
                                    <option value="Kaiser Plans">Kaiser Plans</option>
                                    <option value="MEDICA Plans">MEDICA Plans</option>
                                    <option value="MediGold Plans">MediGold Plans</option>
                                    <option value="Meridian Plans">Meridian Plans</option>
                                    <option value="MMM Plans">MMM Plans</option>
                                    <option value="MOLINA Plans">MOLINA Plans</option>
                                    <option value="Mutual of Omaha Plans">Mutual of Omaha Plans</option>
                                    <option value="Optimum Plans">Optimum Plans</option>
                                    <option value="PacificSource Plans">PacificSource Plans</option>
                                    <option value="Platino Plans">Platino Plans</option>
                                    <option value="PriorityMedicare Plans">PriorityMedicare Plans</option>
                                    <option value="SCAN Health Plans">SCAN Health Plans</option>
                                    <option value="Secure Plans">Secure Plans</option>
                                    <option value="SecureRx Plans">SecureRx Plans</option>
                                    <option value="Senior Care Plans">Senior Care Plans</option>
                                    <option value="SilverScript Plans">SilverScript Plans</option>
                                    <option value="SummaCare Plans">SummaCare Plans</option>
                                    <option value="Ucare Plans">Ucare Plans</option>
                                    <option value="UnitedHealthcare Plans">UnitedHealthcare Plans</option>
                                    <option value="UPMC Plans">UPMC Plans</option>
                                    <option value="WellCare Plans">WellCare Plans</option>
                                    <option value="Other MAPD Plans">Other MAPD Plans</option>
                                    <option value="Other PDP Plans">Other PDP Plans</option>
                                        
                                    </select>
                                </div>
                                <div className="form-group col-2">
                                    <div className="list-dashboard">Tier</div>
                                    <select className="form-control list-dashboard" id="TradingPartner"
                                    >
                                         <option value="Not Selected">Tier 1</option>
                                                <option selected="" value="AARP Plans">Tier 2</option>
                                    <option value="ADVANTAGE Plans">Tier 3</option>
                                    <option value="Aetna Plans">Tier 4</option>
                                    <option value="Aetna Plans">Tier 5</option>
                                    </select>
                                    </div>
                            </div></div>
        
        )
    }
    render() {
        return (
            <div>
                <h5 className="headerText">Pharmacy Formulary Information</h5>
                {this.renderTopbar()}
                {this._renderList()}
            </div>
        );
    }
}