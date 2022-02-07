const mongoose = require('mongoose')
const teacherSchema = new mongoose.Schema({
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
	Id_SV: [    
		{
		  type: mongoose.Schema.Types.ObjectId,
		  ref: 'student',
		},
	  ],
})

module.exports = mongoose.model('teacher', teacherSchema)