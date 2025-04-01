import { inject, injectable } from "inversify";
import { Response, Router } from "express";
import { DependencyKeys, RouteKeys } from "../utils/Constants";
import { RouteBase } from "./RouteBase";
import { IAuthService } from "../contracts/IAuthService";
import { BadRequestException } from "../exceptions/BadRequestException";
import { StatusCodes } from "http-status-codes";
import { IRouteProvider } from "../contracts/IRouteProvider";
@injectable()
export class AuthRoutes extends RouteBase implements IRouteProvider {

    constructor(
        @inject(DependencyKeys.AuthService) public readonly authService: IAuthService
    ) {
        super();
    }

    public configureRoutes(router: Router): void { 
        this.configureAuthRoutes(router); 

    }

   
    private configureAuthRoutes(router: Router): void {

        router.post(`/${RouteKeys.Auth}/signup`, async (request, response) => {
            this.safelyExecuteAsync(response, async () => {
                let res = await this.authService.createAccountAsync(request.body, request["context"]);
                response.status(StatusCodes.OK).json(res);
            });
        });

        router.post(`/${RouteKeys.Auth}/login` ,async (request, response: Response) => {
            this.safelyExecuteAsync(response, async () => {
           
                const loginResponse = await this.authService.loginAsync(request.body.emailId, request.body.password, request["context"]);
                response.cookie('refreshToken', loginResponse.refreshToken, {
                    httpOnly: true,
                    maxAge: 3600000 // 60 minutes
                });
                response.status(StatusCodes.OK).json({
                    user: loginResponse.user,
                    accessToken: loginResponse.accessToken
                });
            });
        });

        router.get(`/${RouteKeys.Auth}/validate`, async (request, response) => {
            this.safelyExecuteAsync(response, async () => {
                const token = request.headers.authorization?.split(' ')[1];
                if (!token) {
                    throw new BadRequestException('No token provided');
                }
                const payload = await this.authService.validateTokenAsync(token);
                response.status(StatusCodes.OK).json(payload);
            });
        });

        router.post(`/${RouteKeys.Auth}/access-token`, async (request, response) => {
            this.safelyExecuteAsync(response, async () => {
                const { refreshToken } = request.body;
                if (!refreshToken) {
                    throw new BadRequestException('No refresh token provided');
                }
                const accessToken = await this.authService.refreshAccessTokenAsync(refreshToken);
                response.status(StatusCodes.OK).json({ accessToken });
            });
        });

        router.post(`/${RouteKeys.Auth}/set-password/public`, async (request, response) => {
            this.safelyExecuteAsync(response, async () => {
                const { token, newPassword } = request.body;
                await this.authService.setPasswordAsync(token, newPassword);
                response.status(StatusCodes.OK).json({ message: "Password set successfully." });
            });
        });
        
    }
}