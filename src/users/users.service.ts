import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LogInTo } from './dto/login.dto'
import { JwtService } from '@nestjs/jwt';
import { isUUID } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // SignIn
  async create(createUserDto: CreateUserDto) {
    const saltOrRounds = 10;
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, saltOrRounds),
    })
    const insertedUser = await this.usersRepository.save(newUser)
    delete insertedUser.password
    return insertedUser
  }

  // LOGIN
  async login(logInTo: LogInTo) {
    
    const option: FindOneOptions<User> = {where: {email: logInTo.email}};
    const user = await this.usersRepository.findOne(option);
    if (!user){
      throw new UnauthorizedException('Email ou mot de passe invalide')
    }

    const isPasswordMatched = await bcrypt.compare(logInTo.password, user.password);

    if (!isPasswordMatched){
      throw new UnauthorizedException('Email ou mot de passe invalide')
    } 

    const payload = { sub: user.id, mail: user.email, role: user.role};
  return { 
      access_token: await this.jwtService.signAsync(payload),
  };
  }

  // Retourne un utilisateur
  async getUser(id: string) {
  if (!isUUID(id)){
    throw new BadRequestException('L\'id n\'est pas un UUID');
  }

  const option: FindOneOptions<User> = {where: {id: id}};
  const user = await this.usersRepository.findOne(option);

    if (!user) {
      throw new NotFoundException(`L'utilisateur d'id ${id} n'existe pas`);
    }
    delete user.password;
    return user;
  }
    
  // Retourne tous les utilisateurs
  async getAllUsers() {
    const users = await this.usersRepository.find();
    for (const user of users) {
      delete user.password;
    }
    return users;
  }

}