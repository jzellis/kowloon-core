import Kowloon from "../../modules/kowloon"

export default async function handler(req, res) {

    
    let response = await Kowloon.settings();

    res.status(200).json(response)    
}