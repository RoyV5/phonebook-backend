const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
		type: String,
		minLength: [3, 'name must be at least 3 characters long'],
		required: [true, 'name cannot be empty'],
		unique: true,
	},
  number: {
		type: String,
		minLength: [8, 'number must be at least 8 characters long'],
		required: [true, 'number cannot be empty'],
		validate: {
			validator: (num) => {
			return /^\d{2,3}-\d+$/.test(num)
		},
			message: props => `${props.value} is not in a valid format (XXX-123456, or XX-1234567)`
		} 
	}
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)