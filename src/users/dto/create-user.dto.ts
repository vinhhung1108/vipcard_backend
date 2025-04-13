export class CreateUserDto {
  username: string;
  email: string;
  password: string;
  roles?: string[]; // Tùy chọn
  isActive?: boolean; // Tùy chọn
}
