import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

import 'dotenv/config';

const  uploadOnCloudinary = async (localFilePath) => { 
    try{
        if(!localFilePath) 
            throw new Error('No file path provided');
        
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET            
          });

        // upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
        });
        

        fs.unlinkSync(localFilePath); // remove the locally saved temporary files after upload
        return response;        
    }
    catch{
        fs.unlinkSync(localFilePath); // remove the locally saved temporary files if upload fails
        return null;
    }
}

export default uploadOnCloudinary;
