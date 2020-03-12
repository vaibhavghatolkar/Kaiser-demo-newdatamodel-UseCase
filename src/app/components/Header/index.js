import React from 'react'
import './styles.css'
import "../../containers/color.css";
import Strings from '../../../helpers/Strings';

export class Header extends React.Component {

    constructor(props){
        super(props);
    }

    logout() {
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload()
    }

    changePassword = () => {
        this.props.history.push('/' + Strings.ChangePassword)
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
                            </div>
                        </div>
                        : ''
                }

            </div>
          
        );
    }
}