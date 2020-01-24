let base_url = 'http://localhost:4000'
// let base_url = 'http://10.0.1.71:30508'
// let base_url = 'http://10.0.1.248:30508'
const Urls = {
    base_url : 'http://localhost:4000/graphQl',
    // base_url : 'http://10.0.1.71:30508/graphQl',
    // base_url : 'http://10.0.1.248:30508/graphQl',
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
}

export default Urls;