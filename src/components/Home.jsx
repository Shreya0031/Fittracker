

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'
import { Menu, X, ChevronDown, Instagram, Facebook, Twitter, Youtube, ArrowRight, Dumbbell, Droplet, Apple, Pill, Calendar, Activity, Heart, Zap, Trophy, Users, Star, Clock, Smartphone, Phone, Mail, MapPin, Lock } from 'lucide-react'
import o1 from "../assets/images/a10.jpg"
import o2 from "../assets/images/o7.jpg"
import o5 from "../assets/images/p1.jpg"
import o6 from "../assets/images/p2.jpg"
import o7 from "../assets/images/p3.jpg"
import o8 from "../assets/images/o5.jpg"
import o9 from "../assets/images/a1.jpg"
import o10 from "../assets/images/k4.jpg"
import o11 from "../assets/images/ph2.jpg"

const ParallaxSection = ({ children, speed = 0.5 }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
      target: ref,
      offset: ["start start", "end start"]
    });
    const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]);
  
    return (
      <motion.div ref={ref} style={{ y, position: "absolute", inset: 0 }}>
        {children}
      </motion.div>
    );
  };
const StatCard = ({ label, value, suffix = '' }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="bg-purple-800 p-6 rounded-lg text-center"
    >
      <h3 className="text-2xl font-bold mb-2">
        {inView ? (
          <CountUp end={value} duration={2.5} separator="," />
        ) : (
          '0'
        )}
        {suffix}
      </h3>
      <p className="text-purple-200">{label}</p>
    </motion.div>
  )
}

