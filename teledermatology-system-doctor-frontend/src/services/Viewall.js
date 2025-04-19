import axios from "axios";

class Viewall {
    pastdata() {
        // const config = {
        //     headers: {Authorization: `Bearer ${token}`, 'Access-Control-Allow-Origin': '*'}
        // }
        // console.log('token='+ token)
        let res=axios.get("http://localhost:8090/admin_end/api/v1/doctor/view-appointments"
            // {
            //     withCredentials: true,
            //     headers: {
            //         'Content-Type': 'application/json',
            //         // 'Cookie': 'token='+ token
            //     }
            // }
        );
        console.log("inside view all",res)
        return res
    }
}
const viewall =new Viewall()
export default viewall ;