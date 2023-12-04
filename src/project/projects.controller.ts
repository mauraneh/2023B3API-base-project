import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, NotFoundException, UsePipes, ValidationPipe, UnauthorizedException } from '@nestjs/common';
import { ProjectService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectUserService } from '../project-user/project-user.service';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('projects')
export class ProjectController {

  constructor(
    private readonly projectService: ProjectService,
    private readonly userService: UsersService,
    private readonly projectUserService: ProjectUserService,
    ) {}

@UseGuards(AuthGuard)
@Post()
@UsePipes( new ValidationPipe())
async create(@Body() createProjectDto: CreateProjectDto, @Req() req) {
    //si t'es pas admin c'est mort
    if (req.user.role !== 'Admin'){
      throw new UnauthorizedException('Vous n\'avez pas les droits pour créer un projet')
    }
    const user = await this.userService.getUser(createProjectDto.referringEmployeeId);
    // si t'es admin ou project manager tu peux créer un projet
    if (user.role === 'Admin' || user.role === 'ProjectManager') {
    await this.projectService.create(createProjectDto);
    const projectFound = await this.projectService.findProject(createProjectDto.name);
    return {
      id: projectFound.id,
      name: projectFound.name,
      referringEmployeeId: projectFound.referringEmployeeId,
      referringEmployee: user,
      };
    }
    else {
      throw new UnauthorizedException('Vous n\'avez pas les droits pour créer un projet')
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Req() req) {
    // si t'es admin ou project manager tu peux voir tous les projets
    if (req.user.role === 'Admin' || req.user.role === 'ProjectManager'){
      return await this.projectService.findAll();
    } else {
      // si t'es pas admin ou project manager tu peux pas voir les projets
      const projects = this.projectUserService.findProjectByEmployeeId(req.user.id);
      return projects;
    }
  }

}
