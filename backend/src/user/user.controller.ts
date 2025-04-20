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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  getMe(@GetCurrentUserId() id: string) {
    return this.userService.findById(id);
  }
  //allows to search by username letters (Used in search bar)
  @Get()
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
      execludedUsers,
    );
  }

  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }
  //Returns |specific| user (must contains the full username)(used when visiting specific user's profile)
  @Get('username/:username')
  findByUsername(@Param('username') username: string) {
    return this.userService.findByUsername(username);
  }
  @Get('roles/:userId')
  findUserRoles(@Param('userId') userId: string) {
    return this.userService.findUserRoles(userId);
  }
  @UseGuards(AuthGuard)
  @Patch()
  @UseInterceptors(multerUserLogic())
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
  getUserRating(@Param('userId') userId: string) {
    return this.userService.getUserRating(userId);
  }
  @UseGuards(AuthGuard)
  @Get('invitation')
  getInvitation(@GetCurrentUserId() userId) {
    return this.userService.getInvitation(userId);
  }
  @UseGuards(AuthGuard)
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
  @Post('changePassword')
  changePassword(
    @Body() passwordChangeDto: userChangePasswordDto,
    @GetCurrentUserId() userId,
  ) {
    return this.userService.changeUserPassword(passwordChangeDto, userId);
  }
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }
  @UseGuards(AuthGuard)
  @Delete()
  async deleteUser(@GetCurrentUserId() id) {
    return this.userService.deleteUser(id);
  }
  //   @Delete()
  //   async deleteAll() {
  //     return this.userService.deleteAll();
  //   }
}
