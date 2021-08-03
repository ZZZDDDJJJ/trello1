import {Controller,Ctx,Post,Get,Put,Delete,Flow,Params,Query,Body} from 'koa-ts-controllers'
import {Context} from 'koa'


import authorization from '../middlewares/authorization'
import {Board as BoardModel} from '../models/Board'
import {PostAddBoardBody,PutUpdateBoardBody,getAndValidateBoard} from '../vaildators/Board'

@Controller('/board')
@Flow([authorization])
export class BoardController{

    @Post('')
    public async addBoard(
        @Ctx() ctx:Context,
        @Body() body: PostAddBoardBody
    ){
        let { name } = body;
        let board = new BoardModel()

        board.name = name;
        board.userId = ctx.userInfo.id;
        await board.save()

        ctx.status = 201;
        return board
    }

    @Get('')
    public async getBoards(
        @Ctx() ctx:Context
    ){

        let where = {
            userId : ctx.userInfo.id
        };
        let boards = await BoardModel.findAll({where})

        return boards

    }

    @Get('/:id(\\d+)')
    public async getBoard(
        @Ctx() ctx:Context,
        @Params('id') id :number
    ){
        let board = await getAndValidateBoard(id,ctx.userInfo.id)

        return board
    }

    @Put('/:id(\\d+)')
    public async updateBoard(
        @Ctx() ctx:Context,
        @Params('id') id :number,
        @Body() body:PutUpdateBoardBody
    ){
        let { name } = body;
        let board = await getAndValidateBoard(id,ctx.userInfo.id)

        board.name = name || board.name;
      
        ctx.status = 204;

    }

    @Delete('/:id(\\d+)')
    public async deleteBoard(
        @Ctx() ctx:Context,
        @Params('id') id :number
    ){
        let board = await getAndValidateBoard(id,ctx.userInfo.id)
        await board.destroy()

        ctx.status = 204;
    }
}


// async function getBoard(id:number,userId:number){
//     let board = await BoardModel.findByPk(id)

//     if(!board){
//         throw Boom.notFound('指定看板不存在')
//     }

//     if(board.userId !== userId){
//         throw Boom.forbidden('禁止访问该面板')  
//     }
//     return board

// }