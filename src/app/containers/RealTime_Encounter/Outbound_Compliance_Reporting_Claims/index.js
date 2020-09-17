import React from 'react'
const $ = window.$;

export class Outbound_Compliance_Reporting_Claims extends React.Component {

    constructor(props) {
        super(props);
    }

    renderHL7 = () => {
        return(
            <img src={require('../../../components/Images/compliance.png')} alt="logo" className="compliance_image_style" align="center" />
        )
    }

    render() {
        return (
            <div style={{height : $(window).height()}}>
                <h5 className="headerText">Compliance Report</h5>
                {this.renderHL7()}
            </div>
        )
    }
}