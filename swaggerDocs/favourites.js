/**
   * @swagger
   * /api/favourites:
   *  get:
   *    security:
   *      - bearerAuth: []
   *    tags: ['Favourites']
   *    summary: "Get all favourites film of user"
   *    description: Use to request all favourites films.
   *    parameters:
   *    - in: query
   *      name: page
   *      required: true
   *      schema:
   *        type: integer
   *      description: The number of page (the default is 1).
   *    - in: query
   *      name: limit
   *      required: true
   *      schema:
   *        type: integer
   *      description: The numbers of items to return (the default is 10).
   *    responses:
   *      '200':
   *        description: A successful response, received data on the list of user's favorite films according to the request.
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                count:
   *                  type: integer
   *                  description: Count of item in favourites list.
   *                next:
   *                  type: string
   *                  description: Link on next page. If it last page, return null.
   *                previous:
   *                  type: string
   *                  description: Link on previous page. If it first page, return null.
   *                results:
   *                  type: array
   *                  items:
   *                    type: object
   *                    properties:
   *                      title:
   *                        type: string
   *                        description: Movie title.
   *                      genre:
   *                        type: string
   *                        description: Movie genre.
   *                      released:
   *                        type: string
   *                        description: Movie release date.
   *                      runtime:
   *                        type: string
   *                        description: Movie length.
   *                      imdbRating:
   *                        type: string
   *                        description: Movie rating on imdb.
   *                      plot:
   *                        type: string
   *                        description: Movie description.
   *                      poster:
   *                        type: string
   *                        description: Movie poster.
   *                      country:
   *                        type: string
   *                        description: Country where the movie was made.
   *                      imdbID:
   *                        type: string
   *                        description: Movie ID on imdb.
   *                      year:
   *                        type: string
   *                        description: Movie release year.
   *                  description: List item of favourites film
   *      '400':
   *        description: Incorrect parameters in the request.
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                  description: Description of the error. Indicates which parameters in the request were incorrect.
   *      '401':
   *        description: Access token is missing or invalid.
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                  description: Unauthorized.
   *  post:
   *    security:
   *      - bearerAuth: []
   *    tags: ['Favourites']
   *    summary: "Add new film in favourites list of user"
   *    description: Use to add new film in favourites list of user.
   *    requestBody:
   *       description: Item for favourites list. 
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *                 description: Movie title.
   *               genre:
   *                 type: string
   *                 description: Movie genre.
   *               released:
   *                 type: string
   *                 description: Movie release date.
   *               runtime:
   *                 type: string
   *                 description: Movie length.
   *               imdbRating:
   *                 type: string
   *                 description: Movie rating on imdb.
   *               plot:
   *                 type: string
   *                 description: Movie description.
   *               poster:
   *                 type: string
   *                 description: Movie poster.
   *               country:
   *                 type: string
   *                 description: Country where the movie was made.
   *               imdbID:
   *                 type: string
   *                 description: Movie ID on imdb.
   *               year:
   *                 type: string
   *                 description: Movie release year.
   *             required:
   *               - title
   *               - genre
   *               - released
   *               - runtime
   *               - imdbRating
   *               - plot
   *               - poster
   *               - country
   *               - imdbID
   *               - year
   *    parameters:
   *    - name: title
   *      description: Movie title.
   *      in: formData
   *      required: true
   *      type: string
   *    - name: genre
   *      description: Movie genre.
   *      in: formData
   *      required: true
   *      type: string
   *    - name: released
   *      description: Movie release date.
   *      in: formData
   *      required: true
   *      type: string
   *    - name: runtime
   *      description: Movie length.
   *      in: formData
   *      required: true
   *      type: string
   *    - name: imdbRating
   *      description: Movie rating on imdb.
   *      in: formData
   *      required: true
   *      type: string
   *    - name: plot
   *      description: Movie description.
   *      in: formData
   *      required: true
   *      type: string
   *    - name: poster
   *      description: Movie poster.
   *      in: formData
   *      required: true
   *      type: string
   *    - name: country
   *      description: Country where the movie was made.
   *      in: formData
   *      required: true
   *      type: string
   *    - name: imdbID
   *      description: Movie ID on imdb.
   *      in: formData
   *      required: true
   *      type: string
   *    - name: year
   *      description: Movie release year.
   *      in: formData
   *      required: true
   *      type: string
   *    responses:
   *      '200':
   *        description: A successful response, film added to database.
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: boolean
   *                  description: Data is successfully added to the database.
   *      '400':
   *        description: Incorrect parameters in the request.
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: boolean
   *                  description: An error occurred when adding data to the database
   *                message:
   *                  type: string
   *                  description: Indicates which of the required fields was missing in the request.
   *      '401':
   *        description: Access token is missing or invalid.
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                  description: Unauthorized.
   *      '409':
   *        description: This film has alredy in cathegory favourites.
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: boolean
   *                  description: An error occurred when adding data to the database
   *                message:
   *                  type: string
   *                  description: Message that the movie has already been added.
   *  delete:
   *    security:
   *      - bearerAuth: []
   *    tags: ['Favourites']
   *    summary: "Delete film from favourites list of user"
   *    description: Use to delete film from favourites list of user.
   *    parameters:
   *    - in: query
   *      name: imdbID
   *      required: true
   *      schema:
   *        type: string
   *      description: Movie ID on imdb.
   *    responses:
   *      '200':
   *        description: A successful response.
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: boolean
   *                  description: Operation success status, indicates whether the movie has been removed.
   *      '400':
   *        description: Incorrect parameters in the request.
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: boolean
   *                  description: Operation success status, indicates whether the movie has been removed.
   *                message:
   *                  type: string
   *                  description: Description of the error. Indicates which parameters in the request were incorrect.
   *      '401':
   *        description: Access token is missing or invalid.
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                  description: Unauthorized.
   */

   /**
   * @swagger
   * /api/favourites/get-by-imdbid:
   *  get:
   *    security:
   *      - bearerAuth: []
   *    tags: ['Favourites']
   *    summary: "Get movie from favourites list on imdbID."
   *    description: Use to get movie from favourites list on imdbID.
   *    parameters:
   *    - in: query
   *      name: imdbID
   *      required: true
   *      schema:
   *        type: string
   *      description: Movie ID on imdb.
   *    responses:
   *      '200':
   *        description: A successful response.
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                results:
   *                  type: array
   *                  items:
   *                    type: object
   *                    properties:
   *                      title:
   *                        type: string
   *                        description: Movie title.
   *                      genre:
   *                        type: string
   *                        description: Movie genre.
   *                      released:
   *                        type: string
   *                        description: Movie release date.
   *                      runtime:
   *                        type: string
   *                        description: Movie length.
   *                      imdbRating:
   *                        type: string
   *                        description: Movie rating on imdb.
   *                      plot:
   *                        type: string
   *                        description: Movie description.
   *                      poster:
   *                        type: string
   *                        description: Movie poster.
   *                      country:
   *                        type: string
   *                        description: Country where the movie was made.
   *                      imdbID:
   *                        type: string
   *                        description: Movie ID on imdb.
   *                      year:
   *                        type: string
   *                        description: Movie release year.
   *                  description: List item of favourites film
   *      '400':
   *        description: Incorrect parameters in the request.
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: boolean
   *                  description: Result of operation.
   *                message:
   *                  type: string
   *                  description: Description of the error. Indicates which parameters in the request were incorrect.
   *      '401':
   *        description: Access token is missing or invalid.
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                  description: Unauthorized.
   */

   /**
   * @swagger
   * /api/favourites/is-movie-favourite:
   *  get:
   *    security:
   *      - bearerAuth: []
   *    tags: ['Favourites']
   *    summary: "Checking if the movie is on the favorites list."
   *    description: Used to check if a movie is on the favorites list.
   *    parameters:
   *    - in: query
   *      name: imdbID
   *      required: true
   *      schema:
   *        type: string
   *      description: Movie ID on imdb.
   *    responses:
   *      '200':
   *        description: A successful response.
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: boolean
   *                  description: Result of operation.
   *      '400':
   *        description: Incorrect parameters in the request.
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: boolean
   *                  description: Result of operation.
   *                message:
   *                  type: string
   *                  description: Description of the error. Indicates which parameters in the request were incorrect.
   *      '401':
   *        description: Access token is missing or invalid.
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                  description: Unauthorized.
   */
