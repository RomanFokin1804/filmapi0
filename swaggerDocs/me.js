/**
   * @swagger
   * /api/me:
   *  get:
   *    security:
   *      - bearerAuth: []
   *    tags: ['Me']
   *    summary: "Verify user existence."
   *    description: Use to verify user existence.
   *    responses:
   *      '200':
   *        description: A successful response, user existence.
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
   *      '400':
   *        description: User not existence.
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                message:
   *                  type: string
   *                  description: Description of the error.
   */
