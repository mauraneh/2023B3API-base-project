import { Injectable } from '@nestjs/common';
import { CreateProjectUserDto } from './dto/create-project-user.dto';
import { UpdateProjectUserDto } from './dto/update-project-user.dto';
import { FindOneOptions, Repository } from 'typeorm';
import { ProjectUser } from './entities/project-user.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProjectUserService {
  constructor(
    @InjectRepository(ProjectUser)
    private readonly projectUserRepository: Repository<ProjectUser>,
    private readonly jwtService: JwtService,
  ) { 
  }

  async create(createProjectUserDto: CreateProjectUserDto) {
    const newProjectUser = this.projectUserRepository.create(createProjectUserDto);
    const insertedProjectUser = await this.projectUserRepository.save(newProjectUser);
    return {insertedProjectUser};
  }

async findProjectByEmployeeId(id: string) {
    const option: FindOneOptions<CreateProjectUserDto> = { 
      where: 
        { userId: id },
      relations: ['project', 'user', 'project.referringEmployee']
    };
    const allProjects = await this.projectUserRepository.find(option);
    const response = allProjects.map(({ project, user }) => ({
      id: project.id,
      name: project.name,
      referringEmployeeId: project.referringEmployeeId,
      referringEmployee: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    }));
    return response;
  }


  findOne(id: number) {
    return `This action returns a #${id} projectUser`;
  }

  update(id: number, updateProjectUserDto: UpdateProjectUserDto) {
    return `This action updates a #${id} projectUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} projectUser`;
  }
}
