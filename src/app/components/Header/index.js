import React from 'react'
import './styles.css'
import "../../containers/color.css";

export class Header extends React.Component {

    logout() {
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload()
    }

    changePassword() {

    }

    render() {
        return (
           
            <div className="header_container">
                <h2 className="header_text" style={{marginLeft:"45px"}}>Molina</h2>
                <label style={{color:"white" , marginLeft:"45px" , fontSize:"11px" }}>Powered by HiPaaS
</label>
                
                {
                    localStorage.getItem('UserId') ?
                        <div class="dropdown" style={{ float: 'right', marginTop: '-10px' }}>
                            <img src={require('../Images/user.png')} style={{ width: '25px' }} />
                            <div class="dropdown-content">
                                <a onClick={this.changePassword}>Change Password</a>
                                <a onClick={this.logout}>Logout</a>
                            </div>
                        </div>
                        : ''
                }

            </div>
          
        );
    }
}