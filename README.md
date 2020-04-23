# HomeCloud

This project was designed to share folders and files on an **internal web** as an solution for payed cloud services with usage limit.

> The Docker and Docker Compose usage is just for learning purposes. Of course, you can run this project without creating an image and running those containers. If it's the case, make sure of create your own PostgreSQL database and configure it on the database configuration object

> As you can see, this project doesn't implements user accounts and any type of authentication/authorization system. Be careful when deploying it and sharing personal pictures, videos or documents

## Dependencies

- Express
- Socket io
- TypeORM
- Pg (PostgreSQL Driver)
- Multer
- Dotenv

## Entities

- Folder
  - name [string, unique]
  - access code [string, unique]
  - files [files]
- File
  - name [string]
  - mime type [string]
  - size [number]
  - access url [string, unique]
  - folder? [Folder]

## Middlewares

- Multer
  - Allowed files: image, video, pdf

## Routes

- /folders [GET]
- /folders/folder_id [GET]
- /folders/folder_id/file_id [GET] → Download the file
- /folders [POST]
  - body: name
- /files [GET & POST]
- /files/file_id [GET] → Download the file
