import mongoose from 'mongoose';

export interface ParticipantDocument extends mongoose.Document {
    quiz: mongoose.Types.ObjectId,
    

    nickname: string,
    info: Map<string, string>,

    wrongIndexes: number[],
    usedIndexes?: [ number ],
    questionIndex: number,
    score: number,

    startTime: Date,
    endTime: Date | undefined,
}

const participantSchema = new mongoose.Schema({
    quiz: {
        type: mongoose.Types.ObjectId,
        required: true,
        index: true
    },
    nickname: {
        type: String,
        required: true
    },
    info: {
        type: Map,
        of: String
    },
    wrongIndexes: {
        type: [ Number ],
        default: []
    },
    usedIndexes: {
        type: [ Number ],
    },
    questionIndex: {
        type: Number,
        default: 0
    },
    score: {
        type: Number,
        default: 0
    },
    startTime: {
        type: Date,
        default: new Date()
    },
    endTime: {
        type: Date
    }
});

participantSchema.index({
    quiz: 1,
    score: 1
});

export default mongoose.model<ParticipantDocument>('Participants', participantSchema);