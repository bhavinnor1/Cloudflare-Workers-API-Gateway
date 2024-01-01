
let headers = new Headers({
  "Accept"       : "application/json",
  "Content-Type" : "application/json",
  "User-Agent"   : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
});
export default {
  async fetch(request, env, ctx) {
    let list = request.url.split('/');
    const headers2 = Object.fromEntries(request.headers);
    const body = await request.text();
    let response = "";
    if (list[3] !== "auth"){
      const url = await fetch(`https://node-auth-service.onrender.com/auth/authenticate`,{
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          token: headers2.authorization
        })
      });
      response = await url.json();
      if (request?.success){
        const payload = {
          method: request.method,
          headers: headers
        }
        if (request.method === "POST" || request.method === "PUT"){
          payload.body = JSON.stringify(body);
        }
        const url = await fetch(`https://node-product-service.onrender.com/${list.slice(3).join("/")}`,payload);
        response = await url.text();
      }

    } else {
      const payload = {
        method: request.method,
        headers: headers
      }
      if (request.method === "POST" || request.method === "PUT"){
        payload.body = JSON.stringify(body);
      }
      const url = await fetch(`https://node-auth-service.onrender.com/${list.slice(3).join("/")}`,payload);
      response = await url.text();
      try{
        response = JSON.parse(response);
      } catch {
        console.log("Response is Not JSON");
      }
    }
    return new Response(JSON.stringify(response),{
        headers: {
             "Access-Control-Allow-Headers" : "Content-Type",
              "Access-Control-Allow-Origin": "*",
            'Content-Type': 'application/json',
             "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PATCH,PUT"
        },
    });
  },
};
