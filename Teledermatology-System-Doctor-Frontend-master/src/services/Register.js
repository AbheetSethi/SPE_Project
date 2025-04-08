import axios from "axios";
axios.defaults.withCredentials = true
class Register {

    register_doctor(data) {
        console.log(data)
        let res= axios.post("http://localhost:8090/admin_end/api/v1/auth/register",data,
            {withCredentials: true,
                headers: {
                    'Content-Type': 'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Credentials':'true'
                    //             'Cookie': 'cookieName=${token}',
                }}
        );
        console.log(res)
        return res;
    }
}

const register =new Register()
export default register ;