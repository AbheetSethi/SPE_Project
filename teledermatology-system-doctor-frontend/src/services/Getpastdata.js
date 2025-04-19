import axios from "axios";

class Getpastdata {
    pastdata(pid) {
        console.log(pid)
        // const config = {
        //     headers: {Authorization: `Bearer ${token}`, 'Access-Control-Allow-Origin': '*'}
        // }
        // console.log('token='+ token)
        let res=axios.get("http://localhost:8092/patient_end/api/v1/patient/past-appointments?pid="+pid
            // {
            //     withCredentials: true,
            //     headers: {
            //         'Content-Type': 'application/json',
            //         // 'Cookie': 'token='+ token
            //     }
            // }
        );
        console.log("inside getpast response",res)
        return res
    }
}
const getpastdata =new Getpastdata()
export default getpastdata ;