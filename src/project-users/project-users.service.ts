import { 
  ConflictException, 
  Injectable, 
  NotFoundException, 
  UnauthorizedException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { ProjectUsers } from './entities/project-users.entity';
import { CreateProjectUserDto } from './dto/create-project-users.dto';
import Project from '../projects/entities/projects.entity';

@Injectable()
export class ProjectUsersService {
  constructor(
    @InjectRepository(ProjectUsers)
    private readonly projectUserRepo: Repository<ProjectUsers>,
  ) {}

  // Creates a new ProjectUser entry
  async createProjectUser(createDto: CreateProjectUserDto): Promise<ProjectUsers> {
    try {
      // Check for existing assignments that overlap with the provided date range
      const existingAssignments = await this.projectUserRepo.find({
        where: {
          userId: createDto.userId,
          startDate: LessThanOrEqual(createDto.endDate),
          endDate: MoreThanOrEqual(createDto.startDate),
        },
      });
  
      // If an overlapping assignment exists, throw a ConflictException
      if (existingAssignments.length > 0) {
        throw new ConflictException('User is already assigned to a project during this date range');
      }
  
      // Proceed with creating a new project-user entry
      const newProjUser = this.projectUserRepo.create(createDto);
      const savedProjUser = await this.projectUserRepo.save(newProjUser);
  
      if (!savedProjUser) {
        throw new NotFoundException("Project or User not found");
      }
  
      // Fetch the complete ProjectUser with relations
      const completeProjUser = await this.projectUserRepo.findOne({
        where: { id: savedProjUser.id },
        relations: ['user', 'project', 'project.referringEmployee'],
      });
  
      // Remove sensitive data
      delete completeProjUser.project.referringEmployee.password;
      delete completeProjUser.user.password;
  
      return completeProjUser;
    } catch (error) {
      throw error;
    }
  }
  

// Finds projects assigned to a specific employee
async findProjectsForEmployee(createDto: CreateProjectUserDto) {
  const findOptions: FindManyOptions<ProjectUsers> = {
    where: { userId: createDto.userId },
  };
  const projAssignments = await this.projectUserRepo.find(findOptions);

  // Check if the user is assigned to a project during the specified time period
  for (const assignment of projAssignments) {
    if (
      (assignment.startDate <= createDto.startDate &&
      assignment.endDate >= createDto.startDate) ||
      (createDto.startDate <= assignment.startDate &&
      createDto.endDate >= assignment.startDate)
    ) {
      return assignment; // This should be throwing an exception instead
    }
  }
  return new ConflictException('User is not assigned to a project during this time period'); // This seems misplaced
}


  // Finds a specific ProjectUser by ID
  async findProjectUserById(projUserId: string): Promise<ProjectUsers> {
    const findOptions: FindManyOptions<ProjectUsers> = { where: { id: projUserId } };
    const projUser = await this.projectUserRepo.findOne(findOptions);
    return projUser;
  }

  // Retrieves all ProjectUser entries
  async findAllProjectUsers(): Promise<ProjectUsers[]> {
    return await this.projectUserRepo.find({ relations: ['user', 'project'] });
  }

  // Checks if a user is linked to a project on a specific date
  async isUserLinkedToProjectOnDate(userId: string, projId: string, checkDate: Date): Promise<boolean> {
    const projUser = await this.projectUserRepo.findOne({
      where: {
        userId,
        startDate: LessThanOrEqual(checkDate),
        endDate: MoreThanOrEqual(checkDate)
      }
    });

    return !!projUser;
  }

  // Retrieves all projects assigned to a specific user
  async getProjectsForSpecificUser(userId: string): Promise<Project[]> {
    const userProjects = await this.projectUserRepo.find({
      where: { userId },
      relations: ['project']
    });

    return userProjects.map(projUser => projUser.project);
  }

  // Verifies if the manager is assigned to a project for a date
  async managerDate(userId: string, date: Date) {
    const options2: FindManyOptions<ProjectUsers> = {
      where: {
        startDate: LessThanOrEqual(date),
        endDate: MoreThanOrEqual(date),
        project: {
          referringEmployeeId: userId,
        },
      },
      relations: ['project'],
    };
    const isOk = await this.projectUserRepo.findOne(options2);
    return isOk;
  }
}
