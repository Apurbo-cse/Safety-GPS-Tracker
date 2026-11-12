import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put } from "@nestjs/common";
import { CurrentUser, Permissions, Roles } from "../common/decorators";
import { SlugPipe } from "../common/slug.pipe";
import { PASSWORD_MSG, PASSWORD_RULE } from "../auth/auth.dto";
import { IsString, Matches } from "class-validator";
import type { User } from "../users/user.entity";
import { AddStaffDto, RoleDto, UpdateStaffDto } from "./staff.dto";
import { StaffService } from "./staff.service";

class PasswordDto { @IsString() @Matches(PASSWORD_RULE, { message: PASSWORD_MSG }) password: string; }

/** Staff and roles — only people with the "staff.manage" permission. */
@Roles("admin") @Permissions("staff.manage") @Controller("admin")
export class StaffController {
  constructor(private staff: StaffService) {}

  @Get("staff") list() { return this.staff.list(); }
  @Post("staff") add(@Body() dto: AddStaffDto) { return this.staff.add(dto); }
  @Patch("staff/:id") update(@CurrentUser() me: User, @Param("id") id: string, @Body() dto: UpdateStaffDto) { return this.staff.update(me, id, dto); }
  @HttpCode(204) @Delete("staff/:id") remove(@CurrentUser() me: User, @Param("id") id: string) { return this.staff.remove(me, id); }
  @HttpCode(204) @Post("staff/:id/password") setPassword(@Param("id") id: string, @Body() dto: PasswordDto) { return this.staff.setPassword(id, dto.password); }

  @Get("roles") roles() { return this.staff.listRoles(); }
  @Put("roles/:id") putRole(@Param("id", SlugPipe) id: string, @Body() dto: RoleDto) { return this.staff.upsertRole(id, dto); }
  @HttpCode(204) @Delete("roles/:id") delRole(@Param("id", SlugPipe) id: string) { return this.staff.removeRole(id); }
}
