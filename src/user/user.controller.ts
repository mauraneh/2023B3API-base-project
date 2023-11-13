import { Body, Controller, Get, NotFoundException, Param, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { User } from './entities/user.entity';


@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) {}

  // **Route pour s'inscrire**

  @Post('auth/sign-up')
  async signUp(@Body() userDto: CreateUserDto) {
    const user = await this.userService.create(userDto);
    return user;
  }

  // **Route pour se connecter**

  @Post('auth/login')
  async login(@Body() loginDto: { email: string; password: string }) {
    const token = await this.userService.login(loginDto);
    return {
      access_token: token,
    };
  }

  // **Route pour afficher les informations d'un utilisateur**

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.userService.findOne(id);
      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  // **Route pour afficher la liste des utilisateurs**

  @Get()
  async getUsers() {
    const users = await this.userService.findAll();
    return users;
  }

  // **Route pour afficher mes informations personnelles**

  @Get('me')
  async getMe(id) {
    const user = this.userService.findOne(id);
    return user;
  }

  /**
   * Retourne le montant des titres-restaurant pour un utilisateur et un mois donné.
   */

}