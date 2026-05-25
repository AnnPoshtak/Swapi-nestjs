import { Controller, Get, Post, UseGuards, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { PassportLocalGuard } from "./guards/passport-local.guard";
import { PassportJwtAuthGuard } from "./guards/passport-jwt.guard";

@Controller('auth-v2')
export class PassportAuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    @UseGuards(PassportLocalGuard)
    login(@Request() request: any){
        return this.authService.signIn(request.user); 
    }

    @Get("profile")
    @UseGuards(PassportJwtAuthGuard)
    getUserInfo(@Request() request: any) {
        return request.user;
    }
}