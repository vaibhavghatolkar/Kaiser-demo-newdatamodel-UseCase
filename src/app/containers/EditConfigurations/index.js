import React from 'react';
import '../TradingPartnerConfiguration/style.css';
import { Topbar } from '../../components/Topbar';
import Urls from '../../../helpers/Urls';
import ReactPaginate from 'react-paginate';
const $ = window.$;

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
            is_mandatory2: '',
            max_length2: '',
            Min_Length2: '',
            mainloop: '',
            mainloop2: '',
            TransactionMasterList:[],
            transactionSelect:'837P',
            GetCustomEdits:[]

        };

        this.onChange = this.onChange.bind(this);
        this.operation = this.operation.bind(this)
        // this.renderView = this.renderView.bind(this)
        this.clicked = this.clicked.bind(this)
        this.getData = this.getData.bind(this)
        this.onSelect = this.onSelect.bind(this)
        this.getTransdata = this.getTransdata.bind(this)
        this.SegmentCompYesno = this.SegmentCompYesno.bind(this)
        this.getTableCustomEdits = this.getTableCustomEdits.bind(this)
        this.ChangeVal1 = this.ChangeVal1.bind(this)
    }

    componentDidMount() {
        // $(document).ready(function(){
        //     $('button').click(function(){
        //         $('.alert').show()
        //     }) 
        // });

        this.getviewdetails()
        this.gettradingpatner()
        this.getTransdata()
        this.getTableCustomEdits()
        this.operator()
        this.getData('{loopid(flag:"c" transaction:' + '"' + this.state.transactionSelect + '"' + ') { loopid }}', 1, 0)
    }

    operator() {

        let query = `{
            OperatorMaster   { 
                Operator
                ID 
            }
             
        }`
        fetch(Urls.tradingPartner, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                console.log('Data : ', res)
                this.setState({
                    OperatorMaster: res.data.OperatorMaster,
                })
            })
            .catch(err => {
                console.log(err)
            })

    }

    getTransdata() {
        let query = `{      
            TransactionMaster  {                  
                Trans_Code
                Transaction_Type
            }           
        }`

        console.log(query)
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
                console.log(err)
            })
    }

    gettradingpatner() {

        let query = `{
            Trading_PartnerList (Transaction:"TradingPartner") { 
                 
                Trading_Partner_Name 
            }
        }`
        console.log(query);
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
                console.log('Data : ', res)
                this.setState({
                    tradingpartner: res.data.Trading_PartnerList
                })
            })
            .catch(err => {
                console.log(err)
            })




    }

    getData(query, flag, iter) {

        fetch(Urls.tradingPartner, {
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
                if (flag == 1) {
                    options[iter] = {
                        loopidArray: r.data.loopid,
                        loopidArray1: r.data.loopid
                    }
                } else if (flag == 2) {
                    options[iter]["segmentArray"] = r.data.segment
                } else if (flag == 3) {
                    options[iter]["elementArray"] = r.data.element
                }
                else if (flag == 4) {
                    options[iter]["segmentArray1"] = r.data.segment
                }
                else if (flag == 5) {
                    options[iter]["elementArray1"] = r.data.element
                }

                this.setState({
                    options: options
                })
            })
            .then(data => console.log('data returned:', data));
    }

    onChange(e) {
        var files = e.target.files;
        console.log(files);
        var filesArr = Array.prototype.slice.call(files);
        console.log(filesArr);
        this.setState({ files: [...this.state.files, ...filesArr] });
    }

    displayFile() {
        this.setState({ files: this.state.files });
    }
    gettrans() {

        let row = []
        this.state.TransactionMasterList.forEach(element => {
            row.push(<option selected={this.state.Transaction_Type == element.Trans_Code ? element.Trans_Code : ''} value={element.Trans_Code}>{element.Trans_Code}</option>)
        })
        return row

    }

    onOptionSelect(value, iter, flag, loopid) {
        if (!value) {
            return
        }

        let query = ''
        let inner_flag = 1

        if (flag == 1) {

            query = '{segment(flag:"c" transaction:' + '"' + this.state.transactionSelect + '"' + ' loopid:' + '"' + value + '"' + ') { segment }}'
            let options = this.state.options
            options[iter]["selected_loopid"] = value

            this.setState({
                options: options,
                LoopID: value
            })
            inner_flag = 2
        }
        else if (flag == 2) {
            query = '{element(flag:"c" transaction:' + '"' + this.state.transactionSelect + '"' + ' loopid:' + '"' + loopid + '"' + ' segment:' + '"' + value + '"' + ') { element }}'
            inner_flag = 3
            this.setState({
                SegmentId: value
            })





        }
        else if (flag == 4) {

            query = '{segment(flag:"c" transaction:' + '"' + this.state.transactionSelect + '"' + ' loopid:' + '"' + value + '"' + ') { segment }}'
            let options = this.state.options
            options[iter]["selected_loopid"] = value

            this.setState({
                options: options,
                LoopID1: value
            })
            inner_flag = 4
        }

        else if (flag == 5) {
            query = '{element(flag:"c" transaction:' + '"' + this.state.transactionSelect + '"' + ' loopid:' + '"' + loopid + '"' + ' segment:' + '"' + value + '"' + ') { element }}'
            inner_flag = 5
            this.setState({
                SegmentId1: value
            })





        }
        setTimeout(() => {
            this.getData(query, inner_flag, iter)
        }, 50);
    }

    renderOptions(array, flag) {
        let row = []
        array.forEach(element => {
            row.push(<option value={flag == 1 ? element.loopid : flag == 2 ? element.segment : element.element}>{flag == 1 ? element.loopid : flag == 2 ? element.segment : element.element}</option>)
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

    renderView() {
        let row = []
        let options = this.state.options
        let SegmentItem = this.state.SegmentItem;
        let segementcheck = this.state.SegmentCompYesno + this.state.SegmentItem;

        Object.keys(options).map(item => {

            row.push(

                <div className="panel-group"   >
                    <div className="panel-heading collapsible" style={{ background: "#139DC9" }}>
                        <span className="panel-title" style={{ color: "white" }}>Custom Details </span>
                    </div>
                    <div id="CustomDetails" className="panel-collapse content">
                        <br></br>
                        <div className="panel panel-default">
                            <div id="ISAIdentificationOptions">
                                <div className="panel-body">
                                    <div className="row">
                                        <div className="form-group col-3">
                                            <div className="list-header">State</div>
                                            <select className="form-control list-header" id="state" onChange={(e) => this.ChangeVal(e, 'state')}>
                                                <option value="">State</option>
                                                <option selected="selected" value="1">California</option>
                                                <option value="2">Michigan</option>
                                                <option value="3">Florida</option>
                                                <option value="4">New York</option>
                                                <option value="5">Idaho</option>
                                                <option value="6">Ohio</option>
                                                <option value="7">Illinois</option>
                                                <option value="8">Texas</option>
                                                <option value="9">Mississippi</option>
                                                <option value="10">South Carolina</option>
                                                <option value="11">New Mexico</option>
                                                <option value="12">Puerto Rico</option>
                                                <option value="13">Washington</option>
                                                <option value="14">Utah</option>
                                                <option value="15">Wisconsin</option>
                                            </select>
                                        </div>

                                        <div className="form-group col-3">
                                            <div className="list-header">Select Transaction</div>
                                            <select className="form-control list-header" id="option"
                                               onChange={(e) => this.ChangeVal1(e, 'transactionSelect')}
                                            >
                                                {this.gettrans()}
                                            </select>
                                        </div>

                                        <div className="form-group col-3">
                                            <div className="list-header">Trading partner </div>
                                            <select className="form-control list-header" id="TradingPartner" onChange={(e) => this.ChangeVal(e, 'TradingPartner')} >
                                                <option value="select">Trading partner</option>
                                                <option selected="selected">AVAILITY</option>
                                            </select>
                                        </div>
                                        <div className="form-group col-sm-3">
                                            <label className="list-header">
                                                Description
                                        </label>
                                            <textarea type="text" className="list-header form-control" value={this.state.Rule_Desc == null ? '' : this.state.Rule_Desc} onChange={(e) => this.onChangeName(e, 'Rule_Desc')} />
                                        </div>
                                    </div>
                                    <div className="row">
                                    
                                        <div className="form-group col-sm-3">
                                            <label className="list-header">
                                                Validation Level
                                        </label>
                                            <select className="form-control list-header" style={{ marginLeft: "10px" }} onChange={(e) => this.ChangeVal(e, 'Validationlevel')}>
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
                                            <label className="list-header">Severity</label>
                                            <select className="form-control list-header" style={{ marginLeft: "10px" }} onChange={(e) => this.ChangeVal(e, 'Severity')}>
                                                <option value=""></option>
                                                <option value="0">Fail</option>
                                                <option value="1">Warning</option>
                                                <option value="2">Skip</option>
                                            </select>
                                        </div>
                                    
                                        <div className="form-group col-sm-3">
                                            <label className="list-header">Error Type</label>
                                            <select className="form-control list-header" style={{ marginLeft: "10px" }} onChange={(e) => this.ChangeVal(e, 'ErrorType')}>
                                                <option value=""></option>
                                                <option value="0">TA1</option>
                                                <option value="1">999</option>

                                            </select>
                                        </div>
                                        <div className="form-group col-sm-3">
                                            <label className="list-header">
                                                Error Description
                                        </label>
                                            <textarea type="text" className="list-header form-control" onChange={(e) => this.onChangeName(e, 'ErrorDescription')} />
                                        </div>
                                        </div>
                                    

                                    <div className="row">
                                        <div className="form-group col-sm-3">
                                            <label className="list-header">
                                                Main Loop Id
                                        </label>
                                            <select className="form-control list-header" style={{ marginLeft: "10px" }} id={item + 'mainLoop'} onChange={() => { this.onOptionSelect(document.getElementById(item + 'mainLoop').value, item, 1) }}>
                                                <option value=""></option>
                                                {/* {options[item].loopidArray ? this.renderOptions(options[item].loopidArray, 1) : null} */}
                                            </select>
                                        </div>

                                        <div className="form-group col-sm-3">
                                            <label className="list-header">
                                                Sub Loop Id
                                        </label>
                                            <select className="form-control list-header" style={{ marginLeft: "10px" }} id={item + 'loop'} onChange={() => { this.onOptionSelect(document.getElementById(item + 'loop').value, item, 1) }}>
                                                <option value=""></option>
                                                {options[item].loopidArray ? this.renderOptions(options[item].loopidArray, 1) : null}
                                            </select>
                                        </div>

                                        <div className="form-group col-sm-3">
                                            <label className="list-header">
                                                Segment
                                        </label>
                                            <select className="form-control list-header" style={{ marginLeft: "10px" }} id={item + 'segment'} onChange={() => { this.onOptionSelect(document.getElementById(item + 'segment').value, item, 2, options[item].selected_loopid) }}>
                                                <option value=""></option>
                                                {options[item].segmentArray ? this.renderOptions(options[item].segmentArray, 2) : null}
                                            </select>
                                        </div>

                                        <div className="form-group col-sm-3">
                                            <label className="list-header">
                                                Field
                                        </label>
                                            <select className="form-control list-header" style={{ marginLeft: "10px" }} onChange={(e) => this.ChangeVal(e, 'FieldId')}>
                                                <option value=""></option>
                                                {options[item].elementArray ? this.renderOptions(options[item].elementArray, 3) : null}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row">

                                        <div className="form-group col-sm-3">
                                            <label className="list-header">Usage Req.</label>
                                            <select className="form-control list-header" style={{ marginLeft: "10px" }} onChange={(e) => this.ChangeVal(e, 'Usage_Req')}>
                                                <option value=""></option>
                                                <option value="0">Required</option>
                                                <option value="1">Absent</option>

                                            </select>
                                        </div>
                                        <div className="form-group col-sm-3">
                                            <label className="list-header">
                                                Min/Max length
                                            </label>
                                            <div className="row" style={{ marginLeft: "12px" }}>
                                                <input type="text" className="form-control" onChange={(e) => this.onChangeName(e, 'Maxlength')} style={{ width: "100px" }} />
                                                <input type="text" className="form-control" onChange={(e) => this.onChangeName(e, 'Min_Length')} style={{ width: "100px" }} />
                                            </div>
                                        </div>

                                        <div className="form-group col-sm-3">
                                            <label className="list-header">Operator</label>
                                            <select className="form-control list-header" style={{ marginLeft: "10px" }} onChange={(e) => this.ChangeText(e, 'OperatorId')}>
                                                <option value=""></option>
                                                {this.getOperatorMaster()}
                                            </select>
                                        </div>

                                        {
                                            this.state.valuerange == 1 ?

                                                <div className="form-group col-sm-3">
                                                    <label className="list-header">Min/Max Value</label>
                                                    <div className="row" style={{ marginLeft: "12px" }}>
                                                        <input type="text" className="form-control" onChange={(e) => this.onChangeName(e, 'MinValue')} style={{ width: "100px" }} />
                                                        <input type="text" className="form-control" onChange={(e) => this.onChangeName(e, 'MaxValue')} style={{ width: "100px" }} />
                                                    </div>
                                                </div> :
                                                <div className="form-group col-sm-3" style={{ marginLeft: '-5px' }}>
                                                    <label className="list-header">Value</label>
                                                    <input type="text" className="form-control list-header" onChange={(e) => this.onChangeName(e, 'Value')} />
                                                </div>
                                        }
                                    </div>
                                </div>

                                <div className="form-group col-sm-3" style={{ padding: '0' }}>
                                    <label className="list-header clickable" onClick={() => this.setState({ compareDetailsFlag: !this.state.compareDetailsFlag })} style={{ color: '#139DC9', fontWeight: '700' }}>Segment Compare</label>
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
                                                <select className="form-control list-header" style={{ marginLeft: "10px" }} id={item + 'loop1'} onChange={() => { this.onOptionSelect(document.getElementById(item + 'loop1').value, item, 4) }}>
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
                                                <select className="form-control list-header" style={{ marginLeft: "10px" }} id={item + 'segment1'} onChange={() => { this.onOptionSelect(document.getElementById(item + 'segment1').value, item, 5, options[item].selected_loopid) }}>
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
                                                <label className="list-header">
                                                    Main Loop Id
                                 </label>
                                                <select className="form-control list-header" style={{ marginLeft: "10px" }} id={item + 'loop2'} onChange={() => { this.onOptionSelect(document.getElementById(item + 'loop2').value, item, 1) }}>
                                                    <option value=""></option>
                                                    {/* {options[item].loopidArray ? this.renderOptions(options[item].loopidArray, 1) : null} */}
                                                </select>
                                            </div>

                                            <div className="form-group col-sm-3">
                                                <label className="list-header">
                                                    Sub Loop Id
                                 </label>
                                                <select className="form-control list-header" style={{ marginLeft: "10px" }} id={item + 'loop1'} onChange={() => { this.onOptionSelect(document.getElementById(item + 'loop1').value, item, 4) }}>
                                                    <option value=""></option>
                                                    {options[item].loopidArray1 ? this.renderOptions(options[item].loopidArray1, 1) : null}
                                                </select>
                                            </div>

                                            <div className="form-group col-sm-3">
                                                <label className="list-header">
                                                    Segment
                                 </label>
                                                <select className="form-control list-header" style={{ marginLeft: "10px" }} id={item + 'segment1'} onChange={() => { this.onOptionSelect(document.getElementById(item + 'segment1').value, item, 5, options[item].selected_loopid) }}>
                                                    <option value=""></option>
                                                    {options[item].segmentArray1 ? this.renderOptions(options[item].segmentArray1, 2) : null}
                                                </select>
                                            </div>

                                            <div className="form-group col-sm-3">
                                                <label className="list-header">
                                                    Field
                                 </label>
                                                <select className="form-control list-header" style={{ marginLeft: "10px" }} onChange={(e) => this.ChangeVal(e, 'FieldId1')}>
                                                    <option value=""></option>
                                                    {options[item].elementArray1 ? this.renderOptions(options[item].elementArray1, 3) : null}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row">

                                            <div className="form-group col-sm-3">
                                                <label className="list-header">Usage Req.</label>
                                                <select className="form-control list-header" style={{ marginLeft: "10px" }} onChange={(e) => this.ChangeVal(e, 'is_mandatory2')}>
                                                    <option value=""></option>
                                                    <option value="0">Required</option>
                                                    <option value="1">Absent</option>

                                                </select>
                                            </div>
                                            <div className="form-group col-sm-3">
                                                <label className="list-header">
                                                    Min/Max length
                                     </label>
                                                <div className="row" style={{ marginLeft: "12px" }}>
                                                    <input type="text" className="form-control" onChange={(e) => this.onChangeName(e, 'Min_Length2')} style={{ width: "100px" }} />
                                                    <input type="text" className="form-control" onChange={(e) => this.onChangeName(e, 'max_length2')} style={{ width: "100px" }} />
                                                </div>
                                            </div>

                                            <div className="form-group col-sm-3">
                                                <label className="list-header">Operator</label>
                                                <select className="form-control list-header" style={{ marginLeft: "10px" }} onChange={(e) => this.ChangeText(e, 'Oprator_Id2')}>
                                                    <option value=""></option>
                                                    {this.getOperatorMaster()}
                                                </select>
                                            </div>

                                            {
                                                this.state.valuerange == 1 ?

                                                    <div className="form-group col-sm-3">
                                                        <label className="list-header">Min/Max Value</label>
                                                        <div className="row" style={{ marginLeft: "12px" }}>
                                                            <input type="text" className="form-control" onChange={(e) => this.onChangeName(e, 'Min_Value2')} style={{ width: "100px" }} />
                                                            <input type="text" className="form-control" onChange={(e) => this.onChangeName(e, 'Max_Value2')} style={{ width: "100px" }} />
                                                        </div>
                                                    </div> :
                                                    <div className="form-group col-sm-3" style={{ marginLeft: '-5px' }}>
                                                        <label className="list-header">Value</label>
                                                        <input type="text" className="list-header form-control" onChange={(e) => this.onChangeName(e, 'Value2')} />
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
                </div >
            )
        })

        return (
            row
        )
    }

    operation(isOr) {
        let array = this.state.operation
        array.push(isOr ? 2 : 1)

        this.setState({
            count: ++this.state.count,
            operation: array
        })

        setTimeout(() => {
            this.getData('{loopid(flag:"c" transaction:' + '"' + this.state.transaction + '"' + ') { loopid }}', 1, array.length)
        }, 50);
    }

    renderAddView(iter) {
        console.log("this is iter " + JSON.stringify(this.state.operation), ' askjdf : ', iter)
        return (
            <div className="pull-left" style={{ margin: 12 }}>
                {
                    iter == 1 ? <a href={"#"} style={{ color: "#6AA2B8" }}>AND</a> :
                        iter == 2 ? <a href={"#"} style={{ color: "#6AA2B8" }}>OR</a> :
                            <div>
                                <a href={"#"} style={{ color: "#6AA2B8", fontWeight: "bold" }} onClick={() => { this.operation() }}>AND</a> /  <a href={"#"} onClick={() => { this.operation(1) }} style={{ color: "#6AA2B8", fontWeight: "bold" }}>OR</a>
                            </div>
                }
            </div>
        )
    }

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

        var query = 'mutation{' +
            'SP_ConfigureCustomEdits(ID : 0 ' +
            'State  :"' + this.state.state + '" ' +
            'TransactionID  : "'+ this.state.transactionSelect+'" ' +
            'Trading_Partner  : "AVAILITY" ' +
            'RuleName  : "' + this.state.RuleName + '" ' +
            'Rule_Desc  :"' + this.state.Rule_Desc + '" ' +
            'Validation_Level  : "' + this.state.Validationlevel + '" ' +
            'Loop_ID  :"' + this.state.LoopID + '" ' +
            'Segment :"' + this.state.SegmentId + '" ' +
            'Field : "' + this.state.FieldId + '" ' +
            'is_mandatory : true   ' +
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
             mainloop: "${this.state.mainloop}"
             mainloop2: "${this.state.mainloop2}"` +

            'Condition : "")' +

            '}'
        console.log(query);
        fetch(Urls.base_url, {
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
                alert(data.data.SP_ConfigureCustomEdits),
                setTimeout(() => {
                    window.location.reload();
                }, 500)

            ).catch(error => {
                console.log(error)
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
        let query = `{
              
                   Rules(transaction:"`+ this.state.transaction + `") {
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

        console.log('dcdvbnvbnvdskjdg ', query)

        fetch(Urls.tradingPartner, {
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
                        condition: item.condition,
                        value: item.value,
                        severity: item.severity,
                        Ignore: item.Ignore,
                        seqid: item.seqid
                    })
                })

                this.setState({
                    customList: array,
                    // tradingpartner: res.data.Trading_PartnerList
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    getoptions() {
        let row = []
        this.state.tradingpartner.forEach(element => {
            row.push(<option value="">{element.Trading_Partner_Name}</option>)
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
        if (key == "OperatorId" || key == "FieldId" || key == "FieldId1") {
            this.setState({
                [key]: event.target.options[event.target.selectedIndex].value,
            })
        }
        setTimeout(() => {
            this.getData('{loopid(flag:"c" transaction:' + '"' + this.state.transactionSelect + '"' + ') { loopid }}', 1, 0)
        }, 50);
    }
    ChangeVal(event, key) {

        this.setState({
            [key]: event.target.options[event.target.selectedIndex].text,
        })
        if (key == "OperatorId" || key == "FieldId" || key == "FieldId1") {
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
        let query = `{
            
                GetCustomEdits(page: ${this.state.page}){
                  ID,
                  RecCount,
                  Validation_Level,
                  RuleName,
                  Rule_Desc,
                  Error_Type,
                  Error_Description,
                  Severity
                }

        }`
        console.log(query)
        fetch(Urls.customEdits, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                let data = res.data
                let count1 = 1
                if (data && data.GetCustomEdits.length > 0) {

                    count1 = Math.floor(data.GetCustomEdits[0].RecCount / 10)
                    if (data.GetCustomEdits[0].RecCount % 10 > 0) {
                        count1 = count1 + 1
                    }
                }
                this.setState({
                    GetCustomEdits: res.data.GetCustomEdits,
                    page: count1
                })
            })
            .catch(err => {
                console.log(err)
            })
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
        const data = this.state.GetCustomEdits;
    
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
                <table className="table table-bordered claim-list" align="center" style={{ width: '95%' }}>
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

    renderTopbar() {
        return (
            <div className="row">
                <div className="form-group col-3">
                    <div className="list-header-dashboard">State</div>
                    <select className="form-control list-header-dashboard" id="state" onChange={(e) => this.ChangeVal(e, 'state')}>
                        <option value="">State</option>
                        <option selected="selected" value="1">California</option>
                        <option value="2">Michigan</option>
                        <option value="3">Florida</option>
                        <option value="4">New York</option>
                        <option value="5">Idaho</option>
                        <option value="6">Ohio</option>
                        <option value="7">Illinois</option>
                        <option value="8">Texas</option>
                        <option value="9">Mississippi</option>
                        <option value="10">South Carolina</option>
                        <option value="11">New Mexico</option>
                        <option value="12">Puerto Rico</option>
                        <option value="13">Washington</option>
                        <option value="14">Utah</option>
                        <option value="15">Wisconsin</option>
                    </select>
                </div>

                <div className="form-group col-3">
                    <div className="list-header-dashboard">Select Transaction</div>
                    <select className="form-control list-header-dashboard" id="option"
                        onChange={(event) => {
                            this.onSelect(event, 'transactionSelect')
                        }}
                    >
                         {this.gettrans()}
                    </select>
                </div>

                <div className="form-group col-3">
                    <div className="list-header-dashboard">Trading partner </div>
                    <select className="form-control list-header-dashboard" id="TradingPartner" onChange={(e) => this.ChangeVal(e, 'TradingPartner')} >
                        <option value="select">Trading partner</option>
                        {this.getoptions()}
                    </select>
                </div>
                <div className="form-group col-sm-1">
                    <button type="submit" className="btn light_blue" onClick={this.clicked}>Save</button>
                </div>

            </div>
        )
    }
    render() {
        return (
            <div>
                <div className="container">
                    <label style={{ color: "#139DC9", fontWeight: "500", marginLeft: "2px", marginTop: "10px", fontSize: '20px' }}>Configure Custom Edits</label>
                    {/* {this.renderTopbar()} */}
                    {this.renderView()}
                   
                        {this.renderTableList()}
                    
                </div>

            </div>
        );
    }
}