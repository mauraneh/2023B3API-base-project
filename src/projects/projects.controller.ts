import { Controller, Get, Post, Body, UseGuards, Req, UsePipes, ValidationPipe, UnauthorizedException, ForbiddenException, NotFoundException, Param } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-projects.dto';
import { ProjectUsersService } from '../project-users/project-users.service';
import { AuthGuard } from '../auth/auth.guard';
import { UsersService } from '../users/users.service';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectService: ProjectsService,
    private readonly projectUserService: ProjectUsersService,
    private readonly usersService: UsersService,

  ) {}

  @UseGuards(AuthGuard)
  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createProjectDto: CreateProjectDto, @Req() req) {
    if (req.user.role !== 'Admin') {
      throw new UnauthorizedException();
    }
    const user = await this.usersService.returnUser(
      createProjectDto.referringEmployeeId,
    );
    if (user.role == 'Admin' || user.role == 'ProjectManager') {
      const project = await this.projectService.create(createProjectDto);
      if (project) {
        const projectGet = await this.projectService.getProject(
          createProjectDto.name,
        );
        if (projectGet !== null) {
          return {
            id: projectGet.project.id,
            name: createProjectDto.name,
            referringEmployeeId: createProjectDto.referringEmployeeId,
            referringEmployee: {
              id: user.id,
              username: user.username,
              email: user.email,
              role: user.role,
            },
          };
        }
      } else {
        throw new UnauthorizedException();
      }
    } else {
      throw new UnauthorizedException();
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getOneProject(@Param('id') projectId: string, @Req() req) {
    const oneProject = await this.projectService.findProjectsById(projectId);
    if (oneProject == undefined) {
      throw new NotFoundException('Resource not found');
    }
    const date = new Date();
    if (req.user.role === 'Admin' || req.user.role === 'ProjectManager') {
      return oneProject;
    }
    if (req.user.role === 'Employee') {
      const result = await this.projectUserService.isUserLinkedToProjectOnDate(
        req.user.sub,
        projectId,
        date
      );
      if (result === true) {
        return oneProject;
      } else {
        throw new ForbiddenException('Access Forbidden');
      }
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async getProjects(@Req() req) {
    try {
      if (['Admin', 'ProjectManager'].includes(req.user.role)) {
        // Admins and Project Managers see all projects
        return await this.projectService.findAll(req);
      } else if (req.user.role === 'Employee') {
        // Employees see only projects they are involved in
        const employeeProjects = await this.projectUserService.getProjectsForSpecificUser(req.user.sub, req.user.role);
        if (employeeProjects.length === 0) {
          // If no projects found for the employee, return an empty array with 200 status
          return [];
        }
        return employeeProjects;
      } else {
        throw new ForbiddenException('Access Forbidden');
      }
    } catch (error) {
      throw new NotFoundException('Resource not found');
    }
  }  

}
