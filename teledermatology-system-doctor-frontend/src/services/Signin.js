import axios from "axios";
axios.defaults.withCredentials = true
class Signin {
    login(credentials) {
        console.log(credentials)
        return axios.post("http://localhost:8090/admin_end/api/v1/auth/authenticate",credentials,{
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin':'*',
                    'Access-Control-Allow-Credentials':'true'
                }
            }
        );
    }
}

const signin =new Signin()
export default signin ;

