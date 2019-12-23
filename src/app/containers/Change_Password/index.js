import React from 'react';
import './style.css';
import Urls from '../../../helpers/Urls';

export class ChangePassword extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            oldPassword:'',
            newPassword:'',
            confirmNewPassword:''

        };
        this.updatePassword = this.updatePassword.bind(this);


    }

    updatePassword(){

        let query = `mutation{
            ChangePassword(Id:`+1001+` OldPassword:"`+this.state.oldPassword+`" NewPassword:"`+this.state.newPassword+`" ForgotOrNot:0)
          }`
            fetch(Urls.base_url , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ query: query })
            })
                .then(res => res.json())
                .then(res => {
                    alert(res.data.ChangePassword);
                    window.location.reload()
                }).catch(err => {
                    console.log(err)
                })
    }

    onHandleChange(e, key){
        this.setState ({
            [key]: e.target.value
        });
    }

    render() {
        return (


            <div className="container-fluid" style={{marginTop: "-10px"}}>
                <div class="row" >
                    <div class=" col-5" >
                        <div style={{ paddingTop: "40px" }}>
                            <h5 style={{ color: '#139DC9', fontSize:"20px" }}>Change Password</h5>
                        </div>
                        <div class="form-group" style={{marginTop:"20px"}}>
                            <label>Old Password</label>
                                <input onChange={(e) => this.onHandleChange(e, 'oldPassword')} name="OldPassword" type="password" className="form-control textInput" id="OldPassword"
                                        placeholder="Enter Old Password" value={this.state.oldPassword} />
                        </div>
                        <div class="form-group">
                            <label>New Password</label>
                                <input onChange={(e) => this.onHandleChange(e, 'newPassword')} name="password" type="password" className="form-control textInput" id="Password"
                                        placeholder="Enter New Password" value={this.state.newPassword} />
                        </div>
                        <div class="form-group">
                            <label>Confirm New Password</label>
                                <input onChange={(e) => this.onHandleChange(e, 'confirmNewPassword')} name="password1" type="password" className="form-control textInput" id="Password1"
                                        placeholder="Confirm New Password" value={this.state.confirmNewPassword} />
                        </div>
                        
                        <div class="form-group" style={{ marginTop: "15px" }}>
                            <button style={{ marginLeft: "20px",marginTop:"10px", backgroundColor: '#139DC9' }} onClick={this.updatePassword} class="btn btn-primary">Update Password</button>
                        </div>
                       
                    </div>
                    <div class=" col-7" style={{ backgroundColor: '#139DC9', height: "615px"}}>
                        <div style={{ paddingTop: "30px", marginLeft: "20px" }}>
                            <span class="dot"></span> <label className="small" style={{ color: "white" }}>  HiPaaS is HIPAA compliant.</label>
                            <br></br>
                           <span class="dot"></span> <label className="small" style={{ color: "white" }}> HiPaaS is cloud based, light weight, agile platform that can be running in days.</label>
                            <br></br>
                           <span class="dot"></span> <label className="small" style={{ color: "white" }}> Reduction of time and costs through ready to use process libraries and APIs.</label>
                            <br></br>
                           <span class="dot"></span> <label className="small" style={{ color: "white" }}> EDI API's to generate,validate,send,receive and reconcile transaction.</label>
                            <br></br>
                           <span class="dot"></span> <label className="small" style={{ color: "white" }}> HiPaaS Solution for SNIP L1-L7 validation.</label>
                            <br></br>
                           <span class="dot"></span> <label className="small" style={{ color: "white" }}> HiPaaS build on the Next Generation Healthcare Architecture.</label>
                            <br></br>
                           <span class="dot"></span> <label className="small" style={{ color: "white" }}> Saving of customer efforts with end-to-end managed services at affordable costs.</label>
                            <br></br>
                           <span class="dot"></span> <label className="small" style={{ color: "white" }}> High level of support and responsiveness to help solve business problems.</label>
                            <br></br>
                           <span class="dot"></span> <label className="small" style={{ color: "white" }}> Easy choice of offerings that can be deployed through a plug-and-play model.</label>
                               
                        </div>
                       
                    </div>
            
                    </div>

            </div>

        );
    }
}