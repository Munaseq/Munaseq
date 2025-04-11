import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import * as argon2 from 'argon2';
import {
  PrismaClientKnownRequestError,
} from '@prisma/client/runtime/library';
import { EditUserInfoDto, userChangePasswordDto } from './dtos';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async deleteUser(id: string) {
    await this.prisma.event.deleteMany({
      where: {
        eventCreatorId: id,
      },
    });
    return this.prisma.user.delete({
      where: {
        id: id,
      },
      omit: {
        password: true,
      },
    });
  }

  async deleteAll() {
    try {
      const deletedUsers = await this.prisma.user.deleteMany();
      return { count: deletedUsers.count }; // Return the count of deleted users
    } catch (error) {
      throw new HttpException(
        'Error deleting users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: string) {
    try {
      return await this.prisma.user.findUniqueOrThrow({
        where: {
          id,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new HttpException(
          'No account with the provided id has been found',
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByEmail(email: string) {
    try {
      return await this.prisma.user.findUniqueOrThrow({
        where: {
          email,
        },
      });
    } catch (error) {
      // Catch specific errors when a record is not found
      if (error instanceof NotFoundException) {
        throw new HttpException(
          'No account with the provided email has been found',
          HttpStatus.NOT_FOUND,
        );
      }
      // Handle other known request error (if applicable)
      if (error instanceof PrismaClientKnownRequestError) {
        throw new HttpException('Database error', HttpStatus.BAD_REQUEST);
      }
      // For other unexpected errors, throw internal server error
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByUsername(username: string) {
    try {
      return await this.prisma.user.findUniqueOrThrow({
        where: {
          username,
        },
      });
    } catch (error) {
      // Catch specific error when a record is not found
      if (error instanceof NotFoundException) {
        throw new HttpException(
          'No account with the provided username has been found',
          HttpStatus.NOT_FOUND,
        );
      }
      // Handle other known request errors (if applicable)
      if (error instanceof PrismaClientKnownRequestError) {
        throw new HttpException('Database error', HttpStatus.BAD_REQUEST);
      }
      // For other unexpected errors, throw internal server error
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async editUserInfo(
    id: string,
    EditUserDto: EditUserInfoDto,
    cvUrl?,
    profilePictureUrl?,
    removeImage?: boolean,
    removeCV?: boolean,
  ) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      cvUrl = cvUrl ?? user.cvUrl;
      profilePictureUrl = profilePictureUrl ?? user.profilePictureUrl;
      //Check if the updated categrories exist, if so, it will ensure that the single value will be stored as an array (to avoid confilcting with Prisma model )

      if (EditUserDto.categories) {
        EditUserDto.categories = Array.isArray(EditUserDto.categories)
          ? EditUserDto.categories
          : [EditUserDto.categories];
      }

      return this.prisma.user.update({
        where: { id: id },
        data: {
          ...EditUserDto,
          profilePictureUrl: removeImage ? '' : profilePictureUrl,
          cvUrl: removeCV ? '' : cvUrl,
        },
        omit: {
          password: true,
        },
      });
    } catch (error) {
      throw new HttpException(
        'Invalid Information Provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // this should not return all the users information including password and such
  async findAllUsers(
    username?: string,
    pageNumber: number = 1,
    pageSize: number = 5,
  ) {
    const skipedRecords = (pageNumber - 1) * pageSize;
    if (username) {
      return this.prisma.user.findMany({
        where: {
          username: {
            contains: username,
          },
        },
        omit: {
          password: true,
        },
        take: pageSize,
        skip: skipedRecords,
      });
    } else {
      return this.prisma.user.findMany({
        omit: {
          password: true,
        },
        take: pageSize,
        skip: skipedRecords,
      });
    }
  }
  async findUserRoles(userId: string) {
    const result = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        createdEvents: {
          select: {
            id: true,
          },
        },
        joinedEvents: {
          select: {
            id: true,
          },
        },
        moderatedEvents: {
          select: {
            id: true,
          },
        },
        presentedEvents: {
          select: {
            id: true,
          },
        },
      },
    });
    if (result) {
      return result;
    } else {
      throw new NotFoundException("The userId dosen't exist");
    }
  }
  async getUserRating(userId: string) {
    const result = await this.prisma.event.findMany({
      where: {
        eventCreatorId: userId,
      },
      select: {
        GivenFeedbacks: {
          select: {
            rating: true,
          },
        },
      },
    });
    if (!result) {
      throw new NotFoundException('Event not found');
    }
    // Calculate the total number of ratings
    const numberOfRatings = result.reduce(
      (sum, curr) => sum + curr.GivenFeedbacks.length,
      0,
    );

    // Calculate the sum of all ratings
    const sumOfRating = result.reduce(
      (sum, curr) =>
        sum +
        curr.GivenFeedbacks.reduce(
          (ratingSum, feedback) => ratingSum + feedback.rating,
          0,
        ),
      0,
    );

    const avgRating =
      numberOfRatings > 0 ? sumOfRating / numberOfRatings : null;
    if (avgRating) {
      return {
        avgRating,
        numberOfRatings,
      };
    } else {
      return { message: "The user hasn't being rated yet" };
    }
  }
  async changeUserPassword(
    passwordChangeDto: userChangePasswordDto,
    userId: string,
  ) {
    // Retrieve the user's current hashed password
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    // Verify the old password matches the stored hash
    const isOldPasswordValid = await argon2.verify(
      user.password,
      passwordChangeDto.oldpassword,
    );

    if (!isOldPasswordValid) {
      throw new HttpException(
        'Invalid Information Provided',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Hash the new password
    const hash = await argon2.hash(passwordChangeDto.newpassword);

    // Update the user's password
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hash,
      },
      omit: {
        password: true,
      },
    });
  }
}
