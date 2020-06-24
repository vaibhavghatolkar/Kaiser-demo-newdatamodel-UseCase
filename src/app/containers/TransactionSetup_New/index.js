import React from 'react';
import './style.css';
import Urls from '../../../helpers/Urls'
import { StateDropdown } from '../../components/StateDropdown';
import { TimeInput } from 'material-ui-time-picker'
import moment from 'moment';


export class TransactionSetup_New extends React.Component {

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state = {
            files: [],
            tradingpartner: [],
            LOBList: [],
            TransactionMaster: [],
            Transaction_Type: '834',
            Companion_Guide: '834 Medicare',
            Acceptance_Criteria: '',
            Communication_Type: '1',
            Change_Trading_Partner: '',
            file_naming_option: '',
            Use_Default_Settings: false,
            Host: '',
            Port: '',
            UserName: '',
            Password: '',
            Directory: '',
            create_directory: false,
            time: moment().format("hh:mm a"),
            time1: moment().format("hh:mm a"),
            interval: '1',
            ScheduleType: 'Minute',
            MaxSizeFile: '',
            MaxEncounterFile: '',
            MaxLineItems: '',
            SelectedLob: '',
            SelectedTransaction: '',
            daysofmonth: '',
            daysofweek: '',
            State: '',
            direction: 'Outbound',
            SelectedTransaction: '834'

        };

        this.ChangeTradingPartner = this.ChangeTradingPartner.bind(this)
        this.ChangeVal = this.ChangeVal.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    componentDidMount() {
        this.getTransactionList()
        this.getData()
        this.getLOBList()
        this.ChangeTradingPartner()
    }

    onChange(e) {
        var files = e.target.files;
        process.env.NODE_ENV == 'development' && console.log(files);
        var filesArr = Array.prototype.slice.call(files);
        process.env.NODE_ENV == 'development' && console.log(filesArr);
        this.setState({ files: [...this.state.files, ...filesArr] });
    }

    displayFile() {
        this.setState({ files: this.state.files });
    }

