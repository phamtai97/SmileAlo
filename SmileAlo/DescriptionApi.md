# Smile Alo

- Smile Alo là một web chat với các chức năng cơ bản, front-end viết bằng Reactjs + Mobx, back-end viết bằng Nodejs Express.
# Rest API

# Login

## Login [/login]

### User login web [POST]

+ Request
    
    + body

            {
                userName: 'trungdv',
                password: '123'
            }

+ Response 200 (OK)

    + body

            {
                data:
                {
                    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoidHJ1bmdkdiIsImlhdCI6MTUzNTU5NDQ3NCwiZXhwIjoxNTM1NTk4MDc0fQ.5eWE37JwJXRQMBWSLzOH6Dk5juduuX2ZXDqnB1ASNT8',
                    user: 
                        {
                            _id: 5b7db045dbb0b133a1ae879f,
                            name: 'Trung bim bo',
                            userName: 'trungdv',
                            avatar: 'http://www.fun88pro.net/wp-content/uploads/2017/06/hot-girl-viet-nam-co-nu-cuoi-thien-than.jpg',
                            created: 2018-08-22T18:49:41.252Z 
                        }
                }
            }

+ Response 401 (Unauthorized)

    + body

            {   
                data:
                {
                    error_message: 'Login failed'
                }
            }

# Register

## Register [/register]

### User register account [POST]

+ Request

    + body

            { 
                name: 'Đỗ Trung Đức',
                userName: 'ductd',
                password: '456',
                avatar: 'http://a9.vietbao.vn/images/vn999/55/2017/12/20171208-hot-girl-thai-lan-gay-sot-voi-than-hinh-chu-s-sieu-goi-cam-1.jpg' 
            }

+ Response 200 (OK)

    + body 

            {
                data:
                    {
                        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiaHV5dmgiLCJpYXQiOjE1MzU1OTY1MzksImV4cCI6MTUzNTYwMDEzOX0.xyV9qLsbuO_IzMc1DgHPEJrhTB2dsxVhBxcyMA-GlGM',
                        user: 
                            { name: 'Võ Huỳnh Anh Huy',
                                userName: 'huyvh',
                                avatar: 'https://vnn-imgs-f.vgcloud.vn/2018/04/20/09/bi-kip-co-than-hinh-chuan-cho-nguoi-gay.jpg',
                                created: 2018-08-30T02:35:39.828Z,
                                _id: 5b8757fb633f51790471746a 
                            } 
                    }
            }

+ Response 400 (Bad Request)

    + body

            {
                data:
                    {
                        error_message: "User is already exist"
                    }
            }

# Channel 

## AllChannels [/allchannels]

### Get all channels of user [POST]]

+ Request 

    + body
            
            { 
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoidnV0cSIsImlhdCI6MTUzNTU5NzkxNSwiZXhwIjoxNTM1NjAxNTE1fQ.1-OmVHXHCR5rpjnNYzsvQ2dkA6_mxdoT25AxCV15Lts',
                userId: '5b7db145dbb0b133a1ae87a5' 
            }

