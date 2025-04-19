import axios from "axios";

class Fetchimage {
    fetchimage(aid) {
        console.log("inside fetchimage",aid)
        // const config = {
        //     headers: { Authorization: `Bearer ${token}` ,'Access-Control-Allow-Origin': '*'}
        // }
        let res= axios.get("http://localhost:8090/admin_end/api/v1/doctor/view-appointment-details/"+aid,{ responseType: 'blob' });
        console.log("After fetchimage api")
        return res;
    }
}

const fetch =new Fetchimage()
export default fetch ;