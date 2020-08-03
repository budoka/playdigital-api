import { IsString } from 'class-validator';

export class UserLogin {
  @IsString()
  username: string;
  @IsString()
  password: string;
}

export class CryptocurrencyUser {
  @IsString()
  cryptocurrency: string;
  @IsString()
  username: string;
}
