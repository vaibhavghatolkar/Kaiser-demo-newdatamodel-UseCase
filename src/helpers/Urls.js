// let base_url = 'http://localhost:4000' //local
// let _base_url = 'http://localhost:4000' //local


let base_url = 'http://10.0.1.248:30544' //graph
let _base_url = 'http://10.0.1.248:30528' //local
let sql_base_url = 'http://10.0.1.248:30506'
// let base_url = 'http://10.0.1.71:30506' //sql
//  let base_url = 'http://10.229.4.247:30108' //molina
//  let base_url = 'http://hapiservice.hipaas-stage.svc.cluster.local:4000' //service
const Urls = {
    // base_url : 'http://localhost:4000/graphQl', //local
    base_url : 'http://10.0.1.248:30544/graphQl', //local
    // base_url : 'http://10.0.1.71:30506/graphQl', //sql
    // base_url : 'http://10.0.1.248:30508/graphQl', //graph
    // base_url : 'http://10.229.4.247:30108/graphQl', //molina
    // base_url : 'http://hapiservice.hipaas-stage.svc.cluster.local:4000/graphql', //service
    eligibility_url : base_url + '/eligibility',
    common_data : base_url + '/common_data',
    claimstatus : base_url + '/claimstatus',
    claims_837 : base_url + '/claims_837',
    claim_details : base_url + '/claim_details',
    match_claims : base_url + '/match_claims',
    users : base_url + '/users',
    enrollment : base_url + '/enrollment',
    enrollment_details : base_url + '/enrollment_details',
    full_file : base_url + '/full_file',
    real_time_claim : base_url + '/real_time_claim',
    claim_processing : base_url + '/claim_processing',
    real_time_claim_details : base_url + '/real_time_claim_details',
    tradingPartner : base_url + '/tradingPartner',
    TradingPartner : base_url + '/TradingPartner',
    customEdits: base_url + '/customEdits',
    transaction835: base_url + '/transaction835',
    transaction270: base_url + '/transaction270',
    tradingPartnerAdmin: base_url + '/tradingPartnerAdmin',
    CustomConfiguration: base_url + '/CustomConfiguration',
    transaction275: base_url + '/transaction275',


    _base_url : 'http://10.0.1.248:30528/graphQl', //local
    _eligibility_url : _base_url + '/eligibility',
    _common_data : _base_url + '/common_data',
    _claimstatus : _base_url + '/claimstatus',
    _claims_837 : _base_url + '/claims_837',
    _Encounter : _base_url + '/Encounter',
    _claim_details : _base_url + '/claim_details',
    _match_claims : _base_url + '/match_claims',
    _users : _base_url + '/users',
    _enrollment : _base_url + '/enrollment',
    _enrollment_details : _base_url + '/enrollment_details',
    _full_file : _base_url + '/full_file',
    _real_time_claim : _base_url + '/real_time_claim',
    _claim_processing : _base_url + '/claim_processing',
    _real_time_claim_details : _base_url + '/real_time_claim_details',
    _tradingPartner : _base_url + '/tradingPartner',
    _TradingPartner : _base_url + '/TradingPartner',
    _customEdits: _base_url + '/customEdits',
    _transaction834: _base_url + '/transaction834',
    _Payment820: _base_url + '/Payment820',
    _transaction834 : _base_url + '/transaction834',
    
    _Response999 : base_url + '/common_data', 
    _transaction835: base_url + '/transaction835',
    _inbound_common_data: base_url + '/common_data',
    _inbound_Encounter : base_url + '/Encounter',
    _inbound_base_url : base_url + '/graphQl',
    _inbound_claims_837 : base_url + '/claims_837',
    _inbound_real_time_claim_details : base_url + '/real_time_claim_details',
    _inbound_claim_processing : base_url + '/claim_processing',

    // sql_base_url : 'http://localhost:4000/graphQl',
    sql_base_url : 'http://10.0.1.248:30506/graphQl',
    sql_real_time_claim_details : sql_base_url + '/real_time_claim_details',
    sql_common_data : sql_base_url + '/common_data',
    sql_real_time_claim : sql_base_url + '/real_time_claim',
    
}

export default Urls;