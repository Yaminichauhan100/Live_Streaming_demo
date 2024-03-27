import express from 'express';
import cookieSession from 'cookie-session';
import {json, urlencoded} from 'body-parser';
import router from './user/routes';
import cors from 'cors';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(urlencoded({extended: true}));
app.use(cors());

app.set('views', 'src/views');
app.set('view engine', 'ejs');
app.use('/public', express.static('src/public'));

app.use(
    cookieSession({
      signed: false,
      secure: false,
    }),
);
app.use('/', router);
app.get('/health', (req, res) => {
  res.sendStatus(200);
});

export {app};
