import React from 'react';
import '../TradingPartnerConfiguration/style.css';
import { Topbar } from '../../components/Topbar';
import Urls from '../../../helpers/Urls';

const $ = window.$;

export class EditConfiguration extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            files: [],
            operation: [],
            options: {},
            transaction: 'Claims 837I Medicaid',
            count: 1
        };
        
        this.onChange = this.onChange.bind(this);
        this.operation = this.operation.bind(this)
        this.renderView = this.renderView.bind(this)
        this.clicked = this.clicked.bind(this)
        this.getData = this.getData.bind(this)
    }

    componentDidMount() {
        $(document).ready(function(){
            $('button').click(function(){
                $('.alert').show()
            }) 
        });
        this.getData('{loopid(flag:"c" transaction:'+'"'+ this.state.transaction + '"' + ') { loopid }}', 1, 0)
    }

    getData(query, flag, iter){
        fetch(Urls.base_url, {
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
                if(flag == 1){
                    options[iter] = {
                        loopidArray : r.data.loopid
                    }
                } else if(flag == 2){
                    options[iter]["segmentArray"] = r.data.segment
                } else if(flag == 3){
                    options[iter]["elementArray"] = r.data.element
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
        this.setState({ files: this.state.files});
    }

    onOptionSelect(value, iter, flag, loopid){
        if(!value){
            return
        }
        let query = ''
        let inner_flag = 1 
        if(flag == 1){
            query = '{segment(flag:"c" transaction:'+'"'+ this.state.transaction+'"'+' loopid:'+'"'+ value +'"' + ') { segment }}'
            let options = this.state.options 
            options[iter]["selected_loopid"] = value

            this.setState({
                options: options
            })
            inner_flag = 2
        } else if (flag == 2){
            query = '{element(flag:"c" transaction:'+'"'+ this.state.transaction+'"'+' loopid:'+'"'+ loopid+'"'+' segment:'+'"'+ value+'"'+') { element }}'
            inner_flag = 3
        }

        setTimeout(() => {
            this.getData(query, inner_flag, iter)
        }, 50);
    }

    renderOptions(array, flag){
        let row = []
        array.forEach(element => {
            row.push(<option value={flag == 1 ? element.loopid : flag == 2 ? element.segment : element.element}>{flag == 1 ? element.loopid : flag == 2 ? element.segment : element.element}</option>)
        });

        return row
    }

    renderView(){
        let row = []
        let options = this.state.options
        console.log('OPTIONS', JSON.stringify(options))

        Object.keys(options).map(item => {
            row.push(
                <div className="panel-group top-space">
                    <div className="panel panel-default">
                        <div id="ISAIdentificationOptions">
                            <div className="panel-body">
                                <div className="row">
                                    <div className="form-group col-sm-3">
                                        <label className="list-header">
                                            Loop Id
                                        </label>
                                        <select className="form-control list-header" style={{ marginLeft: "10px" }} id={item + 'loop'} onChange={() => {this.onOptionSelect(document.getElementById(item+'loop').value, item, 1)}}>
                                            <option value="">Select Loop Id</option>
                                            {options[item].loopidArray ? this.renderOptions(options[item].loopidArray, 1) : null}
                                        </select>
                                    </div>
    
                                    <div className="form-group col-sm-3">
                                        <label className="list-header">
                                            Segment
                                        </label>
                                        <select className="form-control list-header" style={{ marginLeft: "10px" }} id={item+'segment'} onChange={() => {this.onOptionSelect(document.getElementById(item+'segment').value, item, 2, options[item].selected_loopid)}}>
                                            <option value="">Select Segment</option>
                                            {options[item].segmentArray ? this.renderOptions(options[item].segmentArray, 2) : null}
                                        </select>
                                    </div>
    
                                    <div className="form-group col-sm-3">
                                        <label className="list-header">
                                            Element
                                        </label>
                                        <select className="form-control list-header" style={{ marginLeft: "10px" }} id="qualifier">
                                            <option value="">Select Element</option>
                                            {options[item].elementArray ? this.renderOptions(options[item].elementArray, 3) : null}
                                        </select>
                                    </div>
    
                                    <div className="form-group col-sm-3">
                                        <label className="list-header">
                                            Sub Element
                                        </label>
                                        <select className="form-control list-header" style={{ marginLeft: "10px" }} id="qualifier">
                                            <option value="0">Sub Element 0</option>
                                            <option value="1">Sub Element 1</option>
                                            <option value="2">Sub Element 2</option>
                                            <option value="3">Sub Element 3</option>
                                            <option value="3">Sub Element 3</option>
                                        </select>
                                    </div>
                                    
                                    <div className="form-group col">
                                        <label className="list-header">Operator</label>
                                        <select className="form-control list-header" style={{ marginLeft: "10px" }} id="qualifier">
                                            <option value="0">Equal to</option>
                                            <option value="1">Not Equal to</option>
                                            <option value="2">IN</option>
                                            <option value="3">format</option>
                                            <option value="3">Lookup</option>
                                        </select>
                                    </div>
    
                                    <div className="form-group col-sm-3">
                                        <label className="list-header">
                                            Value
                                        </label>
                                        <input type="text" className="list-header form-control" />
                                    </div>
    
                                    {
                                        item == 0
                                        ?
                                        <div className="form-group col">
                                            <label className="list-header">Severity</label>
                                            <select className="form-control list-header" style={{ marginLeft: "10px" }} id="Qualifier">
                                                <option value="0">Fail</option>
                                                <option value="1">Warning</option>
                                                <option value="2">Skip</option>
                                            </select>
                                        </div> : <div className="form-group col"></div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.renderAddView(this.state.operation[item])}
                </div>
            )
        })

        return(
            row
        )
    }

    operation(isOr){
        let array = this.state.operation
        array.push(isOr ? 2 : 1)
        
        this.setState({
            count : ++this.state.count,
            operation: array
        })

        setTimeout(() => {
            this.getData('{loopid(flag:"c" transaction:'+'"'+ this.state.transaction + '"' + ') { loopid }}', 1, array.length)
        }, 50);
    }

    renderAddView(iter){
        console.log("this is iter " + JSON.stringify(this.state.operation), ' askjdf : ', iter)
        return(
            <div className="pull-left" style={{margin: 12}}>
                {
                    iter == 1 ? <a href={"#"} style={{ color: "#6AA2B8" }}>AND</a> :
                    iter == 2 ? <a href={"#"} style={{ color: "#6AA2B8" }}>OR</a> :
                    <div>
                        <a href={"#"} style={{ color: "#6AA2B8" }} onClick={() => {this.operation()}}>AND</a> /  <a href={"#"} onClick={() => {this.operation(1)}} style={{ color: "#6AA2B8" }}>OR</a>
                    </div>
                }
            </div>
        )
    }

    onSelect(e){
        this.setState({
            transaction : document.getElementById('option').value
        })

        setTimeout(() => {
            this.getData('{loopid(flag:"c" transaction:'+'"'+ this.state.transaction + '"' + ') { loopid }}', 1, 0)
        }, 50);
    }

    clicked(){
        alert(" You successfully saved this data.");
    }

    render() {
        return (
            <div>
                <div className="container">
                    <Topbar flag={1} onSelect={this.onSelect}/>
                    {this.renderView()}
                </div>
                <div className="pull-left" style={{margin: 12}}>
                    <button type="button"className="btn light_blue list-header" onClick={this.clicked}>Save</button>
                </div>
            </div>
        );
    }
}