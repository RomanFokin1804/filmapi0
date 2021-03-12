/**
   * @swagger
   * /api/random-film:
   *  get:
   *    tags: ['Random film']
   *    summary: "Get a random movie id from the top 100 imdb"
   *    description: Use to get a random movie id from the top 100 imdb.
   *    responses:
   *      '200':
   *        description: A successful response.
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                imdbID:
   *                  type: string
   *                  description: Movie ID on imdb.
   */
