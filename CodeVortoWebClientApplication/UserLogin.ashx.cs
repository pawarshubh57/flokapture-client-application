using System.Collections.Specialized;
using System.Web;
using System.Web.Script.Serialization;
using RestSharp;

namespace CodeVortoWebClientApplication
{
    /// <summary>
    /// Summary description for UserLogin
    /// </summary>
    public class UserLogin : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            string userName = context.Request.Params["TxtUserName"];
            string password = context.Request.Params["TxtPassword"];
            var client = new RestClient(context.Request.Url.Scheme + "://" + context.Request.Url.Host + ":8888");
            RestRequest request = new RestRequest("/api/UserMaster/UserLogin");
            var values = new UserMaster
                {
                    UserName = userName,
                    Password = password
                };
            string jsonData = request.JsonSerializer.Serialize(values);
            request.AddParameter("application/json; charset=utf-8", jsonData, ParameterType.RequestBody);
            var result = client.ExecuteAsPost(request, "POST");
            context.Response.Redirect("checklogin.html");
            if (result != null)
            {
                var data = result.Content;
                context.Response.ContentType = "application/json";
                context.Response.AddHeader("Response-Data", data);
                context.Response.Write(data);
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }

    public class UserMaster
    {
        public int? UserId { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
    }
}