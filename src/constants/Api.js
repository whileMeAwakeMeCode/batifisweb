import Axios from 'axios'

//const API_URL = window.location.hostname === "localhost" ? "http://localhost:3001" : "https://batifis.herokuapp.com"
const API_URL = "https://batifis.herokuapp.com"


const Api = {

    get : async(dirName) => {
        try {
            const url = await Promise.resolve(`${API_URL}/${dirName}`)

            const fetchResponse = await fetch(url, {method: 'GET'})
            const data = await fetchResponse.json()

            return data

            // const img = "https://batifis.s3.eu-west-3.amazonaws.com/photos/logo.png"
            // return [url]
           
        }catch(e) {
            console.error(e || 'Api get error')
            return []
        }
    },
    /**
     * @param {Array} files : an array of File object to pass to api/upload post handler (will compute a FormData object)
     */
    upload : async(files, imageDatas) => {
        try {
            const data = await new Promise(async(resolve,reject)=>{
                let formData = new FormData();
            
                files.forEach(async(value,index) => {
                    await Promise.resolve(
                        formData.append('fileData', files[index])
                    )
                    if(index===files.length-1){
                        resolve(formData);
                    }
                })
            })

            const noB64ImagesDatas = await Promise.resolve(imageDatas.map((idta) => ({...idta, source: null})))
            data.append('imageDatas', JSON.stringify(noB64ImagesDatas))



            const axiosResponse = await Axios({
                method: "post",
                url: `${API_URL}/upload`,
                data,   // FormData
                config: { headers: { "Content-Type": "multipart/form-data" } }
            })


            return axiosResponse

        }catch(e) {
            console.log('Api put error', e)
            return false
        }
    },

    remove : async(source) => {
        try {
            const axiosParams = await Promise.resolve({
                method: "post",
                url: `${API_URL}/remove`,
                data: { source },   // FormData
            })

            const axiosResponse = await Axios(axiosParams)


            return axiosResponse
        }catch(e) {
            const errMsg = `Api -> remove error : error while removing source ${source}`
            console.error(errMsg, e)
            throw(errMsg)
        }
    },
    /**
     * @dev Make a login post request to the server
     * @param {string} hash a valid admin hash for connexion
     * @return {object} {connected} 
     */
    login: async(hash) => {

        try {
            const {status, data} /*{status, data: connected}*/ = await Axios({
                method: "post",
                url: `${API_URL}/login`,
                data: { hash },   // FormData
            })

            return status === 200 ? data.connected : false
            
        }catch(e) {
            console.log(' ---> login error', e)
            return false
        }
    },

}

export default Api


/* 
    PHOTO UPLOAD : 
    Axios({
        method: "post",
        url: `${process.env.API_URL}/upload`,
        data,   // FormData
        config: { headers: { "Content-Type": "multipart/form-data" } }
    })

*/