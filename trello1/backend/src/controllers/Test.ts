import { Context } from 'koa';
import { Body, Controller, Ctx, Flow, Get, Params, Post, Query } from 'koa-ts-controllers'

import { IsNumberString } from 'class-validator'

import Boom from '@hapi/Boom'
import authorization from '../middlewares/authorization';

class GetUsersQuery {
    @IsNumberString()
    page: number;

}



@Controller('/test')

class TestController {
    @Get('/hello')
    async hello() {
        return 'hello,world' 
    }

    @Get("/user/:id(\\d+)")
    async getUser(
        @Params() p: { id: number }
    ) {
        return '当前params的用户id:' + p.id;
    }

    // @Get('/user')
    // async getUser2(
    //     @Query() q:{id:number}
    // ){
    //     return '当前params的用户id:'+ q.id; 
    // }

    @Get('/users')
    async getUsers(
        @Query() q: GetUsersQuery
    ) {
        if(true){
            throw Boom.notFound("注册失败","用户已经被注册")
        }
    }

    @Post('/user')
    async postUser2(
        @Body() body: { name: string; password: string; }
    ) {
        return `当前提交的数据:${body}`
    }


    @Get('/auth')
    @Flow([authorization])
    async auth(
        @Ctx() ctx:Context
    ){
       return '不登录看不到'
    }

  

    @Get('/noauth')
    async noAuth(){
       return '随便看'
    }




}