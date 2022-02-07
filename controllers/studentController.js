const studentModel = require('../models/student')
const teacher = require('../models/teacher')
const teacherModel = require('../models/teacher')

// get 
exports.getTeacherData = async (req, res) => {
	try {
		const teacherData = await teacherModel.find()
		// .populate({
		// 	path: 'Id_SV',
		// 	select: "-__v"
		// })
		res.send({ teacherData })
	} catch (error) {
		res.send(error)
	}
}

exports.getStudentData = async (req, res) => {
	try {

		const studentData = await studentModel.find()
		// .populate({
		// 	path: 'Id_GV'
		// })
		res.send({ studentData })
	} catch (error) {
		res.send(error)
	}
}