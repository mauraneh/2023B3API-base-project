import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  findOneById(arg0: any) {
    throw new Error('Method not implemented.');
  }
  
  async getOne(id: string) {
    const options = { where: { id } };
    const user = await this.usersRepository.findOne(options);
    return user;
  }
  
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  

  login(user: { email: string; password: string; }): { access_token: any; } | PromiseLike<{ access_token: any; }> {
    throw new Error('Method not implemented.');
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
