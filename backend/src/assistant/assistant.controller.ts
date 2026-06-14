import { Body, Controller, Post } from '@nestjs/common';
import { GeminiService } from '../ai/gemini.service';
import { ChatDto } from './dto/chat.dto';

@Controller('assistant')
export class AssistantController {
  constructor(private readonly gemini: GeminiService) {}

  /** Public — powers the marketing-site chat widget + contact AI tab. */
  @Post('chat')
  chat(@Body() dto: ChatDto) {
    return this.gemini.chat(dto.messages);
  }
}
