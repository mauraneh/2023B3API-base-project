import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { LogInTo } from './dto/login.dto'
import { AuthGuard } from '../auth/auth.guard';
import { use } from 'passport';


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

  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  @Post('auth/login')
  async login(@Body() loginDto: LogInTo) {
    return this.usersService.login(loginDto);
  }

  // **Route pour afficher mes informations personnelles**
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('me')
  returnUser(@Req() req) {
    const id = req.user.sub;
    console.log(id);
    return this.usersService.getUser(id);
  }

  // **Route pour afficher les informations d'un utilisateur**
  @UseGuards(AuthGuard)
  @Get(':id')
  getUserById(@Param('id') id: string) {
    const user = this.usersService.getUser(id);
    return user;
  }

    // **Route pour afficher la liste des utilisateurs**
  @UseGuards(AuthGuard)
  @Get()
  getAllUsers(): Promise<User []> {
    const users = this.usersService.getAllUsers();
    return users;
  }
  
  /**
   * Retourne le montant des titres-restaurant pour un utilisateur et un mois donné.
   */

}