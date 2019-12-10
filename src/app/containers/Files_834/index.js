import React from 'react';
import '../Files/files-styles.css';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import ReactPaginate from 'react-paginate';
import Urls from '../../../helpers/Urls';

export class Files_834 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            intakeClaims: [],
            page: 1,
            initialPage: 0,
            lineData: [],
            file: {},
            memberInfo: {},
            subscriberNo : '',
            enrollment_type : '',
            plan_code : '',
            coverage_data: [],
            flag: props.match.params.flag
        }

        this.getData = this.getData.bind(this)
        this.getClaimData = this.getClaimData.bind(this)
        this.renderList = this.renderList.bind(this)
        this.sortData = this.sortData.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    componentDidMount() {
        this.getData()
    }

    getData() {
        let query = '{SP_834FilecountwisedetailsGQL(Type:'+'"'+this.state.flag+'"'+'){ FileName FileID sender receiver FileStatus CreateDateTime dcount}}'

        fetch(Urls.base_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(r => {
                let data = []
                data = r.data.SP_834FilecountwisedetailsGQL

                this.setState({
                    intakeClaims: data
                })

                setTimeout(() => {
                    this.sortData()
                }, 50);
            })
            .then(data => console.log('data returned:', data));
    }

    getClaimData(FileID, ClaimID) {
        fetch(Urls.base_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: "{ IntakeClaimLineDataFileIDClaimID(FileID:\"" + FileID + "\",ClaimID:\"" + ClaimID + "\"){ ClaimID LX SVD02 ServiceDate SVD03 SVD05 ErrorCode type_of_adjustment adjustment RemainigAmt RemainingPatientLiability } }"
            })
        })
            .then(res => res.json())
            .then(r => {
                console.log("Here is the data hurray : " + JSON.stringify(r))
                this.setState({
                    lineData: r.data.IntakeClaimLineDataFileIDClaimID
                })
            })
            .then(data => console.log('data returned:', data));
    }

    onClick(fileId){
        let query = '{ SP_834FileDetailsPagingGQL(Type :'+'"'+this.state.flag+'"'+', PageIndex:'+this.state.page+', FileID: '+fileId+') { SubscriberNo fileid Enrollment_type InsLineCode TransCode MemberAmount Error CreateDateTime } }'

        fetch(Urls.base_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(r => {
                let data = []
                data = r.data.SP_834FileDetailsPagingGQL
                this.sortData(fileId, data)
            })
            .then(data => console.log('data returned:', data));
    }

    sortData(fileId, data) {
        let files = {}
        let intakeClaims = this.state.intakeClaims

        if(fileId && data){
            files = this.state.claimsObj
            if (fileId in files) {
                files[fileId].array = []
                data.forEach(item => {
                    files[fileId].array.push(item)
                });
            }
        } else {
            intakeClaims.forEach(item => {
                files[item.FileID] = {
                    value: item,
                    array: []
                }
            })
        }

        this.setState({
            claimsObj: files
        })
    }

    handleClick(fileId, subscriber, type) {
        let query = '{ SP_834FileHeaderDetails(FileID: '+'"'+fileId +'"'+', Subscriber:'+'"'+subscriber +'"'+', Type: '+type +') { FileName FileID sender receiver SubscriberNo MemberFName MemberLName Telephone StreetAddress City State PostalCode Enrollment_type dob gender InsLineCode MemberAmount EnrollmentStatus StartDate EndDate CreateDateTime relationship member_relationship_name } }'
        console.log("Query : " + query)
        fetch(Urls.base_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(r => {
                let data = []
                data = r.data.SP_834FileHeaderDetails
                let file = [
                    {key : "File Name", value : data[0].FileName},
                    {key : "Sender", value : data[0].sender},
                    {key : "Receiver", value : data[0].receiver}
                ]

                let memberInfo = [
                    {key : "First Name", value: data[0].MemberFName},
                    {key : "Last Name", value: data[0].MemberLName},
                    {key : "Telephone", value: data[0].Telephone},
                    {key : "Address", value: data[0].StreetAddress},
                    {key : "City", value: data[0].City},
                    {key : "State", value: data[0].State},
                    {key : "Postal Code", value: data[0].PostalCode},
                    {key : "Enrollment Type", value: data[0].Enrollment_type},
                    {key : "Dob", value: data[0].dob},
                    {key : "Gender", value: data[0].gender},
                ]

                let coverage_data = []
                data.forEach(element => {
                    coverage_data.push({
                        'startDate': element.StartDate,
                        'endDate': element.EndDate
                    })
                });

                this.setState({
                    file: file,
                    memberInfo: memberInfo,
                    coverage_data: coverage_data
                })
            })
            .then(data => console.log('data returned:', data));
    }

    renderTableHeader() {
        return (
            <div className="row">
                <div className="col-4 col-header">File Name</div>
                <div className="col-2 col-header">File Date</div>
                <div className="col-2 col-header">State</div>
                <div className="col-2 col-header">Submitter</div>
                <div className="col-2 col-header">Receiver</div>
            </div>
        )
    }

    renderClaimsHeader() {
        return (
            <tr className="table-head claims-text">				
                <td className="table-head-text">Subscriber No</td>
                <td className="table-head-text">Enrollment Type</td>
                <td className="table-head-text list-item-style">Plan Code</td>
                <td className="table-head-text list-item-style">Member Amount</td>
                <td className="table-head-text list-item-style">Error Code</td>
            </tr>
        )
    }

    renderCoverageHeader() {
        return (
            <tr className="table-head">
                <td className="table-head-text small-font">Subscriber No</td>
                <td className="table-head-text small-font">Enrollment Type</td>
                <td className="table-head-text  small-font list-item-style">Plan Code</td>
                <td className="table-head-text  small-font list-item-style">Coverage Start Date</td>
                <td className="table-head-text  small-font list-item-style">Coverage End Date</td>
            </tr>
        )
    }

    handlePageClick(data, fileId){
        let page = data.selected + 1
        this.setState({
            page : page
        })

        setTimeout(() => {
            this.onClick(fileId)
        }, 50);
    }

    renderList() {
        let row = []
        let col = []
        let data = this.state.claimsObj;

        Object.keys(data).map((keys) => {
            let count = data[keys].value.dcount / 10
            if(data[keys].value.dcount % 10 > 0){
                count = count + 1
            }

            row.push(
                <div className="row">
                    <div className="col-4 col-style"><a href={"#" + data[keys].value.FileID} onClick={() => {this.onClick(data[keys].value.FileID)}} style={{ color: "#6AA2B8" }} data-toggle="collapse" aria-expanded="false">{data[keys].value.FileName}</a></div>
                    <div className="col-2 col-style">{moment(data[keys].value.CreateDateTime).format('MM/DD/YYYY')}<br />{moment(data[keys].value.CreateDateTime).format('h:m a')}</div>
                    <div className="col-2 col-style">{data[keys].value.sender}</div>
                    <div className="col-2 col-style">{data[keys].value.receiver}</div>
                    <div className={"col-2 col-style"}>{data[keys].value.FileStatus}</div>
                </div>
            )

            {
                col = []
                data[keys].array.forEach(item => {
                    col.push(
                        <tr>
                            <td className="list-item-style claims-text"><a href="#" style={{ color: "#6AA2B8" }} 
                                onClick={() => { 
                                    this.setState({
                                        subscriberNo: item.SubscriberNo,
                                        enrollment_type: item.Enrollment_type,
                                        plan_code: item.InsLineCode,
                                    })

                                    setTimeout(() => {
                                        this.handleClick(keys, item.SubscriberNo, 2)
                                    }, 50);
                                }}>{item.SubscriberNo}</a></td>
                            <td className="list-item-style claims-text">{item.Enrollment_type}</td>
                            <td className="list-item-style claims-text">{item.InsLineCode}</td>
                            <td className="list-item-style claims-text">{item.MemberAmount}</td>
                            <td className="list-item-style claims-text">{item.Error}</td>
                        </tr>
                    )
                })
            }

            row.push(
                <div id={keys} className="collapse">
                    <table id="" className="table table-bordered claim-list">
                        {this.renderClaimsHeader()}
                        {col}
                    </table>
                    <ReactPaginate
                        previousLabel={'previous'}
                        nextLabel={'next'}
                        breakLabel={'...'}
                        breakClassName={'page-link'}
                        initialPage={this.state.initialPage}
                        pageCount={count}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={(page) => {this.handlePageClick(page, keys)}}
                        containerClassName={'pagination'}
                        pageClassName={'page-item'}
                        previousClassName={'page-link'}
                        nextClassName={'page-link'}
                        pageLinkClassName={'page-link'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'}
                        />
                </div>
            ) 
        });

        return (
            <div>
                {this.renderTableHeader()}
                {row}
            </div>
        );
    }

    renderHeader(header) {
        return (
            <tr className="table-head">
                <td className="table-head-text">{header}</td>
            </tr>
        )
    }

    renderRows(dictionary) {
        let row = []
        let col = []
        let count = 0

        dictionary.forEach(item => {
            col.push(
                <div className="col">
                    <div className="header">{item.key}</div>
                    <div>{item.value}</div>
                </div>
            )

            if (col.length % 4 == 0) {
                row.push(<div className="row">{col}</div>)
                col = []
            }
            count++
            if (count == dictionary.length && col.length > 0) {
                row.push(<div className="row">{col}</div>)
            }
        });

        return (
            <div className="summary-style">
                {row}
            </div>
        )
    }

    renderTable() {
        let row = []
        const data = this.state.coverage_data;

        data.forEach((item) => {
            row.push(
                <tr>
                    <td className="claim-line-data">{this.state.subscriberNo}</td>
                    <td className="claim-line-data">{this.state.enrollment_type}</td>
                    <td className="claim-line-data">{this.state.plan_code}</td>
                    <td className="claim-line-data">{item.startDate}</td>
                    <td className="claim-line-data">{item.endDate}</td>
                </tr>
            )
        });

        return (
            <tbody>
                {row}
            </tbody>
        )
    }

    renderSummary() {
        return (
            <div>
                {
                    this.state.file && this.state.file.length > 0 ?
                        <table className="table claim-list">
                            {this.renderHeader('File')}
                            {this.renderRows(this.state.file)}
                        </table> : null
                }
                {
                    this.state.memberInfo && this.state.memberInfo.length > 0 ?
                        <table className="table claim-list">
                            {this.renderHeader('Member Info')}
                            {this.renderRows(this.state.memberInfo)}
                        </table> : null
                }
                {
                    this.state.coverage_data.length > 0 ?
                        <div>
                            <div className="table-head header-style claim-list">Coverage Data</div>
                            <table className="table-bordered body-style">
                                {this.renderCoverageHeader()}
                                {this.renderTable()}
                            </table> 
                        </div> : null
                }
            </div>
        );
    }

    render() {
        return (
            <div className="row padding-left">
                <div className="col-7 claim-list file-table">
                    {this.state.claimsObj ? this.renderList() : null}
                </div>
                <div className="col-5">
                    {this.renderSummary()}
                </div>
            </div>
        );
    }
}