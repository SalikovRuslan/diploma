import {Controller, Get} from '@nestjs/common';

@Controller('greetings')
export class GreetingsController {

    @Get() greet() {
        return 'Hello NestJs';
    }
}