    getTransactionList() {
        let query = `{
      
            TransactionMaster {
                Trans_Code
                Transaction_Type
              }
        }`
        process.env.NODE_ENV == 'development' && console.log(query)
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
                    TransactionMaster: res.data.TransactionMaster
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })
    }
    getData() {
        let query = `{
      
            TradingPartnerEncounter(State:"${this.state.State}") {
                TradingPartner
              }
        }`
        process.env.NODE_ENV == 'development' && console.log(query)
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
                    tradingpartner: res.data.TradingPartnerEncounter
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })
    }

    getLOBList() {
        let query = `{
            LOBList(State:"${this.state.State}",TradingPartner:"${this.state.Change_Trading_Partner}") {
                LOB
              }
        }`
        process.env.NODE_ENV == 'development' && console.log(query)
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
                    LOBList: res.data.LOBList
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })
    }

    ChangeVal(event, key) {

        this.setState({
            [key]: event.target.options[event.target.selectedIndex].value,
        })
        if (event.target.options[event.target.selectedIndex].value == "1") {
            this.setState({
                file_naming_option: "",
            })
        } else {
            this.setState({
                file_naming_option: 'Error if file exists',
            })
        }
    }
    ChangeVal1(event, key) {

        this.setState({
            [key]: event.target.options[event.target.selectedIndex].value,
        })
    }

    getoptions() {
        let row = []

        this.state.tradingpartner.forEach(element => {

            row.push(<option selected={(this.state.Change_Trading_Partner == element.TradingPartner) ? "SELECTED" : ""}>{element.TradingPartner}</option>)
        })
        return row
    }
    getloboptions() {
        let row = []
        this.state.LOBList.forEach(element => {
            row.push(<option selected={(this.state.SelectedLob == element.LOB) ? "SELECTED" : ""}>{element.LOB}</option>)
        })
        return row
    }
    getTransactionOptions() {
        let row = []
        this.state.TransactionMaster.forEach(element => {
            row.push(<option selected={(this.state.SelectedTransaction == element.Trans_Code) ? "SELECTED" : ""}>{element.Trans_Code}</option>)
        })
        return row
    }

    handleClick(event) {

        if (this.state.State == "" || this.state.State == undefined) {
            alert("Please select the state")
        } else if (this.state.Change_Trading_Partner == "" || this.state.Change_Trading_Partner == undefined) {
            alert("Please select Trading Partner")
        }
        // else if (this.state.SelectedLob == "" || this.state.SelectedLob == undefined) {
        //     alert("Please select the LOB")
        // }
        else if (this.state.SelectedTransaction == "" || this.state.SelectedTransaction == undefined) {
            alert("Please select the Transaction")
        }
        else {
            let query = ` mutation{SP_TransactionSetup_Save(
                ID:0,
                State:"${this.state.State}"
                Trading_Partner: "${this.state.Change_Trading_Partner}",
                LOB:"${this.state.SelectedLob}",
                Transaction:"${this.state.SelectedTransaction}",
                File_Acceptance_Criteria: "${this.state.Acceptance_Criteria}",
                Communication_Type:"${this.state.Communication_Type}",
                Host:"${this.state.Host}",
                Port:"${this.state.Port}",
                User_Name:"${this.state.UserName}",
                Password:"${this.state.Password}",
                Max_Size_of_File:"${this.state.MaxSizeFile}",
                Max_Encounter_In_File:"${this.state.MaxEncounterFile}",
                Max_Line_Items_In_Encounter:"${this.state.MaxLineItems}",
                Campanion_Guide: "${this.state.Companion_Guide}",
                Type:"${this.state.ScheduleType}",
                Start_Time:"${this.state.time}",
                End_Time:"${this.state.time1}",
                Interval:"${this.state.interval}"
                Use_Default_Settings:${this.state.Use_Default_Settings} 
                Directory:"${this.state.Directory}" 
                Create_Directory:${this.state.create_directory ? this.state.create_directory : false} 
                File_Naming_Options:"${this.state.file_naming_option ? this.state.file_naming_option : ""}"
            )
        }`
            process.env.NODE_ENV == 'development' && console.log(query)
            fetch(Urls._Encounter, {
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
                .then(res =>
                    alert(res.data.SP_TransactionSetup_Save))
            setTimeout(() => {
                window.location.reload()
            }, 3000)
        }




        // var query = ` mutation{
        //     SP_Save_TransactionSetup(
        //         ID:0,
        //         Trading_Partner:"${this.state.Change_Trading_Partner}" 	
        //         Transaction_Type:"${this.state.Transaction_Type}" 
        //         Acceptance_Criteria:"${this.state.Acceptance_Criteria}"
        //         Campanion_Guide:"${this.state.Companion_Guide}" 
        //         Communication_Type:"${this.state.Communication_Type}" 
        //         Use_Default_Settings:${this.state.Use_Default_Settings} 
        //         Host:"${this.state.Host}" 
        //         Port:"${this.state.Port}"
        //         UserName:"${this.state.UserName}" 
        //         Password:"${this.state.Password}" 
        //         Directory:"${this.state.Directory}" 
        //         Create_Directory:${this.state.create_directory ? this.state.create_directory : false} 
        //         File_Naming_Options:"${this.state.file_naming_option ? this.state.file_naming_option : ""}" 
        //         RecType:"Inbound"
        //         )
        //   }`



    }

    ChangeTradingPartner(event) {
        if (!event) {
            return
        }
        let selected = event.target.options[event.target.selectedIndex].text
        this.setState({
            Change_Trading_Partner: selected
        }, () => {
            this.getLOBList()
        })
        // let selected = event.target.options[event.target.selectedIndex].text
        // let query1 = '{TransactionSetup (TPName:"' + selected + `") {
        //     Transaction_Type 
        //     Companion_Guide
        //     Acceptance_Criteria
        //     Trading_Partner         
        //     Communication_Type
        //     Use_Default_Settings
        //      Host
        //     Port
        //     UserName
        //     Password
        //     Directory
        //    Create_Directory
        //    File_Naming_Options
        //   }}`
        // process.env.NODE_ENV == 'development' && console.log(query1)
        // fetch(Urls.tradingPartner, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Accept': 'application/json',
        //     },
        //     body: JSON.stringify({ query: query1 })
        // })
        //     .then(res => res.json())
        //     .then(r => {
        //         process.env.NODE_ENV == 'development' && console.log(r.data.TransactionSetup[0])
        //         this.setState({
        //             Transaction_Type: r.data.TransactionSetup[0].Transaction_Type,
        //             Companion_Guide: r.data.TransactionSetup[0].Companion_Guide,
        //             Acceptance_Criteria: r.data.TransactionSetup[0].Acceptance_Criteria,
        //             Communication_Type: r.data.TransactionSetup[0].Communication_Type ? r.data.TransactionSetup[0].Communication_Type : "1",
        //             Use_Default_Settings: r.data.TransactionSetup[0].Use_Default_Settings,
        //             Host: r.data.TransactionSetup[0].Host,
        //             Port: r.data.TransactionSetup[0].Port,
        //             UserName: r.data.TransactionSetup[0].UserName,
        //             Password: r.data.TransactionSetup[0].Password,
        //             Directory: r.data.TransactionSetup[0].Directory,
        //             create_directory: r.data.TransactionSetup[0].create_directory,
        //             file_naming_option: r.data.TransactionSetup[0].file_naming_option,
        //             Change_Trading_Partner: selected
        //         })
        //     })
        //     .catch(err => {
        //         process.env.NODE_ENV == 'development' && console.log(err)
        //     })
        // process.env.NODE_ENV == 'development' && console.log(event.target.options[event.target.selectedIndex].text)
    }

    changeCheckbox(event, key) {
        this.setState({
            [key]: event.target.checked
        })
    }
    onChangeName(event, key) {
        this.setState({
            [key]: event.target.value
        });
    }

    _handleStateChange = (event) => {
        this.setState({
            State: event.target.options[event.target.selectedIndex].text
        }, () => {
            this.getData()
        })
    }
    _ChangeLob = (event) => {
        this.setState({
            SelectedLob: event.target.options[event.target.selectedIndex].text
        })
    }
    _ChangeTransaction = (event) => {
        this.setState({
            SelectedTransaction: event.target.options[event.target.selectedIndex].text
        })
    }

    handleChange(date) {
        this.setState({
            time: moment(date).format('hh:mm a'),
        })
    }

    handleChange1(date) {
        this.setState({
            time1: moment(date).format('hh:mm a'),
        })
    }

    render() {

        return (
            <div>
                {
                    <div>
                        <div>
                            <h5 className="headerText">Transaction Setup</h5>
                        </div><br></br>
                        {/* <div>
                            <p style={{ color: '#139DC9', fontWeight: 'bold' }}>Transaction Setup</p>
                        </div> */}
                        <div className="row">
                            <div className="form-group col-sm-2">
                                <label className="">State</label>
                                <StateDropdown
                                    selected_state={this.state.State}
                                    // value = {this.state.State}
                                    method={this._handleStateChange}
                                />
                            </div>
                            <div className="form-group col-sm-2">
                                <label className="list-header1">Trading partner</label>
                                <select onChange={this.ChangeTradingPartner} className="form-control list-header1" id="fao1">
                                    <option value="0"></option>
                                    {this.getoptions()}
                                </select>
                            </div>
                            <div className="form-group col-sm-2">
                                <label className="list-header1">LOB</label>
                                <select onChange={this._ChangeLob} className="form-control list-header1" id="fao1">
                                    <option value="0">Select LOB</option>
                                    {this.getloboptions()}
                                </select>
                            </div>
                            <div className="form-group col-sm-2">
                                <label className="list-header1">Direction</label>
                                <select className="form-control list-header1" id="fao1" onChange={(e) => this.ChangeVal(e, 'direction')}>
                                    <option value="0">Select Direction</option>
                                    <option selected={this.state.direction == 'Inbound' ? 'selected' : ''} value="Inbound">Inbound</option>
                                    <option selected={this.state.direction == 'Outbound' ? 'selected' : ''} value="Outbound">Outbound</option>
                                </select>
                            </div>

                            <div className="form-group col-1" style={{ marginTop: '6px' }}>
                                <button type="button" className="button">Copy</button>
                            </div>
                            <div className="form-group col-1" style={{ marginTop: '6px' }}>
                                <button type="button" className="button" onClick={this.handleClick} >Save</button>
                            </div>

                            {/* <div className="pull-right form-group col-1" >
                                <button type="button" className="btn light_blue1 btn-xs">Copy</button>
                            </div>
                            <div className="pull-right col-sm-1" style={{marginLeft: '-20px',}}>
                                <button type="submit" onClick={this.handleClick} className="btn light_blue1 btn-xs">Save</button>
                            </div> */}

                        </div>

                        <div className="container" style={{ padding: '0' }}>
                            <div className="panel-group">
                                <div className="panel panel-default" style={{ border: "1px" }}>
                                    <div className="panel-heading collapsible" style={{ background: "#139DC9", }} data-toggle="collapse" href="#BasicX12Options">
                                        <span className="panel-title" style={{ color: "white", fontSize: "12px" }}>
                                            Transaction Setup
                       </span>
                                    </div>
                                    <div id="BasicX12Options"  > <div className=" content" style={{ backgroundColor: 'white' }}>
                                        <br />

                                        {/* <div style={{ fontWeight: '500', marginLeft: '15px', fontSize: '14px' }}>Transaction Setup</div> */}
                                        <div className="row" style={{ marginTop: '7px' }}>

                                            <div className="form-group col-sm-3">
                                                <label className="list-header1">Transaction</label>
                                                <select onChange={this._ChangeTransaction} className="form-control list-header1" id="fao1">
                                                    <option value="0">Select Transaction</option>
                                                    {this.getTransactionOptions()}
                                                </select>
                                            </div>

                                            <div className="form-group col-sm-3">
                                                <label className="list-header1">File Acceptance Criteria</label>
                                                <select className="form-control list-header1" id="fao1" onChange={(e) => this.ChangeVal(e, 'Acceptance_Criteria')}>
                                                    <option value="0">Select File Criteria</option>
                                                    <option selected={this.state.Acceptance_Criteria == 'Partially Accept' ? 'selected' : ''} value="Partially Accept">Partially Accept</option>
                                                    <option selected={this.state.Acceptance_Criteria == 'Full Reject' ? 'selected' : ''} value="Full Reject">Full Reject</option>
                                                </select>
                                            </div>
                                            <div className="form-group col-sm-3">
                                                <label className="list-header1">File Naming Convention</label>
                                                <input type="text" className="form-control list-header1" value={this.state.fileNamingConvention} onChange={(e) => this.onChangeName(e, 'fileNamingConvention')} />
                                            </div>
                                            <div className="form-group col-sm-3">
                                                <label className="list-header1">Communication Type</label>
                                                <select className="form-control list-header1" id="testIndicator" onChange={(e) => this.ChangeVal(e, 'Communication_Type')}>
                                                    <option selected={this.state.Communication_Type == "1" ? "selected" : ''} value="1">SFTP</option>
                                                    <option selected={this.state.Communication_Type == "2" ? "selected" : ''} value="2">Disk</option>
                                                </select>
                                            </div>
                                            {/* {
                                                this.state.Communication_Type == "1" ?
                                                    <div className="form-group col-sm-3" style={{ marginTop: "4px" }}>
                                                        <label className="list-header1">
                                                            Use Default Settings<br></br>
                                                            <input type="checkbox" checked={this.state.Use_Default_Settings == true ? "checked" : ''}
                                                                onChange={(e) => { this.changeCheckbox(e, 'Use_Default_Settings') }}
                                                                className="checkbox-margin" name="defaultSettings" value="" style={{ marginLeft: "50px" }} />
                                                        </label>
                                                    </div> 
                                                    
                                                    : ''
                                            } */}
                                        </div>
                                        {
                                            this.state.Communication_Type == "1" ? <div className="row">
                                                <div className="form-group col-sm-3">
                                                    <label className="list-header1">Host</label>
                                                    <input type="text" className="form-control list-header1" value={this.state.Host} onChange={(e) => this.onChangeName(e, 'Host')} />
                                                </div>

                                                <div className="form-group col-sm-3">
                                                    <label className="list-header1">Port</label>
                                                    <input type="text" className="form-control list-header1" value={this.state.Port} onChange={(e) => this.onChangeName(e, 'Port')} />
                                                </div>


                                                <div className="form-group col-sm-3">
                                                    <label className="list-header1">User Name</label>
                                                    <input type="text" className="form-control list-header1" value={this.state.UserName} onChange={(e) => this.onChangeName(e, 'UserName')} />
                                                </div>
                                                <div className="form-group col-sm-3">
                                                    <label className="list-header1">Password</label>
                                                    <input type="password" className="form-control list-header1" value={this.state.Password} onChange={(e) => this.onChangeName(e, 'Password')} />
                                                </div>
                                            </div> :
                                                <div className="row">
                                                    <div className="form-group col-sm-3">
                                                        <label className="list-header1">Directory</label>
                                                        <input type="text" className="form-control list-header1" value={this.state.Directory} onChange={(e) => this.onChangeName(e, 'Directory')} />
                                                    </div>
                                                    <div className="form-group col-sm-3" style={{ marginTop: "4px" }}>
                                                        <label className="list-header1">Create Directory<br></br>
                                                            <input type="checkbox" checked={this.state.create_directory == true ? "checked" : ''}
                                                                onChange={(e) => { this.changeCheckbox(e, 'create_directory') }}
                                                                className="checkbox-margin" name="defaultSettings" value="" style={{ marginLeft: "50px" }} />
                                                        </label>
                                                    </div>
                                                    <div className="form-group col-sm-3">
                                                        <label className="list-header1">File Naming Options</label>
                                                        <select className="form-control list-header1" id="testIndicator" onChange={(e) => this.ChangeVal1(e, 'file_naming_option')}>
                                                            <option selected={this.state.file_naming_option == "Error if file exists" ? "selected" : ''} value="Error if file exists">Error if file exists</option>
                                                            <option selected={this.state.file_naming_option == "Append if file exists" ? "selected" : ''} value="Append if file exists">Append if file exists</option>
                                                            <option selected={this.state.file_naming_option == "Overwrite if file exists" ? "selected" : ''} value="Overwrite if file exists">Overwrite if file exists</option>
                                                            <option selected={this.state.file_naming_option == "Create unique name if file exists" ? "selected" : ''} value="Create unique name if file exists">Create unique name if file exists</option>
                                                        </select>
                                                    </div>
                                                </div>
                                        }

                                        <div className="row">
                                            <div className="form-group col-sm-3">
                                                <label className="list-header1"> Max Size of File</label>
                                                <input type="text" className="form-control list-header1" value={this.state.MaxSizeFile} onChange={(e) => this.onChangeName(e, 'MaxSizeFile')} />
                                            </div>
                                            {/* <div className="form-group col-sm-3">
                                                <label className="list-header1"> Max Encounter in File</label>
                                                <input type="text" className="form-control list-header1" value={this.state.MaxEncounterFile} onChange={(e) => this.onChangeName(e, 'MaxEncounterFile')} />
                                            </div>
                                            <div className="form-group col-sm-3">
                                                <label className="list-header1">Max Line items in Encounter     </label>
                                                <input type="text" className="form-control list-header1" value={this.state.MaxLineItems} onChange={(e) => this.onChangeName(e, 'MaxLineItems')} />
                                            </div> */}
                                            <div className="form-group col-sm-3">
                                                <label className="list-header1">Companion Guide</label>
                                                <select className="form-control list-header1" id="fao1" onChange={(e) => this.ChangeVal(e, 'Companion_Guide')}>
                                                    <option value="0">Select Companion Guide</option>
                                                    <option selected={this.state.Companion_Guide == 'Encounters 837I Medicaid CA' ? 'selected' : ''}>Encounters 837I Medicaid CA</option>
                                                    <option selected={this.state.Companion_Guide == 'Encounters 837P Medicaid CA' ? 'selected' : ''}>Encounters 837P Medicaid CA</option>
                                                    <option selected={this.state.Companion_Guide == 'Custom Format' ? 'selected' : ''}>Custom Format</option>
                                                    <option selected={this.state.Companion_Guide == '834 Medicare' ? 'selected' : ''}>834 Medicare</option>
                                                    <option selected={this.state.Companion_Guide == '837I Medicaid CA' ? 'selected' : ''}>837I Medicaid CA</option>
                                                    <option selected={this.state.Companion_Guide == '837P Medicaid CA' ? 'selected' : ''}>837P Medicaid CA</option>
                                                    <option selected={this.state.Companion_Guide == '270 Medicare' ? 'selected' : ''}>270 Medicare</option>
                                                    <option selected={this.state.Companion_Guide == '270 Medicaid CA' ? 'selected' : ''}>270 Medicaid CA</option>
                                                    <option selected={this.state.Companion_Guide == '276 Medicare' ? 'selected' : ''}>276 Medicare</option>
                                                    <option selected={this.state.Companion_Guide == '276 Medicaid CA' ? 'selected' : ''}>276 Medicaid CA</option>
                                                </select>
                                            </div>

                                        </div>
                                        <div className="row" style={{ marginTop: '-25px' }}>
                                            <div className="col-sm-9"></div>
                                            <div className="pull-right col-sm-1" style={{ marginLeft: '5%' }}>
                                                <p class="form">

                                                    <label class="add-photo-btn">Add New<span><input type="file" id="myfile" name="myfile" /></span>
                                                    </label>
                                                </p>
                                            </div>
                                            <div className="pull-right col-sm-1">
                                                <label class="custom-file-upload">
                                                    Upload</label>

                                            </div>
                                        </div>

                                        <div style={{ fontWeight: '500', marginLeft: '15px', fontSize: '14px' }}>Schedule to Send Files</div>

                                        <div className="row" style={{ marginTop: '7px' }}>
                                            <div className="form-group col-sm-2">
                                                <label className="list-header1">Type</label>
                                                <select className="form-control list-header1" id="fao1" onChange={(e) => this.ChangeVal(e, 'ScheduleType')}>
                                                    <option value="0" >Select Type</option>

                                                    <option selected={this.state.ScheduleType == 'Minute' ? 'selected' : ''} value="Minute">Minute</option>
                                                    <option selected={this.state.ScheduleType == 'Hour' ? 'selected' : ''} value="Hour">Hour</option>
                                                    <option selected={this.state.ScheduleType == 'Day' ? 'selected' : ''} value="Day">Day</option>
                                                    {/* <option selected={this.state.ScheduleType == 'Weekly' ? 'selected' : ''} value="Weekly">Weekly</option>
                                                    <option selected={this.state.ScheduleType == 'Monthly' ? 'selected' : ''} value="Monthly">Monthly</option> */}

                                                </select>
                                            </div>
                                            <div class="form-group col-sm-2">
                                                <label className="list-header1">Start Time</label>
                                                <div>
                                                    <TimeInput
                                                        className="form-control list-header1"
                                                        mode='12h'
                                                        // value = {new Date(this.state.time)}
                                                        onChange={(time) => this.handleChange(time)}
                                                    />

                                                </div>
                                            </div>

                                            <div class="form-group col-sm-2">
                                                <label className="list-header1">End Time</label>
                                                <div>
                                                    <TimeInput
                                                        className="form-control list-header1"
                                                        mode='12h'
                                                        // value = {new Date(this.state.time)}
                                                        onChange={(time1) => this.handleChange1(time1)}
                                                    />
                                                </div>
                                            </div>


                                            <div className="form-group col-sm-2">
                                                <label className="list-header1">Interval</label>
                                                <input type="text" className="form-control list-header1" value={this.state.interval} onChange={(e) => this.onChangeName(e, 'interval')} />
                                            </div>
                                            <div className="form-group col-sm-2">
                                                <label className="list-header1">Days of Week (1-7)</label>
                                                <input type="text" className="form-control list-header1" placeholder="*" value={this.state.daysofweek} onChange={(e) => this.onChangeName(e, 'daysofweek')} />
                                            </div>
                                            <div className="form-group col-sm-2" style={{ marginLeft: '-10px' }}>
                                                <label className="list-header1">Days of Month (1-31)</label>
                                                <input type="text" className="form-control list-header1" placeholder="*" value={this.state.daysofmonth} onChange={(e) => this.onChangeName(e, 'daysofmonth')} />
                                            </div>







                                        </div>
                                        <div className="row" style={{ marginLeft: '5px' }}>
                                            <div className="col-2" style={{ marginLeft: '0px', fontSize: '11px' }}>Days of the Week :</div>
                                            <div className="form-check leftmargin">
                                                <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" />
                                                <div className="form-check-label" for="defaultCheck1">
                                                    Monday
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row" style={{ marginTop: '10px', marginLeft: '5px' }}>
                                            <div className="col-2 "></div>
                                            <div class="form-check leftmargin">
                                                <input class="form-check-input" type="checkbox" value="" id="defaultCheck1" />
                                                <div class="form-check-label" for="defaultCheck1">
                                                    Tuesday</div>
                                            </div>
                                        </div>
                                        <div className="row" style={{ marginTop: '10px', marginLeft: '5px' }}>
                                            <div className="col-2"></div>
                                            <div class="form-check leftmargin">
                                                <input class="form-check-input" type="checkbox" value="" id="defaultCheck1" />
                                                <div class="form-check-label" for="defaultCheck1">
                                                    Wednesday</div>
                                            </div>
                                        </div>
                                        <div className="row" style={{ marginTop: '10px', marginLeft: '5px' }}>
                                            <div className="col-2"></div>
                                            <div class="form-check leftmargin">
                                                <input class="form-check-input" type="checkbox" value="" id="defaultCheck1" />
                                                <div class="form-check-label" for="defaultCheck1">
                                                    Thursday</div>
                                            </div>
                                        </div>
                                        <div className="row" style={{ marginTop: '10px', marginLeft: '5px' }}>
                                            <div className="col-2"></div>
                                            <div class="form-check leftmargin">
                                                <input class="form-check-input" type="checkbox" value="" id="defaultCheck1" />
                                                <div class="form-check-label" for="defaultCheck1">
                                                    Friday</div>
                                            </div>
                                        </div>
                                        <div className="row" style={{ marginTop: '10px', marginLeft: '5px' }}>
                                            <div className="col-2"></div>
                                            <div class="form-check leftmargin">
                                                <input class="form-check-input" type="checkbox" value="" id="defaultCheck1" />
                                                <div class="form-check-label" for="defaultCheck1">
                                                    Saturday</div>
                                            </div>
                                        </div>
                                        <div className="row" style={{ marginTop: '10px', marginLeft: '5px' }}>
                                            <div className="col-2"></div>
                                            <div class="form-check leftmargin">
                                                <input class="form-check-input" type="checkbox" value="" id="defaultCheck1" />
                                                <div class="form-check-label" for="defaultCheck1">
                                                    Sunday</div>
                                            </div>
                                            <br /><br />
                                        </div>

                                    </div>
                                    </div>

                                </div>
                            </div>
                        </div><br />
                    </div>
                }
            </div>
        );
    }
}