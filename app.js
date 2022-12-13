const express = require('express');
const morgan = require('morgan');
const path = require('path');
// const bodyParser = require('body-parser')
const app = express();


// settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true  }))
app.use(express.json())

app.use(express.static(path.join(__dirname, 'public')));
// routes
app.use(require('./routes'));

// static files
// app.use(express.urlencoded({}));
// app.use(express.json());



// listening the Server
app.listen(app.get('port'), () => {
  console.log('Server on port', app.get('port'));
});
