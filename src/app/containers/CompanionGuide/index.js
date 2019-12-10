import React from 'react';
import './style.css';
import { MDBDataTable } from 'mdbreact';
import Urls from '../../../helpers/Urls'

export class CompanionGuide extends React.Component {

    constructor(props) { 


    
        super(props);       
        this.state={
            claimsError: [],
            array : [],
            
        }
    
       
    }

    componentDidMount() {
      
        this.getData()
     this.DatatablePage()
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
   
    getData(){
        let query = `{
            GetCompanion    {
                Edit_Reference
                Segment
                Description
                ID
                Min_Max
                Usage_Req
                Values5010A1
                TA1_999_277CA
                Accept_Reject
                Disposition
                PartB
                CEDI
                MiscNotes
            }
          }`

        fetch(Urls.base_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({query: query})
        })
        .then(res => res.json())
        .then(res => {
            this.setState({
                
                array : res.data.GetCompanion
               
                        })
        })
        .catch(err => {
            console.log(err)
        })
    }

    ChangeTradingPartner(event){
        
    }
  
    renderRows(){

        
        let row = []
        let array = this.state.array
  
        
        array.forEach(item => {
            row.push(
                <tr>
                    <td>{item.Edit_Reference}</td>
                    <td>{item.Segment}</td>
                    <td>{item.Description}</td>
                    <td>{item.ID}</td>
                    <td>{item.Min_Max}</td>
                    <td>{item.Usage_Req}</td>

                    <td>{item.Values5010A1}</td>
                    <td>{item.TA1_999_277CA}</td>
                    <td>{item.Disposition}</td>
                  
          
              
                   
                </tr>
            )

        });
        console.log(row);
        return row
        
    }
    DatatablePage () {     
        
                   
        
        
        
        
        
          let comp_data=  this.state.array;
        const   data = {
              columns: [
      {
        label: 'Edit Reference',
        field: 'Edit_Reference',
        sort: 'asc',
        width: 150
      },
      {
        label: 'Segment',
        field: 'Segment',
        sort: 'asc',
        width: 270
      },
      {
        label: 'Description',
        field: 'Description',
        sort: 'asc',
        width: 200
      },
      {
        label: 'ID',
        field: 'ID',
        sort: 'asc',
        width: 100
      },
      {
        label: 'Min Max',
        field: 'Min_Max',
        sort: 'asc',
        width: 150
      },
      {
        label: 'Usage Req',
        field: 'Usage_Req',
        sort: 'asc',
        width: 100
      },
      {
        label: 'Values5010A1',
        field: 'Values5010A1',
        sort: 'asc',
        width: 100
      },
      {
        label: 'TA1_999_277CA ',
        field: 'TA1_999_277CA',
        sort: 'asc',
        width: 150
      },
     
      {
        label: 'Disposition',
        field: 'Disposition',
        sort: 'asc',
        width: 100
      },
    
    ],
 

        rows: comp_data
      };
      return (
        <MDBDataTable
          striped
          bordered
          hover
          data={data}
        />
      );
    }
    render() {
        
        return (
            
            <div>
                {
                    <div>
                        <div>
                            <p style={{ color: '#139DC9', fontWeight: 'bold' }}>Companion Guide</p>
                        </div>
                        <div className="row">

                            <div className="form-group col-sm-3">
                                <label className="list-header1">Select Companion Guide</label>
                                <select  onChange={this.ChangeTradingPartner} className="form-control list-header1" id="fao1">
                                <option>834 Medicare</option>
                                <option>837I Medicaid CA</option>
                                <option>837P Medicaid CA</option>
                                <option>Encounters 837I Medicaid CA</option>
                                <option>Encounters 837P Medicaid CA</option>
                                <option>270 Medicare</option>
                                <option>270 Medicaid CA</option>
                                <option>276 Medicare</option>
                                <option>276 Medicaid CA</option>
                                </select>
                            </div>

                            <div className="pull-right col-sm-2">
                            <p class="form">
   
   <label class="add-photo-btn">Add New<span><input type="file" id="myfile" name="myfile" /></span>
</label>
</p>
                            </div>
                        </div>

                        <div className="container">
                          
                        </div>
                    </div>
                
                
                }

         {  /*        <table className="table table-bordered claim-list summary-list">
                <thead>
                    <tr className="table-head">
                        <td className="table-head-text">Edit Reference</td>
                        <td className="table-head-text list-item-style">Segment or Element	</td>
                        <td className="table-head-text list-item-style">Description</td>
                        <td className="table-head-text list-item-style">ID</td>
                        <td className="table-head-text list-item-style">Min.Max.</td>
                        <td className="table-head-text list-item-style">Usage Req</td>
                        <td className="table-head-text list-item-style">5010A1 Values</td>
                        <td className="table-head-text list-item-style">TA1/999/277CA</td>
                        <td className="table-head-text list-item-style">Disposition/Error Code</td>
                    </tr>
                   
                </thead>

                <tbody>
               
                {this.renderRows()}
                    </tbody>
                    
            </table>*/}
          {this.DatatablePage()}
            </div>
        );

        
    }
}





