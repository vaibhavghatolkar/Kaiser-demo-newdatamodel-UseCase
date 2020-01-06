import Urls from "./Urls";

export const getDetails = async(key) => {
    let query = `{
        Trading_PartnerList(Transaction:"`+key+`") {
            Trading_Partner_Name 
        }
    }`

    return fetch(Urls.common_data, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({query: query})
    })
    .then(res => res.json())
    .then(res => {
        if(res.data){
            return(res.data.Trading_PartnerList)
        }
    })
    .catch(err => {
        console.log(err)
    });
}