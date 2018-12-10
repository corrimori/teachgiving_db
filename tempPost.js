// REGISTER a user
router.post('/', (req, res, next) => {
	console.log('/signup was hit');
	console.log('req body', req.body);
	res.contentType('application/json');
	if (!req.body.email || !req.body.password || !req.body.name) {
		res.statusCode = 400;
		res.send('{"result": "failed", "message": "email, password, and name are required."}');
		return;
	}
	let email = req.body.email;
	let name = req.body.name;
	let password = req.body.password;
	let image_url = req.body.image_url
	//check the email doesn't already exist in users table
	knex('users')
		.where('email', req.body.email)
		.first()
		.then((user) => {
			if(user) {
				res.statusCode = 409;
				res.send('{"result": "failed", "message": "Oops that email is already used"}');
				return;
			}

			// hash the password
			var hashed = bcrypt.hashSync(req.body.password, 8);

			// create new user record with the email + hashed password
			knex('users')
				.insert({
					name: name,
					email: email,
					image_url: image_url,
					hashed_password: hashed,
				})
				.returning('*')
				.then((result) => {
					console.log('OK', result);
					res.statusCode = 200;
					res.send(`{"result": "ok", "user": ${JSON.stringify(result)}}`);
					// res.redirect('/signup1');
				});
		})
		.catch((err) => {
			next(err);
			console.log(err, 'error');
		});
});