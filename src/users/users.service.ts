import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LogInTo } from './dto/login.dto'
import { JwtService } from '@nestjs/jwt';

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
  async login(logInTo: LogInTo): Promise<{ token: string }> {
    const {email, password} = logInTo;

    const user = await this.usersRepository.findOne({ 
      where: {email},
    })

    if (!user){
      throw new UnauthorizedException('Email ou mot de passe invalide')
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched){
      throw new UnauthorizedException('Email ou mot de passe invalide')
    }
    const token = this.jwtService.sign( { id: user.id })

    return { token };
  }

  // Retourne tous les utilisateurs
  async getAllUsers() {
    const users = this.usersRepository.find();
    return users;
  }

  // Retourne un user par son id
  async getUserById(id: string) {
  const user = await this.usersRepository.findOne({
    where: { 
      id: id,
    }
  });
  if (user){
    return user;
  }
  throw new UnauthorizedException('User introuvable');
  }

  // Supprimer un user
  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}