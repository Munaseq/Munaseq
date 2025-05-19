import { AuthService } from './auth.service';
import { userSignInDto, userSignUpDto } from './dtos';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signIn(signInDto: userSignInDto): Promise<any>;
    signUp(body: userSignUpDto, files: {
        cv?: any;
        profilePicture?: any;
    }): Promise<any>;
}
