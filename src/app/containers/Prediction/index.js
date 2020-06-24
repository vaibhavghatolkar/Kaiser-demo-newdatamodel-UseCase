import React from 'react';
import '../Files/files-styles.css';
import { Bar, Line } from 'react-chartjs-2';
import '../color.css'
import moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";
import Urls from '../../../helpers/Urls';
import Strings from '../../../helpers/Strings';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { TableTiles } from '../../components/TableTiles';
import { faAmericanSignLanguageInterpreting } from '@fortawesome/free-solid-svg-icons';
let val = ''

export class Prediction extends React.Component {

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
            predition:false,
            page: 1,
            ClaimBarChart: [],
            claimLabels: [],
            search: '',
            showDetails: false,
            showDetails1: false,
            showA04: false,
            flag1: false,
            first_tiles:true,
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
        this.Checkflag = this.Checkflag.bind(this)
     
       
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
        let chartType = this.state.chartType
        if (!chartType) {
            chartType = "Monthwise"
        }

        let query = `{
                ADTDetails {
                  MessageID
                  Date
                  Type
                  Submitter
                  Destination
                }
              
        }`
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
               let data = res.data.ADTDetails

                this.setState({
                    summaryList: data,
                   
                })
            })
            .catch(err => {
                console.log(err)
            })
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
        let message="";  
        let checkflag=this.state.massage_flag;
        if(checkflag=="BMT_PAYLOAD") 
        {             
        message = `{"MRN":"55104733","VisitID":"3010904","CSN":"3010904","VIT":[],"MED":[{"Value":"","RX_Route":"Oral","RX_Identifier":"2566","RX_NDC":"DOCUSATE SODIUM 100 MG PO CAPS","RX_CompAmount":"100","RX_CompUnits":"mg","RX_CompStrength":"100","RX_CompStrengthUnits":"mg","RX_Status":"DC","RX_Placer_Order_Number":"42059","RX_Single_Dispense_Amount":"1","RX_Single_Dispense_Unit":"DOCUSATE SODIUM 100 MG PO CAPS","THERA_CLASS_NAME":"Gastrointestinal Agents","PHARM_SUBCLASS_NAME":"Surfactant Laxatives","NAME":"DOCUSATE SODIUM 100 MG PO CAPS","PHARM_CLASS_NAME":"Laxatives","RX_Component_Type":"","EventDateTime":"2020/04/20 09:10:42","CreatedDateTime":"2020/06/16 16:43:20"},{"Value":"","RX_Route":"Subcutaneous","RX_Identifier":"104207","RX_NDC":"LIDOCAINE HCL (PF) 1 % IJ SOLN","RX_CompAmount":"1","RX_CompUnits":"mg","RX_CompStrength":"50","RX_CompStrengthUnits":"mg","RX_Status":"NW","RX_Placer_Order_Number":"42079","RX_Single_Dispense_Amount":"1","RX_Single_Dispense_Unit":"LIDOCAINE HCL (PF) 1 % IJ SOLN","THERA_CLASS_NAME":"Analgesics & Anesthetics","PHARM_SUBCLASS_NAME":"Local Anesthetics - Amides","NAME":"LIDOCAINE HCL (PF) 1 % IJ SOLN","PHARM_CLASS_NAME":"Local Anesthetics-Parenteral","RX_Component_Type":"","EventDateTime":"2020/04/20 10:12:31","CreatedDateTime":"2020/06/16 16:43:11"},{"Value":"","RX_Route":"Oral","RX_Identifier":"2566","RX_NDC":"DOCUSATE SODIUM 100 MG PO CAPS","RX_CompAmount":"100","RX_CompUnits":"mg","RX_CompStrength":"100","RX_CompStrengthUnits":"mg","RX_Status":"NW","RX_Placer_Order_Number":"42059","RX_Single_Dispense_Amount":"1","RX_Single_Dispense_Unit":"DOCUSATE SODIUM 100 MG PO CAPS","THERA_CLASS_NAME":"Gastrointestinal Agents","PHARM_SUBCLASS_NAME":"Surfactant Laxatives","NAME":"DOCUSATE SODIUM 100 MG PO CAPS","PHARM_CLASS_NAME":"Laxatives","RX_Component_Type":"","EventDateTime":"2020/04/20 09:10:42","CreatedDateTime":"2020/06/16 16:43:10"},{"Value":"","RX_Route":"Topical","RX_Identifier":"10434","RX_NDC":"LIDOCAINE-PRILOCAINE 2.5-2.5 % EX CREA","RX_CompAmount":"","RX_CompUnits":"","RX_CompStrength":"","RX_CompStrengthUnits":"","RX_Status":"NW","RX_Placer_Order_Number":"42078","RX_Single_Dispense_Amount":"1","RX_Single_Dispense_Unit":"LIDOCAINE-PRILOCAINE 2.5-2.5 % EX CREA","THERA_CLASS_NAME":"Topical Products","PHARM_SUBCLASS_NAME":"Local Anesthetics - Topical","NAME":"LIDOCAINE-PRILOCAINE 2.5-2.5 % EX CREA","PHARM_CLASS_NAME":"Dermatological","RX_Component_Type":"","EventDateTime":"2020/04/20 10:12:31","CreatedDateTime":"2020/06/16 16:43:10"},{"Value":"","RX_Route":"Topical","RX_Identifier":"10434","RX_NDC":"LIDOCAINE-PRILOCAINE 2.5-2.5 % EX CREA","RX_CompAmount":"","RX_CompUnits":"","RX_CompStrength":"","RX_CompStrengthUnits":"","RX_Status":"XO","RX_Placer_Order_Number":"42078","RX_Single_Dispense_Amount":"1","RX_Single_Dispense_Unit":"LIDOCAINE-PRILOCAINE 2.5-2.5 % EX CREA","THERA_CLASS_NAME":"Topical Products","PHARM_SUBCLASS_NAME":"Local Anesthetics - Topical","NAME":"LIDOCAINE-PRILOCAINE 2.5-2.5 % EX CREA","PHARM_CLASS_NAME":"Dermatological","RX_Component_Type":"","EventDateTime":"2020/04/20 10:12:31","CreatedDateTime":"2020/06/16 16:43:17"},{"Value":"","RX_Route":"Intravenous","RX_Identifier":"4318","RX_NDC":"LACTATED RINGERS IV SOLN","RX_CompAmount":"100","RX_CompUnits":"mL/hr","RX_CompStrength":"","RX_CompStrengthUnits":"","RX_Status":"NW","RX_Placer_Order_Number":"42075","RX_Single_Dispense_Amount":"1","RX_Single_Dispense_Unit":"LACTATED RINGERS IV SOLN","THERA_CLASS_NAME":"Nutritional Products","PHARM_SUBCLASS_NAME":"Electrolyte Mixtures","NAME":"LACTATED RINGERS IV SOLN","PHARM_CLASS_NAME":"Minerals & Electrolytes","RX_Component_Type":"","EventDateTime":"2020/04/20 10:12:31","CreatedDateTime":"2020/06/16 16:43:10"},{"Value":"","RX_Route":"Subcutaneous","RX_Identifier":"105900","RX_NDC":"ENOXAPARIN SODIUM 40 MG/0.4ML SC SOLN","RX_CompAmount":"40","RX_CompUnits":"mg","RX_CompStrength":"40","RX_CompStrengthUnits":"mg","RX_Status":"XO","RX_Placer_Order_Number":"42100","RX_Single_Dispense_Amount":"1","RX_Single_Dispense_Unit":"ENOXAPARIN SODIUM 40 MG/0.4ML SC SOLN","THERA_CLASS_NAME":"Hematological Agents","PHARM_SUBCLASS_NAME":"Heparins And Heparinoid-Like Agents","NAME":"ENOXAPARIN SODIUM 40 MG/0.4ML SC SOLN","PHARM_CLASS_NAME":"Anticoagulants","RX_Component_Type":"","EventDateTime":"2020/04/20 14:33:18","CreatedDateTime":"2020/06/16 16:43:25"},{"Value":"","RX_Route":"Topical","RX_Identifier":"10434","RX_NDC":"LIDOCAINE-PRILOCAINE 2.5-2.5 % EX CREA","RX_CompAmount":"","RX_CompUnits":"","RX_CompStrength":"","RX_CompStrengthUnits":"","RX_Status":"DC","RX_Placer_Order_Number":"42078","RX_Single_Dispense_Amount":"1","RX_Single_Dispense_Unit":"LIDOCAINE-PRILOCAINE 2.5-2.5 % EX CREA","THERA_CLASS_NAME":"Topical Products","PHARM_SUBCLASS_NAME":"Local Anesthetics - Topical","NAME":"LIDOCAINE-PRILOCAINE 2.5-2.5 % EX CREA","PHARM_CLASS_NAME":"Dermatological","RX_Component_Type":"","EventDateTime":"2020/04/20 10:12:31","CreatedDateTime":"2020/06/16 16:43:22"},{"Value":"","RX_Route":"Oral","RX_Identifier":"5940","RX_NDC":"OXYCODONE-ACETAMINOPHEN 5-325 MG PO TABS","RX_CompAmount":"1","RX_CompUnits":"Tab","RX_CompStrength":"1","RX_CompStrengthUnits":"Tab","RX_Status":"DC","RX_Placer_Order_Number":"42098","RX_Single_Dispense_Amount":"1","RX_Single_Dispense_Unit":"OXYCODONE-ACETAMINOPHEN 5-325 MG PO TABS","THERA_CLASS_NAME":"Analgesics & Anesthetics","PHARM_SUBCLASS_NAME":"Opioid Combinations","NAME":"OXYCODONE-ACETAMINOPHEN 5-325 MG PO TABS","PHARM_CLASS_NAME":"Analgesics-Opioid","RX_Component_Type":"","EventDateTime":"2020/04/20 14:32:12","CreatedDateTime":"2020/06/16 16:43:27"},{"Value":"","RX_Route":"Oral","RX_Identifier":"5940","RX_NDC":"OXYCODONE-ACETAMINOPHEN 5-325 MG PO TABS","RX_CompAmount":"2","RX_CompUnits":"Tab","RX_CompStrength":"1","RX_CompStrengthUnits":"Tab","RX_Status":"NW","RX_Placer_Order_Number":"42099","RX_Single_Dispense_Amount":"2","RX_Single_Dispense_Unit":"OXYCODONE-ACETAMINOPHEN 5-325 MG PO TABS","THERA_CLASS_NAME":"Analgesics & Anesthetics","PHARM_SUBCLASS_NAME":"Opioid Combinations","NAME":"OXYCODONE-ACETAMINOPHEN 5-325 MG PO TABS","PHARM_CLASS_NAME":"Analgesics-Opioid","RX_Component_Type":"","EventDateTime":"2020/04/20 14:32:12","CreatedDateTime":"2020/06/16 16:43:25"},{"Value":"","RX_Route":"Intravenous","RX_Identifier":"4318","RX_NDC":"LACTATED RINGERS IV SOLN","RX_CompAmount":"100","RX_CompUnits":"mL/hr","RX_CompStrength":"","RX_CompStrengthUnits":"","RX_Status":"XO","RX_Placer_Order_Number":"42075","RX_Single_Dispense_Amount":"1","RX_Single_Dispense_Unit":"LACTATED RINGERS IV SOLN","THERA_CLASS_NAME":"Nutritional Products","PHARM_SUBCLASS_NAME":"Electrolyte Mixtures","NAME":"LACTATED RINGERS IV SOLN","PHARM_CLASS_NAME":"Minerals & Electrolytes","RX_Component_Type":"","EventDateTime":"2020/04/20 10:12:31","CreatedDateTime":"2020/06/16 16:43:17"},{"Value":"","RX_Route":"Oral","RX_Identifier":"2566","RX_NDC":"DOCUSATE SODIUM 100 MG PO CAPS","RX_CompAmount":"100","RX_CompUnits":"mg","RX_CompStrength":"100","RX_CompStrengthUnits":"mg","RX_Status":"XO","RX_Placer_Order_Number":"42059","RX_Single_Dispense_Amount":"1","RX_Single_Dispense_Unit":"DOCUSATE SODIUM 100 MG PO CAPS","THERA_CLASS_NAME":"Gastrointestinal Agents","PHARM_SUBCLASS_NAME":"Surfactant Laxatives","NAME":"DOCUSATE SODIUM 100 MG PO CAPS","PHARM_CLASS_NAME":"Laxatives","RX_Component_Type":"","EventDateTime":"2020/04/20 09:10:42","CreatedDateTime":"2020/06/16 16:43:17"},{"Value":"","RX_Route":"Subcutaneous","RX_Identifier":"105900","RX_NDC":"ENOXAPARIN SODIUM 40 MG/0.4ML SC SOLN","RX_CompAmount":"40","RX_CompUnits":"mg","RX_CompStrength":"40","RX_CompStrengthUnits":"mg","RX_Status":"NW","RX_Placer_Order_Number":"42100","RX_Single_Dispense_Amount":"1","RX_Single_Dispense_Unit":"ENOXAPARIN SODIUM 40 MG/0.4ML SC SOLN","THERA_CLASS_NAME":"Hematological Agents","PHARM_SUBCLASS_NAME":"Heparins And Heparinoid-Like Agents","NAME":"ENOXAPARIN SODIUM 40 MG/0.4ML SC SOLN","PHARM_CLASS_NAME":"Anticoagulants","RX_Component_Type":"","EventDateTime":"2020/04/20 14:33:18","CreatedDateTime":"2020/06/16 16:43:24"},{"Value":"","RX_Route":"Subcutaneous","RX_Identifier":"104207","RX_NDC":"LIDOCAINE HCL (PF) 1 % IJ SOLN","RX_CompAmount":"1","RX_CompUnits":"mg","RX_CompStrength":"50","RX_CompStrengthUnits":"mg","RX_Status":"XO","RX_Placer_Order_Number":"42079","RX_Single_Dispense_Amount":"1","RX_Single_Dispense_Unit":"LIDOCAINE HCL (PF) 1 % IJ SOLN","THERA_CLASS_NAME":"Analgesics & Anesthetics","PHARM_SUBCLASS_NAME":"Local Anesthetics - Amides","NAME":"LIDOCAINE HCL (PF) 1 % IJ SOLN","PHARM_CLASS_NAME":"Local Anesthetics-Parenteral","RX_Component_Type":"","EventDateTime":"2020/04/20 10:12:31","CreatedDateTime":"2020/06/16 16:43:17"},{"Value":"","RX_Route":"Oral","RX_Identifier":"5940","RX_NDC":"OXYCODONE-ACETAMINOPHEN 5-325 MG PO TABS","RX_CompAmount":"1","RX_CompUnits":"Tab","RX_CompStrength":"1","RX_CompStrengthUnits":"Tab","RX_Status":"NW","RX_Placer_Order_Number":"42098","RX_Single_Dispense_Amount":"1","RX_Single_Dispense_Unit":"OXYCODONE-ACETAMINOPHEN 5-325 MG PO TABS","THERA_CLASS_NAME":"Analgesics & Anesthetics","PHARM_SUBCLASS_NAME":"Opioid Combinations","NAME":"OXYCODONE-ACETAMINOPHEN 5-325 MG PO TABS","PHARM_CLASS_NAME":"Analgesics-Opioid","RX_Component_Type":"","EventDateTime":"2020/04/20 14:32:12","CreatedDateTime":"2020/06/16 16:43:24"},{"Value":"","RX_Route":"Oral","RX_Identifier":"101","RX_NDC":"ACETAMINOPHEN 325 MG PO TABS","RX_CompAmount":"650","RX_CompUnits":"mg","RX_CompStrength":"325","RX_CompStrengthUnits":"mg","RX_Status":"NW","RX_Placer_Order_Number":"42097","RX_Single_Dispense_Amount":"2","RX_Single_Dispense_Unit":"ACETAMINOPHEN 325 MG PO TABS","THERA_CLASS_NAME":"Analgesics & Anesthetics","PHARM_SUBCLASS_NAME":"Analgesics Other","NAME":"ACETAMINOPHEN 325 MG PO TABS","PHARM_CLASS_NAME":"Analgesics-Nonnarcotic","RX_Component_Type":"","EventDateTime":"2020/04/20 14:32:12","CreatedDateTime":"2020/06/16 16:43:22"},{"Value":"","RX_Route":"Subcutaneous","RX_Identifier":"105900","RX_NDC":"ENOXAPARIN SODIUM 40 MG/0.4ML SC SOLN","RX_CompAmount":"40","RX_CompUnits":"mg","RX_CompStrength":"40","RX_CompStrengthUnits":"mg","RX_Status":"DC","RX_Placer_Order_Number":"42100","RX_Single_Dispense_Amount":"1","RX_Single_Dispense_Unit":"ENOXAPARIN SODIUM 40 MG/0.4ML SC SOLN","THERA_CLASS_NAME":"Hematological Agents","PHARM_SUBCLASS_NAME":"Heparins And Heparinoid-Like Agents","NAME":"ENOXAPARIN SODIUM 40 MG/0.4ML SC SOLN","PHARM_CLASS_NAME":"Anticoagulants","RX_Component_Type":"","EventDateTime":"2020/04/20 14:33:18","CreatedDateTime":"2020/06/16 16:43:27"},{"Value":"","RX_Route":"Oral","RX_Identifier":"5940","RX_NDC":"OXYCODONE-ACETAMINOPHEN 5-325 MG PO TABS","RX_CompAmount":"2","RX_CompUnits":"Tab","RX_CompStrength":"1","RX_CompStrengthUnits":"Tab","RX_Status":"DC","RX_Placer_Order_Number":"42099","RX_Single_Dispense_Amount":"2","RX_Single_Dispense_Unit":"OXYCODONE-ACETAMINOPHEN 5-325 MG PO TABS","THERA_CLASS_NAME":"Analgesics & Anesthetics","PHARM_SUBCLASS_NAME":"Opioid Combinations","NAME":"OXYCODONE-ACETAMINOPHEN 5-325 MG PO TABS","PHARM_CLASS_NAME":"Analgesics-Opioid","RX_Component_Type":"","EventDateTime":"2020/04/20 14:32:12","CreatedDateTime":"2020/06/16 16:43:27"},{"Value":"","RX_Route":"Subcutaneous","RX_Identifier":"105900","RX_NDC":"ENOXAPARIN SODIUM 40 MG/0.4ML SC SOLN","RX_CompAmount":"40","RX_CompUnits":"mg","RX_CompStrength":"40","RX_CompStrengthUnits":"mg","RX_Status":"DC","RX_Placer_Order_Number":"42100","RX_Single_Dispense_Amount":"1","RX_Single_Dispense_Unit":"ENOXAPARIN SODIUM 40 MG/0.4ML SC SOLN","THERA_CLASS_NAME":"Hematological Agents","PHARM_SUBCLASS_NAME":"Heparins And Heparinoid-Like Agents","NAME":"ENOXAPARIN SODIUM 40 MG/0.4ML SC SOLN","PHARM_CLASS_NAME":"Anticoagulants","RX_Component_Type":"","EventDateTime":"2020/04/20 14:33:18","CreatedDateTime":"2020/06/16 16:43:27"},{"Value":"","RX_Route":"Oral","RX_Identifier":"101","RX_NDC":"ACETAMINOPHEN 325 MG PO TABS","RX_CompAmount":"650","RX_CompUnits":"mg","RX_CompStrength":"325","RX_CompStrengthUnits":"mg","RX_Status":"DC","RX_Placer_Order_Number":"42097","RX_Single_Dispense_Amount":"2","RX_Single_Dispense_Unit":"ACETAMINOPHEN 325 MG PO TABS","THERA_CLASS_NAME":"Analgesics & Anesthetics","PHARM_SUBCLASS_NAME":"Analgesics Other","NAME":"ACETAMINOPHEN 325 MG PO TABS","PHARM_CLASS_NAME":"Analgesics-Nonnarcotic","RX_Component_Type":"","EventDateTime":"2020/04/20 14:32:12","CreatedDateTime":"2020/06/16 16:43:25"},{"Value":"","RX_Route":"Subcutaneous","RX_Identifier":"104207","RX_NDC":"LIDOCAINE HCL (PF) 1 % IJ SOLN","RX_CompAmount":"1","RX_CompUnits":"mg","RX_CompStrength":"50","RX_CompStrengthUnits":"mg","RX_Status":"DC","RX_Placer_Order_Number":"42079","RX_Single_Dispense_Amount":"1","RX_Single_Dispense_Unit":"LIDOCAINE HCL (PF) 1 % IJ SOLN","THERA_CLASS_NAME":"Analgesics & Anesthetics","PHARM_SUBCLASS_NAME":"Local Anesthetics - Amides","NAME":"LIDOCAINE HCL (PF) 1 % IJ SOLN","PHARM_CLASS_NAME":"Local Anesthetics-Parenteral","RX_Component_Type":"","EventDateTime":"2020/04/20 10:12:31","CreatedDateTime":"2020/06/16 16:43:22"},{"Value":"","RX_Route":"Intravenous","RX_Identifier":"4318","RX_NDC":"LACTATED RINGERS IV SOLN","RX_CompAmount":"100","RX_CompUnits":"mL/hr","RX_CompStrength":"","RX_CompStrengthUnits":"","RX_Status":"DC","RX_Placer_Order_Number":"42075","RX_Single_Dispense_Amount":"1","RX_Single_Dispense_Unit":"LACTATED RINGERS IV SOLN","THERA_CLASS_NAME":"Nutritional Products","PHARM_SUBCLASS_NAME":"Electrolyte Mixtures","NAME":"LACTATED RINGERS IV SOLN","PHARM_CLASS_NAME":"Minerals & Electrolytes","RX_Component_Type":"","EventDateTime":"2020/04/20 10:12:31","CreatedDateTime":"2020/06/16 16:43:22"}],"LAB":[{"Value":" This is the final diagnosis ","EventUM":"","EventType":"PATHOLOGY REPORT FINAL DIAGNOSIS NARRATIVE","EventDateTime":"2020/04/20 13:56:31","CreatedDateTime":"2020/06/16 16:52:59"},{"Value":"Electronically signed by Physician Pathology, MD on 4/20/2020 at  1:56 PM","EventUM":"","EventType":"PATHOLOGY REPORT FINAL DIAGNOSIS NARRATIVE","EventDateTime":"2020/04/20 13:56:31","CreatedDateTime":"2020/06/16 16:52:59"},{"Value":"na","EventUM":"","EventType":"LAB AP CLINICAL INFORMATION","EventDateTime":"2020/04/20 13:56:31","CreatedDateTime":"2020/06/16 16:52:59"},{"Value":"Medical Cytology Report                           Case: N20-00007                                 ","EventUM":"","EventType":"LAB AP CASE REPORT","EventDateTime":"2020/04/20 13:56:31","CreatedDateTime":"2020/06/16 16:52:59"},{"Value":"Authorizing Provider:  Anesthesiologist           Collected:           04/20/2020 1347            ","EventUM":"","EventType":"LAB AP CASE REPORT","EventDateTime":"2020/04/20 13:56:31","CreatedDateTime":"2020/06/16 16:52:59"},{"Value":"                       Anesthesia, MD                                                             ","EventUM":"","EventType":"LAB AP CASE REPORT","EventDateTime":"2020/04/20 13:56:31","CreatedDateTime":"2020/06/16 16:52:59"},{"Value":"Ordering Location:     Operating Room             Received:            04/20/2020 1348            ","EventUM":"","EventType":"LAB AP CASE REPORT","EventDateTime":"2020/04/20 13:56:31","CreatedDateTime":"2020/06/16 16:52:59"},{"Value":"Pathologist:           Physician Pathology, MD                                                    ","EventUM":"","EventType":"LAB AP CASE REPORT","EventDateTime":"2020/04/20 13:56:31","CreatedDateTime":"2020/06/16 16:52:59"},{"Value":"Specimen:    Other                                                                                ","EventUM":"","EventType":"LAB AP CASE REPORT","EventDateTime":"2020/04/20 13:56:31","CreatedDateTime":"2020/06/16 16:52:59"},{"Value":"As the attending pathologist whose electronic signature appears on this ","EventUM":"","EventType":"AP DISCLAIMERS","EventDateTime":"2020/04/20 13:56:31","CreatedDateTime":"2020/06/16 16:52:59"},{"Value":"report, I have reviewed the slides and edited the gross and microscopic ","EventUM":"","EventType":"AP DISCLAIMERS","EventDateTime":"2020/04/20 13:56:31","CreatedDateTime":"2020/06/16 16:52:59"},{"Value":"portions of the report in rendering the final diagnosis. Cytology is ","EventUM":"","EventType":"AP DISCLAIMERS","EventDateTime":"2020/04/20 13:56:31","CreatedDateTime":"2020/06/16 16:52:59"},{"Value":"intended to be a screening procedure with an inherent false negative and ","EventUM":"","EventType":"AP DISCLAIMERS","EventDateTime":"2020/04/20 13:56:31","CreatedDateTime":"2020/06/16 16:52:59"},{"Value":"false positive rate.","EventUM":"","EventType":"AP DISCLAIMERS","EventDateTime":"2020/04/20 13:56:31","CreatedDateTime":"2020/06/16 16:52:59"},{"Value":" ","EventUM":"","EventType":"AP DISCLAIMERS","EventDateTime":"2020/04/20 13:56:31","CreatedDateTime":"2020/06/16 16:52:59"},{"Value":" This is the final diagnosis ","EventUM":"","EventType":"PATHOLOGY REPORT FINAL DIAGNOSIS NARRATIVE","EventDateTime":"2020/04/20 13:56:31","CreatedDateTime":"2020/06/16 17:06:41"},{"Value":"Electronically signed by Physician Pathology, MD on 4/20/2020 at  1:56 PM","EventUM":"","EventType":"PATHOLOGY REPORT FINAL DIAGNOSIS NARRATIVE","EventDateTime":"2020/04/20 13:56:31","CreatedDateTime":"2020/06/16 17:06:41"},{"Value":"na","EventUM":"","EventType":"LAB AP CLINICAL INFORMATION","EventDateTime":"2020/04/20 13:56:31","CreatedDateTime":"2020/06/16 17:06:41"},{"Value":"Medical Cytology Report                           Case: N20-00007                                 ","EventUM":"","EventType":"LAB AP CASE REPORT","EventDateTime":"2020/04/20 13:56:31","CreatedDateTime":"2020/06/16 17:06:41"},{"Value":"Authorizing Provider:  Anesthesiologist           Collected:           04/20/2020 1347            ","EventUM":"","EventType":"LAB AP CASE REPORT","EventDateTime":"2020/04/20 13:56:31","CreatedDateTime":"2020/06/16 17:06:41"},{"Value":"                       Anesthesia, MD                                                             ","EventUM":"","EventType":"LAB AP CASE REPORT","EventDateTime":"2020/04/20 13:56:31","CreatedDateTime":"2020/06/16 17:06:41"},{"Value":"Ordering Location:     Operating Room             Received:            04/20/2020 1348            ","EventUM":"","EventType":"LAB AP CASE REPORT","EventDateTime":"2020/04/20 13:56:31","CreatedDateTime":"2020/06/16 17:06:41"},{"Value":"Pathologist:           Physician Pathology, MD                                                    ","EventUM":"","EventType":"LAB AP CASE REPORT","EventDateTime":"2020/04/20 13:56:31","CreatedDateTime":"2020/06/16 17:06:41"},{"Value":"Specimen:    Other                                                                                ","EventUM":"","EventType":"LAB AP CASE REPORT","EventDateTime":"2020/04/20 13:56:31","CreatedDateTime":"2020/06/16 17:06:41"},{"Value":"As the attending pathologist whose electronic signature appears on this ","EventUM":"","EventType":"AP DISCLAIMERS","EventDateTime":"2020/04/20 13:56:31","CreatedDateTime":"2020/06/16 17:06:41"},{"Value":"report, I have reviewed the slides and edited the gross and microscopic ","EventUM":"","EventType":"AP DISCLAIMERS","EventDateTime":"2020/04/20 13:56:31","CreatedDateTime":"2020/06/16 17:06:41"},{"Value":"portions of the report in rendering the final diagnosis. Cytology is ","EventUM":"","EventType":"AP DISCLAIMERS","EventDateTime":"2020/04/20 13:56:31","CreatedDateTime":"2020/06/16 17:06:41"},{"Value":"intended to be a screening procedure with an inherent false negative and ","EventUM":"","EventType":"AP DISCLAIMERS","EventDateTime":"2020/04/20 13:56:31","CreatedDateTime":"2020/06/16 17:06:41"},{"Value":"false positive rate.","EventUM":"","EventType":"AP DISCLAIMERS","EventDateTime":"2020/04/20 13:56:31","CreatedDateTime":"2020/06/16 17:06:41"},{"Value":" ","EventUM":"","EventType":"AP DISCLAIMERS","EventDateTime":"2020/04/20 13:56:31","CreatedDateTime":"2020/06/16 17:06:41"}],"Admission":[]}`
        }
       else if(checkflag=="BMT_VITALS") 
       {
        // Vittal
        message = `{
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
          }`
        }
        else if(checkflag=="BMT_ADT") 
        {
          //   ADT_json
          message = `{"MSH02": "^~&", "MSH03": "EPIC", "MSH04": "COH", "MSH06": "COH", "MSH07": "20200616171210", "MSH08": "ADTPA", "MSH09.1": "ADT", "MSH09.2": "A01", "MSH10": "23193", "MSH11": "T", "MSH12": "2.5.1", "EVN01": "A01", "EVN02": "20200616171210", "EVN04": "ADT_EVENT", "EVN05.1": "ADTPA", "EVN05.2": "ADT", "EVN05.3": "PATIENT", "EVN05.4": "ACCESS", "EVN05.9": "COHSA", "EVN05.14": "DUR", "EVN06": "20200616171200", "PID01": "1", "PID03.1": "55100510", "PID03.4": "EPI", "PID03.5": "MR", "PID05.1": "TEST^PATHWAY^^^^^L", "PID07": "1981/06/16", "PID08": "M", "PID10": "B", "PID11.1": "555 STREET PLACE", "PID11.3": "LOS ANGELES", "PID11.4": "CA", "PID11.5": "90004", "PID11.6": "US", "PID11.7": "L", "PID11.9": "LOS ANGELES", "PID12": "LOS ANGELES", "PID13.1": "(818)555-4789^P^H^^^818^5554789", "PID15": "ENG", "PID16": "S", "PID18": "4000002251", "PID19": "887-56-9942", "PID22": "NOT HISPANIC", "PID24": "N", "PID30": "N", "ZPD02": "MYCH", "ZPD07": "N", "ZPD09": "N", "PD103.1": "DUARTE", "PD103.3": "10150", "CON_PD1": [{"CON01": "1", "CON02": "NPP Acknowle", "CON11": "Not Recv", "CON13": "20200616171118"}, {"CON01": "2", "CON02": "General T OP", "CON11": "Not Recv", "CON13": "20200616171118"}, {"CON01": "3", "CON02": "Identificati", "CON11": "Not Recv", "CON13": "20200616171118"}, {"CON01": "4", "CON02": "QUESTIONNAIR", "CON11": "Not Recv", "CON13": "20200616171118"}, {"CON01": "5", "CON02": "Insur Card", "CON11": "Not Recv", "CON13": "20200616171118"}], "NK1": [{"NK101": "1", "NK104.1": "250 PARKCENTER BLVD", "NK104.3": "BOISE", "NK104.4": "ID", "NK104.5": "83706", "NK104.6": "US", "NK104.9": "ADA", "NK105": "(208)395-6200^^H^^^208^3956200", "NK107": "Employer", "NK113": "ALBERTSONS", "NK133": "1034"}], "PV101": "1", "PV102": "AM ADMIT", "PV103.1": "HCRHOR", "PV103.2": "HCRH OR", "PV103.3": "2179", "PV103.4": "DC", "PV103.5": "R", "PV103.9": "OPERATING ROOM", "PV103.11": "DEPID", "PV104": "EL", "PV107": "1103299990^SURGERY^PHYSICIAN^^^^^^NPI^^^^NPI", "PV110": "Surgery", "PV114": "Home", "PV117": "1103299990^SURGERY^PHYSICIAN^^^^^^NPI^^^^NPI", "PV119": "3013472", "PV120": "SELF", "PV141": "Adm*Conf", "PV144": "2020/06/16 17:12:00", "PV202.1": "Med Surg", "PV208": "20200616171000", "PV212": "Hospital Encounter", "PV221": "n", "PV222": "N", "ROL_PV2": [{"ROL01": "1", "ROL02": "UP", "ROL03.1": "Surgeon", "ROL04.1": "1103299990", "ROL04.2": "SURGERY", "ROL04.3": "PHYSICIAN", "ROL04.9": "NPI", "ROL04.13": "NPI", "ROL05.1": "20200616165319", "ROL11.1": "123 ANYWHERE STREET", "ROL11.3": "VERONA", "ROL11.4": "WI", "ROL11.5": "53593", "ROL12.1": "(555)555-5555", "ROL12.3": "W", "ROL12.6": "555", "ROL12.7": "5555555"}], "OBX": [{"OBX01": "1", "OBX02": "NM", "OBX03.1": "PRIMARYCSN", "OBX04": "1", "OBX05": "3013472", "OBX11": "F"}], "CON_PV2": [{"CON01": "1", "CON02": "General Cons", "CON11": "Not Recv", "CON13": "20200616171118"}], "AL1": [{"AL101": "1", "AL102.1": "SYSTEMIC", "AL103.2": "ALLERGIES NOT ON FILE"}], "DG1": [{"DG101": "1", "DG102": "I10", "DG103.1": "C54.1", "DG103.2": "Malignant neoplasm of endometrium", "DG103.3": "I10", "DG104": "Malignant neoplasm of endometrium", "DG106": "^A"}], "GT_Array": [{"GT101": "1", "GT102": "1812", "GT103.1": "TEST", "GT103.2": "PATHWAY", "GT105.1": "555 STREET PLACE", "GT105.3": "LOS ANGELES", "GT105.4": "CA", "GT105.5": "90004", "GT105.6": "US", "GT105.9": "LOS ANGELES", "GT106.1": "(818)555-4789", "GT106.6": "818", "GT106.7": "5554789", "GT108.1": "19810616", "GT109": "M", "GT110": "P/F", "GT111": "SLF", "GT112": "887-56-9942", "GT116": "ALBERTSONS", "GT117.1": "250 PARKCENTER BLVD", "GT117.3": "BOISE", "GT117.4": "ID", "GT117.5": "83706", "GT117.6": "US", "GT118.1": "(208)395-6200", "GT118.6": "208", "GT118.7": "3956200", "GT120": "Full"}], "CreateDateTime": "2020/06/16 17:12:18", "ICD_Codes": ["C54.1"]}`
        }
          //Lab
          else if(checkflag=="BMT_LABORDERS") 
          {
          message = `{
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
          //Medication
          else if(checkflag=="BMT_MEDICATIONS") 
          {
          message = `{"MSH02": "^~&", "MSH03.1": "Epic", "MSH04.1": "COH", "MSH06.1": "COH", "MSH07": "20200406155132", "MSH08": "203758", "MSH09.1": "RDE", "MSH09.2": "O11", "MSH10": "379", "MSH11.1": "T", "MSH12.1": "2.3", "PID03.1": "55102300", "PID03.4": "EPI", "PID03.5": "MR", "PID05.1": "RAD-TEST^NINE^^^^^D", "PID07": "19820326", "PID08.1": "F", "PID09": "RADTEST^NINE", "PID10.1": "X", "PID11.1": "1500 E. DUARTE ROAD", "PID11.3": "DUARTE", "PID11.4": "CA", "PID11.5": "91009", "PID11.6": "US", "PID11.7": "L", "PID11.9": "LOS ANGELES", "PID12": "LOS ANGELES", "PID13.1": "(626)256-4673^P^H^^^626^2564673~^NET^Internet^rad-testnine@gmail.com", "PID15.1": "ENG", "PID16.1": "S", "PID18.1": "3010208", "PID19": "555-11-2299", "PID22.1": "DECLINE", "PV102.1": "TREATMENT", "PV103.1.1": "HCRHPET", "PV103.4": "DC", "PV103.11": "DEPID", "PV107.1": "1184731135^FORMAN^STEPHEN^J^^^^^NPI^^^^NPI~2949^FORMAN^STEPHEN^J^^^^^PROVID^^^^PROVID", "PV108.1": "1184731135", "PV108.2": "FORMAN", "PV108.3": "STEPHEN", "PV108.4": "J", "PV108.9": "NPI", "PV108.13": "NPI~2949", "PV108.14": "FORMAN", "PV108.15": "STEPHEN", "PV108.16": "J", "PV108.21": "PROVID", "PV108.25": "PROVID", "PV119.1": "3010208", "ORC01": "DC", "ORC02.1": "38536", "ORC02.2": "EPC", "ORC07.2": "Once", "ORC07.3": "X1", "ORC07.4": "20200406163000", "ORC07.5": "20200406163000", "ORC07.6": "R", "ORC09": "2020/04/06 15:51:00", "ORC11.1": "1174978", "ORC11.2": "TORRICELLI", "ORC11.3": "CHERYL", "ORC11.4": "J", "ORC11.9": "PROVID", "ORC11.13": "PROVID", "ORC12.1": "1184731135", "ORC12.2": "FORMAN", "ORC12.3": "STEPHEN", "ORC12.4": "J", "ORC12.9": "NPI", "ORC12.13": "NPI~2949", "ORC12.14": "FORMAN", "ORC12.15": "STEPHEN", "ORC12.16": "J", "ORC12.21": "PROVID", "ORC12.25": "PROVID", "ORC14.1": "(626)218-2704", "ORC14.6": "626", "ORC14.7": "2182704", "ORC21.1": "Duarte", "ORC22.1": "1500 DUARTE RD", "ORC22.3": "DUARTE", "ORC22.4": "CA", "ORC22.5": "91010-3012", "ORC23.1": "(626)256-4673", "ORC23.6": "626", "ORC23.7": "2564673", "ORC24.1": "1500 E. DUARTE RD.", "ORC24.2": "DEPT OF HEMATOLOGY  HCT", "ORC24.3": "DUARTE", "ORC24.4": "CA", "ORC24.5": "91010", "ORC24.6": "US", "ORC29": "I", "RXE01.2": "Once", "RXE01.3": "X1", "RXE01.4": "20200406163000", "RXE01.5": "20200406163000", "RXE01.6": "R", "RXE02.1": "4088845000", "RXE02.2": "FLUCICLOVINE 10 MCI", "RXE02.9": "fluciclovine (AXUMIN) injection 45 mCi", "RXE03": "45", "RXE05.1": "mCi", "RXE05.2": "mCi", "RXE06.1": "30", "RXE07.1": "Dose per protocol", "RXE10": "5", "RXE13.1": "AF6578934", "RXE13.2": "FORMAN", "RXE13.3": "STEPHEN", "RXE13.4": "J", "RXE30": "STANDARD", "RXE40.2": "RADIOPHARM RX", "TQ": [{"TQ103.1": "Once", "TQ109.1": "R"}], "RXR01.1": "IV", "RXR01.2": "Intravenous", "RXC": [{"RXC02.1": "4088845000", "RXC02.2": "FLUCICLOVINE 10 MCI", "RXC03": "45", "RXC04.1": "millicurie", "RXC04.2": "mCi", "RXC05": "10", "RXC06.1": "millicurie", "RXC06.2": "mCi", "NAME": "FLUCICLOVINE 10 MCI", "Therapeutic_Class": "Miscellaneous Products", "Pharmaceutical_Class": "Diagnostic Products", "PHARMACEUTICAL_SUBCLASS": "Diagnostic Radiopharmaceuticals"}], "ZTA": [{"ZTA01": "50", "ZTA02.1": "millicurie", "ZTA05": "1015", "ZTA08.6": "5 x 10 millicurie "}], "CreateDateTime": "2020/06/16 16:42:37"}`
       
             }   //Model
             else if(checkflag=="MODEL_RESULT") 
             {
          message = `{"result": {"exit_code": "0",
          "stdout": [""],
          "stderr": [""],
          "results": {"EntityID": [{"ID": "152693", "Type": "CSN"}],
           "ScoreDisplayed": "Sepsis External Model Score Column",
           "PredictiveContext": {},
           "OutputType": "3",
           "Outputs": {"Output1": {"Scores": {"Sepsis External Model Score Column": {"Values": ["0.444999"]}},
             "Features": {"Glucose": {"Contributions": [0]},
              "RBC": {"Contributions": [0]},
              "Hematocrit": {"Contributions": [0]},
              "RDW": {"Contributions": [0]},
              "Platelet": {"Contributions": [0]},
              "Calcium": {"Contributions": [0]},
              "WBC": {"Contributions": [0.009589579992944724]},
              "MCHC": {"Contributions": [0]},
              "Lactate": {"Contributions": [0]},
              "Albumin": {"Contributions": [0]},
              "Creatinine": {"Contributions": [0]},
              "Hemoglobin": {"Contributions": [0]},
              "Monocyte": {"Contributions": [0]},
              "Lymphocyte": {"Contributions": [0]},
              "Neutrophil": {"Contributions": [0]},
              "spo2": {"Contributions": [0]},
              "heartrate": {"Contributions": [0]},
              "resprate": {"Contributions": [0.009404862661524871]},
              "bpdias": {"Contributions": [0.00857136318014786]},
              "o2delivery": {"Contributions": [0]},
              "bpsys": {"Contributions": [0.02427424486097968]},
              "temperature": {"Contributions": [0]},
              "weight": {"Contributions": [0.02519234102289102]},
              "Age": {"Contributions": [0]},
              "GenderCode": {"Contributions": [0]},
              "MaritalStatusCode": {"Contributions": [0]},
              "RaceCode": {"Contributions": [0]},
              "antiinfective": {"Contributions": [0]},
              "cardiovascularagent": {"Contributions": [0]},
              "gastrointensinalagents": {"Contributions": [0]},
              "respiratoryagents": {"Contributions": [0]},
              "antineoplastic": {"Contributions": [0]},
              "genitourinarytractagents": {"Contributions": [0]},
              "psychoagents": {"Contributions": [0]},
              "centralnervoussystemagens": {"Contributions": [0]},
              "metabolicagents": {"Contributions": [0]},
              "topicalagents": {"Contributions": [0]},
              "hormones": {"Contributions": [0]},
              "coagulationmodifiers": {"Contributions": [0]},
              "immunologicagents": {"Contributions": [0]},
              "nutritionalproducts": {"Contributions": [0]},
              "diabetes": {"Contributions": [0]},
              "immunocomorbidity": {"Contributions": [0]},
              "hypertension": {"Contributions": [0]}}}},
           "Raw": {"Glucose": {"Values": [-0.2249961981685967]},
            "RBC": {"Values": [0.27844550718718536]},
            "Hematocrit": {"Values": [0.4534238910679107]},
            "RDW": {"Values": [0.39476838284299354]},
            "Platelet": {"Values": [0.7701085242540047]},
            "Calcium": {"Values": [0.2579277549800991]},
            "WBC": {"Values": [0.160688278742203]},
            "MCHC": {"Values": [-0.4042309472203728]},
            "Lactate": {"Values": [-0.13564460087210078]},
            "Albumin": {"Values": [0.35321739930342333]},
            "Creatinine": {"Values": [0.08226535947364022]},
            "Hemoglobin": {"Values": [0.3953760768032422]},
            "Monocyte": {"Values": [-0.34570045258975346]},
            "Lymphocyte": {"Values": [-0.16673970344803388]},
            "Neutrophil": {"Values": [-0.23891551563769153]},
            "spo2": {"Values": [-0.03464816011496129]},
            "heartrate": {"Values": [-1.2986503207152835]},
            "resprate": {"Values": [-0.19743945846926117]},
            "bpdias": {"Values": [-0.35653649914894303]},
            "o2delivery": {"Values": [-0.2676233025868795]},
            "bpsys": {"Values": [-0.364407427992126]},
            "temperature": {"Values": [-0.3314026833189914]},
            "weight": {"Values": [0.010859572213860748]},
            "Age": {"Values": [-3.7219288145041234]},
            "GenderCode": {"Values": [1.0]},
            "MaritalStatusCode": {"Values": [3.0]},
            "RaceCode": {"Values": [5.0]},
            "antiinfective": {"Values": [-0.8640103187649829]},
            "cardiovascularagent": {"Values": [-0.4305845728537112]},
            "gastrointensinalagents": {"Values": [-0.7919814782108333]},
            "respiratoryagents": {"Values": [-0.7120770066493911]},
            "antineoplastic": {"Values": [-0.6782510806407367]},
            "genitourinarytractagents": {"Values": [-0.22901785252463708]},
            "psychoagents": {"Values": [-0.16619420666570434]},
            "centralnervoussystemagens": {"Values": [-0.7467678363463166]},
            "metabolicagents": {"Values": [-0.328452546441388]},
            "topicalagents": {"Values": [-0.7718573643522505]},
            "hormones": {"Values": [-0.6497520358635602]},
            "coagulationmodifiers": {"Values": [-0.6161590341774638]},
            "immunologicagents": {"Values": [-0.7571433996781763]},
            "nutritionalproducts": {"Values": [-0.7988653725892126]},
            "diabetes": {"Values": [-0.18274956947471618]},
            "immunocomorbidity": {"Values": [-0.04840672633755129]},
            "hypertension": {"Values": [5.829840185288732]}}},
          "messages": []}}`
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
    Checkflag(name) {
        let first_tiles=false;
        let snd_tiles=false;
        let third_tiles=false;
        if(name==1)
        {
            first_tiles=true;
            snd_tiles=false;
           third_tiles=false;
        }
        else if(name==2)
        {
            first_tiles=false;
            snd_tiles=true;
           third_tiles=false;
        }
        else if(name==3)
        {
            first_tiles=false;
            snd_tiles=false;
           third_tiles=true;
        }
        this.setState({
            first_tiles:first_tiles,
          snd_tiles:snd_tiles,
          third_tiles:third_tiles
          
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
                <div className="col-2 summary-container"  style={{cursor:'pointer'}} onClick={() => this.Checkflag('1')}>
                    <div className="summary-header" >Total BMT Messages</div>
                    <div className='green summary-title isClickable'>
                     1.2M
                </div>
                </div>

                <div className="col-2 summary-container"style={{cursor:'pointer'}} onClick={() => this.Checkflag('2')}>
                    <div className="summary-header">Total BMT Paylod</div>
                    <div className='blue summary-title'  >
                        90K
                </div>
                </div>
                <div className="col-2 summary-container"style={{cursor:'pointer'}} onClick={() => this.Checkflag('3')}>
                    <div className="summary-header">Total Predictions</div>
                    <div className='blue summary-title' >
                        70K
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
            // { headerName: "Type", field: "Type", width: 120, },
            // { headerName: "Submitter", field: "Submitter", width: 140, },
            { headerName: "Topic", field: "Topic", flex: 1,  },   
        ]

        return (
            <div style={{ width: '100%', height: '100%' }}>
                <div className="ag-theme-balham" style={{ padding: '0', marginTop: '15px' }}>
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

                            if(event.data.Type == 'A04' && event.data.MessageID == '12350'){
                                this.setState({
                                    showA04: true,
                                    showDetails: false
                                })   
                            }
                            else {
                                this.setState({
                                    showDetails: true,
                                    showA04: false,
                                })   
                            }
                        }}
                    >

                    </AgGridReact>

                </div>


            </div>
        )
    }

    _renderOutboundTable() {

        let data = [
            {
                API_ID: 12345,
                Date: '06/16/2020 06:00:00',
                API_URL: 'A08',
                Requester: 'EPIC',
                Destination:'COH'
            },

            {
                API_ID: 12346,
                Date: '06/16/2020 06:00:00',
                API_URL: 'A01',
                Requester: 'EPIC',
                Destination:'COH'
            },

            {
                API_ID: 12347,
                Date: '06/15/2020 08:20:10',
                API_URL: 'A04',
                Requester: 'EPIC',
                Destination:'COH'
            },

            {
                API_ID: 12348,
                Date: '06/15/2020 08:20:10',
                API_URL: 'A05',
                Requester: 'EPIC',
                Destination:'COH'
            },

            {
                API_ID: 12349,
                Date: '06/15/2020 08:20:10',
                API_URL: 'A03',
                Requester: 'EPIC',
                Destination:'COH'
            },

            {
                API_ID: 12341,
                Date: '06/15/2020 08:20:10',
                API_URL: 'A02',
                Requester: 'EPIC',
                Destination:'COH'
            },


            {
                API_ID: 12342,
                Date: '06/15/2020 08:20:10',
                API_URL: 'A06',
                Requester: 'EPIC',
                Destination:'COH'

            },


            {
                API_ID: 12343,
                Date: '06/15/2020 08:20:10',
                API_URL: 'A03',
                Requester: 'EPIC',
                Destination:'COH'

            },

            {
                API_ID: 12344,
                Date: '06/15/2020 08:20:10',
                API_URL: 'A07',
                Requester: 'EPIC',
                Destination:'COH'
            }

        ]


        let columnDefs = [
            { headerName: "Message ID", field: "API_ID", width: 120, cellStyle: { color:'#139DC9', cursor:'pointer' } },
            { headerName: "Date", field: "Date", width: 140, },
            { headerName: "Type", field: "API_URL", width: 120, },
            { headerName: "Submitter", field: "Requester", width: 140, },
            { headerName: "Destination", field: "Destination", flex: 1, },   
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
                        rowData={data}
                        enableCellTextSelection={true}
                        onCellClicked={(event) => {
                            if(event.colDef.headerName == 'Message ID'){
                                this.setState({
                                    showDetails1: true
                                })   
                            }
                        }}
                    >

                    </AgGridReact>

                </div>


            </div>
        )
    }

    _renderClaimTables = (array) => {
        let row = []
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : 'n'
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : 'n'
        let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'
        let State = this.state.State ? this.state.State : 'n'
        let type = this.state.type ? this.state.type : ''

        array.forEach(item => {
            let addon = ''
            let claimStatus = ''
            let loadStatus = ''
            let generalStatus = ''
            let mcgStatus = ''
            let notSent = ''
            let subtitle = ''
            let status277CA = ''
            let color = "var(--main-bg-color)"
            let  flag=""
            
            
            if (item.name == 'BMT_ADT') {
                flag=1
                generalStatus = 'BMT_ADT'
                subtitle = 'BMT_ADT'
               
            } else if (item.name == 'BMT_VITALS') {
                flag=2
                generalStatus = 'BMT_VITALS'
                subtitle = "BMT_VITALS"
               
            } else if (item.name == 'BMT_MEDICATIONS') {
                flag=4
                generalStatus = 'BMT_MEDICATIONS'
                subtitle = "BMT_MEDICATIONS"
            } else if (item.name == 'BMT_LABORDERS') {
                flag=3
                generalStatus = 'BMT_LABORDERS'
                subtitle = "BMT_LABORDERS"           
            } else if (item.name == 'BMT_PAYLOAD') {
                flag=3
                generalStatus = 'BMT_PAYLOAD'                          
                subtitle ="BMT_PAYLOAD"
                color = "var(--main-bg-color)"
            } else if (item.name == 'MODEL_RESULT') {
                flag=3
                subtitle = "MODEL_RESULT"
                generalStatus = 'MODEL_RESULT'
               
            }
   
            let sendData = [
                {  
                    generalStatus:generalStatus,
                    flag: flag
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
            <div className="col-4 chart-container" style={{ paddingTop: "12px", paddingBottom: '12px' }}>
                {row}
            </div>
        )
    }
                       
    
    Click=(data)=>{
        let query 
        let flag = data[0].flag
        let topic = data[0].generalStatus
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
                sepsisTable: true,
                massage_flag:topic,
                showDetails:false,
                predition:true
            })
        })
        .catch(err => {
            console.log(err)
        })
    }
    
    renderClaimDetails = () => {
        let stage_1 = [
            { 'name': 'BMT_ADT', 'value': '50K' , 'isClick': 1 },
            { 'name': 'BMT_VITALS', 'value': '30K', 'isClick': 1 },
            { 'name': 'BMT_MEDICATIONS', 'value': '20K', 'isClick': 1 },
            { 'name': 'BMT_LABORDERS', 'value': '20K', 'isClick': 1 },
        ]
        let stage_2 = [
          
            { 'name': 'BMT_PAYLOAD', 'value': '90K', 'isClick': 1 },
        ]
        let stage_3 = [
            { 'name': 'MODEL_RESULT', 'value': '70K', 'isClick': 1 },
         
        ]


        return (
            <div className="row-2" style={{ marginBottom: '12px', marginLeft: '-9px' }}>
                {this.state.first_tiles ?this._renderClaimTables(stage_1):""}
                {this.state.snd_tiles ? this._renderClaimTables(stage_2):""}
                {this.state.third_tiles ?  this._renderClaimTables(stage_3):""}
            
            </div>
        )
    }

    render() {
        return (
            <div className="container">
                <h5 className="headerText">Prediction Dashboard</h5>
                {this.renderTopbar()}
                {this.renderSummaryDetails()}
                <div className="general-header">Topics</div>
                {this.renderClaimDetails()}
                {this._renderAllCharts()}
                <div className="row">
                    <div className="col-7">
                        {/* <h6> Inbound Table</h6> */}
                        {this.state.predition ? this._renderInboundTable() : null}
                    </div>
                    {this.state.showDetails ?
                        <div className="col-5" >
                            {this.renderDetails()}
                        </div> : null}
                        {this.state.showA04 ?
                        <div className="col-5" >
                            {this.renderDetails()}
                        </div> : null}
                </div>
                <br></br><br></br>
            </div>
        );
    }
}