import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../database/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 12);
    const user = this.usersRepo.create({
      name: dto.name,
      email: dto.email.toLowerCase(),
      password: hashed,
      role: UserRole.USER,
    });
    await this.usersRepo.save(user);

    const { password, ...result } = user;
    return { user: result, token: this.generateToken(user) };
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepo.findOne({ where: { email: dto.email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if (!user.isActive) throw new UnauthorizedException('Account is deactivated');

    user.lastLoginAt = new Date();
    await this.usersRepo.save(user);

    const { password, ...result } = user;
    return { user: result, token: this.generateToken(user) };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) return user;
    return null;
  }

  async getProfile(userId: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    const { password, ...result } = user;
    return result;
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    if (!(await bcrypt.compare(oldPassword, user.password))) {
      throw new BadRequestException('Current password is incorrect');
    }
    user.password = await bcrypt.hash(newPassword, 12);
    await this.usersRepo.save(user);
    return { message: 'Password changed successfully' };
  }

  private generateToken(user: User) {
    return this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
  }
}