export default function Home() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [activePlan, setActivePlan] = useState(1)

  const features = [
    { icon: <Dumbbell className="w-8 h-8" />, title: 'Workout Tracking', description: 'Log and analyze your workouts with ease' },
    { icon: <Droplet className="w-8 h-8" />, title: 'Water Tracking', description: 'Stay hydrated with smart reminders' },
    { icon: <Apple className="w-8 h-8" />, title: 'Diet Maintenance', description: 'Track your nutrition and reach your goals' },
    { icon: <Pill className="w-8 h-8" />, title: 'Medicine Record', description: 'Never miss a dose with our medication tracker' },
    { icon: <Calendar className="w-8 h-8" />, title: 'Period Tracker', description: 'Monitor your cycle and predict future dates' },
    // { icon: <Activity className="w-8 h-8" />, title: 'Progress Analytics', description: 'Visualize your fitness journey with detailed charts' },
    // { icon: <Heart className="w-8 h-8" />, title: 'Heart Rate Monitoring', description: 'Keep track of your cardiovascular health' },
    // { icon: <Zap className="w-8 h-8" />, title: 'Sleep Analysis', description: 'Improve your sleep quality with in-depth insights' },
  ]

  const plans = [
    { name: 'Basic', price: '$9.99', features: ['Workout Tracking', 'Water Tracking', 'Basic Analytics'] },
    { name: 'Pro', price: '$19.99', features: ['All Basic Features', 'Diet Maintenance', 'Advanced Analytics', 'Personal Coach'] },
    { name: 'Ultimate', price: '$29.99', features: ['All Pro Features', 'Personalized Meal Plans', 'VIP Support', 'Exclusive Content'] },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white overflow-hidden">
      <motion.div className="fixed top-0 left-0 right-0 h-1 z-50 bg-purple-600 transform-origin-0" style={{ scaleX }} />
      <main className="pt-16">
       
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParallaxSection speed={0.2}>
        <div className="absolute inset-0 z-0">
          <img src={o1} alt="Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-indigo-900 opacity-60"></div>
        </div>
      </ParallaxSection>

  
      <div className="container mx-auto px-4 z-10 text-white text-center relative">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
        >
          Revolutionize Your<br />Fitness Journey
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto"
        >
          FitTrack: The ultimate fitness companion that adapts to your unique needs.
          Track, analyze, and optimize your health like never before.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6"
        >
          <a
            href="#features"
            className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-purple-100 transition duration-300 transform hover:scale-105"
          >
            Discover Features
          </a>
          <a
            href="#pricing"
            className="bg-transparent border-2 border-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-purple-600 transition duration-300 transform hover:scale-105"
          >
            Start Your Journey
          </a>
        </motion.div>
      </div>

     
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-12 h-12 text-white" />
      </div>
    </section>

        <section id="features" className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-center mb-16"
            >
              Powerful Features to Transform Your Fitness
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`bg-white p-6 rounded-lg shadow-md transition duration-300 transform hover:scale-105 ${
                      activeFeature === index ? 'border-2 border-purple-500' : ''
                    }`}
                    onClick={() => setActiveFeature(index)}
                  >
                    <div className="flex items-center mb-4">
                      <div className="bg-purple-100 p-3 rounded-full mr-4">{feature.icon}</div>
                      <h3 className="text-xl font-semibold">{feature.title}</h3>
                    </div>
                    <p className="text-gray-600">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
              <div className="relative h-[600px]">
                <motion.div
                  key={activeFeature}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <img
                    src={o1}
                    alt={features[activeFeature].title}
                    className="max-w-full max-h-full rounded-lg shadow-2xl"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="md:w-1/2 mb-12 md:mb-0"
              >
                <h2 className="text-4xl font-bold mb-6">About FitTrack</h2>
                <p className="text-xl text-gray-600 mb-8">
                  FitTrack was born from a passion for health and a vision of accessible fitness for all. Our team of fitness
                  enthusiasts and tech experts came together to create a comprehensive solution that empowers individuals on
                  their wellness journey.
                </p>
                <ul className="space-y-4">
                  {[
                    'Founded in 2020',
                    'Over 1 million active users',
                    'Partnered with 500+ fitness professionals',
                    'Continuously evolving with user feedback',
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center text-gray-700"
                    >
                      <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="md:w-1/2 relative"
              >
                <img
                  src={o2}
                  alt="About FitTrack"
                  className="rounded-lg shadow-2xl"
                />
                <div className="absolute -bottom-10 -left-10 bg-purple-600 text-white p-8 rounded-lg shadow-xl">
                  <p className="text-3xl font-bold">1M+</p>
                  <p className="text-xl">Active Users</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="stats" className="py-20 bg-purple-900 text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16">Our Impact in Numbers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: 'Active Users', value: 1000000, suffix: '+' },
                { label: 'Workouts Tracked', value: 50000000, suffix: '+' },
                { label: 'Weight Lost (lbs)', value: 2000000, suffix: '+' },
                { label: 'App Downloads', value: 5000000, suffix: '+' },
              ].map((stat, index) => (
                <StatCard key={index} label={stat.label} value={stat.value} suffix={stat.suffix} />
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-center mb-16"
            >
              Success Stories
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[
                {
                  name: 'Sarah Johnson',
                  role: 'Fitness Enthusiast',
                  quote: 'FitTrack has completely transformed my fitness journey. The comprehensive tracking features and intuitive interface make it a joy to use every day.',
                  image: o5,
                  achievement: 'Lost 30 lbs in 6 months',
                },
                {
                  name: 'Michael Chen',
                  role: 'Marathon Runner',
                  quote: 'As a serious runner, I need detailed analytics. FitTrack provides everything I need to optimize my training and reach new personal bests.',
                  image: o6,
                  achievement: 'Improved marathon time by 30 minutes',
                },
                {
                  name: 'Emily Rodriguez',
                  role: 'Yoga Instructor',
                  quote: 'The meditation and mindfulness features in FitTrack have been a game-changer for my practice. It\'s not just about physical fitness, but overall well-being.',
                  image: o7,
                  achievement: 'Grew online yoga community by 500%',
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-8 rounded-lg shadow-md"
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                  <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full inline-block">
                    {testimonial.achievement}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-purple-900 text-white overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-center mb-16"
            >
              Join Our Thriving Fitness Community
            </motion.h2>
            <div className="flex flex-col md:flex-row items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="md:w-1/2 mb-12 md:mb-0"
              >
                <h3 className="text-3xl font-bold mb-6">Connect, Share, and Grow Together</h3>
                <p className="text-xl mb-8">
                  Join a community of like-minded individuals who are passionate about fitness and personal growth. Share your progress, get inspired, and motivate others on their journey.
                </p>
                <a
                  href="#"
                  className="inline-block bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-purple-100 transition duration-300 transform hover:scale-105"
                >
                  Join Our Community
                </a>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="md:w-1/2 grid grid-cols-3 gap-4"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
                  <motion.img
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    src={`/placeholder.svg?height=150&width=150&text=Community ${index}`}
                    alt={`Community ${index}`}
                    className="rounded-lg shadow-md hover:scale-105 transition duration-300"
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-center mb-16"
            >
              Choose Your Perfect Plan
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`bg-white p-8 rounded-lg shadow-md border-2 ${
                    index === activePlan ? 'border-purple-500 transform scale-105' : 'border-gray-200'
                  }`}
                  onMouseEnter={() => setActivePlan(index)}
                >
                  <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                  <p className="text-4xl font-bold mb-6">{plan.price}<span className="text-base font-normal">/month</span></p>
                  <ul className="mb-8 space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 rounded-full font-semibold transition duration-300 ${
                    index === activePlan
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}>
                    Choose Plan
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="blog" className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-center mb-16"
            >
              Latest from Our Blog
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: '10 Tips for Effective Weight Loss', category: 'Nutrition', image: o8 },
                { title: 'The Ultimate Full-Body Workout Routine', category: 'Fitness', image: o9 },
                { title: 'Mindfulness and Its Impact on Fitness', category: 'Wellness', image: o10 },
              ].map((post, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <span className="text-purple-600 font-semibold text-sm">{post.category}</span>
                    <h3 className="text-xl font-bold mt-2 mb-4">{post.title}</h3>
                    <a href="#" className="text-purple-600 font-semibold hover:underline">Read More</a>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-12">
              <a href="#" className="inline-block bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition duration-300">
                View All Posts
              </a>
            </div>
          </div>
        </section>

        <section id="app-preview" className="py-20 bg-white overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-center mb-16"
            >
              Experience FitTrack in Action
            </motion.h2>
            <div className="flex flex-col md:flex-row items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="md:w-1/2 mb-12 md:mb-0"
              >
                <h3 className="text-3xl font-bold mb-6">Intuitive Design, Powerful Features</h3>
                <p className="text-xl text-gray-600 mb-8">
                  Our user-friendly interface puts all the tools you need at your fingertips. From workout tracking to nutrition analysis, FitTrack makes managing your fitness journey a breeze.
                </p>
                <ul className="space-y-4">
                  {[
                    { icon: <Smartphone className="w-6 h-6 text-purple-600" />, text: 'Available on iOS and Android' },
                    { icon: <Zap className="w-6 h-6 text-purple-600" />, text: 'Sync across all your devices' },
                    { icon: <Users className="w-6 h-6 text-purple-600" />, text: 'Connect with friends and trainers' },
                    { icon: <Lock className="w-6 h-6 text-purple-600" />, text: 'Bank-level data security' },
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center text-gray-700"
                    >
                      {item.icon}
                      <span className="ml-2">{item.text}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="md:w-1/2 relative"
              >
                <img
                  src={o11}
                  alt="FitTrack App Preview"
                  className="rounded-3xl shadow-2xl mx-auto"
                />
                <div className="absolute -top-10 -right-10 bg-yellow-400 text-gray-900 p-4 rounded-full shadow-xl">
                  <Star className="w-8 h-8" />
                  <p className="font-bold">4.9 Rating</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-center mb-16"
            >
              Get in Touch
            </motion.h2>
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 bg-purple-600 text-white p-8">
                  <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
                  <p className="mb-4">Fill out the form and our team will get back to you within 24 hours.</p>
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <Phone className="w-6 h-6 mr-2" />
                      <span>+1 (555) 123-4567</span>
                    </li>
                    <li className="flex items-center">
                      <Mail className="w-6 h-6 mr-2" />
                      <span>support@fittrack.com</span>
                    </li>
                    <li className="flex items-center">
                      <MapPin className="w-6 h-6 mr-2" />
                      <span>123 Fitness Street, Healthy City, 12345</span>
                    </li>
                  </ul>
                </div>
                <div className="md:w-1/2 p-8">
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                      <input type="text" id="name" name="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <input type="email" id="email" name="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50" />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                      <textarea id="message" name="message" rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-purple-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-purple-700 transition duration-300">Send Message</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-purple-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold mb-8"
            >
              Ready to Transform Your Fitness Journey?
            </motion.h2>
            <p className="text-xl mb-12 max-w-2xl mx-auto">
              Join FitTrack today and take the first step towards a healthier, stronger you. Start your free trial now and experience the difference!
            </p>
            <motion.a
              href="#"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-purple-100 transition duration-300 transform hover:scale-105"
            >
              Start Your Free Trial
            </motion.a>
          </div>
        </section>
      </main>    
    </div>
  )};