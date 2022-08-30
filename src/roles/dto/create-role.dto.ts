import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, default: 'Super Admin' })
  designation: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, default: 'Super Admin role description' })
  description: string;
}
