import React from 'react';
import '../color.css'
import Urls from '../../../helpers/Urls';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { Filters } from '../../components/Filters';

export class viewCustomEdit_New extends React.Component {

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
            rowGroupPanelShow: 'never',
            pivotPanelShow: 'never',
            rowData:[],
            rowData1:[]
            
        }

        this.showFile = this.showFile.bind(this)
        this.onUpdate = this.onUpdate.bind(this)
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

    _renderList = () => {
     
        let columnDefs = [
            
            { headerName: "Transaction", field: "", width:110, },
            { headerName: "Loop Id", field: "loopid", width:90, },
            { headerName: "SubLoop Id", field: "", width:100, },
            { headerName: "Segment", field: "segment", width:100, },
            { headerName: "Element", field: "element",  width:90, },
            { headerName: "Validation Level", field: "Validation_Level",  width:128, },
            { headerName: "Min | Max length", field: "",  width:140, },
            { headerName: "Operator", field: "operator",  width:150, },
            { headerName: "Value / URL", field: "Min_Value",  width:150, },
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
            <div style={{width: '96%', marginLeft: '2%', margloopidinBottom: "2%"}}>

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


    setData = (startDate, endDate, selected_val, chartType) => {
        this.setState({
            startDate,
            endDate,
            selected_val,
            chartType
        }, () => {
            this._refreshScreen()
        })
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
                isTimeRange={false}
                isSubmitter={true}
                removeGrid={true}
                setData={this.setData}
                update={this.update}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                TransactionFlag={true}
                removeStartDate={true}
                removeEndDate={true}
            />
        )
    }


  

    render() {
        return (
            <div>

                {

                    <div>
                        <h5 className="headerText">View Custom Edits</h5>
                        {/* {this.renderTopbar()} */}
                        {this._renderTopbar()}
                        <div className="row">
                            <div className="col-12">
                                {this._renderList()}
                            </div>
                            
                        </div>
                    </div>
                }
            </div>
        );
    }
}