const jsonServer = require('json-server');
const server = jsonServer.create();
const fs = require('fs')
const path = require('path')
const filePath = path.join('db.json')
const data = fs.readFileSync(filePath, "utf-8");
const db = JSON.parse(data);
const router = jsonServer.router(db)
const middlewares = jsonServer.defaults();
server.use(middlewares);
server.use(jsonServer.rewriter({
    '/ims/api/users': '/users',
    '/ims/api/users/:id': '/users/:id',
    '/ims/api/events': '/events',              // Add this line
    '/ims/api/events/:id': '/events/:id'       // Add this line
}));

router.render = (req, res) => {
    const method = req.method;
    const resource = 'user';
    if (method === 'POST' && res.statusCode === 201) {
        res.jsonp({
            message: `${resource.charAt(0).toUpperCase() + resource.slice(1)} created successfully`,
            // data: res.locals.data
        });
    } else if (method === 'PUT' && res.statusCode === 200) {
        res.jsonp({
            message: `${resource.charAt(0).toUpperCase() + resource.slice(1)} updated successfully`,
            // data: res.locals.data
        });
    } else if (method === 'DELETE' && res.statusCode === 200) {
        res.jsonp({
            message: `${resource.charAt(0).toUpperCase() + resource.slice(1)} deleted successfully`,
        });
    } else {
        res.jsonp({
            users: res.locals.data
        });
    }
    if (res.statusCode === 404) {
        res.status(404).jsonp({
            message: `${resource.charAt(0).toUpperCase() + resource.slice(1)} not found`
        });
    }
};
router.render = (req, res) => {
    const method = req.method;
    const resource = req.url.includes('/events') ? 'event' : 'user'; // Add dynamic resource detection

    if (method === 'POST' && res.statusCode === 201) {
        res.jsonp({
            message: `${resource.charAt(0).toUpperCase() + resource.slice(1)} created successfully`,
        });
    } else if (method === 'PUT' && res.statusCode === 200) {
        res.jsonp({
            message: `${resource.charAt(0).toUpperCase() + resource.slice(1)} updated successfully`,
        });
    } else if (method === 'DELETE' && res.statusCode === 200) {
        res.jsonp({
            message: `${resource.charAt(0).toUpperCase() + resource.slice(1)} deleted successfully`,
        });
    } else {
        res.jsonp({
            [resource + 's']: res.locals.data
        });
    }
    
    if (res.statusCode === 404) {
        res.status(404).jsonp({
            message: `${resource.charAt(0).toUpperCase() + resource.slice(1)} not found`
        });
    }
};

server.use(router);
server.listen(3000, () => {
    console.log('JSON Server is running');
});
module.exports = server;