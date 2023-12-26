const Workout = require('../models/workoutModel')
const mongoose = require('mongoose')

// get all workouts
const getWorkouts = async (req, res) => {
  const user_id = req.user._id
  const workouts = await Workout.find({ user_id }).sort({ createdAt: -1 })
  res.json(workouts)
}

// get a single workout
const getWorkout = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.json({ error: 'No such workout' })
  }

  const workout = await Workout.findById(id)

  if (!workout) {
    return res.json({ error: 'No such workout' })
  }

  res.json(workout)
}


// create new workout
const createWorkout = async (req, res) => {
  const { title, load, reps } = req.body

  // add doc to db
  try {
    const user_id = req.user._id
    await Workout.create({ title, load, reps, user_id })
    res.status(200).json("Workout added")
  } catch (error) {
    if (error.errors.title) {
      res.status(400).json({ error: "Please add a title" })
    }
    else if (error.errors.load) {
      res.status(400).json({ error: "please make sure that load is between 0 and 1000" })
    }
    else if (error.errors.reps) {
      res.status(400).json({ error: "please make sure that reps are between 1 and 300" })
    }
    else {
      res.status(400).json({ error: "Something is wrong" })
    }
  }
}

// delete a workout
const deleteWorkout = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.json({ error: 'No such workout' })
  }

  const workout = await Workout.findById({ _id: id }).deleteOne()

  if (!workout) {
    return res.json({ error: 'No such workout' })
  }

  res.json(workout)
}

// update a workout
const updateWorkout = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.json({ error: 'No such workout' })
  }

  const updatedFields = { ...req.body }

  if (!updatedFields.title) {
    return res.status(400).json({ error: "Please add a title" })
  }
  else if (!updatedFields.load || updatedFields.load < 0 || updatedFields.load > 1000) {
    return res.status(400).json({ error: "please make sure that load is between 0 and 1000" })
  }
  else if (!updatedFields.reps || updatedFields.reps < 1 || updatedFields.reps > 300) {
    return res.status(400).json({ error: "please make sure that reps are between 1 and 300" })
  }

  const workout = await Workout.findById({ _id: id }).updateOne(updatedFields)

  if (!workout) {
    return res.json({ error: 'No such workout' })
  }

  res.json(workout)
}


module.exports = {
  getWorkouts,
  getWorkout,
  createWorkout,
  deleteWorkout,
  updateWorkout
}