// src/webhook/webhook.controller.ts
import { Controller, Post, Headers, Body, HttpCode } from '@nestjs/common';
import { exec } from 'child_process';

@Controller('webhook')
export class WebhookController {
  @Post()
  @HttpCode(200)
  handlePush(
    @Headers('x-github-event') githubEvent: string,
    @Body() body: any,
  ) {
    if (githubEvent === 'push') {
      console.log('Webhook received push event from GitHub');

      exec(
        'cd /home/vipcard-api && git pull origin main && pm2 restart apicard',
        (err, stdout, stderr) => {
          if (err) {
            console.error('Deployment error:', err);
            return;
          }
          console.log('Deployment output:', stdout);
          console.error('Deployment errors:', stderr);
      });
    }
  }
}
