'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { Apple, Pill, Plus, Trash2, Check, ChevronRight, ChevronLeft, AlertCircle, TrendingUp, Edit } from 'lucide-react'

const API_URL = 'http://localhost:5000/api';
const MEDICINE_TIMES = ['Morning', 'Afternoon', 'Evening', 'Night']

const INITIAL_QUIZ = [
  { id: 'calories', question: 'What is your daily calorie goal?', type: 'number', min: 1000, max: 5000 },
  { id: 'protein', question: 'What is your daily protein goal (in grams)?', type: 'number', min: 0, max: 300 },
  { id: 'carbs', question: 'What is your daily carbohydrate goal (in grams)?', type: 'number', min: 0, max: 500 },
  { id: 'fat', question: 'What is your daily fat goal (in grams)?', type: 'number', min: 0, max: 200 },
  { id: 'water', question: 'How many glasses of water do you aim to drink daily?', type: 'number', min: 0, max: 20 },
  { id: 'exercise', question: 'What is your daily exercise goal (in minutes)?', type: 'number', min: 0, max: 300 },
]

const NUTRIENT_COLORS = {
  protein: '#FF6384',
  carbs: '#36A2EB',
  fat: '#FFCE56',
  calories: '#4BC0C0',
  water: '#9966FF',
  exercise: '#FF9F40'
}

