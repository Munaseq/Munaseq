// src/auth/auth.service.ts
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { userSignUpDto, userSignInDto } from './dtos';
import { JwtPayload } from './types/jwtPayload';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private prisma: PrismaService,
  ) {}

  async signIn(signInDto: userSignInDto): Promise<any> {
    if (signInDto.email) {
      signInDto.email = signInDto.email.toLowerCase();
    }
    if (signInDto.username) {
      signInDto.username = signInDto.username.toLowerCase();
    }
    let user;

    // Check if email or username was provided and find the user accordingly
    if (signInDto.email) {
      user = await this.userService.findByEmail(signInDto.email);
    } else if (signInDto.username) {
      user = await this.userService.findByUsername(signInDto.username);
    } else {
      throw new UnauthorizedException(
        'You must provide either an email or username',
      );
    }
    // Check if the user was found and the password matches
    if (!user || !(await argon2.verify(user.password, signInDto.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload: JwtPayload = { sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signup(signUpDto: userSignUpDto, profilePictureUrl?: any, cvUrl?: any) {
    signUpDto.email = signUpDto.email.toLowerCase();
    signUpDto.username = signUpDto.username.toLowerCase();

    // Check if the email is already in use
    const existingEmailUser = await this.prisma.user.findUnique({
      where: { email: signUpDto.email },
    });

    if (existingEmailUser) {
      throw new HttpException(
        'This email is already in use',
        HttpStatus.CONFLICT,
      );
    }

    // Check if the username is already in use
    const existingUsernameUser = await this.prisma.user.findUnique({
      where: { username: signUpDto.username },
    });

    if (existingUsernameUser) {
      throw new HttpException(
        'This username is already in use',
        HttpStatus.CONFLICT,
      );
    }
    signUpDto.categories = Array.isArray(signUpDto.categories)
      ? signUpDto.categories
      : [signUpDto.categories];
    // Hash the password

    const hash = await argon2.hash(signUpDto.password);

    // Create the new user

    const user = await this.prisma.user.create({
      data: {
        email: signUpDto.email,
        password: hash,
        firstName: signUpDto.firstName,
        lastName: signUpDto.lastName,
        username: signUpDto.username,
        gender: signUpDto.gender,
        categories: signUpDto.categories,
        description: signUpDto.description,
        profilePictureUrl: profilePictureUrl,
        cvUrl: cvUrl,
        socialAccounts: signUpDto.socialAccounts,
      },
    });

    // Automatically log the user in after registration
    const signInDto = new userSignInDto();
    signInDto.email = signUpDto.email;
    signInDto.password = signUpDto.password;
    signInDto.username = signUpDto.username;
    return { ...(await this.signIn(signInDto)), ...user };
  }
}
