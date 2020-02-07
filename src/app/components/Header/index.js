import React from 'react'
import './styles.css'
import "../../containers/color.css"; 
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap'

export class Header extends React.Component {

    logout() {
        localStorage.clear();
        window.location.reload()
    }

    changePassword(){
       
    }

    render() {
        return (
            <div className="header_container">
                <p className="header_text">HiPaaS</p>
                {
                    localStorage.getItem('UserId') ?

                        <UncontrolledDropdown style={{ float: 'right', marginTop: '-30px', }}>
                            <DropdownToggle style={{ backgroundColor: 'var(--main-bg-color)', border: 'var(--main-bg-color)'}}>
                                <img src={require('../Images/user.png')} style={{ width: '25px' }} />
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={this.changePassword}>Change Password</DropdownItem>
                                <DropdownItem onClick={this.logout}>Logout</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        : ''
                }

            </div>
        );
    }
}