import React from 'react';
import Urls from '../../../helpers/Urls';
import '../color.css'
import Strings from '../../../helpers/Strings';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

export class FHiR_API_management extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            customList: [],
            apiflag: this.props.apiflag,
            userrole: [],
            TransactionMasterList: [],
            fileId: '',
            UpdateCheckBox: '',
            checked: [],
            unchecked: [],
            Menucheckall: '',
            isChecked: '',
            menuType: "I",
            paginationPageSize: 10,
            domLayout: 'autoHeight',
            setdropdown_value:"Patient",

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
        };
      }
    componentDidMount() {
        this.getData()

    }
 
    getData() {
      
        let data=""
        if(this.state.setdropdown_value=="Observation")
        {
             data = [
                {API_URL: 'http://hipaas.fhir.org/baseR4/Observation/id/_history/1',Date: '06/17/2020 06:00:00',},
                {API_URL: 'http://hipaas.fhir.org/baseR4/Observation/id/_history/2',Date: '06/17/2020 06:00:00',},
                {API_URL: 'http://hipaas.fhir.org/baseR4/Observation/id/_history/3',Date: '06/17/2020 08:20:10',},
                {API_URL: 'http://hipaas.fhir.org/baseR4/Observation/id/_history/4',Date: '06/17/2020 08:20:10',},
                {API_URL: 'http://hipaas.fhir.org/baseR4/Observation/id/_history/5',Date: '06/17/2020 08:20:10',},
                {API_URL: 'http://hipaas.fhir.org/baseR4/Observation/id/_history/6',Date: '06/17/2020 08:20:10',},
                {API_URL: 'http://hipaas.fhir.org/baseR4/Observation/id/_history/7',Date: '06/17/2020 08:20:10',},
                {API_URL: 'http://hipaas.fhir.org/baseR4/Observation/id/_history/8',Date: '06/17/2020 08:20:10',},
                {API_URL: 'http://hipaas.fhir.org/baseR4/Observation/id/_history/9',Date: '06/17/2020 08:20:10',},
                {API_URL: 'http://hipaas.fhir.org/baseR4/Observation/id/_history/10',Date: '06/17/2020 08:20:10',},
            ]
            
            
      
    }
    else if(this.state.setdropdown_value=="Patient")
    {  
         data = [
            {API_URL: 'http://hipaas.fhir.org/baseR4/Patient/id/_history/1',Date: '06/17/2020 06:00:00',},
            {API_URL: 'http://hipaas.fhir.org/baseR4/Patient/id/_history/2',Date: '06/17/2020 06:00:00',},
            {API_URL: 'http://hipaas.fhir.org/baseR4/Patient/id/_history/3',Date: '06/17/2020 08:20:10',},
            {API_URL: 'http://hipaas.fhir.org/baseR4/Patient/id/_history/4',Date: '06/17/2020 08:20:10',},
            {API_URL: 'http://hipaas.fhir.org/baseR4/Patient/id/_history/5',Date: '06/17/2020 08:20:10',},
            {API_URL: 'http://hipaas.fhir.org/baseR4/Patient/id/_history/6',Date: '06/17/2020 08:20:10',},
            {API_URL: 'http://hipaas.fhir.org/baseR4/Patient/id/_history/7',Date: '06/17/2020 08:20:10',},
            {API_URL: 'http://hipaas.fhir.org/baseR4/Patient/id/_history/8',Date: '06/17/2020 08:20:10',},
            {API_URL: 'http://hipaas.fhir.org/baseR4/Patient/id/_history/9',Date: '06/17/2020 08:20:10',},
            {API_URL: 'http://hipaas.fhir.org/baseR4/Patient/id/_history/10',Date: '06/17/2020 08:20:10',},
        ]       
    }
     else if(this.state.setdropdown_value=="Encounter")
    {  
     data = [
      {API_URL: 'http://hipaas.fhir.org/baseR4/Encounter/id/_history/1',Date: '06/17/2020 06:00:00',},
      {API_URL: 'http://hipaas.fhir.org/baseR4/Encounter/id/_history/2',Date: '06/17/2020 06:00:00',},
      {API_URL: 'http://hipaas.fhir.org/baseR4/Encounter/id/_history/3',Date: '06/17/2020 08:20:10',},
      {API_URL: 'http://hipaas.fhir.org/baseR4/Encounter/id/_history/4',Date: '06/17/2020 08:20:10',},
      {API_URL: 'http://hipaas.fhir.org/baseR4/Encounter/id/_history/5',Date: '06/17/2020 08:20:10',},
      {API_URL: 'http://hipaas.fhir.org/baseR4/Encounter/id/_history/6',Date: '06/17/2020 08:20:10',},
      {API_URL: 'http://hipaas.fhir.org/baseR4/Encounter/id/_history/7',Date: '06/17/2020 08:20:10',},
      {API_URL: 'http://hipaas.fhir.org/baseR4/Encounter/id/_history/8',Date: '06/17/2020 08:20:10',},
      {API_URL: 'http://hipaas.fhir.org/baseR4/Encounter/id/_history/9',Date: '06/17/2020 08:20:10',},
      {API_URL: 'http://hipaas.fhir.org/baseR4/Encounter/id/_history/10',Date: '06/17/2020 08:20:10',},
  ]
}  
else if(this.state.setdropdown_value=="Immunization")
{
  data= [
  {API_URL: 'http://hipaas.fhir.org/baseR4/Immunization/id/_history/1',Date: '06/17/2020 06:00:00',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/Immunization/id/_history/2',Date: '06/17/2020 06:00:00',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/Immunization/id/_history/3',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/Immunization/id/_history/4',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/Immunization/id/_history/5',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/Immunization/id/_history/6',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/Immunization/id/_history/7',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/Immunization/id/_history/8',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/Immunization/id/_history/9',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/Immunization/id/_history/10',Date: '06/17/2020 08:20:10',},
]
}
else if(this.state.setdropdown_value=="Claim")
{
  data = [
  {API_URL: 'http://hipaas.fhir.org/baseR4/Claim/id/_history/1',Date: '06/17/2020 06:00:00',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/Claim/id/_history/2',Date: '06/17/2020 06:00:00',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/Claim/id/_history/3',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/Claim/id/_history/4',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/Claim/id/_history/5',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/Claim/id/_history/6',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/Claim/id/_history/7',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/Claim/id/_history/8',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/Claim/id/_history/9',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/Claim/id/_history/10',Date: '06/17/2020 08:20:10',},
]
}
else if(this.state.setdropdown_value=="DiagnosticReport")
{
data = [
  {API_URL: 'http://hipaas.fhir.org/baseR4/DiagnosticReport/id/_history/1',Date: '06/17/2020 06:00:00',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/DiagnosticReport/id/_history/2',Date: '06/17/2020 06:00:00',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/DiagnosticReport/id/_history/3',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/DiagnosticReport/id/_history/4',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/DiagnosticReport/id/_history/5',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/DiagnosticReport/id/_history/6',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/DiagnosticReport/id/_history/7',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/DiagnosticReport/id/_history/8',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/DiagnosticReport/id/_history/9',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/DiagnosticReport/id/_history/10',Date: '06/17/2020 08:20:10',},
]
}
else if(this.state.setdropdown_value=="Condition")
{
  data = [
  {API_URL: 'http://hipaas.fhir.org/baseR4/Condition/id/_history/1',Date: '06/17/2020 06:00:00',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/Condition/id/_history/2',Date: '06/17/2020 06:00:00',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/Condition/id/_history/3',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/Condition/id/_history/4',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/Condition/id/_history/5',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/Condition/id/_history/6',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/Condition/id/_history/7',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/Condition/id/_history/8',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/Condition/id/_history/9',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/Condition/id/_history/10',Date: '06/17/2020 08:20:10',},
]
}
else if(this.state.setdropdown_value=="MedicationRequest")
{
 data = [
  {API_URL: 'http://hipaas.fhir.org/baseR4/MedicationRequest/id/_history/1',Date: '06/17/2020 06:00:00',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/MedicationRequest/id/_history/2',Date: '06/17/2020 06:00:00',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/MedicationRequest/id/_history/3',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/MedicationRequest/id/_history/4',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/MedicationRequest/id/_history/5',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/MedicationRequest/id/_history/6',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/MedicationRequest/id/_history/7',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/MedicationRequest/id/_history/8',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/MedicationRequest/id/_history/9',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/MedicationRequest/id/_history/10',Date: '06/17/2020 08:20:10',},
]
}
else if(this.state.setdropdown_value=="AllergyIntolerance")
{
 data = [
  {API_URL: 'http://hipaas.fhir.org/baseR4/AllergyIntolerance/id/_history/1',Date: '06/17/2020 06:00:00',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/AllergyIntolerance/id/_history/2',Date: '06/17/2020 06:00:00',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/AllergyIntolerance/id/_history/3',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/AllergyIntolerance/id/_history/4',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/AllergyIntolerance/id/_history/5',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/AllergyIntolerance/id/_history/6',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/AllergyIntolerance/id/_history/7',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/AllergyIntolerance/id/_history/8',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/AllergyIntolerance/id/_history/9',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/AllergyIntolerance/id/_history/10',Date: '06/17/2020 08:20:10',},
]
    }
    else if(this.state.setdropdown_value=="CoverageEligibilityRequest")
{
  data = [
  {API_URL: 'http://hipaas.fhir.org/baseR4/CoverageEligibilityRequest/id/_history/1',Date: '06/17/2020 06:00:00',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/CoverageEligibilityRequest/id/_history/2',Date: '06/17/2020 06:00:00',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/CoverageEligibilityRequest/id/_history/3',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/CoverageEligibilityRequest/id/_history/4',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/CoverageEligibilityRequest/id/_history/5',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/CoverageEligibilityRequest/id/_history/6',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/CoverageEligibilityRequest/id/_history/7',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/CoverageEligibilityRequest/id/_history/8',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/CoverageEligibilityRequest/id/_history/9',Date: '06/17/2020 08:20:10',},
  {API_URL: 'http://hipaas.fhir.org/baseR4/CoverageEligibilityRequest/id/_history/10',Date: '06/17/2020 08:20:10',},
]
}  
        this.setState({
              rowData:data

        })

    }
    _renderTable() {      
        let columnDefs = [
            { headerName: "API URL", field: "API_URL", flex:1, cellStyle: { color: '#139DC9', cursor: 'pointer' } },
            { headerName: "Updated Date", field: "Date", width:"150", },
           
        ]

        return (
            <div style={{ width: '100%', height: '100%' ,paddingTop:'14px' }}>
                <div className="ag-theme-balham" >
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
                        rowData={this.state.rowData}
                        enableCellTextSelection={true}
                        onCellClicked={(event) => {
                            if (event.colDef.headerName == 'API URL') {
                                this.renderDetails();
                                this.setState({
                                  
                                    showDetails: true
                                })
                            }
                        }}
                    >

                    </AgGridReact>

                </div>


            </div>
        )
    } 
    ChangeVal(event, key) {
     
        this.setState({
        setdropdown_value:event.target.value,
         showDetails:false
        })
        setTimeout(() => {
            this.getData()
        }, 50);
      
    }
    renderDetails(flag) {
      
        let message
          if(this.state.setdropdown_value=="Observation")
          {
          message =`{
        "resourceType": "Observation",
        "id": "226527",
        "meta": {
          "versionId": "1",
          "lastUpdated": "2019-12-08T06:31:22.596+00:00",
          "source": "#z7Z4cp5xQ88SlEKO"
        },
        "text": {
          "status": "generated"
        },
        "status": "final",
        "category": [ {
          "coding": [ {
            "system": " http://terminology.hl7.org/CodeSystem/observation-category",
            "code": "procedure",
            "display": "procedure"
          } ]
        } ],
        "code": {
          "coding": [ {
            "system": " urn:oid:2.16.840.1.113883.6.24",
            "code": "131328",
            "display": "MDC_ECG_ELEC_POTL_I"
          } ]
        },
        "subject": {
          "reference": "Patient/50"
        },
        "effectiveDateTime": "2019-12-08T14:31:46+14:00",
        "valueSampledData": {
          "origin": {
            "value": 2048
          },
          "period": 10,
          "factor": 1.612,
          "lowerLimit": -3300,
          "upperLimit": 3300,
          "dimensions": 1,
          "data": "17,30,39,52,57,37,20,-2,-28,-40,-36,-14,2,16,15,-11,-35,-56,-70,-69,-57,-37,-34,-32,3,39,14,-39,-60,-57,-38,-13,12,32,23,1,-15,-28,-14,23,70,114,131,127,98,67,40,20,23,42,72,91,95,80,53,35,6,-17,-8,5,28,47,60,71,61,62,68,83,120,128,128,122,95,85,84,92,100,81,45,-1,-42,-61,-56,-34,-10,14,20,4,-6,-11,-13,-22,-31,-15,-2,-10,-24,-34,-37,-45,-49,-33,-7,14,30,32,8,-29,-59,-40,4,-4,-52,-73,-47,-11,16,28,23,14,-10,-40,-42,-12,38,57,72,93,68,18,-28,-57,-72,-75,-71,-66,-66,-62,-50,-36,-30,-52,-63,-64,-77,-63,-49,-47,-56,-62,-56,-56,-43,-19,-12,-17,-24,-28,-24,-9,-4,4,9,5,8,-1,-15,-32,-36,-43,-55,-53,-46,-30,-18,15,41,40,49,66,80,82,76,57,36,32,34,29,16,10,11,5,-14,-30,-48,-35,18,41,17,-12,-31,-48,-43,-15,6,24,40,57,77,94,100,108,120,96,43,23,44,73,100,113,88,35,4,9,31,63,63,21,-34,-71,-60,-19,32,76,95,68,4,-32,-48,-31,16,39,30,-1,-34,-40,-13,24,52,50,45,41,34,36,14,4,-8,-41,-57,-76,-86,-93,-101,-95,-77,-66,-79,-88,-94,-97,-75,-42,-16,-5,-4,-27,-62,-69,-54,-44,-42,-53,-87,-111,-83,-46,-66,-107,-132,-150,-150,-130,-106,-65,-10,14,11,6,-2,-15,-30,-20,26,72,103,123,134,123,96,103,131,140,127,86,48,23,8,27,62,84,64,-12,-89,-133,-146,-133,-102,-70,-68,-82,-71,-64,-75,-65,-48,-11,28,26,0,-40,-39,5,52,95,119,103,59,31,22,19,47,76,90,68,12,-10,-15,3,42,63,49,3,-38,-73,-99,-78,-35,2,23,17,1,-30,-67,-57,10,53,34,11,-7,-30,-56,-81,-98,-101,-83,-65,-53,-45,-47,-61,-97,-131,-146,-146,-133,-107,-61,-21,13,44,47,36,36,22,17,52,75,88,96,92,83,73,63,54,61,73,85,81,65,41,16,-5,-10,19,50,64,42,4,-14,-33,-32,-23,-24,-24,-37,-45,-56,-73,-81,-107,-112,-94,-82,-65,-65,-64,-71,-91,-94,-86,-75,-50,-26,-30,-29,-26,-33,-58,-52,7,40,28,7,2,-2,-13,-19,-23,-25,-17,-12,-4,-4,-18,-23,-36,-55,-62,-68,-75,-72,-60,-58,-32,25,58,90,133,163,169,163,153,152,164,174,190,173,120,77,33,"
        }
      }`    
          }
          else if(this.state.setdropdown_value=="Patient")
      {
         message = `
        {
            "resourceType": "Patient",
            "id": "7a550262-1117-414e-b7fa-579a8303791b",
            "meta": {
              "versionId": "1",
              "lastUpdated": "2020-03-24T18:02:42.348+00:00",
              "source": "#6EtoBxk4hMO7moNv",
              "profile": [ "http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient" ],
              "tag": [ {
                "system": "https://smarthealthit.org/tags",
                "code": "Covid19 synthetic population from Synthea"
              } ]
            },
            "text": {
              "status": "generated",
              "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">Generated by <a href=\"https://github.com/synthetichealth/synthea\">Synthea</a>.Version identifier: 2177cffc\n .   Person seed: -2801691141012102787  Population seed: 12345</div>"
            },
            "extension": [ {
              "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race",
              "extension": [ {
                "url": "detailed",
                "valueCoding": {
                  "system": "urn:oid:2.16.840.1.113883.6.238",
                  "code": "2131-1",
                  "display": "Other Races"
                }
              }, {
                "url": "text",
                "valueString": "Other"
              } ]
            }, {
              "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity",
              "extension": [ {
                "url": "ombCategory",
                "valueCoding": {
                  "system": "urn:oid:2.16.840.1.113883.6.238",
                  "code": "2135-2",
                  "display": "Hispanic or Latino"
                }
              }, {
                "url": "text",
                "valueString": "Hispanic or Latino"
              } ]
            }, {
              "url": "http://hl7.org/fhir/StructureDefinition/patient-mothersMaidenName",
              "valueString": "Esperanza675 Mireles421"
            }, {
              "url": "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex",
              "valueCode": "M"
            }, {
              "url": "http://hl7.org/fhir/StructureDefinition/patient-birthPlace",
              "valueAddress": {
                "city": "Ponce",
                "state": "Puerto Rico",
                "country": "PR"
              }
            }, {
              "url": "http://synthetichealth.github.io/synthea/disability-adjusted-life-years",
              "valueDecimal": 0
            }, {
              "url": "http://synthetichealth.github.io/synthea/quality-adjusted-life-years",
              "valueDecimal": 22
            } ],
            "identifier": [ {
              "system": "https://github.com/synthetichealth/synthea",
              "value": "6b477d46-7c83-4d5d-a68b-b2c37876c91e"
            }, {
              "type": {
                "coding": [ {
                  "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                  "code": "MR",
                  "display": "Medical Record Number"
                } ],
                "text": "Medical Record Number"
              },
              "system": "http://hospital.smarthealthit.org",
              "value": "6b477d46-7c83-4d5d-a68b-b2c37876c91e"
            }, {
              "type": {
                "coding": [ {
                  "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                  "code": "SS",
                  "display": "Social Security Number"
                } ],
                "text": "Social Security Number"
              },
              "system": "http://hl7.org/fhir/sid/us-ssn",
              "value": "999-18-3677"
            }, {
              "type": {
                "coding": [ {
                  "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                  "code": "DL",
                  "display": "Driver's License"
                } ],
                "text": "Driver's License"
              },
              "system": "urn:oid:2.16.840.1.113883.4.3.25",
              "value": "S99919965"
            }, {
              "type": {
                "coding": [ {
                  "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                  "code": "PPN",
                  "display": "Passport Number"
                } ],
                "text": "Passport Number"
              },
              "system": "http://standardhealthrecord.org/fhir/StructureDefinition/passportNumber",
              "value": "X20015697X"
            } ],
            "name": [ {
              "use": "official",
              "family": "Miramontes145",
              "given": [ "Alfredo17" ],
              "prefix": [ "Mr." ]
            } ],
            "telecom": [ {
              "system": "phone",
              "value": "555-704-8978",
              "use": "home"
            } ],
            "gender": "male",
            "birthDate": "1997-11-13",
            "address": [ {
              "extension": [ {
                "url": "http://hl7.org/fhir/StructureDefinition/geolocation",
                "extension": [ {
                  "url": "latitude",
                  "valueDecimal": 41.830197333810595
                }, {
                  "url": "longitude",
                  "valueDecimal": -87.53976838335285
                } ]
              } ],
              "line": [ "1007 Schiller Bridge Unit 14" ],
              "city": "Chicago",
              "state": "IL",
              "postalCode": "60007",
              "country": "US"
            } ],
            "maritalStatus": {
              "coding": [ {
                "system": "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
                "code": "S",
                "display": "Never Married"
              } ],
              "text": "Never Married"
            },
            "multipleBirthBoolean": false,
            "communication": [ {
              "language": {
                "coding": [ {
                  "system": "urn:ietf:bcp:47",
                  "code": "es",
                  "display": "Spanish"
                } ],
                "text": "Spanish"
              }
            } ]
          }
 
  }`    
          }
          else if(this.state.setdropdown_value=="Encounter")
  {
   message = `
{
    "resourceType": "Encounter",
    "id": "585817",
    "meta": {
      "versionId": "1",
      "lastUpdated": "2020-01-05T05:30:04.583+00:00",
      "source": "#ddnpwUGdyQWpDpUI"
    },
    "subject": {
      "reference": "Patient/585812"
    },
    "period": {
      "start": "2020-01-05T05:10:04+00:00"
    },
    "location": [ {
      "location": {
        "reference": "Location/585816",
        "display": "Ward 1, Room 566f6cc2-1cd6-42aa-8af0-0c47e76f13f9, Bed 1"
      },
      "status": "active",
      "period": {
        "start": "2020-01-05T05:10:04+00:00",
        "end": "2020-01-05T05:15:04+00:00"
      }
    } ]
  }
`
          }   
         else if(this.state.setdropdown_value=="Immunization")
    {
   message = `
{
    "resourceType": "Immunization",
    "id": "645290",
    "meta": {
      "versionId": "1",
      "lastUpdated": "2020-03-20T21:12:58.361+00:00",
      "source": "#c5qCrD7M8OaTm5Jc"
    },
    "status": "completed",
    "vaccineCode": {
      "coding": [ {
        "system": "http://hl7.org/fhir/sid/cvx",
        "code": "165"
      } ],
      "text": "HPV9"
    },
    "patient": {
      "reference": "Patient/645288"
    },
    "occurrenceDateTime": "2020-02-11",
    "reasonCode": [ {
      "text": "Evaluation_Status_2.0: Valid\nEvaluation_Reason_2.0: null"
    } ]
  }
`
          }
         else if(this.state.setdropdown_value=="Claim")
    {
    message = `
{
    "resourceType": "Claim",
    "id": "49d06cba-7d6d-450d-b6f0-02cb93a4fdff",
    "meta": {
      "versionId": "1",
      "lastUpdated": "2020-03-24T18:08:32.279+00:00",
      "source": "#mT2VwtSLVJQYgqLj",
      "tag": [ {
        "system": "https://smarthealthit.org/tags",
        "code": "Covid19 synthetic population from Synthea"
      } ]
    },
    "status": "active",
    "type": {
      "coding": [ {
        "system": "http://terminology.hl7.org/CodeSystem/claim-type",
        "code": "institutional"
      } ]
    },
    "use": "claim",
    "patient": {
      "reference": "Patient/962d855d-f803-42bf-8561-a540237fbfb3",
      "display": "Ana María762 Tapia475"
    },
    "billablePeriod": {
      "start": "2010-06-30T21:25:49-05:00",
      "end": "2010-06-30T21:40:49-05:00"
    },
    "created": "2010-06-30T21:40:49-05:00",
    "provider": {
      "reference": "Organization/afa969a9-ebfa-3984-9a1d-692101db12ac",
      "display": "PCP329698"
    },
    "priority": {
      "coding": [ {
        "system": "http://terminology.hl7.org/CodeSystem/processpriority",
        "code": "normal"
      } ]
    },
    "facility": {
      "reference": "Location/23900fd2-3ba9-4d1b-9263-dbde1acc28ec",
      "display": "PCP329698"
    },
    "supportingInfo": [ {
      "sequence": 1,
      "category": {
        "coding": [ {
          "system": "http://terminology.hl7.org/CodeSystem/claiminformationcategory",
          "code": "info"
        } ]
      },
      "valueReference": {
        "reference": "Immunization/050b57f2-7d8c-43e4-aa8c-935187b8c8a8"
      }
    }, {
      "sequence": 2,
      "category": {
        "coding": [ {
          "system": "http://terminology.hl7.org/CodeSystem/claiminformationcategory",
          "code": "info"
        } ]
      },
      "valueReference": {
        "reference": "Immunization/1699a6b1-a17a-4e12-9411-fa0f11128933"
      }
    } ],
    "insurance": [ {
      "sequence": 1,
      "focal": true,
      "coverage": {
        "display": "UnitedHealthcare"
      }
    } ],
    "item": [ {
      "sequence": 1,
      "productOrService": {
        "coding": [ {
          "system": "http://snomed.info/sct",
          "code": "162673000",
          "display": "General examination of patient (procedure)"
        } ],
        "text": "General examination of patient (procedure)"
      },
      "encounter": [ {
        "reference": "Encounter/33ed5cfd-4c4a-44de-aae0-5a8a41697bdd"
      } ]
    }, {
      "sequence": 2,
      "informationSequence": [ 1 ],
      "productOrService": {
        "coding": [ {
          "system": "http://hl7.org/fhir/sid/cvx",
          "code": "140",
          "display": "Influenza, seasonal, injectable, preservative free"
        } ],
        "text": "Influenza, seasonal, injectable, preservative free"
      },
      "net": {
        "value": 158.68,
        "currency": "USD"
      }
    }, {
      "sequence": 3,
      "informationSequence": [ 2 ],
      "productOrService": {
        "coding": [ {
          "system": "http://hl7.org/fhir/sid/cvx",
          "code": "52",
          "display": "Hep A, adult"
        } ],
        "text": "Hep A, adult"
      },
      "net": {
        "value": 158.68,
        "currency": "USD"
      }
    } ],
    "total": {
      "value": 145.85,
      "currency": "USD"
    }
  }
`}
         else if(this.state.setdropdown_value=="DiagnosticReport")
{
message = `
{
    "resourceType": "DiagnosticReport",
    "id": "c47020bf-d191-463c-a7b8-7066a3742262",
    "meta": {
      "versionId": "1",
      "lastUpdated": "2020-03-24T21:07:59.877+00:00",
      "source": "#iCEtBpb7q4gkPftG",
      "profile": [ "http://hl7.org/fhir/us/core/StructureDefinition/us-core-diagnosticreport-note" ],
      "tag": [ {
        "system": "https://smarthealthit.org/tags",
        "code": "Covid19 synthetic population from Synthea"
      } ]
    },
    "text": {
      "status": "generated",
      "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><div class=\"hapiHeaderText\"> Evaluation+Plan note </div><table class=\"hapiPropertyTable\"><tbody><tr><td>Status</td><td>FINAL</td></tr><tr><td>Issued</td><td> 27 October 2014 21:45:50</td></tr></tbody></table></div>"
    },
    "status": "final",
    "category": [ {
      "coding": [ {
        "system": "http://loinc.org",
        "code": "51847-2",
        "display": "Evaluation+Plan note"
      } ]
    } ],
    "code": {
      "coding": [ {
        "system": "http://loinc.org",
        "code": "51847-2",
        "display": "Evaluation+Plan note"
      } ]
    },
    "subject": {
      "reference": "Patient/faaa7765-374b-4419-aaab-890956a04a6a"
    },
    "encounter": {
      "reference": "Encounter/b37dbdc9-6a1b-4599-8afd-4a768cba7407"
    },
    "effectiveDateTime": "2014-10-27T16:45:50-05:00",
    "issued": "2014-10-27T16:45:50.597-05:00",
    "performer": [ {
      "reference": "Practitioner/0000016f-a1db-e77f-0000-000000019596",
      "display": "Dr. Mauro926 Toy286"
    } ],
    "presentedForm": [ {
      "contentType": "text/plain",
      "data": "Q2pJd01UUXRNVEF0TWpjS0NpTWdRMmhwWldZZ1EyOXRjR3hoYVc1MENrNXZJR052YlhCc1lXbHVkSE11Q2dvaklFaHBjM1J2Y25rZ2IyWWdVSEpsYzJWdWRDQkpiR3h1WlhOekNrbHphWE0yTWpnZ2FYTWdZU0EyT1NCNVpXRnlMVzlzWkNCdWIyNHRhR2x6Y0dGdWFXTWdkMmhwZEdVZ1ptVnRZV3hsTGdvS0l5QlRiMk5wWVd3Z1NHbHpkRzl5ZVFwUVlYUnBaVzUwSUdseklHMWhjbkpwWldRdUlGQmhkR2xsYm5RZ2FYTWdZVzRnWVdOMGFYWmxJSE50YjJ0bGNpQmhibVFnYVhNZ1lXNGdZV3hqYjJodmJHbGpMaUJRWVhScFpXNTBJR2xrWlc1MGFXWnBaWE1nWVhNZ2FHVjBaWEp2YzJWNGRXRnNMZ29LVUdGMGFXVnVkQ0JqYjIxbGN5Qm1jbTl0SUdFZ2FHbG5hQ0J6YjJOcGIyVmpiMjV2YldsaklHSmhZMnRuY205MWJtUXVJRkJoZEdsbGJuUWdhWE1nWVNCamIyeHNaV2RsSUdkeVlXUjFZWFJsTGlCUVlYUnBaVzUwSUdOMWNuSmxiblJzZVNCb1lYTWdUV1ZrYVdOaGNtVXVDZ29qSUVGc2JHVnlaMmxsY3dwT2J5QkxibTkzYmlCQmJHeGxjbWRwWlhNdUNnb2pJRTFsWkdsallYUnBiMjV6Q2s1dklFRmpkR2wyWlNCTlpXUnBZMkYwYVc5dWN5NEtDaU1nUVhOelpYTnpiV1Z1ZENCaGJtUWdVR3hoYmdvS0NpTWpJRkJzWVc0S1VHRjBhV1Z1ZENCM1lYTWdaMmwyWlc0Z2RHaGxJR1p2Ykd4dmQybHVaeUJwYlcxMWJtbDZZWFJwYjI1ek9pQnBibVpzZFdWdWVtRXNJSE5sWVhOdmJtRnNMQ0JwYm1wbFkzUmhZbXhsTENCd2NtVnpaWEoyWVhScGRtVWdabkpsWlM0Z0NnPT0="
    } ]
  }
`}
         else if(this.state.setdropdown_value=="Condition")
{
message = `
{
  "resourceType": "Condition",
  "id": "618619",
  "meta": {
    "versionId": "1",
    "lastUpdated": "2020-02-07T22:24:06.833+00:00",
    "source": "#474ERtwAYJG7OYBt",
    "security": [ {
      "system": "http://hl7.org/fhir/v3/ActCode",
      "code": "PRIVMARK",
      "display": "privacy mark"
    }, {
      "system": "http://hl7.org/fhir/v3/ActCode",
      "code": "Title38Section7332",
      "display": "Title 38 Section 7332"
    }, {
      "system": "http://hl7.org/fhir/v3/ActCode",
      "code": "CUIHLTH",
      "display": "CUI//HLTH"
    }, {
      "system": "http://hl7.org/fhir/v3/ActReason",
      "code": "TREAT",
      "display": "treatment"
    }, {
      "system": "http://hl7.org/fhir/v3/Confidentiality",
      "code": "R"
    }, {
      "system": "http://hl7.org/fhir/v3/ActCode",
      "code": "PERSISTLABEL",
      "display": "persist security label"
    }, {
      "system": "http://hl7.org/fhir/v3/ActCode",
      "code": "CUISP-HLTH",
      "display": "CUI//SP-HLTH"
    }, {
      "system": "http://hl7.org/fhir/v3/ActReason",
      "code": "HPAYMT",
      "display": "healthcare payment"
    }, {
      "system": "http://hl7.org/fhir/v3/ActCode",
      "code": "SUD",
      "display": "substance use disorder information sensitivity"
    }, {
      "system": "http://hl7.org/fhir/v3/ActCode",
      "code": "CUIPRVCY",
      "display": "CUI//PRVCY"
    } ]
  },
  "severity": {
    "coding": [ {
      "system": "http://org.mihin.fhir.patientgen.severity",
      "code": "3",
      "display": "critical"
    } ]
  },
  "code": {
    "coding": [ {
      "system": "urn:oid:2.16.840.1.113883.6.96",
      "code": "7200002",
      "display": "Dipsomania"
    } ],
    "text": "Alcoholism (disorder)"
  },
  "onsetDateTime": "2018-09-02T17:09:13-04:00",
  "asserter": {
    "reference": "Practitioner/618622",
    "display": "Katherine.E.Taylor MD"
  }
}
`


return (
        <div>
            <div>
                <div className="top-padding"><a href={'#' + 'hello' + flag} data-toggle="collapse">{'Response'}</a></div>
                <div className="border-view" style={{ height:  "300px", overflow: "auto" }} id={'hello' + flag}>{flag ? message : message}</div>
            </div>
        </div>
         )
         }
        else if(this.state.setdropdown_value=="MedicationRequest")
     {
     message = `
{
  "resourceType": "MedicationRequest",
  "id": "MR-707",
  "meta": {
    "versionId": "3",
    "lastUpdated": "2020-06-16T07:34:52.503+00:00",
    "source": "#p8rKEok9WPpwxfMh",
    "profile": [ "http://hl7.org/fhir/us/core/StructureDefinition/us-core-medicationrequest" ]
  },
  "status": "active",
  "intent": "plan",
  "medicationCodeableConcept": {
    "coding": [ {
      "system": "http://www.nlm.nih.gov/research/umls/rxnorm",
      "code": "1810997",
      "display": "24 HR canagliflozin 150 MG / metformin hydrochloride 1000 MG Extended Release Oral Tablet"
    } ],
    "text": "Metformin"
  },
  "subject": {
    "reference": "Patient/PT-707",
    "display": "Amy Shaw"
  },
  "authoredOn": "2020-06-05",
  "requester": {
    "reference": "Practitioner/1180299",
    "display": "abc xyz, MD"
  },
  "dosageInstruction": [ {
    "timing": {
      "repeat": {
        "boundsPeriod": {
          "start": "2020-06-05T15:14:00.000-05:00",
          "end": "2020-06-05T16:15:45.000-05:00"
        }
      }
    },
    "route": {
      "coding": [ {
        "system": "http://snomed.info/sct",
        "code": "26643006",
        "display": "Oral use"
      } ],
      "text": "Oral use"
    },
    "doseAndRate": [ {
      "doseQuantity": {
        "value": 150,
        "unit": "MG"
      }
    } ]
  } ]
}
`
         }
         else if(this.state.setdropdown_value=="AllergyIntolerance")
    {
    message = `
{
  "resourceType": "AllergyIntolerance",
  "id": "1214025",
  "meta": {
    "versionId": "1",
    "lastUpdated": "2020-06-17T03:25:03.113+00:00",
    "source": "#QhLGQN8IH2ekSsd2"
  },
  "text": {
    "status": "generated",
    "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">Ibuprofen causes urticaria</div>"
  },
  "type": "allergy",
  "code": {
    "coding": [ {
      "system": "http://snomed.info/sct",
      "code": "387207008",
      "display": "Ibuprofen"
    } ]
  },
  "patient": {
    "reference": "Patient/1213949"
  },
  "recorder": {
    "reference": "Practitioner/30164"
  },
  "reaction": [ {
    "manifestation": [ {
      "coding": [ {
        "system": "http://snomed.info/sct",
        "code": "126485001",
        "display": "Urticaria"
      } ]
    } ]
  } ]
}
`
         }
         else if(this.state.setdropdown_value=="CoverageEligibilityRequest")
    {
message = `
{
  "resourceType": "CoverageEligibilityRequest",
  "id": "1178856",
  "meta": {
    "versionId": "1",
    "lastUpdated": "2020-06-02T03:15:25.991+00:00",
    "source": "#zwWYaWYgAavDgvBd",
    "tag": [ {
      "system": "http://edifecs.com",
      "code": "edi"
    } ]
  },
  "identifier": [ {
    "system": "SenderID",
    "value": "Interchange Sen"
  }, {
    "system": "ReceiverID",
    "value": "Interchange Rec"
  }, {
    "system": "1587543978/847590324",
    "value": "63025",
    "assigner": {
      "identifier": {
        "value": "270"
      }
    }
  }, {
    "system": "9EDIFECS  ",
    "value": "10e8dec6-b071-4482-2961-d1962fd79703"
  } ],
  "status": "active",
  "purpose": [ "benefits" ],
  "patient": {
    "reference": "Patient/1178861"
  },
  "created": "2020-06-02T03:14:44Z",
  "provider": {
    "reference": "Organization/1178859"
  },
  "insurer": {
    "reference": "Organization/1178858"
  },
  "insurance": [ {
    "coverage": {
      "reference": "Coverage/C-2878cf740b2b3f449388dbf6e2132dbebc3a9ab4752352467111518f6dff0d0d"
    }
  } ],
  "item": [ {
    "extension": [ {
      "url": "x12.org:plandate",
      "valuePeriod": {
        "start": "2006-01-01"
      }
    } ],
    "productOrService": {
      "coding": [ {
        "system": "HC",
        "code": "D0140"
      } ]
    }
  } ]
}
`
         }
  return (
  
    <div>
        <div>
            <div className="top-padding"><a href={'#' + 'hello' + flag} data-toggle="collapse">{'Message'}</a></div>
            <div className="border-view" style={{ height:  "300px", overflow: "auto" }} id={'hello' + flag}>{flag ? message : message}</div>
        </div>
    </div>
)
}
    renderTopbar() {
        return (
            <div className="row">

                <div className="form-group col-3" >
                    <div className="list-header-dashboard">Select Resource</div>
                    <select defaultValue={"I"} className="form-control list-header-dashboard" id="state" onChange={(e) => this.ChangeVal(e, 'menuType')}>
                       <option value="Patient">Patient</option>
                        <option value="Observation" >Observation</option>
                        <option value="Encounter">Encounter</option>
                        <option value="Immunization">Immunization</option>
                        <option value="Claim" >Claim</option>
                        <option value="DiagnosticReport">Diagnostic Report</option>
                        <option value="Condition">Condition</option>
                        <option value="MedicationRequest">Medication Request</option>
                        <option value="AllergyIntolerance">Allergy Intolerance</option>
                        <option value="CoverageEligibilityRequest">Coverage Eligibility Request</option>
                         
                    </select>
                </div>

             

            </div>
        )
    }

    render() {
        return (
            <div>
                <div>
                    <h5 className="headerText">API Management</h5>
                </div>
                {

                    <div>
                        <p style={{ color: 'var(--main-bg-color)', fontWeight: 'bold' }}></p>
                        {this.renderTopbar()}
                        <div className="row">
                            <div className="col-6" >

                                {this._renderTable()}
                            </div>
                            {this.state.showDetails ?
                                <div className="col-6">
                                    {this.renderDetails()}
                                </div> : null}
                        </div>

                    </div>
                }
            </div>
        );
    }
}