import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstants } from "./constant";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtConstants.secret,
        })
    }

    async validate(payload){
        return{
            userId: payload.sub,
            username: payload.username,
            role: payload.role,
        }
    }
};