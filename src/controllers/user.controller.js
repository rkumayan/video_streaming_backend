import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary  from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async(userId) => { 
    try{
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save( {validateBeforeSave : false});
        return { accessToken , refreshToken };
    }
    catch(err){
        throw new ApiError(500 , "something went wrong while generating access and refresh tokens")
    }
}

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

    
    const avatarLocalPath = req.files?.avatar[0]?.path;  // 4
    let coverLocalPath = "";
    if( req.files && Array.isArray(req.files.cover) && req.files.cover.length > 0 ) 
        coverLocalPath = req.files.cover[0].path; 

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

const loginUser = asyncHandler(async (req, res) => {
    // what to do
    // 1) get user details from frontend( email and password)
    // 2) validate user details ( not empty)
    // 3) check if user exists ( email )
    // 4) check for password match
    // 5) generate access token and refresh token
    // 6) send response to frontend with user details and tokens

    const { email, userName, password } = req.body;  
    if( !userName && !email ) 
        throw new ApiError(400 , "email or username is required");  // 1

    const user = await User.findOne( {
        $or : [ {email} , {userName} ]
    })
    if( !user)
        throw new ApiError(401 , "user not found"); 

    const isPasswordValid = await user.isPasswordCorrect(password);

    if( !isPasswordValid )
        throw new ApiError(401 , "invalid credentials");  

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly : true,
        secure : true
    }
    return res.status(200)
        .cookie( "accessToken" ,accessToken, options )
        .cookie( "refreshToken" , refreshToken, options )
        .json( new ApiResponse(
                200 , 
                { user : loggedInUser , refreshToken , accessToken},
                "user logged in successfully"
            ) 
        );


})

const LogoutUser = asyncHandler(async (req, res) => {
    // what to do
    // 1) clear cookies
    // 2) send response to frontend with message

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }            
        },
        { new: true}    
    );
    const options = {
        httpOnly : true,
        secure : true
    }
    return res.status(200)
        .clearCookie("accessToken" , options)
        .clearCookie("refreshToken" , options)
        .json( new ApiResponse(200, {} , "user logged out successfully") );

});

export { 
    registerUser,
    loginUser,
    LogoutUser,
 };