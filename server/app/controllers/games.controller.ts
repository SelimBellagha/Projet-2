import { GameData } from '@app/data/game.interface';
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
                const games: GameData[] = await this.gameService.getAllGames();
                res.status(StatusCodes.OK).send(games);
            } catch (error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
            }
        });

        // GET games/:id
        this.router.get('/:id', async (req: Request, res: Response) => {
            // const id: number = parseInt(req.params.id, 10);
            try {
                const game: GameData = await this.gameService.getGamebyId(req.params.id);
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
        this.router.post('/send', async (req: Request, res: Response) => {
            try {
                const game: GameData = req.body;
                const newGame = await this.gameService.addGame(game);
                res.status(StatusCodes.CREATED).send(newGame);
            } catch (error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
            }
        });

        /*
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
        */
    }
}
