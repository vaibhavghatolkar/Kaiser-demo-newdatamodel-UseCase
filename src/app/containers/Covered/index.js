import React from 'react';
import { MDBDataTable } from 'mdbreact';
import './style.css';
import Urls from '../../../helpers/Urls'

export class CoveredICDCode extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            claimsList: [],
            files: [],
            allData: []
        }
        this.onChange = this.onChange.bind(this);
        this.getData = this.getData.bind(this);
    }

    componentDidMount() {
        this.getData()
    }

    getData() {
        let query = `{
            CoveredList {
                SeqId
                CPT
                ICDCode
                policy
                C_eff_date
                policyrulekey
                policyDesc
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
                let array = []
                let summary = []
                let data = res.data
                let iterator = data.CoveredList
                let pagecount_length = res.data.CoveredList.length
            
                iterator.forEach(item => {
                    array.push({
                        cpt: item.CPT,
                        ICDCode: item.ICDCode,
                        C_eff_date: item.C_eff_date,
                        policyrulekey: item.policyrulekey,
                        policyDesc: item.policyDesc
                    })
                })

                this.setState({
                    claimsList: array,
                    summaryList: summary,
                    pageCount: Math.ceil(pagecount_length / 10),
                    initialPage: 1,
                    allData: res.data.CoveredList
                })
            })
            .catch(err => {
                console.log(err)
            })
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

    renderList ()  {
       
        const claimsList = this.state.claimsList
        const data = {
          columns: [
            {
              label: 'CPT',
              field: 'cpt',
              sort: 'asc',
              width: 150
            },
            {
              label: 'ICDCode',
              field: 'ICDCode',
              sort: 'asc',
              width: 270
            },
            {
              label: 'C_eff_date',
              field: 'C_eff_date',
              sort: 'asc',
              width: 200
            },
            {
                label: 'policy rule key',
                field: 'policyrulekey',
                sort: 'asc',
                width: 100
            },
            {
              label: 'policy Description',
              field: 'policyDesc',
              sort: 'asc',
              width: 150
            },
            
          ],
          rows: claimsList
          

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
                <div>
                    <h5 style={{ color: "#139DC9" }}>Covered ICD Code</h5>
                    <hr></hr>
                </div>
                <div className="row">
                    <label className="btn" style={{ backgroundColor: "#139DC9", marginLeft: '15px', color: 'white' }}>Add File
                    <input type="file" name="filename" onChange={this.onChange} style={{ display: "none"  }} />
                    </label>
                    {this.state.files.map(x =>
                        <div className="file-preview" style={{ marginTop: '10px', marginLeft: '10px' }} onClick={this.displayFile.bind()}>{x.name}</div>
                    )}
                </div>
                <br/>
                <div className="row">
                    <div className="col-9">
                        {this.renderList()}
                        
                    </div>
                </div>
            </div>
        );
    }
}