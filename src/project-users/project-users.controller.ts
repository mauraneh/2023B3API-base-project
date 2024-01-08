import { Controller, Post, Get, Param, Body, UseGuards, Req, NotFoundException, UnauthorizedException, ConflictException, HttpStatus, HttpCode, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProjectUsersService } from './project-users.service';
import { CreateProjectUsersDto } from './dto/create-project-users.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UsersService } from '../users/users.service';
import { ProjectsService } from '../projects/projects.service';


@Controller('project-users')
export class ProjectUsersController {
  constructor(
    private projectUsersService: ProjectUsersService,
    private usersService: UsersService,
    private projectsService: ProjectsService,
    ) {}

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  async create(@Body() createProjectUsersDto: CreateProjectUsersDto, @Req() req) {
  // Only users with a role other than Employee can create project entries
  if (req.user.role === 'Employee') {
    throw new UnauthorizedException('Access denied for Employee role.');
  }

  // Check if the user exists
  const userExists = await this.usersService.getUser(createProjectUsersDto.userId);
  if (!userExists) {
    throw new NotFoundException('User not found.');
  }

  // Check if the project exists
  const projectExists = await this.projectsService.findProjectsById(createProjectUsersDto.projectId);
  if (!projectExists) {
    throw new NotFoundException('Project not found.');
  }

  // Check if the user is already assigned to a project during the specified period
  const existingAssignment = await this.projectUsersService.findProjectsForEmployee(createProjectUsersDto);
  if (existingAssignment) {
    throw new ConflictException("User is already assigned to a project on the same dates.");
  }

  // Create the ProjectUser entry
  const projectUser = await this.projectUsersService.createProjectUsers(createProjectUsersDto, req.user.role);
  if (!projectUser) {
    throw new NotFoundException('Unable to create ProjectUser entry.');
  }

  return projectUser;
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string) {
    return this.projectUsersService.findProjectUserById(id);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAllProjectUsers() {
    return this.projectUsersService.findAllProjectUsers();
  }

  @Get('/check/:userId/:projectId/:date')
  @UseGuards(AuthGuard)
  async checkIfUserLinkedToProjectOnDate(
    @Param('userId') userId: string,
    @Param('projectId') projectId: string,
    @Param('date') dateString: string
  ) {
    const date = new Date(dateString);
    return this.projectUsersService.isUserLinkedToProjectOnDate(userId, projectId, date);
  }
}