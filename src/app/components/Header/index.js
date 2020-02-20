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
                <p className="header_text">HiPaaS</p>
                {
                    localStorage.getItem('UserId') ?
                        <div class="dropdown" style={{ float: 'right', marginTop: '-30px' }}>
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