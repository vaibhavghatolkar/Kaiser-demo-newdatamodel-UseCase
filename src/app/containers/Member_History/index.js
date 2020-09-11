import React from 'react';
import '../Files/files-styles.css';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import ReactPaginate from 'react-paginate';
import Urls from '../../../helpers/Urls';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { Filters } from '../../components/Filters';
import DatePicker from "react-datepicker";
import { StateDropdown } from '../../components/StateDropdown';
import { Tiles } from '../../components/Tiles';
import { ServersideGrid } from '../../components/ServersideGrid';
import Strings from '../../../helpers/Strings';
import person from '../../assets/Images/person.svg';
const $ = window.$;
var val_1 = ''
var val_2 = ''

export class Member_History extends React.Component {

    constructor(props) {
        super(props);
        process.env.NODE_ENV == 'development' && console.log("sdfhdshv", props)
        let condition = props.location.state && props.location.state.data && props.location.state.data.length > 0
        this.state = {
            intakeClaims: [],
            page: 1,
            initialPage: 0,
            lineData: [],
            file: {},
            memberInfo: {},
            memberDetails834: {},
            File_ID: '',
            MonthlyStatus: '',
            subscriberNo: '',
            enrollment_type: '',
            showDetails:false,
            ethnicid: '',
            planname: '',
            planid: '',
            enrollid: '',
            memid: '',
            ratecode: '',
            primarylanguage: '',

            plan_code: '',
            coverage_data: [],
            error_status: '',
            Error_Field: '',
            isInitial: true,
            Total: 'total',
            domLayout: 'autoHeight',
            paginationPageSize: 5,
            rowData: [],
            rowData_CoverageData: [],
            rowData_EnrollmentLevel: [],
            selected_fileId: '',
            ErrorDescClicked: '',

            filter_dob: '',
            filter_gender: '',
            filter_firstName: '',
            filter_lastName: '',

            State: condition && props.location.state.data[0].State && props.location.state.data[0].State != 'n' ? props.location.state.data[0].State : 'UT',
            startDate: condition && props.location.state.data[0] && props.location.state.data[0].startDate != 'n' ? props.location.state.data[0].startDate : '',
            endDate: condition && props.location.state.data[0] && props.location.state.data[0].endDate != 'n' ? props.location.state.data[0].endDate : '',
            subtitle: condition && props.location.state.data[0] && props.location.state.data[0].subtitle ? props.location.state.data[0].subtitle : '',
            Status_Enrollment: condition && props.location.state.data[0] && props.location.state.data[0].status ? props.location.state.data[0].status : '',
            maintenance_Code: condition && props.location.state.data[0] && props.location.state.data[0].MaintenanceCode ? props.location.state.data[0].MaintenanceCode : '',
            incoming_FileID: condition && props.location.state.data[0] && props.location.state.data[0].incoming_fileId ? props.location.state.data[0].incoming_fileId : '',
            dob: '',
            defaultColDef: {
                cellClass: 'cell-wrap-text',
                autoHeight: true,
                sortable: true,
                resizable: true,
                filter: true,

            },

        }

        this.getData = this.getData.bind(this)
        this.getClaimData = this.getClaimData.bind(this)
        this.renderList = this.renderList.bind(this)
        this.sortData = this.sortData.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.Ignore = this.Ignore.bind(this)
        this.Saved = this.Saved.bind(this)
        this.onClick = this.onClick.bind(this)
        this.handle_dob = this.handle_dob.bind(this);
        this.handle_emp_begindate = this.handle_emp_begindate.bind(this);
    }

    componentDidMount() {
        this.onClick()
    }

    handle_dob(date) {
        this.setState({
            dob: date,
            Updatefild: this.state.Error_Field == 'dob' ? date ? moment(date).format('YYYY-MM-DD') : "" : ''
        });

    };
    handle_emp_begindate(date) {
        this.setState({
            DTP_336_Employment_BeginDT: date,
            Updatefild: this.state.Error_Field == 'DTP_336_Employment_BeginDT' ? date ? moment(date).format('YYYY-MM-DD') : "" : ''
        });

    };

