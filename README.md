[POST] /users/register -> registrará al usuario y se guardará en la BD
STATUS: 201

[POST] /users/login -> iniciará sesión el usuario y se creará el token
STATUS: 200

## SONGS ENDPOINTS

[GET] /songs -> devuelve un array con todas las canciones de la BD
STATUS: 200

[GET] /songs/:id -> devuelve una canción con detalles de la BD por id
STATUS: 200

[POST*] /songs/create -> recibe una canción (sin id), lo crea en la BD y devuelve la canción recién creada
STATUS: 201

[PUT*] /songs/modify -> recibe una canción, modifica en la BD la canción con la misma id que la recibida, y devuelve la canción modificada
STATUS: 201

[DELETE*] /songs/delete/:id -> elimina de la BD una canción por id y devuelve un objeto con la id
STATUS: 201

STATUS ERRORES=

- 400: Bad Request
- 404: Not found
- 409: Conflicts
- 500: Internal Server Error
