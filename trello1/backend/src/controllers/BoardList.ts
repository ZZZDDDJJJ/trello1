
import {Controller,Ctx,Post,Get,Put,Delete,Flow,Params,Query,Body} from 'koa-ts-controllers'
import {Context} from 'koa'


import authorization from '../middlewares/authorization'
import {PostAddListBody,GetListsQuery,PutUpdateListBody,getAndValidateBoardList} from '../vaildators/BoardList'
import {getAndValidateBoard} from '../vaildators/Board'
import {BoardList as BoardListModel} from "../models/BoardList";
@Controller('/list')
@Flow([authorization])      

export class BoardListController{
    @Post('')
    public async addList(
        @Ctx() ctx:Context,
        @Body() body:PostAddListBody
    ){
        let {boardId,name} = body
        
        await getAndValidateBoard(boardId,ctx.userInfo.id)

        let maxOrderBoardList = await BoardListModel.findOne({
            where:{
                boardId
            },
            order:[['order','desc']]
        })

        let boardList = new BoardListModel()
        boardList.name =name
        boardList.userId = ctx.userInfo.id
        boardList.boardId = boardId
        boardList.order = maxOrderBoardList?maxOrderBoardList.order+65535:65535
        await boardList.save()

        ctx.status = 201
        return boardList

    }

    @Get('')
    public async getLists(
        @Ctx() ctx:Context,
        @Query() query:GetListsQuery
    ){
        let { boardId }  = query
        console.log(boardId)
        await getAndValidateBoard(boardId,ctx.userInfo.id)

        let boardList = await BoardListModel.findAll({
            where:{
                boardId
            },
            order:[['order','asc']]
        })

        return boardList



    }


    @Get('/:id(\\d+)')
    public async getList(
        @Ctx() ctx:Context,
        @Params('id') id:number
    ){

        let boardList =await getAndValidateBoardList(id,ctx.userInfo.id)

        return boardList
    }

    @Put('/:id(\\d+)')
    public async updateList(
        @Ctx() ctx:Context,
        @Params('id') id:number,
        @Body() body:PutUpdateListBody
    ){

        let {name,order,boardId } = body

        let boardList =await getAndValidateBoardList(id,ctx.userInfo.id)
        
        boardList.boardId = boardId || boardList.boardId
        boardList.name = name || boardList.name
        boardList.order = order || boardList.order

        await boardList.save()

        ctx.status = 204
        return;
    }

    @Delete('/:id(\\d+)')
    public async deleteList(
        @Ctx() ctx:Context,
        @Params('id') id:number
    ){
        let boardList =await getAndValidateBoardList(id,ctx.userInfo.id)
        
        boardList.destroy()
        ctx.status = 204;
        return;
    }

}