+ Response 200 (OK)

    + body

            {
                data:
                    {
                        { channels: 
                            [ 
                                { _id: 5b835be41603542dd4afc8ff,
                                title: '',
                                lastMessage: 'Không phải là định mệnh, cũng không phải là tình cờ, không phải may mắn, không phải ngẫu nhiên mà bạn đang thở ngay trong lúc này đây. Bạn hiện đang sống vì Đức Chúa Trời muốn tạo dựng bạn! Thánh Kinh chép rằng, “Chúa sẽ làm trọn mục đích Ngài dành cho tôi”.\n',
                                avatar: 'https://image.thanhnien.vn/665/uploaded/congthang/2017_04_12/hinh4_nrvm.jpg',
                                members: [5b835b43e18f504f7272899d", "5b7db080dbb0b133a1ae87a1", "5b7db145dbb0b133a1ae87a5"],
                                userId: 5b835b43e18f504f7272899d,
                                created: 2018-08-27T02:04:39.273Z,
                                updated: 2018-08-27T02:19:57.101Z,
                                users: [ {_id: "5b7db080dbb0b133a1ae87a1", name: "Thịnh Đặng", avatar:      "http://streaming1.danviet.vn/upload/1-2018/images/…----nh-th-----1--1521259733-width650height992.jpg", created: "2018-08-22T18:50:40.087Z"},
                                    {_id: "5b7db145dbb0b133a1ae87a5", name: "Trần Quang Vũ", avatar: "https://image.thanhnien.vn/665/uploaded/congthang/2017_04_12/hinh4_nrvm.jpg", created: "2018-08-22T18:53:57.592Z"},
                                    {_id: "5b835b43e18f504f7272899d", name: "Hoàn Thiên Nữ", avatar: "https://vietnammoi.vn/stores/news_dataimages/linhl…8/13/12/0750_38c298c8739f5457721b99c8f0640517.jpg", created: "2018-08-27T02:00:35.209Z"] },
                                ...................................
                                ],
                            user_channel: 
                            [ 
                                { _id: 5b82d1869ad4fd4fe830d43f,
                                channelId: 5b82d17e847bf7a170830612,
                                userId: 5b7db145dbb0b133a1ae87a5,
                                numberOfMessageWait: 0 },
                                .............................
                            ] 
                        }
                    }
                }
            }

+ Response 404 (Not found)

    + body

            {
                data:
                    {
                        error_message: "Not found"
                    }
            }

# Message

## AllMessages [/allmessages]

### Get all message of channel [POST]

+ Request

    + body

            { 
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoibmhvbmR0IiwiaWF0IjoxNTM1NTk5NTA5LCJleHAiOjE1MzU2MDMxMDl9.LToFoDnQh1rxZ9BbYgKff7PwVOjdtuis8GHOTNT5li0',
                channelId: '5b82d2e703706978874d15bd' 
            }

+ Response 200 (OK)

    + body

            {
                data:
                    {
                        [ 
                            { 
                                _id: 5b82d30803706978874d15be,
                                channelId: 5b82d2e703706978874d15bd,
                                body: 'hell\no',
                                userId: 5b7db045dbb0b133a1ae879f,
                                created: 2018-08-26T16:19:20.566Z 
                            } 
                        ]

                    }
            }

+ Response 404 (Not found)

    + body

            {
                data:
                    {
                        error_message: "Not found"
                    }
            }

# Search

## Search user [/search]

### Search user [POST]

+ Request

    + body

            { 
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoibmhvbmR0IiwiaWF0IjoxNTM1NTk5NzI5LCJleHAiOjE1MzU2MDMzMjl9.wZiceRVEORpsMeEi0SgRN7wZ3aA4d0qwrjyAP6lCAMo',
                search: 'trung' 
            }

+ Response

    + body

            {
                data:
                    {
                        {_id: "5b7db045dbb0b133a1ae879f", name: "Trung bim bo", userName: "trungdv", password: "$2b$10$2jvsvGjrI4PcgBp1oFRFmunfdn5nEfUMuK17jGkMX9F4h3Doj0.Ci", avatar: "http://www.fun88pro.net/wp-content/uploads/2017/06/hot-girl-viet-nam-co-nu-cuoi-thien-than.jpg", …}

                        {_id: "5b875647661c8b741854e6b1", name: "Đỗ Trung Đức", userName: "ductd", password: "$2b$10$R2iWklrqdd8MakTGjl7Bj.FL3I7EkBwTpGA68zI8sR.3hdNmcLmHy", avatar: "http://a9.vietbao.vn/images/vn999/55/2017/12/20171…an-gay-sot-voi-than-hinh-chu-s-sieu-goi-cam-1.jpg", …}
                    }
            }

+ Response 404 (Not found)

    + body

            {
                data:
                    {
                        error_message: "Not found"
                    }
            }

# Websocket

## Authencated

+ Requset

    authencation:

            {
                "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiaHV5dmgiLCJpYXQiOjE1MzU2MTMyMjcsImV4cCI6MTUzNTYxNjgyN30.Gdz2MBapHYaUK4jgVj-oQqLZTpYDiG3K8njV7LfBaV4",
                "header":"authenticated",
                "data":"5b8757fb633f51790471746a"
            }

+ Response

    authencation:

            {
                header: "authenticated"
                data: "success connected websocket server"
            }

        }
## Unauthenticated

+ Response

    unauthenticated:

            {
                header: "unauthenticated",
                data: "403",
            }

## Create channel

