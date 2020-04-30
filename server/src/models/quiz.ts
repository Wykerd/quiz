import mongoose from 'mongoose';

export interface Question {
    question: string,
    options?: string[],
    correct: string,
    caseSensitive: boolean,
    score: number
}

export interface QuizDocument extends mongoose.Document {
    randomize: boolean,
    progress: boolean,
    name: string,
    questions: Question[],
    time: number,
    total?: number,
    info: string[]
}

const quizSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    randomize: {
        type: Boolean,
        default: true
    },
    progress: {
        type: Boolean,
        default: true
    },
    questions: {
        type: [
            {
                question: {
                    type: String,
                    required: true
                },
                options: {
                    type: [ String ]
                },
                correct: {
                    type: String,
                    required: true
                },
                caseSensitive: {
                    type: Boolean,
                    default: false
                },
                score: {
                    type: Number,
                    default: 1
                }
            }
        ]
    },
    time: {
        type: Number
    },
    total: {
        type: Number
    },
    info: {
        type: [ String ],
        default: []
    }
});

export default mongoose.model<QuizDocument>('Quizes', quizSchema);