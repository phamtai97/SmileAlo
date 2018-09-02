# Database MongoDB

## user

    {
        "_id" : ObjectId("5b7db045dbb0b133a1ae879f"),
        "name" : "Trung bim bo",
        "userName" : "trungdv",
        "password" : "$2b$10$2jvsvGjrI4PcgBp1oFRFmunfdn5nEfUMuK17jGkMX9F4h3Doj0.Ci",
        "avatar" : "http://www.fun88pro.net/wp-content/uploads/2017/06/hot-girl-viet-nam-co-nu-cuoi-thien-than.jpg",
        "created" : ISODate("2018-08-22T18:49:41.252Z")
    }

## channel

    {
        "_id" : ObjectId("5b82d14b847bf7a17083060c"),
        "title" : "",
        "lastMessage" : "hello\n",
        "avatar" : "http://streaming1.danviet.vn/upload/1-2018/images/2018-03-17/hot-girl----nh-th-----1--1521259733-width650height992.jpg",
        "members" : [ 
            ObjectId("5b7db045dbb0b133a1ae879f"), 
            ObjectId("5b7db080dbb0b133a1ae87a1")
        ],
        "userId" : ObjectId("5b7db045dbb0b133a1ae879f"),
        "created" : ISODate("2018-08-26T16:12:04.097Z"),
        "updated" : ISODate("2018-08-26T16:12:04.102Z")
    }

## message

    {
        "_id" : ObjectId("5b82d154847bf7a17083060d"),
        "channelId" : ObjectId("5b82d14b847bf7a17083060c"),
        "body" : "hello\n",
        "userId" : ObjectId("5b7db045dbb0b133a1ae879f"),
        "created" : ISODate("2018-08-26T16:12:04.102Z")
    }

## user_channel

    {
        "_id" : ObjectId("5b82d1549ad4fd4fe830d438"),
        "channelId" : ObjectId("5b82d14b847bf7a17083060c"),
        "userId" : ObjectId("5b7db045dbb0b133a1ae879f"),
        "numberOfMessageWait" : 0
    }
