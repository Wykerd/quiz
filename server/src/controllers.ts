import express from 'express';
import mongoose from 'mongoose';
import { Quiz, Participant } from './models'
import participant from './models/participant';

namespace Controllers {
    export const Details : express.RequestHandler = async (req, res) => {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Bad Request', message: 'Invalid id' });
            
            const quiz = await Quiz.findById(id).select('-questions');

            // check if exists
            if (!quiz) return res.status(404).json({ error: 'Not Found', message: 'Could not find quiz with that ID' });

            // return the info
            return res.status(200).json(quiz);   
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    };

    export const Initialize : express.RequestHandler = async (req, res) => {
        try {
            const { id } = req.params;
            
            const { info, nickname } = req.body;
            if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Bad Request', message: 'Invalid id' });
            const quiz = await Quiz.findById(id);
            // check if exists
            if (!quiz) return res.status(404).json({ error: 'Not Found', message: 'Could not find quiz with that ID' });

            const user_id = req.cookies[`q_${id}`];
            if (user_id) {
                const participant = await Participant.findById(user_id);

                if (participant) {
                    const qI = participant.usedIndexes ? participant.usedIndexes[participant.questionIndex] : participant.questionIndex;

                    const q = quiz.questions[qI];

                    const qt = quiz.total ?? quiz.questions.length;

                    if (new Date().getTime() - participant.startTime.getTime() > quiz.time) return res.status(200).json({
                        done: true,
                        message: 'You\'ve run out of time!',
                        score: participant.score,
                        progress: quiz.progress ? participant.questionIndex / (qt-1) : undefined,
                    });

                    if (participant.questionIndex >= qt - 1) {
                        return res.status(200).json({
                            done: true,
                            message: 'You\'ve completed the quiz!',
                            score: participant.score,
                            progress: quiz.progress ? participant.questionIndex / (qt-1) : undefined,
                        });
                    }

                    return res.status(200).json({
                        done: false,
                        question: {question: q.question, options: q.options,score: q.score},
                        score: participant.score,
                        progress: quiz.progress ? participant.questionIndex / (qt-1) : undefined,
                    });
                }
            }

            // validate the info
            let fInfo : { [key: string]: string } = {};
            if (quiz.info.length > 0) {
                if ((!info) || (!(info instanceof Object))) 
                    return res.status(400).json({ error: 'Bad Request', message: 'Request is missing the required info map' });
                const keys = Object.keys(info);
                if (keys.filter(key => quiz.info.includes(key)).length !== quiz.info.length) 
                    return res.status(400).json({ error: 'Bad Request', message: 'Request is missing the required info map' });
                quiz.info.forEach(key => {
                    fInfo[key] = info[key];
                })
            }
            // generate the question indexes
            let indexes: number[] = [];
            const allI: number[] = [];
            for (let i = 0; i < quiz.questions.length; i++) allI.push(i);
            for (let i = 0; i < (quiz.total || quiz.questions.length); i++) indexes.push(...allI.splice(Math.floor(Math.random() * allI.length)));

            const participant = await Participant.create({
                quiz: mongoose.Types.ObjectId(id),
                nickname,
                info: fInfo ? fInfo: undefined,
                usedIndexes: indexes ? indexes : undefined,
            });

            //now get the first question and return it
            const firstIndex = indexes ? indexes[0] : 0;

            const question = quiz.questions[firstIndex];

            return res.status(201).cookie(`q_${id}`, participant._id.toString(), { expires: new Date(Date.now() + + 31536000000) }).json({
                done: false,
                question: {question: question.question, options: question.options,score: question.score},
                score: 0,
                progress: 0,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message })
        }
    }

    export const Submit : express.RequestHandler = async (req, res) => {
        try {
            const { id } = req.params;

            //
            // Identification + Validation
            //

            const userid = req.cookies[`q_${id}`];

            if (!userid) return res.status(401).json({ error: 'Unauthorized', message: 'You are not authorized to submit anwsers to this quiz.' });
            
            if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Bad Request', message: 'Invalid id' });
            
            const quiz = await Quiz.findById(id);

            // check if exists
            if (!quiz) return res.status(404).json({ error: 'Not Found', message: 'Could not find quiz with that ID' });

            

            const participant = await Participant.findById(userid);

            // check if exists
            if ((!participant) || (participant?.quiz.toHexString() !== quiz._id.toString())) return res.status(404).json({ error: 'Unauthorized', message: 'Could not find participant with that ID' });

            // total question count
            const qt = quiz.total ?? quiz.questions.length;

            // time limit
            if (Date.now() - participant.startTime.getTime() > quiz.time) return res.status(200).json({
                done: true,
                message: 'You\'ve run out of time!',
                score: participant.score,
                progress: quiz.progress ? participant.questionIndex / (qt-1) : undefined,
            });

            //
            // LOGIC
            //
            
            const qI = participant.usedIndexes ? participant.usedIndexes[participant.questionIndex] : participant.questionIndex;

            const q = quiz.questions[qI];

            const { ans, correct } = q.caseSensitive ? { 
                ans : req.body.ans,
                correct: q.correct
            } : {
                ans: req.body.ans.toLowerCase(),
                correct: q.correct.toLowerCase()
            };

            if (ans === correct) {
                participant.score += q.score;
            } else {
                participant.wrongIndexes.push(qI);
            };

            if (participant.questionIndex >= qt - 1) {
                // end
                await participant.save();
                return res.status(200).json({
                    done: true,
                    message: 'You\'ve completed the quiz!',
                    score: participant.score,
                    progress: quiz.progress ? participant.questionIndex / (qt-1) : undefined,
                });
            }

            participant.questionIndex++;

            await participant.save();

            const nqI = participant.usedIndexes ? participant.usedIndexes[participant.questionIndex] : participant.questionIndex;

            const question = quiz.questions[nqI];

            return res.status(200).json({
                done: false,
                correct: ans === correct,
                question: {question: question.question, options: question.options,score: question.score},
                score: participant.score,
                progress: quiz.progress ? participant.questionIndex / (qt-1) : undefined,
            });
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }

    export const Leaderboard : express.RequestHandler = async (req, res) => {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Bad Request', message: 'Invalid id' });

            const top = await participant.find({ quiz: mongoose.Types.ObjectId(id)}).sort({ score: -1 });

            if (top.length < 0) return res.status(404).json({ message: 'No results.', error: 'Not Found' });

            return res.status(200).json(top);
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }

    export const Create : express.RequestHandler = async (req, res) => {
        try {
            const quiz = req.body;

            const valid_keys = Object.keys(quiz).filter(key => ['randomize','progress','questions','time','total','info','name'].includes(key));

            const doc : { [key: string]: any } = {};

            valid_keys.forEach(key => doc[key] = quiz[key]);

            const q = await Quiz.create(doc);

            return res.status(201).json(q);
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }
} 

export default Controllers;