    Ignore() {
        process.env.NODE_ENV == 'development' && console.log(this.state.File_ID);
        var query = 'mutation{ SP_Ignore834errordetails(FileId :"' + this.state.File_ID + '" ' + 'Nm109 :"' + this.state.subscriberNo + '"' +
            ')' +
            '}'
        fetch(Urls._base_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query

            })
        })
            .then(r => r.json())
            .then(data =>
                alert(data.data.SP_Ignore834errordetails),
                setTimeout(() => {
                    window.location.reload()
                }, 1000)

            );
    }


    Saved() {
        process.env.NODE_ENV == 'development' && console.log(this.state.subscriberNo);
        if (this.state.Updatefild != undefined && this.state.Updatefild != "") {
            var query = `mutation{
            UpdateErrorField834( RefID:`+ this.state.RefID + `  ErrorField:"` + this.state.Error_Field + `" ResubmitValue:"` + this.state.Updatefild + `" )
          }`


            fetch(Urls._transaction834, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    query

                })
            })
                .then(r => r.json())
                .then(data =>
                    alert(data.data.UpdateErrorField834),
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000)


                );
        }




    }


    getData() {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''

        let query = `{Dashboard834FileDetails(State:"${this.state.State}",StartDt:"${startDate}",EndDt:"${endDate}", RecType:"Inbound", Status:"${this.state.Status_Enrollment}",FileID:"${this.state.incoming_FileID}",MaintenanceCode:"${this.state.maintenance_Code}") {
            FileName
            Date
            Subscriber
            Enrollment
            Error
            FileStatus
            FileID
           }
        }`

        process.env.NODE_ENV == 'development' && console.log('query : ' + query)
        fetch(Urls._transaction834, {
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
                data = r.data.Dashboard834FileDetails

                this.setState({
                    intakeClaims: data,
                    rowData: data
                })

                setTimeout(() => {
                    this.sortData()
                }, 50);
            })
            .then(data => process.env.NODE_ENV == 'development' && console.log('data returned:', data));
    }

    getClaimData(FileID, ClaimID) {
        fetch(Urls._claim_details, {
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
                process.env.NODE_ENV == 'development' && console.log("Here is the data hurray : " + JSON.stringify(r))
                this.setState({
                    lineData: r.data.IntakeClaimLineDataFileIDClaimID
                })
            })
            .then(data => process.env.NODE_ENV == 'development' && console.log('data returned:', data));
    }

    onClick(fileId) {
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ''
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ''
        let filter_dob = this.state.filter_dob ? moment(this.state.filter_dob).format('YYYY-MM-DD') : ''

        if (!fileId) {
            fileId = ''
        }
        // let query = '{ SP_834FileDetailsPagingGQL(Type :'+'"'+this.state.Total +'"'+', PageIndex:'+this.state.page+', FileID: '+fileId+') { SubscriberNo fileid Enrollment_type InsLineCode Insurer_Status TransCode MemberAmount Error CreateDateTime status1 } }'
        // Summary834(State:"${this.state.State}",StartDt:"${startDate}",EndDt:"${endDate}",FileID:"${fileId}",Status:"${this.state.Status_Enrollment}", RecType:"Inbound", MaintenanceCode:"${this.state.maintenance_Code}")  {
        let query = `{
            Summary834QNXT (State:"${this.state.State}",Dob:"${filter_dob}",Gender:"${this.state.filter_gender}",FirstName:"${this.state.filter_firstName}",LastName:"${this.state.filter_lastName}") {
                RefID
                FirstName
                LastName
                Telephone
                StreetAddress
                City
                State
                zip
                dob
                gender
                SubscriberNo
                Department_Agency
                Insurer_Status
                Insurer_Name
                enrolltyp
                N1_Plan_insurer_name
                Emplymentstatus
                Member_Policy_No
                Employment_BeginDT
                MonthlyFileStatus
                enrollid
            }
        }`

        process.env.NODE_ENV == 'development' && console.log(query)
        fetch(Urls._transaction834, {
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
                data = r.data.Summary834QNXT
                process.env.NODE_ENV == 'development' && console.log(data);
                this.setState({
                    rowData_EnrollmentLevel: data,
                    selected_fileId: fileId
                })
                this.sortData(fileId, data)
            })
            .then(data => process.env.NODE_ENV == 'development' && console.log('data returned:', data));
    }

    sortData(fileId, data) {
        let files = {}
        let intakeClaims = this.state.intakeClaims

        if (fileId && data) {
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
            claimsObj: files,
        })

        setTimeout(() => {
            this.setState({ isInitial: false })
        }, 500);
    }

    onChangeName(event, key) {

        this.setState({
            [key]: event.target.value,
            Updatefild: this.state.Error_Field == key ? event.target.value : ''

        });
    }
    memberDetails(RefID, SubscriberNo) {
        let query = `{
            MemberDetails834QNXT(RefID:${RefID}) {
                FirstName
                LastName
                Telephone
                StreetAddress
                City
                State
                zip
                dob
                gender
                SubscriberNo
                Insurer_Name
                N1_Plan_insurer_name
                Emplymentstatus
                Member_Policy_No
                Employment_BeginDT
                MonthlyFileStatus
                ethnicid
                planname
                planid
                enrollid
                memid
                ratecode
                primarylanguage
            }
        }`
        process.env.NODE_ENV == 'development' && console.log('query : ', query)
        fetch(Urls._transaction834, {
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
                data = r.data.MemberDetails834QNXT
                // let coverage_data = r.data.MemberCoverageDetails834

                if (!data || (data && data.length == 0)) {
                    return
                }
                var CheckError = data[0].ErrorField;

                let memberInfo = [
                    { key: "First Name", value: data[0].FirstName },
                    { key: "Last Name", value: data[0].LastName },
                    { key: "Telephone", value: data[0].Telephone },
                    { key: "Address", value: data[0].StreetAddress },
                    { key: "City", value: data[0].City },
                    { key: "State", value: data[0].State },
                    { key: "Postal Code", value: data[0].zip },
                    { key: "Insurer Name", value: data[0].N1_Plan_insurer_name },
                    { key: "Dob", value: data[0].dob },
                    { key: "Gender", value: data[0].gender },
                    { key: "Subscriber No", value: data[0].SubscriberNo },
                    { key: "Policy No", value: data[0].Member_Policy_No },
                    { key: "Employment Begin Date", value: data[0].Employment_BeginDT },
                ]

                this.state.textbox == true ?
                    this.setState({
                        memberInfoPop: memberInfo,
                        Error_Field: data[0].ErrorField,
                        MemberFName: data[0].FirstName,
                        MemberLName: data[0].LastName,
                        StreetAddress: data[0].StreetAddress,
                        PostalCode: data[0].zip,
                        Gender: data[0].gender,
                        SubscriberNo: data[0].SubscriberNo,
                        dob: data[0].dob,
                        City: data[0].City,
                        State: data[0].State,
                        Ref_1L_CustomerPolicy_No: data[0].Member_Policy_No,
                        DTP_336_Employment_BeginDT: data[0].Employment_BeginDT,
                        N1_Plan_insurer_name: data[0].N1_Plan_insurer_name,
                        Emplymentstatus: data[0].Emplymentstatus,
                        MonthlyStatus: data[0].MonthlyFileStatus,
                        Telephone: data[0].Telephone,

                        ethnicid: data[0].ethnicid,
                        planname: data[0].planname,
                        planid: data[0].planid,
                        enrollid: data[0].enrollid,
                        memid: data[0].memid,
                        ratecode: data[0].ratecode,
                        primarylanguage: data[0].primarylanguage,
                    }) : this.setState({
                        memberDetails834: memberInfo,
                        // rowData_CoverageData: coverage_data,
                        Error_Field: data[0].ErrorField,

                    })

            })

    }


    handleClick(fileId, subscriber, type) {
        let query = '{ SP_834FileHeaderDetails(FileID: ' + '"' + fileId + '"' + ', Subscriber:' + '"' + subscriber + '"' + ', Type: ' + type + ') { FileName FileID sender receiver SubscriberNo MemberFName MemberLName Telephone StreetAddress City State PostalCode Enrollment_type dob gender InsLineCode MemberAmount EnrollmentStatus StartDate EndDate CreateDateTime relationship member_relationship_name } }'
        process.env.NODE_ENV == 'development' && console.log('query : ', query)
        fetch(Urls._enrollment_details, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(r => {
                let data1 = []
                data1 = r.data.SP_834FileHeaderDetails


                let coverage_data = []
                data1.forEach(element => {
                    coverage_data.push({
                        'startDate': element.StartDate,
                        'endDate': element.EndDate
                    })
                });

                this.setState({
                    coverage_data: coverage_data
                })
            })
            .then(data => process.env.NODE_ENV == 'development' && console.log('data returned:', data));

        let query1 = '{ SP_834EnrollementDetails(FileID: ' + '"' + fileId + '"' + ', Subscriber:' + '"' + subscriber + '") { FileName   FileID   sender   receiver   IdentificationCode   InsurerStatus   SubscriberNo   MemberFName   MemberLName   Telephone   StreetAddress   City   State   PostalCode   Enrollment_type   dob   gender   Emplymentstatus   CreateDateTime   INS_Insurer_relationship   member_relationship_name   Plan_Coverage_Level   DTP_336_Employment_BeginDT   Member_Policy_No   Department_Agency   Error_Field   N1_Plan_insurer_name } }'

        fetch(Urls._enrollment_details, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query1 })
        })
            .then(res => res.json())
            .then(r => {
                let data = []
                data = r.data.SP_834EnrollementDetails

                let file = [
                    { key: "File Name", value: data[0].FileName },
                    { key: "File Date", value: data[0].CreateDateTime },
                    { key: "Sender", value: data[0].sender },
                ]

                var CheckError = data[0].Error_Field;
                var SubscriberNo = "";
                if (CheckError == "SubscriberNo") {
                    SubscriberNo = <input onChange={(e) => this.subscriber(e, 'subscriberNo')} className="form-control" type='text' style={{ width: "80px" }}></input>
                } else {
                    SubscriberNo = data[0].SubscriberNo
                }
                var Member_Policy_No = "";
                if (CheckError == "PolicyNo") {
                    Member_Policy_No = <input onChange={(e) => this.PolicyNo(e, 'PolicyNo')} className="form-control" type='text' style={{ width: "80px" }}></input>
                } else {
                    Member_Policy_No = data[0].Member_Policy_No
                }
                var dateofbirth = "";

                if (CheckError == "dob") {
                    dateofbirth = <input onChange={(e) => this.dateofbirth(e, 'dateofbirth')} type='text' style={{ width: "80px" }}></input>
                } else {
                    dateofbirth = data[0].dob
                }

                var gender = "";

                if (CheckError == "gender") {
                    gender = <input type='text' onChange={(e) => this.gender(e, 'gender')} style={{ width: "80px" }}></input>
                } else {
                    gender = data[0].gender
                }
                var DepartmentNo = "";

                if (CheckError == "DTP336") {
                    DepartmentNo = <input type='text' onChange={(e) => this.DepartmentNo(e, 'DepartmentNo')} style={{ width: "80px" }}></input>
                } else {
                    DepartmentNo = data[0].DTP_336_Employment_BeginDT
                }
                let memberInfo = [
                    { key: "First Name", value: data[0].MemberFName },
                    { key: "Last Name", value: data[0].MemberLName },
                    { key: "Telephone", value: data[0].Telephone },
                    { key: "Address", value: data[0].StreetAddress },
                    { key: "City", value: data[0].City },
                    { key: "State", value: data[0].State },
                    { key: "Postal Code", value: data[0].PostalCode },
                    { key: "Insurer Name", value: data[0].N1_Plan_insurer_name },
                    { key: "Dob", value: dateofbirth },
                    { key: "Gender", value: gender },
                    { key: "Subscriber No", value: SubscriberNo },
                    { key: "Department Agency", value: data[0].Department_Agency },
                    { key: "Policy No", value: Member_Policy_No },
                    { key: "Enrollment Type", value: data[0].Enrollment_type },
                    { key: "Employment Begin Date", value: DepartmentNo },
                    { key: "Insurer Status", value: data[0].InsurerStatus },
                    { key: "Relationship", value: data[0].member_relationship_name },
                    { key: "Employment Status", value: data[0].Emplymentstatus },



                ]

                this.setState({
                    file: file,
                    memberInfo: memberInfo,
                    File_ID: fileId,
                    Error_Field: data[0].Error_Field,

                })
            })
            .then(data => process.env.NODE_ENV == 'development' && console.log('data returned:', data));

    }

    rendersearchbar() {
        return (
            <div>
                <div className="row">

                    <input type="text" name="name" className="input-style" placeholder="Search" />
                </div>
                <hr class="colorhr"></hr>

            </div>
        )
    }

    renderTableHeader() {
        return (

            <div className="row">
                <div className="col-5 col-header justify-align" style={{ fontWeight: "bold" }}>File Name <img src={require('../../components/Images/search_table.png')} style={{ marginRight: '4px' }} className="SearchBarImage"></img></div>
                <div className="col-3 col-header justify-align" style={{ fontWeight: "bold" }}>File Date <img src={require('../../components/Images/search_table.png')} style={{ marginRight: '4px' }} className="SearchBarImage"></img></div>
                <div className="col-2 col-header justify-align" style={{ fontWeight: "bold" }}>Submitter <img src={require('../../components/Images/search_table.png')} style={{ marginRight: '4px' }} className="SearchBarImage"></img></div>
                <div className="col-2 col-header justify-align" style={{ fontWeight: "bold" }}>File Status <img src={require('../../components/Images/search_table.png')} style={{ marginRight: '4px' }} className="SearchBarImage"></img></div>
            </div>
        )
    }

    renderClaimsHeader() {
        return (
            <tr className="table-head claims-text">
                <td className="table-head-text">Subscriber No <img src={require('../../components/Images/search_table.png')} className="SearchBarImage"></img></td>
                <td className="table-head-text">Enrollment Type <img src={require('../../components/Images/search_table.png')} className="SearchBarImage"></img></td>
                <td className="table-head-text list-item-style">Insurer Status <img src={require('../../components/Images/search_table.png')} className="SearchBarImage"></img></td>
                <td className="table-head-text list-item-style">Status <img src={require('../../components/Images/search_table.png')} className="SearchBarImage"></img></td>
                <td className="table-head-text list-item-style">Error Code<img src={require('../../components/Images/search_table.png')} className="SearchBarImage"></img></td>
            </tr>
        )
    }

    renderCoverageHeader() {
        return (
            <tr className="table-head">
                {/* <td className="table-head-text small-font">Subscriber No</td>*/}
                <td className="table-head-text small-font">Enrollment Type <img src={require('../../components/Images/search_table.png')} className="SearchBarImage"></img></td>
                <td className="table-head-text  small-font list-item-style">Plan Code <img src={require('../../components/Images/search_table.png')} className="SearchBarImage"></img></td>
                <td className="table-head-text  small-font list-item-style">Coverage Start Date <img src={require('../../components/Images/search_table.png')} className="SearchBarImage"></img></td>
                <td className="table-head-text  small-font list-item-style">Coverage End Date <img src={require('../../components/Images/search_table.png')} className="SearchBarImage"></img></td>
            </tr>
        )
    }

    handlePageClick(data, fileId) {
        let page = data.selected + 1
        this.setState({
            page: page,
        })

        setTimeout(() => {
            this.onClick(fileId)
        }, 50);
    }

    renderList() {
        let row = []
        let col = []
        let data = this.state.claimsObj;
        process.env.NODE_ENV == 'development' && console.log('this is the data ', data)
        Object.keys(data).map((keys) => {
            row.push(
                <div className="row">
                    <div className="col-5 col-style border-left"><a href={"#" + data[keys].value.FileID}
                        onClick={() => {
                            this.onClick(data[keys].value.FileID)
                        }} style={{ color: "#6AA2B8" }} data-toggle="collapse" aria-expanded="false">{data[keys].value.FileName}</a></div>
                    <div className="col-3 col-style">{moment(data[keys].value.CreateDateTime).format('DD/MM/YYYY, ')}<br />{moment(data[keys].value.CreateDateTime).format('hh:mm a')}</div>
                    <div className="col-2 col-style">{data[keys].value.sender}</div>
                    <div className={"col-2 col-style"}>{data[keys].value.FileStatus}</div>
                </div>
            )

            {
                col = []
                data[keys].array.forEach(item => {
                    process.env.NODE_ENV == 'development' && console.log(item.Insurer_Status);
                    col.push(
                        <tr>

                            <td className="list-item-style claims"><a className="clickable" style={{ color: "#6AA2B8" }}
                                onClick={() => {
                                    this.setState({
                                        subscriberNo: item.SubscriberNo,
                                        enrollment_type: item.Enrollment_type,
                                        Insurer_Status: item.Insurer_Status,
                                        error_status: item.Error_Field

                                    })

                                    setTimeout(() => {
                                        this.handleClick(keys, item.SubscriberNo, 2)
                                    }, 50);
                                }}>{item.SubscriberNo}</a></td>
                            <td className="list-item-style claims">{item.Enrollment_type}</td>
                            <td className="list-item-style claims">{item.Insurer_Status}</td>
                            <td className="list-item-style claims">{item.status1}</td>
                            <td className="list-item-style claims">{item.Error}</td>

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
                        pageCount={Math.floor((data[keys].value.dcount / 10) + (data[keys].value.dcount % 10 > 0 ? 1 : 0))}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={(page) => { this.handlePageClick(page, keys) }}
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


    // renderHeader(header) {
    //     return (
    //         <tr className="table-head">
    //             <td className="table-head-text">{header}</td>
    //         </tr>
    //     )
    // }

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

            if (col.length % 6 == 0) {
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
    renderButton() {
        if (this.state.Error_Field != "") {
            return (

                <div style={{ padding: "5px" }}>

                    <button onClick={this.Saved} style={{ backgroundColor: "#139DC9", color: "#FFFFFF" }}>Correct & Resubmit</button>
                    {/* <button onClick={this.Ignore} style={{backgroundColor:"#139DC9" ,color:"#FFFFFF"}}>Ignore Error</button> */}
                </div>
            )
        }
    }
    renderTable() {
        let row = []
        const data = this.state.coverage_data;
        process.env.NODE_ENV == 'development' && console.log("testing", data);
        data.forEach((item) => {
            row.push(
                <tr>
                    {/*  <td className="claim-line-data">{this.state.subscriberNo}</td> */}
                    <td className="claim-line-data">{this.state.enrollment_type}</td>
                    <td className="claim-line-data">{this.state.Insurer_Status}</td>
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

    renderMemberinfo() {
        let Error_Field = this.state.Error_Field
        return (

            <div>
                <h2 style={{ fontSize: "18px" }}>Member Information</h2>
                <div class="form-row">

                    <br></br>
                    <div class="form-group col-md-3">
                        <label>Enrollment Id</label>
                        <input readonly="true" value={this.state.enrollid == null ? '' : this.state.enrollid} onChange={(e) => this.onChangeName(e, 'enrollid')} class="form-control" placeholder=""></input>
                    </div>
                    <div class="form-group col-md-3">
                        <label>Member Id</label>
                        <input readonly="true" value={this.state.memid == null ? '' : this.state.memid} onChange={(e) => this.onChangeName(e, 'memid')} class="form-control" placeholder=""></input>
                    </div>

                    <div class="form-group col-md-3">
                        <label>First Name</label>
                        <input value={this.state.MemberFName == null ? '' : this.state.MemberFName} onChange={(e) => this.onChangeName(e, 'MemberFName')} class="form-control" placeholder=""></input>
                    </div>
                    <div class="form-group col-md-3">
                        <label>Last Name</label>
                        <input value={this.state.MemberLName == null ? '' : this.state.MemberLName} onChange={(e) => this.onChangeName(e, 'MemberLName')} class="form-control" placeholder=""></input>
                    </div>
                    <div class="form-group col-md-3">
                        <label>Telephone</label>
                        <input value={this.state.Telephone == null ? '' : this.state.Telephone} onChange={(e) => this.onChangeName(e, 'Telephone')} class="form-control" placeholder=""></input>
                    </div>
                    <div class="form-group col-md-3">
                        <label>Address</label>
                        <input value={this.state.StreetAddress == null ? '' : this.state.StreetAddress} onChange={(e) => this.onChangeName(e, 'StreetAddress')} class="form-control" placeholder=""></input>
                    </div>
                    <div class="form-group col-md-3">
                        <label>City</label>
                        <input value={this.state.City == null ? '' : this.state.City} onChange={(e) => this.onChangeName(e, 'City')} class="form-control" placeholder=""></input>
                    </div>
                    <div class="form-group col-md-3">
                        <label>State</label>
                        <input value={this.state.State == null ? '' : this.state.State} onChange={(e) => this.onChangeName(e, 'State')} class="form-control" placeholder=""></input>
                    </div>
                    <div class="form-group col-md-3">
                        <label>Postal Code</label>
                        <input value={this.state.PostalCode == null ? '' : this.state.PostalCode} onChange={(e) => this.onChangeName(e, 'PostalCode')} class="form-control" placeholder=""></input>
                    </div>
                    <div class="form-group col-md-3">
                        <label>Insurer Name</label>
                        <input value={this.state.N1_Plan_insurer_name == null ? '' : this.state.N1_Plan_insurer_name} onChange={(e) => this.onChangeName(e, 'N1_Plan_insurer_name')} class="form-control" placeholder=""></input>
                    </div>

                    <div class="form-group col-md-3">
                        <label>Dob</label>
                        <DatePicker className="form-control" value={this.state.dob == null ? '' : this.state.dob}
                            selected={this.state.dob ? new Date(moment(this.state.dob).format('YYYY-MM-DD hh:mm')) : ''}
                            onChange={this.handle_dob}></DatePicker>
                    </div>
                    <div class="form-group col-md-3">
                        <label>Gender</label>
                        <input value={this.state.Gender == null ? '' : this.state.Gender} onChange={(e) => this.onChangeName(e, 'Gender')} class="form-control" placeholder=""></input>

                    </div>
                    <div class="form-group col-md-3">
                        <label>Subscriber No</label>
                        <input value={this.state.SubscriberNo == null ? '' : this.state.SubscriberNo} onChange={(e) => this.onChangeName(e, 'SubscriberNo')} class="form-control" placeholder=""></input>
                    </div>
                    <div class="form-group col-md-3">
                        <label>Policy No</label>
                        <input value={this.state.Ref_1L_CustomerPolicy_No == null ? '' : this.state.Ref_1L_CustomerPolicy_No} onChange={(e) => this.onChangeName(e, 'Ref_1L_CustomerPolicy_No')} class="form-control" placeholder=""></input>
                    </div>
                    <div class="form-group col-md-3">
                        <label>Monthly Status</label>
                        <input value={this.state.MonthlyStatus == null ? '' : this.state.MonthlyStatus} onChange={(e) => this.onChangeName(e, 'MonthlyStatus')} class="form-control" placeholder=""></input>
                    </div>

                    <div class="form-group col-md-3">
                        <label>Ethnic Id</label>
                        <input value={this.state.ethnicid == null ? '' : this.state.ethnicid} onChange={(e) => this.onChangeName(e, 'ethnicid')} class="form-control" placeholder=""></input>
                    </div>
                    <div class="form-group col-md-3">
                        <label>Plan Name</label>
                        <input value={this.state.planname == null ? '' : this.state.planname} onChange={(e) => this.onChangeName(e, 'planname')} class="form-control" placeholder=""></input>
                    </div>
                    <div class="form-group col-md-3">
                        <label>Plan Id</label>
                        <input value={this.state.planid == null ? '' : this.state.planid} onChange={(e) => this.onChangeName(e, 'planid')} class="form-control" placeholder=""></input>
                    </div>
                    <div class="form-group col-md-3">
                        <label>Rate Code</label>
                        <input value={this.state.ratecode == null ? '' : this.state.ratecode} onChange={(e) => this.onChangeName(e, 'ratecode')} class="form-control" placeholder=""></input>
                    </div>
                    <div class="form-group col-md-3">
                        <label>Primary Language</label>
                        <input value={this.state.primarylanguage == null ? '' : this.state.primarylanguage} onChange={(e) => this.onChangeName(e, 'primarylanguage')} class="form-control" placeholder=""></input>
                    </div>
                </div>

                <button onClick={this.Saved} type="submit" style={{ margin: "0px" }} class="btn btn-display">Save</button>
            </div>
        );
    }
    renderSummary() {

        return (
            <div>
                {/* {
                    this.state.file && this.state.file.length > 0 ?
                        <table className="table claim-Details border">
                            {this.renderHeader('File')}
                            {this.renderRows(this.state.file)}
                        </table> : null
                } */}
                {
                    this.state.memberDetails834 && this.state.memberDetails834.length > 0 ?
                        <table className="table claim-Details border">
                            {this.renderHeader('Member Info')}
                            <div>
                                <label onClick={() => {
                                    this.memberDetails(this.state.RefID, this.state.subscriberNo)
                                    this.setState({
                                        showMemberInfo: true,
                                        textbox: true

                                    })
                                    $('#MemberInfoDialogbox').modal('show')

                                }} className="clickable1 underline-label" style={{ float: 'right', fontSize:'12px', marginRight: '20px', color: "#139DC9", fontWeight: 'bold' }}> Edit</label><br></br> </div>
                            {this.renderRows(this.state.memberDetails834)}
                            <br></br>
                            {/* {this.renderButton()} */}

                        </table> : null
                }
                {
                    this.state.rowData_CoverageData.length > 0 ?
                        <div>

                            {/* {this.renderCoverageHeader()}
                                {this.renderTable()} */}
                            {this.renderCoverageTable()}

                        </div> : null
                }
            </div>
        );
    }



    renderTableEnrollmentLevel() {
      let  Summary834QNXT= [
            {
              "RefID": "6781562",
              "FirstName": "Coleman",
              "LastName": "Rose",
              "Telephone": "8018159808",
              "StreetAddress": "443 N 300 W",
              "City": "SALT LAKE CITY",
              "State": "UT",
              "zip": "841031220",
              "dob": "07-20-1942",
              "gender": "M",
              "SubscriberNo": "904226041",
              "Department_Agency": "",
              "Insurer_Status": "",
              "Insurer_Name": "",
              "enrolltyp": null,
              "N1_Plan_insurer_name": "",
              "Emplymentstatus": "",
              "Member_Policy_No": null,
              "Employment_BeginDT": "",
              "MonthlyFileStatus": "Active",
              "enrollid": "UTA172034999319"
            },
            {
              "RefID": "6782488",
              "FirstName": "Cunningham",
              "LastName": "Charles",
              "Telephone": "4354145099",
              "StreetAddress": "PO BOX 416",
              "City": "TOQUERVILLE",
              "State": "UT",
              "zip": "847740416",
              "dob": "11-02-1998",
              "gender": "F",
              "SubscriberNo": "807456776",
              "Department_Agency": "",
              "Insurer_Status": "",
              "Insurer_Name": "",
              "enrolltyp": null,
              "N1_Plan_insurer_name": "",
              "Emplymentstatus": "",
              "Member_Policy_No": null,
              "Employment_BeginDT": "",
              "MonthlyFileStatus": "Active",
              "enrollid": "UTA200148928375"
            },
            {
              "RefID": "6781576",
              "FirstName": "Sims",
              "LastName": "Tammy",
              "Telephone": "8015481561",
              "StreetAddress": "5727 W 5960 S",
              "City": "KEARNS ",
              "State": "UT",
              "zip": "841180000",
              "dob": "09-10-2016",
              "gender": "F",
              "SubscriberNo": "611725930",
              "Department_Agency": "",
              "Insurer_Status": "",
              "Insurer_Name": "",
              "enrolltyp": null,
              "N1_Plan_insurer_name": "",
              "Emplymentstatus": "",
              "Member_Policy_No": null,
              "Employment_BeginDT": "",
              "MonthlyFileStatus": "Active",
              "enrollid": "UTA182987545829"
            },
            {
              "RefID": "6781705",
              "FirstName": "Sniezek",
              "LastName": "Sue",
              "Telephone": "3852510609",
              "StreetAddress": "173 DAN ST",
              "City": "OGDEN",
              "State": "UT",
              "zip": "844047423",
              "dob": "04-20-1983",
              "gender": "F",
              "SubscriberNo": "700421740",
              "Department_Agency": "",
              "Insurer_Status": "",
              "Insurer_Name": "",
              "enrolltyp": null,
              "N1_Plan_insurer_name": "",
              "Emplymentstatus": "",
              "Member_Policy_No": null,
              "Employment_BeginDT": "",
              "MonthlyFileStatus": "Active",
              "enrollid": "UTA183397647321"
            },
            {
              "RefID": "7007282",
              "FirstName": "Morin",
              "LastName": "Dan",
              "Telephone": "8013895641",
              "StreetAddress": "1015 N 300 E",
              "City": "LAYTON",
              "State": "UT",
              "zip": "840412486",
              "dob": "2017-01-18",
              "gender": "F",
              "SubscriberNo": "0811802085",
              "Department_Agency": "",
              "Insurer_Status": "",
              "Insurer_Name": "",
              "enrolltyp": null,
              "N1_Plan_insurer_name": "",
              "Emplymentstatus": "",
              "Member_Policy_No": "MOLCHIP",
              "Employment_BeginDT": "",
              "MonthlyFileStatus": "Active",
              "enrollid": "UTA192988758576"
            },
            {
              "RefID": "6782150",
              "FirstName": "TIFFANEE                           ",
              "LastName": "ZENES                                             ",
              "Telephone": "4358308588",
              "StreetAddress": "6071 BAYSHORE DR                                            ",
              "City": "STANSBURY PARK                ",
              "State": "UT",
              "zip": "840749065",
              "dob": "07-15-1994",
              "gender": "F",
              "SubscriberNo": "808454440",
              "Department_Agency": "",
              "Insurer_Status": "",
              "Insurer_Name": "",
              "enrolltyp": null,
              "N1_Plan_insurer_name": "",
              "Emplymentstatus": "",
              "Member_Policy_No": null,
              "Employment_BeginDT": "",
              "MonthlyFileStatus": "Active",
              "enrollid": "UTA193588914495"
            },
            {
              "RefID": "6781871",
              "FirstName": "JOSE                               ",
              "LastName": "ZAZUETA                                           ",
              "Telephone": "3853948125",
              "StreetAddress": "4912 S 2825 W                                               ",
              "City": "ROY                           ",
              "State": "UT",
              "zip": "840678932",
              "dob": "03-31-2018",
              "gender": "M",
              "SubscriberNo": "912079333",
              "Department_Agency": "",
              "Insurer_Status": "",
              "Insurer_Name": "",
              "enrolltyp": null,
              "N1_Plan_insurer_name": "",
              "Emplymentstatus": "",
              "Member_Policy_No": null,
              "Employment_BeginDT": "",
              "MonthlyFileStatus": "Active",
              "enrollid": "UTA180946490580"
            },
            {
              "RefID": "6781578",
              "FirstName": "ESEQUIEL                           ",
              "LastName": "ZAVALA RAMIREZ                                    ",
              "Telephone": "8015576694",
              "StreetAddress": "3234 JASON PL                                               ",
              "City": "SALT LAKE CTY                 ",
              "State": "UT",
              "zip": "841197017",
              "dob": "11-18-1931",
              "gender": "M",
              "SubscriberNo": "404185420",
              "Department_Agency": "",
              "Insurer_Status": "",
              "Insurer_Name": "",
              "enrolltyp": null,
              "N1_Plan_insurer_name": "",
              "Emplymentstatus": "",
              "Member_Policy_No": null,
              "Employment_BeginDT": "",
              "MonthlyFileStatus": "Active",
              "enrollid": "UTA182987543407"
            },
            {
              "RefID": "7007112",
              "FirstName": "EMILY                              ",
              "LastName": "ZAUGG                                             ",
              "Telephone": "8018250381     ",
              "StreetAddress": "2306 S 2000 W                                               ",
              "City": "SYRACUSE                      ",
              "State": "UT",
              "zip": "840750000",
              "dob": "1938-03-30",
              "gender": "F",
              "SubscriberNo": "0700701352",
              "Department_Agency": "",
              "Insurer_Status": "",
              "Insurer_Name": "",
              "enrolltyp": null,
              "N1_Plan_insurer_name": "",
              "Emplymentstatus": "",
              "Member_Policy_No": "MOLINA",
              "Employment_BeginDT": "",
              "MonthlyFileStatus": "Active",
              "enrollid": "UTA143596536382"
            },
            {
              "RefID": "6781401",
              "FirstName": "ANNALIA                            ",
              "LastName": "ZARCO                                             ",
              "Telephone": "4355355386",
              "StreetAddress": "272 N 400 E                                                 ",
              "City": "PROVIDENCE                    ",
              "State": "UT",
              "zip": "843329619",
              "dob": "12-28-2010",
              "gender": "F",
              "SubscriberNo": "710581681",
              "Department_Agency": "",
              "Insurer_Status": "",
              "Insurer_Name": "",
              "enrolltyp": null,
              "N1_Plan_insurer_name": "",
              "Emplymentstatus": "",
              "Member_Policy_No": null,
              "Employment_BeginDT": "",
              "MonthlyFileStatus": "Active",
              "enrollid": "UTA151767527382"
            }
               ]
      
        let columnDefs = [
            { headerName: "Member Id", field: "SubscriberNo", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
            { headerName: "First Name", field: "FirstName", width: 150 },
            { headerName: "Last Name", field: "LastName", width: 150 },
            { headerName: "DOB", field: "dob", width: 100 },
            { headerName: "Gender", field: "gender", width: 100 },
            { headerName: "State", field: "State", width: 100 },
            { headerName: "City", field: "City", width: 100 },
            { headerName: "Address", field: "StreetAddress", width: 100 },
            { headerName: "Postal Code", field: "zip", flex:1 },
        ]

        return (
            <div>

                <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
                    <AgGridReact
                        modules={this.state.modules}
                        columnDefs={columnDefs}
                        autoGroupColumnDef={this.state.autoGroupColumnDef}
                        defaultColDef={this.state.defaultColDef}
                        suppressRowClickSelection={true}
                        groupSelectsChildren={true}
                        debug={true}
                        rowSelection={this.state.rowSelection}
                        rowGroupPanelShow={this.state.rowGroupPanelShow}
                        pivotPanelShow={this.state.pivotPanelShow}
                        enableRangeSelection={true}
                        paginationAutoPageSize={false}
                        pagination={true}
                        domLayout={this.state.domLayout}
                        paginationPageSize={this.state.paginationPageSize}
                        onGridReady={this.onGridReady}
                        rowData={Summary834QNXT}
                        icons={this.state.icons}
                        enableCellTextSelection={true}
                        onCellClicked={(event) => {
                         
                            if (event.colDef.headerName == "Member Id") {
                                this.setState({
                                    showMemberInfo: true,
                                    FirstName:event.data.FirstName,
                                    LastName:event.data.LastName,
                                    DOB:event.data.dob,
                                    Gender:event.data.gender

                                }, () => {
                                   
                                })
                              }
                        }}
                    >
                    </AgGridReact>
                </div>
            </div>
        )
    }

    errorDialogBox = () => {
        return (
            <div class="modal" id="enrollment_Error_Modal" role="dialog" aria-labelledby="myModalLabel2" data-backdrop="static" data-keyboard="false">
                <div class="modal-dialog-error">
                    <div className="error-dialog">
                        <div className="error-header">Error Description</div>
                        <div className="scroll-div">
                            {this.state.ErrorDescClicked}
                        </div>
                        <br />
                        <div className="btnDesign close-button clickable"
                            onClick={() => {
                                $('#enrollment_Error_Modal').modal('hide')
                            }}>
                            Close
                        </div>
                        <br />
                    </div>
                </div>
            </div>
        )
    }
    MemberInfoDialogbox = () => {
        return (
            <div class="modal" id="MemberInfoDialogbox" role="dialog" aria-labelledby="myModalLabel2" data-backdrop="static" data-keyboard="false">
                <div class="modal-dialog-Memberinfo">
                    <div className="error-dialog">
                        <div
                            onClick={() => {
                                if (this.state.RefID) {
                                    this.memberDetails(this.state.RefID, this.state.subscriberNo)
                                }

                                this.setState({
                                    showDetailsEnrollment: true,
                                    textbox: false
                                })
                                $('#MemberInfoDialogbox').modal('hide')
                            }}>
                            <span class="close clickable1">&times;</span>
                        </div>

                        <div>
                            {this.state.showMemberInfo ? this.renderMemberinfo() : null}
                        </div>

                    </div>
                </div>
            </div>
        )
    }

 
    _refreshScreen = () => {
        this.onClick()
    }
    update = (key, value) => {
        this.setState({
            [key]: value,
            showClaims: false,
            showDetailsEnrollment: false
        }, () => {
            this._refreshScreen()
        })
    }
    _renderTopbar = () => {
        return (
            <Filters
                isTimeRange={false}
                isSubmitter={false}
                removeSubmitter={true}
                showGridType={false}
                State={this.state.State}
                setData={this.setData}
                onGridChange={this.onGridChange}
                update={this.update}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                State={this.state.State}
                isButton={false}
                buttonAction={() => {
                    $('#MemberInfoDialogbox').modal('show')
                }}
                button_text={'Add'}
            />
        )
    }

    handledobChange = (date) => {
        this.setState({
            filter_dob: date
        }, () => {
            this._refreshScreen()
        })
    }

    renderFilters = () => {
        return (
            <div className="form-style" id='filters'>
                <div className="form-row">
                    <div className="form-group col-2">
                        <div className="list-dashboard">State</div>
                        <StateDropdown
                            selected_state={this.state.State}
                            method={(event) => { this.update('State', event.target.options[event.target.selectedIndex].text) }}
                        />
                    </div>
                    <div className="form-group col-2">
                        <div className="list-dashboard">First Name</div>
                        <input className="form-control input-style-autocomplete" type="text"
                            onChange={(event) => {
                                clearTimeout(val_1)
                                let firstName = event.target.value
                                val_1 = setTimeout(() => {
                                    this.setState({
                                        filter_firstName: firstName,
                                    }, () => {
                                        this._refreshScreen()
                                    })
                                }, 300);
                            }}
                        />
                    </div>

                    <div className="form-group col-2">
                        <div className="list-dashboard">Last Name</div>
                        <input className="form-control input-style-autocomplete" type="text"
                            onChange={(event) => {
                                clearTimeout(val_2)
                                let lastName = event.target.value
                                val_2 = setTimeout(() => {
                                    this.setState({
                                        filter_lastName: lastName,
                                    }, () => {
                                        this._refreshScreen()
                                    })
                                }, 300);
                            }}
                        />
                    </div>
                    <div className="form-group col-2">
                        <div className="list-dashboard">Date of birth</div>
                        <DatePicker className="form-control list-dashboard"
                            selected={this.state.filter_dob ? new Date(moment(this.state.filter_dob).format('YYYY-MM-DD hh:mm')) : ''}
                            onChange={this.handledobChange}
                            maxDate={new Date(moment().format('YYYY-MM-DD hh:mm'))}
                        />
                    </div>
                    {/* <div className="form-group col-2">
                        <div className="list-dashboard">Policy No</div>
                        <input className="form-control input-style-autocomplete" type="text"
                            value={this.state.filter_lastName}
                            onChange={(event) => {
                                this.setState({
                                    filter_policyno: event.target.value,
                                })
                            }}
                        />
                    </div> */}
                    <div className="col-2">
                        <div className="btnDesign clickable"
                            style={{ textAlign: 'center', width: '80%', marginTop: '20px' }}
                            onClick={() => {
                                this.setState({
                                    showMemberInfo: true,
                                    textbox: true,
                                    MemberFName: '',
                                    MemberLName: '',
                                    Telephone: '',
                                    StreetAddress: '',
                                    City: '',
                                    State: '',
                                    PostalCode: '',
                                    N1_Plan_insurer_name: '',
                                    dateofbirth: '',
                                    gender: '',
                                    SubscriberNo: '',
                                    Department_Agency: '',
                                    Member_Policy_No: '',
                                    Enrollment_type: '',
                                    DepartmentNo: '',
                                    InsurerStatus: '',
                                    member_relationship_name: '',
                                    Emplymentstatus: '',
                                    Ref_1L_CustomerPolicy_No: '',
                                    EnrollmentType: '',
                                    dob: '',
                                    Gender: '',
                                    relationship: ''
                                }, () => {
                                    $('#MemberInfoDialogbox').modal('show')
                                })
                            }}>
                            Add
                        </div>
                    </div>
                </div>

            </div>
        )
    }

    _renderClaims() {
        let columnDefs = [
            { headerName: "Molina Claim Id", field: "MolinaClaimID", cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
            { headerName: "X12 Claim Id", field: "ClaimID", width: 140, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Claim Date", field: "ClaimDateTime", width: 100 },
            { headerName: "Claim Status", field: "ClaimStatus", width: 140 },
            { headerName: "Subscriber Id", field: "Subscriber_ID", width: 140 },
            { headerName: "277CA Status", field: "Status277CA", width: 100 },
            // { headerName: "HiPaaS Status", field: "Transaction_Status", width: 100 },
            // { headerName: "Adjudication Status", field: "adjudication_status", width: 140 },
            { headerName: "Claim Amount", field: "Claim_Amount", flex: 1 },
        ]
        let filter = this.state.filterArray && this.state.filterArray.length > 0 ? JSON.stringify(this.state.filterArray).replace(/"([^"]*)":/g, '$1:') : '[]'
        let startDate = this.state.startDate ? moment(this.state.startDate).format('YYYY-MM-DD') : ""
        let endDate = this.state.endDate ? moment(this.state.endDate).format('YYYY-MM-DD') : ""

        let query = `{
            Claim837RTProcessingSummaryNew(
                    sorting: [{colId:"${this.state.fieldType}", sort:"${this.state.sortType}"}], 
                    startRow: 0, endRow: 9,Filter: ${filter},
                    
                    page:${this.state.page},Sender:"${this.state.selectedTradingPartner}",
                    State:"${this.state.State ? this.state.State : ''}",Provider:"${this.state.providerName}",
                    StartDt:"",EndDt:"",Claimstatus:"${this.state.generalStatus}", FileID : "` + this.state.selectedFileId + `", 
                    Type : "` + this.state.type + `" , OrderBy:"${this.state.inner_orderby}", 
                    RecType: "Inbound", GridType:${this.state.gridType}, 
                    FileStatus : "${this.state.claimStatus ? this.state.claimStatus : ''}", 
                    LoadStatus:"${this.state.gridflag}", MCGStatus: "${this.state.mcgStatus}", 
                    Status277CA:"${this.state.status277CA}" ,ClaimID:"${this.state.Filter_ClaimId}"
            ) {
              RecCount
              ClaimID
              ClaimDate
              ClaimTMTrackingID
              Subscriber_ID
              Claim_Amount
              ClaimStatus
              ProviderLastName
              ProviderFirstName
              SubscriberLastName
              SubscriberFirstName
              adjudication_status
              ClaimLevelErrors
              ClaimUniqueID
              FileID
              FileName
              FileCrDate
              FileStatus
              F277
              F999
              TotalLine
              TotalLinewise835
              BatchName
              BatchStatus
              Transaction_Status
              ClaimRefId
              MolinaClaimID
              FileDate
              ProcessID
              State
              FileDateTime
              ClaimDateTime
              Status277CA
            }
          }`
        return (
            <div style={{ padding: '0', marginTop: '24px' }}>
                <h6>Claim  Information</h6>
                <ServersideGrid
                    columnDefs={columnDefs}
                    query={query}
                    url={Urls.claim_processing}
                    index={'Claim837RTProcessingSummaryNew'}
                    State={this.state.State}
                    fieldType={'ClaimDateTime'}
                    paginationPageSize={5}
                    selectedTradingPartner={this.state.selectedTradingPartner}
                    startDate={startDate}
                    endDate={endDate}
                    selectedFileId={this.state.selectedFileId}
                    filterClaim={this.state.Filter_ClaimId}
                    updateFields={this.updateFields}
                    onClick={this.clickNavigationClaims}
                    // defaultRecCount={10}
                />
            </div>
        )
    }

    _renderSummaryDetails = () => {
        let row = []
        let summary = []
        summary = [
            { name: '834', value: 5, color: '#F39C12' },
            { name: '270', value: 3 , color: '#00C0EF' },
            { name: '276', value: 2, color: '#00C0EF' },
            { name: 'Claims', value:4 , color: '#F39C12' },
            { name: '835', value:4 , color: '#00C0EF' },
          
         
        ]
        let array = summary
        array.forEach(item => {
            row.push(
                // <div className="col-3 clickable nopadding" style={{ backgroundColor: item.color, margin: '6px', paddingLeft: '20px' }}
                //     onClick={() => {
                //         if (item.name == 'Observation') { this.onClickshowObservationTable() }
                //         else if (item.name == 'Immunization') { this.onClickImmunization() }
                //         else if (item.name == 'Allergy Tolerance') { this.onClickshowAllergyIntoleranceTable() }
                //         else if (item.name == 'Eligibility') { this.onClickEligibilty() }
                //         else if (item.name == 'Claims') { this.onClickClaim() }
                //         else if (item.name == 'Medication Request') { this.onClickshowMedicationTable() }
                //         else if (item.name == 'Condition') { this.onClickshowConditionTable() }
                //     }}>
                //     <div className="summary-header white">{item.name}</div>
                //     <div className="summary-title white">
                //         {item.value}
                //     </div>
                // </div>
                <Tiles
                    isClickable={true}
                    header_text={item.name}
                    value={item.value}
                    count_color={item.color}
                    differentTile={true}
                    onClick={() => {
                        this.setState({
                            showClaims: false,
                            claimError_Status: false,
                            showerror: false,
                        }, () => {
                            // if (item.name == 'Observation') { this.onClickshowObservationTable() }
                            // else if (item.name == 'Immunization') { this.onClickImmunization() }
                            // else if (item.name == 'Allergy Intolerance') { this.onClickshowAllergyIntoleranceTable() }
                             if (item.name == '270') { this.onClickEligibilty_270() }
                            else if (item.name == '276') { this.onClickEligibilty() }
                            else if (item.name == 'Claims') { this.onClickClaim() }
                            else if (item.name == '835') { this.onClickshowMedicationTable() }
                            else if (item.name == '834') { this.onClickshowConditionTable() }
                        })
                    }}
                />
            )
        });
        return (
            <div className="row padding-left" style={{ marginTop: '24px' }}>
                {row}
            </div>
        )
    }
    updateFields = (fieldType, sortType, startRow, endRow, filterArray) => {
        this.setState({
            fieldType: fieldType,
            sortType: sortType,
            startRow: startRow,
            endRow: endRow,
            filterArray: filterArray,
        })
    }
    onClickEligibilty_270 = (key) => {
        
        this.setState({
            Eligibilty_270:true,
            Eligibilty: false,
            Claim: false,
            showMedicationTable: false,
            showObservationTable: false,
            Immunization: false,
            showAllergyIntoleranceTable: false,
            showConditionTable: false,
            showDetails:false,
            showDetails_276:false,
            Payment_835: false,
            Enrollment_834:false
          
        })
    }
    onClickEligibilty = (key) => {
        this.setState({
            Payment_835: false,
            Eligibilty: true,
            Eligibilty_270: false,
            Claim: false,
            showMedicationTable: false,
            showObservationTable: false,
            Immunization: false,
            showAllergyIntoleranceTable: false,
            showConditionTable: false,
            showDetails:false,
            showDetails_276:false,
            Enrollment_834:false
        })
    }
    onClickClaim = (key) => {
        this.setState({
            Payment_835: false,
            Claim: true,
            Eligibilty: false,
            Eligibilty_270: false,
            showMedicationTable: false,
            showObservationTable: false,
            Immunization: false,
            showAllergyIntoleranceTable: false,
            showConditionTable: false,
            showDetails:false,
            showDetails_276:false,
            Enrollment_834:false
        })
    }
    onClickshowMedicationTable = (key) => {
        this.setState({
            Payment_835: true,
            Claim: false,
            Eligibilty: false,
            Eligibilty_270: false,
            showMedicationTable: false,
            showObservationTable: false,
            Immunization: false,
            showAllergyIntoleranceTable: false,
            showConditionTable: false,
            showDetails:false,
            showDetails_276:false,
            Enrollment_834:false
        })
    }

    onClickshowConditionTable = (key) => {
        this.setState({
            Enrollment_834: true,
            Claim: false,
            Eligibilty: false,
            Payment_835:false,
            Eligibilty_270: false,
            showMedicationTable: false,
            showObservationTable: false,
            Immunization: false,
            showAllergyIntoleranceTable: false,
            showConditionTable: false,
            showDetails:false,
            showDetails_276:false
        })
    }

    Eligibilty() {
        let ClaimRequest = [
            {
              "RecCount": "2",
              "HiPaaSUniqueID": "execution-05e62dfe-b33c-4332-be52-bbf8365504ea-2019.12.06",
              "Date": "2020-01-07 04:49:20",
              "Trans_type": "Fail",
              "Submiter": "Availity",
              "Trans_ID": "ABC276XYZ",
              "Error_Type": "",
              "Error_Code": "E3",
              "ErrorDescription": "Correction required - relational fields in error.",
              "Response_Time": "0.01"
            },
            {
              "RecCount": "2",
              "HiPaaSUniqueID": "e1d5f08d-8fe8-4398-a964-cdb8c2ff4447",
              "Date": "2020-01-07 04:49:20",
              "Trans_type": "Pass",
              "Submiter": "Availity",
              "Trans_ID": "ABC276XYZ",
              "Error_Type": "",
              "Error_Code": null,
              "ErrorDescription": null,
              "Response_Time": "0.01"
            }
          ]
      
let       columnDefs = [
        { headerName: "Transaction Id", field: "Trans_ID", flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
        { headerName: "Transaction Date", field: "Date", flex: 1 },
        { headerName: "Status", field: "Trans_type", flex: 1 },
        { headerName: "Submitter", field: "Submiter", flex: 1 },
        { headerName: "Response Time (sec)", field: "Response_Time", flex: 1 },
    ]
      
        return (
            <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
                <h6>Eligibility 276</h6>
                <AgGridReact
                    modules={this.state.modules}
                    columnDefs={columnDefs}
                    autoGroupColumnDef={this.state.autoGroupColumnDef}
                    defaultColDef={this.state.defaultColDef}
                    suppressRowClickSelection={true}
                    groupSelectsChildren={true}
                    debug={true}
                    rowSelection={this.state.rowSelection}
                    rowGroupPanelShow={this.state.rowGroupPanelShow}
                    pivotPanelShow={this.state.pivotPanelShow}
                    enableRangeSelection={true}
                    paginationAutoPageSize={false}
                    pagination={true}
                    domLayout={this.state.domLayout}
                    paginationPageSize={this.state.paginationPageSize}
                    onGridReady={this.onGridReady}
                    rowData={ClaimRequest}
                    enableCellTextSelection={true}
                    
                    onCellClicked={(event) => {
                         
                        if (event.colDef.headerName == "Transaction Id" ) {
                            this.setState({
                                showDetails_276: true,                             

                            })
                        } 
                        

                    }}
                >
                </AgGridReact>
            </div>

            // <div style={{ paddingTop: '12px' }}>
            //     <h6>Eligibility</h6>
            //     <table class="table table-striped border">
            //         <thead>
            //             <tr>
            //                 <th className="color-style" scope="col">Insurance Id</th>
            //                 <th className="color-style" scope="col">Coverage</th>
            //                 <th className="color-style" scope="col">Effective From</th>
            //                 <th className="color-style" scope="col">Allowed Money</th>
            //                 <th className="color-style" scope="col">Status</th>
            //             </tr>
            //         </thead>
            //         <tbody>
            //             {row}
            //         </tbody>
            //     </table>
            // </div>
        )
    }
    Eligibilty_270() {
        let  EligibilityAllDtlTypewiseNew= [
            {
              "RecCount": "109",
              "HiPaaSUniqueID": "dd80d2c1-adcb-4cf6-8c9f-e6d16f2d70c8",
              "Date": "2020-01-07 04:49:23",
              "Trans_type": "Pass",
              "Submiter": "Availity",
              "Trans_ID": "10000033",
              "Error_Type": "",
              "Error_Code": null,
              "ErrorDescription": null,
              "Response_Time": "-1.07"
            },
            {
              "RecCount": "109",
              "HiPaaSUniqueID": "14836d4a-39ed-4bae-b679-74e6d8b2f833",
              "Date": "2020-01-07 04:49:23",
              "Trans_type": "Pass",
              "Submiter": "Availity",
              "Trans_ID": "10000043",
              "Error_Type": "",
              "Error_Code": null,
              "ErrorDescription": null,
              "Response_Time": "10.46"
            },
            {
              "RecCount": "109",
              "HiPaaSUniqueID": "93b88e8e-ff2a-4c69-8182-ad1653f2ee47",
              "Date": "2020-01-07 04:49:23",
              "Trans_type": "Pass",
              "Submiter": "Availity",
              "Trans_ID": "10000019",
              "Error_Type": "",
              "Error_Code": null,
              "ErrorDescription": null,
              "Response_Time": "-47.62"
            }
      ]
let       columnDefs = [
        { headerName: "Transaction Id", field: "Trans_ID", flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
        { headerName: "Transaction Date", field: "Date", flex: 1 },
        { headerName: "Status", field: "Trans_type", flex: 1 },
        { headerName: "Submitter", field: "Submiter", flex: 1 },
        { headerName: "Response Time (sec)", field: "Response_Time", flex: 1 },
    ]
      
        return (
            <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
                <h6>Eligibility 270</h6>
                <AgGridReact
                    modules={this.state.modules}
                    columnDefs={columnDefs}
                    autoGroupColumnDef={this.state.autoGroupColumnDef}
                    defaultColDef={this.state.defaultColDef}
                    suppressRowClickSelection={true}
                    groupSelectsChildren={true}
                    debug={true}
                    rowSelection={this.state.rowSelection}
                    rowGroupPanelShow={this.state.rowGroupPanelShow}
                    pivotPanelShow={this.state.pivotPanelShow}
                    enableRangeSelection={true}
                    paginationAutoPageSize={false}
                    pagination={true}
                    domLayout={this.state.domLayout}
                    paginationPageSize={this.state.paginationPageSize}
                    onGridReady={this.onGridReady}
                    rowData={EligibilityAllDtlTypewiseNew}
                    enableCellTextSelection={true}
                    
                    onCellClicked={(event) => {
                         
                        if (event.colDef.headerName == "Transaction Id" ) {
                            this.setState({
                                showDetails: true,                             

                            })
                        } 
                        

                    }}
                >
                </AgGridReact>
            </div>

            // <div style={{ paddingTop: '12px' }}>
            //     <h6>Eligibility</h6>
            //     <table class="table table-striped border">
            //         <thead>
            //             <tr>
            //                 <th className="color-style" scope="col">Insurance Id</th>
            //                 <th className="color-style" scope="col">Coverage</th>
            //                 <th className="color-style" scope="col">Effective From</th>
            //                 <th className="color-style" scope="col">Allowed Money</th>
            //                 <th className="color-style" scope="col">Status</th>
            //             </tr>
            //         </thead>
            //         <tbody>
            //             {row}
            //         </tbody>
            //     </table>
            // </div>
        )
    }
    get_Error = (ClaimID, seqid, fileID) => {
        let query = `{            
            ClaimErrorStages  (ClaimID:"` + ClaimID + `",SeqID:` + seqid + `,FileID:"` + fileID + `") {
            FileID
            ClaimID
            Stage
            StageFileID
            ErrorDesc
            FileName
            FileDate
            MolinaClaimID
            }
        }`
        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }
        fetch(Urls.real_time_claim_details, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                var data = res.data.ClaimErrorStages

                if (this.state.gridType) {
                    this.setState({
                        Error_data: data

                    })
                } else {
                    this.sortData(fileID, data)
                }

            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    getDetails(claimId, fileId, ClaimRefId, fileData, page) {
        let Claim_Icdcode = ""
        let AccidentDate = ""
        let url = Urls.real_time_claim_details
        let query = `{
            Claim837RTDetails(ClaimID:"`+ claimId + `", FileID: "` + fileId + `", SeqID: ${ClaimRefId}) {
              ClaimID
              ClaimDate
              ClaimTMTrackingID
              Subscriber_ID
              Claim_Amount
              ClaimStatus
              ProviderLastName
              ProviderFirstName
              SubscriberLastName
              SubscriberFirstName
              adjudication_status
              ClaimLevelErrors
              AdmissionDate
              BillingProviderAddress
              BillingProviderCity_State_Zip
              ICDCode
              AccidentDate
              FileID
              FieldToUpdate
              MolinaClaimID
              LXCount
              FileName
              FileDate
              HL20Count
              HL22Count
              HL23Count
              Receiver
              ClaimDateTime
            }
            Claim837RTLineDetails(ClaimID:"`+ claimId + `", FileID: "` + fileId + `", page: ${page} , GridType:${this.state.gridType}) {
              ClaimID
              ServiceLineCount
              ProviderPaidAmount
              ServiceDate
              ProcedureDate
              PaidServiceUnitCount
              RecCount
              MolinaClaimID
            }
          }
          `

        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                let data = res.data
                let count = 1

                if (data && data.Claim837RTLineDetails.length > 0) {

                    count = Math.floor(data.Claim837RTLineDetails[0].RecCount / 10)
                    if (data.Claim837RTLineDetails[0].RecCount % 10 > 0) {
                        count = count + 1
                    }
                }


                if (data && res.data.Claim837RTDetails && res.data.Claim837RTDetails.length > 0) {
                    if (res.data.Claim837RTDetails[0].FieldToUpdate == "Icdcode") {
                        Claim_Icdcode = <select id="fao1" className="form-control" style={{ width: "100px" }} onChange={(e) => this.ChangeVal(e)}>
                            <option value="0" ></option>
                            {this.getIcdcodeoptions()}
                        </select>
                    }
                    else {
                        Claim_Icdcode = res.data.Claim837RTDetails[0].ICDCode;
                    }
                    let isDate = 0
                    if (res.data.Claim837RTDetails[0].FieldToUpdate == "AccidentDt") {
                        isDate = 1
                        AccidentDate = this.getDatePicker()
                    }
                    else {

                        AccidentDate = res.data.Claim837RTDetails[0].AccidentDate;
                    }
                    let data = res.data.Claim837RTDetails[0]

                    let claimDetails =
                        [
                            { field_name: 'X12 Claim Id', value: data.ClaimID },
                            { field_name: 'Claim Date', value: data.ClaimDate },
                            { field_name: 'Subscriber First Name', value: data.SubscriberFirstName },
                            { field_name: 'Subscriber Last Name', value: data.SubscriberLastName },
                            { field_name: 'Admission Date', value: data.AdmissionDate },
                            { field_name: 'Claim Amount', value: data.Claim_Amount },
                            { field_name: 'Provider Address', value: data.BillingProviderAddress },
                            { field_name: 'Claim Status', value: data.ClaimStatus },
                            { field_name: 'ICD Code', value: Claim_Icdcode },
                            { field_name: 'Accident Date', value: isDate ? "" : AccidentDate, isDate: isDate },
                            { field_name: '', },
                            { field_name: '', },
                        ]
                    this.setState({
                        showDetails: true,
                        claimDetails: claimDetails,
                        claimLineDetails: res.data.Claim837RTLineDetails,
                        fileid: data.FileID,
                        claimid: data.ClaimID,
                        Icdcodepresent: data.FieldToUpdate,
                        count: count,
                        seqID: ClaimRefId,
                        fileDataDetails: fileData,
                        //  lineCount: data ? data.LXCount : 0,
                        Aggrid_ClaimLineData: res.data.Claim837RTLineDetails,
                        Aggrid_Claim_Info_data: res.data.Claim837RTDetails
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    getClaimStages(claimId, fileId, seqId) {
        let url = Urls.real_time_claim_details
        let query = `{
            ClaimStagesInbound(FileID:"${fileId}", ClaimID: "${claimId}", SeqID: ${seqId}) {
              Stage
              Createdatetime
            }
          }
          `

        if (Strings.isDev) { process.env.NODE_ENV == 'development' && console.log(query) }

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        })
            .then(res => res.json())
            .then(res => {
                if (res && res.data && res.data.ClaimStagesInbound) {
                    this.setState({
                        claimStageDetails: res.data.ClaimStagesInbound,
                        Aggrid_ClaimStage: res.data.ClaimStagesInbound,
                    })
                }
            })
            .catch(err => {
                process.env.NODE_ENV == 'development' && console.log(err)
            });
    }

    renderClaimsStatic() {
        let Claim837RTProcessingSummaryNew = [
            {
              "RecCount": "1",
              "ClaimID": "M1610400873",
              "ClaimDate": "2020-08-27T05:51:48.448Z",
              "ClaimTMTrackingID": "13079",
              "Subscriber_ID": "9461220774",
              "Claim_Amount": "500",
              "ClaimStatus": "Accepted",
              "ProviderLastName": null,
              "ProviderFirstName": null,
              "SubscriberLastName": null,
              "SubscriberFirstName": null,
              "adjudication_status": null,
              "ClaimLevelErrors": null,
              "ClaimUniqueID": "000000000000002",
              "FileID": "2825123507869164533",
              "FileName": "837_20201806.txt",
              "FileCrDate": "2020-08-27",
              "FileStatus": "Accepted",
              "F277": "",
              "F999": "",
              "TotalLine": null,
              "TotalLinewise835": null,
              "BatchName": null,
              "BatchStatus": null,
              "Transaction_Status": null,
              "ClaimRefId": "4122387",
              "MolinaClaimID": "000000000000002",
              "FileDate": "2020-08-27T05:51:48.448Z",
              "ProcessID": "2825123507869164533",
              "State": "FL",
              "FileDateTime": "2020-08-27 05:51:48",
              "ClaimDateTime": "2020-08-27 05:51:48",
              "Status277CA": "Accepted"
            },
          
            {
              "RecCount": "27350",
              "ClaimID": "7706727",
              "ClaimDate": "2020-08-27T05:07:06.358Z",
              "ClaimTMTrackingID": "20395",
              "Subscriber_ID": "2K08WA1WE52",
              "Claim_Amount": "300",
              "ClaimStatus": "Accepted",
              "ProviderLastName": null,
              "ProviderFirstName": null,
              "SubscriberLastName": null,
              "SubscriberFirstName": null,
              "adjudication_status": null,
              "ClaimLevelErrors": null,
              "ClaimUniqueID": "000000000088295",
              "FileID": "8376823777959845370",
              "FileName": "FL_8376823777959845370.txt",
              "FileCrDate": "2020-08-27",
              "FileStatus": "Accepted",
              "F277": "",
              "F999": "",
              "TotalLine": null,
              "TotalLinewise835": null,
              "BatchName": null,
              "BatchStatus": null,
              "Transaction_Status": null,
              "ClaimRefId": "4179516",
              "MolinaClaimID": "000000000088295",
              "FileDate": "2020-08-27T05:07:06.358Z",
              "ProcessID": "8376823777959845370",
              "State": "FL",
              "FileDateTime": "2020-08-27 05:07:06",
              "ClaimDateTime": "2020-08-27 05:07:06",
              "Status277CA": "Accepted"
            },
            {
                "RecCount": "27350",
                "ClaimID": "210539",
                "ClaimDate": "2020-07-07T12:26:50.031Z",
                "ClaimTMTrackingID": "20289",
                "Subscriber_ID": "8687890389",
                "Claim_Amount": "5.75",
                "ClaimStatus": "Accepted",
                "ProviderLastName": null,
                "ProviderFirstName": null,
                "SubscriberLastName": null,
                "SubscriberFirstName": null,
                "adjudication_status": null,
                "ClaimLevelErrors": null,
                "ClaimUniqueID": "000000000087301",
                "FileID": "240349635486892957",
                "FileName": "FL_WE_837P_m837_1.51062_1.20200129_1.0dtjo_01292020071042117_1.txt",
                "FileCrDate": "2020-07-07",
                "FileStatus": "Accepted",
                "F277": "",
                "F999": " FL_WE_837P_m837_1.51062_1.20200129_1.0dtjo_01292020071042117_1.txt_07072020.999",
                "TotalLine": null,
                "TotalLinewise835": null,
                "BatchName": null,
                "BatchStatus": null,
                "Transaction_Status": null,
                "ClaimRefId": "4175500",
                "MolinaClaimID": "000000000087301",
                "FileDate": "2020-07-07T12:26:50.031Z",
                "ProcessID": "240349635486892957",
                "State": "FL",
                "FileDateTime": "2020-07-07 12:26:50",
                "ClaimDateTime": "2020-07-07 12:26:50",
                "Status277CA": "Accepted"
              },
            {
              "RecCount": "27350",
              "ClaimID": "210511",
              "ClaimDate": "2020-07-07T12:26:50.031Z",
              "ClaimTMTrackingID": "20290",
              "Subscriber_ID": "9525864154",
              "Claim_Amount": "5.75",
              "ClaimStatus": "Accepted",
              "ProviderLastName": null,
              "ProviderFirstName": null,
              "SubscriberLastName": null,
              "SubscriberFirstName": null,
              "adjudication_status": null,
              "ClaimLevelErrors": null,
              "ClaimUniqueID": "000000000087297",
              "FileID": "240349635486892957",
              "FileName": "FL_WE_837P_m837_1.51062_1.20200129_1.0dtjo_01292020071042117_1.txt",
              "FileCrDate": "2020-07-07",
              "FileStatus": "Accepted",
              "F277": "",
              "F999": " FL_WE_837P_m837_1.51062_1.20200129_1.0dtjo_01292020071042117_1.txt_07072020.999",
              "TotalLine": null,
              "TotalLinewise835": null,
              "BatchName": null,
              "BatchStatus": null,
              "Transaction_Status": null,
              "ClaimRefId": "4175499",
              "MolinaClaimID": "000000000087297",
              "FileDate": "2020-07-07T12:26:50.031Z",
              "ProcessID": "240349635486892957",
              "State": "FL",
              "FileDateTime": "2020-07-07 12:26:50",
              "ClaimDateTime": "2020-07-07 12:26:50",
              "Status277CA": "Accepted"
            }
          ]
      
      let columnDefs = [
        { headerName: "Molina Claim Id", field: "MolinaClaimID", cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
        { headerName: "X12 Claim Id", field: "ClaimID", width: 140, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
        { headerName: "Claim Date", field: "ClaimDateTime", width: 100 },
        { headerName: "Claim Status", field: "ClaimStatus", width: 140 },
        { headerName: "Subscriber Id", field: "Subscriber_ID", width: 140 },
        { headerName: "277CA Status", field: "Status277CA", width: 100 },
        // { headerName: "HiPaaS Status", field: "Transaction_Status", width: 100 },
        // { headerName: "Adjudication Status", field: "adjudication_status", width: 140 },
        { headerName: "Claim Amount", field: "Claim_Amount", flex: 1 },
    ]
      
        return (
            <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
                <h6>Claim Information</h6>
                <AgGridReact
                    modules={this.state.modules}
                    columnDefs={columnDefs}
                    autoGroupColumnDef={this.state.autoGroupColumnDef}
                    defaultColDef={this.state.defaultColDef}
                    suppressRowClickSelection={true}
                    groupSelectsChildren={true}
                    debug={true}
                    rowSelection={this.state.rowSelection}
                    rowGroupPanelShow={this.state.rowGroupPanelShow}
                    pivotPanelShow={this.state.pivotPanelShow}
                    enableRangeSelection={true}
                    paginationAutoPageSize={false}
                    pagination={true}
                    domLayout={this.state.domLayout}
                    paginationPageSize={this.state.paginationPageSize}
                    onGridReady={this.onGridReady}
                    rowData={Claim837RTProcessingSummaryNew}
                    enableCellTextSelection={true}
                    
                    onCellClicked={(event) => {
                         
                        if (event.colDef.headerName == "Molina Claim Id" ) {
                      
                            this.setState({
                                showerror: true,
                                claimError_Status: event.data.ClaimStatus,
                                Error_data: [],
                                Aggrid_ClaimLineData: [],
                                Aggrid_Claim_Info_data: [],
                                Aggrid_ClaimStage: [],
                            })
                       
                        } 
                        

                    }}
                >
                </AgGridReact>
            </div>

                )
    }

    _renderError() {
        if (this.state.Error_data == undefined) { this.state.Error_data = [] }
        process.env.NODE_ENV == 'development' && console.log("_renderError", this.state.Error_data);

        let columnDefs = this.state.status277CA == "Rejected" ?
            [

                { headerName: "Stage", field: "Stage", width: 100 },
                { headerName: "Molina Claim ID", field: "MolinaClaimID", width: 170 },
                { headerName: "X12 Claim ID", field: "ClaimID", width: 170 },
                { headerName: "277CA Error", field: "Error_277CA", flex: 1, cellStyle: { color: '#139DC9', cursor: 'pointer' } },

            ] : [

                { headerName: "Stage", field: "Stage", width: 100 },
                { headerName: "Molina Claim ID", field: "MolinaClaimID", width: 170 },
                { headerName: "X12 Claim ID", field: "ClaimID", width: 170 },
                { headerName: "Error Description", field: "ErrorDesc", flex: 1, cellStyle: { color: '#139DC9', cursor: 'pointer' } },

            ]

        return (
            <div>
                <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
                    {/* <h6 className="font-size">Claim Error Description</h6> */}
                    <AgGridReact
                        modules={this.state.modules}
                        columnDefs={columnDefs}
                        autoGroupColumnDef={this.state.autoGroupColumnDef}
                        defaultColDef={this.state.defaultColDef}
                        suppressRowClickSelection={true}
                        groupSelectsChildren={true}
                        debug={true}
                        rowSelection={this.state.rowSelection}
                        rowGroupPanelShow={this.state.rowGroupPanelShow}
                        pivotPanelShow={this.state.pivotPanelShow}
                        enableRangeSelection={true}
                        paginationAutoPageSize={false}
                        pagination={true}
                        domLayout={this.state.domLayout}
                        paginationPageSize={this.state.paginationPageSize}
                        onGridReady={this.onGridReady}
                        rowData={this.state.Error_data}
                        enableCellTextSelection={true}
                        onCellClicked={(event) => {
                            if (event.colDef.headerName == "Error Description" && event.data.ErrorDesc) {
                                this.setState({
                                    clickedError: event.data.ErrorDesc
                                }, () => {
                                    $('#error_modal').modal('show')
                                })

                            }
                        }}

                    >
                    </AgGridReact>
                </div>
            </div>
        )
    }
    _ClaimLineTable() {
        let Aggrid_ClaimLineData = [
            {
              "ClaimID": "M1610400873",
              "ServiceLineCount": "1",
              "ProviderPaidAmount": null,
              "ServiceDate": null,
              "ProcedureDate": null,
              "PaidServiceUnitCount": null,
              "RecCount": "1",
              "MolinaClaimID": "000000000000002"
            }
          ]
  let columnDefs = [
            { headerName: "Molina Claim ID", field: "MolinaClaimID" },
            { headerName: "X12 Claim ID", field: "ClaimID" },

            { headerName: "Service Line No.", field: "ServiceLineCount" },
            { headerName: " Service Date", field: "ServiceDate" },
            { headerName: "Procedure Code", field: "ProcedureDate" },
            { headerName: "Unit", field: "PaidServiceUnitCount", flex: 1 },

        ]

        return (
            <div>
                <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
                    <h6 className="font-size">Claim Line Data</h6>
                    <AgGridReact
                        modules={this.state.modules}
                        columnDefs={columnDefs}
                        autoGroupColumnDef={this.state.autoGroupColumnDef}
                        defaultColDef={this.state.defaultColDef}
                        suppressRowClickSelection={true}
                        groupSelectsChildren={true}
                        debug={true}
                        rowSelection={this.state.rowSelection}
                        rowGroupPanelShow={this.state.rowGroupPanelShow}
                        pivotPanelShow={this.state.pivotPanelShow}
                        enableRangeSelection={true}
                        paginationAutoPageSize={false}
                        pagination={true}
                        domLayout={this.state.domLayout}
                        paginationPageSize={this.state.paginationPageSize}
                        onGridReady={this.onGridReady}
                        rowData={Aggrid_ClaimLineData}
                        enableCellTextSelection={true}

                    >
                    </AgGridReact>
                </div>
            </div>
        )
    }
    _ClaimView_Info_Table() {
        let Aggrid_Claim_Info_data = [
            {
              "ClaimID": "M1610400873",
              "ClaimDate": "2020-08-27T05:51:48.448Z",
              "ClaimTMTrackingID": "13079",
              "Subscriber_ID": "9461220774",
              "Claim_Amount": "500",
              "ClaimStatus": "Accepted",
              "ProviderLastName": null,
              "ProviderFirstName": null,
              "SubscriberLastName": "Rose",
              "SubscriberFirstName": "Coleman",
              "adjudication_status": null,
              "ClaimLevelErrors": null,
              "AdmissionDate": null,
              "BillingProviderAddress": null,
              "BillingProviderCity_State_Zip": null,
              "ICDCode": "ABK:A311",
              "AccidentDate": null,
              "FileID": "2825123507869164533",
              "FieldToUpdate": "",
              "MolinaClaimID": "000000000000002",
              "LXCount": "1",
              "FileName": "837_20201806.txt",
              "FileDate": "2020-08-27T05:51:48.448Z",
              "HL20Count": "1",
              "HL22Count": "1",
              "HL23Count": "0",
              "Receiver": "MHFL261055137  ",
              "ClaimDateTime": "2020-08-27 05:51:48"
            }
          ]
        if (this.state.Aggrid_Claim_Info_data == undefined) { this.state.Aggrid_Claim_Info_data = [] }
        let columnDefs = [
            // { headerName: " File Name", field: "FileName" },
            // { headerName: "Receiver", field: "Receiver", width: 100 },
            { headerName: "Molina Claim Id", field: "MolinaClaimID", width: 120 },
            { headerName: "X12 Claim Id", field: "ClaimID", width: 100 },
            { headerName: " HL20 Count", field: "HL20Count", width: 80 },
            { headerName: "HL22 Count", field: "HL22Count", width: 80 },
            { headerName: "HL23 Count", field: "HL23Count", width: 80 },
            { headerName: "Claim Date", field: "ClaimDateTime", width: 100 },
            { headerName: "Subscriber First Name", field: "SubscriberFirstName", width: 140 },
            { headerName: "Subscriber Last Name", field: "SubscriberLastName", width: 140 },
            { headerName: "Admission Date", field: "AdmissionDate", width: 140 },
            { headerName: "Claim Amount", field: "Claim_Amount", width: 100 },
            { headerName: "Provider Address", field: "BillingProviderAddress", width: 140 },
            { headerName: "Claim Status", field: "ClaimStatus", width: 100 },
            { headerName: "ICD Code", field: "ICDCode", width: 100 },
            { headerName: "Accident Date", field: "AccidentDate", width: 120 },
        ]

        return (
            <div>
                <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>

                    <AgGridReact
                        modules={this.state.modules}
                        columnDefs={columnDefs}
                        autoGroupColumnDef={this.state.autoGroupColumnDef}
                        defaultColDef={this.state.defaultColDef}
                        suppressRowClickSelection={true}
                        groupSelectsChildren={true}
                        debug={true}
                        rowSelection={this.state.rowSelection}
                        rowGroupPanelShow={this.state.rowGroupPanelShow}
                        pivotPanelShow={this.state.pivotPanelShow}
                        enableRangeSelection={true}
                        paginationAutoPageSize={false}
                        pagination={true}
                        domLayout={this.state.domLayout}
                        paginationPageSize={this.state.paginationPageSize}
                        onGridReady={this.onGridReady}
                        rowData={Aggrid_Claim_Info_data}
                        enableCellTextSelection={true}                    >
                    </AgGridReact>
                </div>
            </div>
        )
    }

    renderPaymentStatic() {
       let PaymentProcessingSummaryNew = [{"RefID":"4043018","RecCount":"4","FileID":"6261215227194493523","FileName":"20200424190846558.Molina.835","FileDate":"2020-04-24 19:08:46","ClaimID":"18227119511","ClaimReceivedDate":"2018-08-14","PatientName":"PEREZMIRANDA","PatientControlNo":"24307362","PayerName":"MOLINA HEALTHCARE OF FLORIDA, INC","TotalChargeAmt":"5343","TotalClaimPaymentAmt":"0","Sender":"MHF260155137   ","Organization":"BLAIR","TransactionType":"1","CheckEFTNo":"EFT2457982","TRN03":"MHF2601551","PayerID":null,"CheckEFTDt":"2018-08-30","AccountNo":null,"CHECKEFTFlag":"ACH","Receiver":"FIS123456789   ","TotalAdjustmentAmount":null,"TotalBillAmount":"21425.9","Days":"16","RemittanceFileName":"20200424190846558.Molina.835","RemittanceSentDate":"2020-04-24 19:08:48","State":"FL","Status":"Validated","ProcessID":"EFT2457982"},{"RefID":"4042998","RecCount":"4","FileID":"6261215227194493523","FileName":"20200424190846558.Molina.835","FileDate":"2020-04-24 19:08:46","ClaimID":"18220123988","ClaimReceivedDate":"2018-08-07","PatientName":"AGUILARFERNANDEZ","PatientControlNo":"24295663","PayerName":"MOLINA HEALTHCARE OF FLORIDA, INC","TotalChargeAmt":"6701","TotalClaimPaymentAmt":"0","Sender":"MHF260155137   ","Organization":"BLAIR","TransactionType":"1","CheckEFTNo":"EFT2457982","TRN03":"MHF2601551","PayerID":null,"CheckEFTDt":"2018-08-30","AccountNo":null,"CHECKEFTFlag":"ACH","Receiver":"FIS123456789   ","TotalAdjustmentAmount":null,"TotalBillAmount":"21425.9","Days":"23","RemittanceFileName":"20200424190846558.Molina.835","RemittanceSentDate":"2020-04-24 19:08:48","State":"FL","Status":"Validated","ProcessID":"EFT2457982"},{"RefID":"4043018","RecCount":"4","FileID":"6261215227194493523","FileName":"20200424190846558.Molina.835","FileDate":"2020-04-24 19:08:46","ClaimID":"18227119511","ClaimReceivedDate":"2018-08-14","PatientName":"PEREZMIRANDA","PatientControlNo":"24307362","PayerName":"MOLINA HEALTHCARE OF FLORIDA, INC","TotalChargeAmt":"5343","TotalClaimPaymentAmt":"0","Sender":"MHF260155137   ","Organization":"BLAIR","TransactionType":"1","CheckEFTNo":"EFT2457982","TRN03":"MHF2601551","PayerID":null,"CheckEFTDt":"2018-08-30","AccountNo":null,"CHECKEFTFlag":"ACH","Receiver":"FIS123456789   ","TotalAdjustmentAmount":null,"TotalBillAmount":"21425.9","Days":"16","RemittanceFileName":"20200424190846558.Molina.835","RemittanceSentDate":"2020-04-24 19:08:48","State":"FL","Status":"Validated","ProcessID":"EFT2457982"},{"RefID":"4042998","RecCount":"4","FileID":"6261215227194493523","FileName":"20200424190846558.Molina.835","FileDate":"2020-04-24 19:08:46","ClaimID":"18220123988","ClaimReceivedDate":"2018-08-07","PatientName":"AGUILARFERNANDEZ","PatientControlNo":"24295663","PayerName":"MOLINA HEALTHCARE OF FLORIDA, INC","TotalChargeAmt":"6701","TotalClaimPaymentAmt":"0","Sender":"MHF260155137   ","Organization":"BLAIR","TransactionType":"1","CheckEFTNo":"EFT2457982","TRN03":"MHF2601551","PayerID":null,"CheckEFTDt":"2018-08-30","AccountNo":null,"CHECKEFTFlag":"ACH","Receiver":"FIS123456789   ","TotalAdjustmentAmount":null,"TotalBillAmount":"21425.9","Days":"23","RemittanceFileName":"20200424190846558.Molina.835","RemittanceSentDate":"2020-04-24 19:08:48","State":"FL","Status":"Validated","ProcessID":"EFT2457982"}]





      
       let columnDefs = [
        { headerName: "Claim Id", field: "ClaimID", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
        { headerName: "Claim Received Date", field: "ClaimReceivedDate", width: 140, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
        { headerName: "Patient Name", field: "PatientName", width: 200, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
        { headerName: "Total Charge Amount", field: "TotalChargeAmt", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
        { headerName: "Total Paid Amount", field: "TotalClaimPaymentAmt", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
        { headerName: "Total Adjusted Amount", field: "TotalAdjustmentAmount", width: 130, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
        { headerName: "Days Aged", field: "Days", flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },

    ]

      
        return (
            <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
                <h6>Remittance Information</h6>
                <AgGridReact
                    modules={this.state.modules}
                    columnDefs={columnDefs}
                    autoGroupColumnDef={this.state.autoGroupColumnDef}
                    defaultColDef={this.state.defaultColDef}
                    suppressRowClickSelection={true}
                    groupSelectsChildren={true}
                    debug={true}
                    rowSelection={this.state.rowSelection}
                    rowGroupPanelShow={this.state.rowGroupPanelShow}
                    pivotPanelShow={this.state.pivotPanelShow}
                    enableRangeSelection={true}
                    paginationAutoPageSize={false}
                    pagination={true}
                    domLayout={this.state.domLayout}
                    paginationPageSize={this.state.paginationPageSize}
                    onGridReady={this.onGridReady}
                    rowData={PaymentProcessingSummaryNew}
                    enableCellTextSelection={true}
                    
                    onCellClicked={(event) => {
                         
                        if (event.colDef.headerName == "Claim Id" ) {
                      
                            this.setState({
                            showpayment: true,
                               
                            })
                       
                        } 
                        

                    }}
                >
                </AgGridReact>
            </div>

                )
    }

   
    _PaymentLineTable() {
        let RemittanceViewerClaimServiceDetails = [
            {
              "FileID": "6261215227194493523",
              "ClaimID": "18227119511",
              "ServiceEndDate": "",
              "ServiceStartDate": "",
              "AdjudicatedCPT": "HC:76805",
              "ChargeAmount": "886",
              "PaidAmt": "0",
              "AdjAmt": "507.8",
              "SubmittedCPT": null,
              "LineControlNo": null,
              "ServiceSupplementalAmount": "38.9",
              "OriginalUnitsofServiceCount": null,
              "UnitsofServicePaidCount": null,
              "RecCount": "0"
            },
            {
              "FileID": "6261215227194493523",
              "ClaimID": "18227119511",
              "ServiceEndDate": "",
              "ServiceStartDate": "",
              "AdjudicatedCPT": "HC:G0383:25",
              "ChargeAmount": "3648",
              "PaidAmt": "0",
              "AdjAmt": "3081.6",
              "SubmittedCPT": null,
              "LineControlNo": null,
              "ServiceSupplementalAmount": "58.3",
              "OriginalUnitsofServiceCount": null,
              "UnitsofServicePaidCount": null,
              "RecCount": "0"
            },
            {
              "FileID": "6261215227194493523",
              "ClaimID": "18227119511",
              "ServiceEndDate": "",
              "ServiceStartDate": "",
              "AdjudicatedCPT": "HC:76805",
              "ChargeAmount": "886",
              "PaidAmt": "0",
              "AdjAmt": "378.2",
              "SubmittedCPT": null,
              "LineControlNo": null,
              "ServiceSupplementalAmount": "38.9",
              "OriginalUnitsofServiceCount": null,
              "UnitsofServicePaidCount": null,
              "RecCount": "0"
            },
            {
              "FileID": "6261215227194493523",
              "ClaimID": "18227119511",
              "ServiceEndDate": "",
              "ServiceStartDate": "",
              "AdjudicatedCPT": "HC:G0383:25",
              "ChargeAmount": "3648",
              "PaidAmt": "0",
              "AdjAmt": "566.4",
              "SubmittedCPT": null,
              "LineControlNo": null,
              "ServiceSupplementalAmount": "58.3",
              "OriginalUnitsofServiceCount": null,
              "UnitsofServicePaidCount": null,
              "RecCount": "0"
            },
            {
              "FileID": "6261215227194493523",
              "ClaimID": "18227119511",
              "ServiceEndDate": "",
              "ServiceStartDate": "",
              "AdjudicatedCPT": "HC:84112",
              "ChargeAmount": "351",
              "PaidAmt": "0",
              "AdjAmt": "240.1",
              "SubmittedCPT": null,
              "LineControlNo": null,
              "ServiceSupplementalAmount": "11.4",
              "OriginalUnitsofServiceCount": null,
              "UnitsofServicePaidCount": null,
              "RecCount": "0"
            },
            {
              "FileID": "6261215227194493523",
              "ClaimID": "18227119511",
              "ServiceEndDate": "",
              "ServiceStartDate": "",
              "AdjudicatedCPT": "HC:76819",
              "ChargeAmount": "458",
              "PaidAmt": "0",
              "AdjAmt": "267.5",
              "SubmittedCPT": null,
              "LineControlNo": null,
              "ServiceSupplementalAmount": "19.6",
              "OriginalUnitsofServiceCount": null,
              "UnitsofServicePaidCount": null,
              "RecCount": "0"
            },
            {
              "FileID": "6261215227194493523",
              "ClaimID": "18227119511",
              "ServiceEndDate": "",
              "ServiceStartDate": "",
              "AdjudicatedCPT": "HC:84112",
              "ChargeAmount": "351",
              "PaidAmt": "0",
              "AdjAmt": "110.9",
              "SubmittedCPT": null,
              "LineControlNo": null,
              "ServiceSupplementalAmount": "11.4",
              "OriginalUnitsofServiceCount": null,
              "UnitsofServicePaidCount": null,
              "RecCount": "0"
            },
            {
              "FileID": "6261215227194493523",
              "ClaimID": "18227119511",
              "ServiceEndDate": "",
              "ServiceStartDate": "",
              "AdjudicatedCPT": "HC:76819",
              "ChargeAmount": "458",
              "PaidAmt": "0",
              "AdjAmt": "190.5",
              "SubmittedCPT": null,
              "LineControlNo": null,
              "ServiceSupplementalAmount": "19.6",
              "OriginalUnitsofServiceCount": null,
              "UnitsofServicePaidCount": null,
              "RecCount": "0"
            }
          ]
          let columnDefs = [
            { headerName: "Service Start Date", width: 120, field: "ServiceStartDate" },
            { headerName: "Service End Date", width: 120, field: "ServiceEndDate" },
            { headerName: "Line Item Control #", width: 120, field: "LineControlNo" },
            { headerName: "Adjudicated CPT", width: 120, field: "AdjudicatedCPT" },
            { headerName: "	Submitted CPT", width: 120, field: "SubmittedCPT" },
            { headerName: "Submitted Units", width: 120, field: "" },
            { headerName: "Allowed Actual", width: 120, field: "" },
            { headerName: "Paid Units", width: 120, field: "" },
            { headerName: "Charge Amount", width: 120, field: "ChargeAmount" },
            { headerName: "Adj Amount", width: 120, field: "AdjAmt" },
            { headerName: "Paid Amount", field: "PaidAmt" },

        ]

        return (
            <div>
                <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
                    <h6 className="font-size">Service Line Information</h6>
                    <AgGridReact
                        modules={this.state.modules}
                        columnDefs={columnDefs}
                        autoGroupColumnDef={this.state.autoGroupColumnDef}
                        defaultColDef={this.state.defaultColDef}
                        suppressRowClickSelection={true}
                        groupSelectsChildren={true}
                        debug={true}
                        rowSelection={this.state.rowSelection}
                        rowGroupPanelShow={this.state.rowGroupPanelShow}
                        pivotPanelShow={this.state.pivotPanelShow}
                        enableRangeSelection={true}
                        paginationAutoPageSize={false}
                        pagination={true}
                        domLayout={this.state.domLayout}
                        paginationPageSize={this.state.paginationPageSize}
                        onGridReady={this.onGridReady}
                        rowData={RemittanceViewerClaimServiceDetails}
                        enableCellTextSelection={true}

                    >
                    </AgGridReact>
                </div>
            </div>
        )
    }
    _PaymentView_Info_Table() {
         let RemittanceViewerClaimDetails = [
      {
        "FileID": "6261215227194493523",
        "FileName": "20200424190846558.Molina.835",
        "FileDate": "2020-04-24 19:08:46",
        "Organization": "BLAIR",
        "Payee_IdentificationQL": "XX",
        "Payee_IdentificationCode": "1710931522",
        "CheckEFTNo": "EFT2457982",
        "PayerIdentifier": "MHF2601551",
        "PayerName": null,
        "PayerID": null,
        "CheckEFTDt": "2018-08-30",
        "AccountNo": null,
        "CHECKEFTFlag": "ACH",
        "ClaimID": "18227119511",
        "PayerClaimControl": "18227119511",
        "ClaimReceivedDate": "2018-08-14",
        "PatientName": "PEREZMIRANDA",
        "PatientControlNo": "24307362",
        "TotalChargeAmt": "5343",
        "TotalClaimPaymentAmt": "0",
        "PatietResAMT": null,
        "DigonisCode": null,
        "DGNQty": "0",
        "ClaimStatusCode": "2",
        "FacilityCode": "13",
        "AdjustmentAmt": null
      },
      {
        "FileID": "6261215227194493523",
        "FileName": "20200424190846558.Molina.835",
        "FileDate": "2020-04-24 19:08:46",
        "Organization": "BLAIR",
        "Payee_IdentificationQL": "XX",
        "Payee_IdentificationCode": "1710931522",
        "CheckEFTNo": "EFT2457982",
        "PayerIdentifier": "MHF2601551",
        "PayerName": null,
        "PayerID": null,
        "CheckEFTDt": "2018-08-30",
        "AccountNo": null,
        "CHECKEFTFlag": "ACH",
        "ClaimID": "18227119511",
        "PayerClaimControl": "18227119511",
        "ClaimReceivedDate": "2018-08-14",
        "PatientName": "PEREZMIRANDA",
        "PatientControlNo": "24307362",
        "TotalChargeAmt": "5343",
        "TotalClaimPaymentAmt": "0",
        "PatietResAMT": null,
        "DigonisCode": null,
        "DGNQty": "0",
        "ClaimStatusCode": "2",
        "FacilityCode": "13",
        "AdjustmentAmt": null
      }
    ]

     
    let columnDefs = [
        { headerName: "Claim Id", field: "ClaimID", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
        { headerName: "Claim Received Date", field: "ClaimReceivedDate", width: 120 },
        { headerName: "Patient Name", field: "PatientName", width: 200, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
        // { headerName: "835 Response (RAW)", field: "", width: 120 , cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' }},
        // { headerName: "Days Aged", field: "", width: 100 , cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' }},
        { headerName: "Payment Method Code", field: "CHECKEFTFlag", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
        { headerName: "Patient Control Number", field: "PatientControlNo", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
        { headerName: "Total Patient Resp", field: "PatietResAMT", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
        { headerName: "Payer Name", field: "PayerName", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
        { headerName: "Payer claim control No.", field: "PayerClaimControl", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
        { headerName: "Claim Status Code", field: "ClaimStatusCode", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
        { headerName: "Claim Filling Indicator", field: "", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
        { headerName: "Patient ID", field: "", width: 140, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
        { headerName: "Provider ID", field: "", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
        { headerName: "Provider Name", field: "", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
        { headerName: "Rendering Provider ID", field: "", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
        { headerName: "Facility Code Value", field: "FacilityCode", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },

        { headerName: "DRG Code", field: "DigonisCode", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },

    ]


        return (
            <div>
                <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>

                    <AgGridReact
                        modules={this.state.modules}
                        columnDefs={columnDefs}
                        autoGroupColumnDef={this.state.autoGroupColumnDef}
                        defaultColDef={this.state.defaultColDef}
                        suppressRowClickSelection={true}
                        groupSelectsChildren={true}
                        debug={true}
                        rowSelection={this.state.rowSelection}
                        rowGroupPanelShow={this.state.rowGroupPanelShow}
                        pivotPanelShow={this.state.pivotPanelShow}
                        enableRangeSelection={true}
                        paginationAutoPageSize={false}
                        pagination={true}
                        domLayout={this.state.domLayout}
                        paginationPageSize={this.state.paginationPageSize}
                        onGridReady={this.onGridReady}
                        rowData={RemittanceViewerClaimDetails}
                        enableCellTextSelection={true}                    >
                    </AgGridReact>
                </div>
            </div>
        )
    }


    renderEnrollmentStatic() {
       let ProcessingSummary834 = [{"NM109_Indetificationcode":"166561046","INS_Insurer_Maintenance_code":"021","Status1":"Verified","RefID":"6782657","INS_Insurer_Status":"Y","INS_Insurer_relationship":"18","FileID":"175","SubscriberNo":"166561046","error_desc":null,"EnrollmentType":"Add","InsurerStatus":"Subscriber","Resubmit":null},{"NM109_Indetificationcode":"400443003","INS_Insurer_Maintenance_code":"024","Status1":"Verified","RefID":"6782658","INS_Insurer_Status":"Y","INS_Insurer_relationship":"18","FileID":"175","SubscriberNo":"400443003","error_desc":null,"EnrollmentType":"Term","InsurerStatus":"Subscriber","Resubmit":null},{"NM109_Indetificationcode":"539401112","INS_Insurer_Maintenance_code":"024","Status1":"Verified","RefID":"6782681","INS_Insurer_Status":"Y","INS_Insurer_relationship":"53","FileID":"175","SubscriberNo":"539401112","error_desc":null,"EnrollmentType":"Term","InsurerStatus":"Subscriber","Resubmit":null},{"NM109_Indetificationcode":"134500008","INS_Insurer_Maintenance_code":"001","Status1":"Verified","RefID":"6782682","INS_Insurer_Status":"Y","INS_Insurer_relationship":"53","FileID":"175","SubscriberNo":"134500008","error_desc":null,"EnrollmentType":"Change","InsurerStatus":"Subscriber","Resubmit":null},{"NM109_Indetificationcode":"544530884","INS_Insurer_Maintenance_code":"001","Status1":"Verified","RefID":"6782683","INS_Insurer_Status":"Y","INS_Insurer_relationship":"53","FileID":"175","SubscriberNo":"544530884","error_desc":null,"EnrollmentType":"Change","InsurerStatus":"Subscriber","Resubmit":null},{"NM109_Indetificationcode":"702617012","INS_Insurer_Maintenance_code":"021","Status1":"Error","RefID":"6782684","INS_Insurer_Status":"Y","INS_Insurer_relationship":"18","FileID":"175","SubscriberNo":"702617012","error_desc":"Missing member Policy Number","EnrollmentType":"Add","InsurerStatus":"Subscriber","Resubmit":"Resubmit"},{"NM109_Indetificationcode":"811101177","INS_Insurer_Maintenance_code":"024","Status1":"Error","RefID":"6782685","INS_Insurer_Status":"Y","INS_Insurer_relationship":"18","FileID":"175","SubscriberNo":"811101177","error_desc":"Missing subscriber demographic date of birth information missing","EnrollmentType":"Term","InsurerStatus":"Subscriber","Resubmit":"Resubmit"},{"NM109_Indetificationcode":"700054331","INS_Insurer_Maintenance_code":"001","Status1":"Error","RefID":"6782686","INS_Insurer_Status":"Y","INS_Insurer_relationship":"18","FileID":"175","SubscriberNo":"700054331","error_desc":"Missing subscriber demographic gender information missing","EnrollmentType":"Change","InsurerStatus":"Subscriber","Resubmit":"Resubmit"},{"NM109_Indetificationcode":"611152222","INS_Insurer_Maintenance_code":"001","Status1":"Error","RefID":"6782687","INS_Insurer_Status":"Y","INS_Insurer_relationship":"18","FileID":"175","SubscriberNo":"611152222","error_desc":"Missing subscriber demographic date of birth information missing","EnrollmentType":"Change","InsurerStatus":"Subscriber","Resubmit":"Resubmit"},{"NM109_Indetificationcode":"539420808","INS_Insurer_Maintenance_code":"021","Status1":"Verified","RefID":"6784132","INS_Insurer_Status":"Y","INS_Insurer_relationship":"53","FileID":"175","SubscriberNo":"539420808","error_desc":null,"EnrollmentType":"Add","InsurerStatus":"Subscriber","Resubmit":null},{"NM109_Indetificationcode":"739421217","INS_Insurer_Maintenance_code":"021","Status1":"Verified","RefID":"6784133","INS_Insurer_Status":"Y","INS_Insurer_relationship":"53","FileID":"175","SubscriberNo":"739421217","error_desc":null,"EnrollmentType":"Add","InsurerStatus":"Subscriber","Resubmit":null},{"NM109_Indetificationcode":"600021002","INS_Insurer_Maintenance_code":"024","Status1":"Verified","RefID":"6784134","INS_Insurer_Status":"Y","INS_Insurer_relationship":"18","FileID":"175","SubscriberNo":"600021002","error_desc":null,"EnrollmentType":"Term","InsurerStatus":"Subscriber","Resubmit":null},{"NM109_Indetificationcode":"600021513","INS_Insurer_Maintenance_code":"001","Status1":"Verified","RefID":"6784135","INS_Insurer_Status":"Y","INS_Insurer_relationship":"18","FileID":"175","SubscriberNo":"600021513","error_desc":null,"EnrollmentType":"Change","InsurerStatus":"Subscriber","Resubmit":null},{"NM109_Indetificationcode":"510012132","INS_Insurer_Maintenance_code":"001","Status1":"Verified","RefID":"6784136","INS_Insurer_Status":"Y","INS_Insurer_relationship":"18","FileID":"175","SubscriberNo":"510012132","error_desc":null,"EnrollmentType":"Change","InsurerStatus":"Subscriber","Resubmit":null},{"NM109_Indetificationcode":"531230884","INS_Insurer_Maintenance_code":"001","Status1":"Verified","RefID":"6784137","INS_Insurer_Status":"Y","INS_Insurer_relationship":"53","FileID":"175","SubscriberNo":"531230884","error_desc":null,"EnrollmentType":"Change","InsurerStatus":"Subscriber","Resubmit":null},{"NM109_Indetificationcode":"561254665","INS_Insurer_Maintenance_code":"021","Status1":"Error","RefID":"6784138","INS_Insurer_Status":"Y","INS_Insurer_relationship":"18","FileID":"175","SubscriberNo":"561254665","error_desc":"Missing subscriber demographic date of birth information missing","EnrollmentType":"Add","InsurerStatus":"Subscriber","Resubmit":"Resubmit"},{"NM109_Indetificationcode":"822200777","INS_Insurer_Maintenance_code":"001","Status1":"Error","RefID":"6784139","INS_Insurer_Status":"Y","INS_Insurer_relationship":"18","FileID":"175","SubscriberNo":"822200777","error_desc":"Missing subscriber demographic date of birth information missing","EnrollmentType":"Change","InsurerStatus":"Subscriber","Resubmit":"Resubmit"},{"NM109_Indetificationcode":"577712132","INS_Insurer_Maintenance_code":"001","Status1":"Error","RefID":"6784140","INS_Insurer_Status":"Y","INS_Insurer_relationship":"18","FileID":"175","SubscriberNo":"577712132","error_desc":"Missing member Policy Number","EnrollmentType":"Change","InsurerStatus":"Subscriber","Resubmit":"Resubmit"},{"NM109_Indetificationcode":"800052222","INS_Insurer_Maintenance_code":"001","Status1":"Error","RefID":"6784141","INS_Insurer_Status":"Y","INS_Insurer_relationship":"18","FileID":"175","SubscriberNo":"800052222","error_desc":"Missing subscriber demographic date of birth information missing","EnrollmentType":"Change","InsurerStatus":"Subscriber","Resubmit":"Resubmit"},{"NM109_Indetificationcode":"444000333","INS_Insurer_Maintenance_code":"021","Status1":"Verified","RefID":"6782656","INS_Insurer_Status":"Y","INS_Insurer_relationship":"18","FileID":"175","SubscriberNo":"444000333","error_desc":null,"EnrollmentType":"Add","InsurerStatus":"Subscriber","Resubmit":null}]

       
        let columnDefs = [
            { headerName: "Subscriber No", field: "SubscriberNo", width: 250, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
            { headerName: "Enrollment Type", field: "EnrollmentType", width: 130 },
            { headerName: "Insurer Status", field: "InsurerStatus", width: 130 },
            { headerName: "Status", field: "Status1", width: 150 },
            { headerName: "Error Description", field: "error_desc", flex: 1, cellStyle: { color: '#139DC9', cursor: 'pointer' } },
            // { headerName: "", field: "Resubmit",width: 100,cellStyle: {  color: '#139DC9', cursor: 'pointer' , fontWeight:'bold'} },
        ]
       
         return (
             <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
                 <h6>Enrollment</h6>
                 <AgGridReact
                     modules={this.state.modules}
                     columnDefs={columnDefs}
                     autoGroupColumnDef={this.state.autoGroupColumnDef}
                     defaultColDef={this.state.defaultColDef}
                     suppressRowClickSelection={true}
                     groupSelectsChildren={true}
                     debug={true}
                     rowSelection={this.state.rowSelection}
                     rowGroupPanelShow={this.state.rowGroupPanelShow}
                     pivotPanelShow={this.state.pivotPanelShow}
                     enableRangeSelection={true}
                     paginationAutoPageSize={false}
                     pagination={true}
                     domLayout={this.state.domLayout}
                     paginationPageSize={this.state.paginationPageSize}
                     onGridReady={this.onGridReady}
                     rowData={ProcessingSummary834}
                     enableCellTextSelection={true}
                     
                     onCellClicked={(event) => {
                          
                         if (event.colDef.headerName == "Subscriber No" ) {
                       
                             this.setState({
                             showpayment: true,
                                
                             })
                        
                         } 
                         
 
                     }}
                 >
                 </AgGridReact>
             </div>
 
                 )
     }
 
    
     _EnrollmentLineTable() {
        let MemberCoverageDetails834 = [
            {
              "FileID": "175",
              "NM109_Indetificationcode": "400443003",
              "InsLineCode": "HLT",
              "StartDate": "20190701",
              "EndDate": null,
              "PlanCoverageDesc": "0X026AAD",
              "SubscriberNo": "400443003",
              "TransCode": null
            }
          ]
           let columnDefs = [
            // { headerName: "Subscriber No", field: "SubscriberNo", width: 250, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
            { headerName: "Subscriber No.", field: "SubscriberNo", width: 250 },
            { headerName: "Plan Code", field: "InsLineCode", width: 200 },
            { headerName: "Coverage Start Date", field: "StartDate", width: 250 },
            { headerName: "Coverage End Date", field: "EndDate", flex: 1 },
        ]
 
         return (
             <div>
                 <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
                     <h6 className="font-size">Coverage Data
</h6>
                     <AgGridReact
                         modules={this.state.modules}
                         columnDefs={columnDefs}
                         autoGroupColumnDef={this.state.autoGroupColumnDef}
                         defaultColDef={this.state.defaultColDef}
                         suppressRowClickSelection={true}
                         groupSelectsChildren={true}
                         debug={true}
                         rowSelection={this.state.rowSelection}
                         rowGroupPanelShow={this.state.rowGroupPanelShow}
                         pivotPanelShow={this.state.pivotPanelShow}
                         enableRangeSelection={true}
                         paginationAutoPageSize={false}
                         pagination={true}
                         domLayout={this.state.domLayout}
                         paginationPageSize={this.state.paginationPageSize}
                         onGridReady={this.onGridReady}
                         rowData={MemberCoverageDetails834}
                         enableCellTextSelection={true}
 
                     >
                     </AgGridReact>
                 </div>
             </div>
         )
     }
     _EnrollmentView_Info_Table() {
        let MemberDetails834 = [
            {
              "FileID": "175",
              "FileName": "834_UT_20200427 162537",
              "MemberFName": "Anson",
              "MemberLName": "Miller",
              "Telephone": "2515791895",
              "StreetAddress": "Brooksby Village Way",
              "PostalCode": "98166",
              "gender": "M",
              "SubscriberNo": "400443003",
              "dateofbirth": "1963-12-02",
              "City": "Danvers",
              "State": "UT",
              "Member_Policy_No": "0X036Y",
              "Employment_BeginDT": null,
              "EnrollmentType": "Term",
              "N1_Plan_insurer_name": "XYX",
              "Emplymentstatus": "FT",
              "Department_Agency": null,
              "RefID": "6782658",
              "InsurerStatus": "Subscriber",
              "relationship": "18",
              "ErrorField": ""
            }
          ]

     let columnDefs = [
         { headerName: "First Name", field: "MemberFName", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
         { headerName: "Last Name", field: "MemberLName", width: 120 },
         { headerName: "Telephone", field: "Telephone", width: 120  },
         // { headerName: "835 Response (RAW)", field: "", width: 120, },
         // { headerName: "Days Aged", field: "", width: 100 , },
         { headerName: "Address", field: "StreetAddress", width: 200,  },
         { headerName: "City", field: "City", width: 100,  },
         { headerName: "State", field: "State", width: 100,  },
         { headerName: "Postal Code", field: "PostalCode", width: 150,  },
         { headerName: "Insurer Name", field: "N1_Plan_insurer_name", width: 150,  },
         { headerName: "Dob", field: "dateofbirth", width: 120  },
         { headerName: "Gender", field: "gender", width: 120  },
         { headerName: "Subscriber No", field: "SubscriberNo", width: 140,  },
         { headerName: "Department Agency", field: "Department_Agency", width: 120  },
         { headerName: "Policy No", field: "Member_Policy_No", width: 120  },
         { headerName: "Enrollment Type", field: "Enrollment_type", width: 120  },
         { headerName: "Employment Begin Date", field: "DepartmentNo", width: 120  },
         { headerName: "Insurer Status", field: "InsurerStatus", width: 120  },
         { headerName: "Relationship", field: "member_relationship_name", width: 120  },
         { headerName: "Employment Status", field: "Emplymentstatus", flex:1 },
 
 
     ]
 
 
         return (
             <div>
                 <div className="ag-theme-balham" style={{ padding: '0', marginTop: '24px' }}>
 
                     <AgGridReact
                         modules={this.state.modules}
                         columnDefs={columnDefs}
                         autoGroupColumnDef={this.state.autoGroupColumnDef}
                         defaultColDef={this.state.defaultColDef}
                         suppressRowClickSelection={true}
                         groupSelectsChildren={true}
                         debug={true}
                         rowSelection={this.state.rowSelection}
                         rowGroupPanelShow={this.state.rowGroupPanelShow}
                         pivotPanelShow={this.state.pivotPanelShow}
                         enableRangeSelection={true}
                         paginationAutoPageSize={false}
                         pagination={true}
                         domLayout={this.state.domLayout}
                         paginationPageSize={this.state.paginationPageSize}
                         onGridReady={this.onGridReady}
                         rowData={MemberDetails834}
                         enableCellTextSelection={true}                    >
                     </AgGridReact>
                 </div>
             </div>
         )
     }
    renderDetails(flag) {

        let  Eligibilty270Request=           
              "ISA*00*Authorizat*00*Security        I*ZZ*Interchange      Sen*ZZ*Interchange Rec*141001*1037*^*00501*000031033*0*T*:~GS*HS*Sample Sen*Sample Rec*20141001*1037*123456*X*005010X279A1~ST*270*1234*005010X279A1~BHT*0022*13*10000033*20141001*1319~HL*1**20*1~NM1*PR*2*ABC COMPANY*****PI*842610001~HL*2*1*21*1~NM1*1P*2*BONE AND JOINT CLINIC*****XX*1234567893~HL*3*2*22*0~TRN*1*93175-0001*9877281234~NM1*IL*1*Coleman*Rose****MI*123456822~DMG*D8*19430519*F~DTP*291*D8*20141001~EQ*30~SE*13*1234~GE*1*123456~IEA*1*000031033~"

         
        return (
            <div className="row">
                <div className={"col-12"}>
                    <div className="top-padding clickable" href={'#' + 'hello' + flag} >{'Transaction Request'}</div>
                    <div className="border-view  breakword" id={'hello' + flag}>{ Eligibilty270Request}</div>
                </div>
            </div>
        )
    }
    renderRespones(flag) {

        var Eligibilty271Response= "ISA*00*Authorizat*00*Security     I*ZZ*Interchange Rec*ZZ*Interchange Sen*141001*1037*^*00501*000031033*0*T*:~GS*HB*Sample Rec*Sample Sen*20141001*1037*123456*X*005010X279A1~ST*271*4321*005010X279A1~BHT*0022*11*10001234*20141001*1319~HL*1**20*1~NM1*PR*2*ABC COMPANY*****PI*842610001~HL*2*1*21*1~NM1*1P*2*BONE AND JOINT CLINIC*****XX*1234567893~HL*3*2*22*0~TRN*2*93175-0001*9877281234~NM1*IL*1*SMITH*ROBERT****MI*11122333301~N3*15197 BROADWAY AVENUE*APT 215~N4*KANSAS CITY*MO*64108~DMG*D8*19430519*M~DTP*291*D8*20141001~EB*1**30^1^33^35^47^48^50^86^88^98^AL^MH^UC*HM*GOLD 123 PLAN~EB*L~LS*2120~NM1*P3*1*JONES*MARCUS****XX*2345678900~LE*2120~EB*C**30*HM**23*100*****Y~EB*C**30*HM**23*250*****N~EB*C**30*HM**29*100*****Y~EB*C**30*HM**29*250*****N~EB*A**30^1^33^35^47^48^50^86^88^98^AL^MH^UC*HM****.1****Y~EB*A**30^1^33^35^47^48^50^86^88^98^AL^MH^UC*HM****.2****N~EB*B**30^1^33^35^47^48^50^86^88^98^AL^MH^UC*HM***10*****Y~EB*B**30^1^33^35^47^48^50^86^88^98^AL^MH^UC*HM***30*****N~ SE*27*4321~GE*1*123456~ IEA*1*000031033~"
            
          
        return (
            <div className="row">
                <div className={"col-12"}>
                    <div className="top-padding clickable" href={'#' + 'hello' + flag} >{'Transaction Response'}</div>
                    <div className="border-view  breakword" id={'hello' + flag}>{ Eligibilty271Response}</div>
                </div>
            </div>
        )
    }
    renderDetails_276(flag) {

        let Claim276Request = "ISA*00*   *00*   *ZZ*SUBMITTERID *ZZ*CMS   *160127*0734*^*00501*000005014*1*P*|~GS*HS*SUBMITTERID*CMS*20160127*073411*5014*X*005010X279A1~ST*276*3707*005010X212~BHT*0010*13*ABC276XYZ*20120128*1425~HL*1**20*1~NM1*PR*2*BCBSDISNEY*****PI*8584537845~HL*2*1*21*1~NM1*41*2*UCLA MEDICAL CENTER*****46*1982~HL*3*2*19*1~NM1*1P*2*UCLA MEDICALCENTER*****XX*1215193883~HL*4*3*22*0~DMG*D8*19281118*M~NM1*IL*1*MOUSE*MICKEY****MI*60345914A~TRN*1*ABC9001~REF*BLT*221~REF*EJ*ABC9001~DTP*472*D8*20120124~HL*5*3*22*0~DMG*D8*19340619*M~NM1*IL*1*Coleman*Rose****MI*60345914B~TRN*1*ABC9002~REF*BLT*221~REF*EJ*ABC9002~DTP*472*D8*20120124~SVC*HC:98765*150**0450***1~SE*24*3707~GE*1*5014~IEA*1*000005014~"
     

         
        return (
            <div className="row">
                <div className={"col-12"}>
                    <div className="top-padding clickable" href={'#' + 'hello' + flag} >{ 'Transaction Request'}</div>
                    <div className="border-view  breakword" id={'hello' + flag}>{ Claim276Request}</div>
                </div>
            </div>
        )
    }
    renderRespones_276(flag) {

        let Claim277Response ="ISA*00*   *00*   *ZZ*SUBMITTERID *ZZ*CMS   *160127*0734*^*00501*000005014*1*P*|~GS*HS*SUBMITTERID*CMS*20160127*073411*5014*X*005010X279A1~ST*277*3708*005010X212~BHT*0010*08*ABC276XYZ*20120128*1426*DG~HL*1**20*1~NM1*PR*2*BCBS DISNEY*****PI*8584537845~HL*2*1*21*1~NM1*41*2*UCLA MEDICAL CENTER*****46*1982~HL*3*2*19*1~NM1*1P*2*UCLA MEDICAL CENTER*****XX*1215193883~HL*4*3*22*0~DMG*D8*19281118*M~NM1*QC*1*MOUSE*MICKEY****MI*60345914A~TRN*1*ABC9001~STC*P3:60*20120128**225*0~REF*BLT*221~REF*EJ*ABC9001~DTP*472*D8*20120124~HL*5*3*22*0~DMG*D8*19340619*M~NM1*QC*1*Coleman*Rose****MI*60345914B~TRN*1*ABC9002~REF*BLT*221~REF*EJ*ABC9002~DTP*472*D8*20120124~SVC*HC:98765*150**0450***1~STC*F1:65*20120128~SE*26*3708~GE*1*5014~IEA*1*000005014~"
        return (
            <div className="row">
                <div className={"col-12"}>
                    <div className="top-padding clickable" href={'#' + 'hello' + flag} >{'Transaction Response'}</div>
                    <div className="border-view  breakword" id={'hello' + flag}>{ Claim277Response}</div>
                </div>
            </div>
        )
    }
    renderClaims = () => {
        return (
            <div>
                {/* {this._renderList()} */}
                {this.renderClaimsStatic()}
                {this.state.showerror ? this._ClaimView_Info_Table() : null}
                {this.state.showerror ? this._ClaimLineTable() : null}
            </div>
        )
    }
    renderPayment = () => {
        return (
            <div>
                {/* {this._renderList()} */}
                {this.renderPaymentStatic()}
               { this.state.showpayment ?this._PaymentView_Info_Table():null}
                {   this.state.showpayment ? this._PaymentLineTable(): null}
            </div>
        )
    }
    renderEnrollement_834 = () => {
        return (
            <div>
                {/* {this._renderList()} */}
                {this.renderEnrollmentStatic()}
               { this.state.showpayment ?this._EnrollmentView_Info_Table():null}
                {   this.state.showpayment ? this._EnrollmentLineTable(): null}
            </div>
        )
    }
    renderHeader() {
        return (
            <div style={{ color: "#4290F0" }}>
                <br></br>
                <img src={person} style={{ fontWeight: "500", marginTop: "10px", marginBottom: "5px", fontSize: '20px' }} alt="" width="40" height="40" title="person" />
                <label style={{ color: "#139dc9", fontWeight: "500", fontSize: '20px' }}> {this.state.FirstName} {this.state.LastName}
                </label>

                <label style={{ color: "grey", marginLeft: "20px", fontWeight: "400", fontSize: '15px' }}>  Dob : {this.state.DOB}
                </label>

                <label style={{ color: "grey", marginLeft: "20px", fontWeight: "400", fontSize: '15px' }}>  Gender : {this.state.Gender}
                </label>

                {/* <label style={{ color: "grey", marginLeft: "20px", fontWeight: "400", fontSize: '15px' }}>  Identifier : {this.state.patientId_id}
                </label> */}
                <hr style={{ margin: '8px' }}></hr>
            </div>
        )
    }

    render() {
        var title = ""
        if (this.props.location.state && this.props.location.state.data && this.props.location.state.data[0].Total == "error") {
            title = "Member History";
        }
        else {
            title = "Member History ";
        }

 
       

   
        return (

            <div>
                <h5 className="headerText">{title}{this.state.subtitle ? <label style={{ fontSize: "14px" }}>({this.state.subtitle})</label> : ""}</h5>
                {/* {this._renderTopbar()} */}
                {/* {this.renderFilters()} */}
                <div>
                    {this.renderTableEnrollmentLevel()}
                    {this.state.showMemberInfo ? this.renderHeader():null}
                    { this.state.showMemberInfo ? this._renderSummaryDetails():null}
                    {this.state.Eligibilty_270 ? this.Eligibilty_270(): null}
                    {this.state.Eligibilty ? this.Eligibilty(): null}                  
                  
                    {this.state.showDetails ? this.renderDetails() : null}
                    {this.state.showDetails ? this.renderRespones() : null}
                    {this.state.showDetails_276 ? this.renderDetails_276() : null}
                    {this.state.showDetails_276 ? this.renderRespones_276() : null}
                        
                    
                  
                  
                  
                {/* {this.state.Claim ? this.Claim() : null} */}
                {this.state.Claim ? this.renderClaims() : null}
                {this.state.Payment_835 ? this.renderPayment() : null}
                {this.state.Enrollment_834 ? this.renderEnrollement_834() : null}
           
                    {/* {this.state.showDetailsEnrollment ? this.renderSummary() : null} */}
                </div>
                {this.errorDialogBox()}
                {this.MemberInfoDialogbox()}
            </div>
        );
    }
}