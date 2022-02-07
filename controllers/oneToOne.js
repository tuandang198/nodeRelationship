const studentModel = require('../models/student')
const teacher = require('../models/teacher')
const teacherModel = require('../models/teacher')
//add
//them ca teacher, student va tao lien ket ca hai
exports.addOneData = async (req, res) => {
	try {
		const { studentName, studentAge, className, teacherName, teacherAge } = req.body
		// console.log(req.body);
		const addStudent = await studentModel.create({ className: className, name: studentName, age: studentAge, Id_GV: [] })
		const Id_SV = addStudent._id
		const addTeacher = await teacherModel.create({ className: className, teacherName: teacherName, Id_SV: addStudent._id, age: teacherAge })
		const Id_GV = addTeacher._id
		console.log(Id_GV, 'lll');
		const updateStudent = await studentModel.findByIdAndUpdate(Id_SV, { Id_GV: addTeacher }, { new: true })
		res.send({ student: updateStudent, teacher: addTeacher })
	} catch (error) {
		res.send(error)
	}
}

//them teacher va them lien ket,neu hoc sinh co lien ket voi giao vien cu se huy lien ket
exports.addTeacherWithLink = async (req, res) => {
	try {
		const { studentId, className, teacherName, teacherAge } = req.body
		const addTeacher = await teacherModel.create({ className: className, teacherName: teacherName, age: teacherAge, Id_SV: studentId })
		const findStudent = await studentModel.findById(studentId)
		console.log("vao 1");
		//neu student dang co teacher => bo lien ket
		if(findStudent.Id_GV.length > 0){
			console.log("vao 2");
			const updateStudent = await studentModel.findByIdAndUpdate(studentId,{ Id_GV: addTeacher._id})
			// user.set('Id_SV', undefined, {strict: false} );
			const deleteIdSV = await teacherModel.findByIdAndUpdate(findStudent.Id_GV,{ $unset: { Id_SV: "" } })
			return res.send({ student: updateStudent, teacher: deleteIdSV })

		} else{
			console.log("vao 3");
			var updateStudent = await studentModel.findByIdAndUpdate(studentId, {Id_GV: addTeacher._id})
			return res.send({ student: updateStudent, teacher: addTeacher })
		}
	} catch (error) {
		res.send(error)
	}
}
exports.addTeacher = async (req, res) => {
	try {
		const { className, teacherName, teacherAge } = req.body
		const addTeacher = await teacherModel.create({ className: className, teacherName: teacherName, age: teacherAge })
		res.send({ student: addTeacher})
	} catch (error) {
		res.send({ error: error})
	}
}
exports.testFunction = async(req, res) => {
	try {
		const {teacherId} = req.body
		const deleteIdSV = await teacherModel.findByIdAndUpdate(teacherId,{ $unset: { Id_SV: "" } })
		return res.send({deleteIdSV})
	} catch (error) {
		res.send({ error: error})
	}
}
//update 
//update lien ket, check neu co id cu => bo lien ket
exports.updateOneData = async (req, res) => {
	try {
		const { studentId, teacherId } = req.body
		const updateTeacher = await teacherModel.findByIdAndUpdate(teacherId, { Id_SV: studentId })
		const updateStudent = await studentModel.findByIdAndUpdate(studentId, { Id_GV: teacherId })
		if(updateTeacher.Id_SV.length>0){
			var updateLinkOfTeacher = await studentModel.findByIdAndUpdate(updateTeacher.Id_SV,{Id_GV: []})
		}
		if(updateStudent.Id_GV.length>0){
			var updateLinkOfStudent = await teacherModel.findByIdAndUpdate(updateStudent.Id_GV,{Id_SV: []})
		}
		res.send({updateTeacher, updateStudent,updateLinkOfTeacher,updateLinkOfStudent})
	} catch (error) {
		res.send(error)
	}
}
//delete link 
exports.deleteLinkOfStudent = async (req, res, next) =>{
	try {
		const { teacherId } = req.body
		var deleteLinkOfStudent = await teacherModel.findByIdAndUpdate(teacherId,{Id_SV: []})
		var updateLinkOfStudent = await studentModel.findByIdAndUpdate(deleteLinkOfStudent.Id_SV,{Id_GV: []})
		res.send({deleteLinkOfStudent, updateLinkOfStudent})
	} catch (error) {
		res.send({ error: error })
	}
}

//delete
//xoa sinh vien
exports.deleteData = async (req, res, next) => {
	try {
		//xoa hoc sinh
		const { studentId } = req.body
		const deleteData = await studentModel.findByIdAndDelete(studentId)
		if(deleteData.Id_GV.length > 0){
			var deleteLinkOfStudent = await teacherModel.findByIdAndUpdate(deleteData.Id_GV,{Id_SV: []})
		}
		res.send({ deleteData,deleteLinkOfStudent })
	} catch (error) {
		res.send({ error: error })
	}
}
//xoa sinh vien thong qua id giao vien
exports.deleteLinkData = async (req, res, next) => {
	try {
		//xoa hoc sinh
		const { teacherId } = req.body
		const findTeacher = await teacherModel.findByIdAndUpdate(teacherId,{Id_SV: []})
		const studentId = findTeacher.Id_SV
		const deleteData = await studentModel.findByIdAndDelete(studentId)
		
		res.send({ deleteData,deleteLinkOfStudent })
	} catch (error) {
		res.send({ error: error })
	}
}
//xoa ca 2
exports.deleteBothData = async (req, res, next) => {
	try {
		//xoa hoc sinh
		const { studentId } = req.body
		const deleteData = await studentModel.findByIdAndDelete(studentId)
		if(deleteData.Id_GV.length > 0){
			var deleteLinkOfStudent = await teacherModel.findByIdAndDelete(deleteData.Id_GV)
		}
		res.send({ deleteData,deleteLinkOfStudent })
	} catch (error) {
		res.send({ error: error })
	}
}