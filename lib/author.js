var db = require('./db')
var template = require('./template.js');
var qs = require('querystring');
var url = require('url');
var qs = require('querystring');

exports.index = 
    function(request, response){
        db.query('select * from topic', function(error, topics){
            if(error){
                throw error;
            }; 
            db.query('select * from author', function(error, authors){                
                var title = 'author';
                var list = template.list(topics);
                var html = template.HTML(title, list,
                    `${template.authorTable(authors)}
                    <style>
                        table{
                            border-collapse:collapse;
                        }
                        td{
                            border: 1px solid;
                        }
                    </style>
                    <form action="/author/create_process" method="post">
                        <p>
                            <input type="text" name="name" placeholder="title">
                        </p>
                        <p>
                            <textarea name ="profile" placeholder="description"></textarea>
                        </p>
                        <p>
                            <input type="submit" value="create">
                        </p>
                    </form>
                    `    
                    ,
                    ``)
                response.writeHead(200);
                response.end(html);
            });   
        });
    };

exports.author_create_process=
    function(request, response){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){   
            var post = qs.parse(body);
            db.query(`insert into author(name, profile) values(?, ?)`, 
            [post.name, post.profile], 
            function(error, result){
                if(error){
                    throw error
            };
            response.writeHead(302, {Location: `/author`});
            response.end();
            });
        });
    };
    exports.author_update = 
    function(request, response){    
        db.query('select * from topic', function(error, topics){
            if(error){
                throw error;
            }; 
            db.query('select * from author', function(error2, authors){ 
                var _url = request.url;
                var queryData = url.parse(_url, true).query;
                db.query('select * from author where id=?',[queryData.id], function(error3, author){
                    var title = 'author';
                    var list = template.list(topics);
                    var html = template.HTML(title, list,
                        `${template.authorTable(authors)}
                        <style>
                        table{
                            border-collapse:collapse;
                        }
                        td{
                            border: 1px solid;
                        }
                        </style>
                        <form action="/author/update_process" method="post">
                        <p> 
                        <input type="hidden" name="id" value=${queryData.id}>
                        <p>
                        <input type="text" name="name" placeholder="title" value=${author[0].name}>
                        </p>
                        <p>
                        <textarea name ="profile" placeholder="description">${author[0].profile}</textarea>
                        </p>
                        <p>
                        <input type="submit" value="update" >
                        </p>
                        </form>
                        `,
                        ``)
                    response.writeHead(200);
                    response.end(html);
                });
                    
            });   
        });
    };
    
    exports.author_update_process = 
    function(request, response){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            db.query(`update author set name=?, profile=? where id=?`, 
            [post.name, post.profile, post.id], 
            function(error, results){
            response.writeHead(302, {Location: `/author`});
            response.end();
            });
        }); 
    };
    
    exports.author_delete_process =
    function(request, response){
        var body = '';
      request.on('data', function(data){
        body = body + data;
      });
      request.on('end', function(){
            var post = qs.parse(body);
            db.query(`delete from author where id=?`, [post.id], function(error, results){
                if(error){
                    throw error
            }
            response.writeHead(302, {Location: `/author`});
            response.end();
            });
      });
    }
    