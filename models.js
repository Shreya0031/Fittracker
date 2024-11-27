import mongoose from 'mongoose';

const featureSchema = new mongoose.Schema({
  userId: String,
  exercises: [{ id: Number, name: String, completed: Boolean, points: Number }],
  totalPoints: Number,
  achievements: [{ name: String, icon: String }],
  dailyProgress: mongoose.Schema.Types.Mixed,
  waterIntake: mongoose.Schema.Types.Mixed,
  waterIntakeGoal: Number,
  sleepHours: mongoose.Schema.Types.Mixed,
  moodTracker: mongoose.Schema.Types.Mixed,
  quizAnswers: mongoose.Schema.Types.Mixed,
});

const healthSchema = new mongoose.Schema({
  userId: String,
  quizCompleted: Boolean,
  goals: mongoose.Schema.Types.Mixed,
  medicines: [{ name: String, time: String }],
  healthData: mongoose.Schema.Types.Mixed,
  streaks: mongoose.Schema.Types.Mixed,
});

const periodSchema = new mongoose.Schema({
  userId: String,
  quizCompleted: Boolean,
  lastPeriod: Date,
  cycleLength: Number,
  periodLength: Number,
  periodHistory: [{ start: Date, end: Date }],
  mood: String,
  symptoms: [String],
});

const userSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    }
})

export const User = mongoose.model('User', userSchema);
export const Feature = mongoose.model('Feature', featureSchema);
export const Health = mongoose.model('Health', healthSchema);
export const Period = mongoose.model('Period', periodSchema);



