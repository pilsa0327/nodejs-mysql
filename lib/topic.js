var db = require('./db')
var template = require('./template.js');
var url = require('url');
var qs = require('querystring');


exports.home = 
    function(request, response){
        db.query('select * from topic', function(error, topics){
            if(error){
                throw error;
            }; 
            var title = 'Welcome!!';
            var description = 'Hello!!!'
            var list = template.list(topics);
            var html = template.HTML(title, list,
                `<h2>${title}</h2>${description}`,
                ` <a href="/create">create</a>`)
            response.writeHead(200);
            response.end(html);
        });
    };

exports.page =
    function(request, response){
        var _url = request.url;
        var queryData = url.parse(_url, true).query;
        db.query('select * from topic', function(error, topics){
            if(error){
                throw error;
            };
            db.query(`select * from topic where topic.id=?`, [queryData.id], function(error2, topic){
                if(error2){
                throw error2;
                }
                var title = topic[0].title;
                var description = topic[0].description;
                var list = template.list(topics);
                var html = template.HTML(title, list,
                `<h2>${title}</h2>${description}`,
                `<a href="/create">create</a>
                <a href="/update?id=${queryData.id}">update</a>
                <form action="delete_process" method="post">
                    <input type="hidden" name="id" value="${queryData.id}">
                    <input type="submit" value="delete">
                </form>`
                );
                response.writeHead(200);
                response.end(html);
            });
        });
    };

exports.create = 
    function(request, response){
        db.query('select * from topic', function(error, topics){
            if(error){
                throw error;
            };
            var title = 'Create!!'
            var list = template.list(topics);
            var html = template.HTML(title, list, `
                <form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p>
                    <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
                </form>
                `, `<a href="/create">create</a>`,
                )
            response.writeHead(200);
            response.end(html);
        });
    };

exports.create_process =
    function(request, response){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            db.query(`insert into topic (title, description, created, author_id) values(?, ?, now(), ?)`, 
            [post.title, post.description, 1], 
            function(error, results){
            if (error){
                throw error
            };
            response.writeHead(302, {Location: `/?id=${results.insertId}`});
            response.end();
            });
      })
    };

exports.update =
    function(request, response){
        var _url = request.url;
        var queryData = url.parse(_url, true).query;
        db.query('select * from topic', function(error, topics){
            if(error){
              throw error;
            };
            db.query(`select * from topic where id=?`, [queryData.id], function(error2, topic){
              if(error2){
                throw error2;
              };
              var list = template.list(topics);
              var html = template.HTML(topic[0].title, list, `
                <form action="/update_process" method="post">
                  <input type="hidden" name="id" value="${topic[0].id}">
                  <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
                  <p>
                    <textarea name="description" placeholder="description">${topic[0].description}</textarea>
                  </p>
                  <p>
                    <input type="submit">
                  </p>
                </form>
                `,
                `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
                );   
              response.writeHead(200);
              response.end(html);
            });
        });
    }

exports.update_process = 
    function(request, response){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            db.query(`update topic set title=?, description=?, created=now(), author_id=1 where id=?`, 
            [post.title, post.description, post.id], 
            function(error, results){
            response.writeHead(302, {Location: `/?id=${post.id}`});
            response.end();
            });
        }); 
    };
    
exports.delete_process =
    function(request, response){
        var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
         
          db.query(`delete from topic where id=?`, [post.id], function(error, results){
            response.writeHead(302, {Location: `/`});
            response.end();
          });
      });
    }
    