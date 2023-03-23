const RegisterController = require("./controller/RegisterController");
const LoginController = require("./controller/LoginController");
const LoginMiddleware = require("./middleware/LoginMiddleware");
const AddSong = require("./controller/AddSong");
const UpdateSong = require("./controller/UpdateSong");
const DeleteSong = require("./controller/DeleteSong");
const GetSongByUser = require("./controller/GetSongByUser");
const SingerList = require("./controller/SingerList");
const GetSongBySingerAndUser = require("./controller/GetSongBySingerAndUser");
const SongBlob = require("./controller/SongBlob");
const GetPendingSubscription = require("./controller/GetPendingSubscription");
const VerifySubscription = require("./controller/VerifySubscription");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "songs/");
  },
  filename: (req, file, cb) => {
    cb(null, req.query.audioPath);
  },
});
const upload = multer({ storage: storage });

module.exports = (app) => {
  /*
    Request:
        - email: string
        - password: string
        - username: string
        - name: string
    Response:
        - status 200
            succ : string
        - status 400
            err : string
    */
  app.post("/api/register", RegisterController.registerUser);

  /*
    Request:
        - username: string
        - password: string
    Response:
        status: 200
            succ: string
        status: 400
            err: string
    */
  app.post("/api/login", LoginController.loginUser);

  /*
    Request:
        data: list of song
            song: 
                - song_id
                - Judul
                - Audio_path
    Response:
        status: 200
            succ: string
        status: 400
            err: string
        status: 401
            err: string
    */
  app.get("/api/song", LoginMiddleware.loginJwt, GetSongByUser.getSong);

  /*
    Request:
        - judul: string
        - audio_path: string
    Response:
        status: 200
            succ: string
        status: 400
            err: string
        status: 401
            err: string
    */
  app.post("/api/song/add", LoginMiddleware.loginJwt, AddSong.addSong);

  /*
    Request:
        - judul : string
        - audio_path : string
    Response:
        status: 200
            succ: string
        status: 400
            err: string
        status: 401
            err: string
    */
  app.put(
    "/api/song/update/:song_id",
    LoginMiddleware.loginJwt,
    UpdateSong.updateSong
  );

  /*
    Request:
        - judul : string
        - audio_path : string
    Response:
        status: 200
            succ: string
        status: 400
            err: string
        status: 401
            err: string
    */
  app.delete(
    "/api/song/delete/:song_id",
    LoginMiddleware.loginJwt,
    DeleteSong.deleteSong
  );

  /*
    Request:
        
    Response:
        status: 200
            data: list of singer
                singer :
                    - penyanyi_id
                    - name
    */
  app.get("/api/singer", SingerList.getListSinger);

  /*
    Request:
        user_id : string
        penyanyi_id : string
    Response:
        status: 200
            data: list of song
                song: 
                    - song_id
                    - Judul
                    - Audio_path
            penyanyi_name : string
        status: 400
            err: string
    */
  app.get("/api/songuser", GetSongBySingerAndUser.getSong);

  app.get("/api/songblob", SongBlob.getSongBlob);

  app.post(
    "/api/songblob",
    LoginMiddleware.loginJwt,
    upload.single("audio"),
    function (req, res) {
      console.log(req.file, req.user_id);
      res.status(200);
      res.send({
        message: "Audio uploaded successfully",
      });
      return;
    }
  );

  app.get("/api/check_login", LoginMiddleware.loginJwt, function (req, res) {
    res.send({
      name: req.name,
      username: req.username,
      role: req.isAdmin ? "admin" : "singer",
    });
  });

  /*
    Request:
        
    Response:
        status: 200
            data: list of pending subscription
                pending subscription: 
                    - creator_id
                    - subscriber_id
        status: 401
            err: string
    */
  app.get(
    "/api/subscription/pending",
    LoginMiddleware.loginJwt,
    GetPendingSubscription.getPending
  );

  /*
    Request:
        - creator_id
        - subscriber_id
        - status
    Response:
        status: 200
            succ : string
        status: 401
            err: string
    */
  app.put(
    "/api/subscription/verify",
    LoginMiddleware.loginJwt,
    VerifySubscription.verifySubscription
  );
};
