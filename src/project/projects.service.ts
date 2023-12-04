import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Project from './entities/project.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly jwtService: JwtService,
  ) {}

 // Create a new project
  async create(createProjectDto: CreateProjectDto) {
    const newProject = this.projectRepository.create(createProjectDto);
    const insertedProject = await this.projectRepository.save(newProject);
    return {insertedProject};
  }

async findProject(name: string) {
  const option: FindOneOptions = { where: { name } };
  const project: UpdateProjectDto = await this.projectRepository.findOne(option);
  return project;
  }

  async findAll() {
    const option: FindOneOptions<Project> = { relations: ['referringEmployee'] };
    const allProjects = await this.projectRepository.find(option);
    const response = allProjects.map(({ id, name, referringEmployeeId, referringEmployee }) => ({
      id,
      name,
      referringEmployeeId,
      referringEmployee: {
        id: referringEmployee.id,
        username: referringEmployee.username,
        email: referringEmployee.email,
        role: referringEmployee.role,
      },
    }));
    return response;
  }
}
