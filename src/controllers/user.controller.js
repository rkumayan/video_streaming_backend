import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary  from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
    
    // what to do
    // 1) get user details from frontend
    // 2) validate user details ( not empty)
    // 3) check if user already exists ( email and username)
    // 4) check for Image( avatar)
    // 5) upload image to cloudinary
    // 6) create user object and create entry in database
    // 7) remove password and refresh token from user object
    // 8) check for user creation
    // 9) send response to frontend with user details
    const { userName, fullName , email, password } = req.body;  // 1

    if( fullName === "" || userName === "" || email === "" || password === "") { // 2
        throw new ApiError(400 , "all fields are required");        
    }
    const existedUser = await User.findOne( { $or : [ {userName} , {email} ] } );  // 3
    
    if( existedUser )   
        throw new ApiError(409 , "user already exists" );

    const avatarLocalPath = req.files?.avatar[0]?.path  // 4
    const coverLocalPath = req.files?.cover[0]?.path

    if( !avatarLocalPath)
        throw new ApiError(400 , "e1: avatar file is required")
    

    const avatar = await uploadOnCloudinary(avatarLocalPath)    // 5
    const coverImage = await uploadOnCloudinary(coverLocalPath);
    
    if( !avatar )
        throw new ApiError( 400, "e2: avatar file is required");

    const user = await User.create({        //6
        fullName, 
        avatar : avatar.url,
        coverImage : coverImage?.url || "" ,
        userName : userName.toLowerCase(),
        email,
        password
    });

    const createdUser = await User.findById(user._id).select(   // 7
        "-password -refreshToken"
    );

    if( !createdUser)    // 8
        throw new ApiError(500, "something went wrong while registering the user");

    
    return res.status(201).json( 
        new ApiResponse(200 , createdUser , "user registered successfully")
    )


        

});
export { registerUser };