import { Controller, Get, Post, UseGuards, Request, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { PassportLocalGuard } from "./guards/passport-local.guard";
import { PassportJwtAuthGuard } from "./guards/passport-jwt.guard";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { Public } from "./decorators/public.decorator";

@Controller('auth')
export class PassportAuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @Post('register')
    async register(@Body() input: CreateAuthDto) {
        return this.authService.register(input.email, input.password);
    }

    @Public()
    @Post('login')
    @UseGuards(PassportLocalGuard)
    login(@Request() request: any, @Body() createAuth: CreateAuthDto) {
        return this.authService.signIn(request.user);
    }

    @Get("profile")
    @UseGuards(PassportJwtAuthGuard)
    getUserInfo(@Request() request: any) {
        return request.user;
    }
}