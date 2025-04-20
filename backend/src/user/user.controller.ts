import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiOperation,
} from '@nestjs/swagger';

import { GetCurrentUserId } from '../auth/decorators/get-current-user-id.decorator';
import { AuthGuard } from '../auth/auth.guard';
import {
  EditUserInfoDto,
  RespondInvitationDto,
  SeacrhUser,
  userChangePasswordDto,
} from './dtos';
import { multerUserLogic } from 'src/utils/multer.logic';
import { ExecludeUsers } from 'src/event/dtos';
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve the currently authenticated user.' })
  @Get('me')
  getMe(@GetCurrentUserId() id: string) {
    return this.userService.findById(id);
  }
  //allows to search by username letters (Used in search bar)
  @Get()
  @ApiOperation({
    summary: 'Search for users by username letters with optional pagination.',
  })
  @ApiQuery({
    name: 'username',
    required: false,
    type: String,
    description: 'Username substring to search.',
  })
  @ApiQuery({
    name: 'pageNumber',
    required: false,
    type: Number,
    description: 'Page number for pagination.',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Page size for pagination.',
  })
  @ApiQuery({
    name: 'highestRated',
    required: false,
    type: Boolean,
    description: 'Retreives the highestRated users.',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    description: 'Retreives the users that have the category.',
  })
  @ApiBody({
    description:
      'Excluded users, helpful when searching for users to invite and you want to exclude the ones that are already invited.',
    required: false,
    type: ExecludeUsers,
  })
  findAll(
    @Query() query: SeacrhUser,
    @Body() execludedUsersDto?: ExecludeUsers,
  ) {
    const { execludedUsers } = execludedUsersDto;
    return this.userService.findAllUsers(
      query.username,
      query.pageNumber,
      query.pageSize,
      query.highestRated,
      query.category,
      execludedUsers,
    );
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Retrieve a user by email.' })
  @ApiParam({ name: 'email', description: 'Email of the user to find.' })
  findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Get('username/:username')
  @ApiOperation({ summary: 'Retrieve a user by their full username.' })
  @ApiParam({ name: 'username', description: 'Username of the user to find.' })
  findByUsername(@Param('username') username: string) {
    return this.userService.findByUsername(username);
  }
  @Get('roles/:userId')
  @ApiOperation({ summary: 'Get roles assigned to a specific user.' })
  @ApiParam({ name: 'userId', description: 'ID of the user.' })
  findUserRoles(@Param('userId') userId: string) {
    return this.userService.findUserRoles(userId);
  }
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch()
  @UseInterceptors(multerUserLogic())
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary:
      'Edit the current user information including optional file uploads for CV and profile picture.',
  })
  @ApiBody({
    description:
      'Payload for editing user info. Fields correspond to EditUserInfoDto and include file uploads for cv and profilePicture.',
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string', description: 'First name of the user.' },
        lastName: { type: 'string', description: 'Last name of the user.' },
        username: { type: 'string', description: 'Username of the user.' },
        email: {
          type: 'string',
          format: 'email',
          description: 'User email address.',
        },
        visibleName: {
          type: 'string',
          description: 'Display name or organization name.',
        },
        gender: {
          type: 'string',
          enum: ['MALE', 'FEMALE', 'OTHER'],
          description: 'Gender of the user.',
        },
        categories: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of user interests.',
        },
        description: { type: 'string', description: 'User biography.' },
        socialAccounts: {
          type: 'object',
          description: 'JSON object for social media accounts.',
        },
        cv: {
          type: 'string',
          format: 'binary',
          description: 'CV file upload.',
        },
        profilePicture: {
          type: 'string',
          format: 'binary',
          description: 'Profile picture file upload.',
        },
      },
    },
  })
  editUserInfo(
    @GetCurrentUserId() id,
    @Body() EditUserDto: EditUserInfoDto,
    @UploadedFiles()
    files: {
      cv?: any;
      profilePicture?: any;
    },
    @Query('removeImage') removeImage?: boolean,
    @Query('removeCV') removeCV?: boolean,
  ) {
    const cvUrl = files?.cv ? files.cv[0].location : null; // S3 location of the CV
    const profilePictureUrl = files?.profilePicture
      ? files.profilePicture[0].location
      : null; // S3 location of the profile picture
    return this.userService.editUserInfo(
      id,
      EditUserDto,
      cvUrl,
      profilePictureUrl,
      removeImage,
      removeCV,
    );
  }
  @Get('rating/:userId')
  @ApiOperation({ summary: 'Get the rating of a user by their ID.' })
  @ApiParam({ name: 'userId', description: 'ID of the user.' })
  getUserRating(@Param('userId') userId: string) {
    return this.userService.getUserRating(userId);
  }
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('invitation')
  @ApiOperation({
    summary: "Get all invitations, wether they've sent or received",
  })
  getInvitation(@GetCurrentUserId() userId) {
    return this.userService.getInvitation(userId);
  }
  //SWAGGER NOT APPLIED
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('invitation')
  respondInvitation(
    @Body() body: RespondInvitationDto,
    @GetCurrentUserId() userId: string,
  ) {
    return this.userService.resopndInvitation(
      userId,
      body.invitationId,
      body.decision,
    );
  }
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('changePassword')
  @ApiOperation({
    summary: 'Change the password for the currently authenticated user.',
  })
  @ApiBody({
    description: 'Payload for changing user password.',
    type: userChangePasswordDto,
  })
  changePassword(
    @Body() passwordChangeDto: userChangePasswordDto,
    @GetCurrentUserId() userId,
  ) {
    return this.userService.changeUserPassword(passwordChangeDto, userId);
  }
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a user by their ID.' })
  @ApiParam({ name: 'id', description: 'ID of the user to find.' })
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Delete()
  @ApiOperation({ summary: 'Delete the currently authenticated user.' })
  async deleteUser(@GetCurrentUserId() id) {
    return this.userService.deleteUser(id);
  }
}
