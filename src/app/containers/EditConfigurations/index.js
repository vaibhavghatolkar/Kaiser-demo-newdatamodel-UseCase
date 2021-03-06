import React from 'react';
import '../TradingPartnerConfiguration/style.css';
import Urls from '../../../helpers/Urls';
import ReactPaginate from 'react-paginate';
import Strings from '../../../helpers/Strings';
import { StateDropdown } from '../../components/StateDropdown';

export class EditConfiguration extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            files: [],
            customList: [],
            operation: [],
            tradingpartner: [],
            options: {},
            transaction: 'Claims 837I Medicaid',
            count: 1,
            page: 1,
            OperatorMaster: [],
            SegmentCompYesno: '',
            SegmentItem: '',
            RuleName: '',
            state: 'California',
            TradingPartner: '',
            Rule_Desc: '',
            Validationlevel: '',
            OperatorId: '',
            LoopID: '',
            LoopID1: '',
            LoopID2:'',
            LoopID3:'',
            SegmentId: '',
            SegmentId1: '',
            FieldId: '',
            FieldId1: '',
            Usage_Req: '',
            Maxlength: '',
            Value: '',
            ErrorType: '',
            ErrorDescription: '',
            Severity: '',
            valuerange: '',
            MinValue: '',
            MaxValue: '',
            Min_Length: "",
            compareDetailsFlag: false,
            Oprator_Id2: '',
            Min_Value2: '',
            Max_Value2: '',
            Value2: '',
            is_mandatory2: 'Required',
            max_length2: '',
            Min_Length2: '',
            mainloop: '',
            mainloop2: '',
            TransactionMasterList:[],
            transactionSelect:'837P',
            GetCustomEdits:[],
            is_mandatory: 'Required',
            selected_state:'',
            State: 'CA',

        };

        this.onChange = this.onChange.bind(this);
        // this.operation = this.operation.bind(this)
        this.clicked = this.clicked.bind(this)
        this.getData = this.getData.bind(this)
        this.onSelect = this.onSelect.bind(this)
        this.getTransdata = this.getTransdata.bind(this)
        this.SegmentCompYesno = this.SegmentCompYesno.bind(this)
        this.getTableCustomEdits = this.getTableCustomEdits.bind(this)
        this.ChangeVal1 = this.ChangeVal1.bind(this)
    }

    componentDidMount() {

        this.getviewdetails()
        this.gettradingpatner()
        this.getTransdata()
        this.getTableCustomEdits()
        this.operator()
        // this.getData('{loopid(flag:"c" transaction:' + '"' + this.state.transactionSelect + '"' + ') { loopid }}', 1, 0)
        this.getData( `{SP_GetMainloop(TransactionType:"${this.state.transactionSelect}"){Mainloop}}`, 0, 0)
    }


    operator() {

        let query = `{
            OperatorMaster {
                Operator
                ID
              }
             
        }`
        fetch(Urls.CustomConfiguration, {
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
                    OperatorMaster: res.data.OperatorMaster,
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
        fetch(Urls.common_data, {
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

    gettradingpatner() {

        let query = `{
                Trading_PartnerList(RecType :"Inbound", Transaction:"Claim837RT") {
                    Trading_Partner_Name 
                }
            
        }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) };
        fetch(Urls.common_data, {
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
                    tradingpartner: res.data.Trading_PartnerList
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })

    }

    getData(query, flag, iter) {

        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls.CustomConfiguration, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(r => {
                let options = this.state.options
                if(flag==0){
                    options[iter] = {
                        loopidArray: r.data.SP_GetMainloop,
                        loopidArray1: r.data.SP_GetMainloop
                    }  
                }
                else if (flag == 1) {
                    // options[iter] = {
                    //     loopidArray: r.data.SP_GetMainloop,
                    //     loopidArray1: r.data.SP_GetMainloop
                    // }
                    options[iter]["subLoopidArray"] = r.data.SP_GetSubloop
                    options[iter]["segmentArray"] = r.data.SP_GetSegment
                } else if (flag == 2) {
                    options[iter]["segmentArray"] = r.data.SP_GetSegment
                } else if (flag == 3) {
                    options[iter]["elementArray"] = r.data.SP_GetElement
                }
                else if (flag == 4) {
                    options[iter]["segmentArray1"] = r.data.SP_GetSegment
                }
                else if (flag == 5) {
                    options[iter]["elementArray1"] = r.data.SP_GetElement
                }
                else if(flag==6){
                    options[iter]["subLoopidArray1"]  = r.data.SP_GetSubloop
                    options[iter]["segmentArray1"] = r.data.SP_GetSegment
                }
                process.env.NODE_ENV == 'development' && console.log(options)
                this.setState({
                    options: options
                })
            })
            .then(data => process.env.NODE_ENV == 'development' && console.log('data returned:', data));
    }

    onChange(event) {
        var files = event.target.files;
        process.env.NODE_ENV == 'development' && console.log(files);
        var filesArr = Array.prototype.slice.call(files);
        process.env.NODE_ENV == 'development' && console.log(filesArr);
        this.setState({ files: [...this.state.files, ...filesArr] });
    }

    gettrans() {

        let row = []
        this.state.TransactionMasterList.forEach(element => {
            row.push(<option value={element.Trans_Code}>{element.Trans_Code}</option>)
        })
        return row

    }

    onOptionSelect = (event, iter, flag, loopid, LoopID2) => {
       let value = event.target.value
        if (!value) {
            return
        }
        let query = ''
        let inner_flag = 0

        if(flag==0){
            // query = '{segment(flag:"c" transaction:' + '"' + this.state.transactionSelect + '"' + ' loopid:' + '"' + value + '"' + ') { segment }}'
            query = `{
                SP_GetSubloop(TransactionType:"${this.state.transactionSelect}",Mainloop:"${value}") {SubLoop}
                SP_GetSegment(TransactionType:"${this.state.transactionSelect}",Mainloop:"${value}",SubLoop:""){Segment}
            }`
            if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
            let options = this.state.options
            options[iter]["selected_mainloopid"] = value

            this.setState({
                options: options,
                LoopID: value
            })
            inner_flag = 1  
        }
        else if (flag == 1) {
            // query = '{segment(flag:"c" transaction:' + '"' + this.state.transactionSelect + '"' + ' loopid:' + '"' + value + '"' + ') { segment }}'
            query = `{SP_GetSegment(TransactionType:"${this.state.transactionSelect}",Mainloop:"${loopid}",SubLoop:"${value}"){Segment}}`
            let options = this.state.options
            options[iter]["selected_loopid"] = value

            this.setState({
                options: options,
                LoopID2: value,
            })
            inner_flag = 2
        }
        else if (flag == 2) {
           
            if(loopid == undefined){
                loopid = ' '
            }
           // query = '{element(flag:"c" transaction:' + '"' + this.state.transactionSelect + '"' + ' loopid:' + '"' + loopid + '"' + ' segment:' + '"' + value + '"' + ') { element }}'
           query = ` { SP_GetElement(TransactionType:"${this.state.transactionSelect}",Mainloop:"${LoopID2}",SubLoop:"${loopid}",Segment:"${value}"){Field}}` 
           inner_flag = 3
            this.setState({
                SegmentId: value
            })


        }
        else if (flag == 4) {

            // query = '{segment(flag:"c" transaction:' + '"' + this.state.transactionSelect + '"' + ' loopid:' + '"' + value + '"' + ') { segment }}'
            // let options = this.state.options
            // options[iter]["selected_loopid"] = value
            query = `{SP_GetSegment(TransactionType:"${this.state.transactionSelect}",Mainloop:"${loopid}",SubLoop:"${value}"){Segment}}`
            let options = this.state.options
            options[iter]["selected_loopid"] = value

            this.setState({
                options: options,
                LoopID1: value
            })
            inner_flag = 4
        }

        else if (flag == 5) {
            if(loopid == undefined){
                loopid = ' '
            }
            query = ` { SP_GetElement(TransactionType:"${this.state.transactionSelect}",Mainloop:"${LoopID2}",SubLoop:"${loopid}",Segment:"${value}"){Field}}` 
            // query = '{element(flag:"c" transaction:' + '"' + this.state.transactionSelect + '"' + ' loopid:' + '"' + loopid + '"' + ' segment:' + '"' + value + '"' + ') { element }}'
            inner_flag = 5
            this.setState({
                SegmentId1: value
            })

        }
        else if(flag==6){
            // query = '{segment(flag:"c" transaction:' + '"' + this.state.transactionSelect + '"' + ' loopid:' + '"' + value + '"' + ') { segment }}'
            query = `{
                SP_GetSubloop(TransactionType:"${this.state.transactionSelect}",Mainloop:"${value}") {SubLoop}\
                SP_GetSegment(TransactionType:"${this.state.transactionSelect}",Mainloop:"${value}",SubLoop:""){Segment}
            }`
            let options = this.state.options
            options[iter]["selected_mainloopid"] = value

            this.setState({
                options: options,
                LoopID3: value
            })
            inner_flag = 6  
        }
        setTimeout(() => {
            this.getData(query, inner_flag, iter)
        }, 50);
    }

    renderOptions(array, flag) {
        let row = []
            // row.push(<option value=""></option>);
        array.forEach(element => {
            row.push(<option value={flag == 0 ? element.Mainloop :flag == 1 ? element.SubLoop : flag == 2 ? element.Segment : element.Field}>{flag == 0 ? element.Mainloop :flag == 1 ? element.SubLoop : flag == 2 ? element.Segment : element.Field}</option>)
        });

        return row
    }
    SegmentCompYesno(event) {

        this.setState({
            SegmentCompYesno: event.target.options[event.target.selectedIndex].text,
            SegmentItem: event.target.options[event.target.selectedIndex].value
        })

        setTimeout(() => {
            this.renderView()
        }, 50);
    }

    _handleStateChange = (event) => {
       this.setState({
        State: event.target.options[event.target.selectedIndex].text,
       })
    }

    renderView() {
        let row = []
        let options = this.state.options
        
        Object.keys(options).forEach(item => {
            
            row.push(

                <div className="panel-group">
                <div className="panel panel-default">
                    <div className="panel-heading collapsible" style={{ background: "#139DC9" }}>
                        <span className="panel-title" style={{ color: "white" }}>Add Custom Edits </span>
                    </div>
                    <div className="panel-collapse content">
                        <br></br>
                                <div className="panel-body">
                                    <div className="row">
                                        <div className="form-group col-3">
                                            <div className="list-header1">State</div>
                                            <StateDropdown
                                                    selected_state={this.state.State}
                                                    method={this._handleStateChange}
                                                    customConfig = {true}
                                                />
                                        </div>

                                        <div className="form-group col-3">
                                            <div className="list-header1">Select Transaction</div>
                                            <select className="form-control list-header1" id="option"
                                               onChange={(event) => this.ChangeVal1(event, 'transactionSelect')}
                                            value={this.state.transactionSelect}>
                                                {this.gettrans()}
                                            </select>
                                        </div>

                                        <div className="form-group col-3">
                                            <div className="list-header1">Trading Partner </div>
                                            <select className="form-control list-header1" value={this.state.TradingPartner} id="TradingPartner" onChange={(event) => this.ChangeVal(event, 'TradingPartner')} >
                                                <option value="select">Trading partner</option>
                                                {/* <option selected="selected">AVAILITY</option> */}
                                                {this.getoptions()}
                                            </select>
                                        </div>
                                        <div className="form-group col-3">
                                            <div className="list-header1">
                                            Rule Description
                                        </div>
                                            <textarea type="text" className="list-header1 form-control" value={this.state.Rule_Desc == null ? '' : this.state.Rule_Desc} onChange={(event) => this.onChangeName(event, 'Rule_Desc')} />
                                        </div>
                                    </div>
                                    <div className="row">
                                    
                                        <div className="form-group col-3">
                                            <div className="list-header1">
                                                Validation Level
                                        </div>
                                            <select className="form-control list-header1" onChange={(event) => this.ChangeVal(event, 'Validationlevel')}>
                                                <option value=""></option>
                                                <option value="4">SNIP Level 4</option>
                                                <option value="5">SNIP Level 5</option>
                                                <option value="6">SNIP Level 6</option>
                                                <option value="7">SNIP Level 7</option>
                                                {/* <option value="6">SNIP Level 8</option>
                                            <option value="7">SNIP Level 4</option> */}

                                            </select>
                                        </div>

                                        <div className="form-group col-sm-3">
                                            <div className="list-header1">Severity</div>
                                            <select className="form-control list-header1" onChange={(event) => this.ChangeVal(event, 'Severity')}>
                                                <option value=""></option>
                                                <option value="0">Fail</option>
                                                <option value="1">Warning</option>
                                                {/* <option value="2">Skip</option> */}
                                            </select>
                                        </div>
                                    
                                        <div className="form-group col-sm-3">
                                            <div className="list-header1">Error Type</div>
                                            <select className="form-control list-header1" value="1" onChange={(event) => this.ChangeVal(event, 'ErrorType')}>
                                                <option value=""></option>
                                                <option value="0">TA1</option>
                                                <option value="1">999</option>

                                            </select>
                                        </div>
                                        <div className="form-group col-sm-3">
                                            <div className="list-header1">
                                                Error Description
                                        </div>
                                            <textarea type="text" className="list-header1 form-control" onChange={(event) => this.onChangeName(event, 'ErrorDescription')} />
                                        </div>
                                        </div>
                                    

                                    <div className="row">
                                        <div className="form-group col-sm-3">
                                            <div className="list-header1">
                                                Main Loop Id
                                        </div>
                                            <select className="form-control list-header1" id={item + 'mainLoop'} onChange={(event) => {this.onOptionSelect(event, item, 0) }}>
                                                <option value=""></option>
                                                {options[item].loopidArray ? this.renderOptions(options[item].loopidArray, 0) : null}
                                            </select>
                                        </div>

                                        <div className="form-group col-sm-3">
                                            <div className="list-header1">
                                                Sub Loop Id
                                        </div>
                                            <select className="form-control list-header1" id={item + 'subLoop'} onChange={(event) => { this.onOptionSelect(event, item, 1, options[item].selected_mainloopid) }}>
                                                <option value=""></option>
                                                {options[item].subLoopidArray ? this.renderOptions(options[item].subLoopidArray, 1) : null}
                                            </select>
                                        </div>

                                        <div className="form-group col-sm-3">
                                            <div className="list-header1">
                                                Segment
                                        </div>
                                            <select className="form-control list-header1" id={item + 'segment'} onChange={(event) => { this.onOptionSelect(event, item, 2, options[item].selected_loopid, options[item].selected_mainloopid) }}>
                                                <option value=""></option>
                                                {options[item].segmentArray ? this.renderOptions(options[item].segmentArray, 2) : null}
                                            </select>
                                        </div>

                                        <div className="form-group col-sm-3">
                                            <div className="list-header1">
                                                Field
                                        </div>
                                            <select className="form-control list-header1" onChange={(event) => this.ChangeVal(event, 'FieldId')}>
                                                <option value=""></option>
                                                {options[item].elementArray ? this.renderOptions(options[item].elementArray, 3) : null}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row">

                                        <div className="form-group col-sm-3">
                                            <div className="list-header1">Usage Req.</div>
                                            <select className="form-control list-header1" onChange={(event) => this.ChangeVal(event, 'is_mandatory')}>
                                                {/* <option value=""></option> */}
                                                <option value="0">Required</option>
                                                <option value="1">Absent</option>

                                            </select>
                                        </div>
                                        <div className="form-group col-sm-3">
                                            <div className="list-header1">
                                                Min/Max length
                                            </div>
                                            <div className="row" style={{ marginLeft: "16px" }}>
                                                <input type="text" className="form-control" onChange={(event) => this.onChangeName(event, 'Min_Length')} style={{ width: "100px" }} />
                                                <input type="text" className="form-control" onChange={(event) => this.onChangeName(event, 'Maxlength')} style={{ width: "100px" }} />
                                            </div>
                                        </div>

                                        <div className="form-group col-sm-3">
                                            <div className="list-header1">Operator</div>
                                            <select className="form-control list-header1" onChange={(event) => this.ChangeText(event, 'OperatorId')}>
                                                <option value=""></option>
                                                {this.getOperatorMaster()}
                                            </select>
                                        </div>

                                        {
                                            this.state.valuerange == 1 ?

                                                <div className="form-group col-sm-3">
                                                    <div className="list-header1">Min/Max Value</div>
                                                    <div className="row" style={{ marginLeft: "16px" }}>
                                                        <input type="text" className="form-control" onChange={(event) => this.onChangeName(event, 'MinValue')} style={{ width: "100px" }} />
                                                        <input type="text" className="form-control" onChange={(event) => this.onChangeName(event, 'MaxValue')} style={{ width: "100px" }} />
                                                    </div>
                                                </div> :
                                                <div className="form-group col-sm-3">
                                                    <div className="list-header1">Value</div>
                                                    <input type="text" className="form-control list-header1" onChange={(event) => this.onChangeName(event, 'Value')} />
                                                </div>
                                        }
                                    </div>
                                </div>

                                <div className="form-group col-sm-3" style={{ padding: '0' }}>
                                    <div className="list-header1 clickable" onClick={() => this.setState({ compareDetailsFlag: !this.state.compareDetailsFlag })} style={{ color: '#139DC9', fontWeight: '800', fontSize: '14px' }}>AND / OR</div>
                                    {/* <select className="form-control list-header" onChange={this.SegmentCompYesno} style={{ marginLeft: "10px" }} >
                                                    <option value=""></option>

                                                    <option value={item}> Yes</option>
                                                    <option value={item}>No</option>

                                                </select> */}
                                </div>

                                {/* {

                                        segementcheck == "Yes" + item
                                            ?
                                            <div className="form-group col-sm-3">
                                                <label className="list-header">
                                                    Loop Id
                                        </label>
                                                <select className="form-control list-header" style={{ marginLeft: "10px" }} id={item + 'loop1'} onChange={(event) => { this.onOptionSelect(event, item, 4) }}>
                                                    <option value=""></option>
                                                    {options[item].loopidArray1 ? this.renderOptions(options[item].loopidArray1, 1) : null}
                                                </select>
                                            </div> : ""
                                    }
                                    {
                                        segementcheck == "Yes" + item
                                            ?
                                            <div className="form-group col-sm-3">
                                                <label className="list-header">
                                                    Segment
                                        </label>
                                                <select className="form-control list-header" style={{ marginLeft: "10px" }} id={item + 'segment1'} onChange={(event) => { this.onOptionSelect(event, item, 5, options[item].selected_loopid) }}>
                                                    <option value=""></option>
                                                    {options[item].segmentArray1 ? this.renderOptions(options[item].segmentArray1, 2) : null}
                                                </select>
                                            </div> : ""}

                                    {
                                        segementcheck == "Yes" + item
                                            ? <div className="form-group col-sm-3">
                                                <label className="list-header">
                                                    Field
                                        </label>
                                                <select className="form-control list-header" style={{ marginLeft: "10px" }} onChange={(e) => this.ChangeVal(e, 'FieldId1')}>
                                                    <option value=""></option>
                                                    {options[item].elementArray1 ? this.renderOptions(options[item].elementArray1, 3) : null}
                                                </select>
                                            </div> : ""}

                                    {
                                        item == 0
                                            ?
                                            '' : <div className="form-group col"></div>
                                    } */}
                                {this.state.compareDetailsFlag ?
                                    <div>
                                        <div className="row">
                                            <div className="form-group col-sm-3">
                                                <div className="list-header1">
                                                    Main Loop Id
                                 </div>
                                                <select className="form-control list-header1" id={item + 'mainLoop2'} onChange={(event) => { this.onOptionSelect(event, item, 6) }}>
                                                    <option value=""></option>
                                                    {options[item].loopidArray ? this.renderOptions(options[item].loopidArray, 0) : null}
                                                </select>
                                            </div>

                                            <div className="form-group col-sm-3">
                                                <div className="list-header1">
                                                    Sub Loop Id
                                 </div>
                                                <select className="form-control list-header1" id={item + 'subLoop2'} onChange={(event) => { this.onOptionSelect(event, item, 4,options[item].selected_mainloopid) }}>
                                                    <option value=""></option>
                                                    {options[item].subLoopidArray1 ? this.renderOptions(options[item].subLoopidArray1, 1) : null}
                                                    {/* {options[item].loopidArray1 ? this.renderOptions(options[item].loopidArray1, 1) : null} */}
                                                </select>
                                            </div>

                                            <div className="form-group col-sm-3">
                                                <div className="list-header1">
                                                    Segment
                                 </div>
                                                <select className="form-control list-header1" id={item + 'segment1'} onChange={(event) => { this.onOptionSelect(event, item, 5, options[item].selected_loopid, options[item].selected_mainloopid) }}>
                                                    <option value=""></option>
                                                    {options[item].segmentArray1 ? this.renderOptions(options[item].segmentArray1, 2) : null}
                                                </select>
                                            </div>

                                            <div className="form-group col-sm-3">
                                                <div className="list-header1">
                                                    Field
                                 </div>
                                                <select className="form-control list-header1" onChange={(event) => this.ChangeVal(event, 'FieldId1')}>
                                                    <option value=""></option>
                                                    {options[item].elementArray1 ? this.renderOptions(options[item].elementArray1, 3) : null}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row">

                                            <div className="form-group col-sm-3">
                                                <div className="list-header1">Usage Req.</div>
                                                <select className="form-control list-header1" onChange={(event) => this.ChangeVal(event, 'is_mandatory2')}>
                                                    {/* <option value=""></option> */}
                                                    <option value="0">Required</option>
                                                    <option value="1">Absent</option>

                                                </select>
                                            </div>
                                            <div className="form-group col-sm-3">
                                                <div className="list-header1">
                                                    Min/Max length
                                     </div>
                                                <div className="row" style={{ marginLeft: "16px" }}>
                                                    <input type="text" className="form-control" onChange={(event) => this.onChangeName(event, 'Min_Length2')} style={{ width: "100px" }} />
                                                    <input type="text" className="form-control" onChange={(event) => this.onChangeName(event, 'max_length2')} style={{ width: "100px" }} />
                                                </div>
                                            </div>

                                            <div className="form-group col-sm-3">
                                                <div className="list-header1">Operator</div>
                                                <select className="form-control list-header1" onChange={(event) => this.ChangeText(event, 'Oprator_Id2')}>
                                                    <option value=""></option>
                                                    {this.getOperatorMaster()}
                                                </select>
                                            </div>

                                            {
                                                this.state.valuerange == 1 ?

                                                    <div className="form-group col-sm-3">
                                                        <div className="list-header1">Min/Max Value</div>
                                                        <div className="row" style={{ marginLeft: "16px" }}>
                                                            <input type="text" className="form-control" onChange={(event) => this.onChangeName(event, 'Min_Value2')} style={{ width: "100px" }} />
                                                            <input type="text" className="form-control" onChange={(event) => this.onChangeName(event, 'Max_Value2')} style={{ width: "100px" }} />
                                                        </div>
                                                    </div> :
                                                    <div className="form-group col-sm-3">
                                                        <div className="list-header1">Value</div>
                                                        <input type="text" className="list-header1 form-control" onChange={(event) => this.onChangeName(event, 'Value2')} />
                                                    </div>
                                            }
                                        </div>
                                    </div>

                                    : ''}
                                <div className="row">
                                <div className="form-group col-sm-10"></div>
                                <div className="form-group col-sm-1">
                                    <button type="submit" className="btn light_blue" onClick={this.clicked}>Save</button>
                                </div>
                                </div>

                            </div>
                        </div>
                        {/* {this.renderList()} */}
                    </div>
               
            )
        })

        return (
            row
        )
    }

    // operation(isOr) {
    //     let array = this.state.operation
    //     array.push(isOr ? 2 : 1)

    //     this.setState({
    //         count: ++this.state.count,
    //         operation: array
    //     })

    //     setTimeout(() => {
    //         this.getData('{loopid(flag:"c" transaction:' + '"' + this.state.transaction + '"' + ') { loopid }}', 1, array.length)
    //     }, 50);
    // }

    // renderAddView(iter) {
    //     process.env.NODE_ENV == 'development' && console.log("this is iter " + JSON.stringify(this.state.operation), ' askjdf : ', iter)
    //     return (
    //         <div className="pull-left" style={{ margin: 12 }}>
    //             {
    //                 iter == 1 ? <a href={"#"} style={{ color: "#6AA2B8" }}>AND</a> :
    //                     iter == 2 ? <a href={"#"} style={{ color: "#6AA2B8" }}>OR</a> :
    //                         <div>
    //                             <a href={"#"} style={{ color: "#6AA2B8", fontWeight: "bold" }} onClick={() => { this.operation() }}>AND</a> /  <a href={"#"} onClick={() => { this.operation(1) }} style={{ color: "#6AA2B8", fontWeight: "bold" }}>OR</a>
    //                         </div>
    //             }
    //         </div>
    //     )
    // }

    onSelect(event) {

        this.setState({
            transaction: event.target.options[event.target.selectedIndex].text
        })

        setTimeout(() => {
            this.getData('{loopid(flag:"c" transaction:' + '"' + this.state.transaction + '"' + ') { loopid }}', 1, 0)
        }, 50);
    }


    clicked() {
        let OperatorId = this.state.OperatorId != '' ? this.state.OperatorId : 0;
        let Oprator_Id2 = this.state.Oprator_Id2 != '' ? this.state.Oprator_Id2 : 0;
        let is_mandatory2 = this.state.is_mandatory2 == "Required" ? true : false
        let is_mandatory = this.state.is_mandatory  == "Required" ? true : false

        var query = 'mutation{' +
            'Save_ConfigureCustomEdits(ID : 0 ' +
            'State  :"' + this.state.State + '" ' +
            'TransactionID  : "'+ this.state.transactionSelect+'" ' +
            'Trading_Partner  : "AVAILITY" ' +
            'RuleName  : "' + this.state.RuleName + '" ' +
            'Rule_Desc  :"' + this.state.Rule_Desc + '" ' +
            'Validation_Level  : "' + this.state.Validationlevel + '" ' +
            'Loop_ID  :"' + this.state.LoopID2 + '" ' +
            'Segment :"' + this.state.SegmentId + '" ' +
            'Field : "' + this.state.FieldId + '" ' +
            'is_mandatory : '+is_mandatory + ' '+
            'max_length  :"' + this.state.Maxlength + '" ' +
            'is_segcompare  :true ' +
            'Loop_ID_2  :"' + this.state.LoopID1 + '" ' +
            'Segment_2  : "' + this.state.SegmentId1 + '" ' +
            'Field_2  : "' + this.state.FieldId1 + '" ' +
            'Oprator_Id  :' + OperatorId + '  ' +
            'Min_Value  : "' + this.state.MinValue + '" ' +
            'Max_Value  : "' + this.state.MaxValue + '" ' +
            'Value  : "' + this.state.Value + '" ' +
            'Error_Type : "' + this.state.ErrorType + '" ' +
            'Error_Description  :"' + this.state.ErrorDescription + '" ' +
            'Severity  : "' + this.state.Severity + '" ' +
            'is_active  : true ' +
            'is_condition  : true ' +
            'Min_Length  :"' + this.state.Min_Length + '" ' +
            `Oprator_Id2: ${Oprator_Id2}
             Min_Value2: "${this.state.Min_Value2}"
             Max_Value2: "${this.state.Max_Value2}"
             Value2: "${this.state.Value2}"
             is_mandatory2:${is_mandatory2}
             max_length2: "${this.state.max_length2}"
             Min_Length2: "${this.state.Min_Length2}"
             mainloop: "${this.state.LoopID}"
             RecType:"Inbound"
             mainloop2: "${this.state.LoopID3}"` +

            'Condition : "")' +

            '}'
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) };
        fetch(Urls.CustomConfiguration, {
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
            .then(data =>
                alert(data.data.Save_ConfigureCustomEdits),
                setTimeout(() => {
                    window.location.reload();
                }, 2000)

            ).catch(error => {
                process.env.NODE_ENV == 'development' && console.log(error)
            })



    }
    renderList() {
        let row = []
        const data = this.state.customList;

        data.forEach((d) => {
            row.push(
                <tr>
                    <td>{d.loopid}</td>
                    <td>{d.segment}</td>
                    <td>{d.element}</td>
                    <td>{d.condition}</td>
                    <td>{d.value}</td>
                    <td>{d.severity}</td>
                    <td className="list-item-style"><input type="checkbox" onChange={(e) => { this.changeCheckbox(e) }} value={d.seqid} /></td>
                </tr>
            )
        });

        return (
            <div>

                <table className="table table-bordered claim-list" align="center" style={{ width: '95%' }}>
                    {/* {this.state.customList && this.state.customList.length > 0 ? this.renderTableHeader() : null} */}
                    <tbody>
                        {row}
                    </tbody>
                </table>
            </div>

        );
    }

    getviewdetails() {
        // let query = `{
              
        //            Rules(transaction:"`+ this.state.transaction + `") {
        //                seqid
        //                loopid
        //                segment
        //                element
        //                opert
        //                value
        //                flag
        //                severity
        //                condition
        //                Ignore
        //              }
                   
        //        }`

        // process.env.NODE_ENV == 'development' && console.log('dcdvbnvbnvdskjdg ', query)

        // fetch(Urls.CustomConfiguration, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Accept': 'application/json',
        //     },
        //     body: JSON.stringify({ query: query })
        // })
        //     .then(res => res.json())
        //     .then(res => {
        //         let array = []
        //         let summary = []
        //         let data = res.data
        //         let iterator = data.Rules
        //         iterator.forEach(item => {
        //             array.push({
        //                 loopid: item.loopid,
        //                 segment: item.segment,
        //                 element: item.element,
        //                 condition: item.condition,
        //                 value: item.value,
        //                 severity: item.severity,
        //                 Ignore: item.Ignore,
        //                 seqid: item.seqid
        //             })
        //         })

        //         this.setState({
        //             customList: array,
        //             // tradingpartner: res.data.Trading_PartnerList
        //         })
        //     })
        //     .catch(err => {
        //         process.env.NODE_ENV == 'development' && console.log(err)
        //     })
    }

    getoptions() {
        let row = []
        this.state.tradingpartner.forEach(element => {
            row.push(<option value={element.Trading_Partner_Name}>{element.Trading_Partner_Name}</option>)
        })
        return row
    }
    getOperatorMaster() {
        let row = []
        this.state.OperatorMaster.forEach(element => {
            row.push(<option value={element.ID}>{element.Operator}</option>)
        })
        return row
    }

    ChangeVal1(event, key){
        this.setState({
            [key]: event.target.options[event.target.selectedIndex].text,
        })
        setTimeout(() => {
            this.getData( `{SP_GetMainloop(TransactionType:"${this.state.transactionSelect}"){Mainloop}}`, 0, 0)
        }, 50);
    }
    ChangeVal(event, key) {

        this.setState({
            [key]: event.target.options[event.target.selectedIndex].text,
        })
        if (key == "OperatorId" || key == "FieldId" || key == "FieldId1" || key=="TradingPartner") {
            this.setState({
                [key]: event.target.options[event.target.selectedIndex].value,
            })
        }
    }
    ChangeText(event, key) {

        this.setState({
            [key]: event.target.options[event.target.selectedIndex].value,
        })
        if (event.target.options[event.target.selectedIndex].text == "Value Range") {
            this.setState({
                valuerange: 1,
            })
        } else {
            this.setState({
                valuerange: 0,
            })
        }
    }

    onChangeName(event, key) {

        this.setState({
            [key]: event.target.value
        });
    }

    renderTableHeader() {
        return (
            <tr className="table-head">
                {/* <td className="table-head-text">State</td>
                <td className="table-head-text">Transaction</td>
                <td className="table-head-text">Trading Partner</td> */}
                <td className="table-head-text">Rule Description</td>
                <td className="table-head-text">Validation</td>
                <td className="table-head-text">Error Type</td>
                <td className="table-head-text">Error Description</td>
                <td className="table-head-text">Severity</td>
                <td style={{ width: "10px" }}></td>
                <td style={{ width: "10px" }}></td>
            </tr>
        )
    }

    getTableCustomEdits(){
        // let query = `{
            
        //         GetCustomEdits(page: ${this.state.page}){
        //           ID,
        //           RecCount,
        //           Validation_Level,
        //           RuleName,
        //           Rule_Desc,
        //           Error_Type,
        //           Error_Description,
        //           Severity
        //         }

        // }`
        // if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        // fetch(Urls.CustomConfiguration, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Accept': 'application/json',
        //     },
        //     body: JSON.stringify({ query: query })
        // })
        //     .then(res => res.json())
        //     .then(res => {
        //         let data = res.data
        //         let count1 = 1
        //         if (data && data.GetCustomEdits.length > 0) {

        //             count1 = Math.floor(data.GetCustomEdits[0].RecCount / 10)
        //             if (data.GetCustomEdits[0].RecCount % 10 > 0) {
        //                 count1 = count1 + 1
        //             }
        //         }
        //         this.setState({
        //             GetCustomEdits: res.data.GetCustomEdits,
        //             page: count1
        //         })
        //     })
        //     .catch(err => {
        //         process.env.NODE_ENV == 'development' && console.log(err)
        //     })
    }
    
    handlePageClick(data) {
        let page = data.selected + 1
        this.setState({
            page: page,

        })

        setTimeout(() => {
            this.getTableCustomEdits()
        }, 50);
    }
    renderTableList() {
        let row = []
        const data = this.state.GetCustomEdits && this.state.GetCustomEdits.length > 0 ? this.state.GetCustomEdits: [];
    
        data.forEach((d) => {
            row.push(
                <tr>
                    <td>{d.Rule_Desc}</td>
                    <td>{d.Validation_Level}</td>
                    <td>{d.Error_Type}</td>
                    <td>{d.Error_Description}</td>
                    <td>{d.Severity}</td>
                    <td className="clickable"><img src={require('../../components/Images/pencil.png')} onClick={this.displaydata} data-value={d.ID} style={{ width: '14px', marginLeft: '10px' }}></img></td>
                    <td className="clickable"><img src={require('../../components/Images/trash.png')} onClick={this.Inactive} data-value={d.ID} style={{ width: '14px', marginLeft: '10px' }}></img></td>
                </tr>
            )
        });

        return (
            <div>
                {/* <div className="panel-heading collapsible" data-toggle="collapse" style={{backgroundColor:"#139DC9" ,}}  >
                <span className="panel-title" style={{color:"white" ,fontSize:"12px"}}>Trading Partner View </span>
            </div> */}
                {/* <div className="panel-collapse content">
                <div className="panel-body">
            <div> */}
                <table className="table table-bordered claim-list" style={{ width: '100%' }}>
                    {this.state.GetCustomEdits && this.state.GetCustomEdits.length > 0 ? this.renderTableHeader() : null}
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
                    pageCount={this.state.page}
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

    render() {
        return (
                <div>
                    <h5 className="headerText">Configure Custom Edits</h5>
                    {/* {this.renderTopbar()} */}
                    {this.renderView()}
                   
                        {/* {this.renderTableList()} */}
                    
                </div>
        );
    }
}