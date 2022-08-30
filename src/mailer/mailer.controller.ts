import { Controller, Get, Injectable, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MailerService } from './mailer.service';

@ApiTags('Mailer')
@Controller('mailer')
export class MailerController {
  constructor(private mailerService: MailerService) {}
  @Get(':receiver')
  sendMail(@Param('receiver') receiver: string) {
    this.mailerService.sendMail({
      to: receiver,
      from: 'Edusys ISDR <edusys@isdr.com>',
      subject: 'Salutations 🙋‍♂️',
      text: 'Email sent successfully ✔',
      template: 'index',
      context: {
        siteLabel: 'Edusys ISDR',
        siteLink: '/',
      },
    });
  }
}
