import { Controller, Post, Headers, HttpException, HttpStatus, Catch, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { fetch } from 'undici'
import { DepositReqBodyDTO, WithdrawReqBodyDTO } from './dto/req.dto';
import { createHash } from 'crypto';

const TEST_SERVER_API_KEY = 'Test!@#';
const TEST_SERVER_PASSWORD = '123Test!@#';
const SALT = 'test_salt';

@Catch(HttpException)
@Controller('api/payments')
export class AppController {
  @Post('/create')
  async createPayment(
    @Headers('x-api-key') apiKey: string,
    @Body() body: DepositReqBodyDTO,
    @Res() res: Response,
  ): Promise<void> {
    if (apiKey !== TEST_SERVER_API_KEY) {
      throw new HttpException('Invalid API key', HttpStatus.FORBIDDEN);
    }

    if (body.amount === 404) {
      return;
    }

    if (body.amount === 500) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    await res.send({ url: 'https://test_url.co' });

    await this.handlePaymentStatus(body);
  }

  @Post('/withdraw')
  async createWithdraw(
    @Headers('x-api-key') apiKey: string,
    @Body() body: WithdrawReqBodyDTO,
    @Res() res: Response,
  ): Promise<void> {
    if (apiKey !== TEST_SERVER_API_KEY) {
      throw new HttpException('Invalid API key', HttpStatus.FORBIDDEN);
    }

    if (body.amount === 404) {
      return;
    }

    if (body.amount === 500) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    await res.send({ success: true });

    await this.handlePaymentStatus(body);
  }

  async handlePaymentStatus(body: DepositReqBodyDTO | WithdrawReqBodyDTO): Promise<void> {
    if (body.amount === 13_404) {
      return;
    }

    let status;
    switch (body.amount) {
      case 13:
        status = 'REJECTED';
        break;
      case 13_400:
        status = 'CANCELLED';
        break;
      default:
        status = 'SUCCESS';
    }

    const callbackPayload = {
      internal_id: String(Date.now()),
      external_id: body.id,
      external_user_id: body.userId,
      status,
      auth: {
        email: 'test@mail.co',
        salt: SALT,
        hash: createHash('md5')
          .update(`${TEST_SERVER_PASSWORD}${SALT}`)
          .digest('hex'),
      },
    };

    setTimeout(async () => {
      try {
        const response = await fetch(body.callbackUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(callbackPayload),
        });
        console.log(`Callback to ${body.callbackUrl} completed with status ${response.status}`);
      } catch (error) {
        console.error(`Callback to ${body.callbackUrl} failed with error ${error.message}`);
      }
    }, 100);
  }
}
