import {Router} from 'express';


const router = Router();

//shows main page
router.get('/', (req, res) => {
    res.render('interface', {
        title: 'Main Interface'
    });
});

export default router;