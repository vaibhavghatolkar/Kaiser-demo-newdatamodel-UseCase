import React from 'react';
import './style.css';
import Urls from '../../../helpers/Urls'

export class TransactionSetup extends React.Component {

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state = {
            files: [],
            tradingpartner: [],
            Transaction_Type: '',
            Companion_Guide:'',
            Acceptance_Criteria:'',
            
        };
       
        this.ChangeTradingPartner = this.ChangeTradingPartner.bind(this)
        this.ChangeVal = this.ChangeVal.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    componentDidMount() {
        this.getData()
        this.ChangeTradingPartner()
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
    getData() {
        let query = `{
      
            Trading_PartnerList { 
                ID 
                Trading_Partner_Name 
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
                     tradingpartner: res.data.Trading_PartnerList
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    ChangeVal(event, key){
        console.log(event.target.options[event.target.selectedIndex].text)
        this.setState({
            [key] : event.target.options[event.target.selectedIndex].text,
        })
    }
    getoptions() {
        let row = []
        this.state.tradingpartner.forEach(element => {
            row.push(<option value="">{element.Trading_Partner_Name}</option>)
        })
        return row
    }
    handleClick(event) {
       var query = 'mutation{ SP_Save_TransactionSetup(ID : 0 '+ 
            'Trading_Partner :"'+ this.state.Change_Trading_Partner +'"'+
            'Transaction_Type :"'+this.state.Transaction_Type+'"'+
            'Acceptance_Criteria :"'+this.state.Acceptance_Criteria+'"'+
            'Campanion_Guide :"'+this.state.Companion_Guide+'"'+
             ')'+
'}'


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
       .then(data => console.log('data returned:', data));
      }
    ChangeTradingPartner(event){
        
        if(!event){

            return
        }
        this.setState({
            Change_Trading_Partner: event.target.options[event.target.selectedIndex].text,
        })
        let query1 = '{TransactionSetup (TPName:"' + event.target.options[event.target.selectedIndex].text +`") {
            Transaction_Type 
            Companion_Guide
            Acceptance_Criteria
            Trading_Partner         
           
          }}`
          fetch(Urls.base_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query1 })
        })
            .then(res => res.json())
            .then(r => {
               // console.log('Data : ',r.data.Trading_Partner[0].Functional_Ack_Options)
               console.log(r.data.TransactionSetup[0].Transaction_Type)
                this.setState({
                    Transaction_Type: r.data.TransactionSetup[0].Transaction_Type,
                    Companion_Guide: r.data.TransactionSetup[0].Companion_Guide,
                    Acceptance_Criteria: r.data.TransactionSetup[0].Acceptance_Criteria,
                })
            })
            .catch(err => {
                console.log(err)
            })
        // console.log(event.target.options[event.target.selectedIndex].text)

        
    }

    render() {
        return (
            <div>
                {
                    <div>
                        <div>
                            <p style={{ color: '#139DC9', fontWeight: 'bold' }}>Transaction Setup</p>
                        </div>
                        <div className="row">

                            <div className="form-group col-sm-3">
                                <label className="list-header1">Trading partner</label>
                                <select onChange={this.ChangeTradingPartner} className="form-control list-header1" id="fao1">
                                    <option value="0">Trading partner</option>
                                    {this.getoptions()}
                                </select>
                            </div>

                            <div className="pull-right col-sm-1 col-sm-offset-3y">
                                <button type="submit" onClick={this.handleClick} className="btn light_blue1 btn-xs">Save</button>
                            </div>
                        </div>

                        <div className="container">
                            <div className="panel-group">
                                <div className="panel panel-default" style={{ border: "1px" }}>
                                    <div className="panel-heading collapsible" style={{ background: "#139DC9", }} data-toggle="collapse" href="#BasicX12Options">
                                        <span className="panel-title" style={{color: "white", fontSize: "12px"}}>
                                            Transaction Setup
                       </span>
                                    </div>
                                    <div id="BasicX12Options"  > <div className=" content">
                                        <br />
                                        <div className="row">

                                            <div className="form-group col-sm-3">
                                                <label className="list-header1">Transaction</label>
                                                <select className="form-control list-header1" id="fao1" onChange={(e) => this.ChangeVal(e, 'Transaction_Type')}>
                                                <option value="0" >Select Transaction</option>
                                                    <option selected={this.state.Transaction_Type == 'Claims 837P Medicaid' ? 'selected' : ''} value="Claims 837P Medicaid">Claims 837P Medicaid</option>
                                                    <option selected={this.state.Transaction_Type == 'Claims 837I Medicaid' ? 'selected' : ''} value="Claims 837I Medicaid">Claims 837I Medicaid</option>
                                                    <option selected={this.state.Transaction_Type == 'Enrollments 834 Medicare' ? 'selected' : ''} value="Enrollments 834 Medicare">Enrollments 834 Medicare</option>
                                                    <option selected={this.state.Transaction_Type == 'Encounter 837I' ? 'selected' : ''} value="Encounter 837I">Encounter 837I</option>
                                                    <option selected={this.state.Transaction_Type == 'Encounter 837P' ? 'selected' : ''} value="Encounter 837P">Encounter 837P</option>
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
                                        </div>

                                        <div className="row">
                                            <div className="form-group col-sm-3">
                                                <label className="list-header1">Companion Guide</label>
                                                <select className="form-control list-header1" id="fao1" onChange={(e) => this.ChangeVal(e, 'Companion_Guide')}>
                                                <option value="0">Select Companion Guide</option>
                                                    <option selected={this.state.Companion_Guide == '834 Medicare' ? 'selected' : ''}>834 Medicare</option>
                                                    <option selected={this.state.Companion_Guide == '837I Medicaid CA' ? 'selected' : ''}>837I Medicaid CA</option>
                                                    <option selected={this.state.Companion_Guide == '837P Medicaid CA' ? 'selected' : ''}>837P Medicaid CA</option>
                                                    <option selected={this.state.Companion_Guide == 'Encounters 837I Medicaid CA' ? 'selected' : ''}>Encounters 837I Medicaid CA</option>
                                                    <option selected={this.state.Companion_Guide == 'Encounters 837P Medicaid CA' ? 'selected' : ''}>Encounters 837P Medicaid CA</option>
                                                    <option selected={this.state.Companion_Guide == '270 Medicare' ? 'selected' : ''}>270 Medicare</option>
                                                    <option selected={this.state.Companion_Guide == '270 Medicaid CA' ? 'selected' : ''}>270 Medicaid CA</option>
                                                    <option selected={this.state.Companion_Guide == '276 Medicare' ? 'selected' : ''}>276 Medicare</option>
                                                    <option selected={this.state.Companion_Guide == '276 Medicaid CA' ? 'selected' : ''}>276 Medicaid CA</option>
                                                </select>
                                            </div>
                                            <div className="pull-right col-sm-2">
                                            <p class="form">
   
   <label class="add-photo-btn">Add New<span><input type="file" id="myfile" name="myfile" /></span>
</label>
</p>
                                            </div>
                                            <div className="pull-right col-sm-1">
                                                <button type="submit" className="btn light_blue1 btn-xs">Upload</button>
                                            </div>
                                        </div>

                                    </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}