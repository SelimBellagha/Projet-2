/* eslint-disable deprecation/deprecation */
import { HttpException } from '@app/classes/http.exception';
import { GameController } from '@app/controllers/games.controller';
import { ScoresController } from '@app/controllers/scores.controller';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import { StatusCodes } from 'http-status-codes';
import * as swaggerJSDoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';
import { Service } from 'typedi';
import { HistoryController } from './controllers/game-history.controller';
import { DatabaseService } from './services/database.service';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import bodyParser = require('body-parser');

@Service()
export class Application {
    app: express.Application;
    private readonly internalError: number = StatusCodes.INTERNAL_SERVER_ERROR;
    private readonly swaggerOptions: swaggerJSDoc.Options;

    // eslint-disable-next-line max-params
    constructor(
        private gamesController: GameController,
        private scoresController: ScoresController,
        private readonly databaseService: DatabaseService,
        private historyController: HistoryController,
    ) {
        this.app = express();

        this.swaggerOptions = {
            swaggerDefinition: {
                openapi: '3.0.0',
                info: {
                    title: 'Cadriciel Serveur',
                    version: '1.0.0',
                },
            },
            apis: ['**/*.ts'],
        };

        this.config();

        this.bindRoutes();

        this.connectDatabase();
    }

    bindRoutes(): void {
        this.app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(this.swaggerOptions)));
        this.app.use('/api/games', this.gamesController.router);
        this.app.use('/api/scores', this.scoresController.router);
        this.app.use('/api/history', this.historyController.router);
        this.app.use('/', (req, res) => {
            res.redirect('/api/docs');
        });
        this.errorHandling();
    }

    private connectDatabase(): void {
        // Connect to the mongoDB database
        this.databaseService.start();
    }

    private config(): void {
        // Middlewares configuration
        this.app.use(bodyParser({ limit: '50mb' }));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(cors());
    }

    private errorHandling(): void {
        // When previous handlers have not served a request: path wasn't found
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            const err: HttpException = new HttpException('Not Found');
            next(err);
        });

        // development error handler
        // will print stacktrace
        if (this.app.get('env') === 'development') {
            this.app.use((err: HttpException, req: express.Request, res: express.Response) => {
                res.status(err.status || this.internalError);
                res.send({
                    message: err.message,
                    error: err,
                });
            });
        }

        // production error handler
        // no stacktraces  leaked to user (in production env only)
        this.app.use((err: HttpException, req: express.Request, res: express.Response) => {
            res.status(err.status || this.internalError);
            res.send({
                message: err.message,
                error: {},
            });
        });
    }
}
