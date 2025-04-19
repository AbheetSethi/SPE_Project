import axios from "axios";

class Uploadimage {
    uploadimage(request) {
        // const config = {
        //     headers: { Authorization: `Bearer ${token}` ,'Access-Control-Allow-Origin': '*'}
        // }
        return axios.post("http://localhost:8092/patient_end/api/v1/patient/upload-image",request);
    }
}

const upload =new Uploadimage()
export default upload ;