export default function Health() {
    const [quizCompleted, setQuizCompleted] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [healthData, setHealthData] = useState({})
  const [goals, setGoals] = useState({})
  const [medicines, setMedicines] = useState([])
  const [streaks, setStreaks] = useState({ diet: 0, medicine: 0, overall: 0 })
  const [editingDietItem, setEditingDietItem] = useState(null)
  const [editingMedicine, setEditingMedicine] = useState(null)

  useEffect(() => {
    fetchHealthData();
  }, []);

  useEffect(() => {
    if (quizCompleted) {
      saveHealthData();
    }
  }, [healthData, goals, medicines, streaks, quizCompleted]);
  const fetchHealthData = async () => {
    try {
      const response = await fetch(`${API_URL}/health/user1`);
      const data = await response.json();
      if (Object.keys(data).length > 0) {
        setQuizCompleted(data.quizCompleted);
        setHealthData(data.healthData || {});
        setGoals(data.goals || {});
        setMedicines(data.medicines || []);
        setStreaks(data.streaks || { diet: 0, medicine: 0, overall: 0 });
      }
    } catch (error) {
      console.error('Error fetching health data:', error);
    }
  };
    
  const saveHealthData = async () => {
    try {
      await fetch(`${API_URL}/health/user1`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizCompleted,
          healthData,
          goals,
          medicines,
          streaks,
        }),
      });
    } catch (error) {
      console.error('Error saving health data:', error);
    }
  };

  useEffect(() => {
    const savedHealthData = localStorage.getItem('healthData')
    const savedGoals = localStorage.getItem('healthGoals')
    const savedQuizStatus = localStorage.getItem('quizCompleted')
    const savedMedicines = localStorage.getItem('medicines')
    const savedStreaks = localStorage.getItem('streaks')
    if (savedHealthData) setHealthData(JSON.parse(savedHealthData))
    if (savedGoals) setGoals(JSON.parse(savedGoals))
    if (savedQuizStatus) setQuizCompleted(JSON.parse(savedQuizStatus))
    if (savedMedicines) setMedicines(JSON.parse(savedMedicines))
    if (savedStreaks) setStreaks(JSON.parse(savedStreaks))
  }, [])

  useEffect(() => {
    localStorage.setItem('healthData', JSON.stringify(healthData))
    localStorage.setItem('healthGoals', JSON.stringify(goals))
    localStorage.setItem('quizCompleted', JSON.stringify(quizCompleted))
    localStorage.setItem('medicines', JSON.stringify(medicines))
    localStorage.setItem('streaks', JSON.stringify(streaks))
  }, [healthData, goals, quizCompleted, medicines, streaks])

  const dateString = selectedDate.toISOString().split('T')[0]

  const handleQuizSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const newGoals = {}
    INITIAL_QUIZ.forEach(q => {
      newGoals[q.id] = parseInt(formData.get(q.id), 10)
    })
    setGoals(newGoals)

    const newMedicines = []
    let i = 0
    while (formData.get(`medicine-${i}-name`)) {
      newMedicines.push({
        name: formData.get(`medicine-${i}-name`),
        time: formData.get(`medicine-${i}-time`),
      })
      i++
    }
    setMedicines(newMedicines)

    setQuizCompleted(true)
    initializeHealthData(newGoals, newMedicines)
  }

  const initializeHealthData = (newGoals, newMedicines) => {
    const initialData = {
      diet: Object.keys(newGoals).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
      medicines: newMedicines.reduce((acc, med) => ({ ...acc, [med.name]: { [med.time]: false } }), {}),
    }
    setHealthData({ ...healthData, [dateString]: initialData })
  }


  const updateHealthItem = (category, item, value) => {
    const updatedHealthData = {
      ...healthData,
      [dateString]: {
        ...healthData[dateString],
        [category]: {
          ...healthData[dateString][category],
          [item]: parseInt(value, 10),
        },
      },
    }
    setHealthData(updatedHealthData)
    updateStreaks(updatedHealthData)
  }

  const toggleMedicineTaken = (medicineName, time) => {
    const updatedHealthData = {
      ...healthData,
      [dateString]: {
        ...healthData[dateString],
        medicines: {
          ...healthData[dateString].medicines,
          [medicineName]: {
            ...healthData[dateString].medicines[medicineName],
            [time]: !healthData[dateString].medicines[medicineName]?.[time],
          },
        },
      },
    }
    setHealthData(updatedHealthData)
    updateStreaks(updatedHealthData)
  }

  const updateMedicine = (index, updatedMedicine) => {
    const newMedicines = [...medicines]
    newMedicines[index] = updatedMedicine
    setMedicines(newMedicines)
    setEditingMedicine(null)
  }

  const removeMedicine = (index) => {
    const newMedicines = medicines.filter((_, i) => i !== index)
    setMedicines(newMedicines)
  }

  const updateStreaks = (updatedHealthData) => {
    const today = new Date().toISOString().split('T')[0]
    const yesterdayDate = new Date()
    yesterdayDate.setDate(yesterdayDate.getDate() - 1)
    const yesterday = yesterdayDate.toISOString().split('T')[0]

    const dietStreak = isDietComplete(updatedHealthData[today]?.diet) 
      ? (isDietComplete(updatedHealthData[yesterday]?.diet) ? streaks.diet + 1 : 1)
      : 0

    const medicineStreak = isMedicineComplete(updatedHealthData[today]?.medicines)
      ? (isMedicineComplete(updatedHealthData[yesterday]?.medicines) ? streaks.medicine + 1 : 1)
      : 0

    const overallStreak = (dietStreak > 0 && medicineStreak > 0)
      ? ((streaks.diet > 0 && streaks.medicine > 0) ? streaks.overall + 1 : 1)
      : 0

    setStreaks({ diet: dietStreak, medicine: medicineStreak, overall: overallStreak })
  }

  const isDietComplete = (dietData) => {
    if (!dietData) return false
    return Object.entries(goals).every(([key, goal]) => (dietData[key] || 0) >= goal)
  }

  const isMedicineComplete = (medicineData) => {
    if (!medicineData) return false
    return medicines.every(med => medicineData[med.name]?.[med.time])
  }

  const renderProgressBar = (current, max, label) => (
    <div className="mt-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-blue-700">{label}</span>
        <span className="text-sm font-medium text-blue-700">{current}/{max}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
          style={{ width: `${Math.min((current / max) * 100, 100)}%` }}
        ></div>
      </div>
    </div>
  )

  const renderDietChart = () => {
    const data = healthData[dateString]?.diet
    if (!data) return null

    const chartData = Object.entries(data).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: value,
      goal: goals[key],
    }))

    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Daily Nutrition Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart outerRadius={90} data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} />
            <Radar name="Current" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            <Radar name="Goal" dataKey="goal" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  const renderWeeklyProgress = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(selectedDate)
      d.setDate(d.getDate() - i)
      return d.toISOString().split('T')[0]
    }).reverse()

    const data = last7Days.map(date => {
      const dayData = healthData[date]?.diet || {}
      return {
        name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        ...Object.keys(goals).reduce((acc, key) => ({ ...acc, [key]: dayData[key] || 0 }), {}),
      }
    })

    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Weekly Progress</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {Object.keys(goals).map((key, index) => (
              <Bar key={key} dataKey={key} fill={NUTRIENT_COLORS[key]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }


  const renderMedicineAdherence = () => {
    const adherenceData = medicines.map(med => {
      const takenCount = Object.values(healthData).filter(day => day.medicines?.[med.name]?.[med.time]).length
      const totalDays = Object.keys(healthData).length
      return {
        name: med.name,
        adherence: totalDays > 0 ? (takenCount / totalDays) * 100 : 0,
      }
    })

    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Medicine Adherence</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={adherenceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis unit="%" />
            <Tooltip />
            <Bar dataKey="adherence" fill="#8884d8">
              {adherenceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.adherence > 80 ? '#4CAF50' : '#FF9800'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  const renderStreaks = () => (
    <div className="grid grid-cols-3 gap-4 mt-8">
      {Object.entries(streaks).map(([key, value]) => (
        <div key={key} className="bg-white p-4 rounded-lg shadow">
          <h4 className="text-lg font-semibold mb-2 capitalize">{key} Streak</h4>
          <div className="flex items-center">
            <TrendingUp className="text-green-500 mr-2" />
            <span className="text-2xl font-bold">{value} days</span>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Advanced Health Tracker</h2>

            {!quizCompleted ? (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-semibold mb-4">Initial Health Quiz</h3>
                <form onSubmit={handleQuizSubmit} className="space-y-4">
                  {INITIAL_QUIZ.map((q) => (
                    <div key={q.id}>
                      <label className="block text-sm font-medium text-gray-700">{q.question}</label>
                      <input
                        type={q.type}
                        name={q.id}
                        min={q.min}
                        max={q.max}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                    </div>
                  ))}
                  <h4 className="text-lg font-semibold mt-6 mb-2">Medicines</h4>
                  <div id="medicines-container">
                    
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const container = document.getElementById('medicines-container')
                      const index = container.children.length
                      const medicineDiv = document.createElement('div')
                      medicineDiv.innerHTML = `
                        <div class="flex space-x-2 mb-2">
                          <input
                            type="text"
                            name="medicine-${index}-name"
                            placeholder="Medicine name"
                            required
                            class="flex-grow mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          />
                          <select
                            name="medicine-${index}-time"
                            required
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          >
                            ${MEDICINE_TIMES.map(time => `<option value="${time}">${time}</option>`).join('')}
                          </select>
                        </div>
                      `
                      container.appendChild(medicineDiv)
                    }}
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Add Medicine
                  </button>
                  <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Start Tracking
                  </button>
                </form>
              </motion.div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <button
                      onClick={() => {
                        const newDate = new Date(selectedDate)
                        newDate.setDate(newDate.getDate() - 1)
                        setSelectedDate(newDate)
                      }}
                      className="mr-2 p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      className="p-2 border rounded"
                    />
                    <button
                      onClick={() => {
                        const newDate = new Date(selectedDate)
                        newDate.setDate(newDate.getDate() + 1)
                        setSelectedDate(newDate)
                      }}
                      className="ml-2 p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                {renderStreaks()}

                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-2xl font-semibold mb-4 flex items-center">
                      <Apple className="mr-2" /> Diet Tracker
                    </h3>
                    {healthData[dateString]?.diet && (
                      <div>
                        {Object.entries(healthData[dateString].diet).map(([item, value]) => (
                          <div key={item} className="mb-4">
                            <div className="flex justify-between items-center mb-1">
                              <label className="block text-sm font-medium text-gray-700">
                                {item.charAt(0).toUpperCase() + item.slice(1)}
                              </label>
                              <div>
                                <button
                                  onClick={() => setEditingDietItem(item)}
                                  className="text-blue-500 hover:text-blue-700 mr-2"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => {
                                    const updatedHealthData = { ...healthData }
                                    delete updatedHealthData[dateString].diet[item]
                                    setHealthData(updatedHealthData)
                                  }}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                            {editingDietItem === item ? (
                              <div className="flex items-center">
                                <input
                                  type="number"
                                  value={value}
                                  onChange={(e) => updateHealthItem('diet', item, e.target.value)}
                                  min="0"
                                  max={goals[item]}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                />
                                <button
                                  onClick={() => setEditingDietItem(null)}
                                  className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
                                >
                                  Save
                                </button>
                              </div>
                            ) : (
                              renderProgressBar(value, goals[item], item)
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>

                  
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <h3 className="text-2xl font-semibold mb-4 flex items-center">
                      <Pill className="mr-2" /> Medicine Tracker
                    </h3>
                    {medicines.map((medicine, index) => (
                      <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg">
                        {editingMedicine === index ? (
                          <div className="flex items-center mb-2">
                            <input
                              type="text"
                              value={medicine.name}
                              onChange={(e) => updateMedicine(index, { ...medicine, name: e.target.value })}
                              className="flex-grow p-2 border rounded mr-2"
                            />
                            <select
                              value={medicine.time}
                              onChange={(e) => updateMedicine(index, { ...medicine, time: e.target.value })}
                              className="p-2 border rounded mr-2"
                            >
                              {MEDICINE_TIMES.map((time) => (
                                <option key={time} value={time}>{time}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => setEditingMedicine(null)}
                              className="px-2 py-1 bg-blue-500 text-white rounded"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{medicine.name}</span>
                            <div>
                              <span className="text-sm text-gray-500 mr-2">{medicine.time}</span>
                              <button
                                onClick={() => setEditingMedicine(index)}
                                className="text-blue-500 hover:text-blue-700 mr-2"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => removeMedicine(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <button
                            onClick={() => toggleMedicineTaken(medicine.name, medicine.time)}
                            className={`px-4 py-2 rounded ${
                              healthData[dateString]?.medicines?.[medicine.name]?.[medicine.time]
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-300 text-gray-700'
                            }`}
                          >
                            {healthData[dateString]?.medicines?.[medicine.name]?.[medicine.time] ? 'Taken' : 'Not Taken'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </div>

                {renderDietChart()}
                {renderWeeklyProgress()}
                {renderMedicineAdherence()}

                <div className="mt-8 p-4 bg-yellow-100 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <AlertCircle className="mr-2 text-yellow-500" /> Health Insights
                  </h3>
                  <p className="text-sm text-gray-700">
                    Based on your data, consider increasing your water intake and maintaining a consistent exercise routine. 
                    Your protein intake is on track, great job! Remember to take your evening medicines regularly.
                  </p>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}