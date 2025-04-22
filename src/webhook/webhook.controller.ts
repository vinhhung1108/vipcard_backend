import { Controller, Headers, Post, Body, HttpCode } from '@nestjs/common';
import { exec } from 'child_process';

@Controller('webhook')
export class WebhookController {
  @Post()
  @HttpCode(200)
  handlePush(@Headers('x-github-event') event: string, @Body() payload: any) {
    // Trả response NGAY LẬP TỨC để GitHub không timeout
    if (event === 'push' && payload?.ref === 'refs/heads/main') {
      // Xử lý bất đồng bộ
      setTimeout(() => {
        exec(
          'cd /home/vipcard-api && git pull origin main && npm install && npm run build && pm2 restart apicard',
          (error, stdout, stderr) => {
            if (error) {
              console.error(`❌ Webhook Exec Error: ${error.message}`);
              return;
            }
            console.log(`✅ Webhook Exec Output:\n${stdout}`);
            if (stderr) console.error(`⚠️ Webhook Exec Stderr:\n${stderr}`);
          },
        );
      }, 100); // Hoãn 1 chút để trả response xong

      return {
        message: 'Webhook received. Deployment will run in background.',
      };
    }

    return { message: 'Event ignored' };
  }
}
