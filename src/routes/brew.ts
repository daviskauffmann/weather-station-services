import router from 'koa-joi-router';

const routes = router();

routes.route({
    method: 'POST',
    path: '/',
    handler: async ctx => {
        ctx.status = 418;
        ctx.body = 'short and stout';
    },
});

export default routes;
