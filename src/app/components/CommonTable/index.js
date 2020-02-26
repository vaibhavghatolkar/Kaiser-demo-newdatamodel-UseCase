import React from 'react'
import moment from 'moment';
import ReactPaginate from 'react-paginate';

var val = ''
export class CommonTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        }
    }

    renderPagination() {
        return (
            <ReactPaginate
                previousLabel={'previous'}
                nextLabel={'next'}
                breakLabel={'...'}
                breakClassName={'page-link'}
                initialPage={0}
                pageCount={this.props.count}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={(page) => { this.props.handlePageClick(page) }}
                containerClassName={'pagination'}
                pageClassName={'page-item'}
                previousClassName={'page-link'}
                nextClassName={'page-link'}
                pageLinkClassName={'page-link'}
                subContainerClassName={'pages pagination'}
                activeClassName={'active'}
            />
        )
    }

    renderTable() {
        let row = []
        let header_row = []
        const data = this.props.data ? this.props.data : []
        let rowArray = this.props.rowArray
        let headerArray = this.props.headerArray
        headerArray.forEach(item => {
            header_row.push(
                item.method ?
                    <div className={headerArray.length > 10 ? "col-1 col-header justify-align" : item.upScale == 1 ? "col-2 col-header justify-align" : "col col-header justify-align"}>
                        {/* <img onClick={() => item.method()} src={require('../../components/Images/up_arrow.png')} style={{ width: '14px', transform: `rotate(${item.key}deg)`, marginLeft: '-2px' }}></img> {item.value}                        */}
                        {item.value} <img src={require('../../components/Images/search_table.png')} style={{ height: '14px', marginTop : '3px', float: 'right', marginRight: '4px' }}></img>
                    </div>
                    :
                    <div className={headerArray.length > 10 ? "col-1 col-header justify-align" : item.upScale == 1 ? "col-2 col-header justify-align" : "col col-header justify-align"}>
                        {item.value} <img src={require('../../components/Images/search_table.png')} style={{ height: '14px', marginTop : '3px', float: 'right', marginRight: '4px' }}></img>
                    </div>
            )
        })

        row.push(
            <div className="row">
                {header_row}
            </div>
        )

        data.forEach(data_item => {
            let col = []
            let count = 0
            let timeformat = "MM/DD/YYYY, hh:mm a"

            rowArray.forEach(row_item => {
                if (row_item.isNottime) {
                    timeformat = "MM/DD/YYYY"
                }

                col.push(
                    <div className={headerArray.length > 10 ? "col-1 col-small-style small-font word-wrap" : row_item.upScale == 1 ? "col-2 col-small-style small-font" : "col col-small-style small-font"}>
                        {
                            this.props.onClick && count == 0 ?
                                <a style={{ color: "#6AA2B8", cursor: "pointer" }}
                                    onClick={() => { this.props.onClick(data_item[this.props.onClickKey]) }}
                                >
                                    {row_item.isAmount == 1 ? '$' : ''}{row_item.isDate == 1 ? moment(Number(data_item[row_item.value]) ? Number(data_item[row_item.value]) : data_item[row_item.value]).format(timeformat) != 'Invalid date' ? moment(Number(data_item[row_item.value]) ? Number(data_item[row_item.value]) : data_item[row_item.value]).format(timeformat) : data_item[row_item.value] : data_item[row_item.value]}
                                </a> :
                                <a>
                                    {row_item.isAmount == 1 ? '$' : ''}{row_item.isDate == 1 ? moment(Number(data_item[row_item.value]) ? Number(data_item[row_item.value]) : data_item[row_item.value]).format(timeformat) != 'Invalid date' ? moment(Number(data_item[row_item.value]) ? Number(data_item[row_item.value]) : data_item[row_item.value]).format(timeformat) : data_item[row_item.value] : data_item[row_item.value]}
                                </a>
                        }
                    </div>)
                count++
            })

            count = 0

            return (
                row.push(
                    <div className="row">
                        {col}
                    </div>
                )
            )
        })

        return (
            <div className="margin scrollmenu">
                {row}
                {this.renderPagination()}
            </div>
        )
    }

    render() {
        return (
            this.renderTable()
        );
    }
}