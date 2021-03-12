/*  1) создать нового пользователя, создать ему токены,
    добавить пользователя и токены в бд,
    проверить добавление данных
    2) сделать get запрос к favourites созданного пользователя,
      ответ должен быть таким:
      status(200)
      {
        message: 'List of favourites is empty',
        count: '0',
        next: null,
        previous: null,
        results: []
      }
    3) сделать post запрос к favourites созданного пользователя,
    со следующими данными:
      title: req.body.title,
      genre: req.body.genre,
      released: req.body.released,
      runtime: req.body.runtime,
      imdbRating: req.body.imdbRating,
      plot: req.body.plot,
      poster: req.body.poster,
      country: req.body.country,
      imdbID: req.body.imdbID,
      year: req.body.year
      3.1) без всех полей, ответ должен быть таким:
        status(400)
        {
          message: 'Field title is empty'
        }
      3.2) без одного из полей, допустим plot
      ответ должен быть таким:
        status(400)
        {
          message: 'Field plot is empty'
        }
      3.3) со всеми полями, ответ должен быть таким:
        status(200)
        {
          status: true
        }
      3.4) четыре раза повторить запрос из п. 3.3 с другими полями,
        ответ должен быть аналогичным
      3.5) повторить запрос из п. 3.3 с теми же полями,
        ответ должен быть таким:
        status(409)
        {
          message: 'This film has alredy in cathegory favourites'
        }
    4) сделать get запрос к favourites созданного пользователя,
      4.1) без параметров
        ответ должен быть таким:
        status(200)
        {
          count: '5',
          next: null,
          previous: null,
          results: [...]
        }
        res.body.results.length = 5
      4.2) с параметрами ?page=0&limit=1
        ответ должен быть таким:
        status(400)
        {
          message: 'The selected page is out of range (less than 1). Select a page from 1 to 1'
        }
      4.3) с параметрами ?page=1&limit=0
        ответ должен быть таким:
        status(400)
        {
          message: 'The selected limit is less than 1'
        }
      4.4) с параметрами ?page=4&limit=2
        ответ должен быть таким:
        status(400)
        {
          message: 'The selected page is out of range (more than 3). Select a page from 1 to 3'
        }
      4.5) с параметрами ?page=1&limit=2
        ответ должен быть таким:
        status(200)
        {
          count: '5',
          next: 'https://filmapi0.herokuapp.com/api/favourites/?page=2&limit=2',
          previous: null,
          results: [...]
        }
        res.body.results.length = 2
      4.6) с параметрами ?page=2&limit=2
        ответ должен быть таким:
        status(200)
        {
          count: '5',
          next: 'https://filmapi0.herokuapp.com/api/favourites/?page=3&limit=2',
          previous: 'https://filmapi0.herokuapp.com/api/favourites/?page=1&limit=2',
          results: [...]
        }
        res.body.results.length = 2
      4.7) с параметрами ?page=3&limit=2
        ответ должен быть таким:
        status(200)
        {
          count: '5',
          next: null,
          previous: 'https://filmapi0.herokuapp.com/api/favourites/?page=2&limit=2',
          results: [...]
        }
        res.body.results.length = 1
    5) сделать get запрос к /is-movie-favourite
      5.1) с параметром imdbID, содержащим imdbID фильма, который есть в бд
        ответ должен быть таким:
        status(200)
        {
          status: true
        }
      5.2)с параметром imdbID, содержащим imdbID фильма, которого нет в бд
        ответ должен быть таким:
        status(200)
        {
          status: false
        }
      5.3)без параметров
        ответ должен быть таким:
        status(400)
        {
          status: false,
          message: 'imdbID not specified'
        }
    6) сделать delete запрос к favourites созданного пользователя,
      6.1) с параметром imdbID, содержащим imdbID фильма, который есть в бд
        ответ должен быть таким:
        status(200)
        {
          status: true
        }
      6.2)сделать get запрос к /is-movie-favourite с тем же imdbID
        ответ должен быть таким:
        status(200)
        {
          status: false
        }
      6.3)с параметром imdbID, содержащим imdbID фильма, которого нет в бд
        ответ должен быть таким:
        status(200)
        {
          status: false
        }
      6.4)без параметров
        ответ должен быть таким:
        status(400)
        {
          status: false,
          message: 'imdbID not specified'
        }
      6.5)повторить п. 6.1 с оставшимися четырьмя imdbID
      6.6)повторить п.2, ответ должен быть таким же
    7) удалить пользователя и токены из бд, проверить удалились ли они
*/
