'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Heart, Smile, Frown, Meh, Sun, Moon, Cloud, Droplets, Coffee, Utensils, Bell, ChevronRight, ChevronLeft, Edit } from 'lucide-react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const API_URL = 'http://localhost:5000/api';
const MOODS = [
  { icon: Smile, label: 'Happy', color: 'text-yellow-500' },
  { icon: Meh, label: 'Neutral', color: 'text-gray-500' },
  { icon: Frown, label: 'Sad', color: 'text-blue-500' },
]

const SYMPTOMS = [
  { icon: Droplets, label: 'Cramps' },
  { icon: Cloud, label: 'Bloating' },
  { icon: Coffee, label: 'Fatigue' },
  { icon: Utensils, label: 'Cravings' },
]

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']

export default function Period() {
    const [quizCompleted, setQuizCompleted] = useState(false)
    const [lastPeriod, setLastPeriod] = useState(new Date())
    const [cycleLength, setCycleLength] = useState(28)
    const [periodLength, setPeriodLength] = useState(5)
    const [mood, setMood] = useState(null)
    const [symptoms, setSymptoms] = useState([])
    const [showNotification, setShowNotification] = useState(false)
    const [periodHistory, setPeriodHistory] = useState([])
    const [editMode, setEditMode] = useState(false)
    useEffect(() => {
        fetchPeriodData();
      }, []);
    
      useEffect(() => {
        if (quizCompleted) {
          savePeriodData();
        }
      }, [quizCompleted, lastPeriod, cycleLength, periodLength, mood, symptoms, periodHistory]);
      const fetchPeriodData = async () => {
        try {
          const response = await fetch(`${API_URL}/period/user1`);
          const data = await response.json();
          if (Object.keys(data).length > 0) {
            setQuizCompleted(data.quizCompleted);
            setLastPeriod(new Date(data.lastPeriod));
            setCycleLength(data.cycleLength);
            setPeriodLength(data.periodLength);
            setMood(data.mood);
            setSymptoms(data.symptoms);
            setPeriodHistory(data.periodHistory.map(period => ({
              start: new Date(period.start),
              end: new Date(period.end)
            })));
          }
        } catch (error) {
          console.error('Error fetching period data:', error);
        }
      };
    
      const savePeriodData = async () => {
        try {
          await fetch(`${API_URL}/period/user1`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              quizCompleted,
              lastPeriod,
              cycleLength,
              periodLength,
              mood,
              symptoms,
              periodHistory: periodHistory.map(period => ({
                start: period.start.toISOString(),
                end: period.end.toISOString()
              }))
            }),
          });
        } catch (error) {
          console.error('Error saving period data:', error);
        }
      };
    

  useEffect(() => {
    const savedData = localStorage.getItem('periodData')
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      setQuizCompleted(parsedData.quizCompleted)
      setLastPeriod(new Date(parsedData.lastPeriod))
      setCycleLength(parsedData.cycleLength)
      setPeriodLength(parsedData.periodLength)
      setPeriodHistory(parsedData.periodHistory.map(period => ({
        start: new Date(period.start),
        end: new Date(period.end)
      })))
    }
  }, [])

  useEffect(() => {
    if (quizCompleted) {
      const nextPeriod = new Date(lastPeriod.getTime() + cycleLength * 24 * 60 * 60 * 1000)
      const today = new Date()
      const diffDays = Math.ceil((nextPeriod - today) / (1000 * 60 * 60 * 24))

      if (diffDays <= 3 && diffDays > 0) {
        setShowNotification(true)
      }

      localStorage.setItem('periodData', JSON.stringify({
        quizCompleted,
        lastPeriod: lastPeriod.toISOString(),
        cycleLength,
        periodLength,
        periodHistory: periodHistory.map(period => ({
          start: period.start.toISOString(),
          end: period.end.toISOString()
        }))
      }))
    }
  }, [quizCompleted, lastPeriod, cycleLength, periodLength, periodHistory])

  const handleQuizSubmit = (e) => {
    e.preventDefault()
    setQuizCompleted(true)
    updatePeriodHistory()
  }

  const updatePeriodHistory = () => {
    const newHistory = []
    let currentDate = new Date(lastPeriod)
    for (let i = 0; i < 6; i++) {
      newHistory.push({
        start: new Date(currentDate),
        end: new Date(currentDate.getTime() + (periodLength - 1) * 24 * 60 * 60 * 1000)
      })
      currentDate = new Date(currentDate.getTime() + cycleLength * 24 * 60 * 60 * 1000)
    }
    setPeriodHistory(newHistory)
  }

  const toggleSymptom = (symptom) => {
    setSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    )
  }

  const getRecommendations = () => {
    const recommendations = [
      "Stay hydrated! Aim for 8 glasses of water a day.",
      "Try some light exercise like yoga or walking.",
      "Eat foods rich in iron and omega-3 fatty acids.",
      "Use a heating pad for cramp relief.",
      "Get plenty of rest and prioritize self-care.",
    ]
    return recommendations[Math.floor(Math.random() * recommendations.length)]
  }

  const renderPeriodChart = () => {
    const data = periodHistory.map((period, index) => ({
      name: `Period ${index + 1}`,
      start: period.start.getTime(),
      duration: (period.end.getTime() - period.start.getTime()) / (1000 * 60 * 60 * 24) + 1
    }))

    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Period History</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Duration (days)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Line type="monotone" dataKey="duration" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }

  const renderSymptomChart = () => {
    const data = SYMPTOMS.map(symptom => ({
      name: symptom.label,
      value: symptoms.includes(symptom.label) ? 1 : 0
    }))

    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Symptom Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => percent > 0 ? name : ''}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-200 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <h1 className="text-4xl font-bold text-center text-purple-600 mb-8">Period Tracker</h1>
          
          {!quizCompleted ? (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-semibold mb-4">Initial Setup</h2>
              <form onSubmit={handleQuizSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Period Start Date</label>
                  <DatePicker
                    selected={lastPeriod}
                    onChange={(date) => setLastPeriod(date)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Average Cycle Length (days)</label>
                  <input
                    type="number"
                    value={cycleLength}
                    onChange={(e) => setCycleLength(Number(e.target.value))}
                    className="w-full p-2 border rounded-md"
                    min="21"
                    max="35"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Average Period Length (days)</label>
                  <input
                    type="number"
                    value={periodLength}
                    onChange={(e) => setPeriodLength(Number(e.target.value))}
                    className="w-full p-2 border rounded-md"
                    min="3"
                    max="7"
                  />
                </div>
                <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                  Start Tracking
                </button>
              </form>
            </motion.div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Your Cycle</h2>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="flex items-center text-purple-600 hover:text-purple-800"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  {editMode ? 'Save' : 'Edit'}
                </button>
              </div>

              {editMode ? (
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Period Start Date</label>
                    <DatePicker
                      selected={lastPeriod}
                      onChange={(date) => setLastPeriod(date)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Average Cycle Length (days)</label>
                    <input
                      type="number"
                      value={cycleLength}
                      onChange={(e) => setCycleLength(Number(e.target.value))}
                      className="w-full p-2 border rounded-md"
                      min="21"
                      max="35"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Average Period Length (days)</label>
                    <input
                      type="number"
                      value={periodLength}
                      onChange={(e) => setPeriodLength(Number(e.target.value))}
                      className="w-full p-2 border rounded-md"
                      min="3"
                      max="7"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-pink-100 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Last Period</h3>
                    <p>{lastPeriod.toDateString()}</p>
                  </div>
                  <div className="bg-purple-100 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Cycle Length</h3>
                    <p>{cycleLength} days</p>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Period Length</h3>
                    <p>{periodLength} days</p>
                  </div>
                </div>
              )}

              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold mb-4 flex items-center">
                    <Heart className="mr-2 text-red-500" /> Mood & Symptoms
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">How are you feeling today?</label>
                      <div className="flex justify-around">
                        {MOODS.map((m) => (
                          <button
                            key={m.label}
                            onClick={() => setMood(m.label)}
                            className={`p-2 rounded-full ${mood === m.label ? 'bg-purple-100' : ''}`}
                          >
                            <m.icon className={`w-8 h-8 ${m.color}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms</label>
                      <div className="grid grid-cols-2 gap-2">
                        {SYMPTOMS.map((s) => (
                          <button
                            key={s.label}
                            onClick={() => toggleSymptom(s.label)}
                            className={`p-2 rounded-md flex items-center ${
                              symptoms.includes(s.label) ? 'bg-pink-200' : 'bg-gray-100'
                            }`}
                          >
                            <s.icon className="mr-2 w-5 h-5" />
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {renderPeriodChart()}
                {renderSymptomChart()}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="p-4 bg-purple-50 rounded-lg"
                >
                  <h2 className="text-2xl font-semibold mb-2 flex items-center">
                    <Sun className="mr-2 text-yellow-500" /> Daily Tip
                  </h2>
                  <p className="text-gray-700">{getRecommendations()}</p>
                </motion.div>

                {showNotification && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 bg-pink-100 rounded-lg flex items-center"
                  >
                    <Bell className="mr-4 text-pink-500" />
                    <p className="text-pink-800">Your period is coming soon! Make sure you're prepared.</p>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>

        {quizCompleted && (
          <div className="bg-purple-600 p-8 text-white">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Moon className="mr-2" /> Cycle Overview
            </h2>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: cycleLength }, (_, i) => {
                const dayNumber = (i + lastPeriod.getDate()) % cycleLength || cycleLength
                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-full flex items-center justify-center ${
                      i < periodLength ? 'bg-pink-400' : 'bg-purple-400'
                    }`}
                  >
                    {dayNumber}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}