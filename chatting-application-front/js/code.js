var chat=[1,2,3,4,5,6,7,8,9,10]
        var currentTo=null;
        var from=24
        // import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
        var socket = io("https://chat-connect-back.onrender.com/");
         window.onload = function exampleFunction() {
            console.log("sacac")
            console.log(document.cookie)
            // var cookie_value=
                if(document.cookie!=""){
                    var x =document.cookie.split(";")[0].split("=")[1].split(" ")
                console.log(x)
                if(x[2]!="success_chat"){
                    window.location.href = "index.html";
                }
                else{
                     console.log(socket)
                    socket.emit("on-signin",x[1])
                }
                from=x[1]
                document.getElementById("chat-user").innerHTML=x[0]
                update()}
                else{
                    window.location.href = "index.html"
                }
            }
            window.onbeforeunload = function () {
            alert("fgsdgs")
            }
            // function everyTime() {
            //     // console.log('each 1 second...');
            //     if(from!=null)
            //     update()
            //     if(currentTo!=null)
            //     updatechat(0)
                
            // }

            // var myInterval = setInterval(everyTime, 500);
            function chatting(a){
                currentTo=a.getAttribute('name')
                console.log(a.getAttribute('name'))
                console.log(a.childNodes[1].childNodes[0].innerHTML)
                document.getElementById("toname").innerHTML=a.childNodes[1].childNodes[0].childNodes[0].innerHTML
                updatechat(1)
                if(screen.width < 767){
                removestylelinks()
            create("css/chat.css")
                }
            }
          function fun(){
            currentTo=null;
            if(screen.width < 767){
            removestylelinks()
            create("css/persons.css")
            }
          }
          function removestylelinks(){  
            var ary = document.getElementsByTagName("link");
            console.log(ary.length)
            for (var i=0;i<ary.length;i++) {
            var s1 = ary[i].href.split("/")
            s1=s1[s1.length-1]
            if(s1=="chat.css" || s1=="style.css" || s1=="persons.css" )
            ary[i].parentNode.removeChild(ary[i]);
          console.log("sadf")
        }
        }
        function create(x){
             var head = document.getElementsByTagName('HEAD')[0];
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = x;
            head.appendChild(link);
        }
        if(screen.width < 767){
            console.log("cdsfgth")
            
            removestylelinks()
            create("css/persons.css")
        }    
        function send(){
            var message=document.getElementById("messagevalue").value
            document.getElementById("messagevalue").value=""
            if(message!=""){
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify({
                "from": from,
                "to": currentTo,
                "message":message
                });

                var requestOptions = {
                method: 'POST',
                mode:'cors',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
                };

                fetch("https://chat-connect-back.onrender.com/uploadmessage", requestOptions)
                .then(response => response.text())
                .then(result => {
                    console.log(result)
                    socket.emit("message-sent",currentTo,from)
                    updatechat(1)
                    update()
                })
                .catch(error => console.log('error', error));
            }
        }
        function update(){
            
                if(from!=null){
                    var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify({
                "from": from
                });

                var requestOptions = {
                method: 'POST',
                mode:'cors',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
                };

                fetch("https://chat-connect-back.onrender.com/getprofiles", requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log("----------------------- IN UPDATE FUNCTION ----------")
                    console.log(result)   
                    var scrollHtml=""
                     for(var i=0;i<result.length;i++){
                        if(result[i].count==undefined || result[i].count==null){
                            result[i].count=0
                        }
                        if(result[i].count>0){
                        scrollHtml+="<li class='clearfix' name='"+ result[i].ids+"' onclick='chatting(this)'><img src='https://bootdey.com/img/Content/avatar/avatar1.png' alt='avatar'><div class='about'><div class='name'><p style='display:inline'>"+result[i].name+"</p>  <span class='badge badge-primary'>"+result[i].count+"</span></div>   </li>"
                        }
                        else{
                            scrollHtml+="<li class='clearfix' name='"+ result[i].ids+"' onclick='chatting(this)'><img src='https://bootdey.com/img/Content/avatar/avatar1.png' alt='avatar'><div class='about'><div class='name'><p style='display:inline'>"+result[i].name+"</p> <span class='badge badge-primary'></span></div>   <div class='status'> </div></div></li>"
                        }
                    }
                    document.getElementById("scroll").innerHTML=scrollHtml  
                                   
                        })
                        .catch(error => console.log('error', error));
                }
                
        }
        // function fun(a){
        //     currentTo=a.name
        //     document.getElementById("toname").innerHTML=a.childNodes[0].childNodes[0].childNodes[0].childNodes[1].innerText
        //     console.log(a.childNodes[0].childNodes[0].childNodes[0].childNodes[1].innerText)
        //     document.getElementById("chat").scrollTo(0, document.getElementById("chat").scrollHeight);
        //     console.log(a.name)
        //     updatechat(1)
        // }
        
        function updatechat(x){
              if(currentTo!=null){
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify({
                "from": from,
                "to":currentTo
                });

                var requestOptions = {
                method: 'POST',
                mode:'cors',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
                };

                fetch("https://chat-connect-back.onrender.com/getmessages", requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log(result) 
                    var chatresult =""
                    for(var i=0;i<result.length;i++){
                        if(result[i].from==from){
                            console.log(result[i].from+"  "+from)
                            chatresult+="<li class='clearfix'><div class='message-data text-right'></div><div class='message other-message float-right'>"+result[i].message+"</div></li>"
                        }
                        else{
                            chatresult+="<li class='clearfix'><div class='message-data text-right'></div><div class='message my-message'>"+result[i].message+"</div></li>"
                        }
                    }
                    document.getElementById("chatting").innerHTML=chatresult
                    if(x==1)
                    document.getElementById("chat-history").scrollTo(0, document.getElementById("chat-history").scrollHeight);
                    update()
                    

                 })
                        .catch(error => console.log('error', error));
              }
            //   document.getElementById("change-hiiden").style.visibility = "visible"
        }
        function searchuser(){
            var input=document.getElementById("searchuser").value
            if(input!=null){
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify({
                "user": input
                });

                var requestOptions = {
                method: 'POST',
                mode:'cors',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
                };

                fetch("https://chat-connect-back.onrender.com/msgtonew", requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log(result) 
                    if(result.length==1){
                    currentTo=result[0].id
                    document.getElementById("toname").innerHTML=result[0].name
                    document.getElementById("searchuser").value=""
                    if(screen.width < 767){
                        console.log("cdsfgth")
                        
                        removestylelinks()
                        create("css/chat.css")
                    }
                    aler("user found")
                    }
                    else{
                        alert("user not found")
                    }

                 })
                        .catch(error => console.log('error', error));
              
            }
        }
        
        socket.on("update-chat",function(to_,from_){
            console.log(from+" update "+to_)
            if(from==to_){
                updatechat(1)
                update()
            }
            update()

        })
       