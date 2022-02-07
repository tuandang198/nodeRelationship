const controller = require('../controllers/studentController')
const oneToOneController = require('../controllers/oneToOne')
const manyToManyController = require('../controllers/manyToMany')
const oneToManyController = require('../controllers/oneToMany')
const route = (app) => {
	
	app.get('/dataStudent', controller.getStudentData)
	app.get('/dataTeacher', controller.getTeacherData)

	//one - one 
	app.delete('/data/:id', oneToOneController.deleteData)
	app.delete('/deleteLinkData', oneToOneController.deleteLinkData)
	app.delete('/deleteBothData', oneToOneController.deleteBothData)
	
	app.post('/data', oneToOneController.addOneData)
	app.post('/addTeacherWithLink', oneToOneController.addTeacherWithLink)
	app.post('/addTeacher', oneToOneController.addTeacher)

	app.put('/updateOne', oneToOneController.updateOneData)
	
	//one-many
	//add
	app.post('/addDataOneToMany', oneToManyController.addOneToManyData)
	//delete
	app.delete('/deleteManyDataInOne', oneToManyController.deleteManyDataInOne)
	app.delete('/deleteDataOneToMany', oneToManyController.deleteOneToManyData)
	app.delete('/deleteOneTeacher', oneToManyController.deleteOneTeacher)
	//update
	app.put('/updateOneManyData', oneToManyController.updateOneManyData)
	app.put('/deleteLinkOfTeacher', oneToManyController.deleteLinkOfTeacher)
	app.put('/addLinkOfTeacher', oneToManyController.addLinkOfTeacher)

	//many-many
	//add
	app.post('/addManyToManyData', manyToManyController.addManyToManyData)
	app.post('/addManyStudentWithLink', manyToManyController.addManyStudentWithLink)
	app.post('/addManyStudentWithNoLink', manyToManyController.addManyStudentWithNoLink)
	//delete
	app.delete('/deleteManyAndDeleteLink', manyToManyController.deleteManyAndDeleteLink)
	app.delete('/deleteManyAndDeleteRelative', manyToManyController.deleteManyAndDeleteRelative)
	app.delete('/deleteManyTeacherAndDeleteLink', manyToManyController.deleteManyTeacherAndDeleteLink)
	//update
	app.put('/updateAddManyLink', manyToManyController.updateAddManyLink)
	app.put('/updateDeleteManyLink', manyToManyController.updateDeleteManyLink)
	app.put('/updateNewManyLink', manyToManyController.updateNewManyLink)
}
module.exports = route