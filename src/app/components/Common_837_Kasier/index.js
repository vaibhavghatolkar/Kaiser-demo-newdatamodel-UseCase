import React from 'react';
import '../../containers/Files/files-styles.css';
import '../../containers/color.css'
import moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";

import { Tiles } from '../Tiles';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { TableTiles } from '../TableTiles';
import Strings from '../../../helpers/Strings';
import Urls from '../../../helpers/Urls';

export class Common_837_Kasier extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            claimsList: [],
            summaryList: [],
            type: "",
            apiflag: this.props.apiflag,
            startDate: (this.props.removeFiles || this.props.removeClaims) ? '' : moment().subtract(365, 'd').format('YYYY-MM-DD'),
            endDate: (this.props.removeFiles || this.props.removeClaims) ? '' : moment().format('YYYY-MM-DD'),
            providerName: '',
            chartType: 'Monthwise',
            selectedTradingPartner: '',
            State: '',
            incoming_fileId: '',
            totalFiles: 0,
            LoadingClaims: 0,
            total277CA: 0,
            Months: 0,
            accepted: 0,
            rejected: 0,
            inProgress: 0,
            Accepted_per: 0,
            rejected_per: 0,
            rejectedFileCount: 0,
            acceptedFileCount: 0,
            LoadedErrorClaims: 0,
            total_999: 0,
            rejectedCount: 0,
            Accepted_277CA: 0,
            Rejected_277CA: 0,

            X12Count: 0,
            HiPaaSCount: 0,
            Accepted_Claims: 0,
            Rejected_Claims: 0,
            FileReject_Claims: 0,
            Processing_Claims: 0,
            ReconciledError_Claims: 0,

            page: 1,
            ClaimBarChart: [],
            claimLabels: [],
            providers: [],
            second_data: {},
            pie_data: {},
            search: '',
            orderby: "",
            gridType: 1,
            gridflag: ''
        }
    }

    componentWillReceiveProps(nextProps) {
        if (
            this.props.State != nextProps.State ||
            this.props.selectedTradingPartner != nextProps.selectedTradingPartner ||
            this.props.startDate != nextProps.startDate ||
            this.props.endDate != nextProps.endDate ||
            this.props.type != nextProps.type
        ) {
            this.setState({
                startDate: nextProps.startDate,
                endDate: nextProps.endDate,
                selectedTradingPartner: nextProps.selectedTradingPartner,
                type: nextProps.type,
                State: nextProps.State,
            }, () => {
                this._refreshScreen()
            })
            return true
        } else {
            return false
        }
    }

    componentDidMount() {
        this._refreshScreen()
    }

    getClaimCounts = async () => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''

        let query = `{
            Claim837RTDashboardCountClaimStatus(Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}",StartDt:"${startDate}",EndDt:"${endDate}",Type:"${this.state.type}", RecType: "Inbound") {
                TotalClaims
                AcceptedClaims
                RejectedClaims
                FileRejectedClaims
                ReconciledErrorClaims
                LoadedClaims
                LoadErrorClaims
            }
            
        }`

        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._transaction837, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'user-id': sessionStorage.getItem('user-id'),
                'Cache-Control': 'no-cache, no-store',
                'Expires': 0,
                'Pragma': 'no-cache',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                if (res.data) {
                    // let data = res.data.Claim837RTDashboardCountClaimStatus[0]
                    let _data = res.data.Claim837RTDashboardCountClaimStatus[0]
                    this.setState({
                        X12Count: _data ? _data.TotalClaims : 0,
                        HiPaaSCount: _data ? _data.TotalClaims : 0,
                        LoadingClaims: _data ? _data.LoadedClaims : 0,
                        Accepted_Claims: _data ? _data.AcceptedClaims : 0,
                        Rejected_Claims: _data ? _data.RejectedClaims : 0,
                        FileReject_Claims: _data ? _data.FileRejectedClaims : 0,
                        // Processing_Claims: _data ? _data.Processing_Claims : 0,
                        ReconciledError_Claims: _data ? _data.ReconciledErrorClaims : 0,
                        LoadedErrorClaims: _data ? _data.LoadErrorClaims : 0,
                        Accepted_277CA: 0,
                        Rejected_277CA:  0,
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    _getCount = async () => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''
        let query = `{
    
            Claim837RTDashboardCountFileStatuswise(Sender:"${this.state.selectedTradingPartner}",State:"${this.state.State}",Provider:"${this.state.providerName}", StartDt :"` + startDate + `", EndDt : "` + endDate + `", Type : "` + this.state.type + `", RecType: "Inbound") {
                TotalFiles
                AcceptedFiles
                RejectedFiles
                AcceptedwithErrorsFiles
                ReconciledFiles
                ReconcileExceptionFiles
                MCGLoadedFiles
                LoadErrorFiles
                F999Count
                F277CACount                 

                
            }
        }`

    
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls._transaction837, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'user-id': sessionStorage.getItem('user-id'),
                'Cache-Control': 'no-cache, no-store',
                'Expires': 0,
                'Pragma': 'no-cache',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                let summary = []
             
                let _data = res.data.Claim837RTDashboardCountFileStatuswise
                let reconciled = ''
                let reconciledError = ''
               let totalCount = ''
                let accepted = ''
                let rejected = ''
                let acceptedwithErrors = ''
                let F999Count = ''
                let F277CACount = ''


                if (_data && _data.length > 0) {    
                     totalCount = _data[0].TotalFiles
                    accepted = _data[0].AcceptedFiles
                    rejected = _data[0].RejectedFiles
                    acceptedwithErrors = _data[0].AcceptedwithErrorsFiles
                    reconciled = _data[0].ReconciledFiles
                    reconciledError = _data[0].ReconcileExceptionFiles==null ? 0 :  _data[0].ReconcileExceptionFiles
                    F999Count=_data[0].F999Count
                    F277CACount=_data[0].F277CACount           

                   
                }

                summary = [
                    { name: 'Total Files', value: totalCount },
                    { name: 'Accepted Files', value: accepted },
                    { name: 'Accepted with Errors', value: acceptedwithErrors },
                    { name: 'Rejected Files', value: rejected },
                    { name: '999', value:F999Count },
                    { name: 'Reconciled Files | Error', value: reconciled, second_val: reconciledError },
                    // { name: 'Load in MCG | Error', value: loaded, second_val: loadedError },
                    // { name: 'HiPaaS | MCG', value: processing, second_val: MCGLoadingFiles },
                    { name: '277CA', value: F277CACount },
                ]

                this.setState({
                    total_999:res.data.Claim837RTDashboardCountFileStatuswise && res.data.Claim837RTDashboardCountFileStatuswise.length > 0 ? res.data.Claim837RTDashboardCountFileStatuswise[0].F999Count : 0,
                    total277CA: res.data.Claim837RTDashboardCountFileStatuswise && res.data.Claim837RTDashboardCountFileStatuswise.length > 0 ? res.data.Claim837RTDashboardCountFileStatuswise[0].F277CACount : 0,
                    summaryList: summary
                    
                  })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            })
    }

    _refreshScreen = () => {
        if (!this.props.removeClaims) {
            this.getClaimCounts()
        }
        if (!this.state.removeFiles) {
            this._get999Count()
            setTimeout(() => {
                this._getCount()
            }, 200);
        }
    }

    _get999Count = async () => {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''

        let query = `{
            Total999Response(submitter:"`+ this.state.selectedTradingPartner + `",fromDt:"` + startDate + `",ToDt:"` + endDate + `" ,  RecType:"Inbound", Provider:"${this.state.providerName}", State:"${this.state.State}", Type: "${this.state.type}") {
              Total999
              NotSent999
            }
            Total277CAResponse(submitter:"`+ this.state.selectedTradingPartner + `",fromDt:"` + startDate + `",ToDt:"` + endDate + `" ,  RecType:"Inbound", Provider:"${this.state.providerName}", State:"${this.state.State}", Type: "${this.state.type}") {
                Total277CA
                NotSent277CA
            }
         }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls.base_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'user-id': sessionStorage.getItem('user-id'),
                'Cache-Control': 'no-cache, no-store',
                'Expires': 0,
                'Pragma': 'no-cache',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    total_999: res.data.Total999Response && res.data.Total999Response.length > 0 ? res.data.Total999Response[0].Total999 : 0,
                    total277CA: res.data.Total277CAResponse && res.data.Total277CAResponse.length > 0 ? res.data.Total277CAResponse[0].Total277CA : 0
                })
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    _renderSummaryDetails() {
        let row = []
        let array = this.state.summaryList
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : 'n'
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : 'n'
        let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'
        let State = this.state.State ? this.state.State : 'n'
        let type = this.state.type ? this.state.type : ''

        array.forEach(item => {
            let addon = ''
            let claimStatus = ''
            let loadStatus = ''
            let mcgStatus = ''
            let notSent = ''
            let isDual = false
            let data = []
            let _second_data = []
            if (item.name == 'Accepted Files') {
                addon = '/accept'
                claimStatus = 'Accepted'
            } else if (item.name == 'Accepted with Errors') {
                addon = '/reject'
                claimStatus = 'Accepted with Errors'
            } else if (item.name == 'Processing Files') {
                addon = '/reject'
                claimStatus = 'Received'
            } else if (item.name == 'Rejected Files') {
                claimStatus = 'Rejected'
            } else if (item.name == 'Reconciled Files') {
                loadStatus = 'Reconciled'
            } else if (item.name == 'Reconciled Error') {
                loadStatus = 'Reconcile Exception'
            } else if (item.name == 'Load Error') {
                mcgStatus = 'Exception'
            } else if (item.name == 'Load in MCG') {
                mcgStatus = 'Loaded'
            } else if (item.name == '999') {
                notSent = 'Y'
            } else if (item.name == '277CA') {
                notSent = 'CA'
            } else if (item.name == 'Reconciled Files | Error') {
                loadStatus = 'Reconciled'
                isDual = true
            } else if (item.name == 'Load in MCG | Error') {
                mcgStatus = 'Loaded'
                isDual = true
            } else {
                addon = '/other'
            }

            data = [
                {
                    flag: addon,
                    State: State,
                    selectedTradingPartner: selectedTradingPartner,
                    startDate: startDate,
                    endDate: endDate,
                    status: claimStatus,
                    type: type,
                    gridflag: loadStatus,
                    mcgStatus: mcgStatus,
                    subtitle: (item.name == 'Total Files') ? '' : (item.name == 'Reconciled Files | Error') ? 'Reconciled Files' : (item.name == 'Load in MCG | Error') ? 'Load in MCG' : item.name,
                    notSent: notSent
                },
            ]

            if (isDual) {
                if (item.name == 'Reconciled Files | Error') {
                    _second_data = [{
                        flag: addon,
                        State: State,
                        selectedTradingPartner: selectedTradingPartner,
                        startDate: startDate,
                        endDate: endDate,
                        status: claimStatus,
                        type: type,
                        gridflag: 'Reconcile Exception',
                        subtitle: 'Reconciled Error',
                        mcgStatus: mcgStatus,
                        notSent: notSent
                    }]
                } else {
                    _second_data = [{
                        flag: addon,
                        State: State,
                        selectedTradingPartner: selectedTradingPartner,
                        startDate: startDate,
                        endDate: endDate,
                        status: claimStatus,
                        type: type,
                        gridflag: loadStatus,
                        subtitle: 'Load Error',
                        mcgStatus: 'Exception',
                        notSent: notSent
                    }]
                }
            }

            let geturl = Strings.Claim_Details_837_Grid
            if (notSent == 'Y') {
                geturl = Strings.Outbound_response_999
                data = [{
                    flag999: '1',
                    type: type,
                    State: State,
                    startDate: startDate,
                    endDate: endDate,
                    selectedTradingPartner: selectedTradingPartner,
                }]
            } else if (notSent == 'CA') {
                geturl = Strings.Outbound_277CAResponse
                data = [{
                    flag999: '1',
                    type: type,
                    State: State,
                    startDate: startDate,
                    endDate: endDate,
                    selectedTradingPartner: selectedTradingPartner,
                }]
            }

            row.push(
                <Tiles
                    isClickable={
                        item.name != 'HiPaaS | MCG'
                    }
                    _data={data}
                    header_text={item.name}
                    value={
                        item.name == '999' ? this.state.total_999 :
                            item.name == '277CA' ? this.state.total277CA :
                                item.value
                    }
                    second_val={item.second_val}
                    isDualTile={
                        item.name == 'Reconciled Files | Error' ||
                        item.name == 'Load in MCG | Error'
                    }
                    first_arg_style={item.name == 'Reconciled Files | Error' ? 'blue' : 'green'}
                    first_data={data}
                    second_data={_second_data}
                    url={geturl}
                    second_url={item.name == 'Load in MCG | Error' ? Strings.Load_Exception : ''}
                />

            )
        });

        return (
            <div className="row padding-left" style={{ marginLeft: '-14px', marginTop: '16px' }}>
                {row}
            </div>
        )
    }

    _renderClaimTables = (array) => {
        let row = []
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : 'n'
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : 'n'
        let selectedTradingPartner = this.state.selectedTradingPartner ? this.state.selectedTradingPartner : 'n'
        let State = this.state.State ? this.state.State : 'n'
        let type = this.state.type ? this.state.type : ''

        array.forEach(item => {
            let addon = ''
            let claimStatus = ''
            let loadStatus = ''
            let generalStatus = ''
            let mcgStatus = ''
            let notSent = ''
            let subtitle = ''
            let status277CA = ''
            let color = "var(--red)"

            if (item.name == 'Accepted') {
                generalStatus = 'Accepted'
                subtitle = 'Accepted Claims'
                color = "var(--green)"
            } else if (item.name == 'Rejected') {
                generalStatus = 'Rejected'
                subtitle = "Rejected Claims"
            } else if (item.name == 'File Rejected') {
                generalStatus = 'File Rejected'
                subtitle = item.name
            } else if (item.name == 'Reconciled Error') {
                subtitle = item.name
                loadStatus = 'Reconcile Exception'
            } else if (item.name == 'Load in MCG') {
                mcgStatus = 'Loaded'
                subtitle = item.name
                color = "var(--main-bg-color)"
            } else if (item.name == 'Load Error') {
                subtitle = item.name
                mcgStatus = 'Exception'
            } else if (item.name == '999 Not Sent') {
                notSent = 'Y'
            }

            if (item.name == 'Accepted' && item.is277CA) {
                subtitle = '277CA Accepted Claims'
                generalStatus = ''
                status277CA = 'Accepted'
            }

            if (item.name == 'Rejected' && item.is277CA) {
                subtitle = '277CA Rejected Claims'
                generalStatus = ''
                status277CA = 'Rejected'
            }

            let sendData = [
                {
                    flag: addon,
                    State: State,
                    selectedTradingPartner: selectedTradingPartner,
                    startDate: startDate,
                    endDate: endDate,
                    status: claimStatus,
                    type: type,
                    gridflag: loadStatus,
                    generalStatus: generalStatus,
                    mcgStatus: mcgStatus,
                    notSent: notSent,
                    subtitle: subtitle,
                    status277CA: status277CA
                },
            ]
            row.push(
                <TableTiles
                    item={item}
                    url={Strings.Claim_Details_837_Grid}
                    data={sendData}
                    color={color}
                    unclick={item.color ? item.color : ''}
                />
            )
        })

        return (
            <div className="col chart-container" style={{ paddingTop: "12px", paddingBottom: '12px' }}>
                {row}
            </div>
        )
    }

    renderClaimDetails = () => {
        let stage_1 = [
            { 'header': 'HiPaaS Load Status' },
            { 'name': 'X12 Count', 'value': this.state.X12Count==null ? 0 : this.state.X12Count },
            { 'name': 'HiPaaS Count', 'value': this.state.HiPaaSCount==null ? 0 :this.state.HiPaaSCount },
            { 'name': 'Reconciled Error', 'value': this.state.ReconciledError_Claims == null ? 0 : this.state.ReconciledError_Claims, 'isClick': 1 },
        ]
        let stage_2 = [
            { 'header': 'L1 - L2 Status' },
            { 'name': 'Accepted', 'value': this.state.Accepted_Claims==null ? 0 : this.state.Accepted_Claims , 'isClick': 1 },
            { 'name': 'Rejected', 'value': this.state.Rejected_Claims==null ? 0 :this.state.Rejected_Claims, 'isClick': 1 },
            { 'name': 'File Rejected', 'value': this.state.FileReject_Claims==null ? 0:this.state.FileReject_Claims, 'isClick': 1 },
        ]
        // let stage_3 = [
        //     { 'header': 'MCG Load Status' },
        //     { 'name': 'Load in MCG', 'value': this.state.LoadingClaims, 'isClick': 1 },
        //     { 'name': 'Load Error', 'value': this.state.LoadedErrorClaims, 'isClick': 1 },
        // ]
        let stage_3 = [
            { 'header': 'Payment Status' },
            { 'name': 'Paid', 'value': 8000, color : '#2AC327' },
            { 'name': 'Denied', 'value': 100, color : '#FF3B41' },
            { 'name': 'WIP 0-30', 'value':  7900, color : '#139DC9' },
            { 'name': 'WIP 30-60', 'value': 6000, color : '#139DC9' },
            { 'name': 'WIP >60', 'value': 5000, color : '#139DC9' },
        ]

        let stage_4 = [
            { 'header': 'L3 - L7 Status' },
            { 'name': 'Accepted', 'value': 27000, 'isClick': 1, 'is277CA': 1 },
            { 'name': 'Rejected', 'value': 287, 'isClick': 1, 'is277CA': 1 },
        ]

        return (
            <div className="row" style={{ marginBottom: '12px', marginLeft: '-9px' }}>
                {this._renderClaimTables(stage_1)}
                {this._renderClaimTables(stage_2)}
                {this._renderClaimTables(stage_4)}
                {this._renderClaimTables(stage_3)}
            </div>
        )
    }

    render() {
        return (
            <React.Fragment>
                {!this.props.removeFiles && this.props.fileHeader ? <div className="general-header" style={{ marginBottom: "-6px" }}>File Status</div> : null}
                {!this.props.removeFiles ? this._renderSummaryDetails() : null}
                {!this.props.removeClaims && this.props.claimHeader ? <div className="general-header">Claim Status</div> : null}
                {!this.props.removeClaims ? this.renderClaimDetails() : null}
            </React.Fragment>
        );
    }
}