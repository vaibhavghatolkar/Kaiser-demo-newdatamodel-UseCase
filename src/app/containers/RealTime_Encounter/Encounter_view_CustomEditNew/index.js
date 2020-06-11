import React from 'react';
import moment from 'moment';
import '../../color.css'
import Urls from '../../../../helpers/Urls';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { StateDropdown } from '../../../components/StateDropdown';

export class Encounter_view_CustomEditNew extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            customList: [],
            apiflag: this.props.apiflag,
            tradingpartner: [],
            selectedTradingPartner: '',
            State: "CA",
            transaction: 'Encounter 837P',
            direction: 'Outbound',
            UpdateCheckBox: '',
            checked: [],
            unchecked: [],
            StateList:[],
            TransactionMasterList: [],
            Dual_Submisson:'',
            CopyState:'',
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
            rowSelection: 'multiple',
            rowGroupPanelShow: 'always',
            pivotPanelShow: 'always',
            rowGroupPanelShow: 'always',
            pivotPanelShow: 'always',
            rowData:[],
            rowData1:[]
            
        }

        this.showFile = this.showFile.bind(this)
        this.onUpdate = this.onUpdate.bind(this)
        this.gettrans = this.gettrans.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.Copy = this.Copy.bind(this)
    }

    componentWillReceiveProps() {
        this.setState({
            apiflag: this.props.apiflag
        })
        setTimeout(() => {
            this.getData()
        }, 50);
    }

    componentDidMount() {
        this.getData()
        this.gettranaction()
        this.getTransdata()
        this.renderTableData()
        this.getstate()
    }

    gettranaction() {

        let query = `{
            Rules(transaction:"${this.state.transaction}") {
                seqid
                loopid
                segment
                element
                opert
                value
                flag
                severity
                condition
                Ignore
              }  
                
            }`

        //   RulesNew(transaction:"${this.state.transaction}" RecType : "Inbound") {
        //     seqid
        //     RuleName
        //     Rule_Desc
        //     Validation_Level
        //     mainloop
        //     loopid
        //     segment
        //     element
        //     opert
        //     value
        //     flag
        //     severity
        //     condition
        //     is_condition
        //     Ignore
        //     Min_Value
        //     Max_Value
        //     max_length
        //     Min_Length
        //     Error_Type
        //     Error_Description
        //     is_mandatory
        //     Post_Processing
        //     PostProcessingAPI
        //     Transaction
        //   }
        process.env.NODE_ENV == 'development' && console.log(query)

        fetch(Urls.base_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                let array = []
                let summary = []
                let data = res.data
                let iterator = data.Rules
                iterator.forEach(item => {

                    array.push({
                        loopid: item.loopid,
                        segment: item.segment,
                        element: item.element,
                        condition: item.Rule_Desc,
                        value: item.value,
                        severity: item.severity,
                        isChecked: item.Ignore,
                        seqid: item.seqid,
                        mainLoopId: item.mainloop,
                        operator: item.opert,
                        is_mandatory: item.is_mandatory,
                        max_length: item.max_length,
                        Min_Length: item.Min_Length,
                        Min_Value: item.value,
                        Max_Value: item.Max_Value,
                        Post_Processing: item.Post_Processing,
                        PostProcessingAPI: item.PostProcessingAPI,
                        Validation_Level: 'SNIP Level 4',
                        Transaction: item.Transaction
                    })
                })

                this.setState({
                    customList: array,
                    rowData: array
                    // tradingpartner: res.data.Trading_PartnerList
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })
    }
    getstate() {
        let query = `{
                  StateList  (UserId:0 Flag:0) {
                  State
                  StateCode
            }
       }`
       process.env.NODE_ENV == 'development' && console.log(query);
        fetch(Urls.base_url, {
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
    getData() {

        let query = `{
            TradingPartnerEncounter(State:"${this.state.State}") {
                TradingPartner
              }
        }`
        process.env.NODE_ENV == 'development' && console.log(query);
        fetch(Urls.base_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                process.env.NODE_ENV == 'development' && console.log('Data : ', res)
                this.setState({
                    tradingpartner: res.data.TradingPartnerEncounter
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })

    }

    renderTableData() {
        let data = [
            {
                SrNo: 1,
                list: "Load QNXT",
                api: "http://hipaas.com/loadqnxt"
            },
            {
                SrNo: 2,
                list: "Load QNXT History",
                api: "http://hipaas.com/loadqnxthistory"
            },
            {
                SrNo: 3,
                list: "Duplicate Check",
                api: "http://hipaas.com/duplicatecheck"
            },
            {
                SrNo: 4,
                list: "Twin Check",
                api: "http://hipaas.com/twincheck"
            },
            {
                SrNo: 5,
                list: "Member Demographics",
                api: "http://hipaas.com/memberdemographics"
            },
            {
                SrNo: 6,
                list: "Reconcile",
                api: "http://hipaas.com/reconcile"
            },
            {
                SrNo: 7,
                list: "Active Reconcile",
                api: "http://hipaas.com/activereconcile"
            },
            {
                SrNo: 8,
                list: "Hold Reconcile",
                api: "http://hipaas.com/holdreconcile"
            },
            {
                SrNo: 9,
                list: "Term Reconcile",
                api: "http://hipaas.com/termreconcile"
            },

            {
                SrNo: 10,
                list: "Term by Absence",
                api: "http://hipaas.com/termbyabsence"
            },

            {
                SrNo: 11,
                list: "PCP Check",
                api: "http://hipaas.com/pcpcheck"
            },

            {
                SrNo: 12,
                list: "Household",
                api: "http://hipaas.com/household"
            },

            {
                SrNo: 13,
                list: "B1 - Baby Check",
                api: "http://hipaas.com/b1babycheck"
            },

            {
                SrNo: 14,
                list: "Cross Walk 1",
                api: "http://hipaas.com/crosswalk1"
            },

            {
                SrNo: 15,
                list: "Cross Walk 2",
                api: "http://hipaas.com/crosswalk2"
            },
        ]
        this.setState({
            rowData1: data
        })
    }


    getTransdata() {
        let query = `{      
            TransactionMaster  {                  
                Trans_Code
                Transaction_Type
            }           
        }`

        fetch(Urls.base_url, {
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

    gettrans() {

        let row = []
        process.env.NODE_ENV == 'development' && console.log(this.state.TransactionMasterList)
        this.state.TransactionMasterList.forEach(element => {
            row.push(<option selected={this.state.transaction == element.Trans_Code ? element.Trans_Code : ''} value={element.Trans_Code}>{element.Trans_Code}</option>)
        })
        return row

    }

    renderSearchBar() {
        return (
            <div className="row">
                <input type="text" name="name" className="input-style" placeholder="Search" />
            </div>
        )
    }

    renderTableHeader() {
        return (
            <tr className="table-head">
                {/* <td className="table-head-text list-item-style">Transaction</td>  */}
                <td className="table-head-text list-item-style" style={{width: '10%'}}>Loop Id</td>
                {/* <td className="table-head-text list-item-style">Sub Loop Id</td> */}
                <td className="table-head-text list-item-style">Segment</td>
                <td className="table-head-text list-item-style">Element</td>
                <td className="table-head-text list-item-style" style={{width: '10%'}}>Validation Level</td> 
                {/* <td className="table-head-text list-item-style">Usage Req.</td> */}
                {/* <td className="table-head-text list-item-style">Min | Max length</td> */}
                <td className="table-head-text list-item-style" style={{width: '9%'}}>Operator</td>
                <td className="table-head-text list-item-style" style={{width: '16%'}}>Value / URL</td>
                {/* <td className="table-head-text list-item-style">Rules</td> */}
                
               
                <td className="table-head-text list-item-style">Severity</td>
                <td className="table-head-text list-item-style">Ignore</td>
                <td className="table-head-text list-item-style">Post Processing</td>
                <td className="table-head-text list-item-style">Post Processing API</td>
            </tr>
        )
    }

    _renderList = () => {
     
        let columnDefs = [
            { headerName: "Loop Id", field: "loopid", width:90, },
            { headerName: "Segment", field: "segment", width:100, },
            { headerName: "Element", field: "element",  width:90, },
            { headerName: "Validation Level", field: "Validation_Level",  width:128, },
            { headerName: "Operator", field: "operator",  width:150, },
            { headerName: "Value / URL", field: "Min_Value",  width:250, },
            { headerName: "Severity", field: "severity",  width:90, },
            { headerName: "Ignore", field: "",  width:80, checkboxSelection: true},
            { headerName: "Post Processing", field: "",  width:120, checkboxSelection: true },
            { headerName: "Post Processing API", field: "PostProcessingAPI", width:160, },

        ]

        return (
            <div>
            <div className="panel-heading collapsible" style={{ background: "var(--main-bg-color)" }}>
                    <span className="panel-title" style={{ color: "white" }}>Custom Edits </span>
                </div>
                <div className="panel-collapse content">
                    <div className="panel-body"></div>
            <div style={{width: '96%', marginLeft: '2%', marginBottom: "2%"}}>

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
                        rowData={this.state.rowData}
                        icons={this.state.icons}
                        enableCellTextSelection={true}
                    >
                    </AgGridReact>
                </div>
            </div>
            </div>
            </div>
        )
    }


    renderList() {
        let row = []
        const data = this.state.customList;
        data.forEach((d) => {
            let usageReq = d.is_mandatory == true ? "Required" : "Absent"
            let value = d.Min_Value
            if(value){
                value =  d.Min_Value + " | " + d.Max_Value
            }else{
                value = d.value
            }
            row.push(
                <tr>
                    {/* <td className="list-item-style">{d.Transaction}</td> */}
                    <td className="list-item-style">{d.mainLoopId} {d.loopid}</td>
                    {/* <td className="list-item-style">{d.loopid}</td> */}
                    <td className="list-item-style">{d.segment}</td>
                    <td className="list-item-style">{d.element}</td>
                    <td className="list-item-style">{d.Validation_Level}</td>
                    {/* <td className="list-item-style">{usageReq}</td>
                    <td className="list-item-style">{d.Min_Length} | {d.max_length}</td> */}
                    <td className="list-item-style">{d.operator}</td>
                    <td className="list-item-style">{value}</td>
                    {/* <td className="list-item-style">{d.condition}</td> */}
                  
                  
                    <td className="list-item-style">{d.severity}</td>
                    <td className="list-item-style"><input type="checkbox" checked={d.isChecked} onChange={(e) => { 
                        d.isChecked = e.target.checked
                        this.setState({
                            customList: [...data]
                        })
                        }} value={d.seqid} /></td>
                     <td className="list-item-style"><input type="checkbox" checked={d.Post_Processing} onChange={(e) => { 
                        d.Post_Processing = e.target.checked
                        this.setState({
                            customList: [...data]
                        })
                        }} value={d.seqid} /></td>
                     <td className="list-item-style">{d.PostProcessingAPI}</td>
                </tr>
            )
        });

        return (
            <div>
                <div className="panel-heading collapsible" style={{ background: "var(--main-bg-color)" }}>
                    <span className="panel-title" style={{ color: "white" }}>Custom Edits </span>
                </div>
                <div className="panel-collapse content">
                    <div className="panel-body">
                        <div>
                            <table className="table table-bordered claim-list" align="center" style={{ width: '95%' }}>
                                {this.state.customList && this.state.customList.length > 0 ? this.renderTableHeader() : null}
                                <tbody>
                                    {row}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    changeCheckbox(event, key) {
        let checkboxValue = event.target.checked;
        if (checkboxValue == true) {
            this.state.checked.push(event.target.value)
        } else {
            this.state.unchecked.push(event.target.value)
        }
        this.setState({
            checkedCheckbox: this.state.checked,
            uncheckCheckbox: this.state.unchecked
        })
        // process.env.NODE_ENV == 'development' && console.log(this.state.UpdateCheckBox)
    }
    showFile(name) {
        this.setState({
            showFile: true,
            flag: name
        })
    }

    ChangeTradingPartner(event) {
        alert(event)
    }

    getoptions() {
        let row = []
        
        this.state.tradingpartner.forEach(element => {
            row.push(<option value="">{element.TradingPartner}</option>)
        })
        return row
    }
    getStateList() {
        let row = []
        
        this.state.StateList.forEach(element => {
            if(element.StateCode!="CA")
            row.push(<option value="">{element.StateCode}</option>)
        })
        return row
    }

    onSelect(event, key) {
        this.setState({
            [key]: event.target.options[event.target.selectedIndex].text,
        })
        setTimeout(() => {
            this.gettranaction()
        }, 50);
    }

    onUpdate(e) {
        // e.preventDefault();
        let data = this.state.customList
        let true_val = ''
        let false_val = ''
        data.forEach(element => {
            if (element.isChecked) {
                true_val = true_val + element.seqid + ','
            } else {
                false_val = false_val + element.seqid + ','
            }
        });
        let query = `
            mutation{
                updateIgnoreCodeNew(uncheck:"`+ false_val + `" check:"` + true_val + `")
              }
        `
        process.env.NODE_ENV == 'development' && console.log(query)
        fetch(Urls.base_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                alert(res.data.updateIgnoreCodeNew)
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })
    }
    
    _handleStateChange = (event) => {
        let data = this.state.rowData
        let data1 = this.state.rowData1
        this.setState({
            State : event.target.options[event.target.selectedIndex].text,
            rowData : [],
            rowData1: []
        })

        setTimeout(() => {
            this.setState({
                rowData: data,
                rowData1: data1
            })
        }, 500);
    }
    handleClick(event) {
        
                        this.setState({
                            Dual_Submisson:true,
                            Copy:false,
                    })
    }
    Copy(event) {
        
        this.setState({
            Copy:true,
            Dual_Submisson:false
    })
}

    renderTopbar() {
        return (
            <form className="form-style" id='filters'>
                <div className="form-row">
                    <div className="form-group col">
                        <div className="list-dashboard">State</div>
                        <StateDropdown
                            selected_state={this.state.State}
                            method={this._handleStateChange}
                        />
                    </div>
                  
                    <div className="form-group col">
                        <div className="list-dashboard">Transaction</div>
                        <select className="form-control list-dashboard" id="option"
                            onChange={(event) => {
                                this.onSelect(event, 'transaction')
                            }}
                        >
                              {/* <option value="">Encounter 837P</option>
                            <option value="">Encounter 837I</option> */}
                          
                            {this.gettrans()}
                        </select>
                    </div>

                    <div className="form-group col">
                        <div className="list-dashboard">Submitter </div>
                        <select className="form-control list-dashboard" id="TradingPartner"  onChange={(event) => {
                                        this.onSelect(event, 'Submitter')
                                    }} >
                            <option value="select"></option>
                            {this.getoptions()}
                        </select>
                    </div>
                    <div className="form-group col">
                        <div className="list-dashboard">Direction </div>
                        <select className="form-control list-dashboard" id="TradingPartner"  onChange={(e) => this.ChangeVal(e, 'direction')}>
                             <option value="0">Select Direction</option>
                                    <option selected={this.state.direction == 'Inbound' ? 'selected' : ''} value="Inbound">Inbound</option>
                                    <option selected={this.state.direction == 'Outbound' ? 'selected' : ''} value="Outbound">Outbound</option>
                        </select>
                    </div>

                    {
                        this.state.Copy ?
                        <div className="form-group col">
                        <div className="list-dashboard">Which State to Copy</div>
                        <select className="form-control list-dashboard" id="option"
                           
                        >
                               <option value="0" ></option>
                              {this.getStateList()}
                        </select>
                    </div>
                  :""}

                    {
                        this.state.Dual_Submisson ?
                    <div className="form-group col">
                        <div className="list-dashboard">Submitter </div>
                        <select className="form-control list-dashboard" id="TradingPartner" >
                            <option value="select"></option>
                            {this.getoptions()}
                        </select>
                    </div>:""}
                    <div className="form-group col-1">
                        <button type="button" className="button"  onClick={this.Copy}>Copy</button>
                    </div>
                    <div className="form-group col-2">
                        <button type="button" className="button"  onClick={this.handleClick}>Dual Submission</button>
                    </div>
                   
                    {/* <div className="form-group col-2">
                        <button type="button" className="button" onClick={(e)=> {this.onUpdate(e)}}>Save</button>
                    </div> */}

                </div>
                <br></br>
                         
               
            </form>
        )
    }

    _reconcileConfig = () => {
     
        let columnDefs = [
            { headerName: "Sr. No.", field: "SrNo", width: 100, },
            { headerName: "List", field: "list", width: 300, },
            { headerName: "API", field: "api", flex: 1, cellStyle: { color: '#139DC9', cursor: 'pointer' } },
        ]
        return (
            <div>
            <div className="panel-heading collapsible" style={{ background: "var(--main-bg-color)" }}>
                    <span className="panel-title" style={{ color: "white" }}>Reconcile Config </span>
                </div>
                <div className="panel-collapse content">
                    <div className="panel-body"></div>
            <div style={{width: '96%', marginLeft: '2%', marginBottom: "2%"}}>

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
                        rowData={this.state.rowData1}
                        icons={this.state.icons}
                        enableCellTextSelection={true}
                    >
                    </AgGridReact>
                </div>
            </div>
            </div>
            </div>
        )
    }


    render() {
        return (
            <div>

                {

                    <div>
                        <h5 className="headerText">View Custom Edits</h5>
                        {this.renderTopbar()}
                        <div className="row">
                            <div className="col-12">
                                {/* <h6 style={{fontWeight:"medium", fontSize: '12px'}} >*Configure Max File Size should be 2 MB / Max Encounter Count should be 5000</h6> */}
                                {this._renderList()}
                            </div>
                            <div className="col-12">
                                {/* {this._reconcileConfig()} */}
                            </div>

                        </div>
                    </div>
                }
            </div>
        );
    }
}