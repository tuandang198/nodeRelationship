const studentModel = require('../models/student')
const teacher = require('../models/teacher')
const teacherModel = require('../models/teacher')

//n-n
//add data 1, data 2 va link 
exports.addManyToManyData = async (req, res) => {
	try {
		console.log('1');
		const { studentName, studentAge, className, teacherName, teacherAge } = req.body
		const arrStudentId = []
		const arrTeacherId = []
		for (let i = 0; i < studentName.length; i++) {
			const addStudent = await studentModel.create({ className: className, name: studentName[i], age: studentAge, Id_GV: null })
			console.log(addStudent._id, 'lll');
			arrStudentId.push(addStudent._id)
		}
		console.log(arrStudentId, 'student id');
		for (let i = 0; i < teacherName.length; i++) {
			const addTeacher = await teacherModel.create({ className: className, teacherName: teacherName[i], age: teacherAge[i], Id_SV: arrStudentId })
			arrTeacherId.push(addTeacher._id)
		}

		const updateArr = []
		console.log(arrTeacherId, 'teacher');
		for (let i = 0; i < arrStudentId.length; i++) {
			const updateStudent = await studentModel.findByIdAndUpdate(arrStudentId[i], { Id_GV: arrTeacherId }, { new: true })
			updateArr.push(updateStudent)
		}
		res.send({ student: updateArr, teacher: addTeacher })
	} catch (error) {
		res.send(error)
	}
}
//add data va link voi data cu
exports.addManyStudentWithLink = async (req, res) => {
	try {
		const { studentName, studentAge, className, teacherId } = req.body
		const arrNewStudentId = []
		console.log('1');
		for (let i in studentName) {
			const addStudent = await studentModel.create({ name: studentName[i], age: studentAge, className })
			arrNewStudentId.push(addStudent._id)
		}
		console.log(arrNewStudentId, 'new student id');
		const updateTeacher = await teacherModel.updateMany(
			{_id: {$in: teacherId}},
			{$addToSet: {Id_SV: arrNewStudentId}}
		)
		// for (let i in teacherId) {
		// 	const findTeacher = await teacherModel.findById(teacherId[i])
		// 	const oldStudentId = findTeacher.Id_SV
		// 	const newStudentId = oldStudentId.concat(arrNewStudentId)
		// 	console.log(newStudentId, 'id hoc sinh moi');
		// 	const updateTeacher = await teacherModel.findByIdAndUpdate(teacherId[i], { Id_SV: newStudentId }, { new: true })
		// 	console.log(updateTeacher);
		// }
		res.send({ student: "yooooo" })
	} catch (error) {
		res.send(error)
	}
}
//add nhieu student binh thuong
exports.addManyStudentWithNoLink = async (req, res) => {
	try {
		const { studentName, studentAge, className } = req.body
		console.log('1');
		for (let i in studentName) {
			const addStudent = await studentModel.create({ name: studentName[i], age: studentAge, className })
		}
		res.send({ student: "yooooo" })
	} catch (error) {
		res.send(error)
	}
}

