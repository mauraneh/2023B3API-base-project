import { 
  ConflictException, 
  Injectable, 
  NotFoundException, 
  UnauthorizedException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { ProjectUsers } from './entities/project-users.entity';
import { CreateProjectUsersDto } from './dto/create-project-users.dto';
import { Projects } from '../projects/entities/projects.entity';


@Injectable()
export class ProjectUsersService {
  constructor(
    @InjectRepository(ProjectUsers)
    private readonly projectUsersRepo: Repository<ProjectUsers>,
    @InjectRepository(Projects)
    private readonly projectRepo: Repository<Projects>,
  ) {}

  // Creates a new ProjectUser entry
  async createProjectUsers(createDto: CreateProjectUsersDto, userRole: string): Promise<ProjectUsers> {
    try {
      if (userRole !== 'Admin' && userRole !== 'ProjectManager') {
        throw new UnauthorizedException('Access Denied');
      }
      // Check for existing assignments that overlap with the provided date range
      const existingAssignments = await this.projectUsersRepo.find({
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
      const newProjUser = this.projectUsersRepo.create(createDto);
      const savedProjUser = await this.projectUsersRepo.save(newProjUser);
      if (!savedProjUser) {
        throw new NotFoundException("Project or User not found");
      }

      // Fetch the complete ProjectUser with relations
      const completeProjUser = await this.projectUsersRepo.findOne({
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
async findProjectsForEmployee(createDto: CreateProjectUsersDto) {
  const findOptions: FindManyOptions<ProjectUsers> = {
    where: { userId: createDto.userId },
  };
  const projAssignments = await this.projectUsersRepo.find(findOptions);

  // Check if the user is assigned to a project during the specified time period
  for (const assignment of projAssignments) {
    if (
      (assignment.startDate <= createDto.startDate &&
      assignment.endDate >= createDto.startDate) ||
      (createDto.startDate <= assignment.startDate &&
      createDto.endDate >= assignment.startDate)
    ) {
      return assignment;
    }
  }
  return new ConflictException('User is not assigned to a project during this time period'); // This seems misplaced
}


  // Finds a specific ProjectUser by ID
  async findProjectUserById(projUserId: string): Promise<ProjectUsers> {
    const findOptions: FindManyOptions<ProjectUsers> = { where: { id: projUserId } };
    const projUser = await this.projectUsersRepo.findOne(findOptions);
    return projUser;
  }

  // Retrieves all ProjectUser entries
  async findAllProjectUsers(): Promise<ProjectUsers[]> {
    return await this.projectUsersRepo.find({ relations: ['user', 'project'] });
  }

  // Checks if a user is linked to a project on a specific date
  async isUserLinkedToProjectOnDate(userId: string, projId: string, checkDate: Date): Promise<boolean> {
    const projUser = await this.projectUsersRepo.findOne({
      where: {
        userId,
        startDate: LessThanOrEqual(checkDate),
        endDate: MoreThanOrEqual(checkDate)
      }
    });

    return !!projUser;
  }

  // Retrieves all projects assigned to a specific user
  async getProjectsForSpecificUser(userId: string, userRole: string): Promise<Projects[]> {
    if (userRole === 'Admin' || userRole === 'ProjectManager') {
      // Admins and Project Managers see all projects or specific ones based on additional logic
      return await this.projectRepo.find(); // Modify as needed for more specific logic
    } else if (userRole === 'Employee') {
      const userProjects = await this.projectUsersRepo.find({
        where: { userId },
        relations: ['project']
      });
      // Return empty array if no projects are found for the employee
      if (userProjects.length === 0) return [];
      return userProjects.map(projUser => projUser.project);
    } else {
      // Handle other roles or throw exception
      throw new UnauthorizedException('Insufficient role for accessing project-user data');
    }
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
    const isOk = await this.projectUsersRepo.findOne(options2);
    return isOk;
  }
}
