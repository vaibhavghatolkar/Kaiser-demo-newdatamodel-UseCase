import React from 'react'
import '../../Claims/Dashboard/styles.css'
import '../../Claim_276_RealTime/Real_Time_276/style.css'
import '../../color.css'
import '../../Files/files-styles.css';
import moment from 'moment';
import Urls from '../../../../helpers/Urls';
import { Filters } from '../../../components/Filters';
import { AgGridReact } from 'ag-grid-react';
import Strings from '../../../../helpers/Strings';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

export class Outbound_Payment_Compare_Details extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            Subtitle:props.location.state && props.location.state.data[0] && props.location.state.data[0].subtittle ? props.location.state.data[0].subtittle : '',
            Flag:props.location.state && props.location.state.data[0] && props.location.state.data[0].flag ? props.location.state.data[0].flag : '',
            State:'',
            startDate: props.location.state && props.location.state.data[0] && props.location.state.data[0].startDate ? props.location.state.data[0].startDate : '',
            endDate: props.location.state && props.location.state.data[0] && props.location.state.data[0].endDate ? props.location.state.data[0].endDate : '',
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
            rowData: [],
        }
    }

    componentDidMount() {
        
    }

    _RenderList(){
       
          let columnDefs = this.state.Flag=="1" ? [  
            { headerName: "File Name", field: "fileName", width: 160 },
            { headerName: "File Date", field: "fileDate", width:130 },          
            { headerName: "Claims ID", field: "ClaimId", width: 150,  },
            { headerName: "Claims Date", field: "ClaimDate", width:200 },
            { headerName: "Payment Status ", field: "PaymentStatus", width:200 },
            { headerName: "837 Revenue Code", field: "837", width:200 },
            { headerName: "835 Revenue Code", field: "835", width:200 },
            { headerName: "837 Service Lines", field: "837Service", width:350,  },
            { headerName: "835 Service Lines", field: "835Service", width:200,  }
        ]: this.state.Flag=="2" ? [  
            { headerName: "File Name", field: "fileName", width: 170, },
            { headerName: "File Date", field: "fileDate", width:130 },          
            { headerName: "Claims ID", field: "ClaimId", width: 150,  },
            { headerName: "Claims Date", field: "ClaimDate", width:200 },
            { headerName: "Payment Status ", field: "PaymentStatus", width:200 },
            { headerName: "837 CPT Code", field: "837", width:200 },
            { headerName: "835 CPT Code", field: "835", width:200 },
            { headerName: "837 Charge Amount", field: "ChargeAmount837", width:180 },
            { headerName: "835 Charge Amount", field: "ChargeAmount835", width:180 },
            { headerName: "837 Service Lines", field: "837Service", width:350,  },
            { headerName: "835 Service Lines", field: "835Service", width:200,  },
            
        ] : this.state.Flag=="3" ? [  
            { headerName: "File Name", field: "fileName", width: 130 },
            { headerName: "File Date", field: "fileDate", width:130 },          
            { headerName: "Claims ID", field: "ClaimId", width: 150,  },
            { headerName: "Claims Date", field: "ClaimDate", width:200 },
            { headerName: "Payment Status ", field: "PaymentStatus", width:200 },
            { headerName: "837 Payer Name", field: "837", width:150 },
            { headerName: "835 Payer Name", field: "835", flex:1 }
            
        ]: this.state.Flag=="4" ? [  
            { headerName: "File Name", field: "fileName", width: 130 },
            { headerName: "File Date", field: "fileDate", width:130 },          
            { headerName: "Claims ID", field: "ClaimId", width: 150,  },
            { headerName: "Claims Date", field: "ClaimDate", width:200 },
            { headerName: "Payment Status ", field: "PaymentStatus", width:200 },
            { headerName: "837 Invoice Number", field: "837", width:200 },
            { headerName: "835 Invoice Number", field: "835", flex:1 }
        
            // { headerName: "837 Patient Name", field: "SubscriberFirstName", width:200,cellRenderer: (data) => {
            //     return   data.data.SubscriberFirstName + " " + data.data.SubscriberLastName                
            // }
        ] : this.state.Flag=="5" ? [  
            { headerName: "File Name", field: "fileName", width: 130 },
            { headerName: "File Date", field: "fileDate", width:130 },          
            { headerName: "Claims ID", field: "ClaimId", width: 150,  },
            { headerName: "Claims Date", field: "ClaimDate", width:200 },
            { headerName: "Payment Status ", field: "PaymentStatus", width:150 },
            { headerName: "837 Service Lines", field: "837Service", width:350,  },
            { headerName: "835 Service Lines", field: "835Service", width:350,  }
        ] : this.state.Flag=="6" ? [  
            { headerName: "File Name", field: "fileName", width: 130 },
            { headerName: "File Date", field: "fileDate", width:130 },          
            { headerName: "Claims ID", field: "ClaimId", width: 150,  },
            { headerName: "Claims Date", field: "ClaimDate", width:200 },
            { headerName: "Payment Status ", field: "PaymentStatus", width:150 },
            { headerName: "837 Service Lines", field: "837", width:350,  },
            { headerName: "835 Service Lines", field: "835", width:350,  }
        ] : this.state.Flag=="8" ? [  
            { headerName: "File Name", field: "fileName", width: 130 },
            { headerName: "File Date", field: "fileDate", width:130 },          
            { headerName: "Claims ID", field: "ClaimId", width: 150,  },
            { headerName: "Claims Date", field: "ClaimDate", width:200 },
            { headerName: "Payment Status ", field: "PaymentStatus", width:150 },
            { headerName: "837 Service Lines", field: "837Service", width:350,  },
            { headerName: "835 Service Lines", field: "835Service", width:350,  }
        ] : this.state.Flag=="7" ? [  
            { headerName: "File Name", field: "fileName", width: 130 },
            { headerName: "File Date", field: "fileDate", width:130 },          
            { headerName: "Claims ID", field: "ClaimId", width: 150,  },
            { headerName: "Claims Date", field: "ClaimDate", width:200 },
            { headerName: "Payment Status ", field: "PaymentStatus", width:150 },
            { headerName: "837 CLM Segment", field: "CLMSegement837", width:300,  },
            { headerName: "835 Service Lines", field: "Serviceline835", width:200,  },
            { headerName: "835 CLP Segement", field: "CLPSegemnt835", width:350,  },
        ] : null

        let CompareData = this.state.Flag == "1" ? [
            {'fileId':"4409587027123631357", 'fileName':"UseCase1-112UB04_SFHH_837I_V5010_176515_SF_HB.txt.ediclean_20201106-150055_H1222867100.txt", 'fileDate':"2020-11-17T06:03:44.383Z", 'ClaimId':"H12228696600", 'ClaimDate':"2020-11-17T06:03:44.383Z", 'PaymentStatus':"", '837':"0301", '835':"0101", '837Service':"LX*1~SV2*0301*HC>84702*371*UN*1**0~DTP*472*D8*20201007~REF*6R*H122286966001~", '835Service':"SVC*NU>0101*371 *40**1~"        },
            
        ] : this.state.Flag == "2" ? [
            {'fileId':"2286167938954787192", 'fileName':"UseCase2-209CMS1500_COMM_837P_V5010_143184_P091141089861_P09114257786.txt.ediclean_20201106-150108.txt", 'fileDate':"2020-11-17T06:07:15.108Z", 'ClaimId':"P091141089861", 'ClaimDate':"2020-11-17T06:07:15.108Z", 'PaymentStatus':"", '837':"X3936", '835':"Z3936", '837Service':"LX*1~SV1*HC>X3936*119*UN*1***1~DTP*472*D8*20200717~REF*6R*P0911410898611~SVD*1000*88*HC>X3936**1~CAS*CO*45*11~CAS*PR*3*20~DTP*573*D8*20200724~AMT*EAF*20~", '835Service':"SVC*HC>Z3936*1190*0**1~", 'ChargeAmount837':"119", 'ChargeAmount835':"1190"	 },
            
        ]: this.state.Flag == "3" ? [
            {'fileId':"7200559299812942294", 'fileName':"UseCase3-212CMS1500_COMM_837P_V5010_P12860474521_123783.txt.ediclean_20201109-145007.DEID", 'fileDate':"2020-11-17T06:10:30.050Z", 'ClaimId':"P12860474521", 'ClaimDate':"2020-11-17T06:10:30.050Z", 'PaymentStatus':"", '837':"KP MEDICARE", '835':"HEALTH ADMIN CENTER" },
            
        ]: this.state.Flag == "4" ? [
            {'fileId':"6689070622461993197", 'fileName':"UseCase4-112UB04_SFHH_837I_V5010_176515_SF_HB.txt.ediclean_20201106-150055_H1222867100.txt", 'fileDate':"2020-11-17T06:11:58.726Z", 'ClaimId':"H12228697500", 'ClaimDate':"2020-11-17T06:11:58.726Z", 'PaymentStatus':"", '837':"H12228697500", '835':"H12228m97500", },
            
        ]: this.state.Flag == "5" ? [
            {'fileId':"2748280693834025238", 'fileName':"UseCase5-03352_P_IE_176174_10081952.837.ediclean P121011105751_P121015477861_20201106-150030.txt", 'fileDate':"2020-11-17T06:12:46.961Z", 'ClaimId':"P121011105751", 'ClaimDate':"2020-11-17T06:12:46.961Z", 'PaymentStatus':"", '837Service':"[LX*1~SV1*HC>73610>26>RT*36*UN*1***1~DTP*472*D8*20200917~REF*6R*P1210111057511~]", '835Service':"['SVC', 'HC>73610>26>RT', '36.00', '12.04'], ['SVC', 'HC>73610>26>RT', '36.00', '12.04'], ['SVC', 'HC>73590>26>RT', '35.00', '11.06']" },
            
        ]: this.state.Flag == "6" ? [
            {'fileId':"589014246074936870", 'fileName':"UseCase6-212CMS1500_SFHH_837P_V5010_175445.txt.ediclean_P121013230600_20201106-150127.txt", 'fileDate':"2020-11-17T06:13:57.260Z", 'ClaimId':"P121013230600", 'ClaimDate':"2020-11-17T06:13:57.260Z", 'PaymentStatus':"", '837':'["LX*2~SV1*HC>59510*6902*UN*1***2~DTP*472*D8*20200912~REF*6R*P1210132306002~", "LX*1~SV1*HC>58700>XU*2370*UN*1***1~DTP*472*D8*20200912~REF*6R*P1210132306001~"]', '835':"['SVC', 'HC>59510', '6902', '0', '', '1'], ['SVC', 'HC>58700', '2370', '0', '', '1'],['SVC', 'HC>58700', '0', '0', '', '1']" },
            
        ]: this.state.Flag == "7" ? [
            {'fileId':"2039039313281243917", 'fileName':"UseCase7-212CMS1500_COMM_837P_V5010_P12990028912_168006.txt.ediclean_20201109-145030.DEID", 'fileDate':"2020-11-17T06:14:48.198Z", 'ClaimId':"P12990028912", 'ClaimDate':"2020-11-17T06:14:48.198Z", 'PaymentStatus':"", 'CLMSegement837':"CLM*P12990028912*335***23>B>1*Y*A*Y*Y~"	, 'Serviceline835':"SVC*HC>99283*335*8 4.46**1~", 'CLPSegemnt835':"CLP*P12990028912*2 *335*0*48*12*EJFCJ9YHK0000*23*1~"        },
            
        ]: this.state.Flag == "8" ? [
            {'fileId':"8609211606044606177", 'fileName':"UseCase8-03352_P_IE_176174_10081952.837.ediclean P121011105751_P121015477861_20201106-150030.txt", 'fileDate':"2020-11-17T06:16:13.028Z", 'ClaimId':"P121015477861", 'ClaimDate':"2020-11-17T06:16:13.028Z", 'PaymentStatus':"", '837Service':'["LX*1~SV1*HC>99442>95*82*UN*1***1>2>3>4~DTP*472*D8*20200930~REF*6R*P1210154778611~"]', '835Service':"['SVC', 'HC>99214>95', '323.00', '148.74'], ['SVC', 'HC>WC002', '72.00', '12.89'], ['SVC', 'HC>99442>95', '82.00', '82.00']" },
            
        ]:null

        return (
            <div className="text-center">

                <div className="ag-theme-balham" style={{ padding: '0', marginTop: '10px' }}>
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
                        rowData={CompareData}
                        icons={this.state.icons}
                        enableCellTextSelection={true}
                        onCellClicked={(event) => {
                           
                        }}
                    >
                    </AgGridReact>
                </div>
            </div>
        )
    }

    update = (key, value) => {
        this.setState({
            [key]: value
        }, () => {
            this._refreshScreen()
        })
    }

    _renderTopbar = () => {
        return (
            <Filters
                removeGrid={true}
                State={this.state.State}
                removeSubmitter={true} 
                setData={this.setData}
                onGridChange={this.onGridChange}
                update={this.update}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                Updatebutton={true}
            />
        )
    }
    setData = (startDate, endDate, selected_val) => {
        this.setState({
            startDate,
            endDate,
            selected_val
        })
    }
   
    render() {

        return (
            <div>
                <h5 className="headerText">{this.state.Subtitle}</h5>
                {this._renderTopbar()}
               {this._RenderList()}
            </div>
        );
    }
}
