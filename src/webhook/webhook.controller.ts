// src/webhook/webhook.controller.ts
import { Controller, Post, Headers, Body } from '@nestjs/common';
import { exec } from 'child_process';

@Controller('github-webhook')
export class WebhookController {
  @Post()
  handleWebhook(@Headers() headers, @Body() body) {
    // Kiểm tra nếu là push vào nhánh main
    if (body?.ref === 'refs/heads/main') {
      console.log('Received push on main branch. Pulling code...');

      exec(
        'cd /home/vipcard-api && git pull origin main && npm run build && pm2 restart apicard',
        (err, stdout, stderr) => {
          if (err) {
            console.error(`Error: ${err.message}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
          console.error(`stderr: ${stderr}`);
        },
      );
    }

    return { message: 'Webhook received' };
  }
}
