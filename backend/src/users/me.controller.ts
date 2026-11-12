import { Body, Controller, Delete, Get, HttpCode, Patch, Post, Put } from "@nestjs/common";
import { CurrentUser } from "../common/decorators";
import type { User } from "./user.entity";
import { ChangePasswordDto, UpdateProfileDto, UpdateSettingsDto } from "./users.dto";
import { RolesService } from "../staff/roles.service";
import { toPublic, UsersService } from "./users.service";

@Controller("me")
export class MeController {
  constructor(private users: UsersService, private roles: RolesService) {}

  /** The account plus what its staff role allows (empty for customers). */
  private async view(u: User) { return { ...toPublic(u), permissions: await this.roles.permissionsFor(u) }; }

  @Get()
  me(@CurrentUser() user: User) { return this.view(user); }

  @Patch("profile")
  async profile(@CurrentUser() user: User, @Body() dto: UpdateProfileDto) { return this.view(await this.users.updateProfile(user, dto)); }

  @Put("settings")
  async settings(@CurrentUser() user: User, @Body() dto: UpdateSettingsDto) { return this.view(await this.users.updateSettings(user, dto)); }

  @HttpCode(204) @Post("password")
  async password(@CurrentUser() user: User, @Body() dto: ChangePasswordDto) { await this.users.changePassword(user.id, dto); }

  /** Deletes the account and (by cascade) its orders. */
  @HttpCode(204) @Delete()
  async remove(@CurrentUser() user: User) { await this.users.remove(user); }
}
