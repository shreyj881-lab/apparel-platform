import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../database/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findAll(page = 1, limit = 20, search?: string) {
    const qb = this.repo.createQueryBuilder('user').select([
      'user.id', 'user.name', 'user.email', 'user.role',
      'user.isActive', 'user.createdAt', 'user.lastLoginAt',
    ]);
    if (search) qb.where('user.name ILIKE :s OR user.email ILIKE :s', { s: `%${search}%` });
    qb.orderBy('user.createdAt', 'DESC').skip((page - 1) * limit).take(limit);
    const [users, total] = await qb.getManyAndCount();
    return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    const { password, ...rest } = user;
    return rest;
  }

  async updateRole(id: string, role: UserRole) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.role = role;
    await this.repo.save(user);
    return { message: 'Role updated successfully' };
  }

  async toggleStatus(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.isActive = !user.isActive;
    await this.repo.save(user);
    return { message: `User ${user.isActive ? 'activated' : 'deactivated'}` };
  }

  async delete(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    await this.repo.remove(user);
    return { message: 'User deleted' };
  }

  async getStats() {
    const total = await this.repo.count();
    const active = await this.repo.count({ where: { isActive: true } });
    const admins = await this.repo.count({ where: { role: UserRole.ADMIN } });
    return { total, active, inactive: total - active, admins };
  }
}
