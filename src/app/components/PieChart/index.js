import React from 'react'
import '../../containers/Files/files-styles.css'
import "../../containers/color.css";
import { Pie } from 'react-chartjs-2';

export class PieChart extends React.Component {
    constructor(props) {
        super(props);
    }

    renderChart(piechart_data) {
        return (
            <Pie data={piechart_data}
                options={{
                    elements: {
                        arc: {
                            borderWidth: 0
                        }
                    },
                    legend: {
                        display: false,
                    }
                }}
                width={20}
                height={19} />
        )
    }

    renderValues(piechart_data) {
        let row = []
        let data = piechart_data.labels
        let colors = piechart_data.datasets[0].backgroundColor
        let count = 0
        data.forEach(item => {
            row.push(
                <div className="row" style={{ paddingLeft: '12px', fontSize: '11px', marginTop: '4px', color: '#8598aa', alignItems: 'center' }}>
                    <div style={{ height: '10px', width: '20px', backgroundColor: colors[count], marginRight: '6px' }}></div><div>{item && item != 'null' ? (item.length > 40 ? (item.substr(0, 40) + '...') : item) : ''}</div>
                </div>
            )
            count++
        })
        return (
            <div style={{ marginTop: '16px' }}>
                {row}
            </div>
        )
    }

    renderPieChart = () => {
        let piechart_data = this.props.piechart_data
        return (
            piechart_data && piechart_data.labels && piechart_data.labels.length > 0
                ?
                <div className="row chart-container-full chart clickable" onClick={() => { if (this.props.onClick) { this.props.onClick(this.props.data) } }}>
                    <div className="col-7 nopadding">
                        <div className="chart-header">{this.props.header}</div>
                        {piechart_data && piechart_data.labels && piechart_data.labels.length > 0 ? this.renderValues(piechart_data) : null}
                    </div>
                    <div className="col-5 chart-align">
                        {this.renderChart(piechart_data)}
                    </div>
                </div> :
                <div className="chart-container-full chart" style={{ textAlign: 'center' }}>
                    No Data Present
                </div>
        )
    }

    render() {
        return (
            this.renderPieChart()
        )
    }
}