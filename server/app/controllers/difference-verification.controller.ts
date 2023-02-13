import { GameManager } from '@app/services/game-manager.service';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class DifferenceVerificationController {
    router: Router;

    constructor(private gameManager: GameManager) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/:id', async (req: Request, res: Response) => {
            try {
                const positionX = Number(req.query.ClickX);
                const positionY = Number(req.query.ClickY);
                const id = req.params.id;
                const response = await this.gameManager.verificationInPicture(positionX, positionY, id);
                res.status(StatusCodes.OK).send(response);
            } catch (error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
            }
        });
    }
}
