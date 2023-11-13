import { Body, Controller, Get, Param, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { LogInTo } from './dto/login.dto'
import { AuthGuard } from '../auth/auth.guard';


@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  // **Route pour s'inscrire**

  @Post('auth/sign-up')
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // **Route pour se connecter**

  @Post('auth/login')
  async login(@Body() loginDto: LogInTo): Promise<{token: string}> {
    return this.usersService.login(loginDto);
  }

  // **Route pour afficher les informations d'un utilisateur**

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.getUserById(String (id))
    return user;
  }

  // **Route pour afficher la liste des utilisateurs**

  @Get()
  getAllUsers(): Promise<User []> {
    const users = this.usersService.getAllUsers();
    return users;
  }

  // **Route pour afficher mes informations personnelles**

  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@Request() req) {
    // L'utilisateur authentifié est accessible via req.user après l'utilisation du AuthGuard
    return req.user;
  }

  /**
   * Retourne le montant des titres-restaurant pour un utilisateur et un mois donné.
   */

}