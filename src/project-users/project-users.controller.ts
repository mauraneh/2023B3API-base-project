import { Controller, Post, Get, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ProjectUsersService } from './project-users.service';
import { CreateProjectUsersDto } from './dto/create-project-users.dto';
import { AuthGuard } from '../auth/auth.guard';


@Controller('project-users')
export class ProjectUsersController {
  constructor(private projectUsersService: ProjectUsersService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createProjectUsersDto: CreateProjectUsersDto, @Req() req) {
    return this.projectUsersService.createProjectUsers(createProjectUsersDto, req.user.role);
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