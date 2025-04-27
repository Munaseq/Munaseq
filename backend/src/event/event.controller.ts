// src/event/event.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  UseInterceptors,
  UploadedFiles,
  Query,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { EventService } from './event.service';
import { AuthGuard } from '../auth/auth.guard';
import { GetCurrentUserId } from '../auth/decorators/get-current-user-id.decorator';
import {
  CreateAssignment,
  CreateEventDto,
  JoinEventDto,
  LeaveEventDto,
  SeacrhUser,
  SearchEvent,
  UpdateAssignmentDTO,
  UpdateEventDto,
  CreateUpdateRating,
  AssignRoles,
  TakeAssigmentDTO,
  SendInvitationDTO,
  CreateQuizDto,
  UpdateQuizDto,
  SubmitQuizDto,
} from './dtos';

import { multerEventLogic, multerMaterialtLogic } from 'src/utils/multer.logic';
import { Gender } from '@prisma/client';

@ApiTags('event')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(multerEventLogic())
  @Post()
  @ApiOperation({ summary: 'Create a new event' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'Payload for creating an event. Include all fields from CreateEventDto and an optional image file.',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        categories: {
          type: 'array',
          items: { type: 'string' },
        },
        location: { type: 'string' },
        seatCapacity: { type: 'number' },
        isPublic: { type: 'boolean' },
        isOnline: { type: 'boolean' },
        gender: { type: 'string', enum: Object.values(Gender) },
        startDateTime: { type: 'string', format: 'date-time' },
        endDateTime: { type: 'string', format: 'date-time' },

        image: { type: 'string', format: 'binary' },
      },
    },
  })
  create(
    @Body(new ValidationPipe({ transform: true }))
    createEventDto: CreateEventDto,
    @GetCurrentUserId() eventCreatorId: string,
    @UploadedFiles()
    files: {
      image?: any;
    },
  ) {
    const imageUrl = files?.image ? files.image[0].location : null; // S3 location of the Image
    return this.eventService.createEvent(
      createEventDto,
      eventCreatorId,
      imageUrl,
    );
  }

  // exec
  // This should only return events that are public
  @Get()
  @ApiOperation({ summary: 'Get all public events' })
  @ApiQuery({ name: 'title', required: false, type: String })
  @ApiQuery({ name: 'pageNumber', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({
    name: 'highestRated',
    required: false,
    type: Boolean,
    description: 'Retreives the highestRated events.',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    description: 'Retreives the events that have the category.',
  })
  getAllEvents(@Query() query: SearchEvent) {
    return this.eventService.getAllEvents(
      query.title,
      query.pageNumber,
      query.pageSize,

      query.category,
      query.highestRated,
    );
  }

  // exec
  // Returns all events that have been created by the current user
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('current')
  @ApiOperation({ summary: 'Get events created by the current user' })
  @ApiQuery({ name: 'title', required: false, type: String })
  @ApiQuery({ name: 'pageNumber', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  findAllCurrentUserEvents(
    @GetCurrentUserId() eventCreatorId: string,
    @Query() query: SearchEvent,
  ) {
    return this.eventService.findAllCurrentUserEvents(
      eventCreatorId,
      query.title,
      query.pageNumber,
      query.pageSize,
    );
  }

  // exec
  // Returns all events that the current user has joined
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('joinedEvents')
  @ApiOperation({ summary: 'Get events joined by the current user' })
  @ApiQuery({ name: 'title', required: false, type: String })
  @ApiQuery({ name: 'pageNumber', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  findJoinedEvents(@GetCurrentUserId() userId, @Query() query: SearchEvent) {
    return this.eventService.findJoinedEvents(
      userId,
      query.title,
      query.pageNumber,
      query.pageSize,
    );
  }
  //must be DELETED
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('assignRole/:eventId')
  @ApiOperation({ summary: 'Assign a role to a user for an event' })
  @ApiParam({ name: 'eventId', description: 'ID of the event' })
  @ApiBody({
    description: 'Payload containing assignedUserId and role',
    type: AssignRoles,
  })
  assignRole(
    @Param('eventId') eventId: string,
    @GetCurrentUserId() userId: string,
    @Body() assignRoleDto: AssignRoles,
  ) {
    return this.eventService.assignRole(
      userId,
      eventId,
      assignRoleDto.assignedUserId,
      assignRoleDto.role,
    );
  }

  @Get('allUsers/:eventId')
  @ApiOperation({ summary: 'Get all users of an event' })
  @ApiParam({ name: 'eventId', description: 'ID of the event' })
  findAllUsersOfEvent(@Param('eventId') eventId: string) {
    return this.eventService.findAllUsersOfEvent(eventId);
  }

  // exec 2
  // Returns all users that attend a certain event
  @Get('attendees/:eventId')
  @ApiOperation({ summary: 'Get all attendees of an event' })
  @ApiParam({ name: 'eventId', description: 'ID of the event' })
  @ApiQuery({ name: 'username', required: false, type: String })
  @ApiQuery({ name: 'pageNumber', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  findUsersAttendEvent(
    @Param('eventId') eventId: string,
    @Query() query: SeacrhUser,
  ) {
    return this.eventService.findUsersParticipateInEvent(
      eventId,
      'joinedUsers',
      query.username,
      query.pageNumber,
      query.pageSize,
    );
  }

  // exec 2
  // Returns all users that moderate a certain event
  @Get('moderators/:eventId')
  @ApiOperation({ summary: 'Get all moderators of an event' })
  @ApiParam({ name: 'eventId', description: 'ID of the event' })
  @ApiQuery({ name: 'username', required: false, type: String })
  @ApiQuery({ name: 'pageNumber', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  findUsersModerateEvent(
    @Param('eventId') eventId: string,
    @Query() query: SeacrhUser,
  ) {
    return this.eventService.findUsersParticipateInEvent(
      eventId,
      'moderators',
      query.username,
      query.pageNumber,
      query.pageSize,
    );
  }

  // exec 2
  // Returns all users that present in a certain event
  @Get('presenters/:eventId')
  @ApiOperation({ summary: 'Get all presenters of an event' })
  @ApiParam({ name: 'eventId', description: 'ID of the event' })
  @ApiQuery({ name: 'username', required: false, type: String })
  @ApiQuery({ name: 'pageNumber', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  findUsersPresentEvent(
    @Param('eventId') eventId: string,
    @Query() query: SeacrhUser,
  ): Promise<
    {
      id: string;
      firstName: string;
      lastName: string;
      username: string;
      profilePictureUrl: string;
    }[]
  > {
    return this.eventService.findUsersParticipateInEvent(
      eventId,
      'presenters',
      query.username,
      query.pageNumber,
      query.pageSize,
    );
  }

  @Get('eventCreator/:eventId')
  @ApiOperation({ summary: 'Get the creator of an event' })
  @ApiParam({ name: 'eventId', description: 'ID of the event' })
  findEventCreator(@Param('eventId') eventId: string) {
    return this.eventService.findEventCreator(eventId);
  }

  // What if the event is not public?
  @Get(':eventId')
  @ApiOperation({ summary: 'Get event details by ID' })
  @ApiParam({ name: 'eventId', description: 'ID of the event' })
  getById(@Param('eventId') eventId: string) {
    return this.eventService.getById(eventId);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch(':eventId')
  @UseInterceptors(multerEventLogic())
  @ApiOperation({ summary: 'Update an event' })
  @ApiParam({ name: 'eventId', description: 'ID of the event' })
  @ApiConsumes('multipart/form-data')
  @ApiQuery({
    name: 'removeImage',
    required: false,
    type: Boolean,
    description: 'Flag to remove the profile picture.',
  })
  @ApiBody({
    description:
      'Payload for updating an event. Include all fields from UpdateEventDto and an optional image file.',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        categories: {
          type: 'array',
          items: { type: 'string' },
        },
        location: { type: 'string' },
        seatCapacity: { type: 'number' },
        isPublic: { type: 'boolean' },
        isOnline: { type: 'boolean' },
        gender: { type: 'string', enum: Object.values(Gender) },
        startDateTime: { type: 'string', format: 'date-time' },
        endDateTime: { type: 'string', format: 'date-time' },

        image: { type: 'string', format: 'binary' },
      },
    },
  })
  update(
    @GetCurrentUserId() userId: string,
    @Param('eventId') eventId: string,
    @Body() updateEventDto: UpdateEventDto,
    @Query('removeImage') removeImage: boolean,
    @UploadedFiles()
    files: {
      image?: any;
    },
  ) {
    const imageUrl = files?.image ? files.image[0].location : null; // S3 location of the Image
    return this.eventService.updateEvent(
      userId,
      eventId,
      updateEventDto,
      imageUrl,
      removeImage,
    );
  }

  //-----------------------------------------
  // Joining/Leaving Event's endpoints
  //-----------------------------------------
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('join')
  @ApiOperation({ summary: 'Join an event' })
  @ApiBody({
    description: 'Payload for joining an event',
    type: JoinEventDto,
  })
  async joinEvent(
    @GetCurrentUserId() userId,
    @Body() joinEventDto: JoinEventDto,
  ) {
    await this.eventService.joinEvent(userId, joinEventDto);
    return { message: 'Successfully joined the event' };
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Delete('leave')
  @ApiOperation({ summary: 'Leave an event' })
  @ApiBody({
    description: 'Payload for leaving an event',
    type: LeaveEventDto,
  })
  async leaveEvent(
    @GetCurrentUserId() userId,
    @Body() leaveEventDto: LeaveEventDto,
  ) {
    await this.eventService.leaveEvent(userId, leaveEventDto.eventId);
    return { message: 'Successfully left the event' };
  }

  //-----------------------------------------
  // Material's endpoints
  //-----------------------------------------

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(multerMaterialtLogic())
  @Post('addMaterial/:eventId')
  @ApiOperation({ summary: 'Add materials to an event' })
  @ApiParam({ name: 'eventId', description: 'ID of the event' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'Payload for adding material. Expects a file upload with field name "materials".',
    schema: {
      type: 'object',
      properties: {
        materials: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  addMaterialToEvent(
    @Param('eventId') eventId: string,
    @UploadedFiles() files: { materials: any },
    @GetCurrentUserId() userId: string,
  ) {
    if (!files.materials || files.materials.length === 0) {
      throw new BadRequestException('No materials uploaded');
    }

    // Extract URLs from the uploaded files
    const materialUrls = files.materials.map((material) => ({
      materialUrl: material.location, // S3 location of the file
    }));
    return this.eventService.addMaterialsToEvent(eventId, userId, materialUrls);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Delete('deleteMaterial/:materialId')
  @ApiOperation({ summary: 'Delete material from an event' })
  @ApiParam({ name: 'materialId', description: 'ID of the material' })
  deleteMaterial(
    @GetCurrentUserId() userid: string,
    @Param('materialId') materialId: string,
  ) {
    return this.eventService.deleteMaterial(userid, materialId);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('materials/:eventId')
  @ApiOperation({ summary: 'Get materials for an event' })
  @ApiParam({ name: 'eventId', description: 'ID of the event' })
  getMaterials(
    @Param('eventId') eventId: string,
    @GetCurrentUserId() userId: string,
  ) {
    return this.eventService.getMaterials(userId, eventId);
  }

  //-----------------------------------------
  // Quiz endpoints
  //-----------------------------------------

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('quiz/:eventId')
  @ApiOperation({ summary: 'Get quiz for an event' })
  @ApiParam({ name: 'eventId', description: 'ID of the event' })
  getQuiz(
    @Param('eventId') eventId: string,
    @GetCurrentUserId() userId: string,
  ) {
    return this.eventService.getQuiz(userId, eventId);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('quiz/:eventId')
  @ApiOperation({ summary: 'Add a quiz to an event' })
  @ApiParam({ name: 'eventId', description: 'ID of the event' })
  @ApiBody({
    description: 'Payload for creating a quiz',
    type: CreateQuizDto,
  })
  addQuiz(
    @Param('eventId') eventId: string,
    @GetCurrentUserId() userId: string,
    @Body() CreateQuizDto: CreateQuizDto,
  ) {
    return this.eventService.addQuizToEvent(userId, eventId, CreateQuizDto);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch('quiz/:eventId/:quizId')
  @ApiOperation({ summary: 'Update a quiz for an event' })
  @ApiParam({ name: 'eventId', description: 'ID of the event' })
  @ApiParam({ name: 'quizId', description: 'ID of the quiz' })
  @ApiBody({
    description: 'Payload for updating a quiz',
    type: UpdateQuizDto,
  })
  updateQuiz(
    @Param('eventId') eventId: string,
    @Param('quizId') quizId: string,
    @GetCurrentUserId() userId: string,
    @Body() UpdateQuizDto: UpdateQuizDto,
  ) {
    return this.eventService.updateQuiz(userId, eventId, quizId, UpdateQuizDto);
  }
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('quiz/start/:eventId/:quizId')
  @ApiOperation({ summary: 'Start a quiz' })
  @ApiParam({ name: 'eventId', description: 'ID of the event' })
  @ApiParam({ name: 'quizId', description: 'ID of the quiz' })
  startQuiz(
    @Param('eventId') eventId: string,
    @Param('quizId') quizId: string,
    @GetCurrentUserId() userId: string,
  ) {
    return this.eventService.startQuiz(userId, eventId, quizId);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('quiz/submit/:eventId/:quizId')
  @ApiOperation({ summary: 'Submit quiz answers' })
  @ApiParam({ name: 'eventId', description: 'ID of the event' })
  @ApiParam({ name: 'quizId', description: 'ID of the quiz' })
  @ApiBody({
    description: 'Payload containing quiz answers',
    type: SubmitQuizDto,
  })
  submitQuiz(
    @Param('eventId') eventId: string,
    @Param('quizId') quizId: string,
    @GetCurrentUserId() userId: string,
    @Body() submitQuizDto: SubmitQuizDto,
  ) {
    return this.eventService.submitQuiz(userId, quizId, submitQuizDto.answers);
  }
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('quiz/results/:eventId/:quizId')
  @ApiOperation({ summary: 'Get all quiz results for an event' })
  @ApiParam({ name: 'eventId', description: 'ID of the event' })
  @ApiParam({ name: 'quizId', description: 'ID of the quiz' })
  getAllQuizResults(
    @Param('eventId') eventId: string,
    @Param('quizId') quizId: string,
    @GetCurrentUserId() userId: string,
  ) {
    return this.eventService.getAllParticipantsQuizResults(
      userId,
      eventId,
      quizId,
    );
  }
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Delete('quiz/:eventId/:quizId')
  @ApiOperation({ summary: 'Delete a quiz from an event' })
  @ApiParam({ name: 'eventId', description: 'ID of the event' })
  @ApiParam({ name: 'quizId', description: 'ID of the quiz' })
  deleteQuiz(
    @Param('eventId') eventId: string,
    @Param('quizId') quizId: string,
    @GetCurrentUserId() userId: string,
  ) {
    return this.eventService.deleteQuiz(userId, eventId, quizId);
  }

  //-----------------------------------------

  //Assignment endpoints

  //-----------------------------------------
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('assignments/:eventId')
  @ApiOperation({ summary: 'Get assignments for an event' })
  @ApiParam({ name: 'eventId', description: 'ID of the event' })
  getAssignments(
    @Param('eventId') eventId: string,
    @GetCurrentUserId() userId: string,
  ) {
    return this.eventService.getAssignments(userId, eventId);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('assignment/show/:assignmentId')
  @ApiOperation({
    summary:
      'Show assignment details. Adds takeAssignmentStatus if the user is an attendee, or numberParticipatedUsers if the user is a moderator, event creator, or presenter.',
  })
  @ApiParam({ name: 'assignmentId', description: 'ID of the assignment' })
  showAssignments(
    @Param('assignmentId') assignmentId: string,
    @GetCurrentUserId() userId: string,
  ) {
    return this.eventService.showAssignment(userId, assignmentId);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('assignment/save/:assignmentId')
  @ApiOperation({
    summary:
      'Save assignment answers. The user must be an attendee to save answers.',
  })
  @ApiBody({
    description: 'Payload for saving an assignment',
    type: TakeAssigmentDTO,
  })
  @ApiParam({ name: 'assignmentId', description: 'ID of the assignment' })
  saveAssignemt(
    @Param('assignmentId') assignmentId: string,
    @GetCurrentUserId() userId: string,
    @Body() takeAssignmentDto: TakeAssigmentDTO,
  ) {
    return this.eventService.saveAssignment(
      userId,
      assignmentId,
      takeAssignmentDto.answers,
      'SAVED_ANSWERS',
    );
  }
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('assignment/submit/:assignmentId')
  @ApiOperation({
    summary:
      'Submit assignment answers. The user must be an attendee to save answers.',
  })
  @ApiBody({
    description: 'Payload for submitting an assignment',
    type: TakeAssigmentDTO,
  })
  @ApiParam({ name: 'assignmentId', description: 'ID of the assignment' })
  submitAssignemt(
    @Param('assignmentId') assignmentId: string,
    @GetCurrentUserId() userId: string,
    @Body() takeAssignmentDto: TakeAssigmentDTO,
  ) {
    return this.eventService.saveAssignment(
      userId,
      assignmentId,

      takeAssignmentDto.answers,
      'SUBMITTED',
    );
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('assignment/:eventId')
  @ApiOperation({
    summary:
      'create an assignment for an event. The user must be an event creator, moderator, or presenter to create an assignment.',
  })
  @ApiBody({
    description: 'Payload for creating an assignment',
    type: CreateAssignment,
  })
  @ApiParam({ name: 'eventId', description: 'ID of the event' })
  addAssignment(
    @Param('eventId') eventId: string,
    @GetCurrentUserId() userId: string,
    @Body() body: CreateAssignment,
  ) {
    return this.eventService.addAssignment(eventId, userId, body);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch('assignment/:assignmentId')
  @ApiOperation({
    summary:
      'Update an assignment. The user must be an event creator, moderator, or presenter to update an assignment.',
  })
  @ApiBody({
    description: 'Payload for updating an assignment',
    type: CreateAssignment,
  })
  @ApiParam({ name: 'assignmentId', description: 'ID of the assignment' })
  updateAssignment(
    @Param('assignmentId') assignmentId: string,
    @GetCurrentUserId() userId: string,
    @Body() body: UpdateAssignmentDTO,
  ) {
    return this.eventService.updateAssignment(assignmentId, userId, body);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Delete('assignment/:assignmentId')
  @ApiOperation({
    summary:
      'Delete an assignment. The user must be an event creator, moderator, or presenter to delete an assignment.',
  })
  @ApiParam({ name: 'assignmentId', description: 'ID of the assignment' })
  deleteAssignment(
    @GetCurrentUserId() userId: string,
    @Param('assignmentId') assignmentId: string,
  ) {
    return this.eventService.deleteAssignment(assignmentId, userId);
  }

  //-----------------------------------------
  // Rating Event's endpoints
  //-----------------------------------------

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('ratingEvent/:eventId')
  @ApiOperation({ summary: 'Rate an event' })
  @ApiParam({ name: 'eventId', description: 'ID of the event' })
  @ApiBody({
    description: 'Payload for rating an event',
    type: CreateUpdateRating,
  })
  rateEvent(
    @Param('eventId') eventId: string,
    @GetCurrentUserId() userId: string,
    @Body() ratingDto: CreateUpdateRating,
  ) {
    const { rating } = ratingDto;
    return this.eventService.rateEvent(userId, eventId, rating);
  }

  @Get('ratings/:eventId')
  @ApiOperation({ summary: 'Get event rating' })
  @ApiParam({ name: 'eventId', description: 'ID of the event' })
  eventRating(@Param('eventId') eventId: string) {
    return this.eventService.eventRating(eventId);
  }
  //-----------------------------------------
  //Invitation endpoints
  //-----------------------------------------
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('invitation/:eventId')
  @ApiOperation({ summary: 'Send Invitation' })
  @ApiParam({ name: 'eventId', description: 'ID of the event' })
  @ApiBody({
    description: 'Payload for sending an invitation',
    type: SendInvitationDTO,
  })
  sendInvitation(
    @Param('eventId') eventId: string,
    @GetCurrentUserId() userId: string,
    @Body() body: SendInvitationDTO,
  ) {
    return this.eventService.sendInvitation(
      userId,
      eventId,
      body.receiverId,
      body.invitationType,
      body.roleType,
    );
  }

  //-----------------------------------------
  // Deleting Event's endpoint
  //-----------------------------------------

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Delete(':eventId')
  @ApiOperation({ summary: 'Delete an event' })
  @ApiParam({ name: 'eventId', description: 'ID of the event' })
  delete(
    @Param('eventId') eventId: string,
    @GetCurrentUserId() userId: string,
  ) {
    return this.eventService.delete(userId, eventId);
  }
}
