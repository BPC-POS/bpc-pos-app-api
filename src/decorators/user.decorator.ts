import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ReqUser = createParamDecorator((_, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	return request['state'].user;
});

export const ReqSystemConfigInformation = createParamDecorator(
	(_, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();
		return request['state'].systemConfig;
	},
);
