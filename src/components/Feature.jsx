'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Dumbbell, Award, Plus, Trash2, ChevronRight, ChevronLeft, Calendar, Clock, Droplet, Moon } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const API_URL = 'http://localhost:5000/api';

const Feature = () => {
    const [activeSection, setActiveSection] = useState('quiz');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [showMonthlyGraph, setShowMonthlyGraph] = useState(false);
    const [userData, setUserData] = useState({
      exercises: [],
      totalPoints: 0,
      achievements: [],
      dailyProgress: {},
      waterIntake: {},
      waterIntakeGoal: 2000,
      sleepHours: {},
      moodTracker: {},
      quizAnswers: null,
    });
  
    useEffect(() => {
      fetchUserData();
    }, []);
  
    useEffect(() => {
      if (quizCompleted) {
        saveUserData();
      }
    }, [userData, quizCompleted]);
    const fetchUserData = async () => {
        try {
          const response = await fetch(`${API_URL}/feature/user1`);
          const data = await response.json();
          if (Object.keys(data).length > 0) {
            setUserData(data);
            setQuizCompleted(true);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
    

      const saveUserData = async () => {
        try {
          await fetch(`${API_URL}/feature/user1`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });
        } catch (error) {
          console.error('Error saving user data:', error);
        }
      };
      const initializeDataForDate = (date) => {
        const dateString = date.toISOString().split('T')[0];
        if (!userData.dailyProgress[dateString]) {
          setUserData(prev => ({
            ...prev,
            dailyProgress: {
              ...prev.dailyProgress,
              [dateString]: { completed: 0, total: prev.exercises.length }
            },
            waterIntake: { ...prev.waterIntake, [dateString]: 0 },
            sleepHours: { ...prev.sleepHours, [dateString]: 0 },
            moodTracker: { ...prev.moodTracker, [dateString]: 'neutral' },
          }));
        }
      };

      useEffect(() => {
        initializeDataForDate(selectedDate);
      }, [selectedDate, userData.exercises]);
    

      const updateExercise = (id) => {
        const dateString = selectedDate.toISOString().split('T')[0];
        setUserData(prev => {
          const updatedExercises = prev.exercises.map(ex => 
            ex.id === id ? { ...ex, completed: !ex.completed } : ex
          );
          const totalPoints = updatedExercises.reduce((sum, ex) => ex.completed ? sum + ex.points : sum, 0);
          const achievements = getAchievements(totalPoints);
          const dailyProgress = {
            ...prev.dailyProgress,
            [dateString]: {
              ...prev.dailyProgress[dateString],
              completed: updatedExercises.filter(ex => ex.completed).length,
              total: updatedExercises.length
            }
          };
          return { ...prev, exercises: updatedExercises, totalPoints, achievements, dailyProgress };
        });
      };
    

  const addExercise = (name, points) => {
    if (points > 10) {
      alert("Maximum points for an exercise is 10.");
      return;
    }
    setUserData(prev => {
      const newExercise = { id: Date.now(), name, completed: false, points: Number(points) };
      const updatedExercises = [...prev.exercises, newExercise];
      const updatedDailyProgress = Object.keys(prev.dailyProgress).reduce((acc, date) => {
        acc[date] = { ...prev.dailyProgress[date], total: updatedExercises.length };
        return acc;
      }, {});
      return { ...prev, exercises: updatedExercises, dailyProgress: updatedDailyProgress };
    });
  };

  const deleteExercise = (id) => {
    setUserData(prev => {
      const updatedExercises = prev.exercises.filter(ex => ex.id !== id);
      const updatedDailyProgress = Object.keys(prev.dailyProgress).reduce((acc, date) => {
        acc[date] = { 
          ...prev.dailyProgress[date], 
          total: updatedExercises.length,
          completed: Math.min(prev.dailyProgress[date].completed, updatedExercises.length)
        };
        return acc;
      }, {});
      return { ...prev, exercises: updatedExercises, dailyProgress: updatedDailyProgress };
    });
  };

  const getAchievements = (points) => {
    const achievements = [];
    if (points >= 100) achievements.push({ name: 'Century', icon: '🏅' });
    if (points >= 500) achievements.push({ name: 'Fitness Enthusiast', icon: '🏆' });
    if (points >= 1000) achievements.push({ name: 'Workout Warrior', icon: '💪' });
    return achievements;
  };

  const updateWaterIntake = (amount) => {
    const dateString = selectedDate.toISOString().split('T')[0];
    setUserData(prev => ({
      ...prev,
      waterIntake: {
        ...prev.waterIntake,
        [dateString]: Math.max(0, (prev.waterIntake[dateString] || 0) + amount)
      }
    }));
  };

  const updateSleepHours = (hours) => {
    const dateString = selectedDate.toISOString().split('T')[0];
    setUserData(prev => ({
      ...prev,
      sleepHours: {
        ...prev.sleepHours,
        [dateString]: hours
      }
    }));
  };

  const updateMood = (mood) => {
    const dateString = selectedDate.toISOString().split('T')[0];
    setUserData(prev => ({
      ...prev,
      moodTracker: {
        ...prev.moodTracker,
        [dateString]: mood
      }
    }));
  };

  const submitQuiz = (answers) => {
    const exercisesForLevel = {
      beginner: [
        { id: 1, name: 'Walking', completed: false, points: 3 },
        { id: 2, name: 'Stretching', completed: false, points: 2 },
        { id: 3, name: 'Light Yoga', completed: false, points: 4 },
      ],
      intermediate: [
        { id: 1, name: 'Jogging', completed: false, points: 5 },
        { id: 2, name: 'Push-ups', completed: false, points: 4 },
        { id: 3, name: 'Bodyweight Squats', completed: false, points: 4 },
      ],
      advanced: [
        { id: 1, name: 'HIIT Workout', completed: false, points: 8 },
        { id: 2, name: 'Weight Training', completed: false, points: 7 },
        { id: 3, name: 'Advanced Yoga', completed: false, points: 6 },
      ],
    };

    setUserData(prev => ({
      ...prev,
      quizAnswers: answers,
      exercises: exercisesForLevel[answers.fitnessLevel] || [],
    }));
    setQuizCompleted(true);
    setActiveSection('dashboard');
  };

  const renderDashboard = () => {
    const dateString = selectedDate.toISOString().split('T')[0];
    const recentDates = Array(7).fill().map((_, i) => {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const monthlyData = Object.entries(userData.dailyProgress).map(([date, progress]) => ({
      date,
      percentage: progress.total > 0 ? (progress.completed / progress.total) * 100 : 0
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold">Dashboard</h3>
          <DatePicker
            selected={selectedDate}
            onChange={date => setSelectedDate(date)}
            maxDate={new Date()}
            className="p-2 border rounded"
          />
        </div>
        
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {recentDates.map(date => (
            <button
              key={date}
              onClick={() => setSelectedDate(new Date(date))}
              className={`px-4 py-2 rounded-full ${date === dateString ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h4 className="text-xl font-semibold mb-4">Today's Progress</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Completed', value: userData.dailyProgress[dateString]?.completed || 0 },
                    { name: 'Remaining', value: (userData.dailyProgress[dateString]?.total || 0) - (userData.dailyProgress[dateString]?.completed || 0) }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell key="cell-0" fill="#4CAF50" />
                  <Cell key="cell-1" fill="#FFA726" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-xl font-semibold mb-4">Weekly Overview</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={recentDates.map(date => ({
                date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
                completed: userData.dailyProgress[date]?.completed || 0,
                total: userData.dailyProgress[date]?.total || 0
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#4CAF50" />
                <Bar dataKey="total" fill="#FFA726" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-4">Monthly Progress</h4>
          <button
            onClick={() => setShowMonthlyGraph(!showMonthlyGraph)}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {showMonthlyGraph ? 'Hide' : 'Show'} Monthly Graph
          </button>
          {showMonthlyGraph && (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="percentage" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Water Intake</h4>
            <p>{userData.waterIntake[dateString] || 0} ml / {userData.waterIntakeGoal} ml</p>
            <div className="w-full bg-blue-200 rounded-full h-2.5 dark:bg-blue-700 mt-2 mb-4">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{width: `${Math.min(100, ((userData.waterIntake[dateString] || 0) / userData.waterIntakeGoal) * 100)}%`}}
              ></div>
            </div>
            <div className="mt-2">
              <button onClick={() => updateWaterIntake(250)} className="mr-2 px-2 py-1 bg-blue-500 text-white rounded">+250ml</button>
              <button onClick={() => updateWaterIntake(-250)} className="px-2 py-1 bg-red-500 text-white rounded">-250ml</button>
            </div>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Sleep Tracker</h4>
            <p>{userData.sleepHours[dateString] || 0} hours</p>
            <input
              type="number"
              value={userData.sleepHours[dateString] || 0}
              onChange={(e) => updateSleepHours(Number(e.target.value))}
              className="mt-2 p-1 border rounded"
              min="0"
              max="24"
            />
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Mood Tracker</h4>
            <p>{userData.moodTracker[dateString] || 'Not set'}</p>
            <select
              value={userData.moodTracker[dateString] || ''}
              onChange={(e) => updateMood(e.target.value)}
              className="mt-2 p-1 border rounded"
            >
              <option value="">Select mood</option>
              <option value="happy">Happy</option>
              <option value="neutral">Neutral</option>
              <option value="sad">Sad</option>
            </select>
          </div>
        </div>
      </div>
    );
  };

  const renderExercises = () => (
    <div>
      <h3 className="text-2xl font-bold mb-6">Your Exercise Routine</h3>
      <div className="grid gap-4 mb-8">
        {userData.exercises.map(exercise => (
          <motion.div 
            key={exercise.id}
            className={`p-4 rounded-lg flex justify-between items-center ${exercise.completed ? 'bg-green-100' : 'bg-gray-100'}`}
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-lg">{exercise.name} ({exercise.points} pts)</span>
            <div className="flex items-center">
              <button
                onClick={() => updateExercise(exercise.id)}
                className={`p-2 rounded-full mr-2 ${exercise.completed ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
              >
                {exercise.completed ? 'Completed' : 'Mark Complete'}
              </button>
              <button
                onClick={() => deleteExercise(exercise.id)}
                className="p-2 rounded-full bg-red-500 text-white"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mb-8">
        <h4 className="text-xl font-semibold mb-2">Add New Exercise</h4>
        <form onSubmit={(e) => {
          e.preventDefault();
          const name = e.target.name.value;
          const points = e.target.points.value;
          if (name && points) {
            addExercise(name, points);
            e.target.reset();
          }
        }} className="flex gap-2">
          <input type="text" name="name" placeholder="Exercise name" className="flex-grow p-2 border rounded" required />
          <input type="number" name="points" placeholder="Points (max 10)" className="w-32 p-2 border rounded" required min="1" max="10" />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">
            <Plus size={24} />
          </button>
        </form>
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div>
      <h3 className="text-2xl font-bold mb-6">Your Achievements</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {userData.achievements.map((achievement, index) => (
          <motion.div
            key={index}
            className="bg-yellow-100 p-4 rounded-lg text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="text-4xl mb-2">{achievement.icon}</div>
            <h4 className="text-xl font-semibold">{achievement.name}</h4>
          </motion.div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <p className="text-2xl font-bold">Total Points: {userData.totalPoints}</p>
      </div>
    </div>
  );

  const renderQuiz = () => (
    <div>
      <h3 className="text-2xl font-bold mb-6">Fitness Quiz</h3>
      <p className="mb-4">Answer these questions to get personalized exercise recommendations:</p>
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const answers = Object.fromEntries(formData);
        submitQuiz(answers);
      }} className="space-y-4">
        <div>
          <label className="block mb-2">What's your current fitness level?</label>
          <select name="fitnessLevel" className="w-full p-2 border rounded" required>
            <option value="">Select an option</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div>
          <label className="block mb-2">How many days per week can you exercise?</label>
          <input type="number" name="daysPerWeek" min="1" max="7" className="w-full p-2 border rounded" required />
        </div>
        <div>
          <label className="block mb-2">What's your primary fitness goal?</label>
          <select name="fitnessGoal" className="w-full p-2 border rounded" required>
            <option value="">Select an option</option>
            <option value="weightLoss">Weight Loss</option>
            <option value="muscleGain">Muscle Gain</option>
            <option value="endurance">Improve Endurance</option>
            <option value="flexibility">Increase Flexibility</option>
          </select>
        </div>
        <div>
          <label className="block mb-2">Do you have any injuries or health conditions?</label>
          <textarea name="healthConditions" className="w-full p-2 border rounded" rows="3"></textarea>
        </div>
        <div>
          <label className="block mb-2">What type of exercises do you enjoy?</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" name="enjoyedExercises" value="cardio" className="mr-2" />
              Cardio
            </label>
            <label className="flex items-center">
              <input type="checkbox" name="enjoyedExercises" value="strength" className="mr-2" />
              Strength Training
            </label>
            <label className="flex items-center">
              <input type="checkbox" name="enjoyedExercises" value="yoga" className="mr-2" />
              Yoga
            </label>
            <label className="flex items-center">
              <input type="checkbox" name="enjoyedExercises" value="hiit" className="mr-2" />
              HIIT
            </label>
          </div>
        </div>
        <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          Submit Quiz
        </button>
      </form>
    </div>
  );

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          className="text-5xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Your Fitness Journey
        </motion.h1>

        {quizCompleted ? (
          <div className="flex justify-center space-x-4 mb-12 flex-wrap">
            {['dashboard', 'exercises', 'achievements'].map((section) => (
              <motion.button
                key={section}
                className={`px-6 py-2 rounded-full ${activeSection === section ? 'bg-purple-600 text-white' : 'bg-white text-purple-600'} m-2`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveSection(section)}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </motion.button>
            ))}
          </div>
        ) : null}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white p-8 rounded-xl shadow-xl"
          >
            {!quizCompleted && renderQuiz()}
            {quizCompleted && activeSection === 'dashboard' && renderDashboard()}
            {quizCompleted && activeSection === 'exercises' && renderExercises()}
            {quizCompleted && activeSection === 'achievements' && renderAchievements()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Feature;