const mongoose = require('mongoose')
const studentSchema = new mongoose.Schema({
	name:{
		type: 'string',
	},
	// posts:[
	// 	{type: mongoose.Schema.Types.ObjectId, ref:"Post"}
	// ],
	age:{
		type: Number,
	},
	className:{
		type: 'string'
	},
	teacherName:{
		type: 'string',
	},
	Id_GV: [    
		{
		  type: mongoose.Schema.Types.ObjectId,
		  ref: 'teacher',
		},
	  ],
	
})

module.exports = mongoose.model('student', studentSchema)