var models = require('../models/models.js');

// Autoload - factoriza el código si la ruta incluse :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(
		function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			} else {
				next(new Error('No existe quizId= ' + quizId));
			}
		}
	).catch(function(error) {
		next(error);
	});
};

exports.index = function(req, res) {
	if (req.query.search && req.query.search.trim().length != 0) {
		var search = req.query.search.trim();
		search = search.split(' ').join('%');
		search ='%' + search + '%';
		console.log("seach ---->" + search);
		models.Quiz.findAll({where:["pregunta like ?", search]}).then(function(quizes) {
			res.render('quizes', {quizes: quizes});
		});
	} else {
		models.Quiz.findAll().then(function(quizes) {
			res.render('quizes', {quizes: quizes});
		});
	}	
};

exports.show = function(req, res) {
	res.render('quizes/show', {quiz: req.quiz});
};

exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}

	res.render('quizes/answer' , {
		quiz: req.quiz,
		respuesta: resultado
	});
		
}