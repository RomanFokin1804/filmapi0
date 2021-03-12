/**
   * @swagger
   * /api/auth/login:
   *  post:
   *    tags: ['Auth']
   *    summary: "Login to the system. Creating a new user, if the user is not in the database."
   *    description: Use to login to the system or creating a new user, if the user is not in the database.
   *    requestBody:
   *       description: Google user code and redirect URI for google api. 
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               code:
   *                 type: string
   *                 description: Google user code.
   *               redirect_uri:
   *                 type: string
   *                 description: Redirect URI for google api.
   *             required:
   *               - code
   *               - redirect_uri
   *    parameters:
   *    - name: code
   *      description: Google user code.
   *      in: formData
   *      required: true
   *      type: string
   *    - name: redirect_uri
   *      description: Redirect URI for google api.
   *      in: formData
   *      required: true
   *      type: string
   *    responses:
   *      '200':
   *        description: A successful response, user logged in. Returns data from users google account and tokens.
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                email:
   *                  type: string
   *                  description: User email.
   *                name:
   *                  type: string
   *                  description: Username.
   *                avatar:
   *                  type: string
   *                  description: Link on user avatar.
   *                accessToken:
   *                  type: string
   *                  description: Access token.
   *                refreshToken:
   *                  type: string
   *                  description: Refresh token.
   *      '403':
   *        description: Authorization failed.
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                  description: Description of error.
   */

/**
   * @swagger
   * /api/auth/replace-token:
   *  post:
   *    security:
   *      - bearerAuth: []
   *    tags: ['Auth']
   *    summary: "Replace users access token and refresh token."
   *    description: Use to replace users access token and refresh token.
   *    requestBody:
   *       description: Users refresh token. 
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               refreshToken:
   *                 type: string
   *                 description: Refresh token.
   *             required:
   *               - refreshToken
   *    parameters:
   *    - name: refreshToken
   *      description: Refresh token.
   *      in: formData
   *      required: true
   *      type: string
   *    responses:
   *      '200':
   *        description: A successful response, tokens replaced.
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                email:
   *                  type: string
   *                  description: User email.
   *                name:
   *                  type: string
   *                  description: Username.
   *                avatar:
   *                  type: string
   *                  description: Link on user avatar.
   *                accessToken:
   *                  type: string
   *                  description: Access token.
   *                refreshToken:
   *                  type: string
   *                  description: Refresh token.
   *      '400':
   *        description: Incorrect parameters in the request.
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                  description: Description of error.
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