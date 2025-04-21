import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { multerUserLogic } from 'src/utils/multer.logic';
import { ApiTags, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { userSignInDto, userSignUpDto } from './dtos';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signIn')
  @ApiBody({ type: userSignInDto })
  @ApiOperation({ summary: 'SignIn for old users.' })
  signIn(@Body() signInDto: userSignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('signUp')
  @UseInterceptors(multerUserLogic())
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'SignUp for new users.' })
  @ApiBody({
    description: 'User sign up data including file uploads',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        username: { type: 'string' },
        visibleName: { type: 'string' },
        gender: { type: 'string', enum: ['MALE', 'FEMALE', 'OTHER'] }, // Adjust values per your Gender enum
        categories: {
          type: 'array',
          items: { type: 'string' },
        },
        description: { type: 'string' },
        socialAccounts: { type: 'object' },
        cv: { type: 'string', format: 'binary' },
        profilePicture: { type: 'string', format: 'binary' },
      },

      required: [
        'email',
        'password',
        'firstName',
        'lastName',
        'username',
        'gender',
      ],
    },
  })
  signUp(
    @Body() body: userSignUpDto,
    @UploadedFiles()
    files: {
      cv?: any;
      profilePicture?: any;
    },
  ) {
    const cvUrl = files?.cv ? files.cv[0].location : null; // S3 location of the CV
    const profilePictureUrl = files?.profilePicture
      ? files.profilePicture[0].location
      : null; // S3 location of the profile picture

    return this.authService.signup(body, profilePictureUrl, cvUrl);
  }
}
