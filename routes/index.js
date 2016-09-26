var express = require('express');
var app = express.Router();
var mongoose = require('mongoose');
var Movie = require('../models/movie');
var moment = require('moment');
// var bodyParser = require('body-parser');
var _ = require('underscore');

mongoose.connect('mongodb://localhost/movie')

console.log('---------------------', __dirname);  

// 首页
app.get('/', function(req, res, next) {

	Movie.fetch(function(err, movies) {
		if (err) {
			console.log(err);
		};

		res.render('index', {
			title: 'movie 首页',
			movies: movies
		});

	})
});

// 详情页
app.get('/detail/:id', function(req, res, next) {
	var id = req.params.id;

	Movie.findById(id, function(err, movie) {
		res.render('detail', {
			title: 'movie 详情页 ' +  id,
			movie: movie
		})
	})
});

// 后台页
app.get('/admin', function(req, res, next) {

	Movie.fetch(function(err, movies) {
		if (err) {
			console.log(err);
		};

		res.render('admin', {
			title: '后台录入页',
			movies: movies
		});

	})
});

// 更新电影
app.get('/admin/update/:id', function(req, res) {
	var id = req.params.id;

	console.log('id', id);

	if (id) {
		Movie.findById(id, function(err, movie) {
			console.log('movie', JSON.stringify(movie));
			res.render('add', {
				title: 'movie 更新',
				movie: movie
			})
		})
	};

})

// 后台post的请求
app.post('/admin/movie/new', function(req, res) {
	console.log('req', JSON.stringify(req.body.movie));
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;

	if (id) {
		Movie.findById(id, function(err, movie) {
			if (err) {
				console.log(err);
			};
			_movie = _.extend(movie, movieObj);

			console.log('update db, obj = ', JSON.stringify(_movie));

			_movie.save(function(err, movie) {
				if (err) {
					console.log(err);
				};

				// 重定向
				res.redirect('/detail/' + movie.id);
			})
		})
	} else {
		_movie = new Movie({
			director: movieObj.director,
			title: movieObj.title,
			language: movieObj.language,
			country: movieObj.country,
			summary: movieObj.summary,
			falsh: movieObj.falsh,
			poster: movieObj.poster,
			year: movieObj.year
		})

		console.log('add db, obj = ', JSON.stringify(_movie));


		_movie.save(function(err, movie) {
			if (err) {
				console.log(err);
			};

			// 重定向
			res.redirect('/detail/' + movie.id);
		})
	}

})

// 后台添加页
app.get('/admin/add', function(req, res, next) {
	res.render('add', {
		title: 'movie 添加',
		movie: {
			// title: '夏洛特烦恼',
			// director: '闫非 / 彭大魔',
	  //   	country: '中国',
	  //   	language: '中文',
			// year: '2015',
	  //   	summary: '在学生时代的初恋秋雅（王智 饰）的婚礼上，毕业后吃软饭靠老婆养的夏洛（沈腾 饰）假充大款，出尽其丑，中间还被老婆马冬梅（马丽 饰）戳穿暴捶。混乱之中，夏洛意外穿越时空，回到了1997年的学生时代的课堂里。他懵懵懂懂，以为是场真实感极强的梦，于是痛揍王老师，强吻秋雅，还尝试跳楼让自己醒来。当受伤的他从病床上苏醒时，他意识到自己真的穿越了时空。既然有机会重新来过，那不如好好折腾一回。他勇敢追求秋雅、奚落优等生袁华（尹正 饰）、拒绝马冬梅的死缠烂打。后来夏洛凭借“创作”朴树、窦唯等人的成名曲而进入娱乐圈。 他的人生发生翻天覆地的巨变，但是内心某个地方却越来越感到空虚……',
			// poster: 'http://img4.cache.netease.com/house/2015/9/24/20150924190154ab0d6_500.jpg'
		}
	})
});

// 后台删除
app.delete('/admin/list', function(req, res) {
	var id = req.query.id;

	console.log('in delete, id =', id);

	if (id) {
		Movie.remove({_id: id}, function(err, movie) {
			if (err) {
				console.log(err);
			} else {
				res.json({ret: 0});
			}
		})
	};
})

module.exports = app;