const studentModel = require('../models/student')
const teacher = require('../models/teacher')
const teacherModel = require('../models/teacher')

//add
//add 1 teacher with many students: 
exports.addOneToManyData = async (req, res) => {
	try {
		const { studentName, studentAge, className, teacherName, teacherAge } = req.body
		const arrStudentId = []
		//create many student 
		for (let i = 0; i < studentName.length; i++) {
			const addStudent = await studentModel.create({ className: className, StudentName: studentName[i], age: studentAge, Id_GV: null })
			arrStudentId.push(addStudent._id)
		}
		console.log(arrStudentId, 'll');
		//create 1 teacher
		const addTeacher = await teacherModel.create({ className: className, teacherName: teacherName, Id_SV: arrStudentId, age: teacherAge })
		const updateArr = []
		//update many students with link of created teacherId
		for (let i = 0; i < arrStudentId.length; i++) {
			const updateStudent = await studentModel.findByIdAndUpdate(arrStudentId[i], { Id_GV: addTeacher._id }, { new: true })
			updateArr.push(updateStudent)
		}
		res.send({ student: updateArr, teacher: addTeacher })
	} catch (error) {
		res.send(error)
	}
}

//update
//update many student from 1 teacher
exports.updateOneManyData = async (req, res) => {
	try {
		const { studentId, teacherId, updateData } = req.body
		const teacherData = await teacherModel.findById(teacherId)
		//find all old link with student
		const arrOldIdSv = teacherData.Id_SV
		//thay vi tri id cu vs id moi
		for (let i = 0; i < arrOldIdSv.length; i++) {
			for (let j = 0; j < studentId.length; j++) {
				if (studentId[j].includes(arrOldIdSv[i])) {
					let temp = arrOldIdSv[i]
					arrOldIdSv[i] = updateData[j]
					updateData[j] = temp
				}
			}
		}

		// let updateTeacher = await teacherModel.findByIdAndUpdate(teacherId, { Id_SV: arrOldIdSv }, { new: true });
		return res.send({ arrOldIdSv, updateTeacher })

	} catch (error) {
		res.send(error)
	}
}


exports.deleteLinkOfTeacher = async (req, res) => {
	try {
		const { studentId, teacherId } = req.body
		const teacherData = await teacherModel.findById(teacherId)
		//find all old link with student
		const arrOldIdSv = teacherData.Id_SV

		for (let i = 0; i < arrOldIdSv.length; i++) {
			for (let j = 0; j < studentId.length; j++) {
				if (studentId[j].includes(arrOldIdSv[i])) {
					arrOldIdSv.splice(i, 1)
				}
			}
		}
		const updateTeacher = await teacherModel.findByIdAndUpdate(teacherId, { Id_SV: arrOldIdSv })
		for (let i in studentId) {
			await studentModel.findByIdAndUpdate(studentId[i], { Id_GV: [] })
		}

		res.send({ updateTeacher })
	} catch (error) {
		res.send(error)
	}
}

exports.addLinkOfTeacher = async (req, res) => {
	try {
		const { studentId, teacherId } = req.body
		const teacherData = await teacherModel.findById(teacherId)
		//find all old link with student
		var arrOldIdSv = teacherData.Id_SV
		for (let i in studentId) {
			arrOldIdSv.push(studentId[i])
		}
		const updateTeacher = await teacherModel.findByIdAndUpdate(teacherId, { Id_SV: arrOldIdSv })
		for (let i in studentId) {
			const updateStudent = await studentModel.findByIdAndUpdate(studentId[i], { Id_GV: teacherId })
		}
		res.send({ updateTeacher })
	} catch (error) {
		res.send(error)
	}
}


///////////////////////////delete
//1-n
exports.deleteOneToManyData = async (req, res) => {
	try {
		const { id } = req.body
		const deleteTeacher = await teacherModel.findByIdAndDelete(id)
		const arrStudentId = deleteTeacher.Id_SV
		if (arrStudentId) {
			const arrDeleteStudent = []
			for (let i = 0; i < arrStudentId.length; i++) {
				const deleteStudent = await studentModel.findByIdAndDelete(arrStudentId[i])
				arrDeleteStudent.push(deleteStudent)
			}
			return res.send({ deleteTeacher, arrDeleteStudent })
		} else {
			return res.send({ deleteTeacher })
		}

	} catch (error) {
		res.send(error)
	}
}

exports.deleteManyDataInOne = async (req, res) => {
	try {
		const { teacherId, studentId } = req.body
		const findTeacher = await teacherModel.findById(teacherId)
		const arrStudentId = findTeacher.Id_SV

		for (let i = 0; i < arrStudentId.length; i++) {
			for (let j = 0; j < studentId.length; j++) {
				if (studentId[j].includes(arrStudentId[i])) {
					arrStudentId.splice(i, 1)
				}
			}
		}

		for (let i in studentId) {
			const deleteStudent = await studentModel.findByIdAndDelete(studentId[i])
		}

		const deleteTeacher = await teacherModel.findByIdAndUpdate(teacherId, { Id_SV: arrStudentId }, { new: true });

		return res.send({ deleteTeacher })
	} catch (error) {
		res.send(error)
	}
}


exports.deleteOneTeacher = async (req, res) => {
	try {
		const { teacherId } = req.body
		const deleteTeacher = await teacherModel.findByIdAndDelete(teacherId)
		if (!findTeacher) {
			return res.send({ message: "Teacher not found" })
		} else {
			const arrStudentId = findTeacher.Id_SV
			for (let i in arrStudentId) {
				const deleteLinkStudent = await studentModel.findByIdAndUpdate(arrStudentId[i], { Id_GV: [] })
			}
			return res.send({ deleteTeacher })
		}

	} catch (error) {
		res.send(error)
	}
}