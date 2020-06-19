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
const $ = window.$;

var val_1 = ''
var val_2 = ''
export class EnrollmentLoadException extends React.Component {

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
            subscriberNo: '',
            enrollment_type: '',
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
            statusArray: [
                { "NM109_Indetificationcode": "639444949", "INS_Insurer_Maintenance_code": "021", "Status1": "Verified", "RefID": "6784142", "INS_Insurer_Status": "Y", "INS_Insurer_relationship": "53", "FileID": "176", "SubscriberNo": "639444949", "error_desc": null, "EnrollmentType": "", "InsurerStatus": "Subscriber", "ErrorField": "", "Resubmit": "", "FileName": "834_UT_20200427 162612", "MemberFName": "naudy", "MemberLName": "kom", "Telephone": "1101611601", "StreetAddress": "Sage", "PostalCode": "98107", "gender": "M", "dateofbirth": "1946-03-20", "City": "YelloStone", "State": "UT", "Member_Policy_No": "0X036Y", "Employment_BeginDT": null, "N1_Plan_insurer_name": "XYX", "Emplymentstatus": null, "Department_Agency": null, Exception: "There was an error executing the most recent statement; Caused by: Cannot insert Duplicate Value into column 'memid', table 'member'; Primary Key Violation Error;column does not allow Duplicate. INSERT fails." },
                { "NM109_Indetificationcode": "600021002", "INS_Insurer_Maintenance_code": "024", "Status1": "Verified", "RefID": "6784134", "INS_Insurer_Status": "Y", "INS_Insurer_relationship": "18", "FileID": "175", "SubscriberNo": "600021002", "error_desc": null, "EnrollmentType": "", "InsurerStatus": "Subscriber", "ErrorField": "", "Resubmit": "", "FileName": "834_UT_20200427 162537", "MemberFName": "Archibald", "MemberLName": "Wilson", "Telephone": "3101111101", "StreetAddress": "Teaticket Hwy", "PostalCode": "98119", "gender": "F", "dateofbirth": "1955-04-13", "City": "East Falmouth", "State": "UT", "Member_Policy_No": "0X036Y", "Employment_BeginDT": null, "N1_Plan_insurer_name": "XYX", "Emplymentstatus": "FT", "Department_Agency": null, Exception: "Child Synchronous Process Call: Molina_QNXT_834 [execution-2c4a09d8-5a8a-43d2-9ff7-9154b42f6427-2020.04.09(shape65)] call ended in error: com.boomi.process.ProcessException: Child Synchronous Process Call: HD_Logic [execution-9b11df9d-7740-422b-b357-f66aeadd5573-2020.04.09(shape46)] call ended in error: com.boomi.process.ProcessException: Login failed. The login is from an untrusted domain and cannot be used with Integrated authentication.; Caused by: Child Synchronous Process Call: HD_Logic [execution-9b11df9d-7740-422b-b357-f66aeadd5573-2020.04.09(shape46)] call ended in error: com.boomi.process.ProcessException: Login failed. The login is from an untrusted domain and cannot be used with Integrated authentication.; Caused by: Login failed. The login is from an untrusted domain and cannot be used with Integrated authentication."  },
                { "NM109_Indetificationcode": "539420808", "INS_Insurer_Maintenance_code": "021", "Status1": "Verified", "RefID": "6784132", "INS_Insurer_Status": "Y", "INS_Insurer_relationship": "53", "FileID": "175", "SubscriberNo": "539420808", "error_desc": null, "EnrollmentType": "", "InsurerStatus": "Subscriber", "ErrorField": "", "Resubmit": "", "FileName": "834_UT_20200427 162537", "MemberFName": "Aldo", "MemberLName": "Williams", "Telephone": "1101611601", "StreetAddress": "Memorial Drive", "PostalCode": "98107", "gender": "M", "dateofbirth": "1946-03-20", "City": "Avon", "State": "UT", "Member_Policy_No": "0X036Y", "Employment_BeginDT": null, "N1_Plan_insurer_name": "XYX", "Emplymentstatus": null, "Department_Agency": null, Exception: "There was an error executing the most recent statement; Caused by: Data truncation" },
                { "NM109_Indetificationcode": "800001212", "INS_Insurer_Maintenance_code": "030", "Status1": "Verified", "RefID": "6784143", "INS_Insurer_Status": "Y", "INS_Insurer_relationship": "18", "FileID": "177", "SubscriberNo": "800001212", "error_desc": null, "EnrollmentType": "", "InsurerStatus": "Subscriber", "ErrorField": "", "Resubmit": "", "FileName": "834_UT_20200427 162659", "MemberFName": "LOAD", "MemberLName": "VEN", "Telephone": "3101111101", "StreetAddress": "Stone Park", "PostalCode": "98119", "gender": "F", "dateofbirth": "1955-04-13", "City": "Vitniana", "State": "UT", "Member_Policy_No": "0X036Y", "Employment_BeginDT": null, "N1_Plan_insurer_name": "XYX", "Emplymentstatus": "FT", "Department_Agency": null, Exception: "There was an error executing the most recent statement; Caused by: Cannot insert the value NULL into column 'memid', table 'member'; column does not allow nulls. INSERT fails."  },
                { "NM109_Indetificationcode": "544530884", "INS_Insurer_Maintenance_code": "001", "Status1": "Verified", "RefID": "6782683", "INS_Insurer_Status": "Y", "INS_Insurer_relationship": "53", "FileID": "175", "SubscriberNo": "544530884", "error_desc": null, "EnrollmentType": "", "InsurerStatus": "Subscriber", "ErrorField": "", "Resubmit": "", "FileName": "834_UT_20200427 162537", "MemberFName": "Baker", "MemberLName": "Thompson", "Telephone": "1101611601", "StreetAddress": "Plymouth Street", "PostalCode": "98107", "gender": "M", "dateofbirth": "1946-03-20", "City": "Halifax", "State": "UT", "Member_Policy_No": "0X036Y", "Employment_BeginDT": null, "N1_Plan_insurer_name": "XYX", "Emplymentstatus": null, "Department_Agency": null, Exception: "Input ProfileLocation: Root; DocumentLocation: /Root]: Unable to create JSON files from data, the document may not be well-formed json"  },
            ]

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
            Summary834 (State:"${this.state.State}",Dob:"${filter_dob}",Gender:"${this.state.filter_gender}",FirstName:"${this.state.filter_firstName}",LastName:"${this.state.filter_lastName}") {
                NM109_Indetificationcode
                INS_Insurer_Maintenance_code
                Status1
                RefID
                INS_Insurer_Status
                INS_Insurer_relationship
                FileID
                SubscriberNo
                error_desc
                EnrollmentType
                InsurerStatus
                ErrorField
                Resubmit
                FileName
                MemberFName
                MemberLName
                Telephone
                StreetAddress
                PostalCode
                gender
                dateofbirth
                City
                State
                Member_Policy_No
                Employment_BeginDT
                N1_Plan_insurer_name
                Emplymentstatus
                Department_Agency
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
                data = r.data.Summary834
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
        let query = `{MemberDetails834(RefID:${RefID}) {
            FileID
            FileName
            MemberFName
            MemberLName
            Telephone
            StreetAddress
            PostalCode
            gender
            SubscriberNo
            dateofbirth
            City
            State
            Member_Policy_No
            Employment_BeginDT
            EnrollmentType
            N1_Plan_insurer_name
            Emplymentstatus
            Department_Agency
            RefID
            InsurerStatus
            relationship
            ErrorField
         }
         MemberCoverageDetails834 (FileID:"${this.state.selected_fileId}",SubscriberNo:"${SubscriberNo}") {
            FileID
            NM109_Indetificationcode
            InsLineCode
            StartDate
            EndDate
            PlanCoverageDesc
            SubscriberNo
            TransCode
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
                data = r.data.MemberDetails834
                let coverage_data = r.data.MemberCoverageDetails834

                if (!data || (data && data.length == 0)) {
                    return
                }
                var CheckError = data[0].ErrorField;


                let memberInfo = [
                    { key: "First Name", value: data[0].MemberFName },
                    { key: "Last Name", value: data[0].MemberLName },
                    { key: "Telephone", value: data[0].Telephone },
                    { key: "Address", value: data[0].StreetAddress },
                    { key: "City", value: data[0].City },
                    { key: "State", value: data[0].State },
                    { key: "Postal Code", value: data[0].PostalCode },
                    { key: "Insurer Name", value: data[0].N1_Plan_insurer_name },
                    { key: "Dob", value: data[0].dateofbirth },
                    { key: "Gender", value: data[0].gender },
                    { key: "Subscriber No", value: data[0].SubscriberNo },
                    { key: "Department Agency", value: data[0].Department_Agency },
                    { key: "Policy No", value: data[0].Member_Policy_No },
                    { key: "Enrollment Type", value: data[0].EnrollmentType },
                    { key: "Employment Begin Date", value: data[0].Employment_BeginDT },
                    { key: "Insurer Status", value: data[0].InsurerStatus },
                    { key: "Relationship", value: data[0].relationship },
                    { key: "Employment Status", value: data[0].Emplymentstatus },

                ]
                this.state.textbox == true ?
                    this.setState({
                        memberInfoPop: memberInfo,
                        Error_Field: data[0].ErrorField,
                        MemberFName: data[0].MemberFName,
                        MemberLName: data[0].MemberLName,
                        Telephone: data[0].Telephone,
                        StreetAddress: data[0].StreetAddress,
                        PostalCode: data[0].PostalCode,
                        Gender: data[0].gender,
                        SubscriberNo: data[0].SubscriberNo,
                        dob: data[0].dateofbirth,
                        City: data[0].City,
                        State: data[0].State,
                        Ref_1L_CustomerPolicy_No: data[0].Member_Policy_No,
                        DTP_336_Employment_BeginDT: data[0].Employment_BeginDT,
                        EnrollmentType: data[0].EnrollmentType,
                        N1_Plan_insurer_name: data[0].N1_Plan_insurer_name,
                        Emplymentstatus: data[0].Emplymentstatus,
                        RefDX1: data[0].Department_Agency,
                        InsurerStatus: data[0].InsurerStatus,
                        relationship: data[0].relationship,

                    }) : this.setState({
                        memberDetails834: memberInfo,
                        rowData_CoverageData: coverage_data,
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
                        <label>Department Agency</label>
                        <input value={this.state.RefDX1 == null ? '' : this.state.RefDX1} onChange={(e) => this.onChangeName(e, 'RefDX1')} class="form-control" placeholder=""></input>
                    </div>
                    <div class="form-group col-md-3">
                        <label>Policy No</label>
                        <input value={this.state.Ref_1L_CustomerPolicy_No == null ? '' : this.state.Ref_1L_CustomerPolicy_No} onChange={(e) => this.onChangeName(e, 'Ref_1L_CustomerPolicy_No')} class="form-control" placeholder=""></input>
                    </div>
                    <div class="form-group col-md-3">
                        <label>Enrollment Type</label>
                        <input value={this.state.EnrollmentType == null ? '' : this.state.EnrollmentType} onChange={(e) => this.onChangeName(e, 'EnrollmentType')} class="form-control" placeholder=""></input>
                    </div>
                    <div class="form-group col-md-3">
                        <label>Employment Begin Date</label>
                        <DatePicker className="form-control" value={this.state.DTP_336_Employment_BeginDT == null ? '' : this.state.DTP_336_Employment_BeginDT}
                            selected={this.state.DTP_336_Employment_BeginDT ? new Date(moment(this.state.DTP_336_Employment_BeginDT).format('YYYY-MM-DD hh:mm')) : ''}
                            onChange={this.handle_emp_begindate}
                        />
                    </div>
                    <div class="form-group col-md-3">
                        <label>Insurer Status</label>
                        <input value={this.state.InsurerStatus == null ? '' : this.state.InsurerStatus} onChange={(e) => this.onChangeName(e, 'InsurerStatus')} class="form-control" placeholder=""></input>
                    </div>
                    <div class="form-group col-md-3">
                        <label>Relationship</label>
                        <input value={this.state.relationship == null ? '' : this.state.relationship} onChange={(e) => this.onChangeName(e, 'relationship')} class="form-control" placeholder=""></input>
                    </div>
                    <div class="form-group col-md-3">
                        <label>Employment Status</label>
                        <input value={this.state.Emplymentstatus == null ? '' : this.state.Emplymentstatus} onChange={(e) => this.onChangeName(e, 'Emplymentstatus')} class="form-control" placeholder=""></input>
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

                                }} className="clickable underline-label" style={{ float: 'right', marginRight: '20px', color: "#139DC9", fontWeight: 'bold' }}> Edit</label><br></br> </div>
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

    renderFileLevelTable() {

        let columnDefs = [
            { headerName: "File Name", field: "FileName", width: 360, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
            { headerName: "File Date", field: "Date", width: 200 },
            { headerName: "Submitter", field: "Subscriber", width: 200 },
            // { headerName: "Enrollments", field: "Enrollment", },
            { headerName: "Errors", field: "Error", flex: 1 },

            // { headerName: "File Status", field: "FileStatus", flex: 1 },
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
                        rowData={this.state.rowData}
                        icons={this.state.icons}
                        enableCellTextSelection={true}
                        onCellClicked={(event) => {
                            if (event.colDef.headerName == 'File Name') {
                                this.setState({
                                    showClaims: true,
                                    showerror: false,
                                    showDetailsEnrollment: false,
                                    claims_rowData: [],
                                    Ag_grid_FileName: '',
                                    Ag_grid_fileDate: '',
                                    showMemberInfo: false
                                }, () => {
                                    this.onClick(event.data.FileID)
                                })
                            }

                        }}
                    >
                    </AgGridReact>
                </div>
            </div>
        )


    }

    onSelect(event, key) {
        console.log(event.target.options[event.target.selectedIndex].value)
        this.setState({
            [key]: event.target.options[event.target.selectedIndex].value,
        })
        setTimeout(() => {
            this._refreshScreen()
        }, 50);
    }

    renderTableEnrollmentLevel() {
        let columnDefs = [
            { headerName: "Subscriber No", field: "SubscriberNo", width: 120, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal', color: '#139DC9', cursor: 'pointer' } },
            { headerName: "First Name", field: "MemberFName", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "Last Name", field: "MemberLName", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            { headerName: "DOB", field: "dateofbirth", width: 100 },
            { headerName: "Gender", field: "gender", width: 100 },
            { headerName: "State", field: "State", width: 100 },
            { headerName: "Exception", field: "Exception", flex: 1, cellStyle: { color: '#139DC9', cursor: 'pointer' }  },
            // { headerName: "City", field: "City", width: 100 },
            // { headerName: "Address", field: "StreetAddress", width: 180, flex: 1, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            // { headerName: "Postal Code", field: "PostalCode", width: 100 },
            // { headerName: "Policy No.", field: "Member_Policy_No", width: 100 },
            // { headerName: "Enrollment Type", field: "EnrollmentType", width: 150, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            // { headerName: "Insurer Status", field: "InsurerStatus", width: 100,cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            // { headerName: "Status", field: "Status1", width: 100, cellStyle: { wordBreak: 'break-all', 'white-space': 'normal' } },
            // { headerName: "Error Description", field: "error_desc", flex: 1, cellStyle: { color: '#139DC9', cursor: 'pointer' } },
            // { headerName: "", field: "Resubmit",width: 100,cellStyle: {  color: '#139DC9', cursor: 'pointer' , fontWeight:'bold'} },
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
                        rowData={this.state.statusArray}
                        icons={this.state.icons}
                        enableCellTextSelection={true}
                        onCellClicked={(event) => {
                            if (event.colDef.headerName == "Exception") {
                                this.setState({
                                    clickedError: event.data.Exception
                                }, () => {
                                    $('#enrollment_Error_Modal_').modal('show')
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
            <div class="modal" id="enrollment_Error_Modal_" role="dialog" aria-labelledby="myModalLabel2" data-backdrop="static" data-keyboard="false">
                <div class="modal-dialog-error">
                    <div className="error-dialog">
                        <div className="error-header">Error Description</div>
                        <div className="scroll-div">
                            {this.state.clickedError}
                        </div>
                        <br />
                        <div className="btnDesign close-button clickable"
                            onClick={() => {
                                $('#enrollment_Error_Modal_').modal('hide')
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
                            <span class="close clickable">&times;</span>
                        </div>

                        <div>
                            {this.state.showMemberInfo ? this.renderMemberinfo() : null}
                        </div>

                    </div>
                </div>
            </div>
        )
    }

    renderCoverageTable() {

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
                    <h6 className="font-size">Coverage Data </h6>
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
                        rowData={this.state.rowData_CoverageData}
                        icons={this.state.icons}
                        enableCellTextSelection={true}

                    >
                    </AgGridReact>
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
                    <div className="form-group col-4" style={{ padding: "0px" }}>
                        <div className="list-dashboard">File Name</div>
                        <select className="form-control list-dashboard" id="FileName"
                            onChange={(event) => {
                                this.onSelect(event, 'selected_FileID')
                            }}>
                            <option value="select"></option>
                            <option selected={this.state.selected_FileID == '834_UT_Audit.da' ? "selected" : ''} value="834_UT_Audit.da">834_UT_Audit.da</option>
                            <option selected={this.state.selected_FileID == '834_UT_Daily.da' ? "selected" : ''} value="834_UT_Daily.da">834_UT_Daily.da</option>
                            {/* {this.FileName()} */}
                        </select>
                        {/* <input type="text" name="name" value={this.state.selected_FileID} className="form-control list-dashboard"  /> */}
                    </div>
                    {/* <div className="form-group col-2">
                        <div className="list-dashboard">Date of birth</div>
                        <DatePicker className="form-control list-dashboard"
                            selected={this.state.filter_dob ? new Date(moment(this.state.filter_dob).format('YYYY-MM-DD hh:mm')) : ''}
                            onChange={this.handledobChange}
                            maxDate={new Date(moment().format('YYYY-MM-DD hh:mm'))}
                        />
                    </div> */}
                </div>

            </div>
        )
    }

    render() {
        var title = ""
        if (this.props.location.state && this.props.location.state.data && this.props.location.state.data[0].Total == "error") {
            title = "Load Exception";
        }
        else {
            title = "Load Exception ";
        }
        return (

            <div>
                <h5 className="headerText">{title}{this.state.subtitle ? <label style={{ fontSize: "14px" }}>({this.state.subtitle})</label> : ""}</h5>
                {/* {this._renderTopbar()} */}
                {this.renderFilters()}
                <div>
                    {this.renderTableEnrollmentLevel()}
                    {this.state.showDetailsEnrollment ? this.renderSummary() : null}
                </div>
                {this.errorDialogBox()}
                {this.MemberInfoDialogbox()}
            </div>
        );
    }
}