+ Request
    
    channel:
            
            {
                "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiaHV5dmgiLCJpYXQiOjE1MzU2MTAwMDgsImV4cCI6MTUzNTYxMzYwOH0.vD4KP0dq9-KAVFEw_wSOa5jCkbX0v-Mp3YbXD7u38oU",
                "header":"create_channel",
                "data":
                    {
                        "_id":"5b878de6dba12b0044a1e11c",
                        "title":"Trung bim bo, Thịnh Đặng",
                        "lastMessage":"hello\n","avatar":"http://streaming1.danviet.vn/upload/1-2018/images/2018-03-17/hot-girl----nh-th-----1--1521259733-width650height992.jpg",
                        "members":
                            {
                                "5b8757fb633f51790471746a":
                                    {
                                        "_id":"5b8757fb633f51790471746a",
                                        "name":"Võ Huỳnh Anh Huy",
                                        "userName":"huyvh","avatar":"https://vnn-imgs-f.vgcloud.vn/2018/04/20/09/bi-kip-co-than-hinh-chuan-cho-nguoi-gay.jpg",
                                        "created":"2018-08-30T02:35:39.828Z"
                                    },
                                "5b7db045dbb0b133a1ae879f":
                                    {
                                        "_id":"5b7db045dbb0b133a1ae879f",
                                        "name":"Trung bim bo",
                                        "userName":"trungdv","avatar":"http://www.fun88pro.net/wp-content/uploads/2017/06/hot-girl-viet-nam-co-nu-cuoi-thien-than.jpg","created":"2018-08-22T18:49:41.252Z"
                                    },
                                "5b7db080dbb0b133a1ae87a1":
                                    {
                                        "_id":"5b7db080dbb0b133a1ae87a1",
                                        "name":"Thịnh Đặng",
                                        "userName":"thinhdang","avatar":"http://streaming1.danviet.vn/upload/1-2018/images/2018-03-17/hot-girl----nh-th-----1--1521259733-width650height992.jpg",
                                        "created":"2018-08-22T18:50:40.087Z"
                                    }
                            },
                                        
                            "messages":{},
                            "isNew":true,
                            "userId":"5b8757fb633f51790471746a",
                            "updated":1535610342589,
                            "created":"2018-08-30T06:25:42.589Z",
                            "message":
                                {
                                    "_id":"5b878df2dba12b0044a1e11d",
                                    "channelId":"5b878de6dba12b0044a1e11c",
                                    "body":"hello\n",
                                    "userId":"5b8757fb633f51790471746a",
                                    "me":true
                                }
                    }
            }

+ Response

    channel:
    `
            {
                header: "create_channel"
                data:
                    {
                        _id:"5b879694252d4c48c835fa27"
                        avatar:"https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg"
                        created:"2018-08-30T07:02:50.663Z",
                        lastMessage:"hello",
                        members:
                        [
                            "5b8757fb633f51790471746a", "5b7db0badbb0b133a1ae87a3",
                        ]
                        title:"",
                        userId:"5b8757fb633f51790471746a",
                        users: 
                        [

                            {
                                _id: "5b7db0badbb0b133a1ae87a3", 
                                name: "Đỗ Thành Nhơn", 
                                avatar: "https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg", 
                                created: "2018-08-22T18:51:38.698Z"
                            },
                            
                            {
                                _id: "5b8757fb633f51790471746a", 
                                name: "Võ Huỳnh Anh Huy", avatar: "https://vnn-imgs-f.vgcloud.vn/2018/04/20/09/bi-kip-co-than-hinh-chuan-cho-nguoi-gay.jpg", 
                                created: "2018-08-30T02:35:39.828Z"
                            }
                        ]     
                    }

            }

## Create Message

+ Request
    
    message:     

            {
                "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiaHV5dmgiLCJpYXQiOjE1MzU2MTMyMjcsImV4cCI6MTUzNTYxNjgyN30.Gdz2MBapHYaUK4jgVj-oQqLZTpYDiG3K8njV7LfBaV4","header":"create_message",
                "data":
                    {
                        "_id":"5b87992f988e9928b14e1458","channelId":"5b879694252d4c48c835fa27","body":"hello\n",
                        "userId":"5b8757fb633f51790471746a",
                        "me":true
                    }
            }

+ Response

    message:

            {
                header:"create_message"
                data:
                {   
                    _id:"5b87992f988e9928b14e1458",
                    body:"hello",
                    channelId:"5b879694252d4c48c835fa27",   
                    created:"2018-08-30T07:13:51.668Z",
                    userId:"5b8757fb633f51790471746a",
                }
            }
            
## Get User Online

+ Response

    userOnline: 

            {
                header:"user_online",
                data:"5b8757fb633f51790471746a"
            }

## Get List User Online

+ Response

    listUsersOnline:

            {
                header:"listuser_online,
                data: ["5b8757fb633f51790471746a"]
            }

## Get User Offline

+ Response

    userOffline:

            {
                header: "user_offline",
                data: "5b7db0badbb0b133a1ae87a3"
            }

## Update Message Wait

+ Resquest

    messageWait:

            {
                "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoibmhvbmR0IiwiaWF0IjoxNTM1NjE1MjgzLCJleHAiOjE1MzU2MTg4ODN9.zfO558O_C8kPVXsWVdzMdKlQfc3zZv9csGXj00Hiw9Y",
                "header":"update_messagewait",
                "data":
                    {
                        "channelId":"5b879694252d4c48c835fa27","userId":"5b7db0badbb0b133a1ae87a3"
                    }
            }
## LogOut

+ Resquest

    logout:         

            {
                "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoidHJ1bmdkdiIsImlhdCI6MTUzNTYxNjUxNywiZXhwIjoxNTM1NjIwMTE3fQ.CwgqIYvDQY5jT_T7i7cSrgQVJKsBBAcZKK3u06lHOFM",
                "header":"logout",
                "data": "5b7db045dbb0b133a1ae879f"
            }
