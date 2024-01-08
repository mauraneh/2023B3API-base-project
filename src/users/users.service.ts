import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUsersDto } from './dto/create-users.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { FindOneOptions, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LogInTo } from './dto/login.dto'
import { JwtService } from '@nestjs/jwt';
import { isUUID } from './dto/create-users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private jwtService: JwtService,
  ) {}

  // SignIn
  async create(createUsersDto: CreateUsersDto) {
    const saltOrRounds = 10;
    const newUser = this.usersRepository.create({
      ...createUsersDto,
      password: await bcrypt.hash(createUsersDto.password, saltOrRounds),
    })
    const insertedUser = await this.usersRepository.save(newUser)
    delete insertedUser.password
    return insertedUser
  }

  // LOGIN
  async login(logInTo: LogInTo) {
    
    const option: FindOneOptions<Users> = {where: {email: logInTo.email}};
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

  const option: FindOneOptions<Users> = {where: {id: id}};
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

  async returnUser(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID format for user ID');
    }

    // Find the user by ID
    const user = await this.usersRepository.findOne({
      where: { id: id },
    });

    // Throw an exception if the user is not found
    if (user === null) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    delete user.password; // Do not return the password in the response
    return user;
  }

}