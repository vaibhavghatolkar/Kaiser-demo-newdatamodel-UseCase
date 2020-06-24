import React from 'react';
import '../../Files/files-styles.css';
import { Bar, Line } from 'react-chartjs-2';
import '../../color.css'
import moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";
import Urls from '../../../../helpers/Urls';
import Strings from '../../../../helpers/Strings';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { TableTiles } from '../../../components/TableTiles';
let val = ''

export class Sepsis_Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            claimsList: [],
            summaryList: [],
            type: "",
            apiflag: this.props.apiflag,
            tradingpartner: [],
            startDate: moment().subtract(365, 'd').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
            providerName: '',
            chartType: 'Monthwise',
            selectedTradingPartner: '',
            State: '',
            Months: 0,
            accepted: 0,
            rejected: 0,
            inProgress: 0,
            Accepted_per: 0,
            rejected_per: 0,
            page: 1,
            ClaimBarChart: [],
            claimLabels: [],
            search: '',
            showDetails: false,
            showDetails1: false,
            sepsisTable:false,
            showA04: false,
            flag1: false,
            ErrorTilesShow: false,
            transactionTilesShow: true,
            msg_show:'',
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
        this.handleStartChange = this.handleStartChange.bind(this);
        this.handleEndChange = this.handleEndChange.bind(this);

        this.showFile = this.showFile.bind(this)
        this.getData = this.getData.bind(this)
    }

    componentWillReceiveProps() {
        this.setState({
            apiflag: this.props.apiflag
        })
    }

    componentDidMount() {
        this.getCommonData()
        this.getData()
        this.getListData()
    }

    getCommonData() {
        let query = `{
            Trading_PartnerList(Transaction:"Claim837RT") {
                Trading_Partner_Name 
            }
        }`

        console.log('query ', query)
        fetch(Urls.sql_common_data, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                if (res.data) {
                    this.setState({
                        tradingpartner: res.data.Trading_PartnerList ? res.data.Trading_PartnerList : [],
                    })
                }
            })
            .catch(err => {
                console.log(err)
            });
    }

    getData() {
       
    }

    updateSearch = search => {
        this.setState({ search });
    };

    renderTableHeader() {
    }

    getBarData(labelArray, dataArray, color) {

        labelArray = ['A01', 'A02', 'A03', 'A04', 'A05', 'A08']
        dataArray = ['100000', '2000000', '1400000', '1200000', '1200000', '2200200']
        let bardata = {
            labels: labelArray,
            showFile: false,
            datasets: [
                {
                   
                    backgroundColor: color,
                    borderColor: color,
                    borderWidth: 1,
                    hoverBackgroundColor: color,
                    hoverBorderColor: color,
                    data: dataArray
                }
            ],
            legend: {
                display: false
            }
        }

        return bardata
    }


    renderDetails(flag) {
        let message;
        if(this.state.msg_show == 'ADT_HL7'){
            message = `MSH|^~\&|EPIC|COH||COH|20200616171210|ADTPA|ADT^A01|23193|T|2.5.1EVN|A01|20200616171210||ADT_EVENT|ADTPA^ADT^PATIENT^ACCESS^^^^^COHSA^^^^^DUR|20200616171200PID|1||55100510^^^EPI^MR||TEST^PATHWAY^^^^^L||19810616|M||B|555 STREET PLACE^^LOS ANGELES^CA^90004^US^L^^LOS ANGELES|LOS ANGELES|(818)555-4789^P^H^^^818^5554789||ENG|S||4000002251|887-56-9942|||NOT HISPANIC||N||||||NZPD||MYCH|||||N||NPD1|||DUARTE^^10150CON|1|NPP Acknowle|||||||||Not Recv||20200616171118CON|2|General T OP|||||||||Not Recv||20200616171118||20210615235959CON|3|Identificati|||||||||Not Recv||20200616171118CON|4|QUESTIONNAIR|||||||||Not Recv||20200616171118CON|5|Insur Card|||||||||Not Recv||20200616171118NK1|1|||250 PARKCENTER BLVD^^BOISE^ID^83706^US^^^ADA|(208)395-6200^^H^^^208^3956200||Employer||||||ALBERTSONS||||||||||||||||||||1034PV1|1|AM ADMIT|HCRHOR^HCRH OR^2179^DC^R^^^^OPERATING ROOM^^DEPID|EL|||1103299990^SURGERY^PHYSICIAN^^^^^^NPI^^^^NPI|||Surgery||||Home|||1103299990^SURGERY^PHYSICIAN^^^^^^NPI^^^^NPI||3013472|SELF|||||||||||||||||||||Adm*Conf|||20200616171200PV2||Med Surg||||||20200616171000||||Hospital Encounter|||||||||n|NROL|1|UP|Surgeon|1103299990^SURGERY^PHYSICIAN^^^^^^NPI^^^^NPI|20200616165319||||||123 ANYWHERE STREET^^VERONA^WI^53593^^^^DANE|(555)555-5555^^W^^^555^5555555OBX|1|NM|PRIMARYCSN|1|3013472||||||FCON|1|General Cons|||||||||Not Recv||20200616171118||20210615235959AL1|1|SYSTEMIC|^ALLERGIES NOT ON FILEDG1|1|I10|C54.1^Malignant neoplasm of endometrium^I10|Malignant neoplasm of endometrium||^AGT1|1|1812|TEST^PATHWAY||555 STREET PLACE^^LOS ANGELES^CA^90004^US^^^LOS ANGELES|(818)555-4789^^^^^818^5554789||19810616|M|P/F|SLF|887-56-9942||||ALBERTSONS|250 PARKCENTER BLVD^^BOISE^ID^83706^US|(208)395-6200^^^^^208^3956200||FullZG1||||10`
        }else  if(this.state.msg_show == 'ADT_JSON'){
            message = `{
                "MSH02" : "^~&",
                "MSH03" : "EPIC",
                "MSH04" : "COH",
                "MSH06" : "COH",
                "MSH07" : "20200616171210",
                "MSH08" : "ADTPA",
                "MSH09.1" : "ADT",
                "MSH09.2" : "A01",
                "MSH10" : "23193",
                "MSH11" : "T",
                "MSH12" : "2.5.1",
                "EVN01" : "A01",
                "EVN02" : "20200616171210",
                "EVN04" : "ADT_EVENT",
                "EVN05.1" : "ADTPA",
                "EVN05.2" : "ADT",
                "EVN05.3" : "PATIENT",
                "EVN05.4" : "ACCESS",
                "EVN05.9" : "COHSA",
                "EVN05.14" : "DUR",
                "EVN06" : "20200616171200",
                "PID01" : "1",
                "PID03.1" : "55100510",
                "PID03.4" : "EPI",
                "PID03.5" : "MR",
                "PID05.1" : "TEST^PATHWAY^^^^^L",
                "PID07" : "1981/06/16",
                "PID08" : "M",
                "PID10" : "B",
                "PID11.1" : "555 STREET PLACE",
                "PID11.3" : "LOS ANGELES",
                "PID11.4" : "CA",
                "PID11.5" : "90004",
                "PID11.6" : "US",
                "PID11.7" : "L",
                "PID11.9" : "LOS ANGELES",
                "PID12" : "LOS ANGELES",
                "PID13.1" : "(818)555-4789^P^H^^^818^5554789",
                "PID15" : "ENG",
                "PID16" : "S",
                "PID18" : "4000002251",
                "PID19" : "887-56-9942",
                "PID22" : "NOT HISPANIC",
                "PID24" : "N",
                "PID30" : "N",
                "ZPD02" : "MYCH",
                "ZPD07" : "N",
                "ZPD09" : "N",
                "PD103.1" : "DUARTE",
                "PD103.3" : "10150",
                "CON_PD1" : [
                  {
                    "CON01" : "1",
                    "CON02" : "NPP Acknowle",
                    "CON11" : "Not Recv",
                    "CON13" : "20200616171118"
                  },
                  {
                    "CON01" : "2",
                    "CON02" : "General T OP",
                    "CON11" : "Not Recv",
                    "CON13" : "20200616171118"
                  },
                  {
                    "CON01" : "3",
                    "CON02" : "Identificati",
                    "CON11" : "Not Recv",
                    "CON13" : "20200616171118"
                  },
                  {
                    "CON01" : "4",
                    "CON02" : "QUESTIONNAIR",
                    "CON11" : "Not Recv",
                    "CON13" : "20200616171118"
                  },
                  {
                    "CON01" : "5",
                    "CON02" : "Insur Card",
                    "CON11" : "Not Recv",
                    "CON13" : "20200616171118"
                  }
                ],
                "NK1" : [
                  {
                    "NK101" : "1",
                    "NK104.1" : "250 PARKCENTER BLVD",
                    "NK104.3" : "BOISE",
                    "NK104.4" : "ID",
                    "NK104.5" : "83706",
                    "NK104.6" : "US",
                    "NK104.9" : "ADA",
                    "NK105" : "(208)395-6200^^H^^^208^3956200",
                    "NK107" : "Employer",
                    "NK113" : "ALBERTSONS",
                    "NK133" : "1034"
                  }
                ],
                "PV101" : "1",
                "PV102" : "AM ADMIT",
                "PV103.1" : "HCRHOR",
                "PV103.2" : "HCRH OR",
                "PV103.3" : "2179",
                "PV103.4" : "DC",
                "PV103.5" : "R",
                "PV103.9" : "OPERATING ROOM",
                "PV103.11" : "DEPID",
                "PV104" : "EL",
                "PV107" : "1103299990^SURGERY^PHYSICIAN^^^^^^NPI^^^^NPI",
                "PV110" : "Surgery",
                "PV114" : "Home",
                "PV117" : "1103299990^SURGERY^PHYSICIAN^^^^^^NPI^^^^NPI",
                "PV119" : "3013472",
                "PV120" : "SELF",
                "PV141" : "Adm*Conf",
                "PV144" : "2020/06/16 17:12:00",
                "PV202.1" : "Med Surg",
                "PV208" : "20200616171000",
                "PV212" : "Hospital Encounter",
                "PV221" : "n",
                "PV222" : "N",
                "ROL_PV2" : [
                  {
                    "ROL01" : "1",
                    "ROL02" : "UP",
                    "ROL03.1" : "Surgeon",
                    "ROL04.1" : "1103299990",
                    "ROL04.2" : "SURGERY",
                    "ROL04.3" : "PHYSICIAN",
                    "ROL04.9" : "NPI",
                    "ROL04.13" : "NPI",
                    "ROL05.1" : "20200616165319",
                    "ROL11.1" : "123 ANYWHERE STREET",
                    "ROL11.3" : "VERONA",
                    "ROL11.4" : "WI",
                    "ROL11.5" : "53593",
                    "ROL12.1" : "(555)555-5555",
                    "ROL12.3" : "W",
                    "ROL12.6" : "555",
                    "ROL12.7" : "5555555"
                  }
                ],
                "OBX" : [
                  {
                    "OBX01" : "1",
                    "OBX02" : "NM",
                    "OBX03.1" : "PRIMARYCSN",
                    "OBX04" : "1",
                    "OBX05" : "3013472",
                    "OBX11" : "F"
                  }
                ],
                "CON_PV2" : [
                  {
                    "CON01" : "1",
                    "CON02" : "General Cons",
                    "CON11" : "Not Recv",
                    "CON13" : "20200616171118"
                  }
                ],
                "AL1" : [
                  {
                    "AL101" : "1",
                    "AL102.1" : "SYSTEMIC",
                    "AL103.2" : "ALLERGIES NOT ON FILE"
                  }
                ],
                "DG1" : [
                  {
                    "DG101" : "1",
                    "DG102" : "I10",
                    "DG103.1" : "C54.1",
                    "DG103.2" : "Malignant neoplasm of endometrium",
                    "DG103.3" : "I10",
                    "DG104" : "Malignant neoplasm of endometrium",
                    "DG106" : "^A"
                  }
                ],
                "GT_Array" : [
                  {
                    "GT101" : "1",
                    "GT102" : "1812",
                    "GT103.1" : "TEST",
                    "GT103.2" : "PATHWAY",
                    "GT105.1" : "555 STREET PLACE",
                    "GT105.3" : "LOS ANGELES",
                    "GT105.4" : "CA",
                    "GT105.5" : "90004",
                    "GT105.6" : "US",
                    "GT105.9" : "LOS ANGELES",
                    "GT106.1" : "(818)555-4789",
                    "GT106.6" : "818",
                    "GT106.7" : "5554789",
                    "GT108.1" : "19810616",
                    "GT109" : "M",
                    "GT110" : "P/F",
                    "GT111" : "SLF",
                    "GT112" : "887-56-9942",
                    "GT116" : "ALBERTSONS",
                    "GT117.1" : "250 PARKCENTER BLVD",
                    "GT117.3" : "BOISE",
                    "GT117.4" : "ID",
                    "GT117.5" : "83706",
                    "GT117.6" : "US",
                    "GT118.1" : "(208)395-6200",
                    "GT118.6" : "208",
                    "GT118.7" : "3956200",
                    "GT120" : "Full"
                  }
                ],
                "CreateDateTime" : "2020/06/16 17:12:18"
              }`
        }else if(this.state.msg_show == 'ADT_JSON_ENRICHED'){
            message='{"MSH02": "^~&", "MSH03": "EPIC", "MSH04": "COH", "MSH06": "COH", "MSH07": "20200616171210", "MSH08": "ADTPA", "MSH09.1": "ADT", "MSH09.2": "A01", "MSH10": "23193", "MSH11": "T", "MSH12": "2.5.1", "EVN01": "A01", "EVN02": "20200616171210", "EVN04": "ADT_EVENT", "EVN05.1": "ADTPA", "EVN05.2": "ADT", "EVN05.3": "PATIENT", "EVN05.4": "ACCESS", "EVN05.9": "COHSA", "EVN05.14": "DUR", "EVN06": "20200616171200", "PID01": "1", "PID03.1": "55100510", "PID03.4": "EPI", "PID03.5": "MR", "PID05.1": "TEST^PATHWAY^^^^^L", "PID07": "1981/06/16", "PID08": "M", "PID10": "B", "PID11.1": "555 STREET PLACE", "PID11.3": "LOS ANGELES", "PID11.4": "CA", "PID11.5": "90004", "PID11.6": "US", "PID11.7": "L", "PID11.9": "LOS ANGELES", "PID12": "LOS ANGELES", "PID13.1": "(818)555-4789^P^H^^^818^5554789", "PID15": "ENG", "PID16": "S", "PID18": "4000002251", "PID19": "887-56-9942", "PID22": "NOT HISPANIC", "PID24": "N", "PID30": "N", "ZPD02": "MYCH", "ZPD07": "N", "ZPD09": "N", "PD103.1": "DUARTE", "PD103.3": "10150", "CON_PD1": [{"CON01": "1", "CON02": "NPP Acknowle", "CON11": "Not Recv", "CON13": "20200616171118"}, {"CON01": "2", "CON02": "General T OP", "CON11": "Not Recv", "CON13": "20200616171118"}, {"CON01": "3", "CON02": "Identificati", "CON11": "Not Recv", "CON13": "20200616171118"}, {"CON01": "4", "CON02": "QUESTIONNAIR", "CON11": "Not Recv", "CON13": "20200616171118"}, {"CON01": "5", "CON02": "Insur Card", "CON11": "Not Recv", "CON13": "20200616171118"}], "NK1": [{"NK101": "1", "NK104.1": "250 PARKCENTER BLVD", "NK104.3": "BOISE", "NK104.4": "ID", "NK104.5": "83706", "NK104.6": "US", "NK104.9": "ADA", "NK105": "(208)395-6200^^H^^^208^3956200", "NK107": "Employer", "NK113": "ALBERTSONS", "NK133": "1034"}], "PV101": "1", "PV102": "AM ADMIT", "PV103.1": "HCRHOR", "PV103.2": "HCRH OR", "PV103.3": "2179", "PV103.4": "DC", "PV103.5": "R", "PV103.9": "OPERATING ROOM", "PV103.11": "DEPID", "PV104": "EL", "PV107": "1103299990^SURGERY^PHYSICIAN^^^^^^NPI^^^^NPI", "PV110": "Surgery", "PV114": "Home", "PV117": "1103299990^SURGERY^PHYSICIAN^^^^^^NPI^^^^NPI", "PV119": "3013472", "PV120": "SELF", "PV141": "Adm*Conf", "PV144": "2020/06/16 17:12:00", "PV202.1": "Med Surg", "PV208": "20200616171000", "PV212": "Hospital Encounter", "PV221": "n", "PV222": "N", "ROL_PV2": [{"ROL01": "1", "ROL02": "UP", "ROL03.1": "Surgeon", "ROL04.1": "1103299990", "ROL04.2": "SURGERY", "ROL04.3": "PHYSICIAN", "ROL04.9": "NPI", "ROL04.13": "NPI", "ROL05.1": "20200616165319", "ROL11.1": "123 ANYWHERE STREET", "ROL11.3": "VERONA", "ROL11.4": "WI", "ROL11.5": "53593", "ROL12.1": "(555)555-5555", "ROL12.3": "W", "ROL12.6": "555", "ROL12.7": "5555555"}], "OBX": [{"OBX01": "1", "OBX02": "NM", "OBX03.1": "PRIMARYCSN", "OBX04": "1", "OBX05": "3013472", "OBX11": "F"}], "CON_PV2": [{"CON01": "1", "CON02": "General Cons", "CON11": "Not Recv", "CON13": "20200616171118"}], "AL1": [{"AL101": "1", "AL102.1": "SYSTEMIC", "AL103.2": "ALLERGIES NOT ON FILE"}], "DG1": [{"DG101": "1", "DG102": "I10", "DG103.1": "C54.1", "DG103.2": "Malignant neoplasm of endometrium", "DG103.3": "I10", "DG104": "Malignant neoplasm of endometrium", "DG106": "^A"}], "GT_Array": [{"GT101": "1", "GT102": "1812", "GT103.1": "TEST", "GT103.2": "PATHWAY", "GT105.1": "555 STREET PLACE", "GT105.3": "LOS ANGELES", "GT105.4": "CA", "GT105.5": "90004", "GT105.6": "US", "GT105.9": "LOS ANGELES", "GT106.1": "(818)555-4789", "GT106.6": "818", "GT106.7": "5554789", "GT108.1": "19810616", "GT109": "M", "GT110": "P/F", "GT111": "SLF", "GT112": "887-56-9942", "GT116": "ALBERTSONS", "GT117.1": "250 PARKCENTER BLVD", "GT117.3": "BOISE", "GT117.4": "ID", "GT117.5": "83706", "GT117.6": "US", "GT118.1": "(208)395-6200", "GT118.6": "208", "GT118.7": "3956200", "GT120": "Full"}], "CreateDateTime": "2020/06/16 17:12:18", "ICD_Codes": ["C54.1"]}'
        }
        else if(this.state.msg_show == 'VITALS_HL7'){
            message=`MSH|^~\&|||||20200505122251|100174|ORU^R01|353|T|2.5.1PID|1||55102172^^^EPI^MR||GRANDC-UAT^TWENTYONE^^^^^L||19810208|F|LEE^SOON~LEE^SOON^HIE \T\ HIE \T\|O|16000 VILLA YORBA APT 122^^HUNTINGTON BEACH^CA^92647^US^L||(714)454-7224^P^H^^^714^4547224~^NET^Internet^jellybean78@sbcglobal.net~(213)820-5600^P^M^^^213^8205600||KOR|DIVORCED|PROTESTANT|309181192|xxx-09-xxxx|||NOT HISPANIC||||||||NPV1|1|Outpatient|BRMNPNMGMT^^^DC^^^^^^^DEPID||||31807^TRIVEDI^MANISHA^LOOMBA^^^^^PROVID^^^^PROVID~1699985044^TRIVEDI^MANISHA^LOOMBA^^^^^NPI^^^^NPI|31807^TRIVEDI^MANISHA^LOOMBA^^^^^PROVID^^^^PROVID~1699985044^TRIVEDI^MANISHA^LOOMBA^^^^^NPI^^^^NPI||||||Phys/Clinic|||||309181192|CARE||||||||||||||||||||||||20200616134709|||669|||309181192OBR|1||284939220200616140400||||20200616140400OBX|1|ST|BP^BP^FDCID||130/80||||||F|||20200616140400||209454^ARTEAGA^ADRIANOBX|2|NM|Temp^Temp^FDCID||36.7|C|||||F|||20200616140400||209454^ARTEAGA^ADRIANOBX|3|NM|HR^Pulse^FDCID||79||||||F|||20200616140400||209454^ARTEAGA^ADRIANOBX|4|NM|RR^Resp^FDCID||20||||||F|||20200616140400||209454^ARTEAGA^ADRIANOBX|5|NM|SpO2^SpO2^FDCID||97|%|||||F|||20200616140400||209454^ARTEAGA^ADRIANOBX|6|NM|Weight^Weight^FDCID||55.7|kg|||||F|||20200616140400||209454^ARTEAGA^ADRIAN`
        }
        else if(this.state.msg_show == 'VITALS_JSON'){
            message=`{
  "MSH02" : "^~&",
  "MSH07" : "20200505122251",
  "MSH08" : "100174",
  "MSH09.1" : "ORU",
  "MSH09.2" : "R01",
  "MSH10" : "353",
  "MSH11.1" : "T",
  "MSH12.1" : "2.5.1",
  "PID01" : "1",
  "PID03.1" : "55102172",
  "PID03.4" : "EPI",
  "PID03.5" : "MR",
  "PID05.1" : "GRANDC-UAT^TWENTYONE^^^^^L",
  "PID07" : "19810208",
  "PID08.1" : "F",
  "PID09" : "LEE^SOON~LEE^SOON^HIE  HIE ",
  "PID10.1" : "O",
  "PID11.1" : "16000 VILLA YORBA APT 122",
  "PID11.3" : "HUNTINGTON BEACH",
  "PID11.4" : "CA",
  "PID11.5" : "92647",
  "PID11.6" : "US",
  "PID11.7" : "L",
  "PID13.1" : "(714)454-7224^P^H^^^714^4547224~^NET^Internet^jellybean78@sbcglobal.net~(213)820-5600^P^M^^^213^8205600",
  "PID15.1" : "KOR",
  "PID16.1" : "DIVORCED",
  "PID17.1" : "PROTESTANT",
  "PID18.1" : "309181192",
  "PID19" : "xxx-09-xxxx",
  "PID22.1" : "NOT HISPANIC",
  "PID30" : "N",
  "PV101" : "1",
  "PV102.1" : "Outpatient",
  "PV103.1" : "BRMNPNMGMT",
  "PV103.4" : "DC",
  "PV103.11" : "DEPID",
  "PV107.1" : "31807^TRIVEDI^MANISHA^LOOMBA^^^^^PROVID^^^^PROVID~1699985044^TRIVEDI^MANISHA^LOOMBA^^^^^NPI^^^^NPI",
  "PV108" : "31807^TRIVEDI^MANISHA^LOOMBA^^^^^PROVID^^^^PROVID~1699985044^TRIVEDI^MANISHA^LOOMBA^^^^^NPI^^^^NPI",
  "PV114" : "Phys/Clinic",
  "PV119" : "309181192",
  "PV120" : "CARE",
  "PV144" : "2020/06/16 13:47:09",
  "PV147" : "669",
  "PV150" : "309181192",
  "OBR" : [
    {
      "OBR01" : "1",
      "OBR03.1" : "284939220200616140400",
      "OBR07" : "20200616140400",
      "OBX" : [
        {
          "OBX01" : "1",
          "OBX02" : "ST",
          "OBX03.1" : "BP",
          "OBX03.2" : "BP",
          "OBX03.3" : "FDCID",
          "OBX05" : "130/80",
          "OBX11" : "F",
          "OBX14" : "2020/06/16 14:04:00",
          "OBX16.1" : "209454",
          "OBX16.2" : "ARTEAGA",
          "OBX16.3" : "ADRIAN"
        },
        {
          "OBX01" : "2",
          "OBX02" : "NM",
          "OBX03.1" : "Temp",
          "OBX03.2" : "Temp",
          "OBX03.3" : "FDCID",
          "OBX05" : "36.7",
          "OBX06.1" : "C",
          "OBX11" : "F",
          "OBX14" : "2020/06/16 14:04:00",
          "OBX16.1" : "209454",
          "OBX16.2" : "ARTEAGA",
          "OBX16.3" : "ADRIAN"
        },
        {
          "OBX01" : "3",
          "OBX02" : "NM",
          "OBX03.1" : "HR",
          "OBX03.2" : "Pulse",
          "OBX03.3" : "FDCID",
          "OBX05" : "79",
          "OBX11" : "F",
          "OBX14" : "2020/06/16 14:04:00",
          "OBX16.1" : "209454",
          "OBX16.2" : "ARTEAGA",
          "OBX16.3" : "ADRIAN"
        },
        {
          "OBX01" : "4",
          "OBX02" : "NM",
          "OBX03.1" : "RR",
          "OBX03.2" : "Resp",
          "OBX03.3" : "FDCID",
          "OBX05" : "20",
          "OBX11" : "F",
          "OBX14" : "2020/06/16 14:04:00",
          "OBX16.1" : "209454",
          "OBX16.2" : "ARTEAGA",
          "OBX16.3" : "ADRIAN"
        },
        {
          "OBX01" : "5",
          "OBX02" : "NM",
          "OBX03.1" : "SpO2",
          "OBX03.2" : "SpO2",
          "OBX03.3" : "FDCID",
          "OBX05" : "97",
          "OBX06.1" : "%",
          "OBX11" : "F",
          "OBX14" : "2020/06/16 14:04:00",
          "OBX16.1" : "209454",
          "OBX16.2" : "ARTEAGA",
          "OBX16.3" : "ADRIAN"
        },
        {
          "OBX01" : "6",
          "OBX02" : "NM",
          "OBX03.1" : "Weight",
          "OBX03.2" : "Weight",
          "OBX03.3" : "FDCID",
          "OBX05" : "55.7",
          "OBX06.1" : "kg",
          "OBX11" : "F",
          "OBX14" : "2020/06/16 14:04:00",
          "OBX16.1" : "209454",
          "OBX16.2" : "ARTEAGA",
          "OBX16.3" : "ADRIAN"
        }
      ]
    }
  ],
  "CreateDateTime" : "2020/06/16 15:38:46"
}
`
        }
        else if(this.state.msg_show == 'LABORDERS_HL7'){
            message=`MSH|^~\&|EPIC|COH|||20200616155332|LABBACKGROUND|ORU^R01^ORU_R01|2305|T|2.5.1|||||||||PHLabReport-Ack^^2.16.840.1.114222.4.10.3^ISOSFT|Epic Systems Corporation^L^^^^ANSI&1.2.840&ISO^XX^^^1.2.840.114350|November 2019|Bridges|9.1.0.0||20200320194724PID|1||29^^^RQGID^RQGID||BEAKER^SANDRA||19770101|F|||1500 E DUARTE RD^^^CA^91010|||||||1744||||||||||||NORC|RE|55211|20168V-VL0001^Beaker|20168V-VL0001^Beaker||||||||1063464592^SANTANDER^MARIA^F^^^^^NPI^^^^NPI~25650^SANTANDER^MARIA^F^^^^^PROVID^^^^PROVID||(626)256-4673^^^^^626^2564673|20200616142835|||||||||1500 E. Duarte Road^Div of Hospital Medicine^DUARTE^CA^91010^US^COBR|1|55211|20168V-VL0001^Beaker|LAB919^HIV 1 RNA QUANTITATIVE BY PCR^^^^^^^HIV 1 RNA QUANTITATIVE BY PCR|||20200616142800||||Lab Collect||Z00.00|||1063464592^SANTANDER^MARIA^F^^^^^NPI^^^^NPI~25650^SANTANDER^MARIA^F^^^^^PROVID^^^^PROVID|(626)256-4673^^^^^626^2564673|||||20200616155300||Microbiology|F|||||||&Coh Interface&Viracor&Results InTQ1|1||||||||ROBX|1|ST|^^^^^^^^HIV LOG (10) COPIES/ML||<1.30|Log Cp/mL|Not Detected|H|||F|||20200616142800||EDIVIRACORIN^COH INTERFACE^VIRACOR^RESULTS IN|||20200616155317||||VIRACOR REFERENCE LAB^D^^^^CLIA^XX^^^VIRACOR|NPI # 1427386796^1001 NW TECHNOLOGY DRIVE^LEE'S SUMMIT^MO^64086^^BNTE|1|L|Detects HIV-1 groups M and ONTE|2|L|Assay Range:NTE|3|L|20 Copies/mL to 1.00E+07 Copies/mLNTE|4|L|1.30 Log10 Copies/mL to 7.00 Log10 Copies/mLNTE|5|L|Result Interpretation:NTE|6|L|Not Detected: Target not detectedNTE|7|L|<20 Copies/mL (a): DetectedNTE|8|L|20 to 1.00E+07 Copies/mL (b): Quantity reportedNTE|9|L|>1.00E+07 Copies/mL (c): > upper limit of quantitation (ULQ)NTE|10|L|(a) Below lower limit of quantitation (LLQ); HIV-1 RNA can be detected butNTE|11|L|is not quantifiable.NTE|12|L|(b) A result between 20  to 1.00E+07 Copies/mL indicates that HIV-1 RNANTE|13|L|was detected and the concentration falls between the LLQ and ULQ.NTE|14|L|(c) A result of >1.00E+07 Copies/mL indicates that target was detected andNTE|15|L|is greater than ULQ.NTE|16|L|Expected Result: Not DetectedNTE|17|L|This assay is intended for use in conjunction with clinical presentationNTE|18|L|and other laboratory markers of disease progress for the clinicalNTE|19|L|management of HIV-1 infected patients.NTE|20|L|The assay can be used to assess patient prognosis by measuring theNTE|21|L|baseline HIV-1 RNA level or to monitor the effects of antiretroviralNTE|22|L|therapy by measuring changes in EDTANTE|23|L|plasma HIV-1 RNA levels during the course of antiretroviral treatment.NTE|24|L|This assay is not intended for use as a screening test for the presence ofNTE|25|L|HIV-1 in blood or blood productsNTE|26|L|or as a diagnostic test to confirm the presence of HIV-1 infection.NTE|27|L|COBAS AmpliPrep/COBAS TaqMan HIV-1 Test, version 2.0 is a product of RocheNTE|28|L|Diagnostics. It is FDA approved for in vitro diagnostic use.NTE|29|L|Testing Performed At:NTE|30|L|Viracor EurofinsNTE|31|L|1001 NW Technology DriveNTE|32|L|Lee's Summit, MO 64086NTE|33|L|(800) 305-5198OBX|2|ST|^^^^^^^^HIV1 COPIES/ML||<20|copies/mL|Not Detected|H|||F|||20200616142800||EDIVIRACORIN^COH INTERFACE^VIRACOR^RESULTS IN|||20200616155317||||VIRACOR REFERENCE LAB^D^^^^CLIA^XX^^^VIRACOR|NPI # 1427386796^1001 NW TECHNOLOGY DRIVE^LEE'S SUMMIT^MO^64086^^BSPM|1|||Blood^Blood^^^^^^^Blood||||Blood, Venou^Blood, Venous^^^^^^^Blood, Venous|||||||||20200616142800|20200616154900`
        }
        else if(this.state.msg_show == 'LABORDERS_JSON'){
            message=`{
                "MSH02" : "^~&",
                "MSH03.1" : "EPIC",
                "MSH04.1" : "COH",
                "MSH07" : "20200616155332",
                "MSH08" : "LABBACKGROUND",
                "MSH09.1" : "ORU",
                "MSH09.2" : "R01",
                "MSH09.3" : "ORU_R01",
                "MSH10" : "2305",
                "MSH11.1" : "T",
                "MSH12.1" : "2.5.1",
                "MSH21.1" : "PHLabReport-Ack",
                "MSH21.3" : "2.16.840.1.114222.4.10.3",
                "MSH21.4" : "ISO",
                "SFT" : [
                  {
                    "SFT01.1" : "Epic Systems Corporation",
                    "SFT01.2" : "L",
                    "SFT01.6.1" : "ANSI&1.2.840&ISO",
                    "SFT01.7" : "XX",
                    "SFT01.10" : "1.2.840.114350",
                    "SFT02" : "November 2019",
                    "SFT03" : "Bridges",
                    "SFT04" : "9.1.0.0",
                    "SFT06" : "20200320194724"
                  }
                ],
                "PID01" : "1",
                "PID03.1" : "29",
                "PID03.4" : "RQGID",
                "PID03.5" : "RQGID",
                "PID05.1" : "BEAKER^SANDRA",
                "PID07" : "19770101",
                "PID08.1" : "F",
                "PID11.1" : "1500 E DUARTE RD",
                "PID11.4" : "CA",
                "PID11.5" : "91010",
                "PID18.1" : "1744",
                "PID30" : "N",
                "ORC" : [
                  {
                    "ORC01" : "RE",
                    "ORC02.1" : "55211",
                    "ORC03.1" : "20168V-VL0001",
                    "ORC03.2" : "Beaker",
                    "ORC04.1" : "20168V-VL0001",
                    "ORC04.2" : "Beaker",
                    "ORC12.1" : "1063464592",
                    "ORC14.1" : "(626)256-4673",
                    "ORC14.7" : "2564673",
                    "ORC15" : "20200616142835",
                    "ORC24.1" : "1500 E. Duarte Road",
                    "ORC24.2" : "Div of Hospital Medicine",
                    "ORC24.3" : "DUARTE",
                    "ORC24.4" : "CA",
                    "ORC24.5" : "91010",
                    "ORC24.6" : "US",
                    "ORC24.7" : "C"
                  }
                ],
                "OBR" : [
                  {
                    "OBR01" : "1",
                    "OBR02.1" : "55211",
                    "OBR03.1" : "20168V-VL0001",
                    "OBR03.2" : "Beaker",
                    "OBR04.1" : "LAB919",
                    "OBR04.2" : "HIV 1 RNA QUANTITATIVE BY PCR",
                    "OBR04.9" : "HIV 1 RNA QUANTITATIVE BY PCR",
                    "OBR07" : "20200616142800",
                    "OBR11" : "Lab Collect",
                    "OBR13" : "Z00.00",
                    "OBR16.1" : "1063464592^SANTANDER^MARIA^F^^^^^NPI^^^^NPI~25650^SANTANDER^MARIA^F^^^^^PROVID^^^^PROVID",
                    "OBR17.1" : "(626)256-4673",
                    "OBR17.6" : "626",
                    "OBR17.7" : "2564673",
                    "OBR22" : "20200616155300",
                    "OBR24" : "Microbiology",
                    "OBR25" : "F",
                    "OBR32" : "&Coh Interface&Viracor&Results In",
                    "TQ" : [
                      {
                        "TQ101" : "1",
                        "TQ109" : "R"
                      }
                    ],
                    "OBX" : [
                      {
                        "OBX01" : "1",
                        "OBX02" : "ST",
                        "OBX03.9" : "HIV LOG (10) COPIES/ML",
                        "OBX05" : "<1.30",
                        "OBX06.1" : "Log Cp/mL",
                        "OBX07" : "Not Detected",
                        "OBX08" : "H",
                        "OBX11" : "F",
                        "OBX14" : "2020/06/16 14:28:00",
                        "OBX16.1" : "EDIVIRACORIN",
                        "OBX16.2" : "COH INTERFACE",
                        "OBX16.3" : "VIRACOR",
                        "OBX16.4" : "RESULTS IN",
                        "OBX19" : "2020/06/16 15:53:17",
                        "OBX23.1" : "VIRACOR REFERENCE LAB",
                        "OBX23.2" : "D",
                        "OBX23.6" : "CLIA",
                        "OBX23.7" : "XX",
                        "OBX23.10" : "VIRACOR",
                        "OBX24.1" : "NPI # 1427386796",
                        "OBX24.2" : "1001 NW TECHNOLOGY DRIVE",
                        "OBX24.3" : "LEE'S SUMMIT",
                        "OBX24.4" : "MO",
                        "OBX24.5" : "64086",
                        "OBX24.7" : "B",
                        "NTE" : [
                          {
                            "NTE01" : "1",
                            "NTE02" : "L",
                            "NTE03" : "Detects HIV-1 groups M and O"
                          },
                          {
                            "NTE01" : "2",
                            "NTE02" : "L",
                            "NTE03" : "Assay Range:"
                          },
                          {
                            "NTE01" : "3",
                            "NTE02" : "L",
                            "NTE03" : "20 Copies/mL to 1.00E+07 Copies/mL"
                          },
                          {
                            "NTE01" : "4",
                            "NTE02" : "L",
                            "NTE03" : "1.30 Log10 Copies/mL to 7.00 Log10 Copies/mL"
                          },
                          {
                            "NTE01" : "5",
                            "NTE02" : "L",
                            "NTE03" : "Result Interpretation:"
                          },
                          {
                            "NTE01" : "6",
                            "NTE02" : "L",
                            "NTE03" : "Not Detected: Target not detected"
                          },
                          {
                            "NTE01" : "7",
                            "NTE02" : "L",
                            "NTE03" : "<20 Copies/mL (a): Detected"
                          },
                          {
                            "NTE01" : "8",
                            "NTE02" : "L",
                            "NTE03" : "20 to 1.00E+07 Copies/mL (b): Quantity reported"
                          },
                          {
                            "NTE01" : "9",
                            "NTE02" : "L",
                            "NTE03" : ">1.00E+07 Copies/mL (c): > upper limit of quantitation (ULQ)"
                          },
                          {
                            "NTE01" : "10",
                            "NTE02" : "L",
                            "NTE03" : "(a) Below lower limit of quantitation (LLQ); HIV-1 RNA can be detected but"
                          },
                          {
                            "NTE01" : "11",
                            "NTE02" : "L",
                            "NTE03" : "is not quantifiable."
                          },
                          {
                            "NTE01" : "12",
                            "NTE02" : "L",
                            "NTE03" : "(b) A result between 20  to 1.00E+07 Copies/mL indicates that HIV-1 RNA"
                          },
                          {
                            "NTE01" : "13",
                            "NTE02" : "L",
                            "NTE03" : "was detected and the concentration falls between the LLQ and ULQ."
                          },
                          {
                            "NTE01" : "14",
                            "NTE02" : "L",
                            "NTE03" : "(c) A result of >1.00E+07 Copies/mL indicates that target was detected and"
                          },
                          {
                            "NTE01" : "15",
                            "NTE02" : "L",
                            "NTE03" : "is greater than ULQ."
                          },
                          {
                            "NTE01" : "16",
                            "NTE02" : "L",
                            "NTE03" : "Expected Result: Not Detected"
                          },
                          {
                            "NTE01" : "17",
                            "NTE02" : "L",
                            "NTE03" : "This assay is intended for use in conjunction with clinical presentation"
                          },
                          {
                            "NTE01" : "18",
                            "NTE02" : "L",
                            "NTE03" : "and other laboratory markers of disease progress for the clinical"
                          },
                          {
                            "NTE01" : "19",
                            "NTE02" : "L",
                            "NTE03" : "management of HIV-1 infected patients."
                          },
                          {
                            "NTE01" : "20",
                            "NTE02" : "L",
                            "NTE03" : "The assay can be used to assess patient prognosis by measuring the"
                          },
                          {
                            "NTE01" : "21",
                            "NTE02" : "L",
                            "NTE03" : "baseline HIV-1 RNA level or to monitor the effects of antiretroviral"
                          },
                          {
                            "NTE01" : "22",
                            "NTE02" : "L",
                            "NTE03" : "therapy by measuring changes in EDTA"
                          },
                          {
                            "NTE01" : "23",
                            "NTE02" : "L",
                            "NTE03" : "plasma HIV-1 RNA levels during the course of antiretroviral treatment."
                          },
                          {
                            "NTE01" : "24",
                            "NTE02" : "L",
                            "NTE03" : "This assay is not intended for use as a screening test for the presence of"
                          },
                          {
                            "NTE01" : "25",
                            "NTE02" : "L",
                            "NTE03" : "HIV-1 in blood or blood products"
                          },
                          {
                            "NTE01" : "26",
                            "NTE02" : "L",
                            "NTE03" : "or as a diagnostic test to confirm the presence of HIV-1 infection."
                          },
                          {
                            "NTE01" : "27",
                            "NTE02" : "L",
                            "NTE03" : "COBAS AmpliPrep/COBAS TaqMan HIV-1 Test, version 2.0 is a product of Roche"
                          },
                          {
                            "NTE01" : "28",
                            "NTE02" : "L",
                            "NTE03" : "Diagnostics. It is FDA approved for in vitro diagnostic use."
                          },
                          {
                            "NTE01" : "29",
                            "NTE02" : "L",
                            "NTE03" : "Testing Performed At:"
                          },
                          {
                            "NTE01" : "30",
                            "NTE02" : "L",
                            "NTE03" : "Viracor Eurofins"
                          },
                          {
                            "NTE01" : "31",
                            "NTE02" : "L",
                            "NTE03" : "1001 NW Technology Drive"
                          },
                          {
                            "NTE01" : "32",
                            "NTE02" : "L",
                            "NTE03" : "Lee's Summit, MO 64086"
                          },
                          {
                            "NTE01" : "33",
                            "NTE02" : "L",
                            "NTE03" : "(800) 305-5198"
                          }
                        ]
                      },
                      {
                        "OBX01" : "2",
                        "OBX02" : "ST",
                        "OBX03.9" : "HIV1 COPIES/ML",
                        "OBX05" : "<20",
                        "OBX06.1" : "copies/mL",
                        "OBX07" : "Not Detected",
                        "OBX08" : "H",
                        "OBX11" : "F",
                        "OBX14" : "2020/06/16 14:28:00",
                        "OBX16.1" : "EDIVIRACORIN",
                        "OBX16.2" : "COH INTERFACE",
                        "OBX16.3" : "VIRACOR",
                        "OBX16.4" : "RESULTS IN",
                        "OBX19" : "2020/06/16 15:53:17",
                        "OBX23.1" : "VIRACOR REFERENCE LAB",
                        "OBX23.2" : "D",
                        "OBX23.6" : "CLIA",
                        "OBX23.7" : "XX",
                        "OBX23.10" : "VIRACOR",
                        "OBX24.1" : "NPI # 1427386796",
                        "OBX24.2" : "1001 NW TECHNOLOGY DRIVE",
                        "OBX24.3" : "LEE'S SUMMIT",
                        "OBX24.4" : "MO",
                        "OBX24.5" : "64086",
                        "OBX24.7" : "B"
                      }
                    ]
                  }
                ],
                "CreateDateTime" : "2020/06/16 15:53:40"
              }`
        }
        else if(this.state.msg_show == 'MEDICATIONS_HL7'){
            message=`MSH|^~\&|Epic|COH||COH|20200401140745|RISTECH|RDE^O11|370|T|2.3PID|||55102363^^^EPI^MR||TEST^NAGA^^^^^D||19900102|M||O|HYD^^JEWELL^IA^50130^US^L^^HAMILTON|HAMILTON|(236)547-8963^P^H^^^236^5478963~^NET^Internet^xyz@yahoo.com||TEL|M||3010137|445-14-5252|||HISPANICPV1||OUTPATIENT|HCRHCTIMAG^^^DC^^^^^^^DEPID||||1417903147^RESSLER^JULIE^A^^^^^NPI^^^^NPI~20743^RESSLER^JULIE^A^^^^^PROVID^^^^PROVID|1417903147^RESSLER^JULIE^A^^^^^NPI^^^^NPI~20743^RESSLER^JULIE^A^^^^^PROVID^^^^PROVID|||||||||||3010137|||||||||||||||||||||||||20200401140709ORC|NW|38007^EPC|||||^Once&1445^X1^20200401144500^^R||20200401140743|RISTECH^RADIOLOGY^TECHNOLOGIST|400132^RADIOLOGY^TECHNOLOGIST^^^^^^PROVID^^^^PROVID|1417903147^RESSLER^JULIE^A^^^^^NPI^^^^NPI~20743^RESSLER^JULIE^A^^^^^PROVID^^^^PROVID||(626)218-8252^^^^^626^2188252|||||||Duarte|1500 DUARTE RD^^DUARTE^CA^91010-3012|(626)256-4673^^^^^626^2564673|1500 E. DUARTE ROAD, SUITE 1300^DEPT OF DIAGNOSTIC RADIOLOGY (HCRH)^DUARTE^CA^91010^US|||||IRXE|^Once&1445^X1^20200401144500^^R|10328^IOPAMIDOL 76 % IV SOLN^^^^^^^iopamidol (ISOVUE-370) 76 % solution 125 mL|125||mL^mL|47|Dose per Radiologist|||1|GC^Glass Cont||BR3180433^RESSLER^JULIE^A||||||||||||1|mL^mL||||STANDARD|||1|mL^mL||||||^RADIOPHARM RXTQ1|1||Once|1445|||20200401144500||R|||||1RXR|IV^IntravenousRXC||10328^IOPAMIDOL 76 % IV SOLN|125|mL^mL|125|mL^mLZTA|125|mL|||1015||||||||125 mL Glass Cont`
        }
        else if(this.state.msg_show == 'MEDICATIONS_JSON'){
            message=`{"MSH02": "^~&", "MSH03.1": "Epic", "MSH04.1": "COH", "MSH06.1": "COH", "MSH07": "20200406155132", "MSH08": "203758", "MSH09.1": "RDE", "MSH09.2": "O11", "MSH10": "379", "MSH11.1": "T", "MSH12.1": "2.3", "PID03.1": "55102300", "PID03.4": "EPI", "PID03.5": "MR", "PID05.1": "RAD-TEST^NINE^^^^^D", "PID07": "19820326", "PID08.1": "F", "PID09": "RADTEST^NINE", "PID10.1": "X", "PID11.1": "1500 E. DUARTE ROAD", "PID11.3": "DUARTE", "PID11.4": "CA", "PID11.5": "91009", "PID11.6": "US", "PID11.7": "L", "PID11.9": "LOS ANGELES", "PID12": "LOS ANGELES", "PID13.1": "(626)256-4673^P^H^^^626^2564673~^NET^Internet^rad-testnine@gmail.com", "PID15.1": "ENG", "PID16.1": "S", "PID18.1": "3010208", "PID19": "555-11-2299", "PID22.1": "DECLINE", "PV102.1": "TREATMENT", "PV103.1.1": "HCRHPET", "PV103.4": "DC", "PV103.11": "DEPID", "PV107.1": "1184731135^FORMAN^STEPHEN^J^^^^^NPI^^^^NPI~2949^FORMAN^STEPHEN^J^^^^^PROVID^^^^PROVID", "PV108.1": "1184731135", "PV108.2": "FORMAN", "PV108.3": "STEPHEN", "PV108.4": "J", "PV108.9": "NPI", "PV108.13": "NPI~2949", "PV108.14": "FORMAN", "PV108.15": "STEPHEN", "PV108.16": "J", "PV108.21": "PROVID", "PV108.25": "PROVID", "PV119.1": "3010208", "ORC01": "DC", "ORC02.1": "38536", "ORC02.2": "EPC", "ORC07.2": "Once", "ORC07.3": "X1", "ORC07.4": "20200406163000", "ORC07.5": "20200406163000", "ORC07.6": "R", "ORC09": "2020/04/06 15:51:00", "ORC11.1": "1174978", "ORC11.2": "TORRICELLI", "ORC11.3": "CHERYL", "ORC11.4": "J", "ORC11.9": "PROVID", "ORC11.13": "PROVID", "ORC12.1": "1184731135", "ORC12.2": "FORMAN", "ORC12.3": "STEPHEN", "ORC12.4": "J", "ORC12.9": "NPI", "ORC12.13": "NPI~2949", "ORC12.14": "FORMAN", "ORC12.15": "STEPHEN", "ORC12.16": "J", "ORC12.21": "PROVID", "ORC12.25": "PROVID", "ORC14.1": "(626)218-2704", "ORC14.6": "626", "ORC14.7": "2182704", "ORC21.1": "Duarte", "ORC22.1": "1500 DUARTE RD", "ORC22.3": "DUARTE", "ORC22.4": "CA", "ORC22.5": "91010-3012", "ORC23.1": "(626)256-4673", "ORC23.6": "626", "ORC23.7": "2564673", "ORC24.1": "1500 E. DUARTE RD.", "ORC24.2": "DEPT OF HEMATOLOGY  HCT", "ORC24.3": "DUARTE", "ORC24.4": "CA", "ORC24.5": "91010", "ORC24.6": "US", "ORC29": "I", "RXE01.2": "Once", "RXE01.3": "X1", "RXE01.4": "20200406163000", "RXE01.5": "20200406163000", "RXE01.6": "R", "RXE02.1": "4088845000", "RXE02.2": "FLUCICLOVINE 10 MCI", "RXE02.9": "fluciclovine (AXUMIN) injection 45 mCi", "RXE03": "45", "RXE05.1": "mCi", "RXE05.2": "mCi", "RXE06.1": "30", "RXE07.1": "Dose per protocol", "RXE10": "5", "RXE13.1": "AF6578934", "RXE13.2": "FORMAN", "RXE13.3": "STEPHEN", "RXE13.4": "J", "RXE30": "STANDARD", "RXE40.2": "RADIOPHARM RX", "TQ": [{"TQ103.1": "Once", "TQ109.1": "R"}], "RXR01.1": "IV", "RXR01.2": "Intravenous", "RXC": [{"RXC02.1": "4088845000", "RXC02.2": "FLUCICLOVINE 10 MCI", "RXC03": "45", "RXC04.1": "millicurie", "RXC04.2": "mCi", "RXC05": "10", "RXC06.1": "millicurie", "RXC06.2": "mCi", "NAME": "FLUCICLOVINE 10 MCI", "Therapeutic_Class": "Miscellaneous Products", "Pharmaceutical_Class": "Diagnostic Products", "PHARMACEUTICAL_SUBCLASS": "Diagnostic Radiopharmaceuticals"}], "ZTA": [{"ZTA01": "50", "ZTA02.1": "millicurie", "ZTA05": "1015", "ZTA08.6": "5 x 10 millicurie "}], "CreateDateTime": "2020/06/16 16:42:37"}`
        }
        else if(this.state.msg_show == 'MEDICATIONS_JSON_UNENRICHED'){
            message=`{"MSH02":"^~&","MSH03.1":"Epic","MSH04.1":"COH","MSH06.1":"COH","MSH07":"20200406155132","MSH08":"203758","MSH09.1":"RDE","MSH09.2":"O11","MSH10":"379","MSH11.1":"T","MSH12.1":"2.3","PID03.1":"55102300","PID03.4":"EPI","PID03.5":"MR","PID05.1":"RAD-TEST^NINE^^^^^D","PID07":"19820326","PID08.1":"F","PID09":"RADTEST^NINE","PID10.1":"X","PID11.1":"1500 E. DUARTE ROAD","PID11.3":"DUARTE","PID11.4":"CA","PID11.5":"91009","PID11.6":"US","PID11.7":"L","PID11.9":"LOS ANGELES","PID12":"LOS ANGELES","PID13.1":"(626)256-4673^P^H^^^626^2564673~^NET^Internet^rad-testnine@gmail.com","PID15.1":"ENG","PID16.1":"S","PID18.1":"3010208","PID19":"555-11-2299","PID22.1":"DECLINE","PV102.1":"TREATMENT","PV103.1.1":"HCRHPET","PV103.4":"DC","PV103.11":"DEPID","PV107.1":"1184731135^FORMAN^STEPHEN^J^^^^^NPI^^^^NPI~2949^FORMAN^STEPHEN^J^^^^^PROVID^^^^PROVID","PV108.1":"1184731135","PV108.2":"FORMAN","PV108.3":"STEPHEN","PV108.4":"J","PV108.9":"NPI","PV108.13":"NPI~2949","PV108.14":"FORMAN","PV108.15":"STEPHEN","PV108.16":"J","PV108.21":"PROVID","PV108.25":"PROVID","PV119.1":"3010208","ORC01":"DC","ORC02.1":"38536","ORC02.2":"EPC","ORC07.2":"Once","ORC07.3":"X1","ORC07.4":"20200406163000","ORC07.5":"20200406163000","ORC07.6":"R","ORC09":"2020/04/06 15:51:00","ORC11.1":"1174978","ORC11.2":"TORRICELLI","ORC11.3":"CHERYL","ORC11.4":"J","ORC11.9":"PROVID","ORC11.13":"PROVID","ORC12.1":"1184731135","ORC12.2":"FORMAN","ORC12.3":"STEPHEN","ORC12.4":"J","ORC12.9":"NPI","ORC12.13":"NPI~2949","ORC12.14":"FORMAN","ORC12.15":"STEPHEN","ORC12.16":"J","ORC12.21":"PROVID","ORC12.25":"PROVID","ORC14.1":"(626)218-2704","ORC14.6":"626","ORC14.7":"2182704","ORC21.1":"Duarte","ORC22.1":"1500 DUARTE RD","ORC22.3":"DUARTE","ORC22.4":"CA","ORC22.5":"91010-3012","ORC23.1":"(626)256-4673","ORC23.6":"626","ORC23.7":"2564673","ORC24.1":"1500 E. DUARTE RD.","ORC24.2":"DEPT OF HEMATOLOGY  HCT","ORC24.3":"DUARTE","ORC24.4":"CA","ORC24.5":"91010","ORC24.6":"US","ORC29":"I","RXE01.2":"Once","RXE01.3":"X1","RXE01.4":"20200406163000","RXE01.5":"20200406163000","RXE01.6":"R","RXE02.1":"4088845000","RXE02.2":"FLUCICLOVINE 10 MCI","RXE02.9":"fluciclovine (AXUMIN) injection 45 mCi","RXE03":"45","RXE05.1":"mCi","RXE05.2":"mCi","RXE06.1":"30","RXE07.1":"Dose per protocol","RXE10":"5","RXE13.1":"AF6578934","RXE13.2":"FORMAN","RXE13.3":"STEPHEN","RXE13.4":"J","RXE30":"STANDARD","RXE40.2":"RADIOPHARM RX","TQ":[{"TQ103.1":"Once","TQ109.1":"R"}],"RXR01.1":"IV","RXR01.2":"Intravenous","RXC":[{"RXC02.1":"4088845000","RXC02.2":"FLUCICLOVINE 10 MCI","RXC03":"45","RXC04.1":"millicurie","RXC04.2":"mCi","RXC05":"10","RXC06.1":"millicurie","RXC06.2":"mCi"}],"ZTA":[{"ZTA01":"50","ZTA02.1":"millicurie","ZTA05":"1015","ZTA08.6":"5 x 10 millicurie "}],"CreateDateTime":"2020/06/16 16:42:37"}`
        }
        else if(this.state.msg_show == 'ErrorLogs_Boomi'){
            message=`{
                "ProcessName" : "Epic_MED_to_Sepsis",
                "executionID" : "execution-d1910b6c-ddff-4598-93da-86b669c9d69d-2020.06.23",
                "Data" : "MSH|^~\&|Epic|COH||COH|20200401140745|RISTECH|RDE^O11|370|T|2.3\rPID|||55102363^^^EPI^MR||TEST^NAGA^^^^^D||19900102|M||O|HYD^^JEWELL^IA^50130^US^L^^HAMILTON|HAMILTON|(236)547-8963^P^H^^^236^5478963~^NET^Internet^xyz@yahoo.com||TEL|M||3010137|445-14-5252|||HISPANIC\rPV1||OUTPATIENT|HCRHCTIMAG^^^DC^^^^^^^DEPID||||1417903147^RESSLER^JULIE^A^^^^^NPI^^^^NPI~20743^RESSLER^JULIE^A^^^^^PROVID^^^^PROVID|1417903147^RESSLER^JULIE^A^^^^^NPI^^^^NPI~20743^RESSLER^JULIE^A^^^^^PROVID^^^^PROVID|||||||||||3010137|||||||||||||||||||||||||20200401140709\rORC|NW|38007^EPC|||||^Once&1445^X1^20200401144500^^R||20200401140743|RISTECH^RADIOLOGY^TECHNOLOGIST|400132^RADIOLOGY^TECHNOLOGIST^^^^^^PROVID^^^^PROVID|1417903147^RESSLER^JULIE^A^^^^^NPI^^^^NPI~20743^RESSLER^JULIE^A^^^^^PROVID^^^^PROVID||(626)218-8252^^^^^626^2188252|||||||Duarte|1500 DUARTE RD^^DUARTE^CA^91010-3012|(626)256-4673^^^^^626^2564673|1500 E. DUARTE ROAD, SUITE 1300^DEPT OF DIAGNOSTIC RADIOLOGY (HCRH)^DUARTE^CA^91010^US|||||I\rRXE|^Once&1445^X1^20200401144500^^R|10328^IOPAMIDOL 76 % IV SOLN^^^^^^^iopamidol (ISOVUE-370) 76 % solution 125 mL|125||mL^mL|47|Dose per Radiologist|||1|GC^Glass Cont||BR3180433^RESSLER^JULIE^A||||||||||||1|mL^mL||||STANDARD|||1|mL^mL||||||^RADIOPHARM RX\rTQ1|1||Once|1445|||20200401144500||R|||||1\rRXR|IV^Intravenous\rRXC||10328^IOPAMIDOL 76 % IV SOLN|125|mL^mL|125|mL^mL\rZTA|125|mL|||1015||||||||125 mL Glass Cont",
                "TransactionType" : "RDE",
                "ErrorDescription" : "[Input ProfileLocation: Header/PATIENT/PID/PID14.13]: Error Parsing Date '8894774', Expected Format yyyyMMdd HHmmss.SSSSZ: Failed parsing '8894774' due to extra trailing character(s) '8894774'; Caused by: Error Parsing Date '8894774', Expected Format yyyyMMdd HHmmss.SSSSZ: Failed parsing '8894774' due to extra trailing character(s) '8894774'; Caused by: Failed parsing '8894774' due to extra trailing character(s) '8894774'",
                "createDateTime" : "2020-06-20T13:14:50",
                "MSH10" : "370"
              }`
        }
        

        return (
            <div>
                <div>
                    <div className="top-padding"><a href={'#' + 'hello' + flag} data-toggle="collapse">{'Message'}</a></div>
                    <div className="border-view" style={{ height:  "300px", overflow: "auto" }} id={'hello' + flag}> {message}</div>
                </div>
            </div>
        )
    }

   
    renderCharts() {

        return (

<div className="row chart-div col-12">
               
               <div className="chart-container chart col-12">
                   <div className="chart-header">Type of Message</div>
                   <Bar
                        data={this.getBarData(this.state.type == 'Provider' ? this.state.providerChartLabel : this.state.tradingChartLabel, this.state.type == 'Provider' ? this.state.providerChartData : this.state.tradingChartData, '#139DC9')}
                        width={400}
                        height={200}
                        options={{
                            legend: {
                                display: false,
                            },
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true,

                                    }
                                }],
                            },
                        }} />
               </div>
               
      
   </div>

        )
    }

    _renderAllCharts() {
        return (
            <div className="chart-div">
                <div className="row">
                    {/* <div className="col-6" style={{ padding: '6px' }}>
                        {this.renderCharts()}
                    </div> */}
                    <div className="col-12" style={{ padding: '6px' }}>
                        {this.renderCharts1()}
                    </div>
                </div>
            </div>
        )
    }

    handleSort(e) {
        this.setState({
            type: e
        })
        setTimeout(() => {
            this.getData()
            this.getListData()
        }, 50);
    }

    tab() {
        return (
            <div>
                <nav>
                    <div class="nav nav-tabs" id="nav-tab" role="tablist">
                        <a class="nav-item nav-link active" id="nav-home-tab" onClick={() => this.handleSort('')} data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Total Claims</a>
                        <a class="nav-item nav-link" id="nav-profile-tab" onClick={() => this.handleSort('I')} data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false">Institutional</a>
                        <a class="nav-item nav-link" id="nav-contact-tab" onClick={() => this.handleSort('P')} data-toggle="tab" href="#nav-contact" role="tab" aria-controls="nav-contact" aria-selected="false">Professional</a>
                    </div>
                </nav>
                <div class="tab-content" id="nav-tabContent">
                    <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab"></div>
                    <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab"></div>
                    <div class="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab"></div>
                </div>
            </div>
        )
    }

    handlePageClick = (data) => {
        let page = data.selected + 1
        this.setState({
            page: page
        }, () => {
            this.getListData()
        })
    }

    getListData = () => {
        let count = 1
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""
        let providerName = this.state.providerName
        if (!providerName) {
            providerName = ''
        }

        let query = `{            
            Claim837RTFileDetails (Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State ? this.state.State : ''}",Provider:"${providerName}",StartDt:"${startDate}",EndDt:"${endDate}",Claimstatus:"${this.state.claimStatus ? this.state.claimStatus : ''}", Type : "` + this.state.type + `" , page: ` + this.state.page + ` , OrderBy:""  ) {
                RecCount
                FileID
                FileName
                Sender
                FileDate
                Claimcount
                FileStatus
            }
        }`
        console.log(query)
        fetch(Urls.sql_real_time_claim_details, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                if (res && res.data && res.data.Claim837RTFileDetails) {

                    if (res.data.Claim837RTFileDetails.length > 0) {

                        count = Math.floor(res.data.Claim837RTFileDetails[0].RecCount / 10)
                        if (res.data.Claim837RTFileDetails[0].RecCount % 10 > 0) {
                            count = count + 1
                        }
                        this.setState.recount = count;
                    }

                    this.setState({
                        claimsList: res.data.Claim837RTFileDetails,
                    })
                }
            })
            .catch(err => {
                console.log(err)
            });
    }

    showFile(name) {
        this.setState({
            showFile: true,
            flag: name
        })
    }

    getoptions() {
        let row = []
        this.state.tradingpartner.forEach(element => {
            if (!element) {
                return
            }
            row.push(<option value="">{element.Trading_Partner_Name}</option>)
        })
        return row
    }

    handleStartChange(date) {
        this.setState({
            startDate: date
        });
        setTimeout(() => {
            this.getData()
        }, 50);
    };

    handleEndChange(date) {
        this.setState({
            endDate: date
        });
        setTimeout(() => {
            this.getData()
        }, 50);
    }

    onSelect(event, key) {
        if (event.target.options[event.target.selectedIndex].text == 'Provider Name' || event.target.options[event.target.selectedIndex].text == 'Trading partner') {
            this.setState({
                [key]: ''
            })
        } else {
            this.setState({
                [key]: event.target.options[event.target.selectedIndex].text
            })
        }

        setTimeout(() => {
            this.getData()
            this.getListData()
        }, 50);
    }

    MonthsEvent(event, key) {
        this.setState({
            [key]: event.target.options[event.target.selectedIndex].value
        })
        setTimeout(() => {
            this.getData()
        }, 50);
    }

    renderSummaryDetails() {
        let row = []
        let apiflag = this.state.apiflag
        let url = Strings.ElilgibilityDetails270 + '/' + apiflag
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : 'n'
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : 'n'
        let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'
        let State = this.state.State ? this.state.State : 'n'
        let type = this.state.type ? this.state.type : ''




        return (


            <div className="row padding-left">
                <div className="col-2 summary-container" style={{cursor: 'pointer'}} onClick={this.renderTableTiles1}>
                    <div className="summary-header">Total Inbound Transaction</div>
                    <div className='green summary-title'  >
                        1.1M
                </div>
                </div>

                <div className="col-2 summary-container" style={{cursor: 'pointer'}} onClick={this.renderTableTiles}>
                    <div className="summary-header">Total Inbound Errors</div>
                    <div className='red summary-title'  >
                        10
                </div>
                </div>

               
            </div>



        )
    }

    onHandleChange(e) {
        clearTimeout(val)
        let providerName = e.target.value
        val = setTimeout(() => {
            this.setState({
                providerName: providerName
            }, () => {
                this.getData()
                this.getListData()
            })
        }, 300);
    }
    renderTableTiles=()=>{
        this.setState({
            ErrorTilesShow: true,
            showDetails: false,
            sepsisTable: false,
        })
    }
    renderTableTiles1=()=>{
        this.setState({
            ErrorTilesShow: false,
            showDetails: false,
            sepsisTable: false,
        })
    }

    renderTopbar() {
        return (
            <div className="form-style" id='filters'>
                <div className="form-row">
                    <div className="form-group col-2">
                        <div className="list-dashboard">Time Range</div>
                        <select
                            className="form-control list-dashboard" id="state"
                            onChange={(event) => {
                                let day = 0
                                let chartType = ''
                                let selected_val = event.target.options[event.target.selectedIndex].text

                                if (selected_val == 'Last week') {
                                    day = 7
                                    chartType = 'Datewise'
                                } else if (selected_val == 'Last 30 days') {
                                    day = 30
                                    chartType = 'Weekwise'
                                } else if (selected_val == 'Last 90 days') {
                                    day = 90
                                } else if (selected_val == 'Last 180 days') {
                                    day = 180
                                } else if (selected_val == 'Last year') {
                                    day = 365
                                }

                                let startDate = moment().subtract(day, 'd').format('YYYY-MM-DD')
                                let endDate = moment().format('YYYY-MM-DD')

                                if (!selected_val) {
                                    startDate = ''
                                    endDate = ''
                                }

                                this.setState({
                                    startDate: startDate,
                                    endDate: endDate,
                                    selected_val: selected_val,
                                    chartType: chartType
                                })

                                setTimeout(() => {
                                    this.getData()
                                    this.getListData()
                                }, 50);
                            }}
                        >
                            <option value="1">Last week</option>
                            <option value="2">Last 30 days</option>
                            <option value="2">Last 90 days</option>
                            <option value="2">Last 180 days</option>
                            <option selected="selected" value="2">Last year</option>
                        </select>
                    </div>
                    <div className="form-group col-2">
                        <div className="list-dashboard">Type</div>
                        <select className="form-control list-dashboard" id="state"
                            onChange={(event) => {
                                this.setState({
                                    State: event.target.options[event.target.selectedIndex].text
                                }, () => {
                                    this.getData()
                                    this.getListData()
                                })
                            }}
                        >
                            <option value=""></option>
                            <option value="1">A01</option>
                            <option value="2">A02</option>
                            <option value="3">A03</option>
                            <option value="4">A04</option>
                            <option value="5">A05</option>
                            <option value="6">A06</option>
                            <option value="7">A07</option>
                            <option value="8">A08</option>
                            
                        </select>
                    </div>
                    <div className="form-group col-2">
                        <div className="list-dashboard">Destination</div>
                        {/* <input className="form-control" type="text"
                            onChange={(e) => this.onHandleChange(e)}
                        /> */}
                        <select class="form-control list-dashboard">
                            <option selected value=""></option>
                            <option  value="1">COH</option>
                        </select>
                    </div>
                    <div className="form-group col-2">
                        <div className="list-dashboard">Directory</div>
                        <select className="form-control list-dashboard" id="TradingPartner"
                            onChange={(event) => {
                                this.onSelect(event, 'selectedTradingPartner')
                            }}>
                            <option value="select"></option>
                            {this.getoptions()}
                        </select>
                    </div>
                </div>
            </div>
        )
    }



    setData = (startDate, endDate, selected_val) => {
        this.setState({
            startDate,
            endDate,
            selected_val
        })
    }


    getLineChart(labelArray, dataArray, color) {
        let _data = {
            labels: ['Jun-2019','Aug-2019','Sept-2019','Oct-2019','Nov-2019','Dec-2019','Jan-2020','Feb-2020','Mar-2020','Apr-2020','May-2020'],
            datasets: [
                {
                    label: '',
                    fill: true,
                    cubicInterpolationMode: 'default',
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: color,
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'round',
                    pointBorderColor: color,
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: color,
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 3,
                    pointHitRadius: 1,
                    data: [10200,23000, 12000, 15000, 17000, 14000, 12000, 18000,14500, 13700,14550, 15430]
                }
            ]
        }
        return _data
    }

    renderCharts1() {
        return (
            <div className="row chart-div col-12">
               
                        <div className="chart-container chart col-12">
                            <div className="chart-header">Volume Analysis</div>
                            <Line
                                data={this.getLineChart(this.state.dateChartLabel, this.state.dateChartData, '#139DC9')}
                                width={400}
                                height={100}
                                options={{
                                    legend: {
                                        display: false,
                                    },
                                }}
                            />
                        </div>
                        
               
            </div>


        )
    }

    _renderInboundTable() {

        let columnDefs = [
            { headerName: "Message ID", field: "MessageID", width: 120, cellStyle: { color:'#139DC9', cursor:'pointer' } },
            { headerName: "Date", field: "Date", width: 140,  },
            { headerName: "Topic", field: "Topic", flex:1, },
        ]

        return (
            <div style={{ width: '100%', height: '100%' }}>
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
                        rowData={this.state.summaryList}
                        enableCellTextSelection={true}
                        onCellClicked={(event) => {
                                this.setState({
                                    showDetails: true
                                })   
                            
                        }}
                    >

                    </AgGridReact>

                </div>


            </div>
        )
    }


    _renderClaimTables = (array) => {
        let row = []

        array.forEach(item => {
            let generalStatus = ''
            let subtitle = ''
            let flag=''
            let color = "var(--red)"

            if (item.name == 'ADT_HL7') {
                generalStatus = 'ADT_HL7'
                subtitle = 'ADT_HL7'
                color = "var(--blue)"
                flag = 1
            } else if (item.name == 'ADT_JSON') {
                generalStatus = 'ADT_JSON'
                subtitle = "ADT_JSON"
                color = "var(--green)"
                flag = 1
            } else if (item.name == 'ADT_JSON_ENRICHED') {
                generalStatus = 'ADT_JSON_ENRICHED'
                subtitle = 'ADT_JSON_ENRICHED'
                color = "var(--blue)"
                flag = 1
            } else if (item.name == 'VITALS_HL7') {
                generalStatus = 'VITALS_HL7'
                subtitle = 'VITALS_HL7'
                color = "var(--blue)"
                flag = 2
            } else if (item.name == 'VITALS_JSON') {
                generalStatus = 'VITALS_JSON'
                subtitle = "VITALS_JSON"
                color = "var(--green)"
                flag = 2
            }else if (item.name == 'LABORDERS_HL7') {
                generalStatus = 'LABORDERS_HL7'
                subtitle = 'LABORDERS_HL7'
                color = "var(--blue)"
                flag = 3
            } else if (item.name == 'LABORDERS_JSON') {
                generalStatus = 'LABORDERS_JSON'
                subtitle = "LABORDERS_JSON"
                color = "var(--green)"
                flag = 3
            }else if (item.name == 'MEDICATIONS_HL7') {
                generalStatus = 'MEDICATIONS_HL7'
                subtitle = 'MEDICATIONS_HL7'
                color = "var(--blue)"
                flag = 4
            } else if (item.name == 'MEDICATIONS_JSON') {
                generalStatus = 'MEDICATIONS_JSON'
                subtitle = "MEDICATIONS_JSON"
                color = "var(--green)"
                flag = 4
            }else if (item.name == 'MEDICATIONS_JSON_UNENRICHED') {
                generalStatus = 'MEDICATIONS_JSON_UNENRICHED'
                subtitle = 'MEDICATIONS_JSON_UNENRICHED'
                color = "var(--blue)"
                flag = 4
            }
            else if (item.name == 'ErrorLogs_Boomi') {
                generalStatus = 'ErrorLogs_Boomi'
                subtitle = 'ErrorLogs_Boomi'
                flag = 3
            }

            let sendData = [
              {  
                  generalStatus:generalStatus,
                  flag: flag,
                  subtitle:subtitle
              }
            ]
           
            row.push(
                <TableTiles
                    item={item}
                    data={sendData}
                    diffClick={true}
                    Click= {this.Click}
                    unclick={color}
                />
            )
        })

        return (
            <div className="col chart-container" style={{ paddingTop: "12px", paddingBottom: '12px' }}>
                {row}
            </div>
        )
    }

    renderClaimDetails = () => {
        if(this.state.ErrorTilesShow){
            let stage_1 = [
                { 'name': 'ErrorLogs_Boomi', 'value': 10, 'isClick': 1 },
            ]
        
            return (
                <div className="row col-3" style={{ marginBottom: '12px', padding:'0', marginLeft: '-9px' }}>
                    {this._renderClaimTables(stage_1)}
                </div>
            )
        }else{
        
        let stage_1 = [
            { 'name': 'ADT_HL7', 'value': 16400, 'isClick': 1 },
            { 'name': 'ADT_JSON', 'value': 13045,'isClick': 1 },
            { 'name': 'ADT_JSON_ENRICHED', 'value': 9855, 'isClick': 1 },
        ]
        let stage_2 = [
            { 'name': 'VITALS_HL7', 'value': 11943, 'isClick': 1 },
            { 'name': 'VITALS_JSON', 'value': 12922, 'isClick': 1 },
        ]
        let stage_3 = [
            { 'name': 'LABORDERS_HL7', 'value': 12344, 'isClick': 1 },
            { 'name': 'LABORDERS_JSON', 'value': 15923, 'isClick': 1 },
        ]

        let stage_4 = [
            { 'name': 'MEDICATIONS_HL7', 'value': 9342, 'isClick': 1, },
            { 'name': 'MEDICATIONS_JSON', 'value': 13422, 'isClick': 1,  },
            { 'name': 'MEDICATIONS_JSON_UNENRICHED', 'value': 12822, 'isClick': 1 },
        ]
    
        return (
            <div className="row" style={{ marginBottom: '12px', marginLeft: '-9px' }}>
                {this._renderClaimTables(stage_1)}
                {this._renderClaimTables(stage_2)}
                {this._renderClaimTables(stage_3)}
                {this._renderClaimTables(stage_4)}
            </div>
        )}
    }

    Click=(data)=>{
        let query 
        let flag = data[0].flag
        let topic = data[0].generalStatus
        let subtitle = data[0].subtitle
        if(flag == 1){
            query = `{
                ADTJSONDetails(Topic:"${topic}") {
                MessageID
                Date
                Topic
              }
            }`
        }
        else if(flag == 2){
            query = `{
                VitalsDetails(Topic:"${topic}") {
                MessageID
                Date
                Topic
              }
            }`
        }
        else if(flag == 3){
            query = `{
                LaborderDetails(Topic:"${topic}") {
                MessageID
                Date
                Topic
              }
            }`
        }
        else if(flag == 4){
            query = `{
                MedicationDetails(Topic:"${topic}") {
                MessageID
                Date
                Topic
              }
            }`
        }
        
    console.log(query)
    fetch(Urls.sql_base_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ query: query })
    })
        .then(res => res.json())
        .then(res => {
            let data = ''
            if(flag == 1){
                data = res.data.ADTJSONDetails
            }else if(flag == 2){
                data = res.data.VitalsDetails
            }else if(flag == 3){
                data = res.data.LaborderDetails
            }else if(flag == 4){
                data = res.data.MedicationDetails
            }
             
    
            this.setState({
                summaryList: data,
                showA04: false,
                showDetails: false,
                sepsisTable: true,
                msg_show: subtitle
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

    render() {
        return (
            <div className="container">
                <h5 className="headerText">HiPaaS Dashboard</h5>
                {this.renderTopbar()}
                {this.renderSummaryDetails()}
                <div className="general-header">Topics</div>
                {this.renderClaimDetails()}
                {this._renderAllCharts()}
                <div className="row">
                    <div className="col-6">
                    <div className="general-header">{this.state.sepsisTable ? this.state.msg_show : null}</div>
                        {this.state.sepsisTable ? this._renderInboundTable() : null}
                    </div>
                    {this.state.showDetails ?
                        <div className="col-6" style={{marginTop:'33px'}}>
                            {this.renderDetails()}
                        </div> : null}
                       
                </div>
                <br></br><br></br>
            </div>
        );
    }
}