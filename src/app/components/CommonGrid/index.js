import React from 'react'
import './styles.css'
import "../../containers/color.css";
import Urls from '../../../helpers/Urls';
const $ = window.$;

export class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          
        };
    }

    renderTable = () => {
        return(
            <div></div>
        )
    }

    render() {
        return (
            this.renderTable()
        );
    }
}