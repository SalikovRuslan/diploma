import {Controller, Post} from '@nestjs/common';

@Controller('auth')
export class AuthController {
    constructor() {}

    @Post('/registration')
    registration() {
        return null;
    }
}
