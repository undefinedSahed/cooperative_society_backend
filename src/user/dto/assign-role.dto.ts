import { IsEnum } from "class-validator";
import { UserRole } from "../user.schema";

export class AssignRoleDto {
    @IsEnum(UserRole)
    role: UserRole;
}