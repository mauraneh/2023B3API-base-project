import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectUserService } from './project-user.service';
import { CreateProjectUserDto } from './dto/create-project-user.dto';
import { UpdateProjectUserDto } from './dto/update-project-user.dto';

@Controller('project-user')
export class ProjectUserController {
  constructor(private readonly projectUserService: ProjectUserService) {}

  @Post()
  create(@Body() createProjectUserDto: CreateProjectUserDto) {
    return this.projectUserService.create(createProjectUserDto);
  }

  @Get()
  findAll() {
    return this.projectUserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectUserService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectUserDto: UpdateProjectUserDto) {
    return this.projectUserService.update(+id, updateProjectUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectUserService.remove(+id);
  }
}
