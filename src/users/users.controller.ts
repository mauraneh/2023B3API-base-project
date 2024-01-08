import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-users.dto';
import { Users } from './entities/users.entity';
import { LogInTo } from './dto/login.dto'
import { AuthGuard } from '../auth/auth.guard';
import * as dayjs from 'dayjs';
import { EventsService } from '../events/events.service';


@Controller('users')
export class UsersController {

  constructor(
    private readonly usersService: UsersService,
    private readonly eventsService: EventsService,) {
  }

// Route to sign up a new user
  @Post('auth/sign-up')
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUsersDto) {
    return this.usersService.create(createUserDto);
  }

// Route to log in a user
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  @Post('auth/login')
  async login(@Body() loginDto: LogInTo) {
    return this.usersService.login(loginDto);
  }

  // Route to get personal information of the logged-in user
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('me')
  getLoggedInUser(@Req() req) {
    const userId = req.user.sub;
    console.log(userId);
    return this.usersService.getUser(userId);
  }

  // Route to get personal information of the logged-in user
  @UseGuards(AuthGuard)
  @Get(':id')
  getUserById(@Param('id') id: string) {
    const user = this.usersService.getUser(id);
    return user;
  }

  // Route to get a list of all users
  @UseGuards(AuthGuard)
  @Get()
  getAllUsers(): Promise<Users []> {
    const users = this.usersService.getAllUsers();
    return users;
  }
  
    // Route to get the amount of meal vouchers for a user for a specific month
    @UseGuards(AuthGuard)
    @Get(':id/meal-vouchers/:month')
    async getMealVouchers(@Param('id') userId: string, @Param('month') month: number) {
      const numAbsences = await this.eventsService.countAcceptedLeaves(userId, month);
      const firstDay = dayjs().month(month - 1).startOf('month');
      const lastDay = dayjs().month(month - 1).endOf('month');
  
      let workingDays = 0;
      for (let day = firstDay; day.isBefore(lastDay) || day.isSame(lastDay); day = day.add(1, 'day')) {
        if (day.day() >= 1 && day.day() <= 5) { // Monday to Friday
          workingDays++;
        }
      }
      return { mealVouchers: (workingDays - numAbsences) * 8 };
    }

}