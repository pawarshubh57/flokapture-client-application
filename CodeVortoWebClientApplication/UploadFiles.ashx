<%@ WebHandler Language="C#" Class="UploadFiles" %>

using System.Web;
using System.IO;

public class UploadFiles : IHttpHandler
{
    public void ProcessRequest(HttpContext context)
    {
        string targetFolder = HttpContext.Current.Server.MapPath("UploadFiles");
        if (!Directory.Exists(targetFolder)) 
        {
            Directory.CreateDirectory(targetFolder);
        }
        if (context.Request.UrlReferrer != null)
        {
            string requestPath = context.Request.UrlReferrer.AbsolutePath;
            HttpFileCollection uploadedFiles = context.Request.Files;
            if (uploadedFiles.Count > 0)
            {
                for (int i = 0; i < uploadedFiles.Count; i++)
                {
                    if (uploadedFiles[i].FileName != "")
                    {
                        context.Response.Write("<span id='successmsg'> Successfully uploaded</span>");
                        var file = context.Request.Files[i];
                        string strFileName = file.FileName;
                        string path = context.Server.MapPath("~/UploadedProjects/");
                        if (!Directory.Exists(path))
                            Directory.CreateDirectory(path);
                        var fileName = Path.Combine(path, strFileName);
                        file.SaveAs(fileName);
                        /*
                            using (var webClient = new WebClient())
                            {
                                var data = new NameValueCollection();
                                data["DocName"] = strFileName;
                                data["DocPath"] = fileName;
                                data["StepId"] = "1";
                                data["SubProcId"] = "Proc_1";

                                var response = webClient.UploadValues("http://192.168.0.15:5050/api/StepDetails/GetStatusByPostData", "POST", data);
                                var ss = response.AsString();
                                var s = ss;
                            }
                            */
                    }
                }
            }
            else
            {
                // only for Synchronous upload functionalities 
                if (requestPath.Contains("AdditionalSteps.html") || requestPath.Contains("saveFiles.ashx"))
                {
                    context.Response.Write("<span id='successmsg'> Select file to upload</span>");
                    context.Response.WriteFile("AdditionalSteps.html");
                }
            }
        }
    }

    public bool IsReusable
    {
        get { return false; }
    }
}