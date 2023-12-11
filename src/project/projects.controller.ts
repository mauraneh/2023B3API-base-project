import { Controller, Get, Post, Body, UseGuards, Req, UsePipes, ValidationPipe, UnauthorizedException, ForbiddenException, NotFoundException, Param } from '@nestjs/common';
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

  // Find all projects
  @UseGuards(AuthGuard)
  @Get()
  async findAllProjects(@Req() req) {
    try {
      // si t'es admin ou project manager tu peux voir tous les projets
      if (req.user.role === 'Admin' || req.user.role === 'ProjectManager'){
        return await this.projectService.findAll(req);
      } else if (req.user.role === 'Employee') {
        // si t'es un employé, tu peux voir seulement les projets auxquels tu as accès
        const employeeProjects = await this.projectUserService.findProjectByEmployeeId(req.user.id);
        return employeeProjects;
      } else {
        throw new ForbiddenException('Access Forbidden');
      }
    } catch {
      throw new NotFoundException('Not found');
    }
  }

  // Find all projects by employee
  @UseGuards(AuthGuard)
  @Get(':id')
  async getProject(@Param('id') projectId: string, @Req() req) {
    const p = await this.projectService.findProjectsById(projectId);
    if (p == undefined) {
      throw new NotFoundException('Resource not found');
    }

    if (req.user.role === 'Admin' || req.user.role === 'ProjectManager') {
      return p;
    }
    if (req.user.role === 'Employee') {
      const result = await this.projectUserService.userLinkedProject(
        req.user.sub,
        projectId,
      );
      if (result === true) {
        return p;
      } else {
        throw new ForbiddenException('Access Forbidden');
      }
    }
  }

  // Find all projects by id
  @UseGuards(AuthGuard)
  @Get(':id')
  async getOneProject(@Param('id') projectId: string, @Req() req) {
    const oneProject = await this.projectService.findProjectsById(projectId);
    if (oneProject == undefined) {
      throw new NotFoundException('Resource not found');
    }

    if (req.user.role === 'Admin' || req.user.role === 'ProjectManager') {
      return oneProject;
    }
    if (req.user.role === 'Employee') {
      const result = await this.projectUserService.userLinkedProject(
        req.user.sub,
        projectId,
      );
      if (result === true) {
        return oneProject;
      } else {
        throw new ForbiddenException('Access Forbidden');
      }
    }
  }
}
