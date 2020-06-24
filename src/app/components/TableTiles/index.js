import React from 'react'
import '../../containers/Files/files-styles.css'
import "../../containers/color.css";
import { Link } from 'react-router-dom'
export class TableTiles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    renderTableTiles = () => {
        let item = this.props.item
        return (
            <div className="row" style={{ paddingTop: '2px', paddingBottom: '2px' }}>
                <div style={{ fontSize: '15px', color: "var(--grayBlack)", fontWeight: '500', }} className="col-12">{item.header}</div>
                <div style={{ alignSelf: 'center', fontSize: '12px', color: "var(--grayBlack)", }} className="col-9"> {item.name} </div>
                {
                    item.isClick ?
                        <Link to={{ pathname: item.url ? item.url : this.props.url, state: { data: this.props.data } }} style={{ alignSelf: 'center', fontSize: '16px', color: this.props.color }}>{item.value}</Link>
                        :
                        <div style={{ alignSelf: 'center', fontSize: '16px', color: this.props.unclick ? this.props.unclick : "var(--grayBlack)" }}>{item.value}</div>
                }
            </div>
        )
    }
    renderDiffTableTiles = () => {
        let item = this.props.item
        return (
            <div className="row" style={{ paddingTop: '2px', paddingBottom: '2px' }}>
                <div style={{ fontSize: '15px', color: "var(--grayBlack)", fontWeight: '500', }} className="col-12">{item.header}</div>
                <div style={{ alignSelf: 'center', fontSize: '12px', color: "var(--grayBlack)",wordBreak: 'break-all' }} className="col-9"> {item.name} </div>
                {
                    <div style={{ alignSelf: 'center', cursor:'pointer', fontSize: '16px', color: this.props.unclick ? this.props.unclick : "var(--grayBlack)" }}><a onClick={() => this.props.Click(this.props.data)}>{item.value}</a></div>
                }
            </div>
        )
    }
    render() {
        return (
            this.props.diffClick ? 
            this.renderDiffTableTiles() :
            this.renderTableTiles()
        )
    }
}









