import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';

import { first, last } from 'rxjs';
import { userSignInDto, userSignUpDto } from '../src/auth/dtos';
import * as path from 'path';
import { EditUserInfoDto, userChangePasswordDto } from '../src/user/dtos';
import { CreateEventDto, UpdateEventDto } from '../src/event/dtos';

describe('App e2e ', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile(); //compolie -> for integration purposes
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
    await app.listen(3001);
    prismaService = app.get(PrismaService);
    await prismaService.cleanDB();
    pactum.request.setBaseUrl('http://localhost:3001');
  });
  let token: string;
  let firstUserId: string;
  let firstEventId: string;
  describe('Auth', () => {
    describe('Signup', () => {
      const body: userSignUpDto = {
        email: 'hisham@gmail.com',
        password: '123',
        firstName: 'Hisham',
        lastName: 'Alsuhaibani',
        gender: 'MALE',
        username: 'krcherheadx',
        categories: ['الدراسات الاسلامية', 'البرمجة', 'التكنولوجيا'],
        description: 'SWE student',
        visibleName: 'Krcher',
        socialAccounts: {
          twiiter: 'https://x.com/X',
          linkedin: 'https://www.linkedin.com/in/hisham-alsuhaibani-649a8a238/',
        },
      };
      const imagePath = path.resolve(
        __dirname,
        './sampleImages/munaseq-logo.png',
      ); // Path to the image
      const pdfPath = path.resolve(__dirname, './samplePdfs/infection_4.pdf'); // Path to the PDF

      it('should thorw an error if the email is empty!', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: body.password,
            firstName: body.firstName,
            lastName: body.lastName,
            gender: body.gender,
            username: body.username,
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should thorw an error if the username is empty!', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: body.password,
            firstName: body.firstName,
            lastName: body.lastName,
            gender: body.gender,
            email: body.email,
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should thorw an error if the password is empty!', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            username: body.username,
            firstName: body.firstName,
            lastName: body.lastName,
            gender: body.gender,
            email: body.email,
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should thorw an error if the firstName is empty!', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            username: body.username,
            password: body.password,
            lastName: body.lastName,
            gender: body.gender,
            email: body.email,
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should thorw an error if the lastName is empty!', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            username: body.username,
            firstName: body.firstName,
            password: body.password,
            gender: body.gender,
            email: body.email,
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should signup', () => {
        const spec = pactum
          .spec()
          .post('/auth/signup')
          .withFile('profilePicture', imagePath)
          .withFile('cv', pdfPath)
          .withMultiPartFormData({
            email: body.email,
            password: body.password,
            firstName: body.firstName,
            lastName: body.lastName,
            gender: body.gender,
            username: body.username,
            description: body.description,
            visibleName: body.visibleName,
            socialAccounts: JSON.stringify(body.socialAccounts),
          });
        const categories = [...body.categories];
        categories.forEach((category) => {
          spec.withMultiPartFormData('categories', category);
        });
        return spec
          .expectStatus(201)
          .stores('userToken', 'access_token')
          .stores('userId', 'id');
      });
    });
    describe('Signin', () => {
      const body: userSignInDto = {
        email: 'hisham@gmail.com',
        username: 'krcherheadx',
        password: '123',
      };
      it('should thorw an error if the both username or email are empty!', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: null,
            username: null,
            password: body.password,
          })
          .expectStatus(401);
      });
      it('should thorw an error if the password is empty!', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: body.email,
            password: null,
          })
          .expectStatus(400);
      });
      it('should thorw an error if the password is incorrect!', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: body.email,
            password: 'wrongPassword',
          })
          .expectStatus(401);
      });
      it('should login with email', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: body.email,
            password: body.password,
          })
          .expectStatus(201);
      });
      it('should login with username', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            username: body.username,
            password: body.password,
          })
          .expectStatus(201);
      });
    });
  });
  token = '$S{userToken}';
  firstUserId = '$S{userId}';
  describe('Event', () => {
    describe('Post create event', () => {
      const body: CreateEventDto = {
        title: 'SWE444 Course',
        description: 'The best course in the university!',
        categories: ['برمجة', 'تكنولوجيا'],
        gender: 'BOTH',
        seatCapacity: 100,
        location: 'Riyadh',
        startDateTime: new Date(),
        endDateTime: new Date(),
        price: 0,
      };

      it('the event shall be created and related to the creator user', () => {
        return pactum
          .spec()
          .post('/event/')
          .withBody({
            title: body.title,
            description: body.description,
            startDateTime: body.startDateTime,
            endDateTime: body.endDateTime,
            gender: body.gender,
            categories: body.categories,
            location: body.location,
            price: body.price,
            seatCapacity: body.seatCapacity,
          })
          .withBearerToken(token)
          .expectStatus(201)
          .stores('eventId', 'id');
      });
    });
    firstEventId = '$S{eventId}';
    describe('Get list all events', () => {
      it('it list all events', () => {
        return pactum.spec().get('/event/').expectStatus(200);
      });
    });
    describe('Get event by id', () => {
      it('list the event info', () => {
        return pactum
          .spec()
          .get('/event/{id}')
          .withPathParams('id', firstEventId)
          .expectStatus(200);
      });
    });
    describe('Patch update event', () => {
      const body: UpdateEventDto = {
        price: 100,
        description: 'Needs a great team like Munaseq Team !',
      };
      it('update the event details', () => {
        return pactum
          .spec()
          .patch('/event/{id}')
          .withBearerToken(token)
          .withPathParams('id', firstEventId)
          .withBody({ ...body })
          .expectStatus(200);
      });
    });
    describe('Get current events', () => {
      it('current user events', () => {
        return pactum
          .spec()
          .get('/event/current')
          .withBearerToken(token)
          .expectStatus(200);
      });
    });
    describe('Delete event by id', () => {
      it('Delete event by id', () => {
        return pactum
          .spec()
          .delete('/event/{id}')
          .withPathParams('id', firstEventId)
          .withBearerToken(token)
          .expectStatus(200);
      });
    });
  });
  describe('User', () => {
    describe('Get me', () => {
      it("it should print user's info", () => {
        return pactum
          .spec()
          .expectStatus(200)
          .get('/user/me')
          .withBearerToken(token);
      });
    });
    describe('Get All Users ', () => {
      // Path /user/
      it("it should print all users' info", () => {
        return pactum.spec().expectStatus(200).get('/user/');
      });
    });
    describe('Get user with id ', () => {
      // Path /user/:id
      it("it should print user's info who have the same id", () => {
        return pactum
          .spec()
          .expectStatus(200)
          .get('/user/{id}')
          .withPathParams('id', firstUserId);
      });
    });
    describe('Get user with email ', () => {
      // Path /user/:id
      it("it should print user's info who have the same email", () => {
        return pactum
          .spec()
          .expectStatus(200)
          .get('/user/email/{email}')
          .withPathParams('email', 'hisham@gmail.com');
      });
    });
    describe('Get user with username ', () => {
      // Path /user/:id
      it("it should print user's info who have the same username", () => {
        return pactum
          .spec()
          .expectStatus(200)
          .get('/user/username/{username}')
          .withPathParams('username', 'krcherheadx');
      });
    });
    describe('Patch edit user info', () => {
      const body: EditUserInfoDto = {
        firstName: 'Mohammed',
        lastName: 'AlOsaimi',
        username: 'bestDevelopers',
      };
      it("should update the user's info ", () => {
        return pactum
          .spec()
          .patch('/user/')
          .expectStatus(200)
          .withBody({
            ...body,
          })
          .withBearerToken(token);
      });
    });
    describe('Post edit password', () => {
      const body: userChangePasswordDto = {
        oldpassword: '123',
        newpassword: '321',
      };
      it("should update the user's password ", () => {
        return pactum
          .spec()
          .expectStatus(201)
          .post('/user/changePassword')
          .withBearerToken(token)
          .withBody({
            ...body,
          });
      });
    });

    //CHECK BEFORE!!!!!!!!!!!!!!!!
    describe('Delete user', () => {
      it('should delete the user ', () => {
        return pactum
          .spec()
          .delete('/user/')
          .expectStatus(200)
          .withBearerToken(token);
      });
    });
  });
  afterAll(() => {
    app.close();
  });
});
