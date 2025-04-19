import axios from "axios";

class Createrequest {
    createnewrequest(body) {
        console.log(body)
        // const config = {
        //     headers: {Authorization: `Bearer ${token}`, 'Access-Control-Allow-Origin': '*'}
        // }
        let res= axios.post("http://localhost:8092/patient_end/api/v1/patient/create-appointment", body);
        return res;
    }
}
const createrequest =new Createrequest()
export default createrequest ;