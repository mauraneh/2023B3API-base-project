import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus, HttpCode, NotFoundException, ConflictException, UnauthorizedException, Req, ValidationPipe, UsePipes } from '@nestjs/common';
import { ProjectUserService } from './project-user.service';
import { CreateProjectUserDto } from './dto/create-project-user.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('project-users')
export class ProjectUserController {
  constructor(
    private readonly projectUserService: ProjectUserService
    ) {}

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  async create(@Body() createProjectUserDto: CreateProjectUserDto, @Req() req) {
    // Vérifier les autorisations de l'utilisateur
    if (req.user.role == 'Employee') {
      throw new UnauthorizedException('Accès non autorisé');
    }

    // Vérifier si l'utilisateur est déjà affecté à un projet pour la période demandée
    const existingProjectUser =
      await this.projectUserService.findProjectByEmployeeId(createProjectUserDto.userId,);

    if (existingProjectUser !== null) {
      throw new ConflictException(
        "L'utilisateur est déjà assigné à un projet sur les mêmes dates.",
      );
    }

    // Créer le ProjectUser si l'utilisateur n'est pas déjà affecté à un projet sur les mêmes dates
    const projectUser =
      await this.projectUserService.create(createProjectUserDto);
    if (projectUser !== null) {
      return projectUser;
    } else {
      throw new NotFoundException();
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Req() req) {
    if (req.user.role == 'Admin' || req.user.role == 'ProjectManager') {
      const projectsUser = this.projectUserService.findAll();
      if (projectsUser == null) {
        throw new NotFoundException();
      }
      return projectsUser;
    } else {
      const projetUser = this.projectUserService.findOneProject(req.user.sub);
      if (projetUser == null) {
        throw new UnauthorizedException();
      }
      return projetUser;
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findprojectUser(@Param('id') projectUserId: string, @Req() req) {
    const projectUsers = await this.projectUserService.findOne(projectUserId);
    if (projectUsers == null) {
      throw new UnauthorizedException();
    }
    if (req.user.role == 'Admin' || req.user.role == 'ProjectManager') {
      return projectUsers;
    } else {
      if (projectUsers.userId === req.user.sub) {
        return projectUsers;
      }
    }
  }
}
