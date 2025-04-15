import { Controller, Post, Headers, Body, HttpCode, Res } from '@nestjs/common';
import { exec } from 'child_process';
import { Response } from 'express';

@Controller('webhook')
export class WebhookController {
  @Post()
  @HttpCode(200)
  handleWebhook(
    @Headers('x-github-event') githubEvent: string,
    @Body() body: any,
    @Res() res: Response,
  ) {
    const branchRef = body.ref;
    if (githubEvent === 'push' && branchRef === 'refs/heads/main') {
      const commands = `
        cd /home/vipcard-api && \
        git pull origin main && \
        npm run build && \
        pm2 restart apicard
      `;

      exec(commands, (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Auto-deploy error:', error.message);
          return res
            .status(500)
            .json({ message: 'Deploy failed', error: error.message });
        }

        console.log('✅ Auto-deploy output:', stdout);
        return res
          .status(200)
          .json({ message: 'Deploy successful thành công', output: stdout });
      });
    } else {
      return res.status(200).json({ message: 'No action taken' });
    }
  }
}
