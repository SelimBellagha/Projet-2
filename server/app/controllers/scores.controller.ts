import { TopScore } from '@app/data/top-scores.interface';
import { TopScoresService } from '@app/services/top-scores.service';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class ScoresController {
    router: Router;
    route = '/scores';

    constructor(private readonly scoreService: TopScoresService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        // GET scores
        this.router.get('/', async (req: Request, res: Response) => {
            try {
                const scores: TopScore[] = await this.scoreService.getAllTopScores();
                res.status(StatusCodes.OK).send(scores);
            } catch (error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
            }
        });

        // GET scores/:gameId/:gameType
        this.router.get('/:gameId/:gameType', async (req: Request, res: Response) => {
            try {
                const { gameId, gameType } = req.params;
                const response = await this.scoreService.sortTopScores(gameId, gameType);
                res.status(StatusCodes.OK).send(response);
            } catch (error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
            }
        });

        // POST scores
        this.router.post('/', async (req: Request, res: Response) => {
            try {
                const score: TopScore = req.body;
                const response = await this.scoreService.addScore(score);
                res.status(StatusCodes.OK).send(response);
            } catch (error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
            }
        });

        // POST scores/:gameId
        this.router.post('/:gameId', async (req: Request, res: Response) => {
            try {
                const { gameId } = req.params;
                await this.scoreService.addDefaultScores(gameId);
                res.status(StatusCodes.CREATED).json('The default scores were added to the new game');
            } catch (error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
            }
        });

        // DELETE scores/:gameId
        this.router.delete('/:gameId', async (req: Request, res: Response) => {
            try {
                const { gameId } = req.params;
                await this.scoreService.resetOneGame(gameId);
                res.status(StatusCodes.OK).json('The scores for this game have been reinitialized');
            } catch (error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
            }
        });
    }
}