//update
//update them link id
exports.updateAddManyLink = async (req, res) => {
	try {
		const { studentId, idTeacher } = req.body
		//replace between studentId of teacher with updateId
		//update teacher
		const pushIdTeacher = await teacherModel.updateMany(
			{ _id: { $in: idTeacher } },
			{
				$addToSet: { Id_SV: studentId }
			}
		)
		const pushIdStudent = await studentModel.updateMany(
			{ _id: { $in: studentId }},
			{$addToSet: {Id_GV: idTeacher}}
		)
		res.send({ message: "add link" })
	} catch (error) {
		res.send(error)
	}
}
//delete student from teacher
//update xoa link id
exports.updateDeleteManyLink = async (req, res) => {
	try {
		const { studentId, idTeacher } = req.body
		console.log('1');
		const updateTeacher = await teacherModel.updateMany(
			{ _id: { $in: idTeacher } },
			{ $pull: { Id_SV: { $in: studentId } } }
		)
		console.log(updateTeacher, '1');
		console.log('2');

		const updateStudent = await studentModel.updateMany(
			{ _id: { $in: studentId } },
			{ $pull: { Id_GV: { $in: idTeacher } } }
		)
		console.log(updateStudent, '2');
		res.send({ student: "success" })
	} catch (error) {
		res.send(error)
	}
}
//replace many new student with old student
//update cap nhat nhieu id student
exports.updateNewManyLink = async (req, res) => {
	try {
		const { studentId, idTeacher, updateId } = req.body
		//replace between studentId of teacher with updateId
		//update teacher
		const pushIdTeacher = await teacherModel.updateMany(
			{ _id: { $in: idTeacher } },
			{
				$addToSet: { Id_SV: updateId }
			}
		)
		const updateTeacher = await teacherModel.updateMany(
			{ _id: { $in: idTeacher } },
			{
				$pull: { Id_SV: { $in: studentId } }
			}
		)
		//update new student
		const updateNewStudent = await studentModel.updateMany(
			{ _id: { $in: updateId } },
			{ $addToSet: { Id_GV: idTeacher } }
		)
		//update old student
		const updateOldStudent = await studentModel.updateMany(
			{ _id: { $in: studentId } },
			{ $pull: { Id_GV: { $in: idTeacher } } }
		)

		res.send({ message: "update" })
	} catch (error) {
		res.send(error)
	}
}
//delete
//xoa nhieu student va xoa lien ket teacher
exports.deleteManyAndDeleteLink = async (req, res) => {
	try {
		const { studentId } = req.body
		for (let i in studentId) {
			const findStudent = await studentModel.findByIdAndDelete(studentId[i])
			const idTeacher = findStudent.Id_GV
			console.log(idTeacher, 'id teacher');
			const updateTeacher = await teacherModel.updateMany(
				{ _id: { $in: idTeacher } },
				{ $pull: { Id_SV: { $in: studentId[i] } } }
			)
		}
		res.send({ student: "success" })
	} catch (error) {
		res.send(error)
	}
}
//xoa nhieu student va xoa teacher lien quan
exports.deleteManyAndDeleteRelative = async (req, res) => {
	try {
		const { studentId } = req.body
		for (let i in studentId) {
			//tim student
			const findStudent = await studentModel.findById(studentId[i])
			const idTeacher = findStudent.Id_GV
			console.log(idTeacher, 'id giao vien lien quan');
			const findTeacher = await teacherModel.find({ _id: { $in: idTeacher } })
			console.log(findTeacher, 'cac giao vien lien quan');
			for (let j in findTeacher) {
				console.log(findTeacher[j].Id_SV, 'arr id sv cu');
				//update loai bo giao vien khoi sinh vien cu
				await studentModel.updateMany(
					{ _id: { $in: findTeacher[j].Id_SV } },
					{ $pull: { Id_GV: findTeacher[j]._id } }
				)
			}
			//xoa giao vien lien quan
			const deleteTeacher = await teacherModel.deleteMany({ _id: idTeacher })
			console.log(deleteTeacher, 'deleteTeacher');
		}
		res.send({ success: "success" })
	} catch (error) {
		res.send({ error: error })
	}
}
//xoa nhieu teacher va xoa lien ket
exports.deleteManyTeacherAndDeleteLink = async (req, res) => {
	try {
		const { idTeacher } = req.body
		for (let i in idTeacher) {
			const findTeacher = await teacherModel.findByIdAndDelete(idTeacher[i])
			const idStudent = findTeacher.Id_SV
			console.log(idStudent, 'id teacher');
			const updateStudent = await studentModel.updateMany(
				{ _id: { $in: idStudent } },
				{ $pull: { Id_GV: { $in: idTeacher[i] } } }
			)
		}
		res.send({ student: "success" })
	} catch (error) {
		res.send(error)
	}
}