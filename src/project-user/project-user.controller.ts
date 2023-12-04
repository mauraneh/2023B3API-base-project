import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { ProjectUserService } from './project-user.service';
import { CreateProjectUserDto } from './dto/create-project-user.dto';
import { UpdateProjectUserDto } from './dto/update-project-user.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('project-users')
export class ProjectUserController {
  constructor(private readonly projectUserService: ProjectUserService) {}

  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProjectUserDto: CreateProjectUserDto) {
    return await this.projectUserService.create(createProjectUserDto);
  }

}
