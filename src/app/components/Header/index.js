import React from 'react'
import './styles.css'
import "../../containers/color.css";
import Button from '@material-ui/core/Button';

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
                <h2 className="header_text"><b>EDIVAL</b></h2>
                <label style={{color:"white" , marginLeft:"20px" , fontSize:"11px" }}>Powered by HiPaaS</label>
                {
                    localStorage.getItem('UserId') ?
                        <div class="dropdown" style={{ float: 'right', marginTop: '-16px' }}>
                            <img src={require('../Images/user.png')} style={{ width: '25px' }} />
                            <div class="dropdown-content">
                                <a onClick={this.changePassword}>Change Password</a>
                                <a onClick={this.logout}>Logout</a>
                                <Button variant="contained" color="primary">
      Hello World
    </Button>
                                
                            </div>
                        </div>
                        : ''
                }

            </div>
          
        );
    }
}