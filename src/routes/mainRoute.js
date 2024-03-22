import {Router} from 'express';


const router = Router();

//shows main page
router.get('/', (req, res) => {
    res.render('test', {
        title: 'test'
    });
});

export default router;