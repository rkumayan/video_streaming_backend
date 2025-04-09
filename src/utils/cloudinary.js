import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

import 'dotenv/config';

const  uploadOnCloudinary = async (localFilePath) => { 
    try{
        if(!localFilePath) 
            throw new Error('No file path provided');
        // upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
        });
        // console.log(response);

        // file has been uploaded successfully 
        console.log('File uploaded successfully ' , response.url);
        return response;        
    }
    catch{
        fs.unlinkSync(localFilePath); // remove the locally saved temporary files if upload fails
        return null;
    }
}

export default uploadOnCloudinary;
