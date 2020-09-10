import React from 'react';
import '././style.css';
import Urls from '../../../../helpers/Urls'
import ReactPaginate from 'react-paginate';
import Strings from '../../../../helpers/Strings';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

var val = ''
export default class Outbound_Encounter_StatewiseTradingPartner extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            TradingPartnerList: [],
            StateList: [],
            TransactionMasterList: [],
            ISA_06: '',
            ISA_06_Name: '',
            State: '',
            Transaction_Type: '',
            ISA_08: '',
            ISA_08_Name: '',
            PayerID: '',
            PayerName: '',
            Trans_ID: '',
            ID: 0,
            page: 1,
            count: 0,
            Search_Senderid: '',
            Search_Sendername: '',
            Search_PayerID: '',
            Search_PayerName: '',
            Search_State: "",
            Search_Tran_Type: "Encounter 837P",
            direction: 'Outbound',
            orderby: '',
            showTable: false,
            ISA06_Name_Rotation: 180,
            ISA06_ID_Rotation: 180,
            PayerName_Rotation: 180,
            PayerID_Rotation: 180,
            ISA08_Name_Rotation: 180,
            ISA08_ID_Rotation: 180,
            State_Rotation: 180,
            Transaction_Code_Rotation: 180,
            incoming_fileId: "",
            fileName: '',
            paginationPageSize: 10,
            domLayout: 'autoHeight',
            LOB: '',
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
            rowSelection: 'never',
            rowGroupPanelShow: 'never',
            pivotPanelShow: 'never',
            statusArray: [
                { 'State': 'UT', 'fileName': '834_UT_Audit.da', 'Monthly_file': '', 'Cut_off_period': '25-04-2020', 'Cut_off_period_end': '29-04-2020', 'Daily_threshold': '3:00 PM', 'Email_threshold': 'enrollment@molina.com', 'Override': '', },
                { 'State': 'ID', 'fileName': '834_ID_Audit.da', 'Monthly_file': '', 'Cut_off_period': '26-04-2020', 'Cut_off_period_end': '30-04-2020', 'Daily_threshold': '3:00 PM', 'Email_threshold': 'enrollment@molina.com', 'Override': '', },
                { 'State': 'CA', 'fileName': '834_CA_Audit.da', 'Monthly_file': '', 'Cut_off_period': '26-04-2020', 'Cut_off_period_end': '29-04-2020', 'Daily_threshold': '3:00 PM', 'Email_threshold': 'enrollment@molina.com', 'Override': '', },
                { 'State': 'AL', 'fileName': '834_AL_Audit.da', 'Monthly_file': '', 'Cut_off_period': '27-04-2020', 'Cut_off_period_end': '30-04-2020', 'Daily_threshold': '3:00 PM', 'Email_threshold': 'enrollment@molina.com', 'Override': '', },
                { 'State': 'AK', 'fileName': '834_AK_Audit.da', 'Monthly_file': '', 'Cut_off_period': '28-04-2020', 'Cut_off_period_end': '30-04-2020', 'Daily_threshold': '3:00 PM', 'Email_threshold': 'enrollment@molina.com', 'Override': '', },
                { 'State': 'AZ', 'fileName': '834_AZ_Audit.da', 'Monthly_file': '', 'Cut_off_period': '28-04-2020', 'Cut_off_period_end': '30-04-2020', 'Daily_threshold': '3:00 PM', 'Email_threshold': 'enrollment@molina.com', 'Override': '', },
                { 'State': 'AR', 'fileName': '834_AR_Audit.da', 'Monthly_file': '', 'Cut_off_period': '29-04-2020', 'Cut_off_period_end': '27-04-2020', 'Daily_threshold': '3:00 PM', 'Email_threshold': 'enrollment@molina.com', 'Override': '', },
                { 'State': 'CO', 'fileName': '834_CO_Audit.da', 'Monthly_file': '', 'Cut_off_period': '29-04-2020', 'Cut_off_period_end': '30-04-2020', 'Daily_threshold': '3:00 PM', 'Email_threshold': 'enrollment@molina.com', 'Override': '', },
                { 'State': 'CT', 'fileName': '834_CT_Audit.da', 'Monthly_file': '', 'Cut_off_period': '30-04-2020', 'Cut_off_period_end': '29-04-2020', 'Daily_threshold': '3:00 PM', 'Email_threshold': 'enrollment@molina.com', 'Override': '', },
                { 'State': 'DL', 'fileName': '834_DL_Audit.da', 'Monthly_file': '', 'Cut_off_period': '30-04-2020', 'Cut_off_period_end': '30-04-2020', 'Daily_threshold': '3:00 PM', 'Email_threshold': 'enrollment@molina.com', 'Override': '', },
                { 'State': 'LA', 'fileName': '834_LA_Audit.da', 'Monthly_file': '', 'Cut_off_period': '30-04-2020', 'Cut_off_period_end': '30-04-2020', 'Daily_threshold': '3:00 PM', 'Email_threshold': 'enrollment@molina.com', 'Override': '', },
                { 'State': 'ME', 'fileName': '834_ME_Audit.da', 'Monthly_file': '', 'Cut_off_period': '30-04-2020', 'Cut_off_period_end': '30-04-2020', 'Daily_threshold': '3:00 PM', 'Email_threshold': 'enrollment@molina.com', 'Override': '', },
            ],
            statusArray1: [
                { 'State': 'UT', 'fileName': '834_UT_Audit.da', 'dailyFile': '834_UT_Daily.da', 'sequence': 'MOLINA', 'Daily_threshold': '3:00 PM', 'Email_threshold': 'enrollment@molina.com', 'Override': '', },
                // { 'State': 'UT', 'fileName':'834_UT_Audit.da',  'dailyFile': '834_UT_Daily1.da','sequence': 'MOLCHIP',  'Daily_threshold': '3:00 PM', 'Email_threshold': 'enrollment@molina.com', 'Override': '',},
                // { 'State': 'UT', 'fileName':'834_UT_Audit.da',  'dailyFile': '834_UT_Daily2.da','sequence': 'MOL IMED',  'Daily_threshold': '3:00 PM', 'Email_threshold': 'enrollment@molina.com', 'Override': '',},
                { 'State': 'UT', 'fileName': '834_UT_Audit1.da', 'dailyFile': '834_UT_Daily.da', 'sequence': 'MOLCHIP', 'Daily_threshold': '3:00 PM', 'Email_threshold': 'enrollment@molina.com', 'Override': '', },
                { 'State': 'UT', 'fileName': '834_UT_Audit1.da', 'dailyFile': '834_UT_Daily1.da', 'sequence': 'MOL IMED', 'Daily_threshold': '3:00 PM', 'Email_threshold': 'enrollment@molina.com', 'Override': '', },
                // { 'State': 'UT', 'fileName':'834_UT_Audit1.da',  'dailyFile': '834_UT_Daily2.da','sequence': 'MOLINA',  'Daily_threshold': '3:00 PM', 'Email_threshold': 'enrollment@molina.com', 'Override': '',},
                // { 'State': 'UT', 'fileName':'834_UT_Audit2.da',  'dailyFile': '834_UT_Daily.da', 'sequence': 'MOL IMED', 'Daily_threshold': '3:00 PM', 'Email_threshold': 'enrollment@molina.com', 'Override': '',},
                // { 'State': 'UT', 'fileName':'834_UT_Audit2.da',  'dailyFile': '834_UT_Daily1.da','sequence': 'MOLINA',  'Daily_threshold': '3:00 PM', 'Email_threshold': 'enrollment@molina.com', 'Override': '',},
                // { 'State': 'UT', 'fileName':'834_UT_Audit2.da',  'dailyFile': '834_UT_Daily2.da','sequence': 'MOLCHIP',  'Daily_threshold': '3:00 PM', 'Email_threshold': 'enrollment@molina.com', 'Override': '',},

                { 'State': 'AL', 'fileName': '834_AL_Audit.da', 'dailyFile': '834_AL_Daily01.da', 'sequence': 'MOLINA', 'Daily_threshold': '3:00 PM', 'Email_threshold': 'enrollment@molina.com', 'Override': '', },
                // { 'State': 'AL', 'fileName':'834_AL_Audit.da', 'dailyFile': '834_AL_Daily02.da', 'sequence': 'MOLCHIP', 'Daily_threshold': '3:00 PM', 'Email_threshold': 'enrollment@molina.com', 'Override': '',},
                // { 'State': 'AL', 'fileName':'834_AL_Audit.da', 'dailyFile': '834_AL_Daily03.da', 'sequence': 'MOL IMED', 'Daily_threshold': '3:00 PM', 'Email_threshold': 'enrollment@molina.com', 'Override': '',},

                { 'State': 'AK', 'fileName': '834_AK_Audit.da', 'dailyFile': '834_UT_Daily001.da', 'sequence': 'MOLCHIP', 'Daily_threshold': '3:00 PM', 'Email_threshold': 'enrollment@molina.com', 'Override': '', },
                // { 'State': 'AK', 'fileName':'834_AK_Audit001.da', 'dailyFile': '834_UT_Daily002.da','sequence': 'MOLCHIP',  'Daily_threshold': '3:00 PM', 'Email_threshold': 'enrollment@molina.com', 'Override': '',},
                // { 'State': 'AK', 'fileName':'834_AK_Audit002.da', 'dailyFile': '834_UT_Daily003.da','sequence': 'MOL IMED',  'Daily_threshold': '3:00 PM', 'Email_threshold': 'enrollment@molina.com', 'Override': '',},

                { 'State': 'ID', 'fileName': '834_ID_Audit.da', 'dailyFile': '834_ID_Daily003.da', 'sequence': 'MOLINA', 'Daily_threshold': '3:00 PM', 'Email_threshold': 'enrollment@molina.com', 'Override': '', },
                // { 'State': 'ID', 'fileName':'834_ID_Audit01.da',  'dailyFile': '834_ID_Daily004.da', 'sequence': 'MOLCHIP', 'Daily_threshold': '3:00 PM', 'Email_threshold': 'enrollment@molina.com', 'Override': '',},
                // { 'State': 'ID', 'fileName':'834_ID_Audit02.da',  'dailyFile': '834_ID_Daily005.da', 'sequence': 'MOL IMED', 'Daily_threshold': '3:00 PM', 'Email_threshold': 'enrollment@molina.com', 'Override': '',},

                { 'State': 'CA', 'fileName': '834_CA_Audit.da', 'dailyFile': '834_CA_Daily006.da', 'sequence': 'MOLINA', 'Daily_threshold': '3:00 PM', 'Email_threshold': 'enrollment@molina.com', 'Override': '', },
                // { 'State': 'CA', 'fileName':'834_CA_Audit001.da',  'dailyFile': '834_CA_Daily007.da', 'sequence': 'MOLCHIP', 'Daily_threshold': '3:00 PM', 'Email_threshold': 'enrollment@molina.com', 'Override': '',},
                // { 'State': 'CA', 'fileName':'834_CA_Audit002.da',  'dailyFile': '834_CA_Daily008.da', 'sequence': 'MOL IMED', 'Daily_threshold': '3:00 PM', 'Email_threshold': 'enrollment@molina.com', 'Override': '',},

            ]

        };

        this.displaydata = this.displaydata.bind(this)
        this.ChangeVal = this.ChangeVal.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    componentDidMount() {
        this.getData()
        this.getTransdata()
        this.gettranaction()
        this._refreshScreen()
    }


    gettranaction() {

        let query =
            `{
                TradingPartnerlist (ID:0 page:` + this.state.page + ` OrderBy:"${this.state.orderby}" Transaction:"` + this.state.Search_Tran_Type + `" State:"` + this.state.Search_State + `" PayerID:"` + this.state.Search_PayerID + `" PayerName:"` + this.state.Search_PayerName + `"  ISA06_ID:"` + this.state.Search_Senderid + `" ISA06_Name:"` + this.state.Search_Sendername + `" ISA08_ID :"" ISA08_Name:"" LOB:"") { 
                Rcount
                ID
                ISA06_ID
                Transaction_Code
                State
                ISA08_ID
                PayerName
                PayerID
                ISA06_Name
                ISA08_Name
                TradingPartnerName
                Is_Active
                LOB
                Max_Size_of_File
                Max_Encounter_In_File
                Max_Line_Items_In_Encounter
                ScheduleTime
                
                     }
                   
               }`

        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }

        fetch(Urls._base_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                let count = 1
                let array = []
                let summary = []
                let data = res.data

                let iterator = data.TradingPartnerlist
                iterator.forEach(item => {
                    array.push({
                        ID: item.ID,
                        ISA06_ID: item.ISA06_ID,
                        Transaction_Code: item.Transaction_Code,
                        state: item.State,
                        ISA08_ID: item.ISA08_ID,
                        PayerName: item.PayerName,
                        PayerID: item.PayerID,
                        ISA06_Name: item.ISA06_Name,
                        ISA08_Name: item.ISA08_Name,
                        LOB: item.LOB,
                        Max_Size_of_File: item.Max_Size_of_File,
                        Max_Encounter_In_File: item.Max_Encounter_In_File,
                        Max_Line_Items_In_Encounter: item.Max_Line_Items_In_Encounter,
                        ScheduleTime: item.ScheduleTime,

                    })
                })


                if (data && data.TradingPartnerlist.length > 0) {

                    count = Math.floor(data.TradingPartnerlist[0].Rcount / 10)
                    if (data.TradingPartnerlist[0].Rcount % 10 > 0) {
                        count = count + 1
                    }
                }
                this.setState({
                    TradingPartnerList: array,
                    count: count
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })
    }

    getTransdata() {
        let query = `{      
            TransactionMaster  {                  
                Trans_Code
                Transaction_Type
            }           
        }`

        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._base_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    TransactionMasterList: res.data.TransactionMaster

                })
            })

            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })
    }
    getData() {
        let query = `{
                  StateList  (UserId:0 Flag:0) {
                  State
                  StateCode
            }
       }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._base_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    StateList: res.data.StateList

                })
            })

            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })
    }
    handlePageClick(data) {
        let page = data.selected + 1
        this.setState({
            page: page,

        })

        setTimeout(() => {
            this.gettranaction()
        }, 50);
    }
    ChangeVal(event, key) {

        this.setState({
            [key]: event.target.options[event.target.selectedIndex].value,
        })
    }
    getoptions() {

        let row = []
        this.state.StateList.forEach(element => {
            row.push(<option selected={this.state.State == element.StateCode ? element.StateCode : ''} value={element.StateCode}>{element.StateCode}</option>)
        })
        return row

    }
    Search_getoptions() {

        let row = []
        this.state.StateList.forEach(element => {
            row.push(<option selected={this.state.Search_State == element.StateCode ? element.StateCode : ''} value={element.StateCode}>{element.StateCode}</option>)
        })
        return row

    }
    Search_gettrans() {

        let row = []
        this.state.TransactionMasterList.forEach(element => {
            row.push(<option selected={this.state.Search_Tran_Type == element.Trans_Code ? element.Trans_Code : ''} value={element.Trans_Code}>{element.Trans_Code}</option>)
        })
        return row

    }
    gettrans() {

        let row = []
        this.state.TransactionMasterList.forEach(element => {
            // if(element.Trans_Code=="Encounter 837I" || element.Trans_Code=="Encounter 837P")
            // {
            row.push(<option selected={this.state.Transaction_Type == element.Trans_Code ? element.Trans_Code : ''} value={element.Trans_Code}>{element.Trans_Code}</option>)
            // }
        })
        return row

    }
    handleClick(event) {
        if (this.state.PayerName != undefined && this.state.PayerName != "") {
            var query = 'mutation{TradingPartnerSave(ID : ' + this.state.ID + ' ' +
                'ISA06_ID :"' + this.state.ISA_06 + '"  ' +
                'Transaction_Code :"' + this.state.Transaction_Type + '"  ' +
                'State :"' + this.state.State + '" ' +
                'ISA08_ID :"' + this.state.ISA_08 + '"  ' +
                'PayerName :"' + this.state.PayerName + '"  ' +
                'PayerID :"' + this.state.PayerID + '"  ' +
                'ISA06_Name :"' + this.state.ISA_06_Name + '"  ' +
                'ISA08_Name :"' + this.state.ISA_08_Name + '"  ' +
                'LOB :"' + this.state.LOB + '"  ' +

                'TradingPartnerName :""  ' +
                ')' + '{ Msg  ID }' +
                '}'


            if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
            fetch(Urls._base_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    query

                })
            })
                .then(r => r.json())
                .then(data => alert(data.data.TradingPartnerSave[0].Msg))
            setTimeout(() => {
                window.location.reload()
            }, 1000)
        }
        else { alert("Plaese Enter the Payer Name") }
    }

    onChangeName(event, key) {
        this.setState({
            [key]: event.target.value
        });
    }

    handleSort(e, rotation, key) {
        let addOn = " asc"
        if (rotation == 0) {
            addOn = " desc"
        }

        e = e + addOn
        this.setState({
            orderby: e,
            [key]: rotation == 0 ? 180 : 0
        })
        setTimeout(() => {
            this.gettranaction()
        }, 50);
    }

    renderTableHeader() {
        return (
            <tr className="table-head">
                <td className="table-head-text"><a className="clickable" onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "" : "TradingPartnerlist.ISA06_Name", this.state.ISA06_Name_Rotation, 'ISA06_Name_Rotation')}>Sender Name</a></td>
                <td className="table-head-text"><a className="clickable" onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "" : "TradingPartnerlist.ISA06_ID", this.state.ISA06_ID_Rotation, 'ISA06_ID_Rotation')}>Sender Id(ISA06)</a></td>
                <td className="table-head-text"><a className="clickable" onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "" : "TradingPartnerlist.PayerName", this.state.PayerName_Rotation, 'PayerName_Rotation')}>Payer Name</a></td>
                <td className="table-head-text"><a className="clickable" onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "" : "TradingPartnerlist.PayerID", this.state.PayerID_Rotation, 'PayerID_Rotation')}> Payer ID</a></td>
                <td className="table-head-text"><a className="clickable" onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "" : "TradingPartnerlist.ISA08_Name", this.state.ISA08_Name_Rotation, 'ISA08_Name_Rotation')}>Receiver Name</a></td>
                <td className="table-head-text"><a className="clickable" onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "" : "TradingPartnerlist.ISA08_ID", this.state.ISA08_ID_Rotation, 'ISA08_ID_Rotation')}>Receiver Id(ISA08)</a></td>
                <td className="table-head-text"><a className="clickable" onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "" : "TradingPartnerlist.state", this.state.State_Rotation, 'State_Rotation')}>State</a></td>
                <td className="table-head-text"><a className="clickable" onClick={() => this.handleSort((localStorage.getItem("DbTech") === "SQL") ? "" : "TradingPartnerlist.Transaction_Code", this.state.Transaction_Code_Rotation, 'Transaction_Code_Rotation')}>Transaction Type</a></td>
                <td style={{ width: "10px" }}></td>
                <td style={{ width: "10px" }}></td>
                <td style={{ width: "10px" }}></td>
            </tr>
        )
    }

    Inactive(event) {
        let id = this.state.incoming_fileId
        var query = 'mutation{' +
            'InActiveTradingPartner(ID : ' + id +
            'Is_Active : 0)' +

            '}'
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._base_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query

            })
        })
            .then(r => r.json())
            .then(data => alert(data.data.InActiveTradingPartner))
        setTimeout(() => {
            window.location.reload()
        }, 1000)

    }
    displaydata(event) {
        let id = this.state.incoming_fileId
        let query =
            '{TradingPartnerlist(ID:' + id + ` page:` + this.state.page + ` OrderBy:"" Transaction:"" State:"" PayerID:"" PayerName:"" ISA06_ID:"" ISA06_Name:"" ISA08_ID:"" ISA08_Name:"" LOB:"")
              {
                Rcount
                ID
                ISA06_ID
                Transaction_Code
                State
                ISA08_ID
                PayerName
                PayerID
                ISA06_Name
                ISA08_Name
                TradingPartnerName
                Is_Active
                LOB
                Max_Size_of_File
                Max_Encounter_In_File
                Max_Line_Items_In_Encounter
                ScheduleTime
                 }
               
           }`


        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._base_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {

                this.setState({
                    ISA_06: res.data.TradingPartnerlist[0].ISA06_ID,
                    State: res.data.TradingPartnerlist[0].State,
                    Transaction_Type: res.data.TradingPartnerlist[0].Transaction_Code,
                    ISA_08: res.data.TradingPartnerlist[0].ISA08_ID,
                    PayerID: res.data.TradingPartnerlist[0].PayerID,
                    PayerName: res.data.TradingPartnerlist[0].PayerName,
                    TradingPartnerName: res.data.TradingPartnerlist[0].TradingPartnerName,
                    ISA_08_Name: res.data.TradingPartnerlist[0].ISA08_Name,
                    ISA_06_Name: res.data.TradingPartnerlist[0].ISA06_Name,
                    ID: res.data.TradingPartnerlist[0].ID,
                    LOB: res.data.TradingPartnerlist[0].LOB,

                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })

    }

    renderList() {
        let row = []
        const data = this.state.TradingPartnerList;
        data.forEach((d) => {
            row.push(
                <tr>
                    <td>{d.ISA06_Name}</td>
                    <td>{d.ISA06_ID}</td>
                    <td>{d.PayerName}</td>
                    <td>{d.PayerID}</td>
                    <td>{d.ISA08_Name}</td>
                    <td>{d.ISA08_ID}</td>
                    <td>{d.state}</td>
                    <td>{d.Transaction_Code}</td>

                    <td className="clickable"><img src={require('../../../components/Images/pencil.png')} onClick={this.displaydata} data-value={d.ID} style={{ width: '14px', marginLeft: '10px' }}></img></td>
                    <td className="clickable"><img src={require('../../../components/Images/trash.png')} onClick={this.Inactive} data-value={d.ID} style={{ width: '14px', marginLeft: '10px' }}></img></td>
                    {/* <td> <MDBIcon icon="bars" color="white"/></td> */}
                </tr>
            )
        });

        return (
            <div className="overall-padding">
                <table className="table table-bordered claim-list" align="center">
                    {this.state.TradingPartnerList && this.state.TradingPartnerList.length > 0 ? this.renderTableHeader() : null}
                    <tbody>
                        {row}
                    </tbody>
                </table>
                <ReactPaginate
                    previousLabel={'previous'}
                    nextLabel={'next'}
                    breakLabel={'...'}
                    breakClassName={'page-link'}
                    initialPage={0}
                    pageCount={this.state.count}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={(page) => { this.handlePageClick(page) }}
                    containerClassName={'pagination'}
                    pageClassName={'page-item'}
                    previousClassName={'page-link'}
                    nextClassName={'page-link'}
                    pageLinkClassName={'page-link'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'}

                />
            </div>

        );
    }

    _renderList = () => {
        // <i class="fas fa-pencil-alt"></i>

        let columnDefs = [
            // { headerName: "Sender Name", field: "ISA06_Name", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', } },
            // { headerName: "Sender Id(ISA06)", field: "ISA06_ID", width: 110 },
            { headerName: "Payer Name", field: "PayerName", width: 215, pinned: 'left' },
            { headerName: "Payer ID", field: "PayerID", width: 90, pinned: 'left' },
            // { headerName: "Receiver Name", field: "ISA08_Name", width: 150 },
            // { headerName: "Receiver Id(ISA08)", field: "ISA08_ID", width: 130 },
            { headerName: "State", field: "state", width: 80, pinned: 'left', cellStyle: { color: '#139DC9', cursor: 'pointer' } },
            { headerName: "LOB", field: "LOB", width: 140, },
            { headerName: "Transaction Type", field: "Transaction_Code", width: 150 },
            { headerName: "Scheduled Time", field: "ScheduleTime", width: 250 },
            { headerName: "Max Size of File", field: "Max_Size_of_File", width: 120 },
            { headerName: "Max Encounter in File", field: "Max_Encounter_In_File", width: 150 },
            { headerName: "Max Line items in Encounter", field: "Max_Line_Items_In_Encounter", width: 150 },

            {
                headerName: "", field: "pencil", width: 50, cellRenderer: (data) => {
                    return '<i class="fas fa-pencil-alt"></i>'
                }, cellStyle: { cursor: 'pointer' }, pinned: 'right'
            },
            {
                headerName: "", field: "trash", width: 50, cellRenderer: (data) => {
                    return '<i class="far fa-trash-alt"></i>'
                }, cellStyle: { cursor: 'pointer' }, pinned: 'right'
            },
            // { headerName: "Error Type", field: "Error_Type", width: 150 },
            // { headerName: "Error Code", field: "Error_Code", width: 150 },
            // { headerName: "Error Description", field: "ErrorDescription", flex: 1 },
        ]

        return (
            <div className="text-center" style={{ width: '94%', marginLeft: '3%' }}>

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
                        rowData={this.state.TradingPartnerList}
                        icons={this.state.icons}
                        enableCellTextSelection={true}
                        onCellClicked={(event) => {
                            if (event.column.colId == "pencil") {
                                this.setState({
                                    incoming_fileId: event.data.ID
                                }, () => {
                                    this.displaydata()
                                })
                            } else if (event.column.colId == "trash") {
                                this.setState({
                                    incoming_fileId: event.data.ID
                                }, () => {
                                    this.Inactive()
                                })
                            } else if (event.colDef.headerName == 'State') {
                                this.setState({
                                    State: event.data.state,
                                    showTable: false
                                }, () => {
                                    this._refreshScreen()
                                })
                            }
                        }}
                    >
                    </AgGridReact>
                </div>
            </div>
        )
    }

    AuditFileSeq = () => {
        // <i class="fas fa-pencil-alt"></i>

        let columnDefs = [
            { headerName: "State", field: "State", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
            // { headerName: "Audit File", field: "fileName", flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', } },
            { headerName: "Cut Off Period", field: "Cut_off_period", flex: 1 },
            // { headerName: "Cut Off Period End", field: "Cut_off_period_end", flex: 1 },
            { headerName: "Daily Threshold", field: "Daily_threshold", flex: 1 },
            // { headerName: "Sequence", field: "sequence", flex: 1 },
            { headerName: "Email Threshold", field: "Email_threshold", flex: 1 },
            { headerName: "Override", field: "Override", flex: 1, checkboxSelection: true },
        ]

        return (
            <div className="text-center" style={{ width: '94%', marginLeft: '3%' }}>

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
                        rowData={this.state.rowData}
                        icons={this.state.icons}
                        enableCellTextSelection={true}
                        onCellClicked={(event) => {
                            if (event.colDef.headerName == 'State') {
                                this.setState({
                                    State: event.data.State,
                                    showTable: true
                                }, () => {
                                    this._refreshScreen1()
                                })
                            }
                        }}
                    >
                    </AgGridReact>
                </div>
            </div>
        )
    }

    AuditFileSeqDetails = () => {

        let columnDefs = [
            { headerName: "State", field: "State", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
            { headerName: "Audit File", field: "fileName", flex: 1 },
            // { headerName: "Daily File", field: "dailyFile", flex: 1 },
            { headerName: "Sequence", field: "sequence", flex: 1 },
            // { headerName: "Daily Threshold", field: "Daily_threshold", flex: 1 },
            { headerName: "Email Threshold", field: "Email_threshold", flex: 1 },
            { headerName: "Override", field: "Override", flex: 1, checkboxSelection: true },
        ]

        return (
            <div className="text-center" style={{ width: '94%', marginLeft: '3%' }}>

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
                        rowData={this.state.rowData1}
                        icons={this.state.icons}
                        enableCellTextSelection={true}

                    >
                    </AgGridReact>
                </div>
            </div>
        )
    }

    _refreshScreen = () => {
        let statusArray = []
        if (this.state.State) {
            this.state.statusArray.forEach(item => {
                if (item.State == this.state.State) {
                    statusArray.push(item)
                }
            })
        } else {
            statusArray = this.state.statusArray
        }

        this.setState({
            rowData: statusArray
        })
    }

    _refreshScreen1 = () => {
        let statusArray1 = []

        this.state.statusArray1.forEach(item => {
            if (item.State == this.state.State) {
                statusArray1.push(item)
            }
        })

        this.setState({
            rowData1: statusArray1
        })
    }


    Headerview() {

        return (
            <div>
                <div>
                    <h5 className="headerText">Trading Partner Details</h5><br />
                </div>
                {this.renderTopbar()}
                <div>
                    <div className="panel-group">
                        <div className="panel panel-default" style={{ border: "1px" }}>
                            <div className="panel-heading collapsible" style={{ background: "#139DC9", }} href="#BasicX12Options">
                                <span className="panel-title" style={{ color: "white", fontSize: "12px" }}>
                                    Trading Partner Configuration
                                </span>
                            </div>
                            <div id="BasicX12Options"   > <div className=" content">


                                <br />
                                <div className="row" style={{ marginLeft: "2px" }}>
                                    <div className="form-group col-sm-2">
                                        <label className="list-header1">Sender Name</label>
                                        <input className="form-control list-header1" value={this.state.ISA_06_Name == null ? '' : this.state.ISA_06_Name} onChange={(e) => this.onChangeName(e, 'ISA_06_Name')}></input>
                                    </div>
                                    <div className="form-group col-sm-2">
                                        <label className="list-header1">Sender Id(ISA06)</label>
                                        <input className="form-control list-header1" value={this.state.ISA_06 == null ? '' : this.state.ISA_06} onChange={(e) => this.onChangeName(e, 'ISA_06')}></input>
                                    </div>
                                    <div className="form-group col-sm-2">
                                        <label className="list-header1">Payer Name</label>
                                        <input className="form-control list-header1" value={this.state.PayerName == null ? '' : this.state.PayerName} onChange={(e) => this.onChangeName(e, 'PayerName')}></input>
                                    </div>
                                    <div className="form-group col-sm-2">
                                        <label className="list-header1">Payer Id</label>
                                        <input className="form-control list-header1" value={this.state.PayerID == null ? '' : this.state.PayerID} onChange={(e) => this.onChangeName(e, 'PayerID')}></input>
                                    </div>
                                    <div className="form-group col-sm-2">
                                        <label className="list-header1">Receiver Id(ISA08)</label>
                                        <input className="form-control list-header1" value={this.state.ISA_08 == null ? '' : this.state.ISA_08} onChange={(e) => this.onChangeName(e, 'ISA_08')}></input>
                                    </div>
                                </div>

                                <div className="row" style={{ marginLeft: "2px" }}>

                                    <div className="form-group col-sm-2">
                                        <label className="list-header1">Receiver Name</label>
                                        <input className="form-control list-header1" value={this.state.ISA_08_Name == null ? '' : this.state.ISA_08_Name} onChange={(e) => this.onChangeName(e, 'ISA_08_Name')}></input>
                                    </div>
                                    <div className="form-group col-sm-2">
                                        <label className="list-header1">State</label>
                                        <select className="form-control list-header1" onChange={(e) => this.ChangeVal(e, 'State')}>
                                            <option value="0"></option>
                                            {this.getoptions()}
                                        </select>
                                    </div>
                                    <div className="form-group col-sm-2">
                                        <label className="list-header1">Transaction Type</label>
                                        <select className="form-control list-header1" va id="fao1" onChange={(e) => this.ChangeVal(e, 'Transaction_Type')}>
                                            <option value="0" ></option>
                                            {this.gettrans()}
                                            {/* <option selected={this.state.Transaction_Type == '270' ? "selected" : ''} value="270" >270</option>
                                    <option selected={this.state.Transaction_Type == '834' ? "selected" : ''} value="834" >834</option>
                                    <option selected={this.state.Transaction_Type == '837P' ? "selected" : ''} value="837P" >837P</option>
                                    <option selected={this.state.Transaction_Type == '837I' ? "selected" : ''} value="837I" >834</option> */}
                                        </select>
                                    </div>
                                    <div className="form-group col-sm-2">
                                        <label className="list-header1">LOB</label>
                                        <input className="form-control list-header1" value={this.state.LOB == null ? '' : this.state.LOB} onChange={(e) => this.onChangeName(e, 'LOB')}></input>
                                    </div>
                                    <div className="pull-right col-sm-2">
                                        <button type="submit" className="btn light_blue1 btn-xs" style={{ marginRight: "120px" }} onClick={this.handleClick}>Save</button>
                                    </div>
                                </div>

                                {/* <div className="clickable" data-toggle="collapse" href="#BasicX12Options1">
                                    <span style={{ fontSize: "15px", color: "#139DC9", fontWeight: "700", marginLeft: "30px" }}>
                                        Search
       </span>
                                </div> */}
                                <div id="BasicX12Options1" className="collapse" >
                                    <div className="row" style={{ marginLeft: "2px" }}>
                                        {/* <div className="form-group col-sm-2">
                                        <label className="list-header1">Sender Name</label>
                                        <input className="form-control list-dashboard"  id="state"
                            onChange={(e) => {clearTimeout(val)
                                let value = e.target.value
                                val = setTimeout(() => {
                                    this.setState({ Search_Sendername: value, showDetails: false })
                                    setTimeout(() => {
                                        this.gettranaction()
                                    }, 50);
                                }, 300);
                            }}
                        />
                        
                                    </div> */}
                                        <div className="form-group col-sm-2">
                                            <label className="list-header1">Sender Id(ISA06)</label>
                                            <input className="form-control list-header1" id="state"
                                                onChange={(e) => {
                                                    clearTimeout(val)
                                                    let value = e.target.value
                                                    val = setTimeout(() => {
                                                        this.setState({ Search_Senderid: value, showDetails: false })
                                                        setTimeout(() => {
                                                            this.gettranaction()
                                                        }, 50);
                                                    }, 300);
                                                }}
                                            />
                                        </div>
                                        {/* <div className="form-group col-sm-2">
                                        <label className="list-header1">Payer Name</label>
                                        <input className="form-control list-dashboard"  id="state"
                            onChange={(e) => {clearTimeout(val)
                                let value = e.target.value
                                val = setTimeout(() => {
                                    this.setState({ Search_PayerName: value, showDetails: false })
                                    setTimeout(() => {
                                        this.gettranaction()
                                    }, 50);
                                }, 300);
                            }}
                        />
                                    </div> */}
                                        <div className="form-group col-sm-2">
                                            <label className="list-header1">Payer Id</label>
                                            <input className="form-control list-header1" id="state"
                                                onChange={(e) => {
                                                    clearTimeout(val)
                                                    let value = e.target.value
                                                    val = setTimeout(() => {
                                                        this.setState({ Search_PayerID: value, showDetails: false })
                                                        setTimeout(() => {
                                                            this.gettranaction()
                                                        }, 50);
                                                    }, 300);
                                                }}
                                            />
                                        </div>
                                        <div className="form-group col-sm-2">
                                            <label className="list-header1">State</label>
                                            <select className="form-control list-header1" onChange={(event) => {
                                                this.ChangeVal(event, 'Search_State')
                                                setTimeout(() => {
                                                    this.gettranaction()
                                                }, 50);
                                            }} >
                                                <option value=""></option>
                                                {this.Search_getoptions()}
                                            </select>
                                        </div>
                                        <div className="form-group col-sm-2">
                                            <label className="list-header1">Transaction Type</label>
                                            <select className="form-control list-header1" va id="fao1"
                                                onChange={(event) => {
                                                    this.ChangeVal(event, 'Search_Tran_Type')
                                                    setTimeout(() => {
                                                        this.gettranaction()
                                                    }, 50);
                                                }} >>
                                            <option value="" ></option>
                                                {this.Search_gettrans()}

                                            </select>


                                        </div>

                                    </div>

                                </div>
                                <div>
                                    {this._renderList()}
                                    {/* <div className="general-header" style={{ marginLeft: '3%', marginTop: '12px' }}><b>Audit File Sequencing</b></div> */}
                                    {/* {this.AuditFileSeq()} */}
                                    {/* {this.state.showTable ? this.AuditFileSeqDetails() : null} */}
                                </div>
                            </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div >
        )
    }
    renderTopbar() {
        return (
            <div className="row">
                <div className="form-group col-sm-2" style={{ padding: "0px" }}>
                    <label className="list-header1">State</label>
                    <select className="form-control list-header1" onChange={(event) => {

                        this.ChangeVal(event, 'Search_State')
                        setTimeout(() => {
                            this.gettranaction()
                        }, 50);
                    }} >
                        <option value=""></option>
                        {this.Search_getoptions()}
                    </select>
                </div>
                <div className="form-group col-sm-2">
                    <label className="list-header1">Transaction Type</label>
                    <select className="form-control list-header1" va id="fao1"
                        onChange={(event) => {
                            this.ChangeVal(event, 'Search_Tran_Type')
                            setTimeout(() => {
                                this.gettranaction()
                            }, 50);
                        }} >>
                                            <option value="" ></option>
                        {this.Search_gettrans()}

                    </select>


                </div>
                <div className="form-group col-sm-2">
                    <label className="list-header1">Direction</label>
                    <select className="form-control list-header1" id="fao1" onChange={(e) => this.ChangeVal(e, 'Acceptance_Criteria')}>
                        <option value="0">Select Direction</option>
                        <option selected={this.state.direction == 'Inbound' ? 'selected' : ''} value="Inbound">Inbound</option>
                        <option selected={this.state.direction == 'Outbound' ? 'selected' : ''} value="Outbound">Outbound</option>
                    </select>
                </div>
                <div className="form-group col-1" style={{ marginTop: '6px' }}>
                    <button type="button" className="button">Copy</button>
                </div>


            </div>

        )
    }
    render() {
        return (
            <div>
                {
                    <div>

                        {this.Headerview()}

                        <div className="row">
                            <div className="col-12">

                            </div>

                        </div>
                    </div>


                }

            </div>
        );
    }
}