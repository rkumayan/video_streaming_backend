import {Router} from 'express';
import { loginUser, LogoutUser, registerUser } from '../controllers/user.controller.js';
import {upload} from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
const router = Router();

router.route('/register').post( 
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'cover', maxCount: 1 }
    ]), 
    registerUser
)

router.route('/login').post(loginUser);
// secured routes
router.route("/logout").post(verifyJWT, LogoutUser)

export default router;