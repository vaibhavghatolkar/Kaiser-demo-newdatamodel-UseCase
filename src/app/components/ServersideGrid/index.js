import React from 'react'
import { AgGridReact } from 'ag-grid-react';
import '../../containers/EligibilityDetails/style.css'
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import loader from '../Images/loader.gif'

export class ServersideGrid extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            columnDefs: this.props.columnDefs,
            defaultColDef: {
                flex: 1,
                minWidth: 90,
                resizable: true,
                sortable: true,
                rowDrag: false,
                filter: 'agTextColumnFilter'
            },
            overlayLoadingTemplate: '<div class="spinner-border" role="status"> <span class="sr-only">Loading...</span> </div>',
            autoGroupColumnDef: {
                headerName: 'Group',
                minWidth: 170,
                field: 'athlete',
                valueGetter: function (params) {
                    if (params.node.group) {
                        return params.node.key;
                    } else {
                        return params.data[params.colDef.field];
                    }
                },
                headerCheckboxSelection: true,
                cellRenderer: 'agGroupCellRenderer',
                cellRendererParams: { checkbox: true },
            },
            columnTypes: {
                text: {
                    filter: 'agTextColumnFilter',
                    filterParams: {
                        resetButton: true,
                        debounceMs: 1500,
                    },
                },
            },
            sortArray: '',
            rowSelection: 'never',
            rowGroupPanelShow: 'never',
            pivotPanelShow: 'never',

            paginationPageSize: this.props.paginationPageSize ? this.props.paginationPageSize : 10,
            cacheBlockSize: 10,
            rowData: [],
            fieldType: "",
            sortType: "desc",
            domLayout: 'autoHeight',
            rowModelType: 'serverSide',
            startRow: 0,
            endRow: 9,
            initial: true
        }
    }

    shouldComponentUpdate(nextProps) {
        if (
            this.props.State != nextProps.State ||
            this.props.selectedTradingPartner != nextProps.selectedTradingPartner ||
            this.props.startDate != nextProps.startDate ||
            this.props.endDate != nextProps.endDate ||
            this.props.filterClaim != nextProps.filterClaim ||
            this.props.type != nextProps.type ||
            this.props.selectedFileId != nextProps.selectedFileId
        ) {
            var datasource = this.ServerSideDatasource();
            this.gridApi.setServerSideDatasource(datasource)
            return true
        } else {
            return false
        }
    }

    getFilters = (params) => {
        let filterData = params.request.filterModel
        let array = []

        for (let filters in filterData) {
            array.push({
                filter: filterData[filters].filter,
                index: filters,
            })
        }

        return array
    }

    ServerSideDatasource = () => {
        return {
            getRows: (params) => {
                console.log('[Datasource] - rows requested by grid: ', params.request)
                let array = this.getFilters(params)
                this.gridApi.showLoadingOverlay();
                this.props.updateFields(
                    params.request.sortModel && params.request.sortModel.length > 0 ? params.request.sortModel[0].colId : (this.props.fieldType ? this.props.fieldType : ''),
                    params.request.sortModel && params.request.sortModel.length > 0 ? params.request.sortModel[0].sort : 'desc',
                    params.request.startRow,
                    params.request.endRow - 1,
                    array
                )

                setTimeout(() => {
                    this._apiCall()
                        .then((data) => {
                            this.gridApi.hideOverlay()
                            if (this.props.postData) {
                                this.props.postData(data)
                            }
                            params.successCallback(data, data && data.length > 0 ? data[0].RecCount : 0);
                        }).catch(error => {
                            this.gridApi.hideOverlay()
                            console.log(error)
                        })
                }, 200);
            },
        }
    }

    onGridReady = (params) => {
        this.gridApi = params.api
        var datasource = this.ServerSideDatasource();
        this.gridApi.setServerSideDatasource(datasource)
    }

    _apiCall = async () => {
        process.env.NODE_ENV == 'development' && console.log(this.props.query)
        return fetch(this.props.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: this.props.query })
        })
            .then(res => res.json())
            .then(res => {
                return res.data[this.props.index]
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
                return 0
            });
    }

    renderGrid = () => {
        return (
            <div className="ag-theme-balham" style={{ padding: '0px', marginLeft: '1px' }}>
                <AgGridReact
                    columnDefs={this.state.columnDefs}
                    defaultColDef={this.state.defaultColDef}
                    rowModelType={this.state.rowModelType}
                    pagination={true}
                    paginationPageSize={this.state.paginationPageSize}
                    cacheBlockSize={this.state.cacheBlockSize}
                    overlayLoadingTemplate={this.state.overlayLoadingTemplate}
                    animateRows={true}
                    onGridReady={this.onGridReady}
                    domLayout={this.state.domLayout}
                    onCellClicked={(event) => { if (this.props.onClick) { this.props.onClick(event) } }}
                />
                {/* <img src={loader} className="loader-image" style={{ height: '25px', width: '25px' }} alt="loading..." /> */}
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.renderGrid()}
            </div>
        );
    }
}