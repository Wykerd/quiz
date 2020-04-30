import { Router } from 'express';
import Controllers from './controllers';

const router = Router();

router.route('/:id/details')
    .get(Controllers.Details)

router.route('/:id/init')
    .post(Controllers.Initialize) // get the init data for the quiz

router.route('/:id/submit')
    .post(Controllers.Submit) // submit anwser to get the next question and 

router.route('/:id/leaderboard')
    .get(Controllers.Leaderboard) // fetch the leaderboard for spesific quiz

router.route('/new')
    .post(Controllers.Create)

export default router;