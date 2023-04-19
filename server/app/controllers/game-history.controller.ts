import { GameHistory } from '@app/data/game-history';
import { GamesHistory } from '@app/services/game-history.service';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class HistoryController {
    router: Router;
    route = '/history';

    constructor(private readonly historyService: GamesHistory) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        // GET history
        this.router.get('/', async (req: Request, res: Response) => {
            try {
                const history: GameHistory[] = await this.historyService.getAllHistory();
                res.status(StatusCodes.OK).send(history);
            } catch (error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
            }
        });

        // POST history
        this.router.post('/', async (req: Request, res: Response) => {
            try {
                const newGameHistory: GameHistory = req.body;
                await this.historyService.addGameHistory(newGameHistory);
                res.status(StatusCodes.CREATED).json('The game was added');
            } catch (error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
            }
        });

        // DELETE history
        this.router.delete('/', async (req: Request, res: Response) => {
            try {
                await this.historyService.deleteAllHistory();
                res.status(StatusCodes.OK).json('All history was deleted');
            } catch (error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
            }
        });
    }
}
