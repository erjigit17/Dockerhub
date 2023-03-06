import { IsString, IsNumber } from 'class-validator';

export class DepositReqBodyDTO {
  @IsString()
  id: string;

  @IsString()
  userId: string;

  @IsNumber()
  amount: number;

  @IsString()
  successUrl: string;

  @IsString()
  rejectUrl: string;

  @IsString()
  callbackUrl: string;
}

export class WithdrawReqBodyDTO {
  @IsString()
  id: string;

  @IsString()
  userId: string;

  @IsString()
  card: string

  @IsNumber()
  amount: number;

  @IsString()
  callbackUrl: string;
}
