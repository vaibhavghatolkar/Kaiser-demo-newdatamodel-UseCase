import React from 'react';
import './style.css';
import Urls from '../../../helpers/Urls';

export class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            EmailId:'',
            Password:''

        };
        this.loginUser = this.loginUser.bind(this);


    }

    loginUser(){
        let query = `{
            UserLogin(Email:"`+ this.state.EmailId +`" Password:"`+ this.state.Password +`") {
              Login, Id
            }
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
                    if(res.data.UserLogin[0].Login == 1){
                        this.setState({
                            loggedIn: true
                        })
                        setTimeout(() => {
                            localStorage.setItem("token", "sdjjasdnjas")
                            this.props.handleFlag(this.state.loggedIn)
                        }, 100);
                        
                    }else{
                        alert("You have entered wrong username or password")
                    }
                    
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
                        <div style={{ padding: "20px" }}>
                            <h3 style={{ color: "#6C6969" }}>Log In</h3>
                        </div>
                        <div class="form-group">
                            <label className="">Email address</label>
                                <input onChange={(e) => this.onHandleChange(e, 'EmailId')} name="email" type="text" className="form-control widthText" id="Email"
                                        placeholder="Enter email" />
                        </div>
                        <div class="form-group">
                            <label className="">Password</label>
                                <input onChange={(e) => this.onHandleChange(e, 'Password')} name="password" type="password" className="form-control widthText" id="Password"
                                        placeholder="Enter Password" />
                        </div>
                        <div style={{ marginTop: "15px" }}>
                            <a href="#" style={{ color: "#139DC9", fontSize: "12px" }}>Don't remember your password</a>
                        </div>
                        <div style={{ marginTop: "15px" }}> 
                            <button style={{ marginLeft: "35px" }} onClick={this.loginUser} class="btn btn-demo">Login</button>
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