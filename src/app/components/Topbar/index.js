import React from 'react';
import '../../containers/Files/files-styles.css';
import Urls from '../../../helpers/Urls';
export class Topbar extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            startDate: new Date(),
            files: [],
            tradingpartner: [],            
            Transaction:'',
        };
        this.state = {
            endDate: new Date(),
            files: [],
            tradingpartner: [],
        }
    }
    displayFile() {
        this.setState({ files: this.state.files });
    }
      handleChange(date){
        this.setState({
          startDate: date
        });
       
      };
      componentDidMount() {
        this.getData()
       

    }
 
      getData() {
        this.props.flag == 2
        ?
        this.state.Transaction="Enrollment834"
        :
        this.state.Transaction="Claim837"
      
        let query = `{
      
            Trading_PartnerList ( Transaction:"`+this.state.Transaction+`") {
              
                Trading_Partner_Name 
                
            }
           
        }`
          console.log(query);
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

    // getOptions() {
    //     let row = []
    
    //     this.state.tradingpartner.forEach(element => {
    //         row.push(<option value="">{element.Trading_Partner_Name}</option>)
    //     })
    //     return row
    // }
      changeDate(date1){
        this.setState({
            endDate: date1
        })
      }
      getOptions() {
        let row = []
       
        this.state.tradingpartner.forEach(element => {
            row.push(<option value="">{element.Trading_Partner_Name}</option>)
        })
        return row
    }
    render(){
        return(
            <div className="row">
                <div className="form-group col-sm-3">
                    <label className="list-header">Select State</label>
                    <select className="form-control list-header" id="state">
                        <option value="">Select State</option>
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
                {
                    this.props.flag == 1
                    ?
                    ""
                // <div className="form-group col-sm-3">
                //     <label className="list-header">Select Trading Partner </label>
                //     <select className="form-control list-header" id="TradingPartner" 
                //         onChange={(event) => {
                //             this.props.onSelect(event, 'selectedTradingPartner')
                //         }}>
                //         <option selected="selected" value="">Select Trading Partner</option>
                //         {
                //             this.props.tradingpartner ? this.getOptions() : null
                //         }
                //     </select>
                // </div>
                :
                <div className="form-group col-sm-3">
                <label className="list-header">Select Trading Partner </label>
                <select className="form-control list-header" id="TradingPartner" 
                    // onChange={(event) => {
                    //     this.props.onSelect(event, 'selectedTradingPartner')
                    // }}
                    >
                    <option selected="selected" value="">Select Trading Partner</option>
                    {
                         this.getOptions() 
                    }
                </select>
            </div>
                    }

                {
                    this.props.flag == 1
                    ?
                    <div className="form-group col-sm-3">
                        <label className="list-header">Select Transaction</label>
                        <select className="form-control list-header" id="option" onChange={this.props.onSelect}>
                            <option value="">Select Transaction</option>
                            <option value="Claims 837P Medicaid">Claims 837P Medicaid</option>
                            <option selected="selected" value="Claims 837I Medicaid">Claims 837I Medicaid</option>
                            <option value="Enrollments 834 Medicare">Enrollments 834 Medicare</option>
                        </select>
                    </div>
                    : 
                    <div className="form-group col-sm-3">
                        <label className="list-header">Select Provider Name</label>
                        <select className="form-control list-header" id="ProviderName">
                            <option value="">Select Provider Name</option>
                            <option selected="selected" value="1">Provider Name 1</option>
                            <option value="2">Provider Name 2</option>
                        </select>
                    </div>
                }
                {
                    this.props.flag == 3
                    ?
                    <div className="form-group col-sm-3">
                        <label className="list-header">Select Provider Name</label>
                        <select className="form-control list-header" id="ProviderName">
                            <option value="">Select Provider Name</option>
                            <option selected="selected" value="1">Provider Name 1</option>
                            <option value="2">Provider Name 2</option>
                        </select>
                    </div>
                    : null
                }
                
                {
                    this.props.flag == 3
                    ?
                    <div className="form-group col-sm-3">
                        <label className="list-header">Select Provider Name</label>
                        <select className="form-control list-header" id="ProviderName">
                            <option value="">Select Provider Name</option>
                            <option selected="selected" value="1">Provider Name 1</option>
                            <option value="2">Provider Name 2</option>
                        </select>
                    </div>
                    : null
                }
            </div>
        )
    }
}