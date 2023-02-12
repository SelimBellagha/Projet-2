import { BaseGame, Game } from '@app/data/game.interface';
import { GameManager } from '@app/services/game-manager.service';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class GameController {
    router: Router;
    route = '/games';

    constructor(private readonly gameService: GameManager) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        // GET games
        this.router.get('/', async (req: Request, res: Response) => {
            try {
                const games: Game[] = await this.gameService.getAllGames();
                res.status(StatusCodes.OK).send(games);
            } catch (error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
            }
        });

        // GET games/:id
        this.router.get('/:id', async (req: Request, res: Response) => {
            // const id: number = parseInt(req.params.id, 10);
            try {
                const game: Game = await this.gameService.getGamebyId(req.params.id);
                if (game) {
                    res.status(StatusCodes.OK).send(game);
                } else {
                    res.status(StatusCodes.NOT_FOUND).json('The requested game does not exist');
                }
            } catch (error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
            }
        });

        // POST games
        this.router.post('/', async (req: Request, res: Response) => {
            try {
                const game: BaseGame = req.body;
                const newGame = await this.gameService.addGame(game);
                res.status(StatusCodes.CREATED).json(newGame);
            } catch (error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
            }
        });

        // DELETE games/:id
        this.router.delete('/:id', async (req: Request, res: Response) => {
            try {
                const gameToDelete = await this.gameService.deleteGame(req.params.id);
                if (gameToDelete === null) {
                    res.status(StatusCodes.NOT_FOUND).json('The requested game cannot be deleted as it does not exist');
                } else {
                    res.status(StatusCodes.OK).json('The game with the requested id has been deleted');
                }
            } catch (error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
            }
        });

        /*
        this.router.post('/', async (req: Request, res: Response) => {
            try {
                if (!Object.keys(req.body).length) {
                    res.status(StatusCodes.BAD_REQUEST).send();
                    return;
                }
                const game = await this.gameService.addGame(req.body);
                res.status(StatusCodes.CREATED).json(game);
            } catch (error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
            }
        });
        */

        /*
        this.router.get('/:id', async (req: Request, res: Response) => {
            try {
                const theGame = await this.gameService.getGamebyId(req.params.id);
                if (theGame === undefined) {
                    res.status(StatusCodes.NOT_FOUND).json("Nous avons pas trouvé le jeu selon l'id demandé");
                }
                res.status(StatusCodes.OK).json(theGame);
            } catch (error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
            }
        });
        */

        /*
        this.router.put('/:id', async (req: Request, res: Response) => {
            try {
                if (!Object.keys(req.body).length) {
                    res.status(StatusCodes.BAD_REQUEST).send();
                    return;
                }
                await this.gameService.updateGame(req.body);
                res.status(StatusCodes.OK).json({ id: req.body.id });
            } catch (error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
            }
        });

        this.router.delete('/', async (req: Request, res: Response) => {
            try {
                const gameToDelete = await this.gameService.deleteGame(req.params.id);
                if (!gameToDelete) {
                    res.status(StatusCodes.NOT_FOUND).json('The requested game cannot be deleted as it does not exist');
                } else {
                    res.status(StatusCodes.OK).json('The game with the requested id has been deleted');
                }
            } catch (error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
            }
        });
        */
    